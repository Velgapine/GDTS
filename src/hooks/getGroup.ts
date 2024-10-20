import flow from '@/web/api/washProcess';

export default async () => {
  try {
    const { data: res } = await flow.getList();
    const flowOptions = res.map((e: { flowName: any; id: any; groupId: any }) => {
      const { flowName, id, groupId } = e;
      return { flowName, id, groupId };
    });
    return flowOptions;
  } catch (e) {
    console.log(e);
  }
};
