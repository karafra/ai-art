require('dotenv').config({ path: `.env` });

export interface EnvironmentObject {
  environment: 'development' | 'production';
  token: string;
  botId: string;
}

export const environment = {
  environment: process.env.NODE_ENV ?? 'production',
  token: process.env.TOKEN ?? '',
  botId: process.env.BOTID ?? '',
} as EnvironmentObject;
