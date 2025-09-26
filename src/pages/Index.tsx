import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [currentStep, setCurrentStep] = useState<'login' | 'verify' | 'dashboard'>('login');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loanAmount, setLoanAmount] = useState([50000]);
  const [loanTerm, setLoanTerm] = useState([12]);
  const [loanPurpose, setLoanPurpose] = useState('');
  const [income, setIncome] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = () => {
    if (email) {
      setCurrentStep('verify');
    }
  };

  const handleVerify = () => {
    if (code) {
      setCurrentStep('dashboard');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleLoanSubmit = async () => {
    if (!loanPurpose || !income) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/8fa1fdc7-84f1-4dc7-bb98-061b57758137', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          amount: loanAmount[0],
          term_months: loanTerm[0],
          monthly_payment: Math.round(loanAmount[0] * 1.125 / loanTerm[0]),
          interest_rate: 12.5,
          purpose: loanPurpose,
          income: income,
          additional_info: additionalInfo
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        alert('Заявка успешно отправлена! Номер заявки: ' + result.application_id);
        // Reset form
        setLoanAmount([50000]);
        setLoanTerm([12]);
        setLoanPurpose('');
        setIncome('');
        setAdditionalInfo('');
        setActiveTab('dashboard');
      } else {
        alert('Ошибка отправки заявки: ' + (result.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      alert('Ошибка соединения: ' + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-semibold">Финансовые услуги</CardTitle>
            <CardDescription className="text-center">
              Введите email для входа в личный кабинет
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email адрес</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleLogin} className="w-full" disabled={!email}>
              <Icon name="Mail" className="mr-2 h-4 w-4" />
              Получить код подтверждения
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="KeyRound" className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-semibold">Проверка email</CardTitle>
            <CardDescription className="text-center">
              Код отправлен на {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Код подтверждения</Label>
              <Input
                id="code"
                type="text"
                placeholder="Введите 6-значный код"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
            </div>
            <Button onClick={handleVerify} className="w-full" disabled={!code}>
              <Icon name="LogIn" className="mr-2 h-4 w-4" />
              Войти в кабинет
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('login')} 
              className="w-full"
            >
              <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
              Назад
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Shield" className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Личный кабинет</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-sm">
              <Icon name="User" className="mr-1 h-3 w-3" />
              {email}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentStep('login')}
            >
              <Icon name="LogOut" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">
              <Icon name="Home" className="mr-2 h-4 w-4" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Icon name="User" className="mr-2 h-4 w-4" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="loan">
              <Icon name="CreditCard" className="mr-2 h-4 w-4" />
              Заявка
            </TabsTrigger>
            <TabsTrigger value="documents">
              <Icon name="FileText" className="mr-2 h-4 w-4" />
              Документы
            </TabsTrigger>
            <TabsTrigger value="support">
              <Icon name="MessageCircle" className="mr-2 h-4 w-4" />
              Поддержка
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Активные займы
                  </CardTitle>
                  <Icon name="TrendingUp" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Нет активных займов
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    История заявок
                  </CardTitle>
                  <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Заявок не подано
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Кредитный рейтинг
                  </CardTitle>
                  <Icon name="Star" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    Не рассчитан
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Статус верификации
                  </CardTitle>
                  <Icon name="Shield" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Не верифицирован</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
                <CardDescription>
                  Доступные операции в один клик
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                <Button 
                  className="justify-start h-12" 
                  variant="outline"
                  onClick={() => setActiveTab('loan')}
                >
                  <Icon name="Plus" className="mr-2 h-4 w-4" />
                  Подать заявку на займ
                </Button>
                <Button className="justify-start h-12" variant="outline">
                  <Icon name="Upload" className="mr-2 h-4 w-4" />
                  Загрузить документы
                </Button>
                <Button 
                  className="justify-start h-12" 
                  variant="outline"
                  onClick={() => setActiveTab('support')}
                >
                  <Icon name="MessageSquare" className="mr-2 h-4 w-4" />
                  Связаться с поддержкой
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Личные данные</CardTitle>
                <CardDescription>
                  Управление персональной информацией
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Имя</Label>
                    <Input id="firstName" placeholder="Введите имя" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Фамилия</Label>
                    <Input id="lastName" placeholder="Введите фамилию" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" placeholder="+7 (999) 123-45-67" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Дата рождения</Label>
                    <Input id="birthDate" type="date" />
                  </div>
                </div>
                <Button className="mt-4">
                  <Icon name="Save" className="mr-2 h-4 w-4" />
                  Сохранить изменения
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Заявка на займ</CardTitle>
                <CardDescription>
                  Заполните параметры займа для рассмотрения
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Сумма займа</Label>
                      <span className="text-lg font-semibold text-primary">
                        {formatCurrency(loanAmount[0])}
                      </span>
                    </div>
                    <Slider
                      value={loanAmount}
                      onValueChange={setLoanAmount}
                      max={500000}
                      min={10000}
                      step={5000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>10 000 ₽</span>
                      <span>500 000 ₽</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Срок займа</Label>
                      <span className="text-lg font-semibold text-primary">
                        {loanTerm[0]} мес.
                      </span>
                    </div>
                    <Slider
                      value={loanTerm}
                      onValueChange={setLoanTerm}
                      max={60}
                      min={3}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>3 месяца</span>
                      <span>60 месяцев</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Сумма займа:</span>
                    <span className="font-semibold">{formatCurrency(loanAmount[0])}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Срок:</span>
                    <span className="font-semibold">{loanTerm[0]} месяцев</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Примерная ставка:</span>
                    <span className="font-semibold">12.5% годовых</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg">
                    <span>Ежемесячный платеж:</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(Math.round(loanAmount[0] * 1.125 / loanTerm[0]))}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Цель займа</Label>
                    <Select value={loanPurpose} onValueChange={setLoanPurpose}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите цель" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Личные нужды</SelectItem>
                        <SelectItem value="business">Развитие бизнеса</SelectItem>
                        <SelectItem value="education">Образование</SelectItem>
                        <SelectItem value="medical">Медицинские услуги</SelectItem>
                        <SelectItem value="other">Другое</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="income">Ежемесячный доход</Label>
                    <Input 
                      id="income" 
                      placeholder="Укажите доход в рублях" 
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Дополнительная информация</Label>
                  <Textarea
                    id="comment"
                    placeholder="Расскажите дополнительную информацию о себе или цели займа"
                    rows={3}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleLoanSubmit}
                  disabled={isSubmitting || !loanPurpose || !income}
                >
                  <Icon name="Send" className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Отправляем...' : 'Подать заявку на рассмотрение'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Документы</CardTitle>
                <CardDescription>
                  Загрузка и просмотр документов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Icon name="Upload" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-600">
                    Загрузите документы
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Поддерживаются форматы: PDF, JPG, PNG
                  </p>
                  <Button className="mt-4">
                    <Icon name="Plus" className="mr-2 h-4 w-4" />
                    Выбрать файлы
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Требуемые документы:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="FileText" className="h-5 w-5 text-muted-foreground" />
                        <span>Паспорт (основная страница)</span>
                      </div>
                      <Badge variant="secondary">Не загружен</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="FileText" className="h-5 w-5 text-muted-foreground" />
                        <span>Справка о доходах</span>
                      </div>
                      <Badge variant="secondary">Не загружен</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="FileText" className="h-5 w-5 text-muted-foreground" />
                        <span>СНИЛС</span>
                      </div>
                      <Badge variant="secondary">Не загружен</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Связь с поддержкой</CardTitle>
                <CardDescription>
                  Получите помощь от наших специалистов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="supportTopic">Тема обращения</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тему" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="loan">Вопрос по займу</SelectItem>
                        <SelectItem value="account">Проблемы с аккаунтом</SelectItem>
                        <SelectItem value="documents">Загрузка документов</SelectItem>
                        <SelectItem value="payments">Платежи и расчеты</SelectItem>
                        <SelectItem value="other">Другое</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Приоритет</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите приоритет" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Низкий</SelectItem>
                        <SelectItem value="medium">Средний</SelectItem>
                        <SelectItem value="high">Высокий</SelectItem>
                        <SelectItem value="urgent">Срочно</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportMessage">Сообщение</Label>
                  <Textarea
                    id="supportMessage"
                    placeholder="Опишите вашу проблему или вопрос подробно"
                    rows={4}
                  />
                </div>

                <Button className="w-full">
                  <Icon name="Send" className="mr-2 h-4 w-4" />
                  Отправить обращение
                </Button>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Контактная информация:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="Phone" className="h-4 w-4 text-muted-foreground" />
                      <span>8 (800) 123-45-67</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Mail" className="h-4 w-4 text-muted-foreground" />
                      <span>support@finance.ru</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
                      <span>Пн-Пт: 9:00-18:00, Сб: 10:00-16:00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}