import { HttpClient } from '../http/http-client'
import { AiStoryRequest, AiStoryResponse, Model } from '../types/api/ai-story'
import { environment } from '../utils/environment'
import { AxiosResponse } from 'axios'

export class AiStoryModel extends HttpClient {
  public constructor() {
    super('https://api.openai.com/v1')
  }

  public async getResponse(prompt: string, model?: Model): Promise<AxiosResponse<AiStoryResponse>> {
    const selectedModel = model || 'text-babbage-001'
    const requestBody = {
      model: selectedModel,
      prompt,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    } as AiStoryRequest
    return this.instance.post('/completions', requestBody, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${environment.openAiToken}`
      }
    })
  }

  public async getStory(prompt: string, model?: Model) {
    const {
      data: { choices }
    } = await this.getResponse(prompt, model)
    return choices[0].text
  }
}

export const aiStoryModel = new AiStoryModel()
