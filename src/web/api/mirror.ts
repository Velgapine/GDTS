import request from '@/web/utils';

const mirror = {
  getList(data: any) {
    return request.get('/scope/pageList', data);
  },
  update(data: any) {
    return request.post('/scope/update', data);
  },
  save(data: any) {
    return request.post('/scope/save', data);
  },
  // 弃用
  remove(id: string) {
    return request.post('scope/remove', { id });
  },
  //解绑
  unbind(id: string) {
    return request.post('scope/unbind', { id });
  },
  // 从数据库中删除
  del(id: string) {
    return request.post('scope/delete', { id });
  },
};

export default mirror;
