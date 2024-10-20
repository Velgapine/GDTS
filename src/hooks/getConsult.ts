import consult from '@/web/api/consult';

export default async () => {
  try {
    const { data: res } = await consult.getList({});
    const consultOptions = res.map((obj: { consultingRoomName: any; ip: any }) => {
      const { consultingRoomName, ip } = obj;
      return { consultingRoomName, ip };
    });
    return consultOptions;
  } catch (e) {
    console.log(e);
  }
};
