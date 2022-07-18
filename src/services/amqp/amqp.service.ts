import { AmqpClient, InjectAmqpClient } from '@karafra/nestjs-amqp';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AmqpService {
  private lastDispatch: number = Date.now();
  public constructor(
    @InjectAmqpClient() private readonly amqpClient: AmqpClient,
  ) {}

  /**
   * Softly purges queue.
   *
   * @param queueName name of queue to purge
   */
  public async purgeQueue(queueName: string): Promise<void> {
    const channel = await this.amqpClient.channel();
    // Ensures queue is present
    channel.queue(queueName);
    await channel.queuePurge(queueName);
    await channel.close('Service stopped', 320);
  }

  public async popFromQueue<T>(queueName: string): Promise<T> {
    const timeout = 3000;
    if (!(Date.now() - this.lastDispatch > timeout)) {
      const timePassed = Date.now() - this.lastDispatch;
      await new Promise((resolve) => setTimeout(resolve, timePassed));
    }

    const channel = await this.amqpClient.channel();
    const queue = await channel?.queue(queueName);
    const message = await queue?.get({ noAck: true });
    await channel.close('Service stopped', 320);
    return JSON.parse(message?.bodyToString() as string).data;
  }

  public async publishToQueue<T>(queueName: string, item: T): Promise<T> {
    const channel = await this.amqpClient.channel();
    const queue = await channel.queue(queueName, { autoDelete: false });
    await queue?.publish(JSON.stringify({ data: item }), { deliveryMode: 2 });
    channel.close('Service stopped', 320);
    return item;
  }
}
