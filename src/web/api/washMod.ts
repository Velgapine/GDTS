import request from '@/web/utils';

export default {
  getList() {
    return request.get('/mFlowMode/list');
  },
  update(data: any) {
    return request.post('/mFlowMode/update', data);
  },
  save(data: any) {
    return request.post('/mFlowMode/save', data);
  },
  remove(typeId: string) {
    return request.post('mFlowMode/remove', { id: typeId });
  },
};
