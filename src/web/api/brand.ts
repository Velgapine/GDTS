import request from '@/web/utils';

export default {
  getList() {
    return request.get('/scopeBrand/list');
  },
  update(data: any) {
    return request.post('/scopeBrand/update', data);
  },
  save(data: any) {
    return request.post('/scopeBrand/save', data);
  },
  remove(id: number) {
    return request.post(`/scopeBrand/remove?id=${id}`);
  },
};
