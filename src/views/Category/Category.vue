<template>
  <header>
    <div class="title">设备管理</div>
    <div class="sub-title">
      <span>设备管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>设备类型管理</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </header>
  <div class="container">
    <div class="title-box">
      <div class="title">设备类型管理</div>
      <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="add"
        >添加设备类型</my-btn
      >
    </div>
    <div class="content-box">
      <!-- 设备展示区 -->
      <el-table v-loading="tableLoad" :data="typeList.data" style="width: 100%">
        <el-table-column label="名称" prop="typeName"></el-table-column>
        <el-table-column label="备注" prop="comment" />
        <el-table-column label="创建时间" prop="createAt" />
        <el-table-column label="更新时间" prop="updateAt" />
        <el-table-column label="操作" width="160">
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
  <el-dialog
    v-model="typeDialog"
    v-loading="dialogLoad"
    :title="isModify ? '修改设备类型' : '添加设备类型'"
    width="60%"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      label-width="80px"
      size="large"
      class="form"
    >
      <el-row justify="space-between">
        <el-col :span="12">
          <el-form-item label="名称：" prop="typeName">
            <el-input v-model="ruleForm.typeName" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注：" prop="comment">
            <el-input v-model="ruleForm.comment" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="update(ruleFormRef)"
          >完成</my-btn
        >
        <my-btn color="#fff" style="border: 1px solid #e4e7ed" @click="typeDialog = false">取消</my-btn>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import category from '@/web/api/category';
import removeInvalid from '@/utils/removeInvalid';
import initForm from '@/utils/initForm';
import confirm from '@/utils/confirm';

// 是否加载中
const tableLoad = ref(false);
const dialogLoad = ref(false);

// 添加/修改设备
const typeDialog = ref(false);
const isModify = ref(false); // 默认为添加

const ruleForm = reactive({
  id: '', // 唯一id
  typeName: '', // 类型名
  comment: '', // 备注
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  typeName: [{ required: true, message: '必填', trigger: 'blur, change' }],
});

// 点击添加
const add = () => {
  // 如果上一次操作是修改则清空表单
  if (isModify.value) initForm(ruleForm);
  isModify.value = false;
  typeDialog.value = true;
};

// 修改时给表单进行赋值
const modify = (row: any) => {
  Object.assign(ruleForm, row);
  isModify.value = true;
  typeDialog.value = true;
};

const update = async (formEl: FormInstance | undefined) => {
  dialogLoad.value = true;
  try {
    if (!formEl) return;
    await formEl.validate();
    const data = removeInvalid(ruleForm);
    isModify.value ? await category.update(data) : await category.save(data);
    // 更新表单
    await getList();
    isModify.value = false;
    typeDialog.value = false;
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
    await category.remove(id);
    getList();
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

// 设备列表
const typeList = reactive({ data: [] });

onMounted(() => {
  getList();
});

const getList = async () => {
  tableLoad.value = true;
  try {
    const { data } = await category.getList();
    typeList.data = data;
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
