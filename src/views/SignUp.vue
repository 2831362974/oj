<script setup>
//todo 获得注册结果后的弹窗和逻辑
import {onBeforeUnmount, onBeforeMount, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

import Navbar from "@/components/SignUp/Navbar.vue";
import AppFooter from "@/components/SignUp/Footer.vue";
import ArgonInput from "@/components/SignUp/ArgonInput.vue";
import ArgonButton from "@/components/SignUp/ArgonButton.vue";
import {signup} from "@/api/api.js";
import {ElMessage} from "element-plus";



const body = document.getElementsByTagName("body")[0];
const store = useStore();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  body.classList.add("bg-gray-100");
});
const router = useRouter();
//注册表单数据
const dataForm = ref({
  username: '',
  password: '',
  securityQuestion:'',
  securityQuestionAnswer:'',
});
const loading = ref(false); // 按钮加载状态
const errorMessage = ref(''); // 错误消息
// 处理注册按钮点击事件
const handleSignup = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    // 调用注册接口函数，传递表单数据作为参数
    const response = await signup(dataForm.value);
    ElMessage.success(response.data);
    await router.push('/signIn');
  } catch (e) {
    console.error(e);
    // 错误处理
    errorMessage.value = e.response?.data?.message || '登录失败，请检查账号或密码';
    ElMessage.error(errorMessage.value);
  }
};
</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBtn="bg-gradient-light" />
      </div>
    </div>
  </div>
  <main class="main-content mt-0">
    <div
        class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
        style="
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">欢迎!</h1>
            <p class="text-lead text-white">
              注册账号，解锁算法世界的精彩大门
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <h5>Register with</h5>
            </div>
            <div class="row px-xl-5 px-sm-4 px-3">
            </div>
            <div class="card-body">
              <form role="form">
                <argon-input
                    id="userid"
                    type="text"
                    placeholder="Id"
                    aria-label="id"
                    v-model="dataForm.username"
                />
                <argon-input
                    id="password"
                    type="password"
                    placeholder="Password"
                    aria-label="Password"
                    v-model="dataForm.password"
                />
                <argon-input
                    id="securityQuestion"
                    type="text"
                    placeholder="密保问题"
                    aria-label="securityQuestion"
                    v-model="dataForm.securityQuestion"

                />
                <argon-input
                    id="securityQuestionAnswer"
                    type="text"
                    placeholder="密保答案"
                    aria-label="securityQuestionAnswer"
                    v-model="dataForm.securityQuestionAnswer"
                />
                <div class="text-center">
                  <argon-button
                      fullWidth
                      color="dark"
                      variant="gradient"
                      class="my-4 mb-2"
                      @click="handleSignup"
                  >Sign up</argon-button
                  >
                </div>
                <p class="text-sm mt-3 mb-0">
                  Already have an account?
                  <a href="" class="text-dark font-weight-bolder"
                  >Sign in</a
                  >
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <app-footer />
</template>