require('dotenv').config({ path: `.env` })

/**
 * Environment for casing environment.
 *
 * @author Karafra
 * @since 1.0
 */
export interface EnvironmentObject {
  environment: 'development' | 'production'
  token: string
  botId: string
  openAiToken: string
}

export const environment = {
  environment: process.env.NODE_ENV ?? 'production',
  token: process.env.TOKEN ?? '',
  botId: process.env.BOTID ?? '',
  openAiToken: process.env.OPEN_API_TOKEN ?? ''
} as EnvironmentObject
