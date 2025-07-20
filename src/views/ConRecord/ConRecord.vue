<template>
  <header v-show="!isVisitor">
    <div class="title">诊疗管理</div>
    <div class="sub-title">
      <span>诊疗管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>诊疗记录管理</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </header>
  <div class="container">
    <div class="title-box">
      <div class="title">
        <span>诊疗记录</span>
        <el-select v-show="!isVisitor" v-model="listQuery.isAbnormal" class="ab-select" @change="getList">
          <el-option label="阴性" value="0"></el-option>
          <el-option label="阳性" value="1"></el-option>
          <el-option label="所有" value="2"></el-option>
        </el-select>
      </div>
      <div>
        <my-btn
          v-show="!isVisitor"
          color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)"
          @click="download"
          >导出记录</my-btn
        >
        <my-btn color="#fff" class="border-btn" @click="add">添加诊疗记录</my-btn>
      </div>
    </div>
    <div v-show="!isVisitor">
      <el-row :gutter="20" align="middle" style="margin: 10px 0">
        <el-col :span="4">
          <el-input v-model="listQuery.lensCode" placeholder="请输入镜子卡号" clearable @clear="getList" />
        </el-col>
        <el-col :span="4">
          <el-input v-model="listQuery.consultingRoomId" placeholder="请输入诊疗室ID" clearable @clear="getList" />
        </el-col>
        <el-col :span="4">
          <el-input v-model="listQuery.examNo" placeholder="请输入检查唯一号" clearable @clear="getList" />
        </el-col>
        <el-col :span="4">
          <el-input v-model="listQuery.patLocalid" placeholder="请输入检查号" clearable @clear="getList" />
        </el-col>
        <el-col :span="4">
          <el-input v-model="listQuery.name" placeholder="请输入病人姓名" clearable @clear="getList" />
        </el-col>
        <el-col :span="4">
          <el-input v-model="listQuery.examClass" placeholder="请输入检查类别" clearable @clear="getList" />
        </el-col>
      </el-row>
      <el-row :gutter="20" align="middle" style="margin: 10px 0">
        <el-col :span="4">
          <el-input v-model="listQuery.examSubclass" placeholder="请输入检查子类" clearable @clear="getList" />
        </el-col>
        <el-col :span="4">
          <el-input v-model="listQuery.itemName" placeholder="请输入检查项目" clearable @clear="getList" />
        </el-col>
        <el-col :span="4">
          <el-input v-model="listQuery.staffName" placeholder="请输入医生姓名" clearable @clear="getList" />
        </el-col>
        <el-col :span="5">
          <el-date-picker
            v-model="listQuery.beginTime"
            type="date"
            placeholder="请选择起始时间"
            value-format="YYYY-MM-DD"
          />
        </el-col>
        <el-col :span="5">
          <el-date-picker
            v-model="listQuery.endTime"
            type="date"
            placeholder="请选择结束时间"
            value-format="YYYY-MM-DD"
          />
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="getList"> 查询 </el-button>
          <el-button @click="reset"> 重置 </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content-box">
      <!-- 洗消室展示区 -->
      <el-table v-loading="tableLoad" :data="conRecordList.data" style="width: 100%">
        <el-table-column label="镜子卡号" prop="lensCode"></el-table-column>
        <el-table-column label="诊疗室ID" prop="consultingRoomId"></el-table-column>
        <el-table-column label="检查唯一号" prop="examNo"></el-table-column>
        <el-table-column label="检查号" prop="patLocalid"></el-table-column>
        <el-table-column label="病人姓名" prop="name"></el-table-column>
        <el-table-column label="检查类别" prop="examClass"></el-table-column>
        <el-table-column label="检查子类" prop="examSubclass"></el-table-column>
        <el-table-column label="检查项目" prop="itemName"></el-table-column>
        <el-table-column label="医生姓名" prop="staffName"></el-table-column>
        <el-table-column label="检查登记时间" prop="examTime" width="180px"></el-table-column>
        <!-- 去除无用的检查结果 -->

        <!-- <el-table-column label="检查结果" prop="isAbnormal">
          <template #default="{ row }">
            <span>{{ row.isAbnormal === '1' ? '阳性' : '阴性' }}</span>
          </template>
        </el-table-column> -->
        <el-table-column v-if="!isVisitor" label="操作" width="180px">
          <template #default="{ row }">
            <div class="operate-btn">
              <span @click="modify(row)">编辑</span>
              <span @click="remove(row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <my-pagination
        v-show="!isVisitor"
        :list-query="listQuery"
        :loading="tableLoad"
        :get-list="getList"
        :total="total"
      ></my-pagination>
    </div>
  </div>

  <!-- 添加/修改洗消室弹窗 -->
  <el-dialog
    v-model="conRecordDialog"
    v-loading="tableLoad"
    :title="isModify ? '修改诊疗记录' : '添加诊疗记录'"
    width="60%"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      label-width="110px"
      size="large"
      class="form"
    >
      <el-row justify="start">
        <el-col :span="12">
          <el-form-item :label="isModify ? '修改的组合号①:' : '组合号①：'" prop="ip_and_lensCode">
            <el-input v-model="ruleForm.ip_and_lensCode" placeholder="输入示例:192.168.0.1=test" style="width: 350px" />
            <div v-if="!ruleForm.ip_and_lensCode || !isIpAndLensCodeValid" style="color: red; font-size: 12px">
              <template v-if="!ruleForm.ip_and_lensCode"> 组合号①必填 </template>
              <template v-else> 格式不正确，示例：192.168.1.10=test </template>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检查唯一号：" prop="examNo">
            <el-input
              v-model="ruleForm.examNo"
              placeholder="输入后请点击查询"
              style="width: 350px"
              :disabled="isModify"
            />
            <div v-if="!ruleForm.examNo || !isExamNoValid" style="color: red; font-size: 12px">检查唯一号必填</div>
          </el-form-item>
        </el-col>
        <el-col :span="4"
          ><el-button :disabled="isModify" type="success" style="margin-left: 20px" @click="searchHaidong()"
            >查询</el-button
          ></el-col
        >
      </el-row>
      <!-- 新增组合号②输入框 -->
      <el-row justify="start">
        <el-col :span="12">
          <el-form-item label="启用组合号②：">
            <el-switch v-model="enableLensCode2" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="enableLensCode2" justify="start">
        <el-col :span="12">
          <el-form-item :label="isModify ? '修改的组合号②:' : '组合号②：'" prop="ip_and_lensCode2">
            <el-input
              v-model="ruleForm.ip_and_lensCode2"
              placeholder="输入示例:192.168.0.2=test"
              style="width: 350px"
            />
            <div v-if="!ruleForm.ip_and_lensCode2 || !isIpAndLensCode2Valid" style="color: red; font-size: 12px">
              <template v-if="!ruleForm.ip_and_lensCode2"> 组合号②必填 </template>
              <template v-else> 格式不正确，示例：192.168.1.10=test </template>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 展示查询后的信息 -->
      <el-row v-show="isSearch" justify="center" style="margin-bottom: 20px">
        <!-- <span class="choice-tips">提示：点击表格数据进行选择</span> -->
        <span class="choice-tips">提示：点击表格数据选择胃镜或肠镜检查类型</span>
        <el-table
          v-loading="tableLoad"
          fit
          border
          size="small"
          highlight-current-row
          :data="searchData"
          style="width: 100%"
          @current-change="handleCurrentChange"
        >
          <el-table-column label="病人姓名" prop="name"></el-table-column>
          <el-table-column label="病人号" prop="patLocalid"></el-table-column>
          <el-table-column label="检查号" prop="examNo"></el-table-column>
          <!-- 去除无用的检查结果 -->
          <!-- <el-table-column label="检查结果" prop="isAbnoraml">
            <template #default="{ row }">
              <span>{{ row.isAbnoraml === '1' ? '阳性' : '阴性' }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="医生姓名" prop="staffName"></el-table-column>
          <el-table-column label="检查类别" prop="examClass"></el-table-column>
          <!-- <el-table-column label="检查子类" prop="examSubclass"></el-table-column>
          <el-table-column label="检查项目" prop="itemName"></el-table-column>1 -->
          <el-table-column label="检查子类" prop="examSubclass">
            <template #default="{ row }">
              <span :class="{ highlight: row.examSubclass.includes('胃镜') || row.examSubclass.includes('肠镜') }">
                {{ row.examSubclass }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="检查项目" prop="itemName">
            <template #default="{ row }">
              <span :class="{ highlight: row.itemName.includes('胃镜') || row.itemName.includes('肠镜') }">
                {{ row.itemName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="检查登记时间" prop="examTime"></el-table-column>
        </el-table>
      </el-row>
      <!-- 状态提示 -->
      <el-row v-if="!isModify" justify="center" style="margin-bottom: 10px">
        <span class="status-tips" :class="{ success: isSelected, warning: !isSelected }">
          {{ isSelected ? '✓ 已选择胃镜或肠镜检查类型，可以点击完成' : '⚠ 请先查询并选择胃镜或肠镜检查类型' }}
        </span>
      </el-row>
      <el-row justify="center">
        <!-- <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="update(ruleFormRef)"
        >完成</my-btn -->
        <!-- <my-btn 
          :color="isModify || isSelected ? 'linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)' : '#dcdfe6'"
          :disabled="!isModify && !isSelected"
          @click="update(ruleFormRef)" -->
        <my-btn
          :disabled="
            !isModify &&
            (!isSelected ||
              !isIpAndLensCodeValid ||
              (enableLensCode2 && !isIpAndLensCode2Valid) ||
              !isExamNoValid ||
              !isPatLocalidValid)
          "
          :style="{
            background:
              isModify ||
              (isSelected &&
                isIpAndLensCodeValid &&
                (!enableLensCode2 || isIpAndLensCode2Valid) &&
                isExamNoValid &&
                isPatLocalidValid)
                ? 'linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)'
                : '#dcdfe6',
            color:
              isModify ||
              (isSelected &&
                isIpAndLensCodeValid &&
                (!enableLensCode2 || isIpAndLensCode2Valid) &&
                isExamNoValid &&
                isPatLocalidValid)
                ? '#fff'
                : '#a8abb2',
            border: 'none',
            marginRight: '32px',
          }"
          @click="update(ruleFormRef)"
        >
          完成
        </my-btn>
        <my-btn
          color="#fff"
          style="border: 1px solid #e4e7ed"
          @click="
            conRecordDialog = false;
            isSearch = false;
            isSelected = false;
            forceSubmitCount = 0;
            enableLensCode2 = false;
            ruleForm.ip_and_lensCode2 = '';
          "
        >
          取消
        </my-btn>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import conRecord from '@/web/api/conRecord';
// import card from '@/web/api/card';
import initForm from '@/utils/initForm';
import removeInvalid from '@/utils/removeInvalid';
import confirm from '@/utils/confirm';
import down from '@/web/utils/download';
// import { ElMessage } from 'element-plus/lib/components';
// import store from '@/store';

// 是否为访客登录
const isVisitor = useStore().state.username === 'visitor';

// 是否加载中
const tableLoad = ref(false);
const dialogLoad = ref(false);

// 添加/修改洗消室
const conRecordDialog = ref(false);
const isModify = ref(false);

const listQuery = reactive({
  lensCode: '',
  consultingRoomId: '',
  examNo: '',
  patLocalid: '',
  name: '',
  examClass: '',
  examSubclass: '',
  itemName: '',
  staffName: '',
  isAbnormal: '2',
  beginTime: '',
  endTime: '',
  currentPage: 1,
  size: 15,
});

const ruleForm = reactive({
  ip_and_lensCode: '', // 合并的字段，上传后会拆分成下两个字段
  ip_and_lensCode2: '', // 新增的组合号②
  ip: '',
  lensCode: '',
  examNo: '', // 诊疗室唯一id
  // 由/haidong/search获取
  patLocalid: '',
  name: '',
  examClass: '',
  examSubclass: '',
  itemName: '',
  staffName: '',
  examTime: '',
  isAbnormal: '',
  forceInsert: false, // 是否强制插入
});

// 新增状态管理
const isSelected = ref(false); // 是否已选择检查类型
const forceSubmitCount = ref(0); // 强制提交计数
const lastSubmitTime = ref(0); // 上次提交时间
const enableLensCode2 = ref(false); // 是否启用组合号②
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  ip_and_lensCode: [
    { required: true, message: '', trigger: 'blur, change' },
    {
      validator: (rule: any, value: string, callback: any) => {
        // 校验格式：IP=xxx
        const reg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}=[^=]+$/;
        if (!value || reg.test(value)) {
          callback();
        } else {
          callback(new Error(''));
        }
      },
      trigger: 'blur, change',
    },
  ],
  ip_and_lensCode2: [
    { required: true, message: '', trigger: 'blur, change' },
    {
      validator: (rule: any, value: string, callback: any) => {
        // 校验格式：IP=xxx
        const reg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}=[^=]+$/;
        if (!value || reg.test(value)) {
          callback();
        } else {
          callback(new Error(''));
        }
      },
      trigger: 'blur, change',
    },
  ],
  examNo: [{ required: true, message: '', trigger: 'blur, change' }],
});

