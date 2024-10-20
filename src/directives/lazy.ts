export default {
  mounted(el: HTMLImageElement) {
    // 获取图片加载地址；
    const imgSrc = el.src;
    // 使图片无法加载
    el.src = '';

    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      // 图片出现在可视区域
      if (isIntersecting) {
        // 加载图片
        el.src = imgSrc;
        // 停止观察
        observer.unobserve(el);
      }
    });
  },
};
