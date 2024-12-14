<script setup>
import {computed, onMounted, ref} from 'vue';
import {useStore} from "vuex";
import {useRouter} from 'vue-router';
import {deleteQuestion, getQuestionBankData, fetchProblemRecord} from '@/api/api.js';
import {ElMessage,ElIcon, ElButton, ElTooltip} from "element-plus";
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import QuestionSearch from "@/components/QuestionView/QuestionSearch.vue";
import ArgonButton from "@/components/ProfileView/ArgonButton.vue";
import QuestionAdd from "@/components/QuestionView/QuestionAdd.vue";
import ArgonPagination from "@/components/All/ArgonPagination.vue";
import ArgonPaginationItem from "@/components/All/ArgonPaginationItem.vue";

const router = useRouter();
const goToAnswerPage = (problemId) => {
  router.push({name: 'answer', params: {id: problemId}}); // 假设 'answer' 是做题界面路由的名称，根据实际路由配置修改
};

const store = useStore();// 获取store实例
const isAdmin = computed(() => store.state.isAdmin);


// 添加当前排序字段的响应式数据，初始化为空表示未进行排序，可根据实际情况修改初始值
const sortField = ref('id');
// 添加排序方式的响应式数据，true表示升序，false表示降序，初始化为true
const sortAscending = ref(true);
// 点击图标进行排序的函数
const sortBy = (field) => {
  if (field === sortField.value) {
    // 如果点击的是当前已排序的字段，切换排序方式（升序变降序，降序变升序）
    sortAscending.value =!sortAscending.value;
  } else {
    // 如果点击的是其他字段，设置为升序排序，并更新排序字段
    sortAscending.value = true;
    sortField.value = field;
  }
  handleSort();
};
// 执行排序的方法
const handleSort = () => {
  if (sortField.value) {
    questions.value.sort((a, b) => {
      if (sortField.value === 'id') {
        return sortAscending.value? a.id - b.id : b.id - a.id;
      } else if (sortField.value === 'difficulty') {
        return sortAscending.value? a.difficulty - b.difficulty : b.difficulty - a.difficulty;
      }
      return 0;
    });
  }
};
const updateSearchResults = (searchKeyword) => {
  // 先将searchKeyword转换为字符串类型并去除两端空白字符，确保后续处理的规范性
  searchKeyword = String(searchKeyword).trim();
  if (!searchKeyword) {
    // 如果搜索框为空字符串（去除空白后），直接使用初始题目列表数据
    questions.value = [...initialQuestion.value];
  } else {
    // 使用更严谨的方式进行过滤，避免可能出现的类型问题
    questions.value = initialQuestion.value.filter(item => {
      const idMatch = String(item.id).includes(searchKeyword);
      const titleMatch = item.title.toLowerCase().includes(searchKeyword.toLowerCase());
      return idMatch || titleMatch;
    });
  }
  // 搜索结果更新后，重置当前页码为1，确保分页从第一页开始展示搜索结果
  currentPage.value = 1;
};
const currentPage = ref(1);// 当前页码，初始化为1
const pageSize = ref(8);// 每页显示的记录数量，设置为8
const visiblePageRange = ref(5);// 定义显示的页码数量范围（可根据实际情况调整），用于控制省略号的显示
const paginatedQuestions = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return questions.value.slice(startIndex, startIndex + pageSize.value);
});// 计算属性，获取当前页要展示的数据
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};// 监听分页组件的page-change事件，更新当前页码
const totalPages = computed(() => {
  return Math.ceil(questions.value.length / pageSize.value);
});// 计算总页数的计算属性
// 生成页码数组的函数，用于在分页导航中显示合适的页码和省略号
const getPageNumbers = () => {
  const pageNumbers = [];
  const halfRange = Math.floor(visiblePageRange.value / 2);

  // 如果总页数小于等于显示的页码范围，直接显示所有页码
  if (totalPages.value <= visiblePageRange.value) {
    for (let i = 1; i <= totalPages.value; i++) {
      pageNumbers.push(i);
    }
  } else {
    // 当前页在前半部分范围
    if (currentPage.value <= halfRange) {
      for (let i = 1; i <= visiblePageRange.value; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages.value);
    }
    // 当前页在后半部分范围
    else if (currentPage.value > totalPages.value - halfRange) {
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = totalPages.value - visiblePageRange.value + 1; i <= totalPages.value; i++) {
        pageNumbers.push(i);
      }
    }
    // 当前页在中间部分范围
    else {
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = currentPage.value - halfRange; i <= currentPage.value + halfRange; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages.value);
    }
  }
  return pageNumbers;
};

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
const handleEdit = (problemId) => {
  router.push({name: 'questionEdit', params: {id: problemId}});
}
//根据题目获取提交记录
onMounted(() => {
  getQuestions();
});

