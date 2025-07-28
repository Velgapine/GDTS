import axios from 'axios';

import store from '@/store';

console.log(process.env.NODE_ENV);

const urlList = ['127.0.0.1', '47.115.149.217', '36.133.226.32'];

const baseUrl = process.env.NODE_ENV === 'development' ? `http://${urlList[0]}:8610` : window.httpUrl;

// 设置post方法的请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 创建一个新的axios实例
const instance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
});

// 设置状态码回调提示
const errorHandle = (code: number, msg: string) => {
  switch (code) {
    case 4000:
      ElMessage.success(msg);
      break;

    case 5000 || 5001:
      ElMessage.error(msg);
      break;

    case 5002:
      ElMessage.warning(msg);
      break;

    case 5011:
      ElMessage.error(msg);
      break;

    case 5010:
      ElMessage.error(msg);
      break;
  }
};

// 配置请求拦截器
instance.interceptors.request.use(
  (config: any) => {
    const token = store.state.token;
    token && (config.headers.token = token);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 配置响应拦截器
instance.interceptors.response.use(
  (response) => {
    const data = response.data;
    const code = data?.code;
    const msg = data.msg;
    if (msg !== '操作成功' && msg !== '获取列表成功') errorHandle(code, msg);
    return data;
  },

  (error) => {
    const { response } = error;

    if (axios.isCancel(error)) {
      console.log(`已取消重复的请求：${error.msg}`);
    } else if (response) {
      errorHandle(response.status, response.data.msg);

      return Promise.reject(response);
    } else console.log(1);
  }
);

export default instance;
