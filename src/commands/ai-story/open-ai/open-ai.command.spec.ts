import { TransformedCommandExecutionContext } from '@discord-nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry';
import { AiStoryService } from '../../../services/commands/story/ai-story/ai-story.service';
import { OpenAiCommand } from './open-ai.command';
import { Model, OpenAiCommandDto } from './open-ai.dto';

describe('OpenAiService', () => {
  let service: OpenAiCommand;
  const mockAddBreadcrumb = jest.fn();
  const mockCaptureException = jest.fn();
  const mockSentryService = {
    instance: jest.fn(() => ({
      addBreadcrumb: mockAddBreadcrumb,
      captureException: mockCaptureException,
    })),
  };
  const mockAiStoryService = {
    getArt: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenAiCommand,
        {
          provide: SENTRY_TOKEN,
          useValue: mockSentryService,
        },
        {
          provide: AiStoryService,
          useValue: mockAiStoryService,
        },
      ],
    }).compile();

    service = await module.get<OpenAiCommand>(OpenAiCommand);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handler', () => {
    const dto = new OpenAiCommandDto();
    const headline = 'headline';
    const id = 'id';
    const model = Model.DAVINCI;
    const mockExecutionContext = {
      interaction: {
        deleteReply: jest.fn(),
        followUp: jest.fn(),
        deferReply: jest.fn(),
        user: {
          id,
        },
      },
    } as any as TransformedCommandExecutionContext;

    beforeEach(() => {
      jest.clearAllMocks();
      dto.headline = headline;
      dto.model = model;
    });
    it('Should generate art without model', async () => {
      const story = 'story';
      dto.model = undefined;
      mockAiStoryService.getArt.mockResolvedValue(story);
      // When
      await service.handler(dto, mockExecutionContext);
      // Then
      expect(mockExecutionContext.interaction.deferReply).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.followUp).toBeCalledWith(story);
      expect(mockAiStoryService.getArt).toBeCalledTimes(1);
      expect(mockAiStoryService.getArt).toBeCalledWith(dto.headline, undefined);
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: '/ai-story open-ai command called',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: '/ai-story open-ai story generated',
      });
    });
    it('Should generate art', async () => {
      const story = 'story';
      mockAiStoryService.getArt.mockResolvedValue(story);
      // When
      await service.handler(dto, mockExecutionContext);
      // Then
      expect(mockExecutionContext.interaction.deferReply).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.followUp).toBeCalledWith(story);
      expect(mockAiStoryService.getArt).toBeCalledTimes(1);
      expect(mockAiStoryService.getArt).toBeCalledWith(dto.headline, model);
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: '/ai-story open-ai command called',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: '/ai-story open-ai story generated',
      });
    });
    it('Should handle error', async () => {
      const err = new Error('test error');
      mockAiStoryService.getArt.mockImplementation(() => {
        throw err;
      });
      // When
      await service.handler(dto, mockExecutionContext);
      // Then
      expect(mockExecutionContext.interaction.deferReply).toBeCalledTimes(1);
      expect(mockAiStoryService.getArt).toBeCalledTimes(1);
      expect(mockAiStoryService.getArt).toBeCalledWith(dto.headline, model);
      expect(mockAddBreadcrumb).toBeCalledTimes(1);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: '/ai-story open-ai command called',
      });
      expect(mockCaptureException).toBeCalledTimes(1);
      expect(mockCaptureException).toBeCalledWith(err);
    });
  });
});
