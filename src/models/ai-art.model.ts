import { AiArtResponse } from '../types/api/ai-art'
import { HttpClient } from 'Root/http/http-client'
import { AxiosResponse } from 'axios'

/**
 * Gets response from `public` dall-e mini endpoint
 *
 * @author Karafra
 * @since 1.0
 */
export class AiArtModel extends HttpClient {
  public constructor() {
    super('https://bf.dallemini.ai')
  }

  /**
   * Requests response from dall-e mini endpoint
   *
   * @param prompt prompt base on which to generate art
   * @returns EP response
   */
  private getResponse(prompt: string): Promise<AxiosResponse<AiArtResponse>> {
    return this.instance.post('/generate', {
      prompt,
      headers: {
        Accept: 'application/json'
      }
    })
  }

  /**
   * Returns raw string array of base64 dall-e mini generated images.
   *
   * @param prompt prompt based on which to generate art.
   * @returns extracted array of base64 image strings
   */
  public async getImageArray(prompt: string): Promise<AiArtResponse> {
    const { data } = await this.getResponse(prompt)
    return data
  }
}

export const aiArtModelService = new AiArtModel()
