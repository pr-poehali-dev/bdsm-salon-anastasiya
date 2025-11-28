import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const services = [
  { 
    id: '1', 
    name: 'Классический сеанс', 
    duration: '60 минут', 
    price: '15 000 ₽',
    description: 'Использование пассатижей и других инструментов'
  },
  { 
    id: '2', 
    name: 'Расширенный сеанс', 
    duration: '90 минут', 
    price: '22 000 ₽',
    description: 'Работа с напильниками, ножницами и дрелью'
  },
  { 
    id: '3', 
    name: 'VIP сеанс', 
    duration: '120 минут', 
    price: '30 000 ₽',
    description: 'Полный набор инструментов: пассатижи, напильники, ножницы. Включает маникюр всего тела с профессиональной бензопилой'
  },
  { 
    id: '5', 
    name: 'Консультация', 
    duration: '30 минут', 
    price: '5 000 ₽',
    description: 'Обсуждение предпочтений и инструментов'
  },
];

const timeSlots = [
  '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
];

export default function Index() {
  const [date, setDate] = useState<Date>();
  const [selectedService, setSelectedService] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedService || !selectedTime || !name || !phone) {
      toast({
        title: "Заполните все поля",
        description: "Пожалуйста, укажите все необходимые данные для записи",
        variant: "destructive",
      });
      return;
    }

    const selectedServiceData = services.find(s => s.id === selectedService);
    
    try {
      const response = await fetch('https://functions.poehali.dev/309c1adf-a889-4989-80aa-dc071ae6902d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: selectedService,
          serviceName: selectedServiceData?.name || '',
          date: format(date, 'yyyy-MM-dd'),
          time: selectedTime,
          name: name,
          phone: phone,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке записи');
      }

      toast({
        title: "Запись успешно отправлена",
        description: `Анастасия свяжется с вами в ближайшее время для подтверждения`,
      });

      setDate(undefined);
      setSelectedService('');
      setSelectedTime('');
      setName('');
      setPhone('');
      setMessage('');
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://cdn.poehali.dev/projects/3a10c3d6-d52d-4c3d-a7d5-84b39780e12b/files/c710620a-9a74-463c-b30f-2b80691d1aef.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        
        <div className="relative z-10 text-center max-w-4xl px-6 animate-fade-in">
          <h1 className="text-7xl md:text-8xl font-light mb-6 tracking-wide">
            Анастасия
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground font-light mb-8 tracking-wide">
            Приватное пространство
          </p>
          <div className="flex gap-4 justify-center items-center">
            <div className="w-24 h-px bg-primary/50 animate-glow" />
            <Icon name="Sparkles" size={20} className="text-primary animate-glow" />
            <div className="w-24 h-px bg-primary/50 animate-glow" />
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={32} className="text-muted-foreground" />
        </div>
      </div>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-12 flex justify-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/20">
                <img 
                  src="https://cdn.poehali.dev/files/18373b55-6d15-4583-9b44-351f0bad941f.jpg" 
                  alt="Анастасия" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h2 className="text-5xl font-light mb-6">Услуги</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Индивидуальный подход и полная конфиденциальность
            </p>
            <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mt-4">
              В работе использую профессиональные инструменты: пассатижи, напильники и ножницы
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-2xl font-light mb-3">{service.name}</h3>
                <div className="space-y-2 text-muted-foreground mb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={16} />
                    <span>{service.duration}</span>
                  </div>
                  <p className="text-sm mt-2">{service.description}</p>
                </div>
                <div className="text-xl text-primary font-semibold mt-4">
                  {service.price}
                </div>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="p-8 md:p-12 bg-card border-border">
              <h2 className="text-4xl font-light mb-8 text-center">Записаться на сеанс</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="service">Выберите услугу</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Выберите услугу" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} — {service.duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Выберите дату</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Icon name="CalendarDays" size={16} className="mr-2" />
                        {date ? format(date, 'PPP', { locale: ru }) : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Выберите время</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Выберите время" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ваше имя</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Как к вам обращаться"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Дополнительная информация</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Особые пожелания или вопросы (необязательно)"
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full text-lg py-6 bg-primary hover:bg-primary/90 transition-all"
                >
                  Отправить заявку
                  <Icon name="Send" size={18} className="ml-2" />
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Ваши данные защищены и не передаются третьим лицам
                </p>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            Работаю ежедневно с 10:00 до 23:00
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>Химки, конфиденциальный адрес</span>
            <span>•</span>
            <span>Только по предварительной записи</span>
          </div>
        </div>
      </footer>
    </div>
  );
}