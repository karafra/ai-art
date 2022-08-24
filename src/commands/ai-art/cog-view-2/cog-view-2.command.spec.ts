import { Test, TestingModule } from '@nestjs/testing';
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry';
import { JobResolver } from '../../../entity/job/job.resolver';
import { CogView2Service } from '../../../services/commands/art/cog-view-2/cog-view-2.service';
import { CogView2Command } from './cog-view-2.command';
import { CogView2CommandDto, Style } from './cog-view-2.dto';

describe('CogView2Service', () => {
  let service: CogView2Command;
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
  const mockJobResolver = {
    create: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CogView2Command,
        {
          provide: SENTRY_TOKEN,
          useValue: mockSentryService,
        },
        {
          provide: CogView2Service,
          useValue: mockCogView2Service,
        },
        {
          provide: JobResolver,
          useValue: mockJobResolver,
        },
      ],
    }).compile();

    service = await module.get<CogView2Command>(CogView2Command);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handler', () => {
    const dto = new CogView2CommandDto();
    const prompt = 'prompt';
    const id = 'id';
    const style: Style = Style.FLAT;
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
      dto.style = style;
    });
    it('Should generate art', async () => {
      // Given
      const dbId = 'dbId';
      const art = {
        dbRecord: {
          _id: dbId,
        },
        attachment: 'attachment',
      };
      const mockMessage = {
        id: 'id',
        url: 'url',
      };
      mockCogView2Service.getArt.mockResolvedValue(art);
      mockExecutionContext.interaction.channel.send.mockResolvedValue(
        mockMessage,
      );
      // When
      await service.handler(dto, mockExecutionContext as any);
      // Then
      expect(mockExecutionContext.interaction.deleteReply).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.channel.send).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.channel.send).toBeCalledWith({
        files: [art.attachment],
        content: expect.any(String),
      });
      expect(mockCogView2Service.getArt).toBeCalledTimes(1);
      expect(mockCogView2Service.getArt).toBeCalledWith(dto.prompt, dto.style);
      expect(mockJobResolver.create).toBeCalledTimes(1);
      expect(mockJobResolver.create).toBeCalledWith({
        ...art.dbRecord,
        messageId: mockMessage.id,
        messageLink: mockMessage.url,
      });
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: '/ai-art cog-view-2 command called',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: 'cogView2 collage generated',
      });
    });
    it('Should generate art without style', async () => {
      // Given
      const dbId = 'dbId';
      const art = {
        dbRecord: {
          _id: dbId,
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
      dto.style = undefined;
      mockCogView2Service.getArt.mockResolvedValue(art);
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
      expect(mockCogView2Service.getArt).toBeCalledTimes(1);
      expect(mockCogView2Service.getArt).toBeCalledWith(dto.prompt, undefined);
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: '/ai-art cog-view-2 command called',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: 'cogView2 collage generated',
      });
    });
    it('Should handle error', async () => {
      // Given
      const error = new Error('test error');
      mockCogView2Service.getArt.mockImplementation(() => {
        throw error;
      });
      // When
      await service.handler(dto, mockExecutionContext as any);
      // Then
      expect(mockJobResolver.create).not.toBeCalled();
      expect(mockAddBreadcrumb).toBeCalledTimes(1);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: '/ai-art cog-view-2 command called',
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
      const dbId = 'dbId';
      const art = {
        dbRecord: {
          _id: dbId,
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
      mockCogView2Service.getArt.mockResolvedValue(art);
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
        message: '/ai-art cog-view-2 command called',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Commands',
        level: 'info',
        message: 'cogView2 collage generated',
      });
    });
  });
});
