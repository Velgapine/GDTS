import request from '@/web/utils';

export default {
  // 分页查询
  getList(data: any) {
    return request.get('/washRecord/listNew', data);
  },
  // 正在洗消中的镜子
  getScopeIng(data: any) {
    return request.get('/washRecord/scopeIng', data);
  },
  // 下载记录
  download(data: any) {
    // return request.download('/down/excel', data, 'get');
    const params = new URLSearchParams(data).toString();
    return request.download(`/down/excelNew?${params}`, {}, 'get');
  },
  getScopeRecord(data?: any) {
    return request.get('/washRecord/scope', data);
  },
  getMatchRecord(data: any) {
    return request.get('/washRecord/match', data);
  },
  getByScopeName(name: string) {
    return request.get('/washRecord/scopeName', { scopeName: name });
  },
  getByStaffName(name: string) {
    return request.get('/washRecord/staffName', { staffName: name });
  },
  // 新增：流程状态更新
  update(data: any) {
    return request.post('/washRecord/update', data);
  },
  // 新增：手动触发洗消记录同步汇总生成
  generateSummary() {
    return request.post('/washRecord/generateSummary');
  },
};
