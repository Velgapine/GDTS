<template>
  <!-- 添加内镜弹窗 -->
  <el-dialog v-model="typeDialog" v-loading="typeDialogLoad" title="添加内镜类型" width="60%">
    <el-form ref="typeFormRef" :model="typeForm" label-position="left" label-width="80px" size="large" class="form">
      <el-row justify="space-between">
        <el-col :span="12">
          <el-form-item label="名称：" prop="typeName">
            <el-input v-model="typeForm.typeName" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="content-box">
      <!-- 内镜展示区 -->
      <el-table v-loading="tableLoad" :data="typeList.data" style="width: 100%">
        <el-table-column label="名称" prop="typeName"></el-table-column>
        <el-table-column label="创建时间" prop="createAt" />
        <el-table-column label="更新时间" prop="updateAt" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <div class="operate-btn">
              <span @click="remove(row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-row justify="center">
      <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="update()">完成</my-btn>
      <my-btn color="#fff" style="border: 1px solid #e4e7ed" @click="closeDialog">取消</my-btn>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
import scopeType from '@/web/api/type';
import removeInvalid from '@/utils/removeInvalid';
import initForm from '@/utils/initForm';
import confirm from '@/utils/confirm';

const props = defineProps({
  typeDialog: {
    type: Boolean,
    default: false,
  },
});
const typeDialog = ref(props.typeDialog);

const emits = defineEmits(['update:typeDialog']);

// 关闭弹窗
const closeDialog = () => {
  emits('update:typeDialog', false);
};

// 是否加载中
const tableLoad = ref(false);
const typeDialogLoad = ref(false);

const typeForm = reactive({
  typeName: '', // 内镜类型名
});

const update = async () => {
  typeDialogLoad.value = true;
  try {
    const data = removeInvalid(typeForm);
    await scopeType.save(data);
    // 更新表单
    await getList();
    // 将表单所有值赋值为空值
    initForm(typeForm);
  } catch (e) {
    console.log(e);
  }
  typeDialogLoad.value = false;
};

// 删除
const remove = async (id: string) => {
  typeDialogLoad.value = true;
  try {
    await confirm('您确定要删除吗？');
    await scopeType.remove(id);
    getList();
  } catch (e) {
    console.log(e);
  }
  typeDialogLoad.value = false;
};

// 内镜列表
const typeList = reactive({ data: [] });

onMounted(() => {
  // getList();
});

const getList = async () => {
  tableLoad.value = true;
  try {
    const { data } = await scopeType.getList();
    typeList.data = data;
    console.log(typeList.data);
  } catch (e) {
    console.log(e);
  }
  tableLoad.value = false;
};
</script>

<style lang="scss" scoped>
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
