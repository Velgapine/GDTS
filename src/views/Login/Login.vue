<template>
  <el-row class="header">
    <div class="logo-box">
      <img src="@/assets/img/logo.jpg" />
    </div>
  </el-row>
  <section class="section">
    <h1 class="title1 ban">欢迎使用</h1>
    <h1 class="title2 ban">内镜清洗消毒系统</h1>
    <div v-loading="loading" class="login-register-box">
      <div class="top">
        <button :class="{ activeBtn1: !isLogin }" @click="isLogin = false">注册</button>
        <button :class="{ activeBtn1: isLogin }" @click="isLogin = true">登录</button>
      </div>
      <div class="main">
        <el-form label-position="left" label-width="80px" @submit.prevent>
          <el-form-item label="账号">
            <el-input v-model.trim="form.userName" placeholder="请输入账号" size="large"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" placeholder="请输入密码" type="password" size="large"></el-input>
          </el-form-item>
          <el-form-item label="身份">
            <button
              class="choose-btn"
              :class="{ activeBtn2: isManager && !isVisitor }"
              style="width: 84px"
              @click="
                isManager = true;
                isVisitor = false;
              "
            >
              管理员
            </button>
            <button
              class="choose-btn"
              :class="{ activeBtn2: !isManager && !isVisitor }"
              @click="
                isManager = false;
                isVisitor = false;
              "
            >
              员工
            </button>
            <button v-show="isLogin" class="choose-btn" :class="{ activeBtn2: isVisitor && !isManager }" @click="visit">
              访客
            </button>
          </el-form-item>
          <button class="comfirm-btn" @click="isLogin ? login() : register()">确认</button>
          <div class="software">月明管理系统</div>
        </el-form>
      </div>
      <img src="@/assets/img/doctor_left.png" class="left-img" />
      <img src="@/assets/img/doctor_right.png" class="right-img" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import user from '@/web/api/user';
import CryptoJS from 'crypto-js';
import speak from '@/utils/speak';

// 登录、注册、注销
const router = useRouter();
const store = useStore();
const isLogin = ref(true); // 登录 or 注册
const isManager = ref(true); // 管理员 or 员工/医生
const isVisitor = ref(false);
const loading = ref(false); // 登录框加载
// 表单
let form = reactive({
  userName: '',
  password: '',
  roleId: computed(() => {
    if (isManager.value) return 2;
    else return 3;
  }),
});
// 注册
async function register() {
  loading.value = true;
  try {
    let { userName, password, roleId } = form;
    password = CryptoJS.MD5(password).toString().toUpperCase(); // MD5加密
    const data = { userName, password, roleId };
    const res = (await user.register(data)) as any;
    if (res.code === 4000) {
      // 初始化表单
      isLogin.value = true;
      isManager.value = true;
      form.userName = '';
      form.password = '';
    }
  } catch (e) {
    console.log(e);
  }
  loading.value = false;
}
// 登录
async function login() {
  loading.value = true;
  try {
    let { userName, password, roleId } = form;
    if (isVisitor.value) {
      userName = 'visitor';
      password = '110';
      roleId = 3;
    }
    //此处删除了密码的md5加密，因为后台已经加密了，所以这里不需要加密
    //补上MD5加密,下次前后端开发商量好求你们
    password = CryptoJS.MD5(password).toString().toUpperCase();
    const data = { userName, password, roleId };
    const res = (await user.login(data)) as any;
    console.log(res);
    if (res.code === 4000) {
      store.commit('SET_USERNAME', userName);
      store.commit('SET_TOKEN', res.data);
      if (!isVisitor.value) {
        // 语音播报
        speak(`欢迎用户${userName}登录系统`);
        router.replace({
          path: '/home',
        });
      } else {
        router.replace({
          path: '/home/monitor',
        });
      }
    } else {
      form.userName = '';
      form.password = '';
    }
  } catch (e) {
    console.log(e);
    ElMessage.warning('服务器未响应，正在重新加载...');
    // 10s后重新登录
    setTimeout(() => {
      login();
    }, 10000);
  }
  loading.value = false;
}
// 访客登录提示
const visit = () => {
  isManager.value = false;
  isVisitor.value = true;
  ElMessage.success('访客无需注册，请点击【确认】直接登录');
};
onMounted(() => {
  const username = store.state.username;
  const token = store.state.token;
  const isFirst = store.state.isFirst;
  if (username === 'visitor') {
    // 访客登录
    router.replace({ name: 'Monitor' });
  } else if (token) {
    // 已登录
    router.replace({ name: 'Home' });
  } else if (isFirst === 'first') {
    // 初次进入系统
    speak('欢迎使用顺元消毒追溯管理系统');
    // 不再自动访客登录
    store.commit('SET_ISFIRST', 'not first');
  }
});
</script>

