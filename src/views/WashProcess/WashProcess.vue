<template>
  <header>
    <div class="title">设备管理</div>
    <div class="sub-title">
      <span>设备管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>洗消流程管理</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </header>
  <div class="container">
    <div class="title-box">
      <div class="title">洗消流程管理</div>
      <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="add">添加流程</my-btn>
    </div>
    <div class="content-box">
      <!-- 设备展示区 -->
      <el-table v-loading="tableLoad" :data="flowList.data" style="width: 100%">
        <el-table-column label="名称" prop="flowName"></el-table-column>
        <el-table-column label="组号" prop="groupId"></el-table-column>
        <el-table-column label="描述" prop="flowDescript"></el-table-column>
        <el-table-column label="整个流程所需时间(单位：秒)" prop="flowMinTime"></el-table-column>
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

  <!-- 添加/修改设备弹窗 -->
  <el-dialog v-model="flowDialog" v-loading="dialogLoad" :title="isModify ? '修改流程' : '添加流程'" width="60%">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      label-width="100px"
      size="large"
      class="form"
    >
      <el-row justify="space-between">
        <el-col :span="12">
          <el-form-item label="名称：" prop="flowName">
            <el-input v-model="ruleForm.flowName" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组号：" prop="groupId">
            <el-input v-model.number="ruleForm.groupId" placeholder="请输入整数" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12">
          <el-form-item label="流程所需时间:" prop="flowMinTime">
            <el-input v-model.number="ruleForm.flowMinTime" placeholder="请输入内容(单位：秒)" style="width: 350px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="comment">
            <el-input v-model="ruleForm.comment" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述：" prop="flowDescript">
        <el-input
          v-model="ruleForm.flowDescript"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-row justify="center">
        <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="update(ruleFormRef)"
          >完成</my-btn
        >
        <my-btn color="#fff" style="border: 1px solid #e4e7ed" @click="flowDialog = false">取消</my-btn>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import process from '@/web/api/washProcess';
import removeInvalid from '@/utils/removeInvalid';
import initForm from '@/utils/initForm';

// 是否加载中
const tableLoad = ref(false);
const dialogLoad = ref(false);

// 添加/修改设备
const flowDialog = ref(false);
const isModify = ref(false); // 默认为添加

const ruleForm = reactive({
  id: '', // 唯一id
  flowName: '',
  groupId: undefined,
  flowDescript: '',
  flowMinTime: '',
  comment: '',
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  flowName: [{ required: true, message: '必填', trigger: 'blur, change' }],
  groupId: [{ required: true, message: '必填', trigger: 'blur, change' }],
});

// 点击添加
const add = () => {
  // 如果上一次操作是修改则清空表单
  if (isModify.value) initForm(ruleForm);
  isModify.value = false;
  flowDialog.value = true;
};

// 修改时给表单进行赋值
const modify = (row: any) => {
  Object.assign(ruleForm, row);
  isModify.value = true;
  flowDialog.value = true;
};

const update = async (formEl: FormInstance | undefined) => {
  dialogLoad.value = true;
  try {
    if (!formEl) return;
    await formEl.validate();
    const data = removeInvalid(ruleForm);
    isModify.value ? await process.update(data) : await process.save(data);
    // 更新表单
    await getList();
    isModify.value = false;
    flowDialog.value = false;
    // 将表单所有值赋值为空值
    initForm(ruleForm);
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

// 删除
const remove = async (id: string) => {
  dialogLoad.value = true;

  try {
    await confirm('您确定要删除吗？');
    await process.remove(id);
    getList();
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

onMounted(() => {
  getList();
});

// 获取设备列表
const flowList = reactive({
  data: [],
});

const getList = async () => {
  tableLoad.value = true;
  try {
    const { data } = await process.getList();
    flowList.data = data;
  } catch (e) {
    console.log(e);
  }
  tableLoad.value = false;
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
