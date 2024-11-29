<script setup>
//todo 1.从后端获取身份信息 2.向后端发送修改密码的请求
//todo name属性不要的话删了
import {onBeforeMount, onMounted, onBeforeUnmount, computed,ref} from "vue";
import { useStore } from "vuex";
import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ArgonInput from "@/components/ProfileView/ArgonInput.vue";
import ArgonButton from "@/components/ProfileView/ArgonButton.vue";
import {useRouter} from "vue-router";
import axios from 'axios';
import ChangePasswd from "@/components/ProfileView/ChangePasswd.vue";


const router = useRouter();
const store = useStore();

const isAdmin = computed(() => store.getters.isAdmin);
const body = document.getElementsByTagName("body")[0];

// 用于存储用户信息的响应式数据(看后端数据库怎么设计）
const userInfo = ref({
  username: '',
  uid: '',
  email:'',
  owningAdminId: '',
  password: ''
});
// 用于存储管理员用户信息的响应式数据
const adminInfo = ref({
  username: '',
  uid: '',
  email:'',
  password: ''
});

// 新增用于控制加载提示显示的响应式数据
const isLoading = ref(false);

// 从后端获取用户信息的函数，更新加载状态
const fetchUserInfo = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get('/api/userInfo');
    userInfo.value = response.data;
  } catch (error) {
    console.error('获取用户基本信息失败', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
  fetchUserInfo();//挂载时调用获取后端数据
});

onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = false;
  store.state.showFooter = true;
  store.state.hideConfigButton = true;
  body.classList.add("profile-overview");
});

onBeforeUnmount(() => {
  store.state.isAbsolute = false;
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  body.classList.remove("profile-overview");
});
//todo 登出逻辑，考虑也告诉后端已经退出？
const logout = () => {
  store.dispatch('logout');
  router.push('/');
};
</script>
<template>
  <main>
    <div class="container-fluid">
      <div
          class="page-header min-height-300"
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
                <h5 class="mb-1">User name</h5>
                <p class="mb-0 font-weight-bold text-sm">User identity</p>
              </div>
            </div>
            <div class="col-6 my-auto"></div>
            <div class="col-2 my-auto">
              <div class="h-100">
                <ArgonButton color="success" size="sm" class="ms-auto" @click="logout">exit</ArgonButton>
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
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <!-- 添加加载提示元素，根据 isLoading 值决定是否显示 -->
              <div v-if="isLoading" class="text-center">
                <p>正在加载数据，请稍候...</p>
              </div>
              <p class="text-uppercase text-sm">User Information</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">Username</label>
                  <argon-input type="text" v-if="isAdmin" :value="adminInfo.username" />
                  <argon-input type="text" v-else :value="userInfo.username" />

                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">id</label>
                  <argon-input type="text" v-if="isAdmin" :value="adminInfo.id" />
                  <argon-input type="text" v-else :value="userInfo.id" />
                </div>
<!--todo owing admin id 所属管理员账号   看后端实现情况            -->
                <div class="col-md-6" v-if="!isAdmin">
                  <label for="example-text-input" class="form-control-label">owning admin id</label>
                  <argon-input type="text" :value="userInfo.owningAdminId" />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">email</label>
                  <argon-input type="text" :value="userInfo.email" />
                </div>
              </div>
              <hr class="horizontal dark" />
              <div class="d-flex align-items-center">
              <p class="text-uppercase text-sm">Special Information</p>
              </div>
              <div class="row">
                <div class="col-md-8">
                  <label for="example-text-input" class="form-control-label">password</label>
                  <argon-input type="password" :value="userInfo.password" />
                </div>
                <argon-button color="success" size="sm" class="my-auto" data-bs-toggle="modal" data-bs-target="#changepasswd">修改密码</argon-button>
                <change-passwd />
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <statistic-card />
        </div>
      </div>
    </div>
  </main>

</template>