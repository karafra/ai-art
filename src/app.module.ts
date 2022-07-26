import { DiscordModule } from '@discord-nestjs/core';
import { AmqpModule } from '@karafra/nestjs-amqp';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { Intents } from 'discord.js';
import { CommandsModule } from './commands/commands.module';
import yamlConfigurationLoader from './config/yamlConfigurationLoader';
import { ModelsModule } from './models/models.module';
import { ServicesModule } from './services/services.module';
import { UtilitiesModule } from './utilities/utilities.module';
import { ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityModule } from './entity/entity.module';
import { Job } from './entity/job/entities/job.entity';
import { BotGateway } from './gateway/discord/discord.gateway';
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
        release: configService.get<string>('sentry.release.name'),
        environment: 'production',
      }),
      inject: [ConfigService],
    }),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('discord.token'),
        discordClientOptions: {
          intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
          ],
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        auto_reconnect: true,
        useUnifiedTopology: true,
        entities: [Job],
        url: configService.get<string>('mongo.uri'),
        logging: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    }),
    ConfigModule.forRoot({
      load: [yamlConfigurationLoader],
    }),
    CommandsModule,
    UtilitiesModule,
    EntityModule,
  ],
  controllers: [],
  providers: [BotGateway],
})
export class AppModule {}
