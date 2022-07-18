import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiArtModel } from './ai-art/ai-art.model';
import { AiStoryModel } from './ai-story/ai-story.model';
import { CogView2Model } from './cog-view-2/cog-view-2.model';

@Module({
  providers: [AiStoryModel, AiArtModel, CogView2Model],
  imports: [HttpModule, ConfigModule],
  exports: [AiArtModel, AiStoryModel, CogView2Model],
})
export class ModelsModule {}
