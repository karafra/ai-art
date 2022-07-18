import { Inject } from '@nestjs/common';
import { AmqpService } from '../services/amqp/amqp.service';

const purgedQueues = [] as string[];

export function Queued(queueName: string) {
  // injector decorator
  // same as putting @Inject(CACHE_MANAGER) in constructor
  const injector = Inject(AmqpService);

  return (
    target: any,
    _key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    injector(target, 'amqpService');
    const method = descriptor.value as (...args: any[]) => any;
    descriptor.value = async function (...args: any[]) {
      const service: AmqpService = this.amqpService;
      if (purgedQueues.indexOf(queueName) === -1) {
        await service.purgeQueue(queueName);
        purgedQueues.push(queueName);
      }

      await service.publishToQueue(queueName, args);
      const dequeuedArgs = await service.popFromQueue<any[]>(queueName);
      return method.apply(this, dequeuedArgs);
    };
    return descriptor;
  };
}
