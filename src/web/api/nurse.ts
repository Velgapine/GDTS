import request from '@/web/utils';

const nurse = {
  // 员工信息查找
  getList() {
    return request.get(`/staff/list`);
  },
  // 员工信息录入
  save(data: any) {
    return request.post('/staff/save', data);
  },
  // 员工信息修改
  update(data: any) {
    return request.post('/staff/update', data);
  },
  // 员工解雇
  remove(id: string) {
    return request.post('/staff/remove', { id });
  },
  // 从数据库中删除
  del(id: string) {
    return request.post('/staff/delete', { id });
  },
};

export default nurse;
