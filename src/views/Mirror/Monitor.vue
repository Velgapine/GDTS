<template>
  <div class="container">
    <div v-loading="load" class="content-box">
      <div class="step-card">
        <div class="inf">
          <div class="step" @click="stepDialog = true">
            <el-icon size="22px"><Setting /></el-icon>步骤：
          </div>
        </div>
        <div class="show">
          <div class="table">
            <div v-for="(obj, i) in stepList" :key="i" class="item">
              <div class="name">{{ obj.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-for="(item, index) in list"
        :key="index"
        class="monitor-card"
        @click="toSingle(item.scopeId, item.scopeName, item.matchId)"
      >
        <div class="inf" :class="{ blueName: item.isMachineWash }">
          <div class="name">{{ item.scopeName }}</div>
          <div class="date">{{ item.beginTime }}</div>
        </div>
        <div class="show">
          <div class="table">
            <div v-for="(e, i) in item.step" :key="i" class="item">
              <div
                class="time"
                :class="{
                  finish: e.state === 0,
                  ing: e.state === 1,
                  skip: e.state === 2,
                  mach: e.state === 3,
                }"
              >
                {{ e.time !== '' ? e.time : e.time }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="stepDialog" v-loading="dialogLoad" title="洗消步骤管理" width="40%" class="step-dialog">
      <el-button :icon="Plus" class="add-btn" @click="add" />
      <el-table :data="stepList" style="width: 100%">
        <el-table-column label="次序">
          <template #default="{ row }">
            <el-input v-model.number="row.orders" clearable />
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template #default="{ row }">
            <el-input v-model="row.name" placeholder="请输入步骤名称" clearable />
          </template>
        </el-table-column>
        <el-table-column prop="updateAt" label="更新时间" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <div class="operate-btn">
              <span @click="modify(row)">保存</span>
              <span @click="remove(row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Setting, Plus } from '@element-plus/icons-vue';
import record from '@/web/api/washRecord';
import flowStep from '@/web/api/flowStep';
import confirm from '@/utils/confirm';
import { ElMessage } from 'element-plus/lib/components';

const load = ref(false);
const dialogLoad = ref(false);

const stepDialog = ref(false); // 是否显示洗消步骤弹窗

// 定时器
let timer = setInterval(() => {
  getList();
}, 5000);

onMounted(async () => {
  await getStepList();
  await getList();
});

onUnmounted(() => {
  clearInterval(timer);
});

// 洗消步骤管理
const stepList = ref<any[]>([]);

const getStepList = async () => {
  dialogLoad.value = true;
  try {
    const { data } = await flowStep.getList();
    stepList.value = data;
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

const add = async () => {
  dialogLoad.value = true;
  try {
    await confirm('您确定要添加吗？');
    const data = { orders: stepList.value[stepList.value.length - 1].orders + 1, name: '' };
    console.log(data);
    await flowStep.save(data);
    await getStepList();
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

const modify = async (row: any) => {
  dialogLoad.value = true;
  try {
    await confirm('您确定要保存吗？');
    await flowStep.update(row);
    await getStepList();
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

const remove = async (id: number) => {
  dialogLoad.value = true;
  try {
    await confirm('您确定要删除吗？');
    await flowStep.remove(id);
    await getStepList();
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

// 获取正在清洗的内镜
const list = ref<any[]>();

const getList = async () => {
  load.value = true;
  try {
    const { data } = await record.getScopeIng({});
    list.value = data.map(
      (item: {
        step: { serial: number; time: string; state: number }[];
        beginTime: string;
        isMachineWash: boolean;
      }) => {
        // 确认正在执行的数据 (第一个undefined以前的数据)
        const step = item.step; // 旧的step
        item.beginTime = step[0].time.slice(0, 11); // 记录流程起始时间
        const isMachine = item.isMachineWash; // 是否为机洗
        let arr = []; // 新的step数组（为了方便完整显示）
        let len = step.length; // 旧的step的长度（可以不为6）
        const first = step[0].serial; // 记录起始步骤的serial
        const last = step[len - 1].serial; // 记录最后步骤的serial
        /*
         * state：number
         * 0:已结束
         * 1：进行中
         * -1： 未开始
         * 2：跳过
         * 3：机洗中省略的步骤
         */
        // stepList为固定5长度的数组
        for (let i = 1; i <= stepList.value.length; i++) {
          // 先全部设置成未开始（默认情况）
          arr[i - 1] = {
            serial: i,
            time: '',
            state: -1,
          };
          step.forEach((obj: { serial: number; time: string }) => {
            // 有的步骤则赋值
            if (i === obj.serial) {
              arr[i - 1] = {
                serial: obj.serial,
                time: obj.time.slice(11),
                state: 0,
              };
            }
          });
          // 不在头和尾，时间还为空则为跳过步骤
          if (i < last && arr[i - 1].time === '') {
            arr[i - 1].state = 2;
          }
          // 机洗步骤的省略步骤
          if (isMachine && i > first && i < last) {
            arr[i - 1].state = 3;
            arr[i - 1].time = '';
          }
          // 最后一步为正在进行中的步骤
          i === last && (arr[last - 1].state = 1);
        }
        item.step = arr;
        return item;
      }
    );
    ElMessage.success('更新成功');
  } catch (e) {
    console.log(e);
  }
  load.value = false;
};

// toSingle
const router = useRouter();
const toSingle = (scopeId: string, scopeName: string, matchId: string) => {
  router.push({
    name: 'MirrorSingle',
    query: {
      id: scopeId,
      name: scopeName,
      recordId: matchId,
      t: Date.now(),
    },
  });
};
</script>

<style lang="scss" scoped>
header {
  font-weight: 500;
  font-size: 18px;
  .title {
    margin-bottom: 20px;
  }
}
.container {
  padding: 20px;
  width: 96.7%;
  min-height: 84%;
  background: #ffffff;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  .content-box {
    .monitor-card {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
      background: #ffffff;
      border: 1px solid #ebeef5;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 24px;
      &:hover {
        cursor: pointer;
      }
      .inf {
        display: flex;
        width: 10%;
        flex-direction: column;
        align-items: center;
        margin-right: 2%;
        div {
          font-size: 22px;
          font-weight: 700;
        }
        .name {
          font-size: 26px;
          padding-bottom: 20px;
        }
      }
      .show {
        display: flex;
        flex-direction: column;
        width: 85%;
        .table {
          display: flex;
          justify-content: space-between;
          width: 100%;
          .time {
            width: 145.438px;
            height: 80px;
            text-align: center;
            line-height: 80px;
            font-weight: 600;
            font-size: 20px;
            border-radius: 5px;
          }
          .finish {
            background: linear-gradient(180deg, #38f9d6 0%, #3ef0a4 59.17%, #6dee99 100%);
          }
          .skip {
            background: #d0cece;
          }
          .ing {
            background: yellow;
          }
          .mach {
            background: #409eff;
          }
        }
      }
    }
    .blueName {
      color: #fff;
      background: #409eff;
      padding: 6px 0;
      border-radius: 5px;
    }
    .step-card {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding: 20px 20px;
      width: 100%;
      box-sizing: border-box;
      background: #ffffff;
      border: 1px solid #ebeef5;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 18px;
      .inf {
        display: flex;
        width: 10%;
        flex-direction: column;
        align-items: center;
        margin-right: 2%;
        .step {
          font-weight: 600;
          font-size: 18px;
          .el-icon {
            position: relative;
            top: 4px;
            padding-right: 5px;
          }
          &:hover {
            cursor: pointer;
            color: #409eff;
          }
        }
      }
      .show {
        display: flex;
        flex-direction: column;
        width: 85%;
        .table {
          display: flex;
          justify-content: space-between;
          width: 100%;
          .name {
            width: 145.438px;
            text-align: center;
            font-weight: 600;
            font-size: 18px;
          }
        }
      }
    }
  }
}

.el-dialog {
  position: relative !important;
  .add-btn {
    position: absolute;
    right: 20px;
    z-index: 999;
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