// 实时校验组合号格式，决定按钮是否可用
const isIpAndLensCodeValid = computed(() => {
  const reg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}=[^=]+$/;
  return reg.test(ruleForm.ip_and_lensCode);
});

// 组合号②实时校验
const isIpAndLensCode2Valid = computed(() => {
  // 如果未启用组合号②，则不需要校验
  if (!enableLensCode2.value) return true;
  const reg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}=[^=]+$/;
  return reg.test(ruleForm.ip_and_lensCode2);
});

// 检查唯一号实时校验
const isExamNoValid = computed(() => {
  return typeof ruleForm.examNo === 'string' && ruleForm.examNo.trim().length > 0;
});

// 检查号实时校验
const isPatLocalidValid = computed(() => {
  return !!ruleForm.patLocalid && ruleForm.patLocalid.trim().length > 0;
});

const isSearch = ref(false); // 是否查询过信息

const store = useStore();

// 通过检查唯一号查询海东二院信息
const searchData = ref<any[]>([]);

/**
 * 暂时将haidong 的ip修改到本地,方便测试
 */

const searchHaidong = async () => {
  try {
    // 验证必填字段
    if (!ruleForm.ip_and_lensCode.trim()) {
      ElMessage.error('请先输入组合号');
      return;
    }
    if (!ruleForm.examNo.trim()) {
      ElMessage.error('请先输入检查唯一号');
      return;
    }

    // 改接口端口为8612
    // const baseUrl = process.env.NODE_ENV === 'development' ? 'http://1.117.155.214' : window.httpUrl.slice(0, -5);
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1' : window.httpUrl.slice(0, -5);
    //const res = await fetch(`${baseUrl}:8610/haidong/fakesearch?examNo=${ruleForm.examNo}`, {
    const res = await fetch(`${baseUrl}:8610/haidong/search?examNo=${ruleForm.examNo}`, {
      method: 'GET',
      headers: {
        token: store.state.token,
      },
    });
    const { data } = await res.json();
    searchData.value = data;
    isSearch.value = true;
    isSelected.value = false; // 重置选择状态
  } catch (e) {
    console.log(e);
    ElMessage.error('查询失败，请检查网络连接');
  }
};

