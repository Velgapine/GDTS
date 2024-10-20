import request from '@/web/utils';

const administrator = {
  // 获取管理员信息
  getList(data: any) {
    return request.get('/sys/list', data);
  },
  // 保存管理员信息
  save(data: any) {
    return request.post('/sys/save', data);
  },
  // 删除管理员
  remove(id: number) {
    return request.post(`/sys/remove?id=${id}`);
  },
};

export default administrator;
