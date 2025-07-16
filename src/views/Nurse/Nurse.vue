<template>
  <header>
    <div class="title">医院管理</div>
    <div class="sub-title">
      <span>医院管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>护士管理</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </header>
  <div class="container">
    <div class="title-box">
      <div class="title">
        <span>护士管理</span>
        <el-select v-model="state" class="title-select" @change="getList">
          <el-option label="在职" :value="0" />
          <el-option label="离职" :value="1" />
        </el-select>
      </div>
      <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="add">添加护士</my-btn>
    </div>
    <div class="content-box">
      <!-- 护士展示区 -->
      <el-table v-loading="tableLoad" :data="staffList" style="width: 100%">
        <el-table-column label="姓名" prop="staffName"></el-table-column>
        <el-table-column prop="staffJobNum" label="卡号" />
        <el-table-column prop="staffNum" label="工号" />
        <el-table-column prop="staffGender" label="性别" />
        <el-table-column prop="staffPhone" label="电话" />
        <el-table-column prop="deptName" label="科室" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <div class="operate-btn">
              <span v-show="row.isDel === 0">
                <span @click="modify(row)">编辑</span>
                <span @click="remove(row.id)">解雇</span>
              </span>
              <span v-show="username === 'Administrator'" class="del-btn" @click="del(row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 添加/修改护士弹窗 -->
  <el-dialog v-model="staffDialog" v-loading="dialogLoad" title="添加护士" width="60%" @open="clear">
    <div class="dialog-title">
      <div class="text">操作</div>
      <div>
        <span v-loading="cardLoad" class="card-num">获取的卡号：{{ cardNum }}</span>
        <my-btn :color="`#d9ecff`" class="btn" @click="ruleForm.staffJobNum = cardNum">绑定</my-btn>
        <my-btn :color="`#fde2e2`" class="btn" @click="ruleForm.staffJobNum = ''">解绑</my-btn>
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
          <el-form-item label="姓名：" prop="staffName">
            <el-input v-model="ruleForm.staffName" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="卡号：" prop="staffJobNum">
            <el-input v-model="ruleForm.staffJobNum" placeholder="请点击绑卡自动填充" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12">
          <el-form-item label="性别：" prop="staffGender">
            <el-select v-model="ruleForm.staffGender" placeholder="未选择" style="width: 350px">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话：" prop="staffPhone">
            <el-input v-model="ruleForm.staffPhone" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12">
          <el-form-item label="科室：" prop="deptId">
            <el-select v-model="ruleForm.deptId" placeholder="未选择" style="width: 350px">
              <el-option v-for="item in deptOptions" :key="item.id" :label="item.deptName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工号：" prop="staffNum">
            <el-input v-model="ruleForm.staffNum" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-between">
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
        <my-btn color="#fff" style="border: 1px solid #e4e7ed" @click="staffDialog = false">取消</my-btn>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import nurse from '@/web/api/nurse';
import card from '@/web/api/card';
import removeInvalid from '@/utils/removeInvalid';
import initForm from '@/utils/initForm';
import getDept from '@/hooks/getDept';
import confirm from '@/utils/confirm';

const { username } = useStore().state;

// 是否加载中
const tableLoad = ref(false);
const dialogLoad = ref(false);

const state = ref(0); // 0-在职 1-离职

// 添加/修改护士
const staffDialog = ref(false);
const isModify = ref(false); // 默认为添加

const ruleForm = reactive({
  id: '', // 唯一id
  staffName: '', // 员工名
  staffJobNum: '', // 卡号
  staffGender: '', // 性别
  staffPhone: '', // 电话
  deptId: '', // 所属科室id
  staffNum: '', // 工号
  comment: '', // 备注
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  staffName: [{ required: true, message: '必填', trigger: 'blur, change' }],
});

// 点击添加
const add = () => {
  // 如果上一次操作是修改则清空表单
  if (isModify.value) initForm(ruleForm);
  isModify.value = false;
  staffDialog.value = true;
  //getCard();
};

// 修改时给表单进行赋值
const modify = (row: any) => {
  Object.assign(ruleForm, row);
  isModify.value = true;
  staffDialog.value = true;
  getCard();
};

const update = async (formEl: FormInstance | undefined) => {
  dialogLoad.value = true;
  try {
    if (!formEl) return;
    await formEl.validate();
    const data = removeInvalid(ruleForm);
    isModify.value ? await nurse.update(data) : await nurse.save(data);
    // 更新表单
    await getList();
    isModify.value = false;
    staffDialog.value = false;
    // 将表单所有值赋值为空值
    initForm(ruleForm);
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

// 解雇
const remove = async (id: string) => {
  dialogLoad.value = true;
  try {
    await confirm('您确定要解雇吗？');
    await nurse.remove(id);
    getList();
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

// 彻底删除
const del = async (id: string) => {
  dialogLoad.value = true;
  try {
    await confirm('您确定要从数据库中彻底删除该数据吗？');
    await nurse.del(id);
    getList();
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

// 获取卡号
const cardLoad = ref(false);
const cardNum = ref('');

const getCard = async () => {
  cardLoad.value = true;
  try {
    const { data } = await card.get({});
    cardNum.value = data[0].cardNum ? data[0].cardNum : '';
  } catch (e) {
    console.log(e);
  }
  cardLoad.value = false;
};

//意义不明的注释掉getcard方法哈,导致了bug,我修了.
// let timer = setInterval(() => {
//   // getCard();
// }, 2000);
let timer: number | null = null;

//当打开新增窗口,才进行卡号查询
//当关闭表单窗口,清空暂存区数据
watch(staffDialog, (val) => {
  if (val) {
    //getCard()
    timer = setInterval(getCard, 2000) as unknown as number;
    //每次打开,清空刷卡区
    cardNum.value = '';
  } else {
    if (timer) clearInterval(timer);
    timer = null;
    clear();
    cardNum.value = '';
  }
});

onMounted(async () => {
  deptOptions.value = await getDept();
  getList();
  // getCard();
});

// 清除暂存区数据
const clear = async () => {
  try {
    await card.clear();
  } catch (e) {
    console.log(e);
  }
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
  clear();
});

// 获取护士列表
const staffList = ref<any[]>([]);

const getList = async () => {
  tableLoad.value = true;
  try {
    const { data } = await nurse.getList();
    staffList.value = data.filter((obj: { isDel: number }) => obj.isDel === state.value);
  } catch (e) {
    console.log(e);
  }
  tableLoad.value = false;
};

// 科室选项
const deptOptions = ref<any[]>();
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
      .title-select {
        margin-left: 10px;
        width: 100px;
      }
    }
  }
  .content-box {
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
  .del-btn {
    color: red;
  }
}
</style>
