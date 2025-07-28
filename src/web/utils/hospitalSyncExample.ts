// 医院信息同步使用示例
import { syncHospitalInfo, refreshHospitalInfo } from './hospitalSync';

/**
 * 使用示例：
 * 
 * 1. 在任意Vue组件中导入并使用：
 * 
 * import { syncHospitalInfo } from '@/web/utils/hospitalSync';
 * 
 * // 在需要同步医院信息的地方调用
 * const handleSyncHospitalInfo = async () => {
 *   const success = await syncHospitalInfo(true); // 显示成功提示
 *   if (success) {
 *     console.log('医院信息已同步到本地缓存');
 *   }
 * };
 * 
 * 2. 在数据更新后强制刷新：
 * 
 * import { refreshHospitalInfo } from '@/web/utils/hospitalSync';
 * 
 * const handleDataUpdate = async () => {
 *   // 更新数据的逻辑
 *   await updateHospitalData();
 *   
 *   // 同步到本地缓存
 *   await refreshHospitalInfo();
 * };
 * 
 * 3. 在页面加载时同步：
 * 
 * onMounted(async () => {
 *   await syncHospitalInfo();
 * });
 * 
 * 4. 在定时器中定期同步：
 * 
 * let syncTimer: any = null;
 * 
 * onMounted(() => {
 *   // 每5分钟同步一次医院信息
 *   syncTimer = setInterval(async () => {
 *     await syncHospitalInfo();
 *   }, 5 * 60 * 1000);
 * });
 * 
 * onUnmounted(() => {
 *   if (syncTimer) {
 *     clearInterval(syncTimer);
 *   }
 * });
 */

export {
  syncHospitalInfo,
  refreshHospitalInfo
}; 