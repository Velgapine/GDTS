import scope from '@/web/api/mirror';

export default async () => {
  try {
    const { data: res } = await scope.getList({});
    const scopeOptions = res.map((e: { scopeName: any; id: any }) => {
      const { scopeName, id } = e;
      return { scopeName, id };
    });
    return scopeOptions;
  } catch (e) {
    console.log(e);
  }
};
