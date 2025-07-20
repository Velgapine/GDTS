<template>
  <header>
    <div class="title">设备管理</div>
    <div class="sub-title">
      <span>设备管理</span>
      <el-icon><ArrowRight /></el-icon>
      <span>内镜管理</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </header>
  <div class="container">
    <div class="title-box">
      <div class="title">内镜管理</div>
      <div class="btn-group">
        <my-btn style="color: #fff" :color="`#409eff`" @click="toRecord">洗消记录</my-btn>
        <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="add">添加内镜</my-btn>
      </div>
    </div>
    <el-row :gutter="20" align="middle" style="margin: 10px 0">
      <el-col :span="4">
        <el-select v-model="listQuery.isDel" placeholder="请选择使用状态" clearable @change="handleIsDelChange">
          <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="listQuery.state" placeholder="请选择维修状态" clearable @change="handleStateChange">
          <el-option v-for="item in fixOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="listQuery.deptId" placeholder="请选择科室" clearable @change="getList">
          <el-option v-for="item in deptOptions" :key="item.id" :label="item.deptName" :value="item.id" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="listQuery.chamberId" placeholder="请选择洗消室" clearable @change="getList">
          <el-option v-for="item in chamOptions" :key="item.id" :label="item.chamberName" :value="item.id" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="listQuery.scopeTypeId" placeholder="请选择内镜类型" clearable @change="getList">
          <el-option v-for="item in typeList" :key="item.id" :label="item.typeName" :value="item.id" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="listQuery.scopeBrandId" placeholder="请选择品牌类型" clearable @change="getList">
          <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id" />
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20" align="middle" style="margin: 10px 0">
      <el-col :span="4">
        <el-input v-model="listQuery.scopeName" placeholder="请输入内镜名称" clearable @clear="getList" />
      </el-col>
      <el-col :span="4">
        <el-input v-model="listQuery.scopeNum" placeholder="请输入内镜卡号" clearable @clear="getList" />
      </el-col>
      <el-col :span="4">
        <el-input v-model="listQuery.createAt" placeholder="请输入创建日期" clearable @clear="getList" />
      </el-col>
      <el-col :span="4">
        <el-input v-model="listQuery.updateAt" placeholder="请输入更新日期" clearable @clear="getList" />
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="getList"> 查询 </el-button>
        <el-button @click="reset"> 重置 </el-button>
      </el-col>
    </el-row>
    <div class="content-box">
      <!-- 内镜展示区 -->
      <el-table v-loading="tableLoad" :data="scopeList.data" style="width: 100%">
        <el-table-column prop="scopeName" label="名称" />
        <el-table-column label="使用状态">
          <template #default="{ row }">
            <span v-if="row.isDel == 0 && row.scopeNum" style="color: #409eff">正常</span>
            <span v-else-if="row.isDel == 0 && !row.scopeNum" style="color: red"> 正常(未绑定)</span>
            <span v-else style="color: #ff3333">弃用</span>
          </template>
        </el-table-column>
        <el-table-column label="维修状态">
          <template #default="{ row }">
            <span v-if="row.state === 'OK'" style="color: #409eff">正常</span>
            <span v-else style="color: #ff3333">维修中</span>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="科室" />
        <el-table-column prop="chamberName" label="洗消室" />
        <el-table-column>
          <template #header>
            <el-button size="small" @click="typeDialog = true">内镜类型</el-button>
          </template>
          <template #default="{ row }">
            <span>{{ row.scopeType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bodyNumber" label="镜身号" />
        <el-table-column>
          <template #header>
            <el-button size="small" @click="brandDialog = true">品牌型号</el-button>
          </template>
          <template #default="{ row }">
            <span>{{ row.scopeBrand }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" />
        <el-table-column prop="updateAt" label="更新时间" />
        <el-table-column label="操作" width="180px">
          <template #default="{ row }">
            <div class="operate-btn">
              <span @click="toSingle(row)">查看</span>
              <span v-show="row.isDel === 0 && row.state === 'OK'" @click="modify(row)">编辑</span>
              <span v-show="row.isDel === 0 && row.state === 'OK'" @click="remove(row.id)">弃用</span>
              <span v-show="row.isDel === 0 && row.state === 'OK'" @click="toMainTain(row.id)">送修</span>
              <span v-show="row.isDel === 0 && row.state === 'OK' && row.scopeNum" @click="unbind(row.id)">解绑</span>
              <span v-show="row.isDel === 0 && row.state === 'MAINTAIN'" @click="showDialog(row.id)">恢复</span>
              <span v-show="username === 'Administrator'" class="del-btn" @click="del(row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <my-pagination :list-query="listQuery" :loading="tableLoad" :get-list="getList" :total="total"></my-pagination>
    </div>
  </div>

  <!-- 添加/修改内镜弹窗 -->
  <el-dialog
    v-model="scopeDialog"
    v-loading="dialogLoad"
    :title="isModify ? '修改内镜' : '添加内镜'"
    width="60%"
    @open="clear"
  >
    <div class="dialog-title">
      <div class="text">操作</div>
      <div>
        <span v-loading="cardLoad" class="card-num">获取的卡号：{{ cardNum }}</span>
        <my-btn :color="`#d9ecff`" class="btn" @click="ruleForm.scopeNum = cardNum">绑定</my-btn>
        <my-btn :color="`#fde2e2`" class="btn" @click="ruleForm.scopeNum = ''">解绑</my-btn>
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
          <el-form-item label="名称：" prop="scopeName">
            <el-input v-model="ruleForm.scopeName" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="卡号：" prop="scopeNum">
            <el-input v-model="ruleForm.scopeNum" placeholder="请点击绑卡自动填充" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="类型：" prop="scopeTypeId">
            <el-select v-model="ruleForm.scopeTypeId" placeholder="未选择" style="width: 350px">
              <el-option v-for="item in typeList" :key="item.id" :label="item.typeName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="镜身号：" prop="bodyNumber">
            <el-input v-model="ruleForm.bodyNumber" placeholder="请输入内容" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="科室：" prop="deptId">
            <el-select v-model="ruleForm.deptId" placeholder="未选择" style="width: 350px">
              <el-option v-for="item in deptOptions" :key="item.id" :label="item.deptName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="洗消室：" prop="chamberId">
            <el-select v-model="ruleForm.chamberId" placeholder="未选择" style="width: 350px">
              <el-option v-for="item in chamOptions" :key="item.id" :label="item.chamberName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="品牌型号:" prop="scopeBrandId">
            <el-select v-model="ruleForm.scopeBrandId" placeholder="未选择" style="width: 350px">
              <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id" />
            </el-select>
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
        <my-btn color="#fff" style="border: 1px solid #e4e7ed" @click="scopeDialog = false">取消</my-btn>
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

  <!-- 内镜类型弹窗 -->
  <el-dialog v-model="typeDialog" v-loading="typeDialogLoad" title="内镜类型管理" width="60%">
    <el-form
      ref="typeFormRef"
      :model="typeForm"
      label-position="left"
      label-width="80px"
      size="large"
      class="form"
      style="display: flex; justify-content: space-between"
    >
      <el-form-item label="名称：" prop="typeName">
        <el-input v-model="typeForm.typeName" placeholder="请输入内容" style="width: 350px" />
      </el-form-item>
      <div>
        <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="updateType()"
          >添加</my-btn
        >
        <my-btn color="#fff" style="border: 1px solid #e4e7ed" @click="typeDialog = false">关闭</my-btn>
      </div>
    </el-form>
    <div class="content-box">
      <!-- 内镜类型展示区 -->
      <el-table v-loading="tableLoad" :data="typeList">
        <el-table-column label="名称" prop="typeName"></el-table-column>
        <el-table-column label="创建时间" prop="createAt" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <div class="operate-btn">
              <span @click="removeType(row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>

  <!-- 品牌类型弹窗 -->
  <el-dialog v-model="brandDialog" v-loading="brandDialogLoad" title="品牌类型管理" width="60%">
    <el-form
      ref="brandFormRef"
      :model="brandForm"
      label-position="left"
      label-width="60px"
      size="large"
      class="form"
      style="display: flex; justify-content: space-between"
    >
      <el-form-item label="名称：" prop="brandName">
        <el-input v-model="brandForm.brandName" placeholder="请输入内容" style="width: 250px" />
      </el-form-item>
      <el-form-item label="备注：" prop="brandName">
        <el-input v-model="brandForm.comment" placeholder="请输入内容" style="width: 250px" />
      </el-form-item>
      <div>
        <my-btn color="linear-gradient(180deg, #38F9D6 0%, #3EF0A4 59.17%, #6DEE99 100%)" @click="saveBrand()"
          >添加</my-btn
        >
        <my-btn color="#fff" style="border: 1px solid #e4e7ed" @click="brandDialog = false">关闭</my-btn>
      </div>
    </el-form>
    <div class="content-box">
      <!-- 品牌类型展示区 -->
      <el-table v-loading="tableLoad" :data="brandList">
        <el-table-column label="名称">
          <template #default="{ row }">
            <el-input v-model="row.brandName"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="comment"></el-table-column>
        <el-table-column label="创建时间" prop="createAt" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <div class="operate-btn">
              <span @click="updateBrand(row)">修改</span>
              <span @click="removeBrand(row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowRight, ChatLineSquare } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import card from '@/web/api/card';
import mirror from '@/web/api/mirror';
import scopeType from '@/web/api/type';
import scopeBrand from '@/web/api/brand';
import maintain from '@/web/api/maintain';
import removeInvalid from '@/utils/removeInvalid';
import initForm from '@/utils/initForm';
import confirm from '@/utils/confirm';
import getDept from '@/hooks/getDept';
import getCham from '@/hooks/getCham';
import { create } from 'domain';

const { username } = useStore().state;

// 是否加载中
const tableLoad = ref(false);
const dialogLoad = ref(false);

// 添加/修改内镜
const scopeDialog = ref(false);
const isModify = ref(false); // 默认为添加

const ruleForm = reactive({
  scopeName: '', // 名称
  scopeTypeId: '', // 类型
  scopeNum: '', // 卡号
  bodyNumber: '', // 镜身号
  scopeBrandId: '', // 品牌型号型号
  chamberId: '', // 洗消室id
  deptId: '', // 科室id
  comment: '', // 职位
});
const ruleFormRef = ref<FormInstance>();
//此处修改镜子卡号可以为空
const rules = reactive<FormRules>({
  scopeName: [{ required: true, message: '必填', trigger: 'blur, change' }],
  scopeTypeId: [{ required: true, message: '必填', trigger: 'blur, change' }],
  scopeNum: [{ message: '必填', trigger: 'blur, change' }],
});

// 点击添加
const add = () => {
  // 如果上一次操作是修改则清空表单
  if (isModify.value) initForm(ruleForm);
  isModify.value = false;
  scopeDialog.value = true;
};

// 修改时给表单进行赋值
const modify = (row: any) => {
  Object.assign(ruleForm, row);
  // 每次点击编辑时触发
  isModify.value = true;
  scopeDialog.value = true;
};

const update = async (formEl: FormInstance | undefined) => {
  dialogLoad.value = true;
  try {
    if (!formEl) return;
    await formEl.validate();
    const data = removeInvalid(ruleForm);
    isModify.value ? await mirror.update(data) : await mirror.save(data);
    // 每次成功添加/修改后改回默认值
    isModify.value = false;
    // 更新表单
    await getList();
    scopeDialog.value = false;
    // 将表单所有值赋值为空值
    initForm(ruleForm);
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

// 弃用
const remove = async (id: string) => {
  dialogLoad.value = true;
  try {
    await confirm('您确定要弃用吗？');
    const res = await mirror.remove(id);
    if (res.data.code === 5000 && res.data.msg === '磁卡未解绑') {
      ElMessage.error('请先解绑磁卡！');
      return;
    }
    getList();
  } catch (e) {
    console.log(e);
  }
  dialogLoad.value = false;
};

//解绑卡号
const unbind = async (id: string) => {
  dialogLoad.value = true;
  try {
    await confirm('您确定要解绑吗？');
    const res = await mirror.unbind(id);
    ElMessage.success('解绑成功!');

    await getList();
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
    await mirror.del(id);
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

// let timer = setInterval(() => {
//   getCard();
// }, 2000);

/**
 * @author Double-c-c
 * @date 2025-07-16
 * 此处重写了timer逻辑,修复了 没有打开新增窗口就不停进行卡号查询 的bug
 * 将timer断言为number类型,更好进行null赋值和处理.
 * 将源代码注释.如需要回退,使用旧的timer逻辑即可.
 */
let timer: number | null = null;

watch(scopeDialog, (val) => {
  if (val) {
    getCard();
    timer = setInterval(getCard, 2000) as unknown as number;
    //每次打开,清空刷卡区
    cardNum.value = '';
  } else {
    if (timer) clearInterval(timer);
    timer = null;
    cardNum.value = '';
    clear();
  }
});

onMounted(async () => {
  deptOptions.value = await getDept();
  chamOptions.value = await getCham();
  //getCard();
  await getTypeList();
  await getBrandList();
  getList();
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

// 获取内镜列表
const listQuery = reactive({
  scopeName: '',
  isDel: 0, // 0-正常 1-弃用
  deptId: '',
  chamberId: '',
  scopeTypeId: '',
  scopeNum: '',
  createAt: '',
  updateAt: '',
  scopeBrandId: '',
  state: 0, // 0-正常 1-维修
  currentPage: 1,
  size: 15,
});

const total = ref(0);

const scopeList = reactive<any>({
  data: [],
});

const getList = async () => {
  tableLoad.value = true;
  try {
    const { data } = await mirror.getList(removeInvalid(listQuery));
    if (data.page) scopeList.data = data.page.records;
    else scopeList.data = [];
    total.value = data?.page?.total;
  } catch (e) {
    console.log(e);
  }
  tableLoad.value = false;
};

// 重置listQuery并刷新
const reset = () => {
  initForm(listQuery);
  listQuery.isDel = 0;
  listQuery.state = 0;
  listQuery.currentPage = 1;
  listQuery.size = 15;
  getList();
};

// 使用状态选项
const stateOptions = [
  { label: '正常', value: 0 },
  { label: '弃用', value: 1 },
];

// 维修状态选项
const fixOptions = [
  { label: '正常', value: 0 },
  { label: '维修中', value: 1 },
];

// 新增使用状态变更处理函数
const handleIsDelChange = () => {
  // 状态变更时重置页码为1
  listQuery.currentPage = 1;
  // 重新查询数据
  getList();
};
// 新增维修状态变更处理函数
const handleStateChange = () => {
  // 状态变更时重置页码为1
  listQuery.currentPage = 1;
  // 重新查询数据
  getList();
};

// 科室和洗消室选项
const deptOptions = ref<any[]>();
const chamOptions = ref<any[]>();

// toSingle
const router = useRouter();
const toSingle = (row: any) => {
  router.push({
    name: 'MirrorSingle',
    query: {
      id: row.id,
      name: row.scopeName,
      t: Date.now(),
    },
  });
};

// toRecord
const toRecord = () => {
  router.push({
    name: 'MirrorRecord',
    query: {
      t: Date.now(),
    },
  });
};

/**
 * 内镜类型相关
 */
const typeDialog = ref(false); // 控制内镜类型弹窗显示
const typeDialogLoad = ref(false);

const typeForm = reactive({
  typeName: '', // 内镜类型名
});

const updateType = async () => {
  typeDialogLoad.value = true;
  try {
    if (!typeForm.typeName) {
      ElMessage.warning('请输入内镜类型');
      throw '空哦';
    }
    const data = removeInvalid(typeForm);
    await scopeType.save(data);
    // 更新表单
    await getTypeList();
    // 将表单所有值赋值为空值
    typeForm.typeName = '';
  } catch (e) {
    console.log(e);
  }
  typeDialogLoad.value = false;
};

// 删除
const removeType = async (id: string) => {
  typeDialogLoad.value = true;
  try {
    await confirm('您确定要删除吗？');
    await scopeType.remove(id);
    getTypeList();
  } catch (e) {
    console.log(e);
  }
  typeDialogLoad.value = false;
};

// 内镜列表
const typeList = ref<any[]>();

const getTypeList = async () => {
  tableLoad.value = true;
  try {
    const { data } = await scopeType.getList();
    typeList.value = data;
  } catch (e) {
    console.log(e);
  }
  tableLoad.value = false;
};

/**
 * 品牌类型相关
 */
const brandDialog = ref(false); // 控制内镜类型弹窗显示
const brandDialogLoad = ref(false);

const brandForm = reactive({
  brandName: '', // 内镜类型名
  comment: '', // 备注
});

// 添加
const saveBrand = async () => {
  brandDialogLoad.value = true;
  try {
    if (!brandForm.brandName) {
      ElMessage.warning('请输入品牌类型');
      throw '空哦';
    }
    const data = removeInvalid(brandForm);
    await scopeBrand.save(data);
    // 更新表单
    await getBrandList();
    // 将表单所有值赋值为空值
    brandForm.brandName = '';
    brandForm.comment = '';
  } catch (e) {
    console.log(e);
  }
  brandDialogLoad.value = false;
};

// 修改
const updateBrand = async (row: any) => {
  brandDialogLoad.value = true;
  try {
    if (!brandForm.brandName) {
      ElMessage.warning('请输入品牌类型');
      throw '空哦';
    }
    await confirm('您确定要修改吗？');
    const data = removeInvalid(row);
    await scopeBrand.update(data);
    // 更新表单
    await getBrandList();
  } catch (e) {
    console.log(e);
  }
  brandDialogLoad.value = false;
};

// 删除
const removeBrand = async (id: number) => {
  brandDialogLoad.value = true;
  try {
    await confirm('您确定要删除吗？');
    await scopeBrand.remove(id);
    getBrandList();
  } catch (e) {
    console.log(e);
  }
  brandDialogLoad.value = false;
};

// 内镜列表
const brandList = ref<any[]>();

const getBrandList = async () => {
  tableLoad.value = true;
  try {
    const { data } = await scopeBrand.getList();
    brandList.value = data;
  } catch (e) {
    console.log(e);
  }
  tableLoad.value = false;
};

/**
 * 送修相关
 */
const mtDialog = ref(false);
const mtDialogLoad = ref(false);

const scopeId = ref<number>(); // 镜子id
const comment = ref(''); // 送修原因
const endTime = ref(''); // 结束时间

// 送修录入
const toMainTain = async (id: number) => {
  try {
    await confirm('您确定要送修吗？');
    await maintain.save({ scopeId: id });
    getList();
  } catch (e) {
    console.log(e);
  }
};

const showDialog = (id: number) => {
  mtDialog.value = true;
  scopeId.value = id;
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
      scopeId: scopeId.value,
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

.second-row {
  display: flex;
  margin-top: 10px;
  .el-input {
    margin-right: 10px;
    width: 200px;
  }
  .el-select {
    margin-right: 10px;
    width: 200px;
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
  .del-btn {
    color: red;
  }
}
</style>
