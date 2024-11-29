<script setup>
// 导入相关依赖
import axios from 'axios';
import { ref, defineProps, watch, onMounted } from 'vue';

// 接收父组件传递的题目ID
const props = defineProps({
  questionId: Number  // 父组件传递的题目ID
});

// 创建响应式对象来存储题目数据和评测用例数据
const editedQuestion = ref({
  id: null,
  title: '',
  description: {
    content: '',
    limitTime: 0,
    limitMem: 0
  },
  level: 1
});

const testCases = ref([
  {
    case_id: null,
    case_in: '',
    case_out: ''
  }
]);

// 在组件挂载后获取题目数据和评测用例数据
onMounted(async () => {
  if (props.questionId) {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/get-question/${props.questionId}`);
      const questionData = response.data;
      if (questionData) {
        editedQuestion.value = {
          id: questionData.id || null,
          title: questionData.title || '',
          description: questionData.description || { content: '', limitTime: 0, limitMem: 0 },
          level: questionData.level || 1
        };

        // 获取该题目的评测用例数据
        const caseResponse = await axios.get(`http://127.0.0.1:5000/api/get-test-cases/${props.questionId}`);
        testCases.value = caseResponse.data || [];
      }
    } catch (error) {
      console.error('请求出错:', error);
    }
  }
});

// 监听题目信息变化（如果父组件传递的ID变化）
watch(() => props.questionId, async (newId) => {
  if (newId) {
    // 刷新数据
    await fetchQuestionData(newId);
  }
});

// 获取题目数据和评测用例
const fetchQuestionData = async (id) => {
  try {
    const questionResponse = await axios.get(`http://127.0.0.1:5000/api/get-question/${id}`);
    const questionData = questionResponse.data;
    editedQuestion.value = {
      id: questionData.id || null,
      title: questionData.title || '',
      description: questionData.description || { content: '', limitTime: 0, limitMem: 0 },
      level: questionData.level || 1
    };xianz

    const caseResponse = await axios.get(`http://127.0.0.1:5000/api/get-test-cases/${id}`);
    testCases.value = caseResponse.data || [];
  } catch (error) {
    console.error('请求出错:', error);
  }
};

// 处理编辑题目提交
const handleEditQuestion = async () => {
  try {
    const response = await axios.put(`http://127.0.0.1:5000/api/edit-question/${editedQuestion.value.id}`, editedQuestion.value);
    if (response.data.success) {
      console.log(response.data.message);
      // 提交评测用例数据
      await handleEditTestCases();
    } else {
      console.error(response.data.message);
    }
  } catch (error) {
    console.error('请求出错:', error);
  }
};

// 处理编辑评测用例提交
const handleEditTestCases = async () => {
  try {
    const response = await axios.put(`http://127.0.0.1:5000/api/edit-test-cases/${editedQuestion.value.id}`, { testCases: testCases.value });
    if (response.data.success) {
      console.log('评测用例更新成功');
    } else {
      console.error('评测用例更新失败:', response.data.message);
    }
  } catch (error) {
    console.error('请求出错:', error);
  }
};
</script>

<template>
  <!-- Modal -->
  <div class="modal fade" id="editQuestionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editQuestionModalLabel">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editQuestionModalLabel">题目编辑</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- 题目基本信息 -->
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

          <!-- 评测用例编辑 -->
          <div class="mb-3">
            <label for="editTestCases" class="form-label">评测用例</label>
            <div v-for="(testCase, index) in testCases" :key="testCase.case_id" class="mb-3">
              <div class="input-group">
                <input type="text" class="form-control" v-model="testCase.case_in" placeholder="输入">
                <input type="text" class="form-control" v-model="testCase.case_out" placeholder="输出">
                <button type="button" class="btn btn-danger" @click="testCases.splice(index, 1)">删除</button>
              </div>
            </div>
            <button type="button" class="btn btn-secondary" @click="testCases.push({ case_id: null, case_in: '', case_out: '' })">添加评测用例</button>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="handleEditQuestion">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>
