import { Test, TestingModule } from '@nestjs/testing';
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry';
import { CogView2Model } from '../../../../models/cog-view-2/cog-view-2.model';
import { Style } from '../../../../types/api/cogView2';
import { Collage } from '../../../../utilities/collage/collage';
import { AmqpService } from '../../../amqp/amqp.service';
import { CogView2Service } from './cog-view-2.service';

describe('CogView2Service', () => {
  let service: CogView2Service;
  const mockImageArray = ['1', '1', '1', '1', '1', '1', '1', '1', '1'];
  const mockAddBreadcrumb = jest.fn();
  const mockCaptureException = jest.fn();
  const mockSentryService = {
    instance: jest.fn(() => ({
      addBreadcrumb: mockAddBreadcrumb,
      captureException: mockCaptureException,
    })),
  };
  const mockCollage = {
    constructCollage: jest.fn(),
    getAsAttachment: jest.fn(),
  };
  const mockCogView2Model = {
    getImageArray: jest.fn().mockReturnValue(mockImageArray),
  };
  const mockAmqpService = {
    popFromQueue: jest.fn(),
    purgeQueue: jest.fn(),
    publishToQueue: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CogView2Service,
        {
          provide: CogView2Model,
          useValue: mockCogView2Model,
        },
        {
          provide: Collage,
          useValue: mockCollage,
        },
        {
          provide: SENTRY_TOKEN,
          useValue: mockSentryService,
        },
        {
          provide: AmqpService,
          useValue: mockAmqpService,
        },
      ],
    }).compile();

    service = module.get<CogView2Service>(CogView2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getArt', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should create art', async () => {
      // Given
      const prompt = 'prompt';
      mockAmqpService.popFromQueue.mockResolvedValue([prompt, undefined]);
      const attachment = 'attachment';
      mockCollage.getAsAttachment.mockReturnValue(attachment);
      // When
      const response = await service.getArt(prompt);
      // Then
      expect(response.attachment).toBe(attachment);
      expect(response.dbRecord.images).toBe(mockImageArray);
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        level: 'debug',
        message: 'Image generation finished',
        category: 'Service',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        level: 'debug',
        category: 'Service',
        message: 'Started collage generation',
      });
      expect(mockCaptureException).not.toBeCalled();
      expect(mockAmqpService.popFromQueue).toBeCalledTimes(1);
      expect(mockAmqpService.purgeQueue).toBeCalledTimes(1);
      expect(mockAmqpService.purgeQueue).toBeCalledWith(CogView2Service.name);
      expect(mockAmqpService.publishToQueue).toBeCalledTimes(1);
      expect(mockAmqpService.publishToQueue).toBeCalledWith(
        CogView2Service.name,
        [prompt],
      );
      expect(mockCogView2Model.getImageArray).toBeCalledTimes(1);
      expect(mockCogView2Model.getImageArray).toBeCalledWith(prompt, undefined);
    });
    it('Should create art with style', async () => {
      // Given
      const prompt = 'prompt';
      const style: Style = 'flat';
      mockAmqpService.popFromQueue.mockResolvedValue([prompt, style]);
      const attachment = 'attachment';
      mockCollage.getAsAttachment.mockReturnValue(attachment);
      // When
      const response = await service.getArt(prompt, style);
      // Then
      expect(response.dbRecord.images).toBe(mockImageArray);
      expect(response.attachment).toBe(attachment);
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        level: 'debug',
        message: 'Image generation finished',
        category: 'Service',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        level: 'debug',
        category: 'Service',
        message: 'Started collage generation',
      });
      expect(mockAmqpService.popFromQueue).toBeCalledTimes(1);
      expect(mockAmqpService.purgeQueue).toBeCalledTimes(0);
      expect(mockAmqpService.publishToQueue).toBeCalledTimes(1);
      expect(mockCaptureException).not.toBeCalled();
      expect(mockCogView2Model.getImageArray).toBeCalledTimes(1);
      expect(mockCogView2Model.getImageArray).toBeCalledWith(prompt, style);
    });

    it('Should handle error', async () => {
      // Given
      const prompt = 'prompt';
      mockAmqpService.popFromQueue.mockResolvedValue([prompt, undefined]);
      const ex = new Error('Test error');
      mockCogView2Model.getImageArray.mockImplementation(() => {
        throw ex;
      });
      // When
      await expect(service.getArt(prompt)).rejects.toThrow(
        'Could not generate art "prompt" based on CogView2Service',
      );
      // Then
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        level: 'error',
        message: `Failed to generate art ${prompt}`,
        category: 'Service',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        level: 'debug',
        category: 'Service',
        message: 'Started collage generation',
      });
      expect(mockAmqpService.popFromQueue).toBeCalledTimes(1);
      expect(mockAmqpService.purgeQueue).toBeCalledTimes(0);
      expect(mockAmqpService.publishToQueue).toBeCalledTimes(1);
      expect(mockCaptureException).not.toBeCalled();
      expect(mockCogView2Model.getImageArray).toBeCalledTimes(1);
      expect(mockCogView2Model.getImageArray).toBeCalledWith(prompt, undefined);
    });
  });
});
