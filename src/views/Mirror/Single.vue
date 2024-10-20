<template>
  <header>
    <div class="title">设备管理</div>
    <div class="sub-title">
      <span>设备管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>内镜管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>{{ name }}</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </header>
  <section>
    <div class="title-box">
      <div class="title">{{ name }}</div>
      <div class="btn-group">
        <my-btn :color="`#fff`" class="border-btn" @click="back">返回</my-btn>
      </div>
    </div>
    <div class="content-box">
      <!-- 洗消表格 -->
      <el-table v-loading="tableLoad" :data="recordList.data">
        <el-table-column prop="scopeName" label="胃镜名称" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <span v-if="row.state === 1">已结束</span>
            <span v-else-if="row.state === 0" style="color: #409eff">进行中</span>
            <span v-else style="color: #ff3333">异常</span>
          </template>
        </el-table-column>
        <el-table-column label="洗消模式">
          <template #default="{ row }">
            <span v-if="row.machineWash === 0">非机洗</span>
            <span v-else style="color: #409eff">机洗</span>
          </template>
        </el-table-column>
        <el-table-column prop="beginAt" label="起始时间" />
        <el-table-column prop="finishTime" label="结束时间" />
        <!-- <el-table-column prop="time" label="洗消时长(单位：秒)" /> -->
        <el-table-column prop="staffName" label="洗消人员" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <div class="operate-btn">
              <span @click="getMatch(row.matchId)">查看</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 流程各设备记录 -->
    <el-dialog v-model="recordDialog" v-loading="tableLoad" title="各设备洗消记录" width="80%">
      <el-table :data="matchList.data" style="width: 100%">
        <el-table-column prop="serial" label="顺序" width="50" />
        <el-table-column prop="deviceName" label="名称" />
        <el-table-column label="使用状态" width="80">
          <template #default="{ row }">
            <span v-if="row.difState === 1" style="color: #409eff">正常</span>
            <span v-else-if="row.difState === -1" style="color: #ff3333">异常</span>
            <span v-else style="color: #ffd966">进行中</span>
          </template>
        </el-table-column>
        <el-table-column prop="beginAt" label="起始时间" />
        <el-table-column prop="time" label="洗消时长(单位：秒)" />
        <el-table-column prop="minTime" label="最小洗消时间(单位：秒)" />
        <el-table-column prop="maxTime" label="最大洗消时间(单位：秒)" />
        <el-table-column prop="machineNum" label="机号" />
        <el-table-column prop="typeName" label="设备类型" />
        <el-table-column label="维修状态" width="80">
          <template #default="{ row }">
            <span v-if="row.state === 0">正常</span>
            <span v-else style="color: #ff3333">维修中</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue';
import record from '@/web/api/washRecord';

// 是否加载中
const tableLoad = ref(false);

// 显示各设备消毒记录
const recordDialog = ref(false);

// 获取路由传参的数据
const route = useRoute();

const name = route.query.name;
const id = route.query.id;
const recordId = route.query.recordId;

onMounted(() => {
  getList();
  if (typeof recordId !== 'undefined') {
    getMatch(<string>recordId);
  }
});

// 获取洗消记录
const recordList = reactive({
  data: [],
});

const getList = async () => {
  tableLoad.value = true;
  try {
    const { data } = await record.getList({ scopeId: id });
    recordList.data = data.page.records;
  } catch (e) {
    console.log(e);
  }
  tableLoad.value = false;
};

// 查看每条记录的详细信息
const matchList = reactive({
  data: [],
});

const getMatch = async (id: string) => {
  tableLoad.value = true;
  try {
    const { data } = await record.getMatchRecord({ matchId: id });
    matchList.data = data.deviceList;
    recordDialog.value = true;
  } catch (e) {
    console.log(e);
  }
  tableLoad.value = false;
};
// 路由返回
const router = useRouter();

const back = () => {
  router.go(-1);
};
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
section {
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
    .btn-group {
      display: flex;
      .border-btn {
        border: 1px solid #e4e7ed;
      }
    }
  }
  .content-box {
    margin-top: 20px;
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
