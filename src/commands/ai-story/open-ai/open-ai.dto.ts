import { Choice, Param } from '@discord-nestjs/core';

export type M =
  | 'davinci'
  | 'davinci-instruct-beta'
  | 'text-davinci-001'
  | 'text-davinci-002'
  | 'text-curie-001'
  | 'text-babage-001'
  | 'text-ada-001';

export enum Model {
  DAVINCI = 'davinci',
  DAVINCI_INSTRUCT_BETA = 'davinci-instruct-beta',
  TEXT_DAVINCI_001 = 'text-davinci-001',
  TEXT_DAVINCI_002 = 'text-davinci-002',
  TEXT_CURIE_001 = 'text-curie-001',
  TEXT_BABAGE_001 = 'text-babage-001',
  TEXT_ADA_001 = 'text-ada-001',
}

export class OpenAiCommandDto {
  @Param({
    name: 'headline',
    description: 'Headline to generate story from',
    required: true,
    autocomplete: true,
  })
  public headline: string;

  @Choice(Model)
  @Param({
    name: 'model',
    description: 'Model to use for story generation',
    required: true,
    autocomplete: true,
  })
  public model: Model;
}
