<template>
  <header>
    <div class="title">设备管理</div>
    <div class="sub-title">
      <span>设备管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>维修管理</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </header>
  <div class="container">
    <div class="title-box">
      <div class="title">
        <span>维修管理</span>
        <el-select v-model="state" class="title-select" @change="getList">
          <el-option label="维修中" :value="0" />
          <el-option label="已维修" :value="1" />
        </el-select>
      </div>
    </div>
    <div class="content-box">
      <!-- 设备展示区 -->
      <el-table v-loading="tableLoad" :data="mtList.data" style="width: 100%">
        <el-table-column label="设备类型">
          <template #default="{ row }">
            {{ row.scopeId ? '内镜' : '洗消设备' }}
          </template>
        </el-table-column>
        <el-table-column label="设备ID">
          <template #default="{ row }">
            {{ row.scopeId ? row.scopeId : row.deviceId }}
          </template>
        </el-table-column>
        <el-table-column label="送修原因" prop="comment" />
        <el-table-column label="开始时间" prop="startTime" />
        <el-table-column label="结束时间" prop="endTime" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <div class="operate-btn">
              <span v-show="state === 0" @click="showDialog(row.scopeId, row.deviceId)">恢复</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 送修完成弹窗 -->
  <el-dialog v-model="mtDialog" v-loading="mtDialogLoad" title="送修完成" width="15%" class="mt-dialog">
    <el-input v-model="comment" placeholder="请输入送修原因" :prefix-icon="ChatLineSquare" style="width: 214px" />
    <div style="height: 10px"></div>
    <el-date-picker v-model="endTime" type="datetime" placeholder="请输入结束时间" value-format="YYYY-MM-DD HH:mm:ss" />
    <div style="height: 10px"></div>
    <el-row justify="center">
      <el-button type="primary" @click="cptMainTain">确定</el-button>
      <el-button @click="mtDialog = false">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowRight, ChatLineSquare } from '@element-plus/icons-vue';
import maintain from '@/web/api/maintain';

const tableLoad = ref(false);
const mtList = reactive({ data: [] });
const state = ref(0);

onMounted(() => {
  getList();
});

const getList = async () => {
  tableLoad.value = true;
  try {
    const { data } = await maintain.getList({ state: state.value });
    mtList.data = data;
  } catch (e) {
    console.log(e);
  }
  tableLoad.value = false;
};

const mtDialog = ref(false);
const mtDialogLoad = ref(false);
const isScope = ref<boolean>();

const scopeId = ref<number>(); // 内镜id
const deviceId = ref<number>(); // 设备id
const comment = ref(''); // 送修原因
const endTime = ref(''); // 结束时间

const showDialog = (sId: number, dId: number) => {
  isScope.value = sId && !dId ? true : false;
  if (isScope.value) scopeId.value = sId;
  else deviceId.value = dId;
  mtDialog.value = true;
};

// 送修完成
const cptMainTain = async () => {
  mtDialogLoad.value = true;
  try {
    if (!comment.value) {
      ElMessage.warning('请输入送修原因');
      throw '空哦';
    }
    if (!endTime.value) {
      ElMessage.warning('请输入结束时间');
      throw '空哦';
    }
    if (isScope.value) {
      const data = {
        scopeId: scopeId.value,
        comment: comment.value,
        endTime: endTime.value,
      };
      await maintain.update(data);
    } else {
      const data = {
        deviceId: deviceId.value,
        comment: comment.value,
        endTime: endTime.value,
      };
      await maintain.update(data);
    }

    // 置空
    comment.value = '';
    endTime.value = '';
    mtDialog.value = false;
    getList();
  } catch (e) {
    console.log(e);
  }
  mtDialogLoad.value = false;
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
      .title-select {
        margin-left: 10px;
        width: 100px;
      }
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

.dialog-title {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  .text {
    font-size: 18px;
    line-height: 44px;
  }
  .name {
    width: 58px;
    height: 24px;
    font-weight: 500;
    font-size: 16px;
    line-height: 46px;
    font-feature-settings: 'tnum' on, 'lnum' on;
    color: #303133;
  }
  .tips {
    padding-left: 20px;
    height: 22px;
    font-weight: 400;
    font-size: 14px;
    line-height: 46px;
    font-feature-settings: 'tnum' on, 'lnum' on;
    color: #000000;
  }
  .el-icon {
    padding-right: 18px;
  }
}
.form {
  padding: 0 16px;
  padding-top: 24px;
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
