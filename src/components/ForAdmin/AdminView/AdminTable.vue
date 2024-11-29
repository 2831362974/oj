<script setup>
//TODO 1.从后端获取用户列表接口 2.数据命名根据数据库设计修改，考虑给锁定用户添加一个state？ 3.考虑用户根据绑定筛选？
import {ref, onMounted, computed} from 'vue';
import { useStore } from "vuex";
import axios from 'axios';

// 用于存储从后端获取的用户列表数据，是一个响应式数组**isAdmin控制返回的用户是非管理员用户还是全部用户
const users = ref([{
  id:1,
  uid:'',
  email:'',
  state:'',
  isAdmin:false
}]);

const store = useStore();
const isAdmin = computed(() => store.state.isAdmin);
// 在组件挂载后发起请求获取表格数据
// 用于获取用户列表数据的函数
const getUsers = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/api/users');
    users.value = response.data;
  } catch (error) {
    console.error('获取用户列表出错：', error);
  }
};
onMounted(() => {
  getUsers();
});

// 解锁用户的函数
const unlockUser = async (userId) => {
  try {
    await axios.put(`http://127.0.0.1:5000/api/users/${userId}/unlock`);
    // 解锁成功后刷新用户列表（可根据实际需求优化，比如只更新当前用户状态而不重新获取整个列表）
    await getUsers();
  } catch (error) {
    console.error('解锁用户出错：', error);
  }
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
                 data-original-title="Edit user" @click="unlockUser(item.id)">解锁</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


