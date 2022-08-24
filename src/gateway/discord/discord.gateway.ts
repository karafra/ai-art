import { InjectDiscordClient, On, Once } from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
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
    @InjectSentry()
    private readonly sentryService: SentryService,
    @InjectDiscordClient()
    private readonly discordClient: Client,
    private readonly jobsResolver: JobResolver,
  ) {}

  @Once('ready')
  public onReady(): void {
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      message: 'Gateway connected to Discord',
      category: 'Gateway',
    });
    this.logger.log(
      `Bot connected to gateway with ping ${this.discordClient.ws.ping}ms`,
    );
  }

  @On('error')
  public onError(error: Error) {
    this.sentryService.instance().addBreadcrumb({
      level: 'error',
      message: `Discord gateway WS connection failed with error ${error.message}`,
      category: 'Gateway',
    });
    this.logger.error(
      `client's WebSocket encountered a connection error: ${error}`,
    );
  }

  @On('messageReactionAdd')
  public async onMessageReactionAdd(
    messageReaction: MessageReaction,
    user: User,
  ): Promise<void> {
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Gateway',
      message: 'reaction collected',
    });
    if (
      messageReaction.emoji.identifier !== '%E2%9C%89%EF%B8%8F' ||
      messageReaction.message.author.id !== this.discordClient.user.id
    ) {
      this.sentryService.instance().addBreadcrumb({
        level: 'debug',
        category: 'Gateway',
        message: 'Not dispatching, reaction is non related',
      });
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
    this.sentryService.instance().addBreadcrumb({
      level: 'debug',
      category: 'Gateway',
      message: 'Fetched record from database',
    });
    if (dbRecord === null) {
      this.logger.debug(`No record found for this image in database`);
      this.sentryService.instance().addBreadcrumb({
        level: 'debug',
        category: 'Gateway',
        message: 'Record was empty, stopping execution',
      });
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
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Gateway',
      message: 'Messages sent do DM successfully',
    });
  }
}
