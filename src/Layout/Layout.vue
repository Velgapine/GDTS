<template>
  <el-header>
    <div class="logo-box">
      <img src="@/assets/img/logo.jpg" />
      <span class="product">内镜清洗消毒系统</span>
    </div>
    <div class="right-box">
      <span>
        <span class="text">语音播报</span>
        <el-switch v-model="isSpeak" class="switch" @click="changeSpeak" />
      </span>
      <span class="blue" @click="toMonitor">
        <el-icon class="house-icon"><Monitor /></el-icon>
        <span class="text">监控</span>
      </span>
      <span v-show="isVisitor" class="blue" @click="toConRecord">
        <el-icon class="house-icon"><Calendar /></el-icon>
        <span class="text">诊疗记录</span>
      </span>
      <span>
        <el-icon><User /></el-icon>
        <span class="text big-margin">{{ store.state.username }}</span>
      </span>
      <span class="red" @click="logout">
        <el-icon><SwitchButton /></el-icon>
        <span class="text">注销</span>
      </span>
    </div>
  </el-header>
  <el-container>
    <el-aside v-show="!isVisitor" width="240px">
      <div v-for="(item, index) in asideList" :key="index">
        <div class="nav-title">{{ item.name }}</div>
        <div v-for="(e, i) in item.children" :key="i">
          <router-link class="nav" :to="`/home/${e.name}?t=${Date.now()}`" replace>
            <span>{{ e.label }}</span>
          </router-link>
        </div>
      </div>
    </el-aside>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { Monitor, Calendar, User, SwitchButton } from '@element-plus/icons-vue';
import user from '@/web/api/user';
import confirm from '@/utils/confirm';

const router = useRouter();
// 基本布局页面挂载时跳转到首页
onMounted(() => {
  router.replace({
    name: 'Home',
  });
});

// 登出
const store = useStore();

// 默认关闭语音播报，可开启
const isSpeak = computed(() => store.state.isSpeak === 'speak');
const changeSpeak = () => {
  if (isSpeak.value) store.commit('SET_ISSPEAK', 'not speak');
  else store.commit('SET_ISSPEAK', 'speak');
};

// 判断是否为访客
const isVisitor = store.state.username === 'visitor';

const logout = async () => {
  try {
    await confirm('您确定要注销吗？');
    const { code } = (await user.logout()) as any;
    if (code === 4000) {
      // 注销时清空缓存
      store.commit('SET_USERNAME', '');
      store.commit('SET_TOKEN', '');
      sessionStorage.clear();
      router.replace({
        path: '/Login',
      });
    }
  } catch (e) {
    console.log(e);
  }
};

// 监控页面
const toMonitor = () => {
  router.push({
    name: 'Monitor',
    query: {
      t: Date.now(),
    },
  });
};

// 诊疗记录页面
const toConRecord = () => {
  router.push({
    name: 'ConRecord',
    query: {
      t: Date.now(),
    },
  });
};

// 侧边导航栏
const asideList = reactive([
  {
    name: '医院管理',
    children: [
      { label: '科室管理', name: 'dept' },
      { label: '用户管理', name: 'administrator' },
      { label: '护士管理', name: 'nurse' },
      { label: '洗消室管理', name: 'wash' },
    ],
  },
  {
    name: '设备管理',
    children: [
      { label: '内镜管理', name: 'mirror' },
      { label: '设备类型管理', name: 'category' },
      { label: '洗消流程管理', name: 'washProcess' },
      { label: '洗消设备管理', name: 'washDevice' },
      { label: '维修管理', name: 'maintain' },
    ],
  },
  {
    name: '诊疗管理',
    children: [
      { label: '诊疗室管理', name: 'consult' },
      { label: '诊疗记录管理', name: 'conRecord' },
    ],
  },
  // {
  //   name: '耗材管理',
  //   children: [{ label: '耗材管理', name: 'consumption' }],
  // },
]);
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  width: 100%;
  height: 60px;
  font-size: 20px;
  color: #606266;
  background: #ffffff;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.1);
  .logo-box {
    display: flex;
    align-items: center;
    img {
      margin-right: 10px;
      width: 65px;
    }
    .text {
      position: relative;
      top: -2.8px;
      margin: 0 5px;
      font-size: 16px;
    }
    .product {
      font-size: 26px;
      // color: #0100fa;
      color: #8b8c8f;
      letter-spacing: 15px;
    }
  }
  .right-box {
    .switch {
      position: relative;
      top: -3px;
      margin-right: 20px;
    }
    .text {
      position: relative;
      top: -2.8px;
      margin: 0 5px;
      font-size: 16px;
    }
    .big-margin {
      margin-right: 15px;
    }
    .red {
      &:hover {
        cursor: pointer;
        color: red;
      }
    }
    .blue {
      margin-right: 15px;
      &:hover {
        cursor: pointer;
        color: #409eff;
      }
    }
  }
}
.el-container {
  width: 100%;
  height: 100%;
  .el-aside {
    padding: 0.5% 0;
    height: 99%;
    background: #ffffff;
    .login-tip {
      color: #45dce7;
      &:hover {
        cursor: pointer;
        color: #409eff;
      }
      div {
        margin: 15px;
        font-size: 16px;
      }
    }
    .nav-title {
      margin-left: 20px;
      margin-bottom: 25px;
      font-size: 16px;
      color: #45dce7;
    }
    .nav {
      display: block;
      text-decoration: none;
      margin-left: 35px;
      margin-bottom: 35px;
      font-size: 14px;
      color: #303133;
      &:hover {
        cursor: pointer;
        color: #45dce7;
      }
    }
    .router-link-active,
    .router-link-active span {
      color: #409eff;
    }
  }
  .el-main {
    background: url(../assets/img/background.png);
    background-size: cover;
  }
  .router-link-active {
    color: #409eff;
  }
}
</style>
