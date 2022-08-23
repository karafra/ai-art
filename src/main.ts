import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolveDynamicProviders } from 'nestjs-dynamic-providers';

async function bootstrap() {
  await resolveDynamicProviders();
  const app = await NestFactory.create(AppModule);
  const configurationService: ConfigService =
    app.get<ConfigService>(ConfigService);
  const logger = new Logger('Bootstrap');
  const port = configurationService.get<number>('deploy.port', 5000);
  await app.listen(port, () => logger.log(`🚀 App running on port ${port}`));
}

bootstrap();
