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
    interaction.reply(this.c("processingAiArt"));
    try {
      const buffer = await aiArtService.getArt(prompt);
      const attachment = new MessageAttachment(buffer, 'unknown.png');
      interaction.editReply({
        content: `${this.c("processedAiArt")} ${prompt} :frame_photo:`,
        files: [attachment]
      });
      logger.info(`Art for prompt ${prompt} processed`);
    } catch (Error) {
      logger.error(`Could not generate ar for prompt ${prompt}`);
      interaction.editReply(this.c("couldNotProcessAiArt"));
    }
  }
}
