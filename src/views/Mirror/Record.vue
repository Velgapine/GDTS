<template>
  <header>
    <div class="title">设备管理</div>
    <div class="sub-title">
      <span>设备管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>内镜管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>洗消记录</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </header>
  <section>
    <div class="title-box">
      <div class="title">洗消记录</div>
      <div class="btn-group">
        <my-btn color="linear-gradient(180deg, #409eff 50%)" @click="generateSummary"
          >同步记录</my-btn
        >
        <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="download"
          >导出记录</my-btn
        >
        <my-btn :color="`#fff`" class="border-btn" @click="back">返回</my-btn>
      </div>
    </div>
    <div class="second-row">
      <el-input v-model="listQuery.scopeName" placeholder="请输入内镜名称" clearable size="small" @clear="getList" />
      <el-input v-model="listQuery.staffName" placeholder="请输入员工名称" clearable size="small" @clear="getList" />
      <el-date-picker
        v-model="listQuery.beginTime"
        type="datetime"
        placeholder="请选择起始时间"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
      <el-date-picker
        v-model="listQuery.endTime"
        type="datetime"
        placeholder="请选择结束时间"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
      <el-button type="primary" @click="getList"> 查询 </el-button>
      <el-button @click="reset"> 重置 </el-button>
    </div>
    <div class="content-box">
      <!-- 洗消表格 -->
      <el-table v-loading="tableLoad" :data="recordList.data">
        <el-table-column prop="scopeName" label="内镜名称" />
        <el-table-column prop="name" label="病人姓名" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <span v-if="row.state === 1">已完成</span>
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
              <!-- <span @click="download(row)">下载</span> -->
              <span @click="showBindDialog(row)">绑定</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <my-pagination :list-query="listQuery" :loading="tableLoad" :get-list="getList" :total="total"></my-pagination>
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

    <!-- 绑定病人 -->
    <el-dialog v-model="bindDialog" v-loading="bindLoad" title="绑定病人信息" width="60%">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-position="left"
        label-width="110px"
        size="large"
        class="form"
      >
        <el-row justify="space-between">
          <el-col :span="12">
            <el-form-item label="镜头编号：" prop="ip_and_lensCode">
              <el-input v-model="ruleForm.ip_and_lensCode" disabled style="width: 350px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="洗消记录id：" prop="cleanNo">
              <el-input v-model="ruleForm.cleanNo" disabled style="width: 350px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-between">
          <el-col :span="12">
            <el-form-item label="病人姓名：" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入" style="width: 350px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查唯一号：" prop="examNo">
              <el-input v-model="ruleForm.examNo" placeholder="请输入" style="width: 350px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-between">
          <el-col :span="12">
            <el-form-item label="检查号：" prop="patLocalid">
              <el-input v-model="ruleForm.patLocalid" placeholder="请输入" style="width: 350px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查类别：" prop="examClass">
              <el-input v-model="ruleForm.examClass" placeholder="请输入" style="width: 350px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-between">
          <el-col :span="12">
            <el-form-item label="检查子类：" prop="examSubclass">
              <el-input v-model="ruleForm.examSubclass" placeholder="请输入" style="width: 350px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查项目：" prop="itemName">
              <el-input v-model="ruleForm.itemName" placeholder="请输入" style="width: 350px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-between">
          <el-col :span="12">
            <el-form-item label="检查医生：" prop="staffName">
              <el-input v-model="ruleForm.staffName" placeholder="请输入" style="width: 350px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查结果：" place-holder="请选择" prop="isAbnormal">
              <el-select v-model="ruleForm.isAbnormal">
                <el-option label="阴性" :value="0"></el-option>
                <el-option label="阳性" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="center">
          <my-btn
            color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)"
            @click="updateBindInfo(ruleFormRef)"
            >完成</my-btn
          >
          <my-btn color="#fff" style="border: 1px solid #e4e7ed" @click="bindDialog = false">取消</my-btn>
        </el-row>
      </el-form>
    </el-dialog>
  </section>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import record from '@/web/api/washRecord';
