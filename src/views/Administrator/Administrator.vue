<template>
  <header>
    <div class="title">医院管理</div>
    <div class="sub-title">
      <span>医院管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>用户管理</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </header>
  <div class="container">
    <div class="title-box">
      <div class="title">用户管理</div>
      <!-- <my-btn
        color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)"
        @click="userDialog = true"
        >添加管理员</my-btn
      > -->
    </div>
    <div class="content-box">
      <!-- 管理员展示区 -->
      <el-table :data="userList.data" style="width: 100%">
        <el-table-column prop="user_name" label="用户名" />
        <el-table-column prop="id" label="用户ID" />
        <el-table-column label="身份">
          <template #default="{ row }">
            <span v-if="row.role_id === 1">超级管理员</span>
            <span v-else-if="row.role_id === 2">管理员</span>
            <span v-else>员工</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template #default="{ row }">
            <div class="operate-btn">
              <span v-if="checkAuthority(row.user_name)" @click="remove(row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 添加/修改管理员弹窗 -->
  <el-dialog v-model="userDialog" title="添加管理员" width="60%">
    <div class="dialog-title">
      <div class="text">操作</div>
      <div>
        <my-btn color="#d9ecff" class="btn">绑定</my-btn>
        <my-btn color="#faecd8" class="btn">换卡</my-btn>
        <my-btn color="#fde2e2" class="btn">解绑</my-btn>
      </div>
    </div>
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
          <el-form-item label="姓名：" prop="userName">
            <el-input v-model="ruleForm.userName" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="update(ruleFormRef)"
          >完成</my-btn
        >
        <my-btn color="#fff" style="border: 1px solid #e4e7ed" @click="userDialog = false">取消</my-btn>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import adm from '@/web/api/administrator';
import removeInvalid from '@/utils/removeInvalid';
import initForm from '@/utils/initForm';
import confirm from '@/utils/confirm';

const { username } = useStore().state;

// 获取管理员列表的查询字符串对象
const listQuery = reactive({
  userName: '', // 管理员名称
});

// 添加/修改管理员
const userDialog = ref(false);

const ruleForm = reactive({
  userName: '', // 名称
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  userName: [{ required: true, message: '必填', trigger: 'blur, change' }],
});

// 修改时给表单进行赋值
// const modify = (row: any) => {
//   ruleForm.userName = row.user_name;
//   userDialog.value = true;
// };

const update = async (formEl: FormInstance | undefined) => {
  try {
    if (!formEl) return;
    await formEl.validate();
    const data = removeInvalid(ruleForm);
    await adm.save(data);
    // 更新表单
    await getList();
    userDialog.value = false;
    // 将表单所有值赋值为空值
    initForm(ruleForm);
  } catch (e) {
    console.log(e);
  }
};

const remove = async (id: number) => {
  try {
    await confirm('您确定要删除吗？');
    await adm.remove(id);
    getList();
  } catch (e) {
    console.log(e);
  }
};

// 管理员列表
const userList = reactive({ data: [] });

onMounted(() => {
  getList();
});

const getList = async () => {
  try {
    const query = removeInvalid(listQuery);
    const { data } = await adm.getList(query);
    userList.data = data;
  } catch (e) {
    console.log(e);
  }
};

// 判断该用户是否能进行删除操作
const checkAuthority = (rowName: string) => {
  let list = ['Administrator', 'admin', 'visitor', username];
  for (let name of list) {
    if (rowName === name) return false;
  }
  return true;
};
</script>

<style lang="scss" userd>
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
  .del-btn {
    color: red;
  }
}
</style>
