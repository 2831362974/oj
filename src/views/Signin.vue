<script setup>
//修改完成
import {onBeforeUnmount, onBeforeMount, ref} from "vue";
import { useStore } from "vuex";
import {useRouter} from "vue-router";
import {applyUnlockUser, signIn} from "@/api/api.js";
import { ElMessage } from 'element-plus';
import Navbar from "@/components/SignIn/Navbar.vue";
import ArgonInput from "@/components/SignIn/ArgonInput.vue";
import ArgonButton from "@/components/SignIn/ArgonButton.vue";
import ArgonSwitch from "@/components/SignIn/ArgonSwitch.vue";

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
  isAdmin: false,
});
const dataForm2=ref({
  username:''
})
// 登录状态
const loading = ref(false); // 按钮加载状态
const errorMessage = ref(''); // 错误消息
const showApplyForm=ref(false);
// 处理登录
const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    // 调用登录 API
    const response = await signIn(dataForm.value);
    const token = response.headers.authorization;
    // 假设成功后将 token 保存到 localStorage，并跳转到主页
    if(token){
      localStorage.setItem('token', token);
      store.commit('setUsername', dataForm.value.username);
    }
    // 更新 Vuex Store 状态
    store.commit('setIsSignIn', true);
    if(dataForm.value.isAdmin){
      store.commit('setIsAdmin', true);
    }else{
      store.commit('setIsAdmin', false);
    }
    ElMessage.success(response.data);
    await router.push('/');
  } catch (e) {
    console.error(e);
    // 错误处理
    errorMessage.value = e.response?.data?.message || '登录失败，请检查账号或密码';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
};
const handleApplyUnlock = async () => {
  try{
    const response=await applyUnlockUser(dataForm2.value.username);
    ElMessage.success(response.data);
  }catch(e){
    console.error(e);
    ElMessage.error('申请失败，请检查用户名');
  }
};
// 控制申请解锁表单的函数
const goToApply = () =>{
  showApplyForm.value=!showApplyForm.value;
}
// 控制注册跳转的函数
const goToSignup = () => {
  router.push('/signUp');
};
// 控制忘记密码跳转的函数
const goToReset=()=>{
  router.push('/reset');
}
</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
            isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
            v-bind:darkMode="true"
            isBtn="bg-gradient-success"
        />
      </div>
    </div>
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
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Enter your id and password to sign in</p>
                </div>
                <div class="card-body">
                  <template v-if="!showApplyForm">
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
                    <argon-switch id="isAdmin" name="isAdmin" @click="dataForm.isAdmin=true"
                    >我是管理员</argon-switch
                    >

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
                  </template>
                  <template v-else>
                    <form role="form" @submit.prevent="handleApplyUnlock">
                    <div class="mb-3">
                      <argon-input
                          id="username"
                          type="text"
                          placeholder="your username"
                          name="password"
                          size="lg"
                          v-model="dataForm2.username"
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
                        >Apply unlock</argon-button
                        >
                      </div>
                    </form>
                  </template>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Is your account locked?
                    <a href="javascript:" class="text-success text-gradient font-weight-bold"  @click.prevent="goToApply">{{!showApplyForm?'Apply unlock':'Back to login'}}</a>
                  </p>
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a href="javascript:" class="text-success text-gradient font-weight-bold"  @click.prevent="goToSignup">Sign up</a>
                  </p>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    <a href="javascript:" class="text-success text-gradient font-weight-bold" @click.prevent="goToReset"> Forget password?</a>
                  </p>
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
