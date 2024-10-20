import cham from '@/web/api/wash';

export default async () => {
  try {
    const { data: res } = await cham.getList();
    const chamOptions = res.map((e: { chamberName: any; id: any }) => {
      const { chamberName, id } = e;
      return { chamberName, id };
    });
    return chamOptions;
  } catch (e) {
    console.log(e);
  }
};
