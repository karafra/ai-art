import { Test, TestingModule } from '@nestjs/testing';
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry';
import { CouldNotGenerateArtException } from '../../../../exceptions/CouldNotGenerateArtException';
import { AiArtModel } from '../../../../models/ai-art/ai-art.model';
import { Collage } from '../../../../utilities/collage/collage';
import { AmqpService } from '../../../amqp/amqp.service';
import { DalleMiniService } from './dalle-mini.service';

describe('DalleMiniService', () => {
  let service: DalleMiniService;
  const mockImageArray = ['1', '1', '1', '1', '1', '1', '1', '1', '1'];
  const mockAddBreadcrumb = jest.fn();
  const mockSentryService = {
    instance: jest.fn(() => ({
      addBreadcrumb: mockAddBreadcrumb,
    })),
  };
  const mockAmqpService = {
    popFromQueue: jest.fn(),
    purgeQueue: jest.fn(),
    publishToQueue: jest.fn(),
  };
  const mockAiArtModel = {
    getImageArray: jest.fn(),
  };
  const mockCollage = {
    constructCollage: jest.fn(),
    getAsAttachment: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DalleMiniService,
        {
          provide: SENTRY_TOKEN,
          useValue: mockSentryService,
        },
        {
          provide: AiArtModel,
          useValue: mockAiArtModel,
        },
        {
          provide: Collage,
          useValue: mockCollage,
        },
        {
          provide: AmqpService,
          useValue: mockAmqpService,
        },
      ],
    }).compile();

    service = module.get<DalleMiniService>(DalleMiniService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getArt', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should getArt on first try', async () => {
      // Given
      const prompt = 'prompt';
      mockAmqpService.popFromQueue.mockResolvedValue([prompt]);
      mockAiArtModel.getImageArray.mockResolvedValue(mockImageArray);
      const attachment = 'attachment';
      mockCollage.getAsAttachment.mockReturnValue(attachment);
      // When
      const result = await service.getArt(prompt);
      // Then
      expect(result.attachment).toBe(attachment);
      expect(result.dbRecord.images).toBe(mockImageArray);
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Service',
        level: 'debug',
        message: `Started processing art for ${prompt}`,
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Service',
        level: 'debug',
        message: `Generated collage for ${prompt}`,
      });
      expect(mockCollage.constructCollage).toBeCalledTimes(1);
      expect(mockCollage.constructCollage).toBeCalledWith(mockImageArray);
      expect(mockCollage.getAsAttachment).toBeCalledTimes(1);
      expect(mockAmqpService.popFromQueue).toBeCalledTimes(1);
      expect(mockAmqpService.purgeQueue).toBeCalledTimes(1);
      expect(mockAmqpService.purgeQueue).toBeCalledWith(DalleMiniService.name);
      expect(mockAmqpService.publishToQueue).toBeCalledTimes(1);
      expect(mockAmqpService.publishToQueue).toBeCalledWith(
        DalleMiniService.name,
        [prompt],
      );
    });
    it('Should getArt on 29th try', async () => {
      // Given
      const prompt = 'prompt';
      const attachment = 'attachment';
      let i = 0;
      mockAiArtModel.getImageArray.mockImplementation(() => {
        if (i == 29) {
          return mockImageArray;
        }
        ++i;
        throw new Error('test error');
      });
      mockCollage.getAsAttachment.mockReturnValue(attachment);
      // When
      const result = await service.getArt(prompt);
      // Then
      expect(result.attachment).toBe(attachment);
      expect(result.dbRecord.images).toBe(mockImageArray);
      expect(mockAddBreadcrumb).toBeCalledTimes(31);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Service',
        level: 'debug',
        message: `Started processing art for ${prompt}`,
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Service',
        level: 'debug',
        message: `Generated collage for ${prompt}`,
      });
      expect(mockCollage.constructCollage).toBeCalledTimes(1);
      expect(mockCollage.constructCollage).toBeCalledWith(mockImageArray);
      expect(mockCollage.getAsAttachment).toBeCalledTimes(1);
    }, 93_000);
    it('Should not getArt on 30th try', async () => {
      // Given
      const prompt = 'prompt';
      const attachment = 'attachment';
      let i = 0;
      mockAiArtModel.getImageArray.mockImplementation(() => {
        if (i == 31) {
          return mockImageArray;
        }
        ++i;
        throw new Error('test error');
      });
      mockCollage.getAsAttachment.mockResolvedValue(attachment);
      // When
      await expect(service.getArt(prompt)).rejects.toThrow(
        new CouldNotGenerateArtException(DalleMiniService.name, prompt).message,
      );
      // Then
      expect(mockAddBreadcrumb).toBeCalledTimes(32);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Service',
        level: 'debug',
        message: `Started processing art for ${prompt}`,
      });
      expect(mockAddBreadcrumb).not.toBeCalledWith({
        category: 'Service',
        level: 'debug',
        message: `Generated collage for ${prompt}`,
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        level: 'error',
        category: 'Service',
        message: `Could not generate art for ${prompt}.`,
      });
      expect(mockCollage.constructCollage).toBeCalledTimes(0);
      expect(mockCollage.getAsAttachment).toBeCalledTimes(0);
    }, 93_000);
  });
});
