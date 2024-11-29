<script setup>
//todo 1.向后端发送注册信息的post接口 2.从后端获得一个注册结果的逻辑
import {onBeforeUnmount, onBeforeMount, ref} from "vue";
import { useStore } from "vuex";
import {useRouter} from "vue-router";
import axios from 'axios';

import Navbar from "@/components/Signup/Navbar.vue";
import AppFooter from "@/components/Signup/Footer.vue";
import ArgonInput from "@/components/Signup/ArgonInput.vue";
import ArgonButton from "@/components/Signup/ArgonButton.vue";
import ArgonSwitch from "@/components/SignIn/ArgonSwitch.vue";

const body = document.getElementsByTagName("body")[0];

const store = useStore();
const router = useRouter();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

const formData = ref({
  userid: '',
  password: '',
  email: '',
});
//todo 与登录同理
const handleRegister = async () => {
  try {
    const response = await axios.post('实际的后端接口', formData.value);
    // 注册成功，弹出提示并跳转登录页面
    if (response.data.success) {
      alert('注册成功');
      await router.push('/login');
    } else {
      // 注册失败，弹出失败原因并清空输入框
      alert(response.data.message);
      formData.value = {
        id: '',
        password: '',
        email:''
      };
    }
  } catch (error) {
    console.error('注册请求出错', error);
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
                    v-model="formData.userid"
                />

                <argon-input
                    id="password"
                    type="password"
                    placeholder="Password"
                    aria-label="Password"
                    v-model="formData.password"
                />

                <argon-input
                    id="securityQuestion"
                    type="text"
                    placeholder="Email"
                    aria-label="email"
                    v-model="formData.email"
                />

                <argon-switch id="rememberMe" name="remember-me"
                >我要注册管理员账号</argon-switch
                >
                <div class="text-center">
                  <argon-button
                      fullWidth
                      color="dark"
                      variant="gradient"
                      class="my-4 mb-2"
                      @click="handleRegister"
                  >Sign up</argon-button
                  >
                </div>
                <p class="text-sm mt-3 mb-0">
                  Already have an account?
                  <a href="javascript:" class="text-dark font-weight-bolder"
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