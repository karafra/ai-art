import { Test, TestingModule } from '@nestjs/testing';
import { WomboDreamCommand } from './wombo-dream.command';
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry';
import { JobResolver } from '../../../entity/job/job.resolver';
import { WomboDreamService } from '../../../services/commands/art/wombo-dream/wombo-dream.service';
import { WomboDreamStyle } from '../../../types/api/wombo-dream';
import { WomboDreamDto } from './wombo-dream.dto';

describe('WomboDreamService', () => {
  let service: WomboDreamCommand;
  const mockAddBreadcrumb = jest.fn();
  const mockCaptureException = jest.fn();
  const mockSentryService = {
    instance: jest.fn(() => ({
      addBreadcrumb: mockAddBreadcrumb,
      captureException: mockCaptureException,
    })),
  };
  const mockWomboDreamService = {
    generateArt: jest.fn(),
  };
  const mockJobResolver = {
    create: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WomboDreamCommand,
        {
          provide: SENTRY_TOKEN,
          useValue: mockSentryService,
        },
        {
          provide: WomboDreamService,
          useValue: mockWomboDreamService,
        },
        {
          provide: JobResolver,
          useValue: mockJobResolver,
        },
      ],
    }).compile();

    service = module.get<WomboDreamCommand>(WomboDreamCommand);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handler', () => {
    const dto = new WomboDreamDto();
    const prompt = 'prompt';
    const id = 'id';
    const style: WomboDreamStyle = WomboDreamStyle.No_Style;
    const mockExecutionContext = {
      interaction: {
        deleteReply: jest.fn(),
        editReply: jest.fn(),
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
      dto.style = style.name;
    });

    it('should create art', async () => {
      // Given
      const art = {
        photo_url_list: ['photo_url'],
      };
      const mockMessage = {
        id: 'id',
        url: 'url',
      };
      mockWomboDreamService.generateArt.mockImplementation(async function* () {
        yield art;
      });
      mockExecutionContext.interaction.editReply.mockResolvedValue(mockMessage);
      // When
      await service.handler(dto, mockExecutionContext as any);
      // Then
      expect(mockExecutionContext.interaction.deferReply).toBeCalledTimes(1);
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'command',
        level: 'debug',
        message: `Finished processing art for prompt ${dto.prompt} based on model WomboDream`,
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'command',
        level: 'info',
        message: `Starting processing art for prompt "${dto.prompt} based on model WomboDream"`,
      });
      expect(mockExecutionContext.interaction.editReply).toBeCalledTimes(2);
      expect(mockExecutionContext.interaction.editReply).toBeCalledWith({
        content: `:hourglass: Processing art for ${dto.prompt} :hourglass:`,
        files: [
          {
            attachment: expect.any(String),
            name: 'WomboDream.png',
          },
        ],
      });
      expect(mockExecutionContext.interaction.editReply).toBeCalledWith({
        content: `:art: ${dto.prompt} :frame_photo: `,
      });
      expect(mockJobResolver.create).toBeCalledTimes(1);
      expect(mockJobResolver.create).toBeCalledWith({
        messageLink: mockMessage.url,
        messageId: mockMessage.id,
        images: [art.photo_url_list[0]],
      });
    });
    it('should catch error that occurred during art generation', async () => {
      // Given
      const mockMessage = {
        id: 'id',
        url: 'url',
      };
      const testError = new Error('Test error');
      mockWomboDreamService.generateArt.mockImplementation(() => {
        throw testError;
      });
      mockExecutionContext.interaction.editReply.mockResolvedValue(mockMessage);
      // When
      await service.handler(dto, mockExecutionContext as any);
      // Then
      expect(mockExecutionContext.interaction.deferReply).toBeCalledTimes(1);
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'command',
        level: 'error',
        message: `Could not process art for ${dto.prompt} based on model WomboDream due to internal error (${testError.message})`,
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'command',
        level: 'info',
        message: `Starting processing art for prompt "${dto.prompt} based on model WomboDream"`,
      });
      expect(mockCaptureException).toBeCalledTimes(1);
      expect(mockCaptureException).toBeCalledWith(testError);
      expect(mockExecutionContext.interaction.editReply).toBeCalledTimes(1);
      expect(mockExecutionContext.interaction.editReply).toBeCalledWith({
        content: `:frowning: Could not process art for "${dto.prompt}" due to internal error (${testError.message})`,
        files: [],
      });
    });
  });
});
