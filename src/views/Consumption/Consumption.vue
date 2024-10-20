<template>
  <header>
    <div class="title">耗材管理</div>
    <div class="sub-title">
      <span>耗材管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>耗材信息</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </header>
  <div class="container">
    <div class="title-box">
      <div class="title">耗材信息</div>
    </div>
    <div class="content-box">
      <el-row :gutter="20" align="middle" class="title-row">
        <el-col :span="6">
          <el-input placeholder="搜索内镜" :suffix-icon="Search" size="large"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model.number="isSter" placeholder="未选择" @change="changeTable">
            <el-option label="消毒液" :value="true" />
            <el-option label="酶洗液" :value="false" />
          </el-select>
        </el-col>
        <el-col :span="10" class="text">
          <el-icon><Filter /></el-icon>
          <span>筛选</span>
        </el-col>
        <el-col :span="4">
          <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)">{{
            isSter ? '添加消毒液' : '添加酶洗液'
          }}</my-btn>
        </el-col>
      </el-row>
      <!-- 消毒液表格 -->
      <el-table v-if="isSter" :data="tableList.data" style="width: 100%">
        <el-table-column prop="sterilizeName" label="名称"></el-table-column>
        <el-table-column prop="sterilizeMinTime" label="最小消毒时间" />
        <el-table-column prop="scopescopeTypeId" label="关联内镜类型" />
        <el-table-column prop="comment" label="备注" />
        <el-table-column prop="updateAt" label="更新时间" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <div class="operate-btn">
              <span>查看</span>
              <span @click="modify(row)">编辑</span>
              <span>删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 酶洗液表格 -->
      <el-table v-else :data="tableList.data" style="width: 100%">
        <el-table-column prop="enzymeName" label="名称"></el-table-column>
        <el-table-column prop="flowMinTime" label="最小洗消时间" />
        <el-table-column prop="scopescopeTypeId" label="关联内镜类型" />
        <el-table-column prop="comment" label="备注" />
        <el-table-column prop="updateAt" label="更新时间" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <div class="operate-btn">
              <span>查看</span>
              <span @click="modify(row)">编辑</span>
              <span>删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight, Filter, Search } from '@element-plus/icons-vue';
import enzy from '@/web/api/enzyme';
import ster from '@/web/api/sterilize';
import getScope from '@/hooks/getScope';

const isSter = ref(true); // 默认为消毒液
const isModify = ref(false); // 默认为添加

// 切换消毒液/酶洗液
const changeTable = () => {
  isSter.value ? getSterilizeList() : getEnzymeList();
};

// 修改时赋值
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const modify = (row: any) => {
  // Object.assign(ruleForm, row);
  // 每次点击编辑时触发
  isModify.value = true;
};

onMounted(() => {
  ElMessage.warning('耗材管理已停用');
  getScope().then((res) => (scopeOptions.data = res));
  getSterilizeList(); // 默认先显示消毒液
});

// 获取消毒液/酶洗液列表
const tableList = reactive({ data: [] });

const getSterilizeList = async () => {
  // 消毒液
  try {
    const { data } = await ster.getList();
    tableList.data = data;
  } catch (e) {
    console.log(e);
  }
};
const getEnzymeList = async () => {
  // 酶洗液
  try {
    const { data } = await enzy.getList();
    tableList.data = data;
  } catch (e) {
    console.log(e);
  }
};

// 内镜选项
const scopeOptions = reactive({ data: [] });
</script>

<style lang="scss" scoped>
header {
  font-weight: 500;
  font-size: 18px;
  .sub-title {
    margin: 20px 15px;
    font-size: 14px;
    color: #606266;
    .el-icon {
      position: relative;
      top: 2px;
      margin: 0 10px;
      color: #c0c4cc;
    }
  }
}
.container {
  padding: 20px;
  width: 96.7%;
  min-height: 84%;
  background: #ffffff;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  .title-box {
    display: flex;
    justify-content: space-between;
    .title {
      font-weight: 500;
      font-size: 22px;
      line-height: 30px;
      font-feature-settings: 'tnum' on, 'lnum' on;
      color: #303133;
    }
  }
  .content-box {
    .title-row {
      margin: 20px 0;
    }
    .text {
      color: #409eff;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
.operate-btn {
  color: #409eff;
  span {
    padding-left: 10px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
