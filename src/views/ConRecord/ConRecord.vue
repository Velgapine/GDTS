<template>
  <header v-show="!isVisitor">
    <div class="title">诊疗管理</div>
    <div class="sub-title">
      <span>诊疗管理</span>
      <el-icon>
        <ArrowRight />
      </el-icon>
      <span>诊疗记录管理</span>
      <el-icon>
        <ArrowRight />
      </el-icon>
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
        <my-btn v-show="!isVisitor" color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)"
          @click="download">导出记录</my-btn>
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
          <el-date-picker v-model="listQuery.beginTime" type="date" placeholder="请选择起始时间" value-format="YYYY-MM-DD" />
        </el-col>
        <el-col :span="5">
          <el-date-picker v-model="listQuery.endTime" type="date" placeholder="请选择结束时间" value-format="YYYY-MM-DD" />
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
      <my-pagination v-show="!isVisitor" :list-query="listQuery" :loading="tableLoad" :get-list="getList"
        :total="total"></my-pagination>
    </div>
  </div>

  <!-- 添加/修改诊疗记录弹窗 -->
  <el-dialog v-model="conRecordDialog" v-loading="tableLoad" :title="isModify ? '修改诊疗记录' : '添加诊疗记录'" width="60%">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="left" label-width="110px" size="large"
      class="form">
      <el-row justify="start">
        <el-col :span="12">
          <el-form-item :label="isModify ? '修改组合号:' : '组合号：'" prop="ip_and_lensCode">
            <el-input v-model="comboInput" placeholder="内镜卡号请用“、”分隔" style="width: 350px" />
            <div v-if="!comboValid" style="color: red; font-size: 12px">{{ comboError }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检查唯一号：" prop="examNo">
            <el-input v-model="ruleForm.examNo" placeholder="输入后请点击查询" style="width: 350px" :disabled="isModify" />
            <div v-if="!ruleForm.examNo || !isExamNoValid" style="color: red; font-size: 12px">检查唯一号必填</div>
          </el-form-item>
        </el-col>
        <el-col :span="4"><el-button :disabled="isModify" type="success" style="margin-left: 20px"
            @click="searchHaidong()">查询</el-button></el-col>
      </el-row>
      <!-- 新增组合号②输入框 -->
      <!-- <el-row v-if="!isModify" justify="start">
        <el-col :span="12">
          <el-form-item label="启用组合号②：" display="false">
            <el-switch v-model="enableLensCode2" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="enableLensCode2" justify="start">
        <el-col :span="12">
          <el-form-item :label="isModify ? '修改的组合号②:' : '组合号②：'" prop="ip_and_lensCode2">
            <el-input v-model="ruleForm.ip_and_lensCode2" placeholder="输入示例:192.168.0.2=test" style="width: 350px" />
            <div v-if="!ruleForm.ip_and_lensCode2 || !isIpAndLensCode2Valid" style="color: red; font-size: 12px">
              <template v-if="!ruleForm.ip_and_lensCode2"> 组合号②必填 </template>
              <template v-else> 格式不正确，示例：192.168.1.10=test </template>
            </div>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- 展示查询后的信息 -->
      <el-row v-show="isSearch" justify="center" style="margin-bottom: 20px">
        <!-- <span class="choice-tips">提示：点击表格数据进行选择</span> -->
        <span class="choice-tips">提示：点击表格数据选择胃镜或肠镜检查类型</span>
        <el-table v-loading="tableLoad" fit border size="small" highlight-current-row :data="searchData"
          style="width: 100%" @row-click="toggleSelectRow" :row-class-name="rowClassName">
          <el-table-column label="序号" width="60">
            <template #default="{ row }">
              <span class="sel-checkbox" :class="{ checked: getRowSelIndex(row) !== '' }">
                <span v-if="getRowSelIndex(row)" class="sel-index">{{ getRowSelIndex(row) }}</span>
                <span v-else class="sel-index"></span>
                <!-- <span v-if="getRowSelIndex(row)" class="sel-check">✔</span> -->
              </span>
            </template>
          </el-table-column>
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
          <!-- <el-table-column label="检查类别" prop="examClass"></el-table-column> -->
          <el-table-column label="检查类别" prop="examClass">
            <template #default="{ row }">
              <span :class="{ highlight: row.examClass.includes('胃镜') || row.examClass.includes('肠镜') }">
                {{ row.examClass }}
                <span v-if="row.markNumber" class="mark-number">{{ row.markNumber }}</span>
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="检查子类" prop="examSubclass"></el-table-column>
          <el-table-column label="检查项目" prop="itemName"></el-table-column>1 -->
          <el-table-column label="检查子类" prop="examSubclass">
            <template #default="{ row }">
              <span :class="{ highlight: row.examSubclass.includes('胃镜') || row.examSubclass.includes('肠镜') }">
                {{ row.examSubclass }}
                <!-- <span v-if="row.markNumber" class="mark-number">{{ row.markNumber }}</span> -->
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
        <!-- <span class="status-tips" :class="{ success: isSelected, warning: !isSelected }">
          {{ isSelected ? '✓ 已选择胃镜或肠镜检查类型，可以点击完成' : '⚠ 请优先查询并选择胃镜或肠镜检查类型' }}
        </span> -->
      </el-row>
      <!-- 选择状态提示 -->
      <el-row v-if="enableLensCode2 && isSearch" justify="center" style="margin-bottom: 20px">
        <div class="selection-status">
          <span class="status-item"
            :class="{ selected: selectedData1, nonGastro: selectedData1 && !isGastrointestinalData(selectedData1) }">
            选择①: {{ selectedData1 ? `${selectedData1.name} (${selectedData1.examClass})` : '未选择' }}
            <el-button v-if="selectedData1" type="danger" size="small" @click="cancelSelection(1)">取消</el-button>
          </span>
          <span class="status-item"
            :class="{ selected: selectedData2, nonGastro: selectedData2 && !isGastrointestinalData(selectedData2) }">
            选择②: {{ selectedData2 ? `${selectedData2.name} (${selectedData2.examClass})` : '未选择' }}
            <el-button v-if="selectedData2" type="danger" size="small" @click="cancelSelection(2)">取消</el-button>
          </span>
        </div>
      </el-row>
      <el-row justify="center" style="margin-top: 20px">
        <!-- <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="update(ruleFormRef)"
        >完成</my-btn -->
        <!-- <my-btn
          :color="isModify || isSelected ? 'linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)' : '#dcdfe6'"
          :disabled="!isModify && !isSelected"
          @click="update(ruleFormRef)" -->
        <my-btn :disabled="!canSubmit" :style="{
          background: canSubmit ? 'linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)' : '#dcdfe6',
          color: canSubmit ? '#fff' : '#a8abb2',
          border: 'none',
          marginRight: '32px',
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
        }" @click="update(ruleFormRef)">
          完成
        </my-btn>
        <my-btn color="#fff" style="border: 1px solid #e4e7ed" @click="
          conRecordDialog = false;
        isSearch = false;
        isSelected = false;
        forceSubmitCount = 0;
        ruleForm.ip_and_lensCode2 = '';
        selectedData1 = null;
        selectedData2 = null;
        clearDialogData();
        ">
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
import baseUrl from '@/web/utils/baseUrl';
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
// 组合号2相关逻辑全部隐藏和关闭
const enableLensCode2 = ref(false); // 始终为false，隐藏开关
const selectedData1 = ref<any>(null); // 第一次选择的数据
const selectedData2 = ref<any>(null); // 第二次选择的数据
const ruleFormRef = ref<FormInstance>();

