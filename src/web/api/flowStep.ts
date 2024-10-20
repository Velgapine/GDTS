import request from '@/web/utils';

export default {
  getList() {
    return request.get('/mFlowName/list');
  },
  save(data: any) {
    return request.post('/mFlowName/save', data);
  },
  update(data: any) {
    return request.post('/mFlowName/update', data);
  },
  remove(id: number) {
    return request.post('/mFlowName/remove', { id });
  },
};
