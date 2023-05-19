import { Test, TestingModule } from '@nestjs/testing';
import { AuthModel } from './auth-model.model';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GoogleApiAuthResponse } from '../../../types/api/wombo-dream';
import { GoogleAuthenticationToolkitError } from '../../../exceptions/GoogleAuthenticationToolkitError';

describe('AuthModel', () => {
  let service: AuthModel;
  const mockHttpService = {
    axiosRef: {
      post: jest.fn(),
    },
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
    });
  });
});