// 重新定义表单校验规则
const rules = reactive<FormRules>({
  examNo: [{ required: true, message: '', trigger: 'blur, change' }],
  ip_and_lensCode: [], // 不做el-form校验，交给自定义watch
});
// const rules = reactive<FormRules>({
//   ip_and_lensCode: [
//     { required: true, message: '', trigger: 'blur, change' },
//     {
//       validator: (rule: any, value: string, callback: any) => {
//         // 校验格式：IP=xxx
//         const reg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}=[^=]+$/;
//         if (!value || reg.test(value)) {
//           callback();
//         } else {
//           callback(new Error(''));
//         }
//       },
//       trigger: 'blur, change',
//     },
//   ],
//   ip_and_lensCode2: [
//     { required: true, message: '', trigger: 'blur, change' },
//     {
//       validator: (rule: any, value: string, callback: any) => {
//         // 校验格式：IP=xxx
//         const reg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}=[^=]+$/;
//         if (!value || reg.test(value)) {
//           callback();
//         } else {
//           callback(new Error(''));
//         }
//       },
//       trigger: 'blur, change',
//     },
//   ],
//   examNo: [{ required: true, message: '', trigger: 'blur, change' }],
// });

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

// 组合号输入框实时校验
const isComboValid = computed(() => {
  if (!comboInput.value || comboInput.value.trim() === '') {
    comboError.value = '组合号必填';
    return false;
  }
  // 校验格式：IP=卡号1、卡号2...，IP为IPv4
  const reg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}=.+$/;
  if (!reg.test(comboInput.value)) {
    comboError.value = '格式不正确，示例：192.168.1.10=test1、test2';
    return false;
  }
  const match = comboInput.value.match(/^(.*?)=(.*)$/);
  if (!match) {
    comboError.value = '格式不正确，示例：192.168.1.10=test1、test2';
    return false;
  }
  // comboError.value = '';
  return true;
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

// 新增：多选序号管理
const selectedRows = ref<any[]>([]); // 存储已选数据及序号
const comboIp = ref(''); // 组合号IP部分
const comboLensCodes = ref<string[]>([]); // 组合号内镜卡号数组
const comboInput = ref(''); // 组合号输入框内容
const comboError = ref(''); // 组合号输入错误提示
const examNoError = ref(''); // 检查唯一号输入错误提示

// 检测重复内镜卡号的函数
const findDuplicateLensCodes = (lensCodes: string[]): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const code of lensCodes) {
    if (seen.has(code)) {
      duplicates.add(code);
    } else {
      seen.add(code);
    }
  }

  return Array.from(duplicates);
};

