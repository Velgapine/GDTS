import request from '@/web/utils';

const hospital = {
  // 获取医院信息列表
  getList() {
    return request.get('/hospital/info/list');
  },

  // 获取单个医院信息
  getInfo(id: number) {
    return request.get(`/hospital/info?id=${id}`);
  },

  // 保存医院信息（新增）
  save(data: any) {
    return request.post('/hospital/info/save', data);
  },

  // 更新医院信息
  update(data: any) {
    return request.post('/hospital/info/update', data);
  },

  // 删除医院信息
  remove(id: number) {
    return request.post('/hospital/info/remove', { id });
  },

  // 上传医院Logo
  uploadLogo(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/hospital/uploadLogo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // 删除上传医院Logo
  deleteLogo(logoUrl: string) {
    return request.post('/hospital/deleteLogo', { logoUrl });
  }
};

export default hospital;
