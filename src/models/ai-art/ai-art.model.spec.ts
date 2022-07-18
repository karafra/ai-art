import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AiArtModel } from './ai-art.model';

describe('AiArtService', () => {
  let service: AiArtModel;

  const mockHttpService = {
    axiosRef: {
      post: jest.fn(),
    },
  };
  const aiArtResponseObject = {
    images: ['1', '2', '3', '4', '6', '8', '9'],
  };

  const aiArtResponse = {
    data: aiArtResponseObject,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiArtModel,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<AiArtModel>(AiArtModel);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getResponse', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should get response', async () => {
      // Given
      mockHttpService.axiosRef.post.mockResolvedValue(aiArtResponse);
      const prompt = 'prompt';
      // When
      const response = await service.getResponse(prompt);
      // Then
      expect(response).toBe(aiArtResponse);
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(1);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(
        'http://bf.dallemini.ai/generate',
        {
          prompt,
          headers: {
            Accept: 'application/json',
          },
        },
      );
    });
  });
  describe('getImageArray', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should get image array', async () => {
      // Given
      mockHttpService.axiosRef.post.mockResolvedValue(aiArtResponse);
      const prompt = 'prompt';
      // When
      const response = await service.getImageArray(prompt);
      // Then
      expect(response).toBe(aiArtResponseObject.images);
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(1);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(
        'http://bf.dallemini.ai/generate',
        {
          prompt,
          headers: {
            Accept: 'application/json',
          },
        },
      );
    });
  });
});
