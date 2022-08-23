import { Command } from '@discord-nestjs/core';
import { CogView2Command } from './cog-view-2/cog-view-2.command';
import { DalleMiniCommand } from './dalle-mini/dalle-mini.command';
import { WomboDreamCommand } from './wombo-dream/wombo-dream.command';
import { Injectable } from '@nestjs/common';

@Injectable()
@Command({
  name: 'ai-art',
  description: 'generate images based on prompt',
  include: [DalleMiniCommand, CogView2Command, WomboDreamCommand],
})
export class AiArtCommand {}
