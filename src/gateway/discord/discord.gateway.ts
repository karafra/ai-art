import { InjectDiscordClient, On, Once } from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import {
  Client,
  DiscordAPIError,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageReaction,
  User,
} from 'discord.js';
import { JobResolver } from '../../entity/job/job.resolver';

@Injectable()
export class BotGateway {
  private readonly logger: Logger = new Logger(BotGateway.name);

  public constructor(
    @InjectDiscordClient()
    private readonly discordClient: Client,
    private readonly jobsResolver: JobResolver,
  ) {}

  @Once('ready')
  public onReady(): void {}

  @On('error')
  public onError(error: Error) {
    this.logger.error(
      `client's WebSocket encountered a connection error: ${error}`,
    );
  }

  @On('messageReactionAdd')
  public async onMessageReactionAdd(
    messageReaction: MessageReaction,
    user: User,
  ): Promise<void> {
    if (
      messageReaction.emoji.identifier !== '%E2%9C%89%EF%B8%8F' ||
      messageReaction.message.author.id !== this.discordClient.user.id
    ) {
      return;
    }
    try {
      await messageReaction.remove();
    } catch (err) {
      if (err instanceof DiscordAPIError) {
        this.logger.warn(
          `Bot on server ${messageReaction.message.guild.name} does not have permission to clear reactions. Enveloper feature disabled`,
        );
        return;
      }
      throw err;
    }
    const dbRecord = await this.jobsResolver.findOneByMessageId(
      messageReaction.message.id,
    );
    if (dbRecord === null) {
      this.logger.debug(`No record found for this image in database`);
      return;
    }
    const { images, messageLink } = dbRecord;
    const actionRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle('LINK')
        .setURL(messageLink)
        .setLabel('Jump to message '),
    );
    await user.send({
      files: images.map(
        (image) =>
          new MessageAttachment(
            Buffer.from(image, 'base64'),
            String(Date.now()) + '.png',
          ),
      ),
      components: [actionRow],
    });
  }
}
