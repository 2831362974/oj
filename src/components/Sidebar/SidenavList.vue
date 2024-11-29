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

      <li class="nav-item">
        <sidenav-item
          to="/question"
          :class="getRoute() === 'question' ? 'active' : ''"
          :navText="'题库'"
        >
          <template v-slot:icon>
            <i
              class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="!isAdmin">
        <sidenav-item
          to="/answer"
          :class="getRoute() === 'answer' ? 'active' : ''"
          :navText="'做题'"
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

      <li class="mt-3 nav-item">

        <h6
           class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="'ms-2'"
        >
          ACCOUNT
        </h6>
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

      <li class="nav-item">
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

  <div class="pt-3 mx-3 mt-3 sidenav-footer">
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
