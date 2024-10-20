<template>
  <div class="btn" :style="`background: ${color}`">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  color: String,
});

const color = ref(props.color);
</script>

<style lang="scss" scoped>
.btn {
  display: inline-block;
  margin-left: 20px;
  padding: 15px 22px;
  font-size: 14px;
  font-feature-settings: 'tnum' on, 'lnum' on;
  color: #606266;
  &:hover {
    cursor: pointer;
  }
}
</style>