// 新增：组合号输入框格式和数量校验
const comboValid = computed(() => {
  if (!comboInput.value || comboInput.value.trim() === '') {
    comboError.value = '组合号必填';
    return false;
  }
  // 校验格式：IP=卡号1、卡号2...，IP为IPv4
  const reg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}=.+$/;
  if (!reg.test(comboInput.value)) {
    comboError.value = '格式不正确，示例：192.168.1.10=test1、test2';
    return false;
  }
  const match = comboInput.value.match(/^(.*?)=(.*)$/);
  if (!match) {
    comboError.value = '格式不正确，示例：192.168.1.10=test1、test2';
    return false;
  }
  const lensArr = match[2].split('、').map(s => s.trim()).filter(Boolean);

  // 检测重复的内镜卡号
  const duplicates = findDuplicateLensCodes(lensArr);
  if (duplicates.length > 0) {
    comboError.value = `检测到重复的内镜卡号：${duplicates.join('、')}`;
    return false;
  }

  if (selectedRows.value.length === 0) {
    comboError.value = '请先选择数据';
    return false;
  }
  if (lensArr.length !== selectedRows.value.length) {
    comboError.value = `已选${selectedRows.value.length}条数据，当前输入${lensArr.length}个内镜卡号，二者数量需一致`;
    return false;
  }
  comboError.value = '';
  return true;
});

// 检查唯一号输入框的错误提示逻辑
watch(() => ruleForm.examNo, (val) => {
  if (!val || !isExamNoValid.value) {
    examNoError.value = '请填写有效的检查唯一号';
  } else {
    examNoError.value = '';
  }
});

// 组合号输入框的错误提示逻辑
// watch(comboInput, (val) => {
//   if (!val || val.trim() === '') {
//     comboError.value = '组合号必填';
//     return;
//   }
//   const reg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}=.+$/;
//   if (!reg.test(val)) {
//     comboError.value = '格式不正确，示例：192.168.1.10=test1、test2';
//     return;
//   }
//   const match = val.match(/^(.*?)=(.*)$/);
//   if (!match) {
//     comboError.value = '格式不正确，示例：192.168.1.10=test1、test2';
//     return;
//   }
//   const lensArr = match[2].split('、').map(s => s.trim()).filter(Boolean);
//   if (selectedRows.value.length === 0) {
//     comboError.value = '请先选择数据';
//     return;
//   }
//   if (lensArr.length !== selectedRows.value.length) {
//     comboError.value = `已选${selectedRows.value.length}条数据，当前输入${lensArr.length}个内镜卡号，二者数量需一致`;
//     return;
//   }
//   comboError.value = '';
// });

