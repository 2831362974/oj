<script setup>
import {fetchSubmissionStats, fetchSystemLogs, fetchSystemOverview} from "@/api/api.js";
import {onMounted, ref} from "vue";
// 用于存储系统日志数据的响应式变量
const systemLogs = ref([
  {
    adminId: 0,
    id: 0,
    operation: '',
    timestamp: '',
  }
]);
// 用于存储提交数量数据的响应式变量
const submissionStats = ref({
  statusCounts: 0,
  hourlyCounts: 0
});
// 用于存储系统概述数据的响应式变量
const systemOverview = ref({
  totalAccounts: 0,
  onlineUsers: 0,
  totalSubmissions: 0
});

const fetchData = async () => {
  try {
    // 调用获取系统日志接口
    const responseLogs = await fetchSystemLogs();
    systemLogs.value = responseLogs.data;

    // 调用获取提交数量数据接口
    const responseSubmissionStats = await fetchSubmissionStats();
    submissionStats.value = responseSubmissionStats.data;

    // 调用获取系统概述数据接口
    const responseSystemOverview = await fetchSystemOverview();
    systemOverview.value = responseSystemOverview.data;
  } catch (error) {
    console.error('获取数据过程中出现错误', error);
  }
};
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-6">
        <div class="col-6">
          <div class="card">
            <div class="p-3 pb-0 card-header">
              <h6 class="mb-0">系统数据</h6>
            </div>
            <div class="p-3 card-body">
              <ul :class="`list-group `">
                <li :class="`mb-2 border-0 list-group-item d-flex justify-content-between border-radius-lg'ps-0'`">
                  <div class="d-flex align-items-center">
                    <div :class="`text-center shadow icon icon-shape icon-sm bg-gradient-dark me-3`">
                      <i :class="`ni ni-mobile-button text-white opacity-10`"></i>
                    </div>
                    <div class="px-1 d-flex flex-column">
                      <h6 class="mb-1 text-sm text-dark">totalAccounts</h6>
                      <p class="text-xs">系统中已经注册有{{ systemOverview.totalAccounts }}账户</p>
                    </div>
                  </div>
                </li>
                <li :class="`mb-2 border-0 list-group-item d-flex justify-content-between border-radius-lg'ps-0'`">
                  <div class="d-flex align-items-center">
                    <div :class="`text-center shadow icon icon-shape icon-sm bg-gradient-dark me-3`">
                      <i :class="`ni ni-tag text-white opacity-10`"></i>
                    </div>
                    <div class="px-1 d-flex flex-column">
                      <h6 class="mb-1 text-sm text-dark">onlineUsers</h6>
                      <p class="text-xs">当前在线用户{{ systemOverview.onlineUsers }}</p>
                    </div>
                  </div>
                </li>
                <li :class="`mb-2 border-0 list-group-item d-flex justify-content-between border-radius-lg'ps-0'`">
                  <div class="d-flex align-items-center">
                    <div :class="`text-center shadow icon icon-shape icon-sm bg-gradient-dark me-3`">
                      <i :class="`ni ni-box-2 text-white opacity-10`"></i>
                    </div>
                    <div class="px-1 d-flex flex-column">
                      <h6 class="mb-1 text-sm text-dark">totalSubmissions</h6>
                      <p class="text-xs">总提交数:{{ systemOverview.totalSubmissions }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="card">
            <div class="p-3 pb-0 card-header">
              <h6 class="mb-0">系统数据</h6>
            </div>
            <div class="p-3 card-body">
              <ul :class="`list-group `">
                <li :class="`mb-2 border-0 list-group-item d-flex justify-content-between border-radius-lg'ps-0'`">
                  <div class="d-flex align-items-center">
                    <div :class="`text-center shadow icon icon-shape icon-sm bg-gradient-dark me-3`">
                      <i :class="`ni ni-mobile-button text-white opacity-10`"></i>
                    </div>
                    <div class="px-1 d-flex flex-column">
                      <h6 class="mb-1 text-sm text-dark">statusCounts</h6>
                      <p class="text-xs">{{ submissionStats.statusCounts }}</p>
                    </div>
                  </div>
                </li>
                <li :class="`mb-2 border-0 list-group-item d-flex justify-content-between border-radius-lg'ps-0'`">
                  <div class="d-flex align-items-center">
                    <div :class="`text-center shadow icon icon-shape icon-sm bg-gradient-dark me-3`">
                      <i :class="`ni ni-tag text-white opacity-10`"></i>
                    </div>
                    <div class="px-1 d-flex flex-column">
                      <h6 class="mb-1 text-sm text-dark">hourlyCounts</h6>
                      <p class="text-xs">{{ submissionStats.hourlyCounts }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
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
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">admin-username</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">operation</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">timestamp</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in systemLogs" :key="item.id">
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
                    <h6 class="mb-0 text-sm">{{ item.adminId }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ item.operation }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ item.timestamp }}</h6>
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>