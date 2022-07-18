import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { Model } from '../../types/api/ai-story';
import { AiStoryModel } from './ai-story.model';

describe('AiStoryModel', () => {
  let service: AiStoryModel;
  const openAiToken = 'openAiToken';
  const mockConfigService = {
    get: jest.fn(() => openAiToken),
  };
  const mockHttpService = {
    axiosRef: {
      post: jest.fn(),
    },
  };
  const aiStoryResponseObject = {
    id: 'id',
    object: 'generated text',
    created: 1,
    model: 'model',
    choices: [
      {
        text: 'generatedText',
      },
    ],
  };
  const aiStoryResponse = {
    data: aiStoryResponseObject,
  } as AxiosResponse;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiStoryModel,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<AiStoryModel>(AiStoryModel);
  });

  describe('getResponse', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should get response', async () => {
      // Given
      mockHttpService.axiosRef.post.mockResolvedValue(aiStoryResponse);
      const prompt = 'prompt';
      // When
      const response = await service.getResponse(prompt);
      // Then
      expect(response).toBe(aiStoryResponse);
      expect(mockConfigService.get).toBeCalledTimes(1);
      expect(mockConfigService.get).toBeCalledWith('openAi.token');
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(1);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-002',
          prompt,
          temperature: 0.7,
          max_tokens: 512,
          top_p: 1,
          best_of: 3,
          frequency_penalty: 0.75,
          presence_penalty: 0.33,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${openAiToken}`,
          },
        },
      );
    });
    it('Should get response with custom model', async () => {
      // Given
      mockHttpService.axiosRef.post.mockResolvedValue(aiStoryResponse);
      const prompt = 'prompt';
      const model = 'davinci';
      // When
      const response = await service.getResponse(prompt, model);
      // Then
      expect(response).toBe(aiStoryResponse);
      expect(mockConfigService.get).toBeCalledTimes(1);
      expect(mockConfigService.get).toBeCalledWith('openAi.token');
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(1);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(
        'https://api.openai.com/v1/completions',
        {
          model,
          prompt,
          temperature: 0.7,
          max_tokens: 512,
          top_p: 1,
          best_of: 3,
          frequency_penalty: 0.75,
          presence_penalty: 0.33,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${openAiToken}`,
          },
        },
      );
    });
  });
  describe('getStory', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should get story', async () => {
      // Given
      mockHttpService.axiosRef.post.mockResolvedValue(aiStoryResponse);
      const prompt = 'prompt';
      // When
      const response = await service.getStory(prompt);
      // Then
      expect(response).toBe(aiStoryResponseObject.choices[0].text);
      expect(mockConfigService.get).toBeCalledTimes(1);
      expect(mockConfigService.get).toBeCalledWith('openAi.token');
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(1);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-002',
          prompt,
          temperature: 0.7,
          max_tokens: 512,
          top_p: 1,
          best_of: 3,
          frequency_penalty: 0.75,
          presence_penalty: 0.33,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${openAiToken}`,
          },
        },
      );
    });
    it('Should get story', async () => {
      // Given
      mockHttpService.axiosRef.post.mockResolvedValue(aiStoryResponse);
      const prompt = 'prompt';
      const model: Model = 'davinci';
      // When
      const response = await service.getStory(prompt, model);
      // Then
      expect(response).toBe(aiStoryResponseObject.choices[0].text);
      expect(mockConfigService.get).toBeCalledTimes(1);
      expect(mockConfigService.get).toBeCalledWith('openAi.token');
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(1);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(
        'https://api.openai.com/v1/completions',
        {
          model,
          prompt,
          temperature: 0.7,
          max_tokens: 512,
          top_p: 1,
          best_of: 3,
          frequency_penalty: 0.75,
          presence_penalty: 0.33,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${openAiToken}`,
          },
        },
      );
    });
  });
});
