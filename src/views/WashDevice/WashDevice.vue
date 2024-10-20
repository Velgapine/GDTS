<template>
  <header>
    <div class="title">设备管理</div>
    <div class="sub-title">
      <span>设备管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>洗消设备管理</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </header>
  <div class="container">
    <div class="title-box">
      <div class="title">洗消设备管理</div>
      <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="add">添加设备</my-btn>
    </div>
    <div class="content-box">
      <!-- 设备展示区 -->
      <el-table v-loading="tableLoad" :data="typeList.data" style="width: 100%">
        <el-table-column label="名称" prop="deviceName"></el-table-column>
        <el-table-column label="使用状态">
          <template #default="{ row }">
            <span v-if="row.isDel === 0" style="color: #409eff">正常</span>
            <span v-else style="color: #ff3333">弃用</span>
          </template>
        </el-table-column>
        <el-table-column label="维修状态">
          <template #default="{ row }">
            <span v-if="row.state === 'OK'" style="color: #409eff">正常</span>
            <span v-else style="color: #ff3333">维修中</span>
          </template>
        </el-table-column>
        <el-table-column label="组号" prop="groupId"></el-table-column>
        <el-table-column label="机号" prop="machineNum"></el-table-column>
        <el-table-column label="流程顺序" prop="serial" />
        <!-- <el-table-column label="流程顺序">
          <template #default="{ row }">
            <span v-if="stepList[row.serial]">{{
              stepList[row.serial].name
            }}</span>
            <span v-else>未确认</span>
          </template>
        </el-table-column> -->
        <el-table-column label="最小洗消时间(单位：秒)" prop="minTime"></el-table-column>
        <el-table-column label="最大洗消时间(单位：秒)" prop="maxTime"></el-table-column>
        <el-table-column label="设备类型" prop="typeName" />
        <el-table-column label="对应读卡器IP" prop="deviceIpv4" />
        <el-table-column prop="createAt" label="创建时间" />
        <el-table-column prop="updateAt" label="更新时间" />
        <el-table-column label="操作" width="150px">
          <template #default="{ row }">
            <div class="operate-btn">
              <span v-show="row.isDel === 0 && row.state === 'OK'" @click="modify(row)">编辑</span>
              <span v-show="row.isDel === 0 && row.state === 'OK'" @click="remove(row.id)">弃用</span>
              <span v-show="row.isDel === 0 && row.state === 'OK'" @click="toMainTain(row.id)">送修</span>
              <span v-show="row.isDel === 0 && row.state === 'MAINTAIN'" @click="showDialog(row.id)">恢复</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 添加/修改设备弹窗 -->
  <el-dialog v-model="typeDialog" v-loading="dialogLoad" :title="isModify ? '修改设备' : '添加设备'" width="60%">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      label-width="110px"
      size="large"
      class="form"
    >
      <el-row justify="space-between">
        <el-col :span="12">
          <el-form-item label="名称：" prop="deviceName">
            <el-input v-model="ruleForm.deviceName" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机号：" prop="machineNum">
            <el-input v-model.number="ruleForm.machineNum" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12">
          <el-form-item label="设备类型：" prop="typeId">
            <el-select v-model="ruleForm.typeId" placeholder="未选择" style="width: 350px">
              <el-option v-for="item in typeOptions" :key="item.id" :label="item.typeName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备IP：" prop="deviceIpv4">
            <el-input v-model="ruleForm.deviceIpv4" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12">
          <el-form-item label="组号：" prop="groupId">
            <el-select v-model="ruleForm.groupId" placeholder="未选择" style="width: 350px">
              <el-option v-for="item in groupOptions" :key="item.id" :label="item.groupId" :value="item.groupId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程顺序：" prop="serial">
            <el-input v-model.number="ruleForm.serial" placeholder="请输入整数" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12">
          <el-form-item label="最小洗消时间:" prop="minTime">
            <el-input v-model.number="ruleForm.minTime" placeholder="请输入时间(单位：秒)" style="width: 350px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最大洗消时间:" prop="maxTime">
            <el-input v-model.number="ruleForm.maxTime" placeholder="请输入时间(单位：秒)" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12">
          <el-form-item label="品牌：" prop="deviceBrand">
            <el-input v-model="ruleForm.deviceBrand" placeholder="请输入内容" style="width: 350px" />
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

  <!-- 送修完成弹窗 -->
  <el-dialog v-model="mtDialog" v-loading="mtDialogLoad" title="送修完成" width="15%" class="mt-dialog">
    <el-input v-model="comment" placeholder="请输入送修原因" :prefix-icon="ChatLineSquare" style="width: 214px" />
    <div style="height: 10px"></div>
    <el-date-picker v-model="endTime" type="datetime" placeholder="请输入结束时间" value-format="YYYY-MM-DD HH:mm:ss" />
    <div style="height: 10px"></div>
    <el-row justify="center">
      <el-button type="primary" @click="cptMainTain">确定</el-button>
      <el-button @click="mtDialog = false">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowRight, ChatLineSquare } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import device from '@/web/api/washDevice';
