import { BaseNotificationService, EmailNotificationService, SmsNotificationService } from './d2'

interface Order {
  userId: number,
  name: string,
}

class OrderManager{
  private notificationService: BaseNotificationService

  constructor(notificationService: BaseNotificationService){
    this.notificationService = notificationService;
  }

  createOrder(order: Order){}

  calculateOrder(order: Order){}

  saveOrder(order: Order){
    this.notificationService.sendNotification(order.userId, 'all is good')
  }
}


const firstOrder: Order = {userId: 52, name: 'blinchici'}

const emailNotificationService: EmailNotificationService = new EmailNotificationService();
const smsNotificationService: SmsNotificationService = new SmsNotificationService();

const om = new OrderManager(smsNotificationService);

om.saveOrder(firstOrder);