const handleCurrentChange = (curentRow: any) => {
  const { examClass, examNo, examSubclass, examTime, isAbnoraml, itemName, name, patLocalid, staffName } = curentRow;
  ruleForm.examNo = examNo;
  ruleForm.patLocalid = patLocalid;
  ruleForm.name = name;
  ruleForm.examClass = examClass;
  ruleForm.examSubclass = examSubclass;
  ruleForm.itemName = itemName;
  ruleForm.staffName = staffName;
  ruleForm.examTime = examTime;
  ruleForm.isAbnormal = isAbnoraml;

  // 检查是否为胃镜或肠镜检查
  const isGastroscopy = examSubclass.includes('胃镜') || itemName.includes('胃镜');
  const isColonoscopy = examSubclass.includes('肠镜') || itemName.includes('肠镜');

  if (isGastroscopy || isColonoscopy) {
    isSelected.value = true;
    ElMessage.success(`已选择检查子类为${examSubclass}、检查项目为${itemName}的记录`);
  } else {
    isSelected.value = false;
    ElMessage.warning('请选择胃镜或肠镜检查类型');
  }
};

// 点击添加
const add = () => {
  // 如果上一次操作是修改则清空表单
  if (isModify.value) initForm(ruleForm);
  isModify.value = false;
  isSearch.value = false;
  isSelected.value = false; // 重置选择状态
  forceSubmitCount.value = 0; // 重置强制提交计数
  enableLensCode2.value = false; // 重置组合号②开关
  ruleForm.ip_and_lensCode2 = ''; // 清空组合号②
  conRecordDialog.value = true;
};

