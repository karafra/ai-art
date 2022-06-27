import { ICommandHelp } from '../../types/command/help'
import { aiArtService } from '@Services/ai-art.service'
import { logger } from '@Services/logger.service'
import { Command } from '@Utils/command'
import { CommandInteraction } from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'

/**
 * Class for /dalle-mini command
 *
 * @author Karafra
 * @since 1.0
 */
@Discord()
@SlashGroup({ name: 'ai-art', description: 'generate visual AI art' })
@SlashGroup('ai-art')
export class AiArt extends Command {
  public static help?: ICommandHelp | undefined = {
    name: '/ai-art dalle-mini',
    description: 'Generates tory from given headline',
    usage: '/ai-story dalle-mini prompt: Liberty leading people to freedom',
    parameters: [
      {
        name: 'prompt',
        description: 'Description of image'
      }
    ]
  }

  constructor() {
    super()
  }

  /**
   * Command execution method.
   *
   * @param prompt prompt based on which to generate art.
   * @param interaction autowired user-command interaction.
   */
  @Slash('dalle-mini', { description: 'Generate Dall-e mini art!' })
  async init(
    @SlashOption('prompt', {
      description: 'Enter description of art you want to generate',
      required: true
    })
    prompt: string,
    interaction: CommandInteraction
  ): Promise<void> {
    logger.info(`Processing art for ${prompt}`)
    await interaction.deferReply()
    try {
      const attachment = await aiArtService.getArt(prompt)
      await interaction.channel?.send({
        content: this.c('processedAiArt', prompt, interaction.user.id),
        files: [attachment]
      })
      await interaction.deleteReply()
      logger.info(`Art for prompt ${prompt} processed`)
    } catch (Error) {
      logger.error(`Could not generate art for prompt ${prompt} (Dall-E mini) `)
      interaction.channel?.send(this.c('couldNotProcessAiArt', prompt))
    }
  }
}
