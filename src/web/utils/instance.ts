import axios from 'axios';

import store from '@/store';
import baseUrl from '@/web/utils/baseUrl';

console.log('当前环境:', import.meta.env.MODE || process.env.NODE_ENV);
console.log('API地址:', baseUrl);

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

    case 5000:
    case 5001:
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
    } else {
      console.log('网络请求失败:', error);
    }
  }
);

export default instance;
