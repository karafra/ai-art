import { cog2Model } from '@Models/image/cogView2.model'
import { Style } from '@Types/api/cogView2'
import { Collage } from '@Utils/collage'
import { MessageAttachment } from 'discord.js'

/**
 * CogView2 art generator service
 *
 * @author Karafra
 * @since 1.4.0
 */
export class CogView2Service {
  /**
   * Generates cogView2 art from given prompt.
   *
   * @param prompt prompt based on which to generate art
   * @param style style of art to be used
   * @returns message attachment with generated art.
   */
  public async getArt(prompt: string, style?: Style): Promise<MessageAttachment> {
    const collage = new Collage()
    const response = await cog2Model.getImageArray(prompt, style)
    await collage.constructCollage(response)
    return collage.getAsAttachment()
  }
}

export const cog2Service = new CogView2Service()
