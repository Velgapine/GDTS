<template>
  <header v-show="!isVisitor">
    <div class="title">病人管理</div>
    <div class="sub-title">
      <span>病人管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>诊疗记录</span>
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
        <el-table-column label="检查时间" prop="examTime" width="180px"></el-table-column>
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
          <el-form-item :label="isModify ? '修改的组合号:' : '组合号：'" prop="ip_and_lensCode">
            <el-input v-model="ruleForm.ip_and_lensCode" placeholder="输入示例:192.168.0.1=test" style="width: 350px" />
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
          </el-form-item>
        </el-col>
        <el-col :span="4"
          ><el-button :disabled="isModify" type="success" style="margin-left: 20px" @click="searchHaidong()"
            >查询</el-button
          ></el-col
        >
      </el-row>
      <!-- 展示查询后的信息 -->
      <el-row v-show="isSearch" justify="center" style="margin-bottom: 20px">
        <span class="choice-tips">提示：点击表格数据进行选择</span>
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
          <el-table-column label="检查子类" prop="examSubclass"></el-table-column>
          <el-table-column label="检查项目" prop="itemName"></el-table-column>1
          <el-table-column label="检查时间" prop="examTime"></el-table-column>
        </el-table>
      </el-row>
      <el-row justify="center">
        <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="update(ruleFormRef)"
          >完成</my-btn
        >
        <my-btn
          color="#fff"
          style="border: 1px solid #e4e7ed"
          @click="
            conRecordDialog = false;
            isSearch = false;
          "
          >取消</my-btn
        >
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
import { ElMessage } from 'element-plus/lib/components';
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
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  // ip_and_lensCode: [{ required: true, message: '必填', trigger: 'blur, change' }],
  examNo: [{ required: true, message: '必填', trigger: 'blur, change' }],
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
    // 改接口端口为8612
    // const baseUrl = process.env.NODE_ENV === 'development' ? 'http://1.117.155.214' : window.httpUrl.slice(0, -5);
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1' : window.httpUrl.slice(0, -5);
    const res = await fetch(`${baseUrl}:8610/haidong/fakesearch?examNo=${ruleForm.examNo}`, {
      method: 'GET',
      headers: {
        token: store.state.token,
      },
    });
    const { data } = await res.json();
    searchData.value = data;
    isSearch.value = true;
  } catch (e) {
    console.log(e);
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
  ElMessage.success(`已选择检查子类为${examSubclass}、检查项目为${itemName}的记录`);
};

// 点击添加
const add = () => {
  // 如果上一次操作是修改则清空表单
  if (isModify.value) initForm(ruleForm);
  isModify.value = false;
  isSearch.value = false;
  conRecordDialog.value = true;
};

// 修改时给表单进行赋值
const modify = (row: any) => {
  Object.assign(ruleForm, row);
  isModify.value = true;
  isSearch.value = true;
  conRecordDialog.value = true;
};

const update = async (formEl: FormInstance | undefined) => {
  dialogLoad.value = true;
  try {
    if (!formEl) return;
    await formEl.validate();
    const data = removeInvalid(ruleForm);
    isModify.value ? await conRecord.update(data) : await conRecord.save(data);
    // 更新表单
    await getList();
    isModify.value = false;
    isSearch.value = false;
    conRecordDialog.value = false;
    // 将表单所有值赋值为空值
    initForm(ruleForm);
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
  } catch (e) {
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
</style>
