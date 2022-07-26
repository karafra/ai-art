import { Injectable, Logger } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { Queued } from '../../../../decorators/queued.decorator';
import { Job } from '../../../../entity/job/entities/job.entity';
import { JobResolver } from '../../../../entity/job/job.resolver';
import { CouldNotGenerateArtException } from '../../../../exceptions/CouldNotGenerateArtException';
import { CogView2Model } from '../../../../models/cog-view-2/cog-view-2.model';
import { Style } from '../../../../types/api/cogView2';
import { MessageAttachmentWithDbRecord } from '../../../../types/extensions/MessageAttachmentWithDbRecord';
import { Collage } from '../../../../utilities/collage/collage';

@Injectable()
export class CogView2Service {
  private readonly logger = new Logger(CogView2Service.name);

  public constructor(
    private readonly jobResolver: JobResolver,
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

  @Queued(CogView2Service.name)
  public async getArt(
    prompt: string,
    style?: Style,
  ): Promise<MessageAttachmentWithDbRecord<Job>> {
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
      const record = await this.jobResolver.create({
        images: response,
      });
      return new MessageAttachmentWithDbRecord(attachment, record);
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