// 监听组合号输入，动态分割卡号
watch(comboInput, (val) => {
  const match = val.match(/^(.*?)=(.*)$/);
  if (match) {
    comboIp.value = match[1].trim();
    comboLensCodes.value = match[2].split('、').map(s => s.trim()).filter(Boolean);
  } else {
    comboIp.value = '';
    comboLensCodes.value = [];
  }
});

// 自动补充"、"符号的逻辑
let autoAddTimer: NodeJS.Timeout | null = null;
watch(comboInput, (val) => {
  // 清除之前的定时器
  if (autoAddTimer) {
    clearTimeout(autoAddTimer);
    autoAddTimer = null;
  }

  // 检查是否符合IP=格式
  const match = val.match(/^(.*?)=(.*)$/);
  if (match) {
    const ipPart = match[1].trim();
    const contentPart = match[2];

    // 验证IP格式
    const ipReg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    if (ipReg.test(ipPart) && contentPart && !contentPart.endsWith('、')) {
      // 如果内容部分不为空且不以"、"结尾，设置2秒后自动补充
      autoAddTimer = setTimeout(() => {
        if (comboInput.value && !comboInput.value.endsWith('、')) {
          comboInput.value += '、';
        }
      }, 1500);
    }
  }
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (autoAddTimer) {
    clearTimeout(autoAddTimer);
  }
});

// 实时错误提示
watch([comboInput, selectedRows], ([val, sel]) => {
  if (!val || val.trim() === '') {
    comboError.value = '组合号必填';
    return;
  }
  const reg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}=.+$/;
  if (!reg.test(val)) {
    comboError.value = '格式不正确，示例：192.168.1.10=test1、test2';
    return;
  }
  const match = val.match(/^(.*?)=(.*)$/);
  if (!match) {
    comboError.value = '格式不正确，示例：192.168.1.10=test1、test2';
    return;
  }
  const lensArr = match[2].split('、').map(s => s.trim()).filter(Boolean);

  // 检测重复的内镜卡号
  const duplicates = findDuplicateLensCodes(lensArr);
  if (duplicates.length > 0) {
    comboError.value = `检测到重复的内镜卡号：${duplicates.join('、')}`;
    // ElMessage.warning(`检测到重复的内镜卡号：${duplicates.join('、')}`);
    return;
  }

  if (sel.length === 0) {
    comboError.value = '请先选择数据';
    return;
  }
  if (lensArr.length !== sel.length) {
    comboError.value = `已选${sel.length}条数据，当前输入${lensArr.length}个内镜卡号，二者数量需一致`;
    return;
  }
  comboError.value = '';
});

// // 监听组合号输入，动态分割卡号
// watch(comboInput, (val) => {
//   const match = val.match(/^(.*?)=(.*)$/);
//   if (match) {
//     comboIp.value = match[1].trim();
//     comboLensCodes.value = match[2].split('、').map(s => s.trim()).filter(Boolean);
//   } else {
//     comboIp.value = '';
//     comboLensCodes.value = [];
//   }
//   // 实时校验
//   if (!forceSubmitCount.value && selectedRows.value.length !== comboLensCodes.value.length) {
//     comboError.value = `已选${selectedRows.value.length}条，输入${comboLensCodes.value.length}个卡号，数量需一致`;
//   } else {
//     comboError.value = '';
//   }
// });

// 表格多选序号列逻辑
const toggleSelectRow = (row: any) => {
  const idx = selectedRows.value.findIndex(r => r.examNo === row.examNo);
  if (idx === -1) {
    selectedRows.value.push(row);
  } else {
    selectedRows.value.splice(idx, 1);
  }
  // 重新编号
  selectedRows.value = selectedRows.value.map((r, i) => ({ ...r, _selIndex: i + 1 }));
};
const getRowSelIndex = (row: any) => {
  const idx = selectedRows.value.findIndex(r => r.examNo === row.examNo);
  return idx === -1 ? '' : (idx + 1);
};

// 表格高亮选中行
const rowClassName = (row: any) => {
  return getRowSelIndex(row) !== '' ? 'selected-row' : '';
};

