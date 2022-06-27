import { HttpClient } from '@Http/http-client'
import {
  CogView2Response,
  ICogView2Request,
  ICogView2Response,
  ICogView2ResponseAcknowledged,
  Style
} from '@Types/api/cogView2'
import Utility from '@Utils/utility'
import { AxiosResponse } from 'axios'

export class CogView2Model extends HttpClient {
  public constructor() {
    super('https://hf.space/embed/THUDM/CogView2/api/queue')
  }

  public async getResponse(
    prompt: string,
    style: Style
  ): Promise<AxiosResponse<ICogView2Response>> {
    let response = (await this.instance.post('/push/', {
      fn_index: 0,
      data: [prompt, false, style, Math.floor(Math.random() * (2400 - 2) + 2), true, 9],
      action: 'predict',
      session_hash: Utility.makeId(10),
      headers: {
        Accept: 'application/json'
      }
    } as ICogView2Request)) as AxiosResponse<ICogView2ResponseAcknowledged & ICogView2Response>
    const hash = response.data.hash
    while ((response = await this.instance.post('/status/', { hash })).data.status !== 'COMPLETE') {
      await new Promise((f) => setTimeout(f, 500))
    }
    return response as AxiosResponse<ICogView2Response>
  }

  public async getImageArray(
    prompt: string,
    style: Style = 'mainbody'
  ): Promise<[string, string, string, string, string, string, string, string, string]> {
    const response = await this.getResponse(prompt, style)
    return new CogView2Response('COMPLETE', response.data.data).getImageArray()
  }
}

export const cog2Model = new CogView2Model()
