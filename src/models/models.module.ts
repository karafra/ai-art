import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiArtModel } from './ai-art/ai-art.model';
import { AiStoryModel } from './ai-story/ai-story.model';
import { CogView2Model } from './cog-view-2/cog-view-2.model';
import { AuthModel } from './wombo-dream/auth/auth-model.model';
import { WomboDreamModel } from './wombo-dream/wombo-dream.model';

@Module({
  providers: [
    AiStoryModel,
    AiArtModel,
    CogView2Model,
    WomboDreamModel,
    AuthModel,
  ],
  imports: [HttpModule, ConfigModule],
  exports: [AiArtModel, AiStoryModel, CogView2Model, WomboDreamModel],
})
export class ModelsModule {}
