import { AMQP_CLIENT } from '@karafra/nestjs-amqp';
import { Test, TestingModule } from '@nestjs/testing';
import { AmqpService } from './amqp.service';

describe('AmqpService', () => {
  let service: AmqpService;
  const mockAmqpMessage = {
    bodyToString: jest.fn(),
  };
  const mockAmqpQueue = {
    publish: jest.fn(),
    get: jest.fn().mockResolvedValue(mockAmqpMessage),
  };
  const mockAmqpChannel = {
    queuePurge: jest.fn(),
    close: jest.fn(),
    queue: jest.fn().mockResolvedValue(mockAmqpQueue),
  };
  const mockAmqpService = {
    channel: jest.fn().mockResolvedValue(mockAmqpChannel),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AmqpService,
        {
          provide: AMQP_CLIENT,
          useValue: mockAmqpService,
        },
      ],
    }).compile();

    service = module.get<AmqpService>(AmqpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('popFromQueue', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should pop form queue', async () => {
      // Given
      const queue = 'queue';
      const item = '{"data": {"item": "item"}}';
      mockAmqpMessage.bodyToString.mockReturnValue(item);
      // When
      const value = await service.popFromQueue(queue);
      // Then
      expect(value).toStrictEqual(JSON.parse(item).data);
      expect(mockAmqpChannel.queue).toBeCalledTimes(1);
      expect(mockAmqpChannel.queue).toBeCalledWith(queue);
      expect(mockAmqpQueue.get).toBeCalledTimes(1);
      expect(mockAmqpQueue.get).toBeCalledWith({ noAck: true });
      expect(mockAmqpChannel.close).toBeCalledTimes(1);
      expect(mockAmqpChannel.close).toBeCalledWith('Service stopped', 320);
      expect(mockAmqpService.channel).toBeCalledTimes(1);
      expect(mockAmqpMessage.bodyToString).toBeCalledTimes(1);
    });
  });
  describe('publishToQueue', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should publish to queue', async () => {
      // Given
      const queue = 'queue';
      const item = {
        item: 'item',
      };
      // When
      const result = await service.publishToQueue(queue, item);
      // Then
      expect(result).toBe(item);
      expect(mockAmqpService.channel).toBeCalledTimes(1);
      expect(mockAmqpChannel.queue).toBeCalledTimes(1);
      expect(mockAmqpChannel.queue).toBeCalledWith(queue, {
        autoDelete: false,
      });
      expect(mockAmqpQueue.publish).toBeCalledTimes(1);
      expect(mockAmqpQueue.publish).toBeCalledWith(
        JSON.stringify({ data: item }),
        { deliveryMode: 2 },
      );
      expect(mockAmqpChannel.close).toBeCalledTimes(1);
      expect(mockAmqpChannel.close).toBeCalledWith('Service stopped', 320);
    });
  });
  describe('purgeQueue', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should purge queue', async () => {
      // Given
      const queue = 'queue';
      // When
      await service.purgeQueue(queue);
      // Then
      expect(mockAmqpService.channel).toBeCalledTimes(1);
      expect(mockAmqpChannel.queuePurge).toBeCalledTimes(1);
      expect(mockAmqpChannel.queuePurge).toBeCalledWith(queue);
      expect(mockAmqpChannel.close).toBeCalledTimes(1);
    });
  });
});
