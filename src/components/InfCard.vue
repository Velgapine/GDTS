<template>
  <div class="box">
    <div class="order">{{ order }}</div>
    <div class="title">{{ title }}</div>
    <div class="text">{{ text }}</div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  order: Number,
  title: String,
  text: String,
});
const { order, title, text } = toRefs(props);
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  margin-bottom: 30px;
  width: 257px;
  height: 242px;
  background: #ffffff;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 22.2565px;
  .order {
    position: absolute;
    top: 32px;
    left: 25px;
    height: 22px;
    font-weight: 700;
    font-size: 64px;
    line-height: 22px;
    font-feature-settings: 'tnum' on, 'lnum' on;
    color: rgba(56, 249, 214, 0.6);
  }
  .title {
    position: absolute;
    top: 71px;
    left: 50%;
    transform: translate(-50%, 0);
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    color: #303133;
  }
  .text {
    position: absolute;
    bottom: 71px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 158px;
    height: 46px;
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;
    color: #606266;
  }
}
</style>
