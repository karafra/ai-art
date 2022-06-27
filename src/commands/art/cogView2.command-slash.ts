import { cog2Service } from '@Services/cogView2.service'
import { logger } from '@Services/logger.service'
import { Style } from '@Types/api/cogView2'
import { Command } from '@Utils/command'
import { CommandInteraction } from 'discord.js'
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from 'discordx'

/**
 * Class for /cog-view-2 command.
 *
 * @author Karafra
 * @since 1.4.0
 */
@Discord()
@SlashGroup({ name: 'ai-art', description: 'generate visual AI art' })
@SlashGroup('ai-art')
export class CogView2 extends Command {
  constructor() {
    super()
  }

  /**
   * Command execution method
   *
   * @param prompt description of art to generate
   * @param style style of art you want to generate
   * @param interaction autowired command interaction
   */
  @Slash('cog-view-2', { description: 'Generate CogView2 art' })
  async init(
    @SlashOption('prompt', {
      description: 'Enter description of art you want to generate',
      required: true
    })
    prompt: string,
    @SlashChoice({ name: 'none', value: 'none' })
    @SlashChoice({ name: 'mainbody', value: 'mainbody' })
    @SlashChoice({ name: 'photo', value: 'photo' })
    @SlashChoice({ name: 'flat', value: 'flat' })
    @SlashChoice({ name: 'comics', value: 'comics' })
    @SlashChoice({ name: 'oil', value: 'oil' })
    @SlashChoice({ name: 'sketch', value: 'sketch' })
    @SlashChoice({ name: 'isometric', value: 'isometric' })
    @SlashChoice({ name: 'watercolor', value: 'watercolor' })
    @SlashChoice({ name: 'chinese', value: 'chinese' })
    @SlashOption('style', { description: 'What style to use', required: false })
    style: Style,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply()
    logger.info(`Generating art "${prompt}" using cog2 model`)
    try {
      const attachment = await cog2Service.getArt(prompt, style)
      await interaction.channel?.send({
        content: this.c('processedAiArt', prompt, interaction.user.id),
        files: [attachment]
      })
      await interaction.deleteReply()
      logger.info(`Art  for prompt "${prompt}" (cogView2) has ben processed`)
    } catch (Error) {
      logger.error(`Could not generate art for prompt "${prompt}" (CogView2)`)
      interaction.channel?.send(this.c('couldNotProcessAiArt', prompt))
    }
  }
}
