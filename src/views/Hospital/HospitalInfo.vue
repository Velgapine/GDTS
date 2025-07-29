<template>
  <header>
    <div class="title">医院信息管理</div>
    <div class="sub-title">
      <span>医院管理</span>
      <el-icon>
        <ArrowRight />
      </el-icon>
      <span>医院信息管理</span>
    </div>
  </header>
  <div class="container">
    <div class="title-box">
      <div class="title">医院信息管理</div>
      <div>
        <my-btn color="#fff" style="border: 1px solid #e4e7ed; margin-right: 10px;" @click="refreshData">刷新数据</my-btn>
        <!-- <my-btn color="#fff" style="border: 1px solid #e4e7ed; margin-right: 10px;" @click="testImageUrl">测试图片URL</my-btn> -->
        <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="add">添加医院信息</my-btn>
      </div>
    </div>
    <div class="content-box">
      <el-table v-loading="tableLoad" :data="hospitalList" style="width: 100%">
        <template #empty>
          <div style="text-align: center; padding: 20px; color: #909399;">
            暂无医院信息数据
          </div>
        </template>
        <el-table-column label="医院名称">
          <template #default="{ row }">
            {{ row.name || row.hospitalName || '' }}
          </template>
        </el-table-column>
        <el-table-column label="Logo">
          <template #default="{ row }">
            <img v-if="getLogoUrl(row)" :src="getLogoUrl(row)" class="logo-img" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row, $index }">
            <div class="operate-btn">
              <span @click="edit(row, $index)">编辑</span>
              <span @click="remove(row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogVisible" title="医院信息" width="40%" @close="cancelDialog" class="hospital-dialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="95px" size="large" class="form">
        <el-form-item label="医院名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入医院名称" />
        </el-form-item>
        <el-form-item label="医院Logo：">
          <!-- 编辑模式下显示当前logo -->
          <!-- <div v-if="form.id && currentHospitalLogo" class="current-logo">
            <span class="current-logo-label">当前Logo：</span>
            <img :src="currentHospitalLogo" class="logo-img" />
          </div> -->
          <el-upload class="avatar-uploader" :show-file-list="false" :before-upload="beforeLogoUpload"
            :on-change="handleLogoChange" :auto-upload="false">
            <img v-if="form.logoUrl" :src="form.logoUrl" class="logo-img" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <el-button v-if="form.logoUrl" @click="removeLogo" type="danger" size="small">删除</el-button>
        </el-form-item>
        <!-- 编辑模式下显示删除当前Logo按钮，放在左下角 -->
        <div v-if="form.id && currentHospitalLogo && !form.logoUrl" class="delete-current-logo-container">
          <el-button @click="deleteCurrentLogo" type="danger" size="small">删除当前Logo</el-button>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="save" :loading="saveLoading">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ArrowRight, Plus } from '@element-plus/icons-vue';
import { ref, onMounted, reactive, watch, computed } from 'vue';
import { getHospitalInfo, setHospitalInfo, removeHospitalInfo } from '@/web/utils/hospitalInfo';
import { fetchHospitalInfo } from '@/web/utils/globalHospitalInfo';
import hospital from '@/web/api/hospital';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
// 获取baseURL
import baseUrl from '@/web/utils/baseUrl';

const form = ref({
  id: null as number | null,
  name: '',
  logoUrl: '',
});
const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const editIndex = ref(-1);
const tableLoad = ref(false);
const saveLoading = ref(false);
const hospitalList = ref<any[]>([]);

// 计算当前医院的logo URL
const currentHospitalLogo = computed(() => {
  if (form.value.id) {
    const hospital = hospitalList.value.find(item => item.id === form.value.id);
    if (hospital) {
      let logoUrl = hospital.logoUrl || hospital.logo || '';
      if (logoUrl && typeof logoUrl === 'string' && logoUrl.startsWith('/')) {
        logoUrl = baseUrl + logoUrl;
      }
      return logoUrl;
    }
  }
  return '';
});

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    // { required: true, message: '医院名称不能为空', trigger: 'blur' }
  ]
});

onMounted(() => {
  getHospitalList();
});

// 监听对话框关闭事件，确保清理暂存数据
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    // 对话框关闭时，清理暂存数据
    setTimeout(() => {
      if (!dialogVisible.value) {
        form.value = { id: null, name: '', logoUrl: '' };
        editIndex.value = -1;
      }
    }, 100);
  }
});

// 刷新数据
const refreshData = () => {
  getHospitalList();
  resetPage();
};

// 如果需要刷新页面，可以使用下面的代码
const resetPage = () => {
  setTimeout(() => {
    location.reload();
  }, 300);
};