const searchHaidong = async () => {
  try {
    if (!ruleForm.examNo.trim()) {
      ElMessage.error('请先输入检查唯一号');
      return;
    }

    // 保存当前选择的数据
    const currentSelected1 = selectedData1.value;
    const currentSelected2 = selectedData2.value;
    const currentIsSelected = isSelected.value;

    // console.log('查询前保存的选择数据:', { currentSelected1, currentSelected2, currentIsSelected });

    // 改接口端口为8612
    // const baseUrl = process.env.NODE_ENV === 'development' ? 'http://1.117.155.214' : window.httpUrl.slice(0, -5);
    // const baseUrl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1' : window.httpUrl.slice(0, -5);
    // const baseUrl = process.env.NODE_ENV === 'development' ? 'http://47.115.149.217' : window.httpUrl.slice(0, -5);
    //const res = await fetch(`${baseUrl}:8610/haidong/fakesearch?examNo=${ruleForm.examNo}`, {
    // const res = await fetch(`${baseUrl}:8610/haidong/search?examNo=${ruleForm.examNo}`, {
    const res = await fetch(`${baseUrl}/haidong/search?examNo=${ruleForm.examNo}`, {
      method: 'GET',
      headers: {
        token: store.state.token,
      },
    });
    const { data } = await res.json();

    // 设置新数据
    searchData.value = data.map((item: any) => ({
      ...item,
      markNumber: '', // 确保每个新数据项都没有标记
    }));

    isSearch.value = true;

    // 恢复选择状态
    selectedData1.value = currentSelected1;
    selectedData2.value = currentSelected2;
    isSelected.value = currentIsSelected;

    console.log('查询后恢复的选择数据:', {
      selectedData1: selectedData1.value,
      selectedData2: selectedData2.value,
      isSelected: isSelected.value,
    });

    // 重新设置标记
    if (currentSelected1) {
      const row1 = searchData.value.find((item) => item.examNo === currentSelected1.examNo);
      if (row1) {
        row1.markNumber = '①';
        console.log('重新设置标记①:', row1);
      } else {
        console.log('未找到匹配的行①:', currentSelected1.examNo);
      }
    }
    if (currentSelected2) {
      const row2 = searchData.value.find((item) => item.examNo === currentSelected2.examNo);
      if (row2) {
        row2.markNumber = '②';
        console.log('重新设置标记②:', row2);
      } else {
        console.log('未找到匹配的行②:', currentSelected2.examNo);
      }
    }

    // 清空多选
    selectedRows.value = [];
    // comboInput.value = '';
    comboError.value = '';

    // 清除表格当前选中行的指针
    nextTick(() => {
      const table = document.querySelector('.el-table') as any;
      if (table && table.clearCurrentRow) {
        table.clearCurrentRow();
      }
    });
  } catch (e) {
    console.log(e);
    ElMessage.error('查询失败，请检查网络连接');
  }
};

const handleCurrentChange = (curentRow: any) => {
  if (!enableLensCode2.value) {
    // 单选逻辑（原有逻辑）
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
  } else {
    // 双选逻辑 - 允许选择任何检查类型
    // const isGastroscopy = curentRow.examSubclass.includes('胃镜') || curentRow.itemName.includes('胃镜');
    // const isColonoscopy = curentRow.examSubclass.includes('肠镜') || curentRow.itemName.includes('肠镜');

    // if (!isGastroscopy && !isColonoscopy) {
    //   ElMessage.warning('请选择胃镜或肠镜检查类型');
    //   return;
    // }

    // 检查是否已经选择过该条数据
    if (selectedData1.value && selectedData1.value.examNo === curentRow.examNo) {
      // 如果已经选择为①，则取消选择①
      cancelSelection(1);
      return;
    }
    if (selectedData2.value && selectedData2.value.examNo === curentRow.examNo) {
      // 如果已经选择为②，则取消选择②
      cancelSelection(2);
      return;
    }

    // 分配选择序号
    if (!selectedData1.value) {
      selectedData1.value = { ...curentRow };
      curentRow.markNumber = '①';
      ElMessage.success(`已选择①: ${curentRow.name} (${curentRow.examClass})`);
    } else if (!selectedData2.value) {
      selectedData2.value = { ...curentRow };
      curentRow.markNumber = '②';
      ElMessage.success(`已选择②: ${curentRow.name} (${curentRow.examClass})`);
    } else {
      ElMessage.warning('已选择两条记录，请先取消其中一条');
      return;
    }

    // 更新选择状态 - 检查是否两条都是胃肠镜
    if (selectedData1.value && selectedData2.value) {
      const isGastroscopy1 =
        selectedData1.value.examSubclass.includes('胃镜') || selectedData1.value.itemName.includes('胃镜');
      const isColonoscopy1 =
        selectedData1.value.examSubclass.includes('肠镜') || selectedData1.value.itemName.includes('肠镜');
      const isGastroscopy2 =
        selectedData2.value.examSubclass.includes('胃镜') || selectedData2.value.itemName.includes('胃镜');
      const isColonoscopy2 =
        selectedData2.value.examSubclass.includes('肠镜') || selectedData2.value.itemName.includes('肠镜');

      const isBothGastrointestinal = (isGastroscopy1 || isColonoscopy1) && (isGastroscopy2 || isColonoscopy2);
      isSelected.value = isBothGastrointestinal;
    } else {
      isSelected.value = false;
    }
  }
};