// 获取难度徽章的类名
const getDifficultyBadge = (difficulty) => {
  switch (difficulty) {
    case 1:
      return 'bg-gradient-success';
    case 2:
      return 'bg-gradient-success';
    case 3:
      return 'bg-gradient-warning';
    case 4:
      return 'bg-gradient-danger';
    case 5:
      return 'bg-gradient-danger';
    default:
      return 'bg-gradient-secondary';
  }
};
//获取答题记录
const currentProblemId = ref();
const visible = ref(false);
const problemRecords = ref([]);
const fetchProblemRecords = async (problemId) => {
  currentProblemId.value = problemId;  // 设置当前查看的用户名
  visible.value = true;
  try {
    const response = await fetchProblemRecord(problemId);
    problemRecords.value = response.data;
  } catch (e) {
    console.log('error', e);
    ElMessage.error('无法获取答题记录');
  }
}
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-8 px-6">
        <question-search @search-result="updateSearchResults" :questions="questions"></question-search>
      </div>
      <div class="col-4 text-center" v-if="isAdmin">
        <ArgonButton color="success" class="my-auto ms-5" data-bs-toggle="modal" data-bs-target="#addQuestionModal">
          增加题目
        </ArgonButton>
        <QuestionAdd/>
      </div>
    </div>

    <div class="card" style="height:530px;overflow: auto">
      <div class="card-header pb-0">
        <h6>题库</h6>
      </div>
      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
          <table class="table align-items-center mb-0">
            <thead>
            <tr>
              <!--            表头的内容由数据库设计决定-->
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">id
                <el-tooltip content="点击排序" placement="top">
                  <el-button type="text" @click="sortBy('id')">
                    <el-icon v-if="sortField === 'id' && sortAscending">
                      <ArrowUp />
                    </el-icon>
                    <el-icon v-else>
                      <ArrowDown />
                    </el-icon>
                  </el-button>
                </el-tooltip>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">title</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Difficulty
                <el-tooltip content="点击排序" placement="top">
                  <el-button type="text" @click="sortBy('difficulty')">
                    <el-icon v-if="sortField === 'difficulty' && sortAscending">
                      <ArrowUp />
                    </el-icon>
                    <el-icon v-else>
                      <ArrowDown />
                    </el-icon>
                  </el-button>
                </el-tooltip>
              </th>
              <!--            <th class="text-center text-secondary text-xxs font-weight-bolder opacity-7" v-if="!isAdmin">star</th>-->
              <th class="text-center text-secondary opacity-7" v-if="!isAdmin"></th>
              <th class="text-center text-secondary opacity-7" v-if="isAdmin"></th>
              <th class="text-center text-secondary opacity-7" v-if="isAdmin"></th>
              <th class="text-center text-secondary opacity-7" v-if="isAdmin"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in paginatedQuestions" :key="item.id">
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
                <span :class="['badge badge-sm', getDifficultyBadge(item.difficulty)]">{{ item.difficulty }}</span>
              </td>

              <!--            <td class="align-middle text-center" v-if="!isAdmin">
                            <i v-if="!item.isFavorited" class="far fa-star" @click="handleFavoriteQuestion(item.id)"></i>
                            <i v-else class="fas fa-star" @click="handleUnFavoriteQuestion(item.id)"></i>
                          </td>-->

              <td class="align-middle text-center" v-if="!isAdmin">
                <a href="javascript:" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip"
                   data-original-title="solve question" @click="goToAnswerPage(item.id)">答题</a>
              </td>
              <td class="align-middle text-center" v-if="isAdmin">
                <a @click="handleEdit(item.id)" href="javascript:" class="text-secondary font-weight-bold text-xs"
                   data-original-title="Edit question">编辑</a>
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
          <!-- 添加新的tr元素用于放置分页模块 -->
          <div class="pagination-row pt-3"
               style="height: 50px; display: flex; justify-content: center; align-items: center;">
            <argon-pagination @page-change="handlePageChange">
              <!-- 循环生成页码导航，根据getPageNumbers函数返回的数组 -->
              <argon-pagination-item v-for="pageNumber in getPageNumbers()" :key="pageNumber" :label="pageNumber"
                                     :active="pageNumber === currentPage"
                                     @click="handlePageChange(pageNumber)"/>
            </argon-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog title="答题记录" v-model="visible" width="50%">
    <p>当前查看题目: {{ currentProblemId }}</p>
    <ul>
      <li v-for="record in problemRecords" :key="record.submissionId">
        <p><span>提交id:</span> {{ record.submissionId }}</p>
        <p><span>提交结果:</span> {{ record.score }}</p>
      </li>
    </ul>
  </el-dialog>
</template>