// 获取医院信息列表
const getHospitalList = async () => {
  tableLoad.value = true;
  try {
    const response = await hospital.getList();

    // 检查不同的数据结构可能性
    let data = null;
    if (response.data) {
      data = response.data;
    } else if (response.data && response.data.page && response.data.page.records) {
      data = response.data.page.records;
    } else if (Array.isArray(response)) {
      data = response;
    } else {
      data = response;
    }

    // 确保数据是数组格式，并且过滤掉无效数据
    if (Array.isArray(data)) {
      // 过滤掉没有name字段的数据
      hospitalList.value = data.filter(item => item && (item.name || item.hospitalName));
    } else if (data && typeof data === 'object' && (data.name || data.hospitalName)) {
      // 如果是单个有效对象，转换为数组
      hospitalList.value = [data];
    } else {
      hospitalList.value = [];
    }

    // 如果后端有数据，更新本地缓存
    if (hospitalList.value.length > 0) {
      const firstHospital = hospitalList.value[0];

      // 处理Logo URL
      let logoUrl = firstHospital.logoUrl || firstHospital.logo || '';
      if (logoUrl && typeof logoUrl === 'string' && logoUrl.startsWith('/')) {
        // 如果是相对路径，使用API的baseURL拼接完整URL
        logoUrl = baseUrl + logoUrl;
      }

      setHospitalInfo({
        name: firstHospital.name || firstHospital.hospitalName || '',
        logoUrl: logoUrl
      });
    }

  } catch (error) {
    console.error('获取医院信息失败:', error);
    // ElMessage.error('获取医院信息失败');

    // 如果后端请求失败，清空列表，让表格显示空状态
    hospitalList.value = [];
  } finally {
    tableLoad.value = false;
  }
};

const add = () => {
  // 清理之前的数据
  form.value = { id: null, name: '', logoUrl: '' };
  editIndex.value = -1;
  dialogVisible.value = true;
};

const edit = (row: any, idx: number) => {
  // 清理之前的数据
  form.value = { id: null, name: '', logoUrl: '' };

  // 只填充医院名称，不填充logo
  form.value = {
    id: row.id,
    name: row.name || row.hospitalName || '',
    logoUrl: '' // 编辑时不填充现有logo，避免误操作
  };
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


const handleLogoChange = async (file: any) => {
  try {
    // 上传Logo到后端
    const response = await hospital.uploadLogo(file.raw);

    // 处理返回的Logo路径
    let logoUrl = '';
    if (response.data) {
      // 如果返回的是相对路径，需要拼接完整的URL
      if (typeof response.data === 'string' && response.data.startsWith('/')) {
        // 使用API的baseURL拼接完整URL
        logoUrl = baseUrl + response.data;
      } else if (response.data.logoUrl) {
        logoUrl = response.data.logoUrl;
      } else if (response.data.url) {
        logoUrl = response.data.url;
      } else {
        logoUrl = response.data;
      }
    }

    form.value.logoUrl = logoUrl;
    // ElMessage.success('Logo上传成功');
  } catch (error) {
    console.error('Logo上传失败:', error);
    // ElMessage.error('Logo上传失败');

    // 如果后端上传失败，使用本地base64
    const reader = new FileReader();
    reader.onload = (e: any) => {
      form.value.logoUrl = e.target.result;
    };
    reader.readAsDataURL(file.raw);
  }
};

const save = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    saveLoading.value = true;

    // 如果医院名称为null或空，自动替换为空格
    if (!form.value.name || form.value.name === null) {
      form.value.name = ' ';
    }

    // 如果是编辑模式且没有上传新logo，保持原有logo
    if (form.value.id && !form.value.logoUrl) {
      const originalHospital = hospitalList.value.find(item => item.id === form.value.id);
      if (originalHospital) {
        form.value.logoUrl = originalHospital.logoUrl || originalHospital.logo || '';
      }
    }

    let response;
    if (form.value.id) {
      // 更新医院信息
      response = await hospital.update(form.value);
      // ElMessage.success('更新成功');
    } else {
      // 新增医院信息
      response = await hospital.save(form.value);
      // ElMessage.success('添加成功');
    }

    // 更新本地缓存
    const hospitalData = response.data || form.value;

    // 处理Logo URL
    let logoUrl = hospitalData.logoUrl || hospitalData.logo || '';
    if (logoUrl && typeof logoUrl === 'string' && logoUrl.startsWith('/')) {
      // 如果是相对路径，使用API的baseURL拼接完整URL
      logoUrl = baseUrl + logoUrl;
    }

    setHospitalInfo({
      name: hospitalData.name || hospitalData.hospitalName || '',
      logoUrl: logoUrl
    });

    // 直接更新本地数据，避免重新请求
    if (response.data) {
      const hospitalData = response.data;
      const updatedHospital = {
        id: hospitalData.id || form.value.id,
        name: hospitalData.name || hospitalData.hospitalName || form.value.name,
        logoUrl: hospitalData.logoUrl || hospitalData.logo || form.value.logoUrl
      };

      // 更新表格数据
      if (form.value.id) {
        // 更新模式
        const index = hospitalList.value.findIndex(item => item.id === form.value.id);
        if (index !== -1) {
          hospitalList.value[index] = updatedHospital;
        }
      } else {
        // 新增模式
        hospitalList.value = [updatedHospital];
      }
    }

    // 关闭对话框并清理暂存数据
    dialogVisible.value = false;
    form.value = { id: null, name: '', logoUrl: '' };
    editIndex.value = -1;

    // 保存成功后，调用全局方法同步医院信息到本地缓存
    // await fetchHospitalInfo();

    // 如果需要刷新页面，可以使用下面的代码
    resetPage();

  } catch (error) {
    console.error('保存失败:', error);
    // ElMessage.error('保存失败');
  } finally {
    saveLoading.value = false;
  }
};

