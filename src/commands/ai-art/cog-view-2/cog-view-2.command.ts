import { TransformPipe } from '@discord-nestjs/common';
import {
  DiscordTransformedCommand,
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { IncludeInHelp } from '../../../decorators/includeInHelp.decorator';
import { JobResolver } from '../../../entity/job/job.resolver';
import { CogView2Service } from '../../../services/commands/art/cog-view-2/cog-view-2.service';
import { CogView2CommandDto } from './cog-view-2.dto';

/**
 * Command generating art form prompt based on cog view 2 model.
 *
 * @classdesc Top level command handling generation of images based on THUDM CogView2 model.
 * @example /ai-art cog-view2
 * @author Karafra
 * @since 1.4.5
 */
@IncludeInHelp({
  name: '/ai-art cog-view-2',
  description:
    'Generates collage of 9 images from given prompt using CogView2 model.',
  usage:
    '/ai-art cog-view-2 prompt: Homer Simpson in the scream by edward munch',
  parameters: [
    {
      name: 'prompt',
      description: 'Description of images',
    },
    {
      name: 'style',
      description: 'style in which image is to be drawn',
    },
  ],
})
@SubCommand({
  name: 'cog-view2',
  description: 'generate AiArt based on given prompt using dall-e mini model',
})
@Injectable()
@UsePipes(TransformPipe)
export class CogView2Command
  implements DiscordTransformedCommand<CogView2CommandDto>
{
  private readonly logger = new Logger(CogView2Command.name);

  /** Service service handling web requests to api.
   *
   * @param sentryService service handling error reporting
   * @param jobResolver database resolver for jobs entity
   * @param cogView2Service service handling image generation for cogView2 mode
   *
   * @see JobResolver
   */
  public constructor(
    private readonly jobResolver: JobResolver,
    private readonly cogView2Service: CogView2Service,
    @InjectSentry() private readonly sentryService: SentryService,
  ) {}

  /**
   * Handles command call.
   *
   * @param dto dto containing all parameters of command.
   * @param executionContext full execution context.
   */
  public async handler(
    @Payload() dto: CogView2CommandDto,
    executionContext: TransformedCommandExecutionContext<any>,
  ): Promise<void> {
    this.logger.debug('cog-view-2 command called');
    await executionContext.interaction.deferReply();
    this.sentryService.instance().addBreadcrumb({
      category: 'Commands',
      level: 'info',
      message: '/ai-art cog-view-2 command called',
    });
    try {
      const { attachment, dbRecord } = await this.cogView2Service.getArt(
        dto.prompt,
        dto.style,
      );
      this.sentryService.instance().addBreadcrumb({
        category: 'Commands',
        level: 'info',
        message: 'cogView2 collage generated',
      });
      await executionContext.interaction.deleteReply();
      const message = await executionContext.interaction.channel.send({
        files: [attachment],
        content: `<@${executionContext.interaction.user.id}> \n\n :art: ${dto.prompt} :frame_photo:`,
      });
      dbRecord.messageId = message.id;
      dbRecord.messageLink = message.url;
      await this.jobResolver.create(dbRecord);
      this.logger.debug('Cog-view-2 command execution finished successfully');
    } catch (err) {
      this.logger.error(
        `Cog-view-2 mini command failed with exception: ${err.message}`,
      );
      this.sentryService.instance().captureException(err);
      await executionContext.interaction.followUp(
        `:frowning: could not process this query \`${dto.prompt}\`. Please try later.`,
      );
    }
  }
}
