import { ICommandHelp } from '../../types/command/help'
import { IncludeInHelp } from '@Decorators/include-in-help.decorator'
import { aiStoryService } from '@Services/ai-story.service'
import { logger } from '@Services/logger.service'
import { Model } from '@Types/api/ai-story'
import { Command } from '@Utils/command'
import { CommandInteraction } from 'discord.js'
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from 'discordx'

/**
 * Class for /ai-story story command.
 *
 * @since 1.3
 * @author Karafra
 */
@Discord()
@SlashGroup({ name: 'ai-story', description: 'generate textual AI art' })
@SlashGroup('ai-story')
@IncludeInHelp()
export class AiStory extends Command {
  public static help?: ICommandHelp | undefined = {
    name: '/ai-story story',
    description: 'Generates story from given headline',
    usage: '/ai-story story headline: Tell me story about Alice in wonderland',
    parameters: [
      {
        name: 'headline',
        description: 'Headline of story'
      },
      {
        name: 'model',
        description: 'What model to use',
        optional: true
      }
    ]
  }

  constructor() {
    super()
  }

  /**
   * Command execution method.
   *
   * @param headline story headline
   * @param model model to use
   * @param interaction command interaction
   */
  @Slash('story', { description: 'Generate AI story' })
  async init(
    @SlashOption('headline', {
      description: 'Story headline',
      required: true
    })
    headline: string,
    @SlashChoice({ name: 'davinci', value: 'davinci' })
    @SlashChoice({
      name: 'davinciInstructBeta',
      value: 'davinci-instruct-beta'
    })
    @SlashChoice({ name: 'davinci01', value: 'text-davinci-001' })
    @SlashChoice({ name: 'davinci02', value: 'text-davinci-002' })
    @SlashChoice({ name: 'curie01', value: 'text-curie-001' })
    @SlashChoice({ name: 'babage01', value: 'text-babage-001' })
    @SlashChoice({ name: 'ada01', value: 'text-ada-001' })
    @SlashOption('model', { description: 'What model to use', required: false })
    model: Model,
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply()
    logger.info(`Generating story with headline ${headline} based on ${model || 'davinci'} model`)
    try {
      const text = await aiStoryService.getStory(headline, model)
      interaction.editReply({
        content: this.c('aiStoryProcessed', headline, this.escapeMarkdown(text))
      })
      logger.info(
        `Story with headline ${headline} based on ${
          model || 'davinci-text-002'
        } model has been generated successfully`
      )
    } catch (err) {
      const error = err as Error
      interaction.editReply({
        content: this.c('couldNotProcessAiStory', error.message)
      })
      logger.error(error.message)
    }
  }
}
