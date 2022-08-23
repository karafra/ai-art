import { Test, TestingModule } from '@nestjs/testing';
import { AuthModel } from './auth-model.model';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry';
import { GoogleApiAuthResponse } from '../../../types/api/wombo-dream';
import { GoogleAuthenticationToolkitError } from '../../../exceptions/GoogleAuthenticationToolkitError';

describe('AuthModel', () => {
  let service: AuthModel;
  const mockSentryInstance = {
    addBreadcrumb: jest.fn(),
    captureException: jest.fn(),
  };
  const mockHttpService = {
    axiosRef: {
      post: jest.fn(),
    },
  };
  const mockSentryService = {
    instance: () => mockSentryInstance,
  };
  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthModel,
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

    service = module.get<AuthModel>(AuthModel);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authenticate', () => {
    const idToken = 'idToken';
    const kind = 'kind';
    const expiresIn = 3600;
    const localId = 'localId';
    const googleApiAuthResponse = {
      idToken,
      kind,
      localId,
      expiresIn,
    } as GoogleApiAuthResponse;
    const axiosResponse = {
      data: googleApiAuthResponse,
    };
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should authenticate user', async () => {
      // Given
      const authUrl = 'https://authUrl.com/';
      mockConfigService.get.mockReturnValue(authUrl);
      mockHttpService.axiosRef.post.mockResolvedValue(axiosResponse);
      // When
      const response = await service.authenticate();
      // Then
      expect(response.data).toBe(googleApiAuthResponse);
      expect(mockConfigService.get).toBeCalledTimes(1);
      expect(mockConfigService.get).toBeCalledWith('wombo-dream.googleAuthUrl');
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(1);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(authUrl, {});
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(1);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledTimes(2);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'debug',
        category: 'model',
        message: 'Authenticating for wombo art',
      });
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'debug',
        category: 'model',
        message: 'Authentication for wombo art completed successfully',
      });
    });
    it('should capture error that occures during authentication', async () => {
      // Given
      const authUrl = 'https://authUrl.com/';
      mockConfigService.get.mockReturnValue(authUrl);
      const testError = new Error('Test error');
      mockHttpService.axiosRef.post.mockImplementation(() => {
        throw testError;
      });
      // When
      await expect(service.authenticate()).rejects.toThrow(
        new GoogleAuthenticationToolkitError(testError.message),
      );
      // Then
      expect(mockConfigService.get).toBeCalledTimes(1);
      expect(mockConfigService.get).toBeCalledWith('wombo-dream.googleAuthUrl');
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(1);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(authUrl, {});
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(1);
      expect(mockSentryInstance.captureException).toBeCalledTimes(1);
      expect(mockSentryInstance.captureException).toBeCalledWith(
        new GoogleAuthenticationToolkitError(testError.message),
      );
      expect(mockSentryInstance.addBreadcrumb).toBeCalledTimes(1);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'debug',
        category: 'model',
        message: 'Authenticating for wombo art',
      });
    });
  });
  describe('getAuthentication', () => {
    const idToken = 'idToken';
    const kind = 'kind';
    const expiresIn = 3600;
    const localId = 'localId';
    const googleApiAuthResponse = {
      idToken,
      kind,
      localId,
      expiresIn,
    } as GoogleApiAuthResponse;
    const axiosResponse = {
      data: googleApiAuthResponse,
    };
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should authenticate', async () => {
      const authUrl = 'https://authUrl.com/';
      mockConfigService.get.mockReturnValue(authUrl);
      mockHttpService.axiosRef.post.mockResolvedValue(axiosResponse);
      // When
      const response = await service.getAuthentication();
      // Then
      expect(response).toBe(googleApiAuthResponse);
      expect(mockConfigService.get).toBeCalledTimes(1);
      expect(mockConfigService.get).toBeCalledWith('wombo-dream.googleAuthUrl');
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(1);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(authUrl, {});
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(1);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledTimes(2);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'debug',
        category: 'model',
        message: 'Authenticating for wombo art',
      });
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'debug',
        category: 'model',
        message: 'Authentication for wombo art completed successfully',
      });
    });
  });
});
