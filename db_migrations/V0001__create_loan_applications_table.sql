CREATE TABLE IF NOT EXISTS loan_applications (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    term_months INTEGER NOT NULL,
    monthly_payment INTEGER NOT NULL,
    interest_rate DECIMAL(4,2) DEFAULT 12.5,
    purpose VARCHAR(100),
    income VARCHAR(100),
    additional_info TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);