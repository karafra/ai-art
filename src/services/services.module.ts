import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EntityModule } from '../entity/entity.module';
import { ModelsModule } from '../models/models.module';
import { UtilitiesModule } from '../utilities/utilities.module';
import { AmqpService } from './amqp/amqp.service';
import { CogView2Service } from './commands/art/cog-view-2/cog-view-2.service';
import { DalleMiniService } from './commands/art/dalle-mini/dalle-mini.service';
import { HelpService } from './commands/help/help.service';
import { AiStoryService } from './commands/story/ai-story/ai-story.service';
import { WomboDreamService } from './commands/art/wombo-dream/wombo-dream.service';

@Module({
  providers: [
    CogView2Service,
    DalleMiniService,
    AiStoryService,
    AmqpService,
    HelpService,
    WomboDreamService,
  ],
  exports: [
    CogView2Service,
    DalleMiniService,
    AiStoryService,
    AmqpService,
    HelpService,
    WomboDreamService,
  ],
  imports: [ModelsModule, UtilitiesModule, ConfigModule, EntityModule],
})
export class ServicesModule {}
