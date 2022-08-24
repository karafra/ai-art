import { Test, TestingModule } from '@nestjs/testing';
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry';
import { JobResolver } from '../../../entity/job/job.resolver';
import { DalleMiniService } from '../../../services/commands/art/dalle-mini/dalle-mini.service';
import { DalleMiniCommand } from './dalle-mini.command';
import { DalleMiniCommandDto } from './dalle-mini.dto';

describe('AiArtService', () => {
  let service: DalleMiniCommand;
  const mockImageArray = ['1', '1', '1', '1', '1', '1', '1', '1', '1'];
  const mockAddBreadcrumb = jest.fn();
  const mockCaptureException = jest.fn();
  const mockSentryService = {
    instance: jest.fn(() => ({
      addBreadcrumb: mockAddBreadcrumb,
      captureException: mockCaptureException,
    })),
  };
  const mockDalleMiniService = {
    getArt: jest.fn(),
  };
  const mockJobResolver = {
    create: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DalleMiniCommand,
        {
          provide: JobResolver,
          useValue: mockJobResolver,
        },
        {
          provide: SENTRY_TOKEN,
          useValue: mockSentryService,
        },
        {
          provide: DalleMiniService,
          useValue: mockDalleMiniService,
        },
      ],
    }).compile();

    service = await module.get<DalleMiniCommand>(DalleMiniCommand);
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
    };
    beforeEach(() => {
      jest.clearAllMocks();
      dto.prompt = prompt;
    });
    it('Should generate art', async () => {
      // Given
      const art = {
        dbRecord: {
          images: mockImageArray,
        },
        attachment: 'attachment',
      };
      const mockMessage = {
        id: 'id',
        url: 'url',
      };
      mockDalleMiniService.getArt.mockResolvedValue(art);
      mockExecutionContext.interaction.channel.send.mockResolvedValue(
        mockMessage,
      );
      // When
      await service.handler(dto, mockExecutionContext as any);
      // Then
      expect(mockJobResolver.create).toBeCalledTimes(1);
      expect(mockJobResolver.create).toBeCalledWith({
        ...art.dbRecord,
        messageId: mockMessage.id,
        messageLink: mockMessage.url,
      });
      expect(mockExecutionContext.interaction.deleteReply).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.channel.send).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.channel.send).toBeCalledWith({
        files: [art.attachment],
        content: expect.any(String),
      });
      expect(mockDalleMiniService.getArt).toBeCalledTimes(1);
      expect(mockDalleMiniService.getArt).toBeCalledWith(dto.prompt);
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
      mockDalleMiniService.getArt.mockImplementation(() => {
        throw error;
      });
      // When
      await service.handler(dto, mockExecutionContext as any);
      // Then
      expect(mockJobResolver.create).toBeCalledTimes(0);
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
    it('Should handle database error', async () => {
      // Given
      const error = new Error('test error');
      mockJobResolver.create.mockImplementation(() => {
        throw error;
      });
      const art = {
        dbRecord: {
          images: mockImageArray,
        },
        attachment: 'attachment',
      };
      const mockMessage = {
        id: 'id',
        url: 'url',
      };
      mockExecutionContext.interaction.channel.send.mockResolvedValue(
        mockMessage,
      );
      mockDalleMiniService.getArt.mockResolvedValue(art);
      // When
      await service.handler(dto, mockExecutionContext as any);
      // Then
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
      expect(mockCaptureException).toBeCalledWith(error);
      expect(mockJobResolver.create).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.deleteReply).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.channel.send).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.followUp).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.followUp).toBeCalledWith(
        expect.any(String),
      );
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
  });
});
