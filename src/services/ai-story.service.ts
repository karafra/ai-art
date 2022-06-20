import { aiStoryModel } from '../models/ai-story.model'
import { Model } from '../types/api/ai-story'

export class AiStoryService {
  public async getStory(prompt: string, model?: Model): Promise<string> {
    return await aiStoryModel.getStory(prompt, model)
  }
}

export const aiStoryService = new AiStoryService()