// 取消选择
const cancelSelection = (number: number) => {
  if (number === 1) {
    if (selectedData1.value) {
      // 清除标记
      const row = searchData.value.find((item) => item.examNo === selectedData1.value.examNo);
      if (row) {
        row.markNumber = '';
      }
      selectedData1.value = null;
      ElMessage.info('已取消选择①');
    }
  } else if (number === 2) {
    if (selectedData2.value) {
      // 清除标记
      const row = searchData.value.find((item) => item.examNo === selectedData2.value.examNo);
      if (row) {
        row.markNumber = '';
      }
      selectedData2.value = null;
      ElMessage.info('已取消选择②');
    }
  }

  // 清除表格当前选中行的指针
  nextTick(() => {
    const table = document.querySelector('.el-table') as any;
    if (table && table.clearCurrentRow) {
      table.clearCurrentRow();
    }
  });

  // 重新计算选择状态
  if (selectedData1.value && selectedData2.value) {
    const isGastroscopy1 =
      selectedData1.value.examSubclass.includes('胃镜') || selectedData1.value.itemName.includes('胃镜');
    const isColonoscopy1 =
      selectedData1.value.examSubclass.includes('肠镜') || selectedData1.value.itemName.includes('肠镜');
    const isGastroscopy2 =
      selectedData2.value.examSubclass.includes('胃镜') || selectedData2.value.itemName.includes('胃镜');
    const isColonoscopy2 =
      selectedData2.value.examSubclass.includes('肠镜') || selectedData2.value.itemName.includes('肠镜');

    const isBothGastrointestinal = (isGastroscopy1 || isColonoscopy1) && (isGastroscopy2 || isColonoscopy2);
    isSelected.value = isBothGastrointestinal;
  } else {
    isSelected.value = false;
  }
};

// 监听组合号②开关变化
// watch(enableLensCode2, (newVal, oldVal) => {
//   // 只有在开关状态真正改变时才清空数据
//   if (oldVal !== undefined) {
//     // 避免初始化时触发
//     if (!newVal) {
//       // 关闭开关时清空双选数据
//       selectedData1.value = null;
//       selectedData2.value = null;
//       isSelected.value = false;
//       // 清除所有标记
//       searchData.value.forEach((item) => {
//         item.markNumber = '';
//       });
//     }
//     // 开启开关时不清除数据，保持现有选择状态
//     isSelected.value = false;
//   }
// });


// 监听选择数据变化，实时更新按钮状态
// watch(
//   [selectedData1, selectedData2],
//   () => {
//     // 实时检查双选状态
//     if (selectedData1.value && selectedData2.value) {
//       const isGastroscopy1 =
//         selectedData1.value.examSubclass.includes('胃镜') || selectedData1.value.itemName.includes('胃镜');
//       const isColonoscopy1 =
//         selectedData1.value.examSubclass.includes('肠镜') || selectedData1.value.itemName.includes('肠镜');
//       const isGastroscopy2 =
//         selectedData2.value.examSubclass.includes('胃镜') || selectedData2.value.itemName.includes('胃镜');
//       const isColonoscopy2 =
//         selectedData2.value.examSubclass.includes('肠镜') || selectedData2.value.itemName.includes('肠镜');

//       const isBothGastrointestinal = (isGastroscopy1 || isColonoscopy1) && (isGastroscopy2 || isColonoscopy2);
//       isSelected.value = isBothGastrointestinal;
//     } else {
//       isSelected.value = false;
//     }
//   },
//   { immediate: true }
// );

