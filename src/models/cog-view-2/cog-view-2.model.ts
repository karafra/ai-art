import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import {
  CogView2Response,
  ICogView2Request,
  ICogView2Response,
  ICogView2ResponseAcknowledged,
  Style,
} from '../../types/api/cogView2';

@Injectable()
export class CogView2Model {
  public constructor(private readonly httpService: HttpService) {}

  public async getResponse(
    prompt: string,
    style?: Style,
  ): Promise<AxiosResponse<ICogView2Response>> {
    const styleUsed: Style = style || 'mainbody';
    let response = (await this.httpService.axiosRef.post(
      'https://hf.space/embed/THUDM/CogView2/api/queue/push/',
      {
        fn_index: 0,
        data: [
          prompt,
          false,
          styleUsed,
          Math.floor(Math.random() * (2400 - 2) + 2),
          true,
          9,
        ],
        action: 'predict',
        session_hash: Math.random().toString(36).slice(2, 12),
        headers: {
          Accept: 'application/json',
        },
      } as ICogView2Request,
    )) as AxiosResponse<ICogView2ResponseAcknowledged & ICogView2Response>;
    const hash = response.data.hash;
    while (
      (response = await this.httpService.axiosRef.post(
        'https://hf.space/embed/THUDM/CogView2/api/queue/status/',
        { hash },
      )).data.status !== 'COMPLETE'
    ) {
      await new Promise((f) => setTimeout(f, 500));
    }
    return response as AxiosResponse<ICogView2Response>;
  }

  public async getImageArray(
    prompt: string,
    style?: Style,
  ): Promise<
    [string, string, string, string, string, string, string, string, string]
  > {
    const response = await this.getResponse(prompt, style);
    return new CogView2Response('COMPLETE', response.data.data).getImageArray();
  }
}
