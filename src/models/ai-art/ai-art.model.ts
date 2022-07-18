import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { AiArtImageArray, AiArtResponse } from '../../types/api/ai-art';

@Injectable()
export class AiArtModel {
  public constructor(private readonly httpService: HttpService) {}

  public async getResponse(
    prompt: string,
  ): Promise<AxiosResponse<AiArtResponse>> {
    return await this.httpService.axiosRef.post(
      'http://bf.dallemini.ai/generate',
      {
        prompt,
        headers: {
          Accept: 'application/json',
        },
      },
    );
  }

  /**
   * Returns raw string array of base64 dall-e mini generated images.
   *
   * @param prompt prompt based on which to generate art.
   * @returns extracted array of base64 image strings
   */
  public async getImageArray(prompt: string): Promise<AiArtImageArray> {
    const { data } = await this.getResponse(prompt);
    return data.images;
  }
}
