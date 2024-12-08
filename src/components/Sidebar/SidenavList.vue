<script setup>
import { useRoute } from "vue-router";
import {computed} from "vue";

import SidenavItem from "./SidenavItem.vue";
import SidenavCard from "./SidenavCard.vue";
import { useStore } from 'vuex';

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};
const store = useStore();
const isSignIn = computed(() => store.getters.isSignIn);
const isAdmin = computed(() => store.getters.isAdmin);
const isRoot = computed(() => store.getters.isRoot);
</script>
<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          to="/"
          :class="getRoute() === '' ? 'active' : ''"
          :navText="'主页'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="!isRoot">
        <sidenav-item
          to="/question"
          :class="getRoute() === 'question' ? 'active' : ''"
          :navText="'题库'"
        >
          <template v-slot:icon>
            <i
              class="ni ni-camera-compact text-warning text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="!isAdmin&&!isRoot">
        <sidenav-item
          to="/record"
          :class="getRoute() === 'record' ? 'active' : ''"
          :navText="'我的题目'"
        >
          <template v-slot:icon>
            <i class="ni ni-credit-card text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="isAdmin">
        <sidenav-item
            to="/admin"
            :class="getRoute() === 'admin' ? 'active' : ''"
            :navText="'用户管理'"
        >
          <template v-slot:icon>
            <i class="ni ni-credit-card text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item" v-if="isRoot">
        <sidenav-item
            to="/admin/root"
            :class="getRoute() === 'admin/root' ? 'active' : ''"
            :navText="'用户管理'"
        >
          <template v-slot:icon>
            <i class="ni ni-credit-card text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item" v-if="isRoot">
        <sidenav-item
            to="/statistic"
            :class="getRoute() === 'statistic' ? 'active' : ''"
            :navText="'后台管理'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-copy-04 text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item" v-if="isSignIn">
        <sidenav-item
          to="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="'个人账户'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="!isSignIn">
        <sidenav-item
          to="/signIn"
          :class="getRoute() === 'signIn' ? 'active' : ''"
          :navText="'登录'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="!isRoot">
        <sidenav-item
          to="/signup"
          :class="getRoute() === 'signup' ? 'active' : ''"
          :navText="'注册'"
        >
          <template v-slot:icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>

  <div class="pt-3 mx-3 mt-3 sidenav-footer" v-if="!isRoot">
    <sidenav-card
      :card="{
        title: 'Need Help?',
        description: 'Please check our docs',
        links: [
          {
            label: 'Documentation',
            route:
              'https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/',
            color: 'dark',
          },
        ],
      }"
    />
  </div>
</template>
