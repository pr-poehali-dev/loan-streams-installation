import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Submit loan application to database
    Args: event - dict with httpMethod, body containing loan application data
          context - object with attributes: request_id, function_name
    Returns: HTTP response with submission status
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Parse request body
    try:
        body_data = json.loads(event.get('body', '{}'))
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid JSON'})
        }
    
    # Validate required fields
    required_fields = ['email', 'amount', 'term_months', 'monthly_payment']
    for field in required_fields:
        if field not in body_data:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'Missing required field: {field}'})
            }
    
    # Connect to database
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        
        # Insert loan application
        insert_query = '''
        INSERT INTO loan_applications 
        (email, amount, term_months, monthly_payment, interest_rate, purpose, income, additional_info, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        '''
        
        cursor.execute(insert_query, (
            body_data['email'],
            int(body_data['amount']),
            int(body_data['term_months']),
            int(body_data['monthly_payment']),
            float(body_data.get('interest_rate', 12.5)),
            body_data.get('purpose'),
            body_data.get('income'),
            body_data.get('additional_info'),
            'pending'
        ))
        
        application_id = cursor.fetchone()[0]
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'application_id': application_id,
                'status': 'pending',
                'message': 'Заявка успешно отправлена на рассмотрение'
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()