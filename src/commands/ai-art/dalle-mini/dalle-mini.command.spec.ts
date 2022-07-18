import { TransformedCommandExecutionContext } from '@discord-nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry';
import { DalleMiniService } from '../../../services/commands/art/dalle-mini/dalle-mini.service';
import { DalleMiniCommand } from './dalle-mini.command';
import { DalleMiniCommandDto } from './dalle-mini.dto';

describe('AiArtService', () => {
  let service: DalleMiniCommand;
  const mockAddBreadcrumb = jest.fn();
  const mockCaptureException = jest.fn();
  const mockSentryService = {
    instance: jest.fn(() => ({
      addBreadcrumb: mockAddBreadcrumb,
      captureException: mockCaptureException,
    })),
  };
  const mockCogView2Service = {
    getArt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DalleMiniCommand,
        {
          provide: SENTRY_TOKEN,
          useValue: mockSentryService,
        },
        {
          provide: DalleMiniService,
          useValue: mockCogView2Service,
        },
      ],
    }).compile();

    service = module.get<DalleMiniCommand>(DalleMiniCommand);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('handler', () => {
    const dto = new DalleMiniCommandDto();
    const prompt = 'prompt';
    const id = 'id';
    const mockExecutionContext = {
      interaction: {
        deleteReply: jest.fn(),
        followUp: jest.fn(),
        deferReply: jest.fn(),
        user: {
          id,
        },
        channel: {
          send: jest.fn(),
        },
      },
    } as any as TransformedCommandExecutionContext;
    beforeEach(() => {
      jest.clearAllMocks();
      dto.prompt = prompt;
    });
    it('Should generate art', async () => {
      // Given
      const art = 'art';
      mockCogView2Service.getArt.mockResolvedValue(art);
      // When
      await service.handler(dto, mockExecutionContext);
      // Then
      expect(mockExecutionContext.interaction.deleteReply).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.channel.send).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.channel.send).toBeCalledWith({
        files: [art],
        content: expect.any(String),
      });
      expect(mockCogView2Service.getArt).toBeCalledTimes(1);
      expect(mockCogView2Service.getArt).toBeCalledWith(dto.prompt);
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: '/ai-art dalle-mini command called',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: 'dalle-mini collage generated',
      });
    });
    it('Should handle error', async () => {
      // Given
      const error = new Error('test error');
      mockCogView2Service.getArt.mockImplementation(() => {
        throw error;
      });
      // When
      await service.handler(dto, mockExecutionContext);
      // Then
      expect(mockAddBreadcrumb).toBeCalledTimes(1);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: '/ai-art dalle-mini command called',
      });
      expect(mockExecutionContext.interaction.deleteReply).not.toBeCalled();
      expect(mockExecutionContext.interaction.channel.send).not.toBeCalled();
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
      expect(mockCaptureException).toBeCalledWith(error);
      expect(mockExecutionContext.interaction.followUp).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.followUp).toBeCalledWith(
        expect.any(String),
      );
    });
  });
});
