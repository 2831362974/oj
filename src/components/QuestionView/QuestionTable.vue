<script setup>
//TODO 1.从后端获取题目列表接口 2.数据命名根据数据库设计修改，下方template中的引用一并修改
import {computed, onMounted, ref} from 'vue';
import {useStore} from "vuex";
import axios from 'axios';
import {useRouter} from 'vue-router';
import QuestionSort from "@/components/QuestionView/QuestionSort.vue";
import QuestionFilter from "@/components/QuestionView/QuestionFilter.vue";
import QuestionSearch from "@/components/QuestionView/QuestionSearch.vue";
import ArgonButton from "@/components/ProfileView/ArgonButton.vue";
import QuestionAdd from "@/components/QuestionView/QuestionAdd.vue";
import QuestionEdit from "@/components/QuestionView/QuestionEdit.vue";

const router = useRouter();
const goToAnswerPage = (questionId) => {
  router.push({ name: 'Answer', params: { id: questionId } }); // 假设 'answer' 是做题界面路由的名称，根据实际路由配置修改
};
// 获取store实例
const store = useStore();
const isAdmin = computed(() => store.state.isAdmin);

// 响应式变量存储题目数据
const questions = ref([]);//原始数据
const filteredQuestions = ref([])//限定条件下的最终数据，也是要显示的数据

// 组件挂载时获取默认排序（按id从小到大）的题目列表数据
onMounted(() => {
  getSortedQuestions('id_asc');
});
// 向后端请求排序后的题目列表数据的方法
const getSortedQuestions = (sortOrder) => {
  axios.get(`http://127.0.0.1:5000/api/questions`,{
    params: {
      sortOrder: sortOrder // 将排序方式作为查询参数发送给后端
    }
  })
      .then((response) => {
        // 将后端返回的排序后数据赋值给 filteredQuestions 数组
        filteredQuestions.value = response.data;
      })
      .catch((error) => {
        console.error('获取题目列表数据出错：', error);
      });
};
// 处理排序方式改变的方法
const handleSortChange = (sortOrder) => {
  getSortedQuestions(sortOrder);
};

// 当前的搜索结果和筛选结果
const currentSearchResult = ref([]);
const currentFilterResult = ref([]);

// 监听搜索结果事件
const updateSearchResults = (searchResults) => {
  currentSearchResult.value = searchResults;
  updateFilteredQuestions();
};

// 监听筛选结果事件
const updateFilterResults = (filterResults) => {
  currentFilterResult.value = filterResults;
  updateFilteredQuestions();
};