const remove = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条医院信息吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    await hospital.remove(id);
    // ElMessage.success('删除成功');

    // 清除本地缓存
    removeHospitalInfo();

    // 直接从列表中移除，避免重新请求
    hospitalList.value = hospitalList.value.filter(item => item.id !== id);

    // 删除成功后，调用全局方法同步医院信息到本地缓存
    // await fetchHospitalInfo();

    // 如果需要刷新页面，可以使用下面的代码
    resetPage();

  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error);
      // ElMessage.error('删除失败');
    }
  }
};

// 获取Logo URL的辅助函数
const getLogoUrl = (row: any) => {
  let logoUrl = row.logoUrl || row.logo || '';
  if (logoUrl && typeof logoUrl === 'string' && logoUrl.startsWith('/')) {
    // 如果是相对路径，使用API的baseURL拼接完整URL
    logoUrl = baseUrl + logoUrl;
  }
  return logoUrl;
};

// 图片加载错误处理（已移除，简化界面）

// 测试图片URL（已注释，保留以备调试）
// const testImageUrl = () => {
//   if (hospitalList.value.length > 0) {
//     const firstHospital = hospitalList.value[0];
//     const logoUrl = getLogoUrl(firstHospital);
//     console.log('测试图片URL:', logoUrl);
//     console.log('当前环境:', process.env.NODE_ENV);
//     console.log('window.httpUrl:', window.httpUrl);
//
//     // 尝试直接访问图片
//     if (logoUrl) {
//       const img = new Image();
//       img.onload = () => {
//         console.log('图片加载成功:', logoUrl);
//         ElMessage.success('图片URL有效');
//       };
//       img.onerror = () => {
//         console.error('图片加载失败:', logoUrl);
//         ElMessage.error('图片URL无效');
//       };
//       img.src = logoUrl;
//     }
//   } else {
//     ElMessage.warning('没有医院数据可测试');
//   }
// };

// 取消对话框，清理暂存数据
const cancelDialog = () => {
  // 清理暂存的Logo
  removeLogo();
  // 关闭对话框
  dialogVisible.value = false;
  // 重置表单
  form.value = { id: null, name: '', logoUrl: '' };
  // 重置编辑索引
  editIndex.value = -1;
};

// 删除当前Logo
const deleteCurrentLogo = () => {
  // // 将当前logoUrl赋值给form.value.logoUrl
  // form.value.logoUrl = currentHospitalLogo.value;
  // // 调用removeLogo进行删除请求
  // removeLogo();

  form.value.logoUrl = ' ';
  save();
};

const removeLogo = async () => {
  try {
    // 清理暂存的Logo
    if (form.value.logoUrl && form.value.logoUrl.trim() !== '') {
      // 如果是base64格式的图片，不需要调用后端删除
      if (!form.value.logoUrl.startsWith('data:')) {
        await hospital.deleteLogo(form.value.logoUrl);
      }
    }
    form.value.logoUrl = '';
  } catch (error) {
    console.error('Logo清理失败:', error);
    // 即使删除失败，也要清空本地数据
    form.value.logoUrl = '';
  }
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

  .current-logo {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;

    .current-logo-label {
      display: block;
      font-size: 12px;
      color: #6c757d;
      margin-bottom: 5px;
    }
  }

  .delete-current-logo-container {
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 10;
  }
}

// 对话框样式
:deep(.hospital-dialog .el-dialog__body) {
  position: relative;
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

.avatar-uploader {
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
