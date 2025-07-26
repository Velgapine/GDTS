import request from '@/web/utils';

export default {
  // getList(data: any) {
  //   return request.get('/match/list', data);
  // },
  // update(data: any) {
  //   return request.post('/match/update', data);
  // },
  // 以上为旧接口，以下新接口
  // 获取最新10条记录
  getLast10() {
    return request.get('/logExam2/listLast10');
  },
  // 条件分页查询
  getList(data: any) {
    return request.get('/logExam2/list', data);
  },
  // 添加诊疗记录（暂时不用）
  save(data: any) {
    return request.post('/logExam2/save', data);
  },
  // 批量添加诊疗记录
  saveBatch(dataList: any[]) {
    return request.post('/logExam2/save', dataList);
  },
  // 修改诊疗记录
  update(data: any) {
    return request.post('/logExam2/update', data);
  },
  // 删除诊疗记录
  remove(id: number) {
    return request.get(`/logExam2/remove?id=${id}`);
  },
  // 获取海东二院数据
  search(examNo: string) {
    return request.get(`/haidong/search?examNo=${examNo}`);
  },
  // 导出excel
  excel(data: any) {
    //return request.download('/logExam2/excel', data, 'get');
    const params = new URLSearchParams(data).toString();
    return request.download(`/logExam2/excel?${params}`, {}, 'get');
  },
};
