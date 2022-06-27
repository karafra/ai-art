import { aiArtModel } from '@Models/image/ai-art.model'
import { Collage } from '@Utils/collage'
import { MessageAttachment } from 'discord.js'

/**
 * AiArt generator service.
 *
 * @author Karafra
 * @since 1.0
 */
export class AiArtService {
  /**
   * Generates art from given prompt.
   *
   * @param prompt prompt based on which to generate art
   * @returns message attachment with generated art.
   */
  public async getArt(prompt: string): Promise<MessageAttachment> {
    const collage = new Collage()
    for (let i = 0; i < 30; i++) {
      try {
        const response = await aiArtModel.getImageArray(prompt)
        await collage.constructCollage(response.images)
        return collage.getAsAttachment()
      } catch (Error) {
        await new Promise((f) => setTimeout(f, 3000))
      }
    }
    throw new Error('Could not process this query')
  }
}

export const aiArtService = new AiArtService()
