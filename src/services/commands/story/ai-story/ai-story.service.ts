import { Injectable, Logger } from '@nestjs/common';
import { CouldNotGenerateArtException } from '../../../../exceptions/CouldNotGenerateArtException';
import { AiStoryModel } from '../../../../models/ai-story/ai-story.model';
import { Model } from '../../../../types/api/ai-story';

@Injectable()
export class AiStoryService {
  private readonly logger = new Logger(AiStoryService.name);

  public constructor(private readonly aiStoryModel: AiStoryModel) {}

  public async getArt(headline: string, model?: Model): Promise<string> {
    this.logger.debug(`Generating ${headline} in style ${model}`);
    try {
      return await this.aiStoryModel.getStory(headline, model);
    } catch (err) {
      throw new CouldNotGenerateArtException(
        AiStoryService.name,
        headline,
        model as string,
      );
    }
  }
}
