import { WomboDreamService } from './wombo-dream.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry';
import { WomboDreamModel } from '../../../../models/wombo-dream/wombo-dream.model';
import {
  WomboDreamStyle,
  WomboDreamTaskResponse,
} from '../../../../types/api/wombo-dream';
import { CouldNotGenerateWomboArtException } from '../../../../exceptions/CouldNotGenerateWomboArtException';

describe('WomboDream service', () => {
  let service: WomboDreamService;
  const mockSentryInstance = {
    addBreadcrumb: jest.fn(),
  };
  const mockWomboDreamModel = {
    createArt: jest.fn(),
    checkArtStatus: jest.fn(),
  };
  const mockSentryService = {
    instance: () => mockSentryInstance,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WomboDreamService,
        {
          provide: SENTRY_TOKEN,
          useValue: mockSentryService,
        },
        {
          provide: WomboDreamModel,
          useValue: mockWomboDreamModel,
        },
      ],
    }).compile();
    service = module.get<WomboDreamService>(WomboDreamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('*generateArt', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const prompt = 'prompt';
    const womboTaskId = 'womboTaskId';
    const token = 'token';
    const mockJobStatusResponsePending = {
      state: 'pending',
      id: womboTaskId,
      token,
    } as WomboDreamTaskResponse;
    const mockJobStatusResponseComplete = {
      ...mockJobStatusResponsePending,
      state: 'completed',
    };
    const mockJobStatusResponseFailed = {
      ...mockJobStatusResponsePending,
      state: 'failed',
    };
    it('should generate art', async () => {
      // Given
      mockWomboDreamModel.createArt.mockResolvedValue(
        mockJobStatusResponsePending,
      );
      mockWomboDreamModel.checkArtStatus.mockResolvedValue(
        mockJobStatusResponseComplete,
      );
      // When
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const _ of service.generateArt(
        prompt,
        WomboDreamStyle.Etching,
      )) {
      }
      // Then
      expect(mockWomboDreamModel.createArt).toBeCalledTimes(1);
      expect(mockWomboDreamModel.createArt).toBeCalledWith(
        prompt,
        WomboDreamStyle.Etching,
      );
      expect(mockWomboDreamModel.checkArtStatus).toBeCalledTimes(1);
      expect(mockWomboDreamModel.checkArtStatus).toBeCalledWith(
        womboTaskId,
        token,
      );
    });
    it('should recognize failed api operation', async () => {
      // Given
      mockWomboDreamModel.createArt.mockResolvedValue(
        mockJobStatusResponsePending,
      );
      mockWomboDreamModel.checkArtStatus.mockResolvedValue(
        mockJobStatusResponseFailed,
      );
      // When
      const shouldThrow = async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _ of service.generateArt(
          prompt,
          WomboDreamStyle.Etching,
        )) {
        }
      };
      await expect(shouldThrow()).rejects.toThrow(
        new CouldNotGenerateWomboArtException('Wombo art processing failed'),
      );
      // Then
      expect(mockWomboDreamModel.createArt).toBeCalledTimes(1);
      expect(mockWomboDreamModel.createArt).toBeCalledWith(
        prompt,
        WomboDreamStyle.Etching,
      );
      expect(mockWomboDreamModel.checkArtStatus).toBeCalledTimes(1);
      expect(mockWomboDreamModel.checkArtStatus).toBeCalledWith(
        womboTaskId,
        token,
      );
      expect(mockSentryInstance.addBreadcrumb).toBeCalledTimes(1);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        category: 'Service',
        level: 'error',
        message: `WomboDream image generation failed for prompt ${prompt} in style ${WomboDreamStyle.Etching}`,
      });
    });
  });
});