// 新增：完成按钮可用性逻辑
const canSubmit = computed(() => {
  return selectedRows.value.length > 0 && comboValid.value && isExamNoValid.value;
});

let lastClickTime = 0;
let clickCount = 0;

// 集中清空弹窗相关数据
const clearDialogData = () => {
  comboInput.value = '';
  comboIp.value = '';
  comboLensCodes.value = [];
  comboError.value = '';
  ruleForm.examNo = '';
  ruleForm.ip_and_lensCode = '';
  ruleForm.ip_and_lensCode2 = '';
  ruleForm.patLocalid = '';
  ruleForm.name = '';
  ruleForm.examClass = '';
  ruleForm.examSubclass = '';
  ruleForm.itemName = '';
  ruleForm.staffName = '';
  ruleForm.examTime = '';
  ruleForm.isAbnormal = '';

  selectedRows.value = [];
  isSelected.value = false;
  isSearch.value = false;
  isModify.value = false;
  forceSubmitCount.value = 0;
  selectedData1.value = null;
  selectedData2.value = null;
};

// 清空选择数据
const clearSelectedData = () => {
  selectedRows.value = [];
  isSelected.value = false;
  isSearch.value = false;
  isModify.value = false;
  forceSubmitCount.value = 0;
  selectedData1.value = null;
  selectedData2.value = null;
}

