<template>
  <div class="title-box">
    <div>
      <div class="title">您好,</div>
      <div class="title-text">欢迎使用内镜清洗消毒系统</div>
      <div class="text">您需要<span class="weight-text">完善以下信息</span></div>
    </div>
  </div>
  <el-row v-for="(item, index) in cardList" :key="index" :gutter="30">
    <el-col v-for="(e, i) in item" :key="i" :span="6">
      <inf-card :order="e.order" :title="e.title" :text="e.text"></inf-card>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
const cardList = [
  [
    { order: 1, title: '科室管理', text: '创建并修改科室基本信息' },
    { order: 2, title: '用户管理', text: '查看用户注册基本信息' },
    { order: 3, title: '护士管理', text: '添加并修改护士基本信息' },
    { order: 4, title: '洗消室管理', text: '添加并修改洗消室基本信息' },
  ],
  [
    { order: 5, title: '内镜管理', text: '添加并管理消化道内窥镜基本信息' },
    { order: 6, title: '设备管理', text: '管理洗消设备及相关流程管理' },
    // { order: 7, title: '耗材管理', text: '添加并管理酶洗液等耗材信息' },
  ],
];
</script>
<style lang="scss" scoped>
.title-box {
  position: relative;
  margin-bottom: 30px;
  color: #303133;
  .title {
    font-weight: 700;
    font-size: 44px;
    line-height: 60px;
  }
  .title-text {
    font-weight: 700;
    font-size: 30px;
    line-height: 60px;
  }
  .text {
    font-weight: 400;
    font-size: 22px;
    line-height: 30px;
  }
  .weight-text {
    font-size: 28px;
    font-weight: 700;
  }
}
</style>
