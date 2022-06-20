import { aiStoryModel } from '../models/ai-story.model'
import { Model } from '../types/api/ai-story'

/**
 * AI story generation service.
 *
 * @author Karafra
 * @since 1.3.0
 */
export class AiStoryService {
  /**
   * Returns AI generated story from headline.
   *
   * @param prompt headline of story you want to generate
   * @param model model which is to generate the story
   * @returns generated story.
   */
  public async getStory(prompt: string, model?: Model): Promise<string> {
    const trimmed = (await aiStoryModel.getStory(prompt, model)).trim()
    if (trimmed.startsWith('.')) {
      return trimmed.slice(1).trim()
    }
    return trimmed
  }
}

export const aiStoryService = new AiStoryService()
