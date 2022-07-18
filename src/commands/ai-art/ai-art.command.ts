import { Command } from '@discord-nestjs/core';
import { CogView2Command } from './cog-view-2/cog-view-2.command';
import { DalleMiniCommand } from './dalle-mini/dalle-mini.command';

@Command({
  name: 'ai-art',
  description: 'generate images based on prompt',
  include: [DalleMiniCommand, CogView2Command],
})
export class AiArtCommand {}
