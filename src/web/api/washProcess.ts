import request from '@/web/utils';

export default {
  getList() {
    return request.get('/mFlow/list');
  },
  update(data: any) {
    return request.post('/mFlow/update', data);
  },
  save(data: any) {
    return request.post('/mFlow/save', data);
  },
  remove(typeId: string) {
    return request.post('mFlow/remove', { id: typeId });
  },
};
