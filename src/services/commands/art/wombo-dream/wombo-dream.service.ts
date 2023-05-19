import { Injectable, Logger } from '@nestjs/common';
import { WomboDreamModel } from '../../../../models/wombo-dream/wombo-dream.model';
import { WomboDreamStyle } from '../../../../types/api/wombo-dream';
import { CouldNotGenerateWomboArtException } from '../../../../exceptions/CouldNotGenerateWomboArtException';

/**
 * Service for generation of images using WomboDream model.
 *
 * @author Karafra
 * @since 2.1.5
 */
@Injectable()
export class WomboDreamService {
  private readonly logger = new Logger(WomboDreamService.name);

  /**
   * DI constructor for womboDream service.
   *
   * @param womboDreamModel model for handling wombo dream requests
   */
  public constructor(private readonly womboDreamModel: WomboDreamModel) {}

  /**
   * Generates images from given prompt and style based on WomboDream model.
   *
   * This functions acts as async generator retuning new image until Wombo
   * says image generation is finished or that it has failed in **1.1s** intervals
   *
   * @param prompt prompt describing image
   * @param style style of image
   *
   * @see WomboDreamStyle
   */
  public async *generateArt(
    prompt: string,
    style: WomboDreamStyle = WomboDreamStyle.No_Style,
  ) {
    let jobStatusResponse = await this.womboDreamModel.createArt(prompt, style);
    this.logger.log(`Created task for art ${prompt} in style ${style}`);
    while (jobStatusResponse.state !== 'completed') {
      await new Promise((res) => setTimeout(res, 1_100));
      jobStatusResponse = await this.womboDreamModel.checkArtStatus(
        jobStatusResponse.id,
        jobStatusResponse.token,
      );
      if (jobStatusResponse.state === 'failed') {
        this.logger.error(`Image generation failed`);
        throw new CouldNotGenerateWomboArtException(
          'Wombo art processing failed',
        );
      }
      yield jobStatusResponse;
    }
  }
}
