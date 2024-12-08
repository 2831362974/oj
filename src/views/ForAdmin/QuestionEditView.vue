<script setup>
//todo 获取题目/用例 提交修改题目/用例
import ArgonInput from "@/components/ProfileView/ArgonInput.vue";
import ArgonButton from "@/components/ProfileView/ArgonButton.vue";
import CaseAdd from "@/components/ForAdmin/QuestionEditView/CaseAdd.vue";
import {ref,onMounted} from 'vue';
import {useRoute,useRouter} from "vue-router";
import {getQuestionInfo, getQuestionCaseInfo, editQuestion, editTestCases, deleteQuestionCase} from '@/api/api.js';
import {ElMessage} from "element-plus";
import index from "vuex";

const route = useRoute();
const router = useRouter();
const problemId = route.params.id;

// 创建响应式对象来存储题目数据和评测用例数据
const editedQuestion = ref({
  id: null,
  title: '',
  description: '',
  maxCpuTime: 0,
  maxMemory: 0,
  difficulty: 1
});

const testCases=ref([
  {
    id: null,
    input:'',
    expectedOutput:'',
    problemId:null,
  }
]);


// 在组件挂载后获取题目数据和评测用例数据
onMounted(async () => {
  if (problemId) {
    try {
      const question = await getQuestionInfo(problemId);
      if (question) {
        editedQuestion.value = question.data;
        // 获取该题目的评测用例数据
        const caseData = await getQuestionCaseInfo(problemId);
        testCases.value = caseData.data;
      }
    } catch (error) {
      console.error('请求出错:', error);
    }
  }
});

// 处理编辑题目提交
const handleEditQuestion = async () => {
  try {
    const response = await editQuestion(problemId, editedQuestion.value);
    ElMessage.success(response.data);
    getQuestionInfo(problemId);
  } catch (error) {
    console.error('请求出错:', error);
    ElMessage.error('编辑有误');
  }
};

// 处理编辑评测用例提交
const handleEditTestCases = async (caseId,editTestCase) => {
  try {
    const response = await editTestCases(caseId, editTestCase);
    ElMessage.success(response.data);
    getQuestionInfo(problemId);
  } catch (error) {
    console.error('请求出错:', error);
    ElMessage.error('编辑有误');
  }
};
//删除评测用例
const handleDeleteCase = async (caseId) => {
  try {
    console.log(caseId);
    const response = await deleteQuestionCase(caseId);
    ElMessage.success(response.data);
    window.location.reload();
  } catch (error) {
    console.error('请求出错:', error);
    ElMessage.error('删除评测用例出现异常，请联系管理员');
  }
};
const back=()=>{
  router.push('/question');
}
</script>
<template>
  <main>
    <div class="container-fluid">
      <div
          class="page-header min-height-200"
          style="
          margin-right: -24px;
          margin-left: -34%;
        "
      >
        <span class="mask bg-gradient-success opacity-6"></span>
      </div>
      <div class="card shadow-lg mt-n6">
        <div class="card-body p-3">
          <div class="row gx-4">
            <div class="col-8 my-auto">
            <div class="h-100">
              <h5 class="mb-1">题目与用例编辑</h5>
            </div>
            </div>
            <div class="col-2 my-auto text-center">
              <argon-button color="success" size="sm" class="my-auto" data-bs-toggle="modal"
              data-bs-target="#addTestCaseModal" >增加题目用例</argon-button>
            </div>
            <case-add></case-add>
            <div class="col-2 my-auto text-center">
              <argon-button @click="back">返回题目列表</argon-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <p class="text-uppercase text-sm">题目信息</p>
              <div class="row">
                <div class="col-md-8">
                  <label for="example-text-input" class="form-control-label">标题</label>
                  <argon-input type="text" :value="editedQuestion.title" v-model="editedQuestion.title"/>
                </div>
                <div class="col-md-4">
                  <label for="example-text-input" class="form-control-label">难度</label>
                  <select class="form-select" aria-label="选择难度" v-model="editedQuestion.difficulty">
                    <option value="1">简单</option>
                    <option value="2">较简单</option>
                    <option value="3">中等</option>
                    <option value="4">较困难</option>
                    <option value="3">苦难</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <label for="example-text-input" class="form-control-label">描述</label>
                <argon-input type="text" :value="editedQuestion.description" v-model="editedQuestion.description"/>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">时间限制</label>
                  <argon-input type="text" :value="editedQuestion.maxCpuTime" v-model="editedQuestion.maxCpuTime"/>
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">空间限制</label>
                  <argon-input type="text" :value="editedQuestion.maxMemory" v-model="editedQuestion.maxMemory"/>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 text-center">
                  <argon-button @click="handleEditQuestion">提交修改</argon-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card"  v-for="testCase in testCases" :key="testCase.id">
            <div class="card-body">
              <p class="text-uppercase text-sm">用例信息</p>
              <div class="row">
                <h5 class="text-center">用例Id :{{testCase.id}}</h5>
              </div>
              <div class="row">
                <label for="example-text-input" class="form-control-label">输入</label>
                <argon-input type="text" :value="testCase.input" v-model="testCase.input"/>
              </div>
              <div class="row">
                <label for="example-text-input" class="form-control-label">输出</label>
                <argon-input type="text" :value="testCase.expectedOutput" v-model="testCase.expectedOutput"/>
              </div>
              <div class="row">
                <div class="col-6 text-center"><argon-button @click="handleEditTestCases(testCase.id,testCase)">提交修改</argon-button></div>
                <div class="col-6 text-center"><argon-button @click="handleDeleteCase(testCase.id)">删除用例</argon-button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
