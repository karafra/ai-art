import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { AxiosResponse } from 'axios';
import { GoogleApiAuthResponse } from '../../../types/api/wombo-dream';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthenticationToolkitError } from '../../../exceptions/GoogleAuthenticationToolkitError';

/**
 * Authentication model for wombo dream image generation service
 *
 * @since 2.1.5
 * @author Karafra
 */
@Injectable()
export class AuthModel {
  private readonly logger = new Logger(AuthModel.name);

  public constructor(
    private readonly httpService: HttpService,
    @InjectSentry()
    private readonly sentryService: SentryService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Gets authentication response for wombo art.
   *
   * @returns AxiosResponse axios response containing authentication token for wombo art
   */
  public async authenticate(): Promise<AxiosResponse<GoogleApiAuthResponse>> {
    this.sentryService.instance().addBreadcrumb({
      level: 'debug',
      category: 'model',
      message: 'Authenticating for wombo art',
    });
    this.logger.debug('Authenticating for wombo art');
    try {
      const response = await this.httpService.axiosRef.post(
        this.configService.get<string>('wombo-dream.googleAuthUrl'),
        {},
      );
      this.sentryService.instance().addBreadcrumb({
        level: 'debug',
        category: 'model',
        message: 'Authentication for wombo art completed successfully',
      });
      return response;
    } catch (err) {
      this.sentryService.instance().captureException(err);
      this.logger.error(err.message);
      throw new GoogleAuthenticationToolkitError(err.message);
    }
  }

  /**
   * Returns authentication token for wombo art.
   *
   * @return token authentication token for wombo art
   */
  public async getAuthentication(): Promise<GoogleApiAuthResponse> {
    const response = await this.authenticate();
    return response.data;
  }
}
