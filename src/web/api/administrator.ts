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
  // 修改密码
  updatePassword(data: any) {
    return request.post('/sys/updatePassword', data);
  },
};

export default administrator;
