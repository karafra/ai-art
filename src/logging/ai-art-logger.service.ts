import { Injectable, LoggerService } from '@nestjs/common';
import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { ConfigService } from '@nestjs/config';
import ecsFormat from '@elastic/ecs-winston-format';

@Injectable()
export class AiArtLoggerService implements LoggerService {
  private readonly LogLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  };

  private readonly logger: winston.Logger;

  public constructor(private readonly configService: ConfigService) {
    this.logger = winston.createLogger({
      level: 'info',
      levels: this.LogLevels,
      transports: [
        new winston.transports.File({
          filename: './logs/ai-art.log',
          level: 'debug',
          format: ecsFormat(),
        }),
        new winston.transports.Console({
          level: 'info',
          format: ecsFormat(),
        }),
        new ElasticsearchTransport({
          index: 'ai-art',
          level: 'debug',
          clientOpts: {
            auth: {
              username: configService.get<string>('elastic.username'),
              password: configService.get<string>('elastic.password'),
            },
            node: configService.get<string>('elastic.uri'),
          },
        }),
      ],
    });
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    this.logger.log(message);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message);
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message);
  }
}
