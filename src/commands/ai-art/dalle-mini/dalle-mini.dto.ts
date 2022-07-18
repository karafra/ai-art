import { Param } from '@discord-nestjs/core';

export class DalleMiniCommandDto {
  @Param({
    name: 'prompt',
    description: 'Prompt to generate image from',
    required: true,
    autocomplete: true,
  })
  public prompt: string;
}
