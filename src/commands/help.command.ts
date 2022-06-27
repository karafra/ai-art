import { HelpService } from '@Services/help.service'
import { Command } from '@Utils/command'
import {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed
} from 'discord.js'
import { ButtonComponent, Discord, Slash } from 'discordx'

/**
 * Class for /help command
 *
 * @author Karafra
 * @since 1.4.5
 */
@Discord()
export class Help extends Command {
  private currentHint = 0

  private helpService = new HelpService()

  /**
   * Command execution method.
   *
   * @param interaction command interaction
   */
  @Slash('help')
  async init(interaction: CommandInteraction): Promise<void> {
    const embed = new MessageEmbed()
    embed.setTitle('AiArt help')
    embed.setAuthor({
      name: 'Some name', // this will be name of the command
      iconURL: 'https://raw.githubusercontent.com/karafra/ai-art/main/.github/images/logo.png',
      url: 'https://github.com/karafra/ai-art/'
    })
    embed.setThumbnail(
      'https://raw.githubusercontent.com/karafra/ai-art/main/.github/images/logo.png'
    )

    await interaction.reply({
      ephemeral: true,
      embeds: [this.helpService.getHelpAtIndex(this.currentHint)],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton().setCustomId('previous').setLabel('◀️').setStyle('PRIMARY'),
          new MessageButton().setCustomId('next').setLabel('▶️').setStyle('PRIMARY')
        )
      ]
    })
  }

  /**
   * Handler method for "previous" button
   *
   * @param interaction previous button click interaction
   */
  @ButtonComponent('previous')
  async previousHint(interaction: ButtonInteraction): Promise<void> {
    await interaction.update({
      embeds: [this.helpService.getHelpAtIndex(--this.currentHint)]
    })
  }

  /**
   * Handler method for "next" button
   *
   * @param interaction next button click interaction
   */
  @ButtonComponent('next')
  async nextHint(interaction: ButtonInteraction): Promise<void> {
    await interaction.update({
      embeds: [this.helpService.getHelpAtIndex(++this.currentHint)]
    })
  }
}
