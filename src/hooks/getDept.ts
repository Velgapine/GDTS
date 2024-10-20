import dept from '@/web/api/department';

export default async () => {
  try {
    const { data: res } = await dept.getList();
    const deptOptions = res.map((e: { deptName: any; id: any }) => {
      const { deptName, id } = e;
      return { deptName, id };
    });
    return deptOptions;
  } catch (e) {
    console.log(e);
  }
};
