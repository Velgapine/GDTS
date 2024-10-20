<template>
  <header>
    <div class="title">诊疗管理</div>
    <div class="sub-title">
      <span>诊疗管理</span>
      <el-icon><ArrowRight /></el-icon>
      <!-- <span>医院信息</span>
      <el-icon><ArrowRight /></el-icon> -->
      <span>诊疗室管理</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </header>
  <div class="container">
    <div class="title-box">
      <div class="title">诊疗室管理</div>
      <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="add">添加诊疗室</my-btn>
    </div>
    <div class="second-row">
      <el-input
        v-model="listQuery.consultingRoomName"
        placeholder="请输入诊疗室名称"
        clearable
        size="small"
        @clear="getList"
      />
      <el-input v-model="listQuery.ip" placeholder="请输入诊疗室ip" clearable size="small" @clear="getList" />
      <el-button type="primary" @click="getList"> 查询 </el-button>
      <el-button @click="reset"> 重置 </el-button>
    </div>
    <div class="content-box">
      <!-- 诊疗室展示区 -->
      <el-table v-loading="tableLoad" :data="consultList.data" style="width: 100%">
        <el-table-column label="诊疗室名称" prop="consultingRoomName"></el-table-column>
        <el-table-column prop="ip" label="诊疗室ip" />
        <el-table-column prop="createAt" label="创建时间" />
        <el-table-column prop="updateAt" label="更新时间" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <div class="operate-btn">
              <span @click="modify(row)">编辑</span>
              <span @click="remove(row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 添加/修改诊疗室弹窗 -->
  <el-dialog v-model="consultDialog" v-loading="dialogLoad" :title="isModify ? '修改诊疗室' : '添加诊疗室'" width="60%">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      label-width="90px"
      size="large"
      class="form"
    >
      <el-row justify="space-between">
        <el-col :span="12">
          <el-form-item label="名称：" prop="consultName">
            <el-input v-model="ruleForm.consultingRoomName" placeholder="请输入内容" clearable style="width: 350px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="诊疗室ip：" prop="comment">
            <el-input v-model="ruleForm.ip" placeholder="请输入内容" clearable style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="update(ruleFormRef)"
          >完成</my-btn
        >
        <my-btn color="#fff" style="border: 1px solid #e4e7ed" @click="consultDialog = false">取消</my-btn>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import consult from '@/web/api/consult';
import removeInvalid from '@/utils/removeInvalid';
import initForm from '@/utils/initForm';
import confirm from '@/utils/confirm';

// 是否加载中
const tableLoad = ref(false);
const dialogLoad = ref(false);

// 添加/修改诊疗室
const consultDialog = ref(false);
const isModify = ref(false); // 默认为添加

const listQuery = reactive({
  consultingRoomName: '',
  ip: '',
});

let ruleForm = reactive({
  consultingRoomName: '', // 诊疗室名
  ip: '', // 诊疗室对应ip
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  consultingRoomName: [{ required: true, message: '必填', trigger: 'blur, change' }],
  ip: [{ required: true, message: '必填', trigger: 'blur, change' }],
});

// 点击添加
const add = () => {
  // 如果上一次操作是修改则清空表单
  if (isModify.value) initForm(ruleForm);
  isModify.value = false;
  consultDialog.value = true;
};

// 修改时给表单进行赋值
const modify = (row: any) => {
  Object.assign(ruleForm, row);
  isModify.value = true;
  consultDialog.value = true;
};

const update = async (formEl: FormInstance | undefined) => {
  dialogLoad.value = true;
  try {
    if (!formEl) return;
    await formEl.validate();
    const data = removeInvalid(ruleForm);
    isModify.value ? await consult.update(data) : await consult.save(data);
    // 更新表单
    await getList();
    isModify.value = false;
    consultDialog.value = false;
    // 将表单所有值赋值为空值
    initForm(ruleForm);
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = true;
};

// 删除
const remove = async (id: number) => {
  dialogLoad.value = true;
  try {
    await confirm('您确定要删除吗？');
    await consult.remove(id);
    getList();
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

// 诊疗室列表
const consultList = reactive({ data: [] });

onMounted(() => {
  getList();
});

const getList = async () => {
  tableLoad.value = true;
  try {
    const { data } = await consult.getList(removeInvalid(listQuery));
    consultList.data = data;
  } catch (e) {
    console.log(e);
  }
  tableLoad.value = false;
};

// 重置listQuery并刷新
const reset = () => {
  initForm(listQuery);
  getList();
};
</script>

<style lang="scss" consultd>
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
  .second-row {
    display: flex;
    margin-top: 10px;
    .el-input {
      margin-right: 10px;
      width: 200px;
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
