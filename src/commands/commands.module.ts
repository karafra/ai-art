import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EntityModule } from '../entity/entity.module';
import { ServicesModule } from '../services/services.module';
import { AiArtCommand } from './ai-art/ai-art.command';
import { CogView2Command } from './ai-art/cog-view-2/cog-view-2.command';
import { DalleMiniCommand } from './ai-art/dalle-mini/dalle-mini.command';
import { AiStoryCommand } from './ai-story/ai-story.command';
import { OpenAiCommand } from './ai-story/open-ai/open-ai.command';
import { HelpCommand } from './help/help.command';

@Module({
  providers: [
    // Images
    AiArtCommand,
    DalleMiniCommand,
    CogView2Command,
    // Stories/ text based art
    AiStoryCommand,
    OpenAiCommand,
    // Help
    HelpCommand,
  ],
  imports: [
    ServicesModule,
    DiscordModule.forFeature(),
    ConfigModule,
    EntityModule,
  ],
})
export class CommandsModule {}
