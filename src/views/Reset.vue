<script setup>
//todo
import {onBeforeUnmount, onBeforeMount, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {getUserInfo, resetPassword} from "@/api/api.js";
import {ElMessage} from 'element-plus';
import Navbar from "@/components/SignIn/Navbar.vue";
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
// 新增一个变量来控制显示登录表单还是重置密码表单，初始为true表示显示登录表单
const showResetForm = ref(true);
const router = useRouter();
// 表单数据
const dataForm = ref({
  username: '',
  newPassword: '',
  answer: '',
});
const userinfo=ref({
  username:'',
  securityQuestion:'',
})

// 获取密保问题
const goToNextStep = async () => {
  // 切换表单显示状态
  try {
    // 调用接口获取用户信息，前提是dataForm.username有值，可根据实际情况添加验证逻辑
    const response = await getUserInfo(dataForm.value.username);
    console.log(response.data);
    if (response.status === 200) {
      // 假设后端返回的数据结构中，密保问题在某个字段下，比如'securityQuestion'，这里根据实际情况调整
      userinfo.value = response.data;
      showResetForm.value =!showResetForm.value;
    }
  } catch (error) {
    // 根据接口请求失败的情况给出相应提示，这里简单处理异常情况的提示
    ElMessage.error('获取用户信息失败，请检查用户名是否正确或稍后重试。');
  }
};

// 完善后的goToReset函数，用于调用重置密码接口
const goToReset = async () => {
  try {
    // 构造符合后端接口要求的请求数据
    const requestData = {
      username: dataForm.value.username,
      answer: dataForm.value.answer,
      newPassword: dataForm.value.newPassword
    };
    // 使用axios发送POST请求到后端的reset-password接口
    const response = await resetPassword(requestData);
    if (response.status === 200) {
      // 重置密码成功，给出提示信息
      ElMessage.success('Password reset successfully!');
    }
  } catch (error) {
    // 根据不同的错误情况给出相应提示，这里简单处理异常情况的提示
    ElMessage.error('Failed to reset password. Please try again.');
  }
}
// 控制跳转的函数
const goToSignIn = () => {
  router.push('/signIn');
};

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
                  <h4 class="font-weight-bolder">Reset</h4>
                  <p class="mb-0">Enter your id to reset</p>
                </div>
                <div class="card-body">
                  <form role="form">
                    <!-- 根据showResetForm变量来切换显示不同表单 -->
                    <template v-if="showResetForm">
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
                      <div class="text-center">
                        <argon-button
                            type="submit"
                            class="mt-4"
                            variant="gradient"
                            color="success"
                            fullWidth
                            size="lg"
                            @click.prevent="goToNextStep"
                        >
                          next step
                        </argon-button>
                      </div>
                    </template>
                    <template v-else>
                      <div class="mb-3">
                        <argon-input
                            id="username"
                            type="text"
                            placeholder="username"
                            name="username"
                            size="lg"
                            v-model="dataForm.username"
                        />
                      </div>
                      <div class="mb-3">
                        <argon-input
                            id="newpassword"
                            type="password"
                            placeholder="new password"
                            name="newpassword"
                            size="lg"
                            v-model="dataForm.newPassword"
                        />
                      </div>
                      <!-- 新增展示密保问题的div -->
                      <div class="mb-3 text-start">
                        <span class="font-weight-bold">密保问题：{{ userinfo.securityQuestion }}</span>
                      </div>
                      <div class="mb-3">
                        <argon-input
                            id="answer"
                            type="text"
                            placeholder="answer to security question"
                            name="answer"
                            size="lg"
                            v-model="dataForm.answer"
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
                            @click.prevent="goToReset"
                        >
                          Reset Password
                        </argon-button>
                      </div>
                    </template>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Go to login?
                    <a href="javascript:" class="text-success text-gradient font-weight-bold"
                       @click.prevent="goToSignIn">Sign In</a>
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
