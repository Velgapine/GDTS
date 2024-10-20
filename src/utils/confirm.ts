export default (tips: string) =>
  new Promise((resolve) => {
    ElMessageBox.confirm(tips, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        ElMessage.info('已取消');
      });
  });
