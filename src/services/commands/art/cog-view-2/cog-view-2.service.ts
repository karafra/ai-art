import { Injectable, Logger } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { Queued } from '../../../../decorators/queued.decorator';
import { CouldNotGenerateArtException } from '../../../../exceptions/CouldNotGenerateArtException';
import { CogView2Model } from '../../../../models/cog-view-2/cog-view-2.model';
import { Style } from '../../../../types/api/cogView2';
import { MessageAttachmentWithDbRecord } from '../../../../types/extensions/MessageAttachmentWithDbRecord';
import { Collage } from '../../../../utilities/collage/collage';
import { CreateJobInput } from '../../../../entity/job/dto/create-job.input';

/**
 * Class handling image generation from given prompt
 *
 * @classdesc Service handling image generation based on *THUDM CogView2* model
 * @author Karafra
 * @since 1.4.5
 * @link https://github.com/THUDM/CogView2
 */
@Injectable()
export class CogView2Service {
  private readonly logger = new Logger(CogView2Service.name);

  /**
   * DI constructor, not intended to be called directly
   *
   * @param cogView2Model model handling web requests for CogView2 model
   * @param collage service handling collage generation
   * @param sentryService service handling performance and/or error logging
   */
  public constructor(
    private readonly cogView2Model: CogView2Model,
    private readonly collage: Collage,
    @InjectSentry() private readonly sentryService: SentryService,
  ) {
    sentryService.instance().addBreadcrumb({
      category: 'Service',
      level: 'info',
      message: 'CogView2 service bootstrapped',
    });
  }

  /**
   * Generates image collage from given prompt in given style. See {@link https://github.com/THUDM/CogView2 github} for more examples.
   *
   * @param prompt prompt describing image
   * @param style style in which image should be generated
   * @example cogView2Service.getArt("Adam and eve in the garden of eden");
   */
  @Queued(CogView2Service.name)
  public async getArt(
    prompt: string,
    style?: Style,
  ): Promise<MessageAttachmentWithDbRecord<CreateJobInput>> {
    this.sentryService.instance().addBreadcrumb({
      level: 'debug',
      category: 'Service',
      message: 'Started collage generation',
    });
    this.logger.debug(`Generating ${prompt} in style ${style}`);
    try {
      const response = await this.cogView2Model.getImageArray(prompt, style);
      await this.collage.constructCollage(response);
      this.sentryService.instance().addBreadcrumb({
        level: 'debug',
        message: 'Image generation finished',
        category: 'Service',
      });
      const attachment = this.collage.getAsAttachment();
      return new MessageAttachmentWithDbRecord(attachment, {
        images: response,
      });
    } catch (err) {
      this.sentryService.instance().addBreadcrumb({
        category: 'Service',
        level: 'error',
        message: `Failed to generate art ${prompt}`,
      });
      throw new CouldNotGenerateArtException(
        CogView2Service.name,
        prompt,
        style as string,
      );
    }
  }
}
