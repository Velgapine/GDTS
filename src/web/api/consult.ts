import request from '@/web/utils';

export default {
  getList(data: any) {
    return request.get('/consultingRoom/list', data);
  },
  save(data: any) {
    return request.post('/consultingRoom/save', data);
  },
  update(data: any) {
    return request.post('/consultingRoom/update', data);
  },
  remove(id: number) {
    return request.post('/consultingRoom/remove', { id });
  },
};
