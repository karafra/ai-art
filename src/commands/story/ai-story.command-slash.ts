import { Model } from '../../types/api/ai-story'
import { aiStoryService } from '@Services/ai-story.service'
import { logger } from '@Services/logger.service'
import { Command } from '@Utils/command'
import { CommandInteraction } from 'discord.js'
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx'

@Discord()
export class AiStory extends Command {
  constructor() {
    super()
  }

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
    interaction.deferReply()
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
