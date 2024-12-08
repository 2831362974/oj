<script setup>
//该组件为root专属，root才能获取该组件
//TODO
import {ref, onMounted, computed} from 'vue';
import {useStore} from "vuex";
import {deleteUser, getUserList, unlockAllUserApi} from "@/api/api.js";
import {ElMessage} from "element-plus";
import ArgonButton from "@/components/ProfileView/ArgonButton.vue";
import AdminAdd from "@/components/ForRoot/RootAdmin/AdminAdd.vue";

// 用于存储从后端获取的用户列表数据
const users = ref([{
  id:null,
  username:'',
  online:false,
  locked:false,
  admin:false
}]);

const store = useStore();
const isRoot = computed(() => store.state.isRoot);
// 在组件挂载后发起请求获取表格数据
// 用于获取用户列表数据的函数
const getUsers = async () => {
  try {
    // 调用api.js中定义的获取用户列表接口函数，并传入isAdmin参数
    const response = await getUserList();
    users.value = response.data;
  } catch (error) {
    console.error('获取用户列表出错：', error);
  }
};
onMounted(() => {
  getUsers();
});

// 解锁用户的函数
const unlockUser = async (username) => {
  try {
    // 调用api.js中定义的解锁用户接口函数
    const response=await unlockAllUserApi(username);
    // 解锁成功后刷新用户列表状态
    ElMessage.success(response.data)
    await getUsers();
  } catch (error) {
    ElMessage.error('无需解锁')
    console.error('解锁用户出错：', error);
  }
};
// 删除用户方法
const handleDeleteUser = async (username) => {
  try {
    const confirmDelete = window.confirm('确定要删除该用户吗？');
    if (confirmDelete)
    {
      const response = await deleteUser(username);
        ElMessage.success(response.data);
        await getUsers();
    }
  } catch (error) {
    console.error('删除用户时出现错误：', error);
    ElMessage.success('删除用户出现异常，请稍后再试');
  }
};

// 获取难度徽章的类名
const getadminBadge = (admin) => {
  switch (admin) {
    case true: return 'bg-gradient-success';
    case false: return 'bg-gradient-secondary';
    default: return 'bg-gradient-secondary';
  }
};
// 获取难度徽章的类名
const getlockedBadge = (locked) => {
  switch (locked) {
    case true: return 'bg-gradient-danger';
    case false: return 'bg-gradient-success';
    default: return 'bg-gradient-secondary';
  }
};
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-6 text-center"></div>
      <div class="col-6 text-center mb-4">
        <ArgonButton color="success" class="my-auto ms-5" data-bs-toggle="modal" data-bs-target="#addAdminModal">
          增加管理员
        </ArgonButton>
        <AdminAdd/>
      </div>

    </div>
    <div class="card" style="height:500px;overflow: auto;">
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
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">username</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">isAdmin</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">blocked</th>
              <th class="text-center text-secondary text-uppercase  text-xxs font-weight-bolder opacity-7">state-control</th>
              <th class="text-center text-secondary text-uppercase  text-xxs font-weight-bolder opacity-7">user-control</th>
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
                    <h6 class="mb-0 text-sm">{{ item.username }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <span :class="['badge badge-sm', getadminBadge(item.admin)]">{{ item.admin}}</span>
              </td>
              <td>
                <span :class="['badge badge-sm', getlockedBadge(item.locked)]">{{ item.locked}}</span>
              </td>
              <td class="align-middle text-center">
                <a href="javascript:" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" v-if="isRoot"
                   data-original-title="Edit user" @click="unlockUser(item.username)">解锁</a>
              </td>
              <td class="align-middle text-center">
                <a href="javascript:" class="text-danger font-weight-bold text-xs" data-toggle="tooltip" v-if="isRoot"
                   data-original-title="Delete user" @click="handleDeleteUser(item.username)">删除</a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>


