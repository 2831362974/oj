<script setup>
//todo 从后端获得登录结果后的逻辑
import {onBeforeUnmount, onBeforeMount, ref} from "vue";
import { useStore } from "vuex";
import {useRouter} from "vue-router";
import Swal from'sweetalert2';
import {signIn} from "@/api.js";
import axios from "axios";
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
const formData = ref({
  userid: '',
  password: '',
  isAdmin: false,
});

// 处理登录按钮点击事件
const handleLogin = async () => {
  try {
    // 调用登录接口函数，传递表单数据作为参数
    const result = await signIn(formData.value.userid, formData.value.password, formData.value.isAdmin);
    // 在这里根据后端返回的结果进行不同的处理，比如登录成功后存储Token、跳转到首页等
    console.log('登录成功，结果：', result);
    // 假设后端返回数据中有token字段，将其存储到本地存储（可根据实际情况调整）
    if (result.token) {
      store.commit('setIsSignIn', true);//表示已经登录
      localStorage.setItem('token', result.token);
    }
/*    // 不用vuex的store的方法：发送请求到后端验证用户身份（假设后端有对应接口用于根据token获取用户角色信息）
    const roleResponse = await checkUserRole(result.token);
    const role = roleResponse.data.role; // 假设后端返回数据中有role字段表示用户角色，可按实际调整
    localStorage.setItem('userRole', role); // 将用户角色信息存储到本地存储*/
    //使用store的方法：发送请求到后端验证用户身份（假设后端有对应接口用于根据token获取用户角色信息）
    const roleResponse = await checkUserRole(result.token);
    const role = roleResponse.data.role; //todo 假设后端返回数据中有role字段表示用户角色，可按实际调整
    if (role === 'admin') {
      store.commit('setIsAdmin', true); // 如果角色是管理员，将Vuex的store中的isAdmin设为true
    } else {
      store.commit('setIsAdmin', false); // 否则设为false，表示普通用户
    }
    await router.push('/'); // 假设登录成功后跳转到首页，可根据实际需求修改跳转路径
  } catch (error) {
    console.error('登录失败', error);
    // 可以在这里添加一些提示用户登录失败的交互逻辑，比如弹出提示框等
  }
};
//todo 验证登录用户的身份
// 新增：用于向后端验证用户角色的函数（假设后端接口为/api/checkUserRole，可按实际调整）
const checkUserRole = async (token) => {
  try {
    return await axios.get('/api/checkUserRole', {
      headers: {
        Authorization: `Bearer ${token}` // 将token添加到请求头中发送给后端，按实际后端要求调整格式
      }
    });
  } catch (error) {
    console.error('验证用户角色失败', error);
    throw error;
  }
};
// 控制注册跳转的函数
const goToSignup = () => {
  window.location.href = '/signup';
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
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Enter your id and password to sign in</p>
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
                          v-model="formData.userid"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                          id="password"
                          type="password"
                          placeholder="your Password"
                          name="password"
                          size="lg"
                          v-model="formData.password"
                      />
                    </div>
                    <argon-switch id="isAdmin" name="isAdmin" @click="formData.isAdmin=true"
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
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a href="javascript:" class="text-success text-gradient font-weight-bold"  @click.prevent="goToSignup">Sign up</a>
                  </p>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    <a href="javascript:" class="text-success text-gradient font-weight-bold"> Forget password?</a>
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
