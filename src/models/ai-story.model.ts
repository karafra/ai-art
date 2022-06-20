import { HttpClient } from '../http/http-client'
import { AiStoryRequest, AiStoryResponse, Model } from '../types/api/ai-story'
import { environment } from '../utils/environment'
import { AxiosResponse } from 'axios'

/**
 * Gets response from public API of `openAi` /generate endpoint
 *
 * @author Karafra
 * @since 1.3.0
 */
export class AiStoryModel extends HttpClient {
  public constructor() {
    super('https://api.openai.com/v1')
  }

  /**
   * Returns response from openAi generate endpoint.
   *
   * @param prompt headline of text to generate
   * @param model model which is to generate text
   * @returns generated text
   */
  public async getResponse(prompt: string, model?: Model): Promise<AxiosResponse<AiStoryResponse>> {
    const selectedModel = model || 'text-davinci-002'
    const requestBody = {
      model: selectedModel,
      prompt,
      temperature: 0.7,
      max_tokens: 512,
      top_p: 1,
      best_of: 3,
      frequency_penalty: 0.75,
      presence_penalty: 0.33
    } as AiStoryRequest
    return this.instance.post('/completions', requestBody, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${environment.openAiToken}`
      }
    })
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
      data: { choices }
    } = await this.getResponse(prompt, model)
    return choices[0].text
  }
}

export const aiStoryModel = new AiStoryModel()
