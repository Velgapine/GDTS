import axiosInstance from './instance';

const request = {
  get(url: string, data?: any, cancelRequest?: any) {
    return axiosInstance.get(url, {
      params: data,
      ...(cancelRequest !== undefined && cancelRequest),
    });
  },
  post(url: string, data?: any, config?: any) {
    return axiosInstance.post(url, data, config);
  },
  put(url: string, data: any, config?: any) {
    return axiosInstance.put(url, data, config);
  },
  download(url: string, data: any, method: string) {
    const param = method ? 'data' : 'params';
    const headers = method ? { 'Content-Type': 'application/json' } : { 'Content-Type': 'application/octet-stream' };
    return axiosInstance(url, {
      responseType: 'blob',
      headers,
      method,
      [param]: data,
    });
  },
};

export default request;
