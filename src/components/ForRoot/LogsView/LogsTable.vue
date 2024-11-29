<script setup>
//TODO 表格模板
import {onMounted, ref} from 'vue';
import axios from 'axios';


// 响应式变量存储题目数据
const AlQuestions = ref([]);


const getQuestions = () => {
  axios.get(`后端请求用户已经做过的题目列表的接口地址`)
      .then((response) => {
        AlQuestions.value = response.data;
      })
      .catch((error) => {
        console.error('获取题目列表数据出错：', error);
      });
};
onMounted(() =>{
  getQuestions();
})

// 获取难度徽章的类名
const getDifficultyBadge = (level) => {
  switch (level) {
    case '1': return 'bg-gradient-success';
    case '2': return 'bg-gradient-success';
    case '3': return 'bg-gradient-warning';
    case '4': return 'bg-gradient-danger';
    case '5': return 'bg-gradient-danger';
    default: return 'bg-gradient-secondary';
  }
};
</script>
<template>
  <div class="container">
    <div class="row">

    </div>
  </div>
  <div class="card" style="height:500px;overflow: auto">
    <div class="card-header pb-0">
      <h6>我做过的题目</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
          <tr>
<!--            表头的内容由数据库设计决定-->
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">id</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">title</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">content</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Difficulty</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">state</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in filteredQuestions" :key="item.id">
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
                  <h6 class="mb-0 text-sm">{{ item.title }}</h6>
                </div>
              </div>
            </td>
            <td>
              <p class="text-xs font-weight-bold mb-0">{{ item.description.content }}</p>
            </td>
            <td class="align-middle text-center text-sm">
              <span :class="['badge badge-sm', getDifficultyBadge(item.level)]">{{ item.level }}</span>
            </td>
            <td class="align-middle text-center">
              <a href="javascript:" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit question" @click="openEditModal(item)">Edit</a>
            </td>
            <td class="align-middle text-center">
            <a href="javascript:" class="text-danger font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Delete question" @click="deleteQuestion(item.id)">Delete</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


