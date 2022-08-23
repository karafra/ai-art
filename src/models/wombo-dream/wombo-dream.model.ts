import { AuthModel } from './auth/auth-model.model';
import { HttpService } from '@nestjs/axios';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import {
  IWomboDreamStyle,
  WomboDreamStyle,
  WomboDreamTaskResponse,
  WomboTaskIdResponse,
} from '../../types/api/wombo-dream';
import { ConfigService } from '@nestjs/config';

export class WomboDreamModel {
  private readonly API_URL;

  public constructor(
    private readonly authModel: AuthModel,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectSentry()
    private readonly sentryService: SentryService,
  ) {
    this.API_URL = configService.get<string>('wombo-dream.api.url');
  }

  public async createArt(
    prompt: string,
    style: IWomboDreamStyle = WomboDreamStyle.No_Style,
    frequency = 20,
  ): Promise<WomboDreamTaskResponse> {
    const { idToken } = await this.authModel.getAuthentication();
    this.sentryService.instance().addBreadcrumb({
      category: 'Model',
      level: 'debug',
      message: 'Creating Wombo task',
    });
    const { id } = await this.getTaskId(idToken);
    const response = await this.httpService.axiosRef.put(
      `${this.configService.get<string>('wombo-dream.api.url')}/tasks/${id}`,
      {
        input_spec: {
          prompt,
          style: style.value,
          display_freq: frequency,
        },
      },
      {
        headers: this.defineWomboHeaders(idToken),
      },
    );
    this.sentryService.instance().addBreadcrumb({
      category: 'Model',
      level: 'debug',
      message: 'Created Wombo task',
    });
    response.data.token = idToken;
    return response.data;
  }

  public async checkArtStatus(
    id: string,
    token: string,
  ): Promise<WomboDreamTaskResponse> {
    this.sentryService.instance().addBreadcrumb({
      category: 'model',
      level: 'debug',
      message: `Checking status of job with id ${id}`,
    });
    const { data } = await this.httpService.axiosRef.get(
      `${this.configService.get<string>('wombo-dream.api.url')}/tasks/${id}`,
      {
        headers: this.defineWomboHeaders(token),
      },
    );
    this.sentryService.instance().addBreadcrumb({
      category: 'model',
      level: 'debug',
      message: `Job with id ${id} is currently "${data.state}"`,
    });
    data.token = token;
    return data;
  }

  private defineWomboHeaders(token: string): any {
    return {
      Origin: 'https://app.wombo.art',
      Referer: 'https://app.wombo.art/',
      Authorization: 'bearer ' + token,
      'Content-Type': 'text/plain;charset=UTF-8',
      service: 'Dream',
    };
  }

  private async getTaskId(token: string): Promise<WomboTaskIdResponse> {
    const response = await this.httpService.axiosRef.post(
      `${this.configService.get<string>('wombo-dream.api.url')}/tasks/`,
      { premium: false },
      {
        headers: this.defineWomboHeaders(token),
      },
    );
    return response.data;
  }
}
