import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('email-queue')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`[Email-Queue] Processing job ${job.id} of type ${job.name}`);

    const { to, subject, template, context } = job.data;

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
      console.log(`[Email-Queue] Email sent to ${to}`);
    } catch (error) {
      console.error(`[Email-Queue] Failed to send email to ${to}`, error);
      // 실패 시 재시도 로직 등을 추가할 수 있음
      throw error;
    }
  }
}
