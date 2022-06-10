import { AiArtResponse } from '../types/api/ai-art';
import { HttpClient } from '@Interceptors/http-client';
import { AxiosResponse } from 'axios';

export class AiArtModelService extends HttpClient {
  public constructor() {
    super('https://bf.dallemini.ai');
  }

  private getResponse(prompt: string): Promise<AxiosResponse<AiArtResponse>> {
    return this.instance.post('/generate', {
      prompt,
      headers: {
        Accept: 'application/json'
      }
    });
  }

  public async getImageArray(prompt: string): Promise<AiArtResponse> {
    const { data } = await this.getResponse(prompt);
    return data;
  }
}

export const aiArtModelService = new AiArtModelService();
