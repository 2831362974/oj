import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: false,
    showConfig: false,

    sidebarType: "bg-white",
    darkMode: false,

    isAbsolute: false,

    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,

    showAdminConfig:false,
    showProblemConfig:false,
    layout: "default",

    /*登录状态*/
    isSignIn:false,
    isAdmin:false,
    isRoot:false,
    username:'',
    token: localStorage.getItem('token') || '',
    /*数据存储以方便筛选/搜索功能*/
  },
  /*同步操作*/
  mutations: {
    toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    },

    sidebarMinimize(state) {
      let sidenav_show = document.querySelector("#app");
      if (state.isPinned) {
        sidenav_show.classList.add("g-sidenav-hidden");
        sidenav_show.classList.remove("g-sidenav-pinned");
        state.isPinned = false;
      } else {
        sidenav_show.classList.add("g-sidenav-pinned");
        sidenav_show.classList.remove("g-sidenav-hidden");
        state.isPinned = true;
      }
    },
    sidebarType(state, payload) {
      state.sidebarType = payload;
    },
    setIsSignIn(state, value) {
      state.isSignIn = value;
    },
    setIsAdmin(state, payload) {
      state.isAdmin = payload;
    },
    setIsRoot(state, payload) {
      state.isRoot = payload;
    },
    setUsername(state, payload) {
      state.username = payload;
    },
    clearLoginState(state) {
      state.isSignIn = false;
      state.isAdmin = false;
      state.isRoot = false;
      state.username='';
      state.token = '';
      localStorage.removeItem('token');
    },
  },
  /*异步操作*/
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit("sidebarType", payload);
    },
    login({ commit }, { isAdmin }) {
      commit('setSignIn', true);
      commit('setAdmin', isAdmin);
    },
    logout({ commit }) {
      commit('clearLoginState');
    },
  },
  plugins: [createPersistedState({
    storage: window.localStorage,  // 指定使用localStorage来存储数据
    paths: ['isSignIn', 'isAdmin','isRoot','username']  // 明确要持久化存储的state中的属性，根据实际需求添加更多
  })],
  getters: {
    isSignIn: (state) => state.isSignIn,
    isAdmin: (state) => state.isAdmin,
    isRoot: (state) => state.isRoot,
  },
});
