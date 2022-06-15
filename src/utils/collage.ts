import { AiArtImageArray } from '@Types/api/ai-art.js'
import createCollage from '@settlin/collage'
import { MessageAttachment } from 'discord.js'

/**
 * Class for collage of 3x3 grid.
 *
 * @author Karafra
 * @since 1.0
 */
export class Collage {
  private static readonly options: any = {
    width: 3,
    height: 3,
    imageWidth: 300,
    imageHeight: 300,
    spacing: 20,
    sources: []
  }
  public canvas: any

  /**
   * Constructs collage from array of base64 strings.
   *
   * @param arr array of base64 strings
   * @returns this class
   */
  public async constructCollage(arr: AiArtImageArray): Promise<Collage> {
    const options = Collage.options
    options.sources = arr.map((image: string) => Buffer.from(image, 'base64'))
    this.canvas = await createCollage(options)
    return this
  }

  /**
   * Converts collage to discord sendable attachment.
   *
   * @param name name of collage.
   * @returns collage as Discord sendable attachment.
   */
  getAsAttachment(name: string = Date.now().toString()): MessageAttachment {
    const buffer = this.canvas.toBuffer('image/png')
    return new MessageAttachment(buffer, `${name}.png`)
  }
}
