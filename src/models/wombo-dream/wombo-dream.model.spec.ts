import { Test, TestingModule } from '@nestjs/testing';
import { WomboDreamModel } from './wombo-dream.model';
import { AuthModel } from './auth/auth-model.model';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry';
import { WomboTaskIdResponse } from '../../types/api/wombo-dream';
import { AxiosResponse } from 'axios';

describe('WomboDreamService', () => {
  let service: WomboDreamModel;
  const taskId = 'taskId';
  const userId = 'userId';
  const mockWomboTaskIdResponse = {
    data: {
      id: taskId,
      user_id: userId,
    },
  } as AxiosResponse<WomboTaskIdResponse>;
  const mockAuthModel = {
    getAuthentication: jest.fn(),
  };
  const mockHttpService = {
    axiosRef: {
      put: jest.fn(),
      post: jest.fn(),
      get: jest.fn(),
    },
  };
  const mockConfigService = {
    get: jest.fn(),
  };
  const mockSentryInstance = {
    addBreadcrumb: jest.fn(),
    captureException: jest.fn(),
  };
  const mockSentryService = {
    instance: () => mockSentryInstance,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WomboDreamModel,
        {
          provide: AuthModel,
          useValue: mockAuthModel,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: SENTRY_TOKEN,
          useValue: mockSentryService,
        },
      ],
    }).compile();

    service = module.get<WomboDreamModel>(WomboDreamModel);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createArt', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const idToken = 'idToken';
    const mockWomboTaskResponse = {
      data: {
        state: 'pending',
        token: idToken,
      },
    } as AxiosResponse<WomboTaskIdResponse>;
    it('should create art without error', async () => {
      // Given
      const apiUrl = 'https://api.url.com';
      const prompt = 'prompt';
      mockAuthModel.getAuthentication.mockResolvedValue({ idToken });
      mockHttpService.axiosRef.put.mockResolvedValue(mockWomboTaskResponse);
      mockHttpService.axiosRef.post.mockResolvedValue(mockWomboTaskIdResponse);
      mockConfigService.get.mockReturnValue(apiUrl);
      // When
      const response = await service.createArt(prompt);
      // Then
      expect(response).toBe(mockWomboTaskResponse.data);
      expect(mockAuthModel.getAuthentication).toBeCalledTimes(1);
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(1);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(
        `${apiUrl}/tasks/`,
        { premium: false },
        {
          headers: {
            Origin: 'https://app.wombo.art',
            Referer: 'https://app.wombo.art/',
            Authorization: 'bearer ' + idToken,
            'Content-Type': 'text/plain;charset=UTF-8',
            service: 'Dream',
          },
        },
      );
      expect(mockSentryInstance.addBreadcrumb).toBeCalledTimes(2);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        category: 'Model',
        level: 'debug',
        message: 'Creating Wombo task',
      });
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        category: 'Model',
        level: 'debug',
        message: 'Created Wombo task',
      });
    });
  });
  describe('checkArtStatus', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const idToken = 'idToken';
    const mockWomboTaskResponseProcessing = {
      data: {
        state: 'pending',
        token: idToken,
      },
    } as AxiosResponse<WomboTaskIdResponse>;
    it('should check art status', async () => {
      // Given
      const apiUrl = 'https://api.url.com/';
      const artId = 'artId';
      mockAuthModel.getAuthentication.mockResolvedValue({ idToken });
      mockHttpService.axiosRef.get.mockResolvedValueOnce(
        mockWomboTaskResponseProcessing,
      );
      mockHttpService.axiosRef.post.mockResolvedValue(mockWomboTaskIdResponse);
      mockConfigService.get.mockReturnValue(apiUrl);
      // When
      const response = await service.checkArtStatus(artId, idToken);
      // Then
      expect(response).toBe(mockWomboTaskResponseProcessing.data);
      expect(mockHttpService.axiosRef.get).toBeCalledTimes(1);
      expect(mockHttpService.axiosRef.get).toBeCalledWith(
        `${apiUrl}/tasks/${artId}`,
        {
          headers: {
            Origin: 'https://app.wombo.art',
            Referer: 'https://app.wombo.art/',
            Authorization: 'bearer ' + idToken,
            'Content-Type': 'text/plain;charset=UTF-8',
            service: 'Dream',
          },
        },
      );
      expect(mockSentryInstance.addBreadcrumb).toBeCalledTimes(2);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        category: 'model',
        level: 'debug',
        message: `Checking status of job with id ${artId}`,
      });
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        category: 'model',
        level: 'debug',
        message: `Job with id ${artId} is currently "${mockWomboTaskResponseProcessing.data.state}"`,
      });
    });
  });
});
