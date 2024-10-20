import request from '@/web/utils';

export default {
  getList() {
    return request.get('/deviceType/list');
  },
  update(data: any) {
    return request.post('/deviceType/update', data);
  },
  save(data: any) {
    return request.post('/deviceType/save', data);
  },
  remove(typeId: string) {
    return request.post('deviceType/remove', { id: typeId });
  },
};
