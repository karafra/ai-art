import { Injectable } from '@nestjs/common';
import { EmbedField, MessageEmbed } from 'discord.js';
import { __INCLUDE_IN_HELP } from '../../../decorators/includeInHelp.decorator';
import { ICommandHelp } from '../../../types/command/help';

@Injectable()
export class HelpService {
  private readonly iconUrl =
    'https://raw.githubusercontent.com/karafra/ai-art/main/.github/images/logo.png';
  public getHelpAtIndex(index: number): MessageEmbed {
    const modularIndex =
      index >= 0
        ? index % __INCLUDE_IN_HELP.length
        : 2 - ((2 - index) % __INCLUDE_IN_HELP.length);
    const help = __INCLUDE_IN_HELP[modularIndex] as ICommandHelp;
    const embed = new MessageEmbed();
    embed.setAuthor({
      name: 'AiArt Help',
      iconURL: this.iconUrl,
      url: 'https://github.com/karafra/ai-art/',
    });
    embed.setTitle(help.name);
    embed.setDescription(help.description);
    const parameterFields: EmbedField[] = [];
    help.parameters.forEach((parameter) =>
      parameterFields.push({
        name: parameter.name,
        value: parameter.optional
          ? `${parameter.description} (Optional)`
          : parameter.description,
        inline: true,
      }),
    );
    embed.addField('\u200B', '**Parameters:**');
    embed.addFields(parameterFields);
    embed.addField('Usage', `\`${help.usage}\``);
    embed.setFooter({
      text: `Page ${modularIndex + 1}/${__INCLUDE_IN_HELP.length}`,
    });
    return embed;
  }
}
