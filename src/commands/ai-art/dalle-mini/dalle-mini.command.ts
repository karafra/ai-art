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
import { DalleMiniService } from '../../../services/commands/art/dalle-mini/dalle-mini.service';
import { DalleMiniCommandDto } from './dalle-mini.dto';

@IncludeInHelp({
  name: '/ai-art dalle-mini',
  description:
    'Generates collage of 9 images from given prompt using Dall-E ini model.',
  usage: '/ai-art dalle-mini prompt: Liberty leading people to freedom',
  parameters: [
    {
      name: 'prompt',
      description: 'Description of image',
    },
  ],
})
@SubCommand({
  name: 'dalle-mini',
  description: 'generate AiArt based on given prompt using dall-e mini model',
})
@Injectable()
@UsePipes(TransformPipe)
export class DalleMiniCommand
  implements DiscordTransformedCommand<DalleMiniCommandDto>
{
  private readonly logger = new Logger(DalleMiniCommand.name);

  public constructor(
    private readonly dalleMiniService: DalleMiniService,
    @InjectSentry() private readonly sentryService: SentryService,
  ) {}

  public async handler(
    @Payload() dto: DalleMiniCommandDto,
    executionContext: TransformedCommandExecutionContext<any>,
  ): Promise<void> {
    this.logger.debug('Dalle mini command called');
    await executionContext.interaction.deferReply();
    this.sentryService.instance().addBreadcrumb({
      category: 'Commands',
      level: 'info',
      message: '/ai-art dalle-mini command called',
    });
    try {
      const collage = await this.dalleMiniService.getArt(dto.prompt);
      this.sentryService.instance().addBreadcrumb({
        category: 'Commands',
        level: 'info',
        message: 'dalle-mini collage generated',
      });
      await executionContext.interaction.deleteReply();
      await executionContext.interaction.channel.send({
        files: [collage],
        content: `<@${executionContext.interaction.user.id}> \n\n :art: ${dto.prompt} :frame_photo:`,
      });
      this.logger.debug('Dalle mini command execution finished successfully');
    } catch (err) {
      this.logger.error(
        `Dalle mini command failed with exception: ${err.message}`,
      );
      this.sentryService.instance().captureException(err);
      await executionContext.interaction.followUp(
        `:frowning: could not process this query \`${dto.prompt}\`. Please try later.`,
      );
    }
  }
}
