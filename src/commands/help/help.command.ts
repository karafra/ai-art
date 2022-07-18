import { Command, DiscordCommand, UseCollectors } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
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
  public constructor(
    private readonly helpService: HelpService,
    @InjectSentry() private readonly sentryService: SentryService,
  ) {}

  public async handler(
    interaction: CommandInteraction<CacheType>,
  ): Promise<void> {
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Command',
      message: '/help command called',
    });
    const help = this.helpService.getHelpAtIndex(0);
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Command',
      message: `help at index ${0} fetched`,
    });
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
    this.sentryService.instance().addBreadcrumb({
      category: 'Command',
      level: 'info',
      message: 'Help dispatched',
    });
  }
}
