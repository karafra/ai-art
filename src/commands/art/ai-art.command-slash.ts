import { aiArtService } from '@Services/ai-art.service';
import { Command } from '@Utils/command';
import { CommandInteraction, MessageAttachment } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { logger } from '@Services/logger.service';

@Discord()
export abstract class AiArt extends Command {
  constructor() {
    super();
  }
  @Slash('art', { description: 'Generate AI art!' })
  async init(
    @SlashOption('prompt', { description: 'Enter description of art you want to generate', required: true })
    prompt: string,
    interaction: CommandInteraction
  ): Promise<void> {
    logger.info(`Processing art for ${prompt}`);
    interaction.deferReply();
    try {
      const buffer = await aiArtService.getArt(prompt);
      const attachment = new MessageAttachment(buffer, 'unknown.png');
      interaction.channel?.send({
        content: this.c("processedAiArt", prompt, interaction.user.id),
        files: [attachment],
      });
      await interaction.deleteReply();
      logger.info(`Art for prompt ${prompt} processed`);
    } catch (Error) {
      logger.error(`Could not generate art for prompt ${prompt}`);
      interaction.channel?.send(this.c("couldNotProcessAiArt", prompt, interaction.user.id));
    }
  }
}