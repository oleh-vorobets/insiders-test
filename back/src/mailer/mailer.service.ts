import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

interface IMailOptions {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  async sendEmail(mailOptions: IMailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail(mailOptions);
      console.log(`Email sent to ${mailOptions.to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
