import { environment } from '@Utils/environment'
import { AMQPChannel, AMQPClient } from '@cloudamqp/amqp-client'
import { AMQPBaseClient } from '@cloudamqp/amqp-client/types/amqp-base-client'

/**
 * RabbitMQ service for queueing jobs.
 *
 * @author Karafra
 * @since 1.5.0
 */
export class RabbitMqService extends AMQPClient {
  public connection?: AMQPBaseClient
  private lastDispatch: number = Date.now()

  public constructor() {
    super(environment.rabbitMqUrl)
    this.connection = undefined
  }

  /**
   * Connects to RabbitMq instance.
   *
   * @returns Rabbit mq instance
   */
  public async connectToInstance(): Promise<AMQPBaseClient> {
    this.connection = await this.connect()
    return this.connection
  }

  /**
   * Pushes item to queue.
   *
   * @param queueName name of queue
   * @param item item to push
   * @returns item pushed
   */
  public async publishToQueue<T>(queueName: string, item: T): Promise<T> {
    if (!this.connection) {
      await this.connectToInstance()
    }
    const channel = (await this.connection?.channel()) as AMQPChannel
    const queue = await channel.queue(queueName, { autoDelete: false })
    await queue?.publish(JSON.stringify({ data: item }), { deliveryMode: 2 })
    return item
  }

  /**
   * Gets first item from queue.
   *
   * @param queueName name of queue
   * @returns first item in queue
   */
  public async popFromQueue<T>(queueName: string): Promise<T> {
    if (!this.connection) {
      await this.connectToInstance()
    }

    if (!(Date.now() - this.lastDispatch > environment.queueTimeout)) {
      const timePassed = Date.now() - this.lastDispatch
      await new Promise((resolve) => setTimeout(resolve, environment.queueTimeout - timePassed))
    }

    const channel = await this.connection?.channel()
    const queue = await channel?.queue(queueName)
    const message = await queue?.get({ noAck: true })
    return JSON.parse(message?.bodyToString() as string).data
  }

  public async purgeQueue(queueName: string) {
    if (!this.connection) {
      await this.connectToInstance()
    }

    this.connection?.channels.forEach(async (channel) => {
      await channel.queuePurge(queueName)
    })
  }
}

export const rabbitMqService = new RabbitMqService()
