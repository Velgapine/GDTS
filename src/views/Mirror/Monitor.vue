<template>
  <div class="container">
    <div v-loading="load" class="content-box">
      <div class="step-card">
        <div class="inf">
          <div class="step" @click="stepDialog = true">
            <el-icon size="22px"> <Setting /> </el-icon>步骤：
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
          <div v-if="item.name" class="patient">病人：{{ item.name }}</div>
          <div class="date">{{ item.beginTime }}</div>
          <div v-if="machineWashTimes[item.scopeId]" class="machine-time">
            <span style="color: #409eff">机洗已用：</span
            ><span style="color: #409eff">{{ machineWashTimes[item.scopeId] }}</span>
          </div>
        </div>
        <div class="show">
          <div class="table">
            <div v-for="(e, i) in item.step" :key="i" class="item">
              <div
                class="time"
                :class="{
                  ing: e.state === 0,
                  finish: e.state === 1,
                  skip: e.state === 2,
                  mach: e.state === 3,
                }"
              >
                {{ e.time || '--:--:--' }}
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
import { watch } from 'vue';

const load = ref(false);
const dialogLoad = ref(false);

const stepDialog = ref(false); // 是否显示洗消步骤弹窗

// 新增：机洗时间map
const machineWashTimes = ref<Record<string, string>>({});
let timer: any = null;
let dataTimer: any = null; // 新增：定时请求数据

// 定时器
function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (list.value) {
      list.value.forEach(async (item: any) => {
        if (item.isMachineWash && item.beginTime && item.scopeId) {
          // 机洗时间逻辑（仿）
          // if (item.beginTime && item.scopeId) {
          let start = Date.parse(item.beginTime.replace(/-/g, '/'));
          if (isNaN(start)) start = new Date(item.beginTime).getTime();
          if (!isNaN(start)) {
            const now = Date.now();
            let diff = Math.floor((now - start) / 1000);
            const h = String(Math.floor(diff / 3600)).padStart(2, '0');
            const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
            const s = String(diff % 60).padStart(2, '0');
            machineWashTimes.value[item.scopeId] = `${h}:${m}:${s}`;
          } else {
            delete machineWashTimes.value[item.scopeId];
          }
        }
        // 干燥自动结束逻辑
        if (item.step && Array.isArray(item.step)) {
          const dryStepIndex = stepList.value.findIndex((s) => s.name && s.name.includes('干燥'));
          if (dryStepIndex !== -1 && item.step[dryStepIndex]) {
            const dryStep = item.step[dryStepIndex];
            // 干燥步骤已开始且未结束（state===0为进行中）
            if (dryStep.time && dryStep.state === 0) {
              // 干燥开始时间（假设格式为 'YYYY-MM-DD HH:mm:ss'）
              let dryStart = Date.parse(dryStep.time.replace(/-/g, '/'));
              if (isNaN(dryStart)) dryStart = new Date(dryStep.time).getTime();
              if (!isNaN(dryStart)) {
                const now = Date.now();
                let dryDiff = Math.floor((now - dryStart) / 1000);
                if (dryDiff >= 180 && !item._dryAutoFinish) {
                  item._dryAutoFinish = true; // 防止多次触发
                  try {
                    await record.update({ scopeId: item.scopeId, state: 1 });
                    ElMessage.success('干燥已满180秒，流程已自动结束');
                  } catch (e) {
                    console.log('自动结束流程失败', e);
                  }
                }
              }
            }
          }
        }
      });
      // 调试：打印机洗时间map
      console.log('机洗时间map:', machineWashTimes.value);
    }
  }, 1000);
}

function startDataTimer() {
  if (dataTimer) clearInterval(dataTimer);
  dataTimer = setInterval(() => {
    getList();
  }, 5000);
}

onMounted(async () => {
  await getStepList();
  await getList();
  startTimer();
  startDataTimer(); // 启动数据刷新定时器
});

onUnmounted(() => {
  clearInterval(timer);
  clearInterval(dataTimer);
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
        scopeId: string;
      }) => {
        // 保留完整的 beginTime
        const step = item.step;
        item.beginTime = step[0].time; // 不再 slice(0, 11)，保留完整时间
        const isMachine = item.isMachineWash;

        if (!step || step.length === 0) {
          item.step = [];
          return item;
        }

        let arr = [];
        const len = step.length;
        const firstSerial = step[0].serial;
        const lastSerial = step[len - 1].serial;

        const stepMap = new Map();
        step.forEach((s) => stepMap.set(s.serial, s.time || ''));

        for (let i = 1; i <= stepList.value.length; i++) {
          const time = stepMap.get(i);
          if (time !== undefined) {
            if (i === lastSerial) {
              arr.push({ serial: i, time: time.slice(11), state: 0 });
            } else {
              arr.push({ serial: i, time: time.slice(11), state: 1 });
            }
          } else {
            if (i < lastSerial) {
              arr.push({ serial: i, time: '', state: 2 });
            } else {
              arr.push({ serial: i, time: '', state: -1 });
            }
          }
        }

        if (isMachine) {
          arr.forEach((s) => {
            if (s.serial > firstSerial && s.serial < lastSerial) {
              s.state = 3; // "mach"
            }
          });
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

watch(
  list,
  (val) => {
    console.log('监控数据:', val);
    if (Array.isArray(val)) {
      val.forEach((item, idx) => {
        console.log(
          `item[${idx}]: scopeId=`,
          item.scopeId,
          'beginTime=',
          item.beginTime,
          'isMachineWash=',
          item.isMachineWash
        );
      });
    }
  },
  { immediate: true, deep: true }
);
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
        color: #000;
        div {
          font-size: 22px;
          font-weight: 700;
          color: #000;
        }
        .name {
          font-size: 26px;
          padding-bottom: 20px;
          color: #000;
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
      color: #409eff;
      font-weight: bold;
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

.machine-time {
  color: #409eff;
  font-size: 18px;
  font-weight: bold;
  margin-top: 8px;
}
</style>
