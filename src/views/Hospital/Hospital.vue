<template>
  <header>
    <div class="title">医院管理</div>
    <div class="sub-title">
      <span>医院管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>医院信息</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </header>
  <div class="container">
    <div class="title-box">
      <div class="title">医院信息</div>
    </div>
    <div class="content-box">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-position="right"
        label-width="95px"
        size="large"
        class="form"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item label="医院名称：" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="11">
            <el-form-item label="备注：" prop="comment">
              <el-input v-model="ruleForm.comment" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="center">
          <my-btn
            color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)"
            @click="saveHospital(ruleFormRef)"
            >修改信息</my-btn
          >
          <my-btn color="#fff" style="border: 1px solid #e4e7ed" @click="toDept">科室管理</my-btn>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import removeInvalid from '@/utils/removeInvalid';
import hospital from '@/web/api/hospital';

// 获取医院名称
onMounted(() => {
  getHospital();
});

const getHospital = async () => {
  try {
    await hospital.getList();
  } catch (e) {
    console.log(e);
  }
};

// 保存
const ruleForm = reactive({
  name: '', // 医院名称
  comment: '', // 备注
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [{ required: true, message: '必填', trigger: 'blur, change' }],
});

const saveHospital = async (formEl: FormInstance | undefined) => {
  try {
    if (!formEl) return;
    await formEl.validate();
    const data = removeInvalid(ruleForm);
    await hospital.save(data);
  } catch (e) {
    console.log(e);
  }
};

// 路由跳转到科室管理
const router = useRouter();
const toDept = () => {
  router.push({
    name: 'Dept',
  });
};
</script>
<style lang="scss">
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
  }
}
</style>
