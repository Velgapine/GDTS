import request from '@/web/utils';

const wash = {
  getList() {
    return request.get('/cham/list');
  },
  update(data: any) {
    return request.post('/cham/update', data);
  },
  save(data: any) {
    return request.post('/cham/save', data);
  },
  remove(chamberId: string) {
    return request.post('cham/remove', { id: chamberId });
  },
};

export default wash;
