const urlList = ['127.0.0.1', '47.115.149.217', '36.133.226.32'];
const env = import.meta.env.MODE || process.env.NODE_ENV;
const apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL;

let baseUrl = '';
if (apiBaseUrl) {
  baseUrl = apiBaseUrl;
} else if (env === 'development') {
  baseUrl = `http://${urlList[0]}:8610`;
} else if (typeof window !== 'undefined' && window.httpUrl) {
  baseUrl = window.httpUrl.slice(0, -1);
} else {
  baseUrl = '';
}

export default baseUrl; 