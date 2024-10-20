import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      username: '',
      token: '',
      isFirst: 'first',
      isSpeak: 'not speak',
    };
  },
  mutations: {
    SET_USERNAME(state, name: string) {
      state.username = name;
      sessionStorage.setItem('username', name);
    },
    SET_TOKEN(state, token: string) {
      state.token = token;
      sessionStorage.setItem('token', token);
    },
    SET_ISFIRST(state, str: string) {
      state.isFirst = str;
      sessionStorage.setItem('isFirst', str);
    },
    SET_ISSPEAK(state, str: string) {
      state.isSpeak = str;
      sessionStorage.setItem('isSpeak', str);
    },
  },
});

export default store;
