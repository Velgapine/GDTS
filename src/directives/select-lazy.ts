export default {
  mounted(el: HTMLSelectElement, binding: any) {
    if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
      binding.value();
    }
  },
};
