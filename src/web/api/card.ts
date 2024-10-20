import request from '@/web/utils';

export default {
  // 获取卡号
  get(data: any) {
    return request.get('/temp/list', data);
  },
  // 清除暂存区的数据
  clear() {
    return request.post('/temp/clear');
  },
};
