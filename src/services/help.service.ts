import { ICommandHelp } from '../types/command/help'
import { __INCLUDE_IN_HELP } from '@Decorators/include-in-help.decorator'
import { Command } from '@Utils/command'
import { EmbedField, MessageEmbed } from 'discord.js'

/**
 * @author Karafra
 * @since 1.4.5
 */
export class HelpService {
  private commands: Command[]

  private readonly iconUrl =
    'https://raw.githubusercontent.com/karafra/ai-art/main/.github/images/logo.png'
  public constructor() {
    this.commands = __INCLUDE_IN_HELP
  }

  public getHelpAtIndex(index: number): MessageEmbed {
    const modularIndex = index % this.commands.length
    const help = this.commands[modularIndex].help as ICommandHelp
    const embed = new MessageEmbed()
    embed.setAuthor({
      name: 'AiArt Help',
      iconURL: this.iconUrl,
      url: 'https://github.com/karafra/ai-art/'
    })
    embed.setTitle(help.name)
    embed.setDescription(help.description)
    const parameterFields: EmbedField[] = []
    help.parameters.forEach((parameter) =>
      parameterFields.push({
        name: parameter.name,
        value: parameter.optional ? `${parameter.description} (Optional)` : parameter.description,
        inline: true
      })
    )
    embed.addField('\u200B', '**Parameters:**')
    embed.addFields(parameterFields)
    embed.addField('Usage', `\`${help.usage}\``)
    embed.setFooter({
      text: `Page ${modularIndex + 1}/${this.commands.length}`
    })
    return embed
  }
}

export const helpService = new HelpService()
