<script setup>
import {onBeforeMount, onMounted, onBeforeUnmount, computed, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {getUserInfo} from '@/api/api.js';

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";

import ArgonInput from "@/components/ProfileView/ArgonInput.vue";
import ArgonButton from "@/components/ProfileView/ArgonButton.vue";
import ChangePasswd from "@/components/ProfileView/ChangePasswdModel.vue";

const router = useRouter();
const store = useStore();

//注意，computed返回一个对象！！！在js调用要加.value
const username = computed(() => store.state.username);

const body = document.getElementsByTagName("body")[0];
onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
  if (username.value) {
    fetchUserInfo(); // 登录了才调用获取后端数据
  }
});
onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = false;
  store.state.hideConfigButton = true;
  body.classList.add("profile-overview");
});
onBeforeUnmount(() => {
  store.state.isAbsolute = false;
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.hideConfigButton = false;
  body.classList.remove("profile-overview");
});

// 用于存储用户信息的响应式数据
const userInfo = ref({
  username: '',
  securityQuestion: ''
});

// 新增用于控制加载提示显示的响应式数据
const Loading = ref(false);
// 从后端获取用户信息的函数，更新加载状态
const fetchUserInfo = async () => {
  try {
    Loading.value = true;
    const response = await getUserInfo(username.value);
    userInfo.value = response.data;
  } catch (error) {
    console.error('获取用户基本信息失败', error);
  } finally {
    Loading.value = false;
  }
};

// todo 登出逻辑，考虑也告诉后端已经退出？
const logout = () => {
  store.dispatch('logout');
  router.push('/');
};
</script>
<template>
  <main>
    <div class="container-fluid">
      <div
          class="page-header min-height-200"
          style="
          margin-right: -24px;
          margin-left: -34%;
        "
      >
        <span class="mask bg-gradient-success opacity-6"></span>
      </div>
      <div class="card shadow-lg mt-n6">
        <div class="card-body p-3">
          <div class="row gx-4">
            <div class="col-4 my-auto">
              <div class="h-100">
                <h5 class="mb-1">{{userInfo.username}}</h5>
              </div>
            </div>
            <div class="col-6 my-auto"></div>
            <div class="col-2 my-auto">
              <div class="h-100">
                <ArgonButton color="success" size="md" class="ms-auto" @click="logout">退出登录</ArgonButton>
              </div>
            </div>
            <div
                class="mx-auto mt-3 col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0"
            >
              <div class="nav-wrapper position-relative end-0">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-5 container-fluid">
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <!-- 添加加载提示元素，根据 isLoading 值决定是否显示 -->
              <div v-if="Loading" class="text-center">
                <p>正在加载数据，请稍候...</p>
              </div>
              <p class="text-uppercase text-sm">User Information</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">用户名</label>
                  <argon-input type="text"  :value="userInfo.username" v-model="userInfo.username"/>
                </div>

                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">密保问题</label>
                  <argon-input type="text" :value="userInfo.securityQuestion" v-model="userInfo.securityQuestion"/>
                </div>
              </div>
              <hr class="horizontal dark"/>
              <div class="d-flex align-items-center">
                <p class="text-uppercase text-sm">Special Information</p>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <argon-button color="success" size="sm" class="my-auto" data-bs-toggle="modal"
                                data-bs-target="#changePasswd">修改密码
                  </argon-button>
                </div>
              </div>
              <change-passwd/>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <statistic-card/>
        </div>
      </div>
    </div>
  </main>

</template>