import request from '@/web/utils';

const hospital = {
  // 获取医院名称
  getList() {
    return request.get('/hospital/list');
  },
  // 保存医院信息
  save(data: any) {
    return request.post('/hospital/save', data);
  },
};

export default hospital;
