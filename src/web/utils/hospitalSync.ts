import { fetchHospitalInfo } from './globalHospitalInfo';

// 医院信息同步工具
export class HospitalInfoSync {
  /**
   * 同步医院信息到本地缓存
   * @param showMessage 是否显示成功提示，默认false
   * @returns Promise<boolean> 同步是否成功
   */
  static async sync(showMessage: boolean = false): Promise<boolean> {
    try {
      const success = await fetchHospitalInfo();
      if (success && showMessage) {
        console.log('医院信息同步成功');
      }
      return success;
    } catch (error) {
      console.error('医院信息同步失败:', error);
      return false;
    }
  }

  /**
   * 强制刷新医院信息（用于数据更新后）
   * @returns Promise<boolean> 刷新是否成功
   */
  static async refresh(): Promise<boolean> {
    return this.sync(false);
  }
}

// 导出便捷方法
export const syncHospitalInfo = HospitalInfoSync.sync;
export const refreshHospitalInfo = HospitalInfoSync.refresh; 