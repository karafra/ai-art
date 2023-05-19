import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolveDynamicProviders } from 'nestjs-dynamic-providers';
import { AiArtLoggerService } from './logging/ai-art-logger.service';

async function bootstrap() {
  await resolveDynamicProviders();
  const app = await NestFactory.create(AppModule);
  const configurationService: ConfigService =
    app.get<ConfigService>(ConfigService);
  const logger = app.get(AiArtLoggerService);
  app.useLogger(logger);
  const port = configurationService.get<number>('deploy.port', 5000);
  await app.listen(port, () => logger.log(`🚀 App running on port ${port}`));
}

bootstrap().catch((err) => console.error(err));
