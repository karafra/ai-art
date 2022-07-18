import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry';
import { CouldNotGenerateArtException } from '../../../../exceptions/CouldNotGenerateArtException';
import { AiStoryModel } from '../../../../models/ai-story/ai-story.model';
import { Model } from '../../../../types/api/ai-story';
import { AiStoryService } from './ai-story.service';

describe('AiStoryService', () => {
  let service: AiStoryService;
  const mockAddBreadcrumb = jest.fn();
  const mockCaptureException = jest.fn();
  const mockSentryService = {
    instance: jest.fn(() => ({
      addBreadcrumb: mockAddBreadcrumb,
      captureException: mockCaptureException,
    })),
  };
  const mockConfigService = {
    get: jest.fn(),
  };
  const mockAiStoryModel = {
    getStory: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiStoryService,
        {
          provide: SENTRY_TOKEN,
          useValue: mockSentryService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: AiStoryModel,
          useValue: mockAiStoryModel,
        },
      ],
    }).compile();
    service = module.get<AiStoryService>(AiStoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStory', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should get story', async () => {
      const prompt = 'prompt';
      const story = 'story';
      mockAiStoryModel.getStory.mockResolvedValue(story);
      // When
      const response = await service.getArt(prompt);
      // Then
      expect(response).toBe(story);
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        level: 'debug',
        message: 'Story generation finished',
        category: 'Service',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        level: 'debug',
        message: 'Started story generation',
        category: 'Service',
      });
      expect(mockAiStoryModel.getStory).toBeCalledTimes(1);
      expect(mockAiStoryModel.getStory).toBeCalledWith(prompt, undefined);
    });

    it('Should get story with model', async () => {
      const prompt = 'prompt';
      const story = 'story';
      const model: Model = 'davinci';
      mockAiStoryModel.getStory.mockResolvedValue(story);
      // When
      const response = await service.getArt(prompt, model);
      // Then
      expect(response).toBe(story);
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        level: 'debug',
        message: 'Story generation finished',
        category: 'Service',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        level: 'debug',
        message: 'Started story generation',
        category: 'Service',
      });
      expect(mockAiStoryModel.getStory).toBeCalledTimes(1);
      expect(mockAiStoryModel.getStory).toBeCalledWith(prompt, model);
    });
    it('Should handle error', async () => {
      const prompt = 'prompt';
      const model: Model = 'davinci';
      const err = new Error('test error');
      mockAiStoryModel.getStory.mockImplementation(() => {
        throw err;
      });
      // When
      await expect(service.getArt(prompt, model)).rejects.toThrow(
        new CouldNotGenerateArtException(AiStoryService.name, prompt, model)
          .message,
      );
      // Then
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).not.toBeCalledWith({
        level: 'debug',
        message: 'Story generation finished',
        category: 'Service',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        level: 'debug',
        message: 'Started story generation',
        category: 'Service',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Service',
        level: 'error',
        message: `Failed to generate story ${prompt}`,
      });
      expect(mockAiStoryModel.getStory).toBeCalledTimes(1);
      expect(mockAiStoryModel.getStory).toBeCalledWith(prompt, model);
    });
  });
});
