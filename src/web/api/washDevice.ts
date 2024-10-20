import request from '@/web/utils';

export default {
  getList() {
    return request.get('/device/list');
  },
  update(data: any) {
    return request.post('/device/update', data);
  },
  save(data: any) {
    return request.post('/device/save', data);
  },
  remove(typeId: string) {
    return request.post('device/remove', { id: typeId });
  },
};
