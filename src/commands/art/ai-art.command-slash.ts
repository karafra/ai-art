import { aiArtService } from '@Services/ai-art.service'
import { logger } from '@Services/logger.service'
import { Command } from '@Utils/command'
import { CommandInteraction } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'

/**
 * Class for /art command
 *
 * @author Karafra
 * @since 1.0
 */
@Discord()
export class AiArt extends Command {
  constructor() {
    super()
  }

  /**
   * Command execution method.
   *
   * @param prompt prompt based on which to generate art.
   * @param interaction autowired user-command interaction.
   */
  @Slash('art', { description: 'Generate AI art!' })
  async init(
    @SlashOption('prompt', {
      description: 'Enter description of art you want to generate',
      required: true
    })
    prompt: string,
    interaction: CommandInteraction
  ): Promise<void> {
    logger.info(`Processing art for ${prompt}`)
    interaction.deferReply()
    try {
      const attachment = await aiArtService.getArt(prompt)
      interaction.channel?.send({
        content: this.c('processedAiArt', prompt, interaction.user.id),
        files: [attachment]
      })
      await interaction.deleteReply()
      logger.info(`Art for prompt ${prompt} processed`)
    } catch (Error) {
      logger.error(`Could not generate art for prompt ${prompt}`)
      interaction.channel?.send(this.c('couldNotProcessAiArt', prompt))
    }
  }
}
