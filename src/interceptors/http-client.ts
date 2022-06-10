import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export abstract class HttpClient {
  readonly instance: AxiosInstance;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL
    });

    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(this._handleResponse, this._handleError);
  };

  private _handleResponse = (data: AxiosResponse<any>) => data;

  protected _handleError = (error: Error | AxiosError<any, { data: { message: string } }>) =>
    Promise.reject(error);
}
