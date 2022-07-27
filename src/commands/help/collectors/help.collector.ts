import { InteractionEventCollector, On } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { ButtonInteraction } from 'discord.js';
import { HelpService } from '../../../services/commands/help/help.service';

@Injectable()
@InteractionEventCollector({ time: 300_000 })
export class HelpInteractionCollector {
  private index = 0;
  public constructor(private readonly helpService: HelpService) {}

  @On('collect')
  public async onCollect(interaction: ButtonInteraction) {
    if (interaction.customId === 'next') {
      ++this.index;
    } else if (interaction.customId === 'previous') {
      --this.index;
    }
    const help = this.helpService.getHelpAtIndex(this.index);
    await interaction.update({
      embeds: [help],
    });
  }
}
