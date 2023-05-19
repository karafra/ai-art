import { Command, DiscordCommand, UseCollectors } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import {
  CacheType,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import { HelpService } from '../../services/commands/help/help.service';
import { HelpInteractionCollector } from './collectors/help.collector';

@Command({
  name: 'help',
  description: 'Get help',
})
@Injectable()
@UseCollectors(HelpInteractionCollector)
export class HelpCommand implements DiscordCommand {
  public constructor(private readonly helpService: HelpService) {}

  public async handler(
    interaction: CommandInteraction<CacheType>,
  ): Promise<void> {
    const help = this.helpService.getHelpAtIndex(0);
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton({
          customId: 'previous',
          label: '◀️',
          style: 'PRIMARY',
        }),
      )
      .addComponents(
        new MessageButton({
          customId: 'next',
          label: '▶️',
          style: 'PRIMARY',
        }),
      );
    await interaction.reply({
      embeds: [help],
      components: [row],
      ephemeral: true,
    });
  }
}
