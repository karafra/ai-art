import { Command } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { DalleMiniCommand } from './dalle-mini/dalle-mini.command';
import { CogView2Command } from './cog-view-2/cog-view-2.command';
import { WomboDreamCommand } from './wombo-dream/wombo-dream.command';

@Injectable()
@Command({
  name: 'ai-art',
  description: 'generate images based on prompt',
  include: [DalleMiniCommand, CogView2Command, WomboDreamCommand],
})
export class AiArtCommand {}
