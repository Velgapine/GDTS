<template>
  <header>
    <div class="title">医院信息管理</div>
    <div class="sub-title">
      <span>医院管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>医院信息管理</span>
    </div>
  </header>
  <div class="container">
    <div class="title-box">
      <div class="title">医院信息管理</div>
      <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="add"
        >添加医院信息</my-btn
      >
    </div>
    <div class="content-box">
      <el-table :data="hospitalList" style="width: 100%">
        <el-table-column label="医院名称" prop="name"></el-table-column>
        <el-table-column label="Logo">
          <template #default="{ row }">
            <img v-if="row.logoUrl" :src="row.logoUrl" class="logo-img" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row, $index }">
            <div class="operate-btn">
              <span @click="edit(row, $index)">编辑</span>
              <span @click="remove($index)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogVisible" title="医院信息" width="40%">
      <el-form ref="formRef" :model="form" label-width="95px" size="large" class="form">
        <el-form-item label="医院名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入医院名称" />
        </el-form-item>
        <el-form-item label="医院Logo：">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeLogoUpload"
            :on-change="handleLogoChange"
            :auto-upload="false"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="logo-img" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-button v-if="form.logoUrl" type="danger" size="small" @click="removeLogo">删除</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ArrowRight, Plus } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';
import { getHospitalInfo, setHospitalInfo, removeHospitalInfo } from '@/web/utils/hospitalInfo';

const form = ref({
  name: '',
  logoUrl: '',
});
const formRef = ref();
const dialogVisible = ref(false);
const editIndex = ref(-1);

const hospitalList = ref<any[]>([]);

onMounted(() => {
  // 只支持单条医院信息，兼容表格展示
  const info = getHospitalInfo();
  hospitalList.value = info && info.name ? [info] : [];
});

const add = () => {
  form.value = { name: '', logoUrl: '' };
  editIndex.value = -1;
  dialogVisible.value = true;
};

const edit = (row: any, idx: number) => {
  form.value = { ...row };
  editIndex.value = idx;
  dialogVisible.value = true;
};

const beforeLogoUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片文件');
  }
  return isImage;
};

const handleLogoChange = (file: any) => {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    form.value.logoUrl = e.target.result;
  };
  reader.readAsDataURL(file.raw);
};

const save = () => {
  // 如果医院名称为null或空，自动替换为''
  if (!form.value.name || form.value.name === null) {
    form.value.name = ' ';
  }
  // 只允许一条医院信息
  setHospitalInfo({ name: form.value.name, logoUrl: form.value.logoUrl });
  hospitalList.value = [{ name: form.value.name, logoUrl: form.value.logoUrl }];
  dialogVisible.value = false;
  ElMessage.success('保存成功');
  setTimeout(() => {
    location.reload();
  }, 300);
};

const remove = (idx: number) => {
  removeHospitalInfo();
  hospitalList.value = [];
  ElMessage.success('已删除');
  setTimeout(() => {
    location.reload();
  }, 300);
};

const removeLogo = () => {
  form.value.logoUrl = '';
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
    margin-top: 20px;
  }
  .logo-img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border: 1px solid #eee;
    border-radius: 8px;
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
