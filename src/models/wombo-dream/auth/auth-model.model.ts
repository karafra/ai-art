import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
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
    private readonly configService: ConfigService,
  ) {}

  /**
   * Gets authentication response for wombo art.
   *
   * @returns AxiosResponse axios response containing authentication token for wombo art
   */
  public async authenticate(): Promise<AxiosResponse<GoogleApiAuthResponse>> {
    this.logger.debug('Authenticating for wombo art');
    try {
      const response = await this.httpService.axiosRef.post<
        GoogleApiAuthResponse,
        any
      >(this.configService.get<string>('wombo-dream.googleAuthUrl'), {});
      return response;
    } catch (err) {
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
