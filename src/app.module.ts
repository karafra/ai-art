import { DiscordModule } from '@discord-nestjs/core';
import { AmqpModule } from '@karafra/nestjs-amqp';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { Intents } from 'discord.js';
import { CommandsModule } from './commands/commands.module';
import yamlConfigurationLoader from './config/yamlConfigurationLoader';
import { ModelsModule } from './models/models.module';
import { ServicesModule } from './services/services.module';
import { UtilitiesModule } from './utilities/utilities.module';
@Module({
  imports: [
    ModelsModule,
    ServicesModule,
    ConfigModule.forRoot(),
    AmqpModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get<string>('amqp.url'),
      }),
      inject: [ConfigService],
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dsn: configService.get<string>('sentry.dsn'),
        logLevels: ['debug'],
        environment: 'production',
      }),
      inject: [ConfigService],
    }),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('discord.token'),
        discordClientOptions: {
          intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [yamlConfigurationLoader],
    }),
    CommandsModule,
    UtilitiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
