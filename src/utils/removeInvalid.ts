export default (obj: any) => {
  Object.keys(obj).forEach((item) => {
    // 移除对象中 空字符、undefined、null
    if ((!obj[item] && obj[item] != 0) || typeof obj[item] === 'undefined' || obj[item] === '') {
      delete obj[item];
    }
  });
  return obj;
};
