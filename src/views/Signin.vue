<script setup>
//todo 1.向后端发送用户登录信息的接口 2.从后端获得一个登录结果的逻辑
import {onBeforeUnmount, onBeforeMount, ref} from "vue";
import { useStore } from "vuex";
import Navbar from "@/components/SignIn/Navbar.vue";
import ArgonInput from "@/components/SignIn/ArgonInput.vue";
import ArgonButton from "@/components/SignIn/ArgonButton.vue";
import ArgonSwitch from "@/components/SignIn/ArgonSwitch.vue";
import {useRouter} from "vue-router";
import Swal from'sweetalert2';

const body = document.getElementsByTagName("body")[0];

const store = useStore();
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
const router = useRouter();
const userid = ref('');
const password = ref('');
const isAdmin = ref(false);
const handleSubmit = async () => {
  //todo 这里应该是实际的登录验证逻辑，比如发送请求到后端验证用户名和密码，再接收后端发送的结果，这里简单模拟验证成功
  if (userid.value === 'test' && password.value === '123456') {
    await store.dispatch('login', { isAdmin: isAdmin.value }); // 调用Vuex中的login1动作，更新登录状态
    await Swal.fire({
      title: '登录成功！',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500 // 弹框显示1.5秒后自动关闭
    });
    setTimeout(() => {
      router.push('/'); // 跳转到首页，使用路由实例的push方法
    }, 1500); // 等待弹框显示完1.5秒后再跳转
  } else {
    await Swal.fire({
      title: '登录失败，请检查用户名和密码',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    });
  }
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
                  <form role="form" @submit.prevent="handleSubmit">
                    <div class="mb-3">
                      <argon-input
                          id="userid"
                          type="text"
                          placeholder="your id"
                          name="id"
                          size="lg"
                          v-model="userid"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                          id="password"
                          type="password"
                          placeholder="your Password"
                          name="password"
                          size="lg"
                          v-model="password"
                      />
                    </div>
                    <argon-switch id="isAdmin" name="isAdmin" @click="isAdmin=true"
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
                    <a
                        href="javascript:"
                        class="text-success text-gradient font-weight-bold"
                    >Sign up</a
                    >
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