import removeInvalid from '@/utils/removeInvalid';
import initForm from '@/utils/initForm';
import down from '@/web/utils/download';
import conRecord from '@/web/api/conRecord';

// 是否加载中
const tableLoad = ref(false);

// 显示各设备消毒记录
const recordDialog = ref(false);

// 查询洗消记录的查询字符串对象
const listQuery = reactive({
  scopeName: '',
  scopeId: '',
  staffName: '',
  beginTime: '',
  endTime: '',
  currentPage: 1,
  size: 15,
});

onMounted(() => {
  getList();
});

// 获取洗消记录
const recordList = reactive({
  data: [],
});

const total = ref(0);

const getList = async () => {
  tableLoad.value = true;
  try {
    removeInvalid(listQuery);
    const { data } = await record.getList(toRaw(listQuery));
    if (data.page) recordList.data = data.page.records;
    else recordList.data = [];
    total.value = data?.page?.total;
  } catch (e) {
    console.log(e);
  }
  tableLoad.value = false;
};

// 重置listQuery并刷新
const reset = () => {
  initForm(listQuery);
  listQuery.currentPage = 1;
  listQuery.size = 15;
  getList();
};

// 查看一条记录的详细信息
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

// 同步汇总记录
const generateSummary = async () => {
  try {
    await record.generateSummary();
    // if (data.code === 4000) {
    //   ElMessage.success('洗消记录汇总生成成功');
    // } else {
    //   ElMessage.error(data.message || '汇总生成失败');
    // }
  } catch (e) {
    console.error('同步汇总记录失败:', e);
    // ElMessage.error('同步汇总记录失败');
  }
};

// 下载记录的excel
const download = async () => {
  try {
    // const {
    //   scopeName,
    //   scopeId,
    //   staffName,
    //   beginAt: beginTime,
    //   finishTime: endTime,
    // } = row;
    // const data = { scopeName, scopeId, staffName, beginTime, endTime };
    removeInvalid(listQuery);
    const res = await record.download(toRaw(listQuery));
    ElMessage.success('下载成功');
    down(res, '清洗消毒记录.xlsx');
  } catch (e) {
    console.log(e);
  }
};

/**
 * 绑定病人相关
 */
const bindDialog = ref(false);
const bindLoad = ref(false);
const ruleForm = reactive({
  ip_and_lensCode: '', // ip:镜子编号
  cleanNo: '', // 洗消记录id
  name: '', // 姓名，必填
  examNo: '', // 检查唯一号
  patLocalid: '', // 检查号
  examClass: '', // 检查类别
  examSubclass: '', // 检查子类
  itemName: '', // 检查项目
  staffName: '', // 检查医生姓名
  examTime: '', // 检查事件
  isAbnormal: '', // 0-阴性 1-阳性
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  ip_and_lensCode: [{ required: true, message: '必填', trigger: 'blur, change' }],
  cleanNo: [{ required: true, message: '必填', trigger: 'blur, change' }],
  name: [{ required: true, message: '必填', trigger: 'blur, change' }],
});

const showBindDialog = (row: any) => {
  // 将表单所有值赋值为空值
  initForm(ruleForm);
  const { matchId, scopeNum } = row;
  ruleForm.cleanNo = matchId;
  ruleForm.ip_and_lensCode = scopeNum;
  bindDialog.value = true;
};

const updateBindInfo = async (formEl: FormInstance | undefined) => {
  bindLoad.value = true;
  try {
    if (!formEl) return;
    await formEl.validate();
    const data = removeInvalid(ruleForm);
    await conRecord.save(data);
    bindDialog.value = false;
    // 将表单所有值赋值为空值
    initForm(ruleForm);
  } catch (e) {
    console.log(e);
  } finally {
    bindLoad.value = false;
  }
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
    .border-btn {
      border: 1px solid #e4e7ed;
    }
  }
  .content-box {
    margin-top: 20px;
  }
}

.second-row {
  display: flex;
  margin-top: 10px;
  .el-input {
    margin-right: 10px;
    width: 200px;
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
