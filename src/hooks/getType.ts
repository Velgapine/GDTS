import devType from '@/web/api/category';

export default async () => {
  try {
    const { data: res } = await devType.getList();
    const devTypeOptions = res.map((e: { typeName: any; id: any }) => {
      const { typeName, id } = e;
      return { typeName, id };
    });
    return devTypeOptions;
  } catch (e) {
    console.log(e);
  }
};
