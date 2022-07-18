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
import { AiStoryService } from '../../../services/commands/story/ai-story/ai-story.service';
import { OpenAiCommandDto } from './open-ai.dto';

@IncludeInHelp({
  name: '/ai-story story',
  description: 'Generates story from given headline',
  usage: '/ai-story story headline: Tell me story about Alice in wonderland',
  parameters: [
    {
      name: 'headline',
      description: 'Headline of story',
    },
    {
      name: 'model',
      description: 'What model to use',
      optional: true,
    },
  ],
})
@SubCommand({
  name: 'open-ai',
  description: 'Generate short story based on openAiModel of your choosing ',
})
@Injectable()
@UsePipes(TransformPipe)
export class OpenAiCommand
  implements DiscordTransformedCommand<OpenAiCommandDto>
{
  private readonly logger = new Logger(OpenAiCommand.name);

  public constructor(
    private readonly aiStoryService: AiStoryService,
    @InjectSentry() private readonly sentryService: SentryService,
  ) {}

  public async handler(
    @Payload() dto: OpenAiCommandDto,
    { interaction }: TransformedCommandExecutionContext<any>,
  ): Promise<void> {
    this.logger.debug('/ai-story open-ai command called');
    await interaction.deferReply();
    this.sentryService.instance().addBreadcrumb({
      category: 'Commands',
      level: 'info',
      message: '/ai-story open-ai command called',
    });
    try {
      const story = await this.aiStoryService.getArt(dto.headline, dto.model);
      this.sentryService.instance().addBreadcrumb({
        category: 'Commands',
        level: 'info',
        message: '/ai-story open-ai story generated',
      });
      await interaction.followUp(story);
      this.logger.debug('Open-ai command execution finished successfully');
    } catch (err) {
      this.logger.error(
        `Open-ai command failed with exception: ${err.message}`,
      );
      this.sentryService.instance().captureException(err);
      await interaction.followUp(
        `:frowning: Could not process prompt due to internal error (${err.message}). Please try later.`,
      );
    }
  }
}
