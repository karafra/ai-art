import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EntityModule } from '../entity/entity.module';
import { ServicesModule } from '../services/services.module';
import { InjectDynamicProviders } from 'nestjs-dynamic-providers';
import { LoggerModule } from '../logging/logger.module';

@InjectDynamicProviders('dist/**/*.command.js')
@Module({
  imports: [
    ServicesModule,
    DiscordModule.forFeature(),
    ConfigModule,
    EntityModule,
    LoggerModule,
  ],
})
export class CommandsModule {}
