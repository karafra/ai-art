import { Module } from '@nestjs/common';
import { EntityModule } from '../entity/entity.module';
import { BotGateway } from './discord/discord.gateway';

@Module({
  providers: [BotGateway],
  imports: [EntityModule],
  exports: [BotGateway],
})
export class GatewayModule {}
