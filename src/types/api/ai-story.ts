export type Model =
  | 'davinci'
  | 'davinci-instruct-beta'
  | 'text-davinci-001'
  | 'text-davinci-002'
  | 'text-curie-001'
  | 'text-babage-001'
  | 'text-ada-001';

export interface AiStoryRequest {
  model: Model;
  prompt: string;
  top_p: number;
  best_of: number;
  temperature: number;
  max_tokens: number;
  frequency_penalty: number;
  presence_penalty: number;
}

export interface AiStoryChoices {
  text: string;
  index: number;
  logprobs: number | null;
  finishReason: string;
}

export interface AiStoryResponse {
  id: string;
  object: string;
  created: number;
  model: Model;
  choices: AiStoryChoices[];
}