<style lang="scss" scoped>
// 禁止土文字选做东
.ban {
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  /* 鼠标消失 */
  /* cursor: none; */
  /* 鼠标样式改为图片 */
  /* cursor: url('./assets/pointt.png'), pointer; */
}
.header {
  position: relative;
  width: 100%;
  height: 60px;
  background: #ffffff;
  .logo-box {
    position: absolute;
    right: 0;
    img {
      width: 75px;
    }
  }
}
.section {
  position: relative;
  width: 100%;
  height: 100%;
  font-family: 'Noto Sans Symbols';
  font-style: normal;
  background-image: url(@/assets/img/background.png);
  background-size: cover;
  .title1 {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translate(-50%, 0);
    font-weight: 600;
    font-size: 96px;
    line-height: 96px;
    display: flex;
    align-items: center;
    font-feature-settings: 'tnum' on, 'lnum' on;
    color: #555050;
  }
  .title2 {
    position: absolute;
    top: 207 - 58px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 1024px;
    height: 96px;
    font-weight: 600;
    font-size: 128px;
    line-height: 96px;
    display: flex;
    align-items: center;
    font-feature-settings: 'tnum' on, 'lnum' on;
    color: rgba(0, 0, 0, 0.21);
  }
  .login-register-box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    top: 311px - 105;
    width: 642px - 82;
    height: 490px;
    z-index: 999;
    .top {
      width: 100%;
      button {
        border: none;
        width: 50%;
        height: 50px;
        background: #99f3cf;
        border-radius: 10px 10px 0px 0px;
        &:hover {
          cursor: pointer;
          background-color: #6dee99;
        }
      }
    }
    .main {
      position: relative;
      width: 70%;
      height: 320px;
      padding: 10% 15%;
      font-weight: 400;
      font-size: 20px;
      background: #f5f7fa;
      .el-form-item {
        margin-bottom: 40px;
      }
      .el-input {
        background: #ffffff;
        border-radius: 4px;
      }
      .choose-btn {
        display: flex;
        align-items: center;
        padding: 9px 20px;
        width: 70px;
        height: 40px;
        background: #ffffff;
        margin-right: 29px;
        border: 1px solid #e4e7ed;
        box-sizing: border-box;
        border-radius: 24px;
        z-index: 9999;
        &:hover {
          cursor: pointer;
          color: #fff;
          border: 1px solid #6dee99;
          background-color: #6dee99;
        }
      }
      .comfirm-btn {
        position: absolute;
        width: 240px;
        height: 43px;
        left: 50%;
        transform: translate(-50%, 0);
        background: #6dee99;
        border: none;
        border-radius: 20px;
        z-index: 9999;
        &:hover {
          cursor: pointer;
          background-color: #3ef0a4;
        }
      }
      .software {
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }
    .left-img {
      position: absolute;
      left: 0;
      bottom: 7px;
    }
    .right-img {
      position: absolute;
      right: 0;
      bottom: 7px;
    }
  }
}
// 激活后的样式
.activeBtn1 {
  background-color: #3ef0a4 !important;
}
.activeBtn2 {
  color: #67c23a !important;
  border: 1px solid #67c23a !important;
  background-color: #ecf5ff !important;
}
</style>
