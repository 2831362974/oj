<script setup>
import {computed, onMounted, ref} from 'vue';
import {useStore} from "vuex";
import {useRouter} from 'vue-router';
import {deleteQuestion, star, getQuestionBankData, cancelStar, fetchProblemRecord} from '@/api/api.js';
import {ElMessage} from "element-plus";
import QuestionSort from "@/components/QuestionView/QuestionSort.vue";
import QuestionSearch from "@/components/QuestionView/QuestionSearch.vue";
import ArgonButton from "@/components/ProfileView/ArgonButton.vue";
import QuestionAdd from "@/components/QuestionView/QuestionAdd.vue";

const router = useRouter();
const goToAnswerPage = (problemId) => {
  router.push({ name: 'answer', params: { id: problemId } }); // 假设 'answer' 是做题界面路由的名称，根据实际路由配置修改
};
// 获取store实例
const store = useStore();
const isAdmin = computed(() => store.state.isAdmin);

const initialQuestion = ref([]);//存储初始题目列表数据
const questions = ref([]);//存储最终题目列表数据
// 请求题目列表数据的方法
const getQuestions = async () => {
    try {
      // 调用接口函数获取题库数据，并赋值给响应式数据
      const response = await getQuestionBankData();
      initialQuestion.value = response.data;
      questions.value = initialQuestion.value;
    } catch (e) {
      console.error('获取题库数据出现错误：', e);
    }
};

const updateSearchResults = (searchResults) => {
  questions.value = searchResults;
};

// 确认删除题目的函数
const handleDeleteQuestion = async (problemId) => {
  try {
    const confirmDelete = window.confirm('确定要删除该题目吗？');
    if (confirmDelete) {
      const response = await deleteQuestion(problemId);
        // 重新获取题目列表，此处假设你有获取题目列表的函数，比如 getQuestionList()
        await getQuestions();
        ElMessage.success(response.data);
    }
  } catch (e) {
    console.error('删除题目时出现错误：', e);
    ElMessage.success('删除题目出现异常，请稍后再试');
  }
};
//编辑
const handleEdit=(problemId)=>{
  router.push({ name: 'questionEdit', params: { id: problemId } });
}
//根据题目获取提交记录
onMounted(() => {
  getQuestions();
});
//收藏逻辑
const handleFavoriteQuestion = async (problemId) => {
  try {
    // 调用收藏题目 API
    await star(problemId);
    // 更新本地数据，将该题目标记为已收藏
    questions.value = questions.map((item) => {
      if (item.id === problemId) {
        item.isFavorited = true;
      }
      return item;
    });
  } catch (error) {
    console.error('收藏题目失败', error);
  }
};
const handleUnFavoriteQuestion = async (problemId) => {
  try {
    // 调用取消收藏题目 API
    await cancelStar(problemId);
    // 更新本地数据，将该题目标记为未收藏
    questions.value = questions.map((item) => {
      if (item.id === problemId) {
        item.isFavorited = false;
      }
      return item;
    });
  } catch (error) {
    console.error('取消收藏题目失败', error);
  }
};
// 获取难度徽章的类名
const getDifficultyBadge = (difficulty) => {
  switch (difficulty) {
    case 1: return 'bg-gradient-success';
    case 2: return 'bg-gradient-success';
    case 3: return 'bg-gradient-warning';
    case 4: return 'bg-gradient-danger';
    case 5: return 'bg-gradient-danger';
    default: return 'bg-gradient-secondary';
  }
};
//获取答题记录
const currentProblemId=ref();
const visible=ref(false);
const problemRecords=ref([]);
const fetchProblemRecords = async (problemId) => {
  currentProblemId.value = problemId;  // 设置当前查看的用户名
  visible.value = true;
  try {
    const response = await fetchProblemRecord(problemId);
    problemRecords.value = response.data; // 假设接口返回的数据就是答题记录数组
  } catch (e) {
    console.log('error',e);
    ElMessage.error('无法获取答题记录');
  }
}
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-2">
        <h6 class="text-center text-white">排序方式</h6>
      </div>
      <div class="col-3">
        <question-sort @sort-change="handleSortChange"></question-sort>
      </div>
      <div class="col-1">
        <h6 class="text-center text-white">搜索</h6>
      </div>
      <div class="col-4">
        <question-search @search-result="updateSearchResults" :questions="questions"></question-search>
      </div>
      <div class="col-2" v-if="isAdmin">
        <ArgonButton color="success" class="my-auto ms-5" data-bs-toggle="modal" data-bs-target="#addQuestionModal">增加题目</ArgonButton>
        <QuestionAdd />
      </div>
    </div>
  </div>
  <div class="card" style="height:500px;overflow: auto">
    <div class="card-header pb-0">
      <h6>题库</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
          <tr>
<!--            表头的内容由数据库设计决定-->
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">id</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">title</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Difficulty</th>
            <th class="text-center text-secondary text-xxs font-weight-bolder opacity-7" v-if="!isAdmin">star</th>
            <th class="text-center text-secondary opacity-7" v-if="!isAdmin"></th>
            <th class="text-center text-secondary opacity-7" v-if="isAdmin"></th>
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

            <td class="align-middle text-center text-sm">
              <span :class="['badge badge-sm', getDifficultyBadge(item.difficulty)]">{{ item.difficulty}}</span>
            </td>

            <td class="align-middle text-center" v-if="!isAdmin">
              <i v-if="!item.isFavorited" class="far fa-star" @click="handleFavoriteQuestion(item.id)"></i>
              <i v-else class="fas fa-star" @click="handleUnFavoriteQuestion(item.id)"></i>
            </td>

            <td class="align-middle text-center" v-if="!isAdmin">
              <a href="javascript:" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="solve question" @click="goToAnswerPage(item.id)">答题</a>
            </td>
            <td class="align-middle text-center" v-if="isAdmin">
              <a @click="handleEdit(item.id)" href="javascript:" class="text-secondary font-weight-bold text-xs" data-original-title="Edit question" >编辑</a>
            </td>
            <td class="align-middle text-center" v-if="isAdmin">
            <a href="javascript:" class="text-danger font-weight-bold text-xs"
               data-toggle="tooltip" data-original-title="Delete question" @click="handleDeleteQuestion(item.id)">Delete</a>
            </td>
            <td class="align-middle text-center" v-if="isAdmin">
              <a href="" class="text-success font-weight-bold text-xs" @click.prevent="fetchProblemRecords(item.id)">查看答题记录</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <el-dialog title="答题记录" v-model="visible" width="50%">
    <p>当前查看题目: {{ currentProblemId }}</p>
    <ul>
      <li v-for="record in problemRecords" :key="record.submissionId">
        <p><span>提交id:</span> {{ record.submissionId }}</p>
        <p><span>提交结果:</span> {{ record.result }}</p>
      </li>
    </ul>
  </el-dialog>
</template>


