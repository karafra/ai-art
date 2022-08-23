import { Command } from '@discord-nestjs/core';
import { OpenAiCommand } from './open-ai/open-ai.command';
import { Injectable } from '@nestjs/common';

@Injectable()
@Command({
  name: 'ai-story',
  description: 'Generate random AI based story',
  include: [OpenAiCommand],
})
export class AiStoryCommand {}
