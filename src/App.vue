<template>
  <div id="app">
    <ElConfigProvider :locale="zhCn">
      <router-view></router-view>
    </ElConfigProvider>
  </div>
</template>

<script lang="ts" setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
</script>

<style lang="scss">
// 引入全局sass变量
@import '@/assets/scss/var.scss';
// 引入重置样式
@import '@/assets/scss/reset.css';
body {
  font-family: 'Noto Sans SC';
  font-style: normal;
}
// 禁止图片拖动
img {
  pointer-events: none;
}
</style>
