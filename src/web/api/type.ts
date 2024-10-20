import request from '@/web/utils';

export default {
  getList() {
    return request.get('/scopeType/list');
  },
  save(data: any) {
    return request.post('/scopeType/save', data);
  },
  remove(id: string) {
    return request.post('scopeType/remove', { id });
  },
};
