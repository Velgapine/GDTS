/**
 * 转换时间格式
 * 如：2000-01-06T18:32:29.000+00:00
 * 转换成：2000-01-06 18:32:29
 */
export default (time: string) => {
  const d = new Date(time);
  const newTime =
    d.getFullYear() +
    '-' +
    (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
    '-' +
    d.getDate() +
    ' ' +
    d.getHours() +
    ':' +
    d.getMinutes() +
    ':' +
    d.getSeconds();
  return newTime;
};
