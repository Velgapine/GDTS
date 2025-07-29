import hospital from '@/web/api/hospital';
import { setHospitalInfo } from './hospitalInfo';
// 获取baseURL
import baseUrl from '@/web/utils/baseUrl';
// 全局获取医院信息方法
export async function fetchHospitalInfo() {
  try {
    const response = await hospital.getList();
    if (response.data) {
      let data = response.data;
      // 检查不同的数据结构可能性
      if (Array.isArray(data)) {
        // 过滤掉没有name字段的数据
        const validData = data.filter(item => item && (item.name || item.hospitalName));
        if (validData.length > 0) {
          const hospitalData = validData[0]; // 取第一个有效数据
          let logoUrl = hospitalData.logoUrl || hospitalData.logo || '';
          // 如果是相对路径，使用API的baseURL拼接完整URL
          if (logoUrl && typeof logoUrl === 'string' && logoUrl.startsWith('/')) {
            logoUrl = baseUrl + logoUrl;
          }
          setHospitalInfo({
            name: hospitalData.name || hospitalData.hospitalName || '',
            logoUrl: logoUrl
          });
          // location.reload();
          return true;
        }
      } else if (data && typeof data === 'object' && (data.name || data.hospitalName)) {
        // 如果是单个有效对象
        let logoUrl = data.logoUrl || data.logo || '';
        if (logoUrl && typeof logoUrl === 'string' && logoUrl.startsWith('/')) {
          logoUrl = baseUrl + logoUrl;
        }
        setHospitalInfo({
          name: data.name || data.hospitalName || '',
          logoUrl: logoUrl
        });
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('获取医院信息失败:', error);
    return false;
  }
}

// 导出baseUrl供其他模块使用
export { baseUrl };
