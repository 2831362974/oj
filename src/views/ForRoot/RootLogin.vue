<script setup>
//修改完成
import {onBeforeUnmount, onBeforeMount, ref} from "vue";
import { useStore } from "vuex";
import {useRouter} from "vue-router";
import {SysLogin} from "@/api/api.js";


import ArgonInput from "@/components/SignIn/ArgonInput.vue";
import ArgonButton from "@/components/SignIn/ArgonButton.vue";

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
// 登录表单数据
const dataForm = ref({
  username: '',
  password: '',
});
// 登录状态
const loading = ref(false); // 按钮加载状态
const errorMessage = ref(''); // 错误消息

// 处理登录
const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    // 调用系统管理员登录 API
    const response = await SysLogin(dataForm.value);
    const token = response.headers.authorization;
    // 假设成功后将 token 保存到 localStorage，并跳转到主页
    if(token){
      localStorage.setItem('token', token);
    }
    // 更新 Vuex Store 状态
    store.commit('setIsSignIn', true);
    store.commit('setIsRoot', true);
    alert(response.data);
    await router.push('/');
  } catch (e) {
    // 错误处理
    errorMessage.value = e.response?.data?.message || '登录失败，请检查账号或密码';
    alert(errorMessage.value);
  } finally {
    loading.value = false;
  }
};

// 控制忘记密码跳转的函数
</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
                class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">系统管理登录页面</h4>
                  <p class="mb-0">登录以管理后台</p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="handleLogin">
                    <div class="mb-3">
                      <argon-input
                          id="userid"
                          type="text"
                          placeholder="your id"
                          name="id"
                          size="lg"
                          v-model="dataForm.username"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                          id="password"
                          type="password"
                          placeholder="your Password"
                          name="password"
                          size="lg"
                          v-model="dataForm.password"
                      />
                    </div>
                    <div class="text-center">
                      <argon-button
                          type="submit"
                          class="mt-4"
                          variant="gradient"
                          color="success"
                          fullWidth
                          size="lg"
                      >Sign in</argon-button
                      >
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div
                class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                  class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                  style="
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4
                    class="mt-5 text-white font-weight-bolder position-relative"
                >
                  欢迎来到MyOj
                </h4>
                <p class="text-white position-relative">
                  开启算法挑战之旅，开启无限可能
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
