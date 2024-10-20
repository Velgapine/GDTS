import { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosIntance {
    (config: AxiosRequestConfig): Promise<any>;
  }
}
