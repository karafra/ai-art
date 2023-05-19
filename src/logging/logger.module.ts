import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiArtLoggerService } from './ai-art-logger.service';

@Module({
  imports: [ConfigModule],
  providers: [AiArtLoggerService],
  exports: [AiArtLoggerService],
})
export class LoggerModule {}
