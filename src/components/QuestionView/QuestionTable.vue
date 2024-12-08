<script setup>
//TODO 1.从后端获取题目列表接口 2.数据命名根据数据库设计修改，下方template中的引用一并修改
import {computed, onMounted, ref} from 'vue';
import {useStore} from "vuex";
import {useRouter} from 'vue-router';
import {deleteQuestion, getQuestionBankData} from '@/api.js';

import QuestionSort from "@/components/QuestionView/QuestionSort.vue";
import QuestionSearch from "@/components/QuestionView/QuestionSearch.vue";
import ArgonButton from "@/components/ProfileView/ArgonButton.vue";
import QuestionAdd from "@/components/QuestionView/QuestionAdd.vue";

const router = useRouter();
const goToAnswerPage = (questionId) => {
  router.push({ name: 'answer', params: { id: questionId } }); // 假设 'answer' 是做题界面路由的名称，根据实际路由配置修改
};
// 获取store实例
const store = useStore();
const isAdmin = computed(() => store.state.isAdmin);

const initialQuestion = ref([]);//存储初始题目列表数据
const questions = ref([]);//存储最终题目列表数据

onMounted(() => {
  getQuestions();
});
// 请求题目列表数据的方法
const getQuestions = async () => {
    try {
      // 调用接口函数获取题库数据，并赋值给响应式数据
      initialQuestion.value = await getQuestionBankData();
      questions.value = initialQuestion.value;
    } catch (error) {
      console.error('获取题库数据出现错误：', error);
    }
};
const updateSearchResults = (searchResults) => {
  questions.value = searchResults;
};
// 获取难度徽章的类名
const getDifficultyBadge = (level) => {
  switch (level) {
    case 1: return 'bg-gradient-success';
    case 2: return 'bg-gradient-success';
    case 3: return 'bg-gradient-warning';
    case 4: return 'bg-gradient-danger';
    case 5: return 'bg-gradient-danger';
    default: return 'bg-gradient-secondary';
  }
};

//todo 删除题目的函数,非常正确
// 确认删除题目的函数
const handleDeleteQuestion = async (questionId) => {
  try {
    const confirmDelete = window.confirm('确定要删除该题目吗？');
    if (confirmDelete) {
      const response = await deleteQuestion(questionId);
      if (response.success) {
        // 重新获取题目列表，此处假设你有获取题目列表的函数，比如 getQuestionList()
        questions.value = await getQuestions();
        alert('题目删除成功');
      } else {
        alert('题目删除失败：' + response.message);
      }
    }
  } catch (error) {
    console.error('删除题目时出现错误：', error);
    alert('删除题目出现异常，请稍后再试');
  }
};
const handleEdit=(questionId)=>{
  router.push({ name: 'questionEdit', params: { id: questionId } });
}
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-1">
      </div>
      <div class="col-4">
        <question-sort @sort-change="handleSortChange"></question-sort>
      </div>
      <div class="col-1">
      </div>
      <div class="col-4">
        <question-search @search-result="updateSearchResults" :questions="questions"></question-search>
      </div>
      <div class="col-2">
        <ArgonButton color="success" class="my-auto ms-5" data-bs-toggle="modal" data-bs-target="#addQuestionModal">增加题目</ArgonButton>
        <QuestionAdd />
      </div>
    </div>
  </div>
  <div class="card" style="height:500px;overflow: auto">
    <div class="card-header pb-0">
      <h6>题目大全</h6>
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
            <th class="text-center text-secondary opacity-7" v-if="!isAdmin">star</th>
            <th class="text-center text-secondary opacity-7" v-if="!isAdmin"></th>
            <th class="text-center text-secondary opacity-7" v-if="isAdmin"></th>
            <th class="text-center text-secondary opacity-7" v-if="isAdmin"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in questions" :key="item.id">
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
<!--            todo 收藏逻辑完善-->
            <td class="align-middle text-center" v-if="!isAdmin">
              <i class="far fa-star" :class="{ 'fas fa-star': item.isFavorited }" @click="handleFavoriteQuestion(item.id)"></i>
            </td>
            <td class="align-middle text-center" v-if="!isAdmin">
              <a href="javascript:" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="solve question" @click="goToAnswerPage(item.id)">答题</a>
            </td>
            <td class="align-middle text-center" v-if="isAdmin">
              <a @click="handleEdit(item.id)" href="javascript:" class="text-secondary font-weight-bold text-xs" data-original-title="Edit question" >编辑</a>
            </td>
            <td class="align-middle text-center" v-if="isAdmin">
            <a href="javascript:" class="text-danger font-weight-bold text-xs"
               data-toggle="tooltip" data-original-title="Delete question" @click="handleDeleteQuestion">Delete</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


