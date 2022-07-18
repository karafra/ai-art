import { Injectable, Logger } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { CouldNotGenerateArtException } from '../../../../exceptions/CouldNotGenerateArtException';
import { AiStoryModel } from '../../../../models/ai-story/ai-story.model';
import { Model } from '../../../../types/api/ai-story';

@Injectable()
export class AiStoryService {
  private readonly logger = new Logger(AiStoryService.name);

  public constructor(
    private readonly aiStoryModel: AiStoryModel,
    @InjectSentry() private readonly sentryService: SentryService,
  ) {
    sentryService.instance().addBreadcrumb({
      category: 'Service',
      level: 'debug',
      message: 'AiStoryService service bootstrapped',
    });
  }

  public async getArt(headline: string, model?: Model): Promise<string> {
    this.sentryService.instance().addBreadcrumb({
      level: 'debug',
      category: 'Service',
      message: 'Started story generation',
    });
    this.logger.debug(`Generating ${headline} in style ${model}`);
    try {
      const response = await this.aiStoryModel.getStory(headline, model);
      this.sentryService.instance().addBreadcrumb({
        level: 'debug',
        message: 'Story generation finished',
        category: 'Service',
      });
      return response;
    } catch (err) {
      this.sentryService.instance().addBreadcrumb({
        category: 'Service',
        level: 'error',
        message: `Failed to generate story ${headline}`,
      });
      throw new CouldNotGenerateArtException(
        AiStoryService.name,
        headline,
        model as string,
      );
    }
  }
}
