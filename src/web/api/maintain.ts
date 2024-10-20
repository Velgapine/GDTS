import request from '@/web/utils';

export default {
  // 查询
  getList(data: any) {
    return request.get('/logMaintain/list', data);
  },
  // 送修录入
  save(data: any) {
    return request.post('/logMaintain/save', data);
  },
  // 送修完成
  update(data: any) {
    return request.post('/logMaintain/update', data);
  },
};