// 点击添加
const add = () => {
  clearSelectedData();
  // 如果上一次操作是修改则清空表单
  if (isModify.value) initForm(ruleForm);
  isModify.value = false;
  isSearch.value = false;
  isSelected.value = false; // 重置选择状态
  forceSubmitCount.value = 0; // 重置强制提交计数
  enableLensCode2.value = false; // 重置组合号②开关
  ruleForm.ip_and_lensCode2 = ''; // 清空组合号②
  selectedData1.value = null; // 清空选择数据
  selectedData2.value = null; // 清空选择数据
  conRecordDialog.value = true;
  // 新增：打开弹窗时立即触发组合号校验提示
  comboInput.value = comboInput.value; // 触发watch，立即校验
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

// 完成按钮逻辑调整
const update = async (formEl: FormInstance | undefined) => {
  // console.log('测试信息1');
  dialogLoad.value = true;
  try {
    if (!formEl) return;

    if (!isExamNoValid.value) {
      ElMessage.error('检查唯一号必填');
      return;
    }
    await formEl.validate();

    // 验证必填字段 - 组合号输入框的校验
    if (!isComboValid.value) {
      ElMessage.error(comboError.value);
      return;
    }

    // 内镜卡号数量必须大于等于选择的数据行
    if (selectedRows.value.length > comboLensCodes.value.length) {
      ElMessage.error("选择的数据不能多于内镜卡号数");
      return;
    }
    
    const ip = comboIp.value;
    const lensArr = comboLensCodes.value;
    const duplicates = findDuplicateLensCodes(lensArr);
    if (duplicates.length > 0) {
      ElMessage.error(`检测到重复的内镜卡号：${duplicates.join('、')}`);
      return;
    }

    // 正常批量提交
    if (comboValid.value && isExamNoValid.value) {
      const batch = selectedRows.value.map((row, i) => {
        return {
          // 只保留row的主数据
          examNo: row.examNo ? row.examNo : '',
          patLocalid: row.patLocalid ? row.patLocalid : '',
          name: row.name ? row.name : '',
          examClass: row.examClass ? row.examClass : '',
          examSubclass: row.examSubclass ? row.examSubclass : '',
          itemName: row.itemName ? row.itemName : '',
          staffName: row.staffName ? row.staffName : '',
          examTime: row.examTime ? row.examTime : '',
          isAbnormal: row.isAbnoraml ? row.isAbnoraml : '',
          // 其他必需字段可补充
          ip_and_lensCode: ip && lensArr[i] ? `${ip}=${lensArr[i]}` : '',
          // ip_and_lensCode: `${comboIp.value}=${comboLensCodes.value[i] || ''}` // 这里确保是字符串
        };
      });
      await conRecord.saveBatch(batch);
      await getList();
      conRecordDialog.value = false;
      clearDialogData();
      initForm(ruleForm);
      clickCount = 0;
      return;
    }

    if (selectedRows.value.length === 0) {
      ElMessage.warning('请先选择要提交的数据');
    }

    if (selectedRows.value.length > 0 && lensArr.length !== selectedRows.value.length) {
      ElMessage.warning(`已选${selectedRows.value.length}条数据，当前输入${lensArr.length}个内镜卡号，二者数量需一致`);
    }

    // 检测一秒内连续点击两次
    const now = Date.now();
    if (now - lastClickTime < 1000) {
      clickCount++;
    } else {
      clickCount = 1;
    }
    lastClickTime = now;

    // 强制录入逻辑
    if (clickCount >= 2 && isComboValid.value && isExamNoValid.value) {
      const batch = [];
      const indexList: number[] = [];
      if (selectedRows.value.length > 0) {
        const batch1 = selectedRows.value.map((row, i) => {
          indexList.push(i);
          return {
            // 只保留row的主数据
            examNo: row.examNo ? row.examNo : '',
            patLocalid: row.patLocalid ? row.patLocalid : '',
            name: row.name ? row.name : '',
            examClass: row.examClass ? row.examClass : '',
            examSubclass: row.examSubclass ? row.examSubclass : '',
            itemName: row.itemName ? row.itemName : '',
            staffName: row.staffName ? row.staffName : '',
            examTime: row.examTime ? row.examTime : '',
            isAbnormal: row.isAbnoraml ? row.isAbnoraml : '',
            ip_and_lensCode: ip && lensArr[i] ? `${ip}=${lensArr[i]}` : '',
          };
        });
        batch.push(...batch1);
      }

      const batch2 = lensArr.filter((item, i) => !indexList.includes(i)).map((item, i) => {
        return {
          examNo: ruleForm.examNo,
          ip_and_lensCode: ip && item ? `${ip}=${item}` : '',
          forceInsert: true,
        }
      })
      batch.push(...batch2);

      await conRecord.saveBatch(batch);
      await getList();
      conRecordDialog.value = false;
      clearDialogData();
      initForm(ruleForm);
      ElMessage.success('检测到连续点击，已触发强制录入机制');
      dialogLoad.value = false;
      clickCount = 0;
    }
    return;

  } catch (e) {
    console.log('表单验证失败', e);
    ElMessage.error('保存失败');
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
    const response = await conRecord.remove(id);
    getList();
    const res = response.data ?? response;
    if (res.code == 4000) ElMessage.success('该记录已成功删除');
    else ElMessage.error('删除失败');
  } catch (e) {
    console.log(e);
  }
};

// 导出记录
const download = async () => {
  try {
    let isAll = false;
    if (listQuery.isAbnormal === '2') {
      listQuery.isAbnormal = '';
      isAll = true;
    }
    const res = await conRecord.excel(removeInvalid(listQuery));
    if (isAll) listQuery.isAbnormal = '2';
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

// 判断是否为胃肠镜数据
const isGastrointestinalData = (data: any) => {
  const isGastroscopy = data.examSubclass.includes('胃镜') || data.itemName.includes('胃镜');
  const isColonoscopy = data.examSubclass.includes('肠镜') || data.itemName.includes('肠镜');
  return isGastroscopy || isColonoscopy;
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

.mark-number {
  color: #ff4757;
  font-weight: bold;
  background-color: #ffeaa7;
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: 5px;
}

.selection-status {
  display: flex;
  gap: 20px;
  align-items: center;
}

.status-item {
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;

  &.selected {
    background-color: #e8f5e8;
    border-color: #67c23a;
    color: #67c23a;
  }

  &.nonGastro {
    background-color: #fff3cd;
    border-color: #ffc107;
    color: #856404;
  }
}

.sel-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 2px solid #dcdfe6;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s, background 0.2s;
}

.sel-checkbox.checked {
  border-color: #409eff;
  background: #e6f7ff;
}

.sel-index {
  font-size: 16px;
  color: #606266;
  font-weight: bold;
}

.sel-checkbox.checked .sel-index {
  color: #409eff;
}

.sel-check {
  position: absolute;
  right: 2px;
  bottom: 2px;
  font-size: 14px;
  color: #409eff;
  font-weight: bold;
}

.selected-row {
  background: #e6f7ff !important;
}
</style>
