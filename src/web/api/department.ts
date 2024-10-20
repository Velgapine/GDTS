import request from '@/web/utils';

const department = {
  getList() {
    return request.get(`/dept/list`);
  },
  update(data: any) {
    return request.post('/dept/update', data);
  },
  remove(deptId: string) {
    return request.post('/dept/remove', { id: deptId });
  },
  save(data: any) {
    return request.post('/dept/save', data);
  },
};

export default department;
