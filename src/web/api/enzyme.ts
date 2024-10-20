import request from '@/web/utils';

export default {
  getList() {
    return request.get('/enzyme/list');
  },
  update(data: any) {
    return request.post('/enzyme/update', data);
  },
  save(data: any) {
    return request.post('/enzyme/save', data);
  },
  remove(typeId: string) {
    return request.post('enzyme/remove', { id: typeId });
  },
};
