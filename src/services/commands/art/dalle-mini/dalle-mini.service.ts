import { Injectable, Logger } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { Queued } from '../../../../decorators/queued.decorator';
import { Job } from '../../../../entity/job/entities/job.entity';
import { JobResolver } from '../../../../entity/job/job.resolver';
import { CouldNotGenerateArtException } from '../../../../exceptions/CouldNotGenerateArtException';
import { AiArtModel } from '../../../../models/ai-art/ai-art.model';
import { MessageAttachmentWithDbRecord } from '../../../../types/extensions/MessageAttachmentWithDbRecord';
import { Collage } from '../../../../utilities/collage/collage';

@Injectable()
export class DalleMiniService {
  private readonly logger = new Logger(DalleMiniService.name);
  public constructor(
    private readonly jobsResolver: JobResolver,
    private readonly collage: Collage,
    private readonly dalleMiniModel: AiArtModel,
    @InjectSentry() private readonly sentryService: SentryService,
  ) {}

  @Queued(DalleMiniService.name)
  public async getArt(
    prompt: string,
  ): Promise<MessageAttachmentWithDbRecord<Job>> {
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
        const record = await this.jobsResolver.create({
          images: response,
        });
        return new MessageAttachmentWithDbRecord(attachment, record);
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
