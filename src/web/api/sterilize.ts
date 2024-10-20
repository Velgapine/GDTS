import request from '@/web/utils';

export default {
  getList() {
    return request.get('/sterilize/list');
  },
  update(data: any) {
    return request.post('/sterilize/update', data);
  },
  save(data: any) {
    return request.post('/sterilize/save', data);
  },
  remove(typeId: string) {
    return request.post('sterilize/remove', { id: typeId });
  },
};