// 修改时给表单进行赋值
const modify = (row: any) => {
  Object.assign(ruleForm, row);
  isModify.value = true;
  isSearch.value = true;
  isSelected.value = true; // 修改模式下默认已选择
  forceSubmitCount.value = 0; // 重置强制提交计数
  conRecordDialog.value = true;
};

const update = async (formEl: FormInstance | undefined) => {
  dialogLoad.value = true;
  try {
    if (!formEl) return;
    await formEl.validate();

    // 再次校验组合号和检查唯一号
    const ipReg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}=[^=]+$/;
    if (ruleForm.ip_and_lensCode && !ipReg.test(ruleForm.ip_and_lensCode)) {
      ElMessage.error('组合号①格式不正确，示例：192.168.1.10=test');
      dialogLoad.value = false;
      return;
    }
    // 只有启用组合号②时才进行校验
    if (enableLensCode2.value && ruleForm.ip_and_lensCode2 && !ipReg.test(ruleForm.ip_and_lensCode2)) {
      ElMessage.error('组合号②格式不正确，示例：192.168.1.10=test');
      dialogLoad.value = false;
      return;
    }
    // 检查唯一号为空的情况不再弹窗，交给表单校验
    if (typeof ruleForm.examNo !== 'string' || ruleForm.examNo.trim().length === 0) {
      dialogLoad.value = false;
      return;
    }

    // 检查是否为修改模式，如果是修改模式则直接提交
    if (isModify.value) {
      const data = removeInvalid(ruleForm);
      await conRecord.update(data);
      await getList();
      isModify.value = false;
      isSearch.value = false;
      conRecordDialog.value = false;
      initForm(ruleForm);
      dialogLoad.value = false;
      return;
    }

    // 新增模式下的验证逻辑
    const currentTime = Date.now();

    // 检查是否已选择检查类型
    if (!isSelected.value) {
      // 检查是否为强制提交（连续点击两次）
      if (currentTime - lastSubmitTime.value < 2000) {
        // 2秒内连续点击
        forceSubmitCount.value++;
        if (forceSubmitCount.value >= 2) {
          // 强制提交前的基本验证
          if (!ruleForm.ip_and_lensCode.trim() || !ruleForm.examNo.trim()) {
            ElMessage.error('强制提交时组合号和检查唯一号仍为必填项');
            dialogLoad.value = false;
            return;
          }

          ElMessage.warning('检测到连续点击，允许强制录入诊疗信息');
          // 强制提交逻辑
          const data = removeInvalid(ruleForm);
          data.forceInsert = true;
          if (!enableLensCode2.value) data.ip_and_lensCode2 = null;
          await conRecord.save(data);
          await getList();
          isModify.value = false;
          isSearch.value = false;
          conRecordDialog.value = false;
          initForm(ruleForm);
          forceSubmitCount.value = 0;
          dialogLoad.value = false;
          ruleForm.forceInsert = false;
          return;
        }
      } else {
        forceSubmitCount.value = 1;
      }
      lastSubmitTime.value = currentTime;

      ElMessage.error('请先查询并选择胃镜或肠镜检查类型');
      dialogLoad.value = false;
      return;
    }

    // 正常提交逻辑
    const data = removeInvalid(ruleForm);
    if (!enableLensCode2.value) data.ip_and_lensCode2 = null;
    await conRecord.save(data);
    await getList();
    isModify.value = false;
    isSearch.value = false;
    conRecordDialog.value = false;
    initForm(ruleForm);
    isSelected.value = false;
    forceSubmitCount.value = 0;
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

/**
 * @author LYS-developer
 * @description 修复删除记录方法为Get
 * @since 2025-07-18
 */

// 删除记录
const remove = async (id: number) => {
  try {
    await confirm('您确定要删除吗？');
    await conRecord.remove(id);
    getList();
    ElMessage.success('该记录已成功删除');
  } catch (e) {
    ElMessage.error('删除失败');
    console.log(e);
  }
};

// 导出记录
const download = async () => {
  try {
    const res = await conRecord.excel({});
    ElMessage.success('下载成功');
    down(res, '诊疗记录.xlsx');
  } catch (e) {
    console.log(e);
  }
};

onMounted(async () => {
  getList();
});

// 获取洗消室列表
const conRecordList = reactive({ data: [] });

const total = ref(0);

const getList = async () => {
  tableLoad.value = true;
  try {
    if (!isVisitor) {
      let isAll = false;
      if (listQuery.isAbnormal === '2') {
        listQuery.isAbnormal = '';
        isAll = true;
      }
      const { data } = await conRecord.getList(removeInvalid(listQuery));
      if (data.page) conRecordList.data = data.page.records;
      else conRecordList.data = [];
      total.value = data?.page?.total;
      if (isAll) listQuery.isAbnormal = '2';
      // 访客只能查看最新10条
    } else {
      const { data } = await conRecord.getLast10();
      conRecordList.data = data;
    }
  } catch (e) {
    console.log(e);
  }
  tableLoad.value = false;
};

// 重置listQuery并刷新
const reset = () => {
  initForm(listQuery);
  listQuery.isAbnormal = '2';
  listQuery.currentPage = 1;
  listQuery.size = 15;
  getList();
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
      .ab-select {
        margin: 0 20px;
        width: 100px;
      }
    }
    .border-btn {
      border: 1px solid #e4e7ed;
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
  .card-num {
    margin-right: 35px;
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

.choice-tips {
  padding-bottom: 10px;
  color: red;
}

.status-tips {
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 4px;

  &.success {
    color: #67c23a;
    background-color: #f0f9ff;
    border: 1px solid #b3d8ff;
  }

  &.warning {
    color: #e6a23c;
    background-color: #fdf6ec;
    border: 1px solid #f5dab1;
  }
}

.highlight {
  color: #409eff;
  font-weight: bold;
  background-color: #f0f9ff;
  padding: 2px 6px;
  border-radius: 3px;
}
</style>
