// 医院信息本地持久化工具
export interface HospitalInfo {
  name: string;
  logoUrl: string;
}

const KEY = 'hospital_info';

export function getHospitalInfo(): HospitalInfo | null {
  const str = localStorage.getItem(KEY);
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export function setHospitalInfo(info: HospitalInfo) {
  localStorage.setItem(KEY, JSON.stringify(info));
}

export function removeHospitalInfo() {
  localStorage.removeItem(KEY);
}
