import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import {
  AiStoryRequest,
  AiStoryResponse,
  Model,
} from '../../types/api/ai-story';

@Injectable()
export class AiStoryModel {
  public constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async getResponse(
    prompt: string,
    model?: Model,
  ): Promise<AxiosResponse<AiStoryResponse>> {
    const selectedModel = model || 'text-davinci-002';
    const requestBody = {
      model: selectedModel,
      prompt,
      temperature: 0.7,
      max_tokens: 512,
      top_p: 1,
      best_of: 3,
      frequency_penalty: 0.75,
      presence_penalty: 0.33,
    } as AiStoryRequest;
    return this.httpService.axiosRef.post(
      'https://api.openai.com/v1/completions',
      requestBody,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.configService.get<string>(
            'openAi.token',
          )}`,
        },
      },
    );
  }
  /**
   * Parses openAi endpoint response into more readable and usable format.
   *
   * @param prompt headline of story
   * @param model model which is to generate story
   * @returns generated story.
   */
  public async getStory(prompt: string, model?: Model) {
    const {
      data: { choices },
    } = await this.getResponse(prompt, model);
    return choices[0].text;
  }
}
