<script setup>
//该组件为管理员admin专属
//TODO 1.从后端获取用户列表 2.数据命名根据数据库设计修改，考虑给锁定用户添加一个state？ 3.考虑用户根据绑定筛选？
import {ref, onMounted} from 'vue';
import {fetchUserRecord, getUserList, unlockUserApi} from "@/api/api.js";
import {useRouter} from "vue-router";
import ArgonButton from "@/components/ProfileView/ArgonButton.vue";
import UserRecordModal from "@/components/ForAdmin/AdminView/UserRecordModal.vue";
import {ElMessage} from 'element-plus';

const router = useRouter();
const users = ref([{
  id: null,
  username: '',
  online: false,
  locked: false,
  admin: false
}]);

const currentUsername = ref('');  // 当前查看的用户名
const visible = ref(false);// 控制模态框的显示/隐藏

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
    const response = await unlockUserApi(username);
    ElMessage.success(response.data);
    // 解锁成功后刷新用户列表状态
    await getUsers();
  } catch (e) {
    console.error('解锁用户出错：', e);
    ElMessage.error('无权限或无需解锁');
  }
};


// 获取难度徽章的类名
const getadminBadge = (admin) => {
  switch (admin) {
    case true:
      return 'bg-gradient-success';
    case false:
      return 'bg-gradient-secondary';
    default:
      return 'bg-gradient-secondary';
  }
}
// 获取难度徽章的类名
const getlockedBadge = (locked) => {
  switch (locked) {
    case true:
      return 'bg-gradient-danger';
    case false:
      return 'bg-gradient-success';
    default:
      return 'bg-gradient-secondary';
  }
}
// 存储答题记录的响应式数组
const userRecords = ref([
  {
    submissionId: null,
    result: null
  }
]);
// 定义获取答题记录数据的函数
const fetchUserRecords = async (username) => {
  currentUsername.value = username;  // 设置当前查看的用户名
  visible.value = true;
  try {
    const response = await fetchUserRecord(username);
    userRecords.value = response.data; // 假设接口返回的数据就是答题记录数组
  } catch (e) {
    console.log('error',e);
    ElMessage.error('无法获取答题记录');
  }
}
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
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">username</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">isOnline</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">blocked</th>
            <th class="text-center text-secondary text-uppercase  text-xxs font-weight-bolder opacity-7">state-control
            </th>
            <th class="text-center text-secondary text-uppercase  text-xxs font-weight-bolder opacity-7">
              answer-control
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in users" :key="item.username">
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
            <td class="text-center">
              <span :class="['badge badge-sm', getadminBadge(item.admin)]">{{ item.admin }}</span>
            </td>
            <td class="text-center">
              <span :class="['badge badge-sm', getlockedBadge(item.locked)]">{{ item.locked }}</span>
            </td>
            <td class="align-middle text-center">
              <a href="javascript:" class="font-weight-bold text-xs"
                 :class="item.locked ? 'text-danger' : 'text-secondary'" data-toggle="tooltip"
                 data-original-title="Edit user" @click="unlockUser(item.username)">解锁</a>
            </td>
            <td class="align-middle text-center">
              <a href="" class="text-success font-weight-bold text-xs" @click.prevent="fetchUserRecords(item.username)">查看答题记录</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <el-dialog title="答题记录" v-model="visible" width="50%">
    <p>当前查看用户: {{ currentUsername }}</p>
    <ul>
      <li v-for="record in userRecords" :key="record.submissionId">
        <p><span>提交id:</span> {{ record.submissionId }}
        <span>提交结果:</span> {{ record.score }}</p>
      </li>
    </ul>
  </el-dialog>
</template>


