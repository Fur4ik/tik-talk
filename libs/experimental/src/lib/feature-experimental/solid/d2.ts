export interface BaseNotificationService{
  sendNotification(userId: number, message: string): void;
}

export class EmailNotificationService implements BaseNotificationService{
  sendNotification(userId: number, message: string): void {
    console.log(`email notification sent: ${message} to user ${userId}`);
  }
}

export class SmsNotificationService implements BaseNotificationService{
  sendNotification(userId: number, message: string): void {
    console.log(`sms notification sent: ${message} to user ${userId}`);
  }
}