// 更新最终显示的题目列表
const updateFilteredQuestions = () => {
  const searchResultSet = currentSearchResult.value.map((item) => item.id);
  const filterResultSet = currentFilterResult.value.map((item) => item.id);

  const finalResultIds = searchResultSet.length === 0
      ? filterResultSet
      : filterResultSet.length === 0
          ? searchResultSet
          : [...new Set(searchResultSet)].filter((id) => new Set(filterResultSet).has(id));

  filteredQuestions.value = questions.value.filter((question) =>
      finalResultIds.includes(question.id)
  );
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
//todo 收藏相关获取方式有待更改
// 用于存储当前用户的收藏题目id列表（这里简单示例为数组，可根据实际需求调整存储结构，比如使用Set等）
const favoritedQuestionIds = ref([]);
// 切换收藏状态并向后端发送请求的函数
const toggleFavorite = async (questionId) => {
  const isFavorited = favoritedQuestionIds.value.includes(questionId);
  if (isFavorited) {
    // 如果已收藏，取消收藏，从收藏列表移除id，并向后端发送取消收藏请求（这里假设后端接口为/api/unfavorite/{questionId}，需根据实际调整）
    favoritedQuestionIds.value = favoritedQuestionIds.value.filter(id => id!== questionId);
    try {
      await axios.delete(`http:127.0.0.1:5000/api/favorite/${questionId}`);
    } catch (error) {
      console.error('取消收藏请求出错：', error);
    }
  } else {
    // 如果未收藏，添加收藏，将id添加到收藏列表，并向后端发送添加收藏请求（这里假设后端接口为/api/favorite/{questionId}，需根据实际调整）
    favoritedQuestionIds.value.push(questionId);
    try {
      await axios.post(`http:127.0.0.1:5000/api/unfavorite/${questionId}`);
    } catch (error) {
      console.error('添加收藏请求出错：', error);
    }
  }
  // 更新题目列表中对应题目的收藏状态（这里假设filteredQuestions里的题目对象有isFavorited属性，后续可在获取题目数据时初始化好这个属性）
  filteredQuestions.value = filteredQuestions.value.map(question => {
    if (question.id === questionId) {
      question.isFavorited = !isFavorited;
    }
    return question;
  });
};
/*todo 很恶心的编辑弹窗,数据复杂，链接后端测试*/
const editedQuestion = ref({
  title: '',
  description: {
    content: '',
    limitTime: 0,
    limitMem: 0
  },
  level: 1,
  testCases: []
});  // 存储当前编辑的题目信息
// 点击编辑按钮时获取该题目的详细数据和评测用例
const handleEdit = async (questionId) => {
  try {
    const questionResponse = await axios.get(`http://127.0.0.1:5000/api/get-question/${questionId}`);
    const testCasesResponse = await axios.get(`http://127.0.0.1:5000/api/get-test-cases/${questionId}`);

    // 更新编辑数据
    editedQuestion.value = {
      ...questionResponse.data,
      testCases: testCasesResponse.data
    };

    // 打开编辑弹框
    const modal = new bootstrap.Modal(document.getElementById('editQuestionModal'));
    modal.show();
  } catch (error) {
    console.error('获取题目或评测用例数据失败:', error);
  }
};

// 提交编辑后的题目数据
const handleEditQuestion = async () => {
  try {
    const response = await axios.put(`http://127.0.0.1:5000/api/edit-question/${editedQuestion.value.id}`, editedQuestion.value);
    if (response.data.success) {
      console.log(response.data.message);
      // 提示编辑成功，并关闭模态框
      const modal = bootstrap.Modal.getInstance(document.getElementById('editQuestionModal'));
      modal.hide();
    } else {
      console.error(response.data.message);
    }
  } catch (error) {
    console.error('提交编辑失败：', error);
  }
};
//todo 删除题目的函数,非常正确
// 确认删除题目的函数
const confirmDeleteQuestion = (questionId) => {
  if (confirm('确定要删除该题目吗？')) {
    deleteQuestion(questionId);
  }
};
const deleteQuestion = async (questionId) => {
  try {
    await axios.delete(`http://127.0.0.1:5000/api/questions/${questionId}`);
    // 删除成功后刷新题目列表
    getSortedQuestions();
  } catch (error) {
    console.error('删除题目出错：', error);
  }
};

</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-3">
        <question-sort @sort-change="handleSortChange"></question-sort>
      </div>
      <div class="col-3">
        <question-filter @filter-result="updateFilterResults" :questions="questions"></question-filter>
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
            <td class="align-middle text-center" v-if="!isAdmin">
              <i class="far fa-star" :class="{ 'fas fa-star': item.isFavorited }" @click="toggleFavorite(item.id)"></i>
            </td>
            <td class="align-middle text-center" v-if="!isAdmin">
              <a href="javascript:" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="solve question" @click="goToAnswerPage(item.id)">答题</a>
            </td>
            <td class="align-middle text-center" v-if="isAdmin">
              <a @click="handleEdit(item)" href="javascript:" class="text-secondary font-weight-bold text-xs" data-bs-toggle="modal" data-bs-target="#editQuestionModal"
                  data-original-title="Edit question" >Edit</a>
            </td>
            <td class="align-middle text-center" v-if="isAdmin">
            <a href="javascript:" class="text-danger font-weight-bold text-xs"
               data-toggle="tooltip" data-original-title="Delete question" @click="confirmDeleteQuestion(item.id)">Delete</a>
            </td>
          </tr>
          </tbody>
        </table>
        <!-- 编辑弹窗 -->
        <div class="modal fade" id="editQuestionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editQuestionModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="editQuestionModalLabel">编辑题目</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label for="editQuestionTitle" class="form-label">题目名称</label>
                  <input type="text" class="form-control" id="editQuestionTitle" v-model="editedQuestion.title" placeholder="请输入题目名称">
                </div>
                <div class="mb-3">
                  <label for="editQuestionContent" class="form-label">题目内容</label>
                  <textarea class="form-control" id="editQuestionContent" rows="3" v-model="editedQuestion.description.content" placeholder="请输入题目内容"></textarea>
                </div>
                <div class="mb-3">
                  <label for="editQuestionLevel" class="form-label">题目难度</label>
                  <select class="form-select" id="editQuestionLevel" v-model="editedQuestion.level">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="editQuestionTimeLimit" class="form-label">题目时间限制</label>
                  <input type="number" class="form-control" id="editQuestionTimeLimit" v-model="editedQuestion.description.limitTime" placeholder="请输入时间限制">
                </div>
                <div class="mb-3">
                  <label for="editQuestionSpaceLimit" class="form-label">题目空间限制</label>
                  <input type="number" class="form-control" id="editQuestionSpaceLimit" v-model="editedQuestion.description.limitMem" placeholder="请输入空间限制">
                </div>

                <!-- 评测用例 -->
                <div class="mb-3">
                  <label class="form-label">评测用例</label>
                  <div v-for="(caseItem, index) in editedQuestion.testCases" :key="index" class="mb-2">
                    <div>
                      <label class="form-label">输入数据</label>
                      <textarea class="form-control" v-model="caseItem.case_in" placeholder="输入数据"></textarea>
                    </div>
                    <div>
                      <label class="form-label">输出数据</label>
                      <textarea class="form-control" v-model="caseItem.case_out" placeholder="输出数据"></textarea>
                    </div>
                    <div>
                      <label class="form-label">评测用例ID</label>
                      <input type="text" class="form-control" v-model="caseItem.case_id" placeholder="评测用例ID">
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" @click="handleEditQuestion">确认</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


