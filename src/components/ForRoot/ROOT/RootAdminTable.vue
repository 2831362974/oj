<script setup>
//TODO 1.从后端获取用户列表接口 2.数据命名根据数据库设计修改，考虑给锁定用户添加一个state？ 3.考虑用户根据绑定筛选？
import {ref, onMounted, computed} from 'vue';
import { useStore } from "vuex";
import axios from 'axios';

// 用于存储从后端获取的用户列表数据，是一个响应式数组**isAdmin控制返回的用户是非管理员用户还是全部用户
const users = ref([{
  id:1,
  uid:'12345679',
  email:'12345679@gmail.com',
  state:'未锁定',
  isAdmin:false
}]);

const store = useStore();
const isAdmin = computed(() => store.state.isAdmin);
const isRoot = computed(() => store.state.isRoot);
/*// 在组件挂载后发起请求获取表格数据
onMounted(() => {
  axios.get('后端获取用户列表的接口地址')
      .then((response) => {
        // 将后端返回的数据赋值给 questions 数组
        users.value = response.data;
      })
      .catch((error) => {
        console.error('获取用户列表数据出错：', error);
      });
});*/

// 删除用户方法
const deleteQuestion = (id) => {
  axios.post('后端删除用户的接口地址', { id })
      .then(() => {
        // 这里可以添加删除成功提示或刷新题目列表等操作
        console.log('用户删除成功');
      })
      .catch((error) => {
        console.error('删除用户出错：', error);
      });
};

</script>
<template>
  <div class="card" style="height:500px;overflow: auto">
    <div class="card-header pb-0">
      <h6>用户名单</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
          <tr>
<!--            表头的内容由数据库设计决定-->
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">id</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">uid</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">email</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">state</th>
            <th class="text-center text-secondary text-uppercase  text-xxs font-weight-bolder opacity-7" v-if="isAdmin">state-control</th>
            <th class="text-center text-secondary text-uppercase  text-xxs font-weight-bolder opacity-7" v-if="isRoot">user-control</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in users" :key="item.id">
            <td>
              <div class="d-flex px-2 py-1">
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-sm">{{ item.id }}</h6>
                </div>
              </div>
            </td>
            <td>
              <div class="d-flex px-2 py-1">
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-sm">{{ item.uid }}</h6>
                </div>
              </div>
            </td>
            <td>
              <div class="d-flex px-2 py-1">
                <div class="d-flex flex-column justify-content-center">
                  <p class="mb-0 text-sm">{{ item.email }}</p>
                </div>
              </div>
            </td>
            <td>
              <p class="text-xs font-weight-bold mb-0">{{ item.state }}</p>
            </td>
            <td class="align-middle text-center" v-if="isAdmin">
              <a href="javascript:" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip"
                 data-original-title="Edit user" @click="">解锁</a>
            </td>
            <td class="align-middle text-center" v-if="isRoot">
              <a href="javascript:" class="text-danger font-weight-bold text-xs" data-toggle="tooltip"
                 data-original-title="Delete user" @click="deleteQuestion(item.id)">删除</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


