import { Injectable, Logger } from '@nestjs/common';
import {
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import { TransformPipe } from '@discord-nestjs/common';
import { IncludeInHelp } from '../../../decorators/includeInHelp.decorator';
import { WomboDreamDto } from './wombo-dream.dto';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { JobResolver } from '../../../entity/job/job.resolver';
import { WomboDreamService } from '../../../services/commands/art/wombo-dream/wombo-dream.service';
import {
  WomboDreamStyle,
  WomboDreamTaskResponse,
} from '../../../types/api/wombo-dream';
import { Message } from 'discord.js';

/**
 * Command container for /ai-art wombo-dream command.
 *
 * @author Karafra
 * @since 2.1.5
 */
@IncludeInHelp({
  name: '/ai-art wombo-dream',
  description: 'generates NFT based on wombo dream model',
  usage: '/ai-art wombo-dream prompt: Salvatore Dali on Mars',
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
  name: 'wombo-dream',
  description: 'generate AiArt based on given prompt using wombo dream model',
})
@UsePipes(TransformPipe)
@Injectable()
export class WomboDreamCommand {
  private readonly logger = new Logger(WomboDreamCommand.name);

  /**
   * DI constructor for wombo-art command.
   *
   * @param sentryService error and performance logging service.
   * @param jobResolver database resolver saving final images
   * @param womboDreamService service handling art generation
   */
  public constructor(
    @InjectSentry()
    private readonly sentryService: SentryService,
    private readonly jobResolver: JobResolver,
    private readonly womboDreamService: WomboDreamService,
  ) {}

  /**
   * Command interaction handler.
   * @param dto dto containing prompt and style of the art
   * @param interaction interaction invoking command
   */
  public async handler(
    @Payload() dto: WomboDreamDto,
    { interaction }: TransformedCommandExecutionContext,
  ) {
    this.logger.debug('WomboDream command called');
    await interaction.deferReply();
    this.sentryService.instance().addBreadcrumb({
      category: 'command',
      level: 'info',
      message: `Starting processing art for prompt "${dto.prompt} based on model WomboDream"`,
    });
    let reply: Message | any, finalResponse: WomboDreamTaskResponse;
    try {
      for await (const response of this.womboDreamService.generateArt(
        dto.prompt,
        WomboDreamStyle.getByName(dto.style),
      )) {
        if (response.photo_url_list.length === 0) {
          continue;
        }
        reply = await interaction.editReply({
          content: `:hourglass: Processing art for ${dto.prompt} :hourglass:`,
          files: [
            {
              attachment:
                response.photo_url_list[response.photo_url_list.length - 1],
              name: 'WomboDream.png',
            },
          ],
        });
        finalResponse = response;
      }
      await interaction.editReply({
        content: `:art: ${dto.prompt} :frame_photo: `,
      });
      await this.jobResolver.create({
        messageLink: reply.url,
        messageId: reply.id,
        images: [
          finalResponse.photo_url_list[finalResponse.photo_url_list.length - 1],
        ],
      });
      this.sentryService.instance().addBreadcrumb({
        category: 'command',
        level: 'debug',
        message: `Finished processing art for prompt ${dto.prompt} based on model WomboDream`,
      });
    } catch (err) {
      this.sentryService.instance().addBreadcrumb({
        category: 'command',
        level: 'error',
        message: `Could not process art for ${dto.prompt} based on model WomboDream due to internal error (${err.message})`,
      });
      await interaction.editReply({
        content: `:frowning: Could not process art for "${dto.prompt}" due to internal error (${err.message})`,
        // Delete non final files.
        files: [],
      });
      this.sentryService.instance().captureException(err);
    }
  }
}
