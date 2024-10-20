export default (Obj: any) => {
  const obj = toRefs(Obj);
  Object.keys(obj).forEach((key) => {
    obj[key].value = '';
  });
};
