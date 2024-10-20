import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

// 获取暂存的数据
const username = sessionStorage.getItem('username');
const token = sessionStorage.getItem('token');
const isFirst = sessionStorage.getItem('isFirst');
username && store.commit('SET_USERNAME', username);
token && store.commit('SET_TOKEN', token);
isFirst && store.commit('SET_ISFIRST', isFirst);

// 路由守卫
router.beforeEach((to, from, next) => {
  // 鉴权：没登陆则跳回登录界面
  if (to.meta.requireAuth && !store.state.token) {
    next({
      path: '/login',
    });
    // 修复路由回跳问题（意料之外的问题）
  } else if (to.name === 'Home' && from.name !== 'undefined' && from.name !== 'Login') {
    next({
      path: <string>from.path,
      query: { t: Date.now() },
    });
  } else {
    next();
  }
});

const app = createApp(App);
// 屏蔽错误信息
app.config.errorHandler = () => null;
// 屏蔽警告信息
app.config.warnHandler = () => null;
app.use(router);
app.use(store);
app.mount('#app');