import maintain from '@/web/api/maintain';
import removeInvalid from '@/utils/removeInvalid';
import initForm from '@/utils/initForm';
import getType from '@/hooks/getType';
import getGroup from '@/hooks/getGroup';
import confirm from '@/utils/confirm';

// 是否加载中
const tableLoad = ref(false);
const dialogLoad = ref(false);

// 添加/修改设备
const typeDialog = ref(false);
const isModify = ref(false); // 默认为添加

const ruleForm = reactive({
  id: '', // 唯一id
  deviceName: '', // 设备名
  typeId: '', // 设备类型id
  groupId: undefined, // 组号
  machineNum: undefined, // 机号
  deviceIpv4: '', // 设备IP

  serial: '', // 流程顺序号码

  deviceBrand: '', // 设备品牌
  deviceModel: '', // 型号
  minTime: '', // 流程所需最小时间
  maxTime: '', // 流程所需最大时间
  state: '', // 维修状态
  comment: '', // 备注
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  typeId: [{ required: true, message: '必填', trigger: 'blur, change' }],
  groupId: [{ required: true, message: '必填', trigger: 'blur, change' }],
  deviceName: [{ required: true, message: '必填', trigger: 'blur, change' }],
  machineNum: [{ required: true, message: '必填', trigger: 'blur, change' }],
  deviceIpv4: [{ required: true, message: '必填', trigger: 'blur, change' }],
  serial: [{ required: true, message: '必填', trigger: 'blur, change' }],
  minTime: [{ required: true, message: '必填', trigger: 'blur, change' }],
  maxTime: [{ required: true, message: '必填', trigger: 'blur, change' }],
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
    isModify.value ? await device.update(data) : await device.save(data);
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
    await confirm('您确定要弃用吗？');
    await device.remove(id);
    getList();
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

onMounted(async () => {
  typeOptions.value = await getType();
  groupOptions.value = await getGroup();
  getList();
});

// 获取设备列表
const typeList = reactive({
  data: [],
});

const getList = async () => {
  tableLoad.value = true;
  try {
    const { data } = await device.getList();
    typeList.data = data;
  } catch (e) {
    console.log(e);
  }
  tableLoad.value = false;
};

// 设备类型选项
const typeOptions = ref<any[]>();
// 组号选项
const groupOptions = ref<any[]>();

/**
 * 送修相关
 */
const mtDialog = ref(false);
const mtDialogLoad = ref(false);

const deviceId = ref<number>(); // 镜子id
const comment = ref(''); // 送修原因
const endTime = ref(''); // 结束时间

// 送修录入
const toMainTain = async (id: number) => {
  try {
    await confirm('您确定要送修吗？');
    await maintain.save({ deviceId: id });
    getList();
  } catch (e) {
    console.log(e);
  }
};

const showDialog = (id: number) => {
  mtDialog.value = true;
  deviceId.value = id;
};

// 送修完成
const cptMainTain = async () => {
  mtDialogLoad.value = true;
  try {
    if (!comment.value) {
      ElMessage.warning('请输入送修原因');
      throw '空哦';
    }
    if (!endTime.value) {
      ElMessage.warning('请输入结束时间');
      throw '空哦';
    }
    const data = {
      deviceId: deviceId.value,
      comment: comment.value,
      endTime: endTime.value,
    };
    await maintain.update(data);
    // 置空
    comment.value = '';
    endTime.value = '';
    mtDialog.value = false;
    getList();
  } catch (e) {
    console.log(e);
  }
  mtDialogLoad.value = false;
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
