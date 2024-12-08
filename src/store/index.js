import { createStore } from "vuex";

export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: false,
    showConfig: false,

    sidebarType: "bg-white",
    darkMode: false,
    isNavFixed: false,

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
    navbarFixed(state) {
      state.isNavFixed = state.isNavFixed === false;
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
      commit('setSignIn', false);
      commit('setAdmin', false);
    },
  },
  getters: {
    isSignIn: (state) => state.isSignIn,
    isAdmin: (state) => state.isAdmin,
  },
});
