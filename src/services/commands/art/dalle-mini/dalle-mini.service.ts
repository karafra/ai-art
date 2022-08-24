import { Injectable, Logger } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { Queued } from '../../../../decorators/queued.decorator';
import { CouldNotGenerateArtException } from '../../../../exceptions/CouldNotGenerateArtException';
import { AiArtModel } from '../../../../models/ai-art/ai-art.model';
import { MessageAttachmentWithDbRecord } from '../../../../types/extensions/MessageAttachmentWithDbRecord';
import { Collage } from '../../../../utilities/collage/collage';
import { CreateJobInput } from '../../../../entity/job/dto/create-job.input';

/**
 * Class handling image generation from given prompt.
 *
 * @class
 * @classdesc Service handling image generation based on *Dalle mini* model
 * @author Karafra
 * @since 2.0.0
 * @link https://huggingface.co/spaces/dalle-mini/dalle-mini
 */
@Injectable()
export class DalleMiniService {
  private readonly logger = new Logger(DalleMiniService.name);

  /**
   * DI constructor. Not intended to be sed directly.
   *
   * @param dalleMiniModel model handling web requests for CogView2 model
   * @param collage service handling collage generation
   * @param sentryService service handling performance and/or error logging
   */
  public constructor(
    private readonly collage: Collage,
    private readonly dalleMiniModel: AiArtModel,
    @InjectSentry()
    private readonly sentryService: SentryService,
  ) {}

  /**
   * Generates art from given prompt. For examples refer to {@link https://huggingface.co/spaces/dalle-mini/dalle-mini dalle mini website}.
   *
   * @param prompt prompt describing the image.
   * @example await this.dalleMiniService.getArt("Lowecraftian monster");
   */
  @Queued(DalleMiniService.name)
  public async getArt(
    prompt: string,
  ): Promise<MessageAttachmentWithDbRecord<CreateJobInput>> {
    this.logger.debug(`Started processing art for ${prompt}`);
    this.sentryService.instance().addBreadcrumb({
      category: 'Service',
      level: 'debug',
      message: `Started processing art for ${prompt}`,
    });
    for (let i = 0; i < 30; i++) {
      try {
        const response = await this.dalleMiniModel.getImageArray(prompt);
        await this.collage.constructCollage(response);
        this.sentryService.instance().addBreadcrumb({
          category: 'Service',
          level: 'debug',
          message: `Generated collage for ${prompt}`,
        });
        const attachment = this.collage.getAsAttachment();
        return new MessageAttachmentWithDbRecord(attachment, {
          images: response,
        });
      } catch (err) {
        this.sentryService.instance().addBreadcrumb({
          level: 'debug',
          category: 'Service',
          message: `Could not generate art for ${prompt} on try ${i}. Retrying`,
        });
        await new Promise((f) => setTimeout(f, 3000));
      }
    }
    this.sentryService.instance().addBreadcrumb({
      level: 'error',
      category: 'Service',
      message: `Could not generate art for ${prompt}.`,
    });
    throw new CouldNotGenerateArtException(DalleMiniService.name, prompt);
  }
}
