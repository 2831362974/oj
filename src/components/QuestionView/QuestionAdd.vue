<script setup>
//todo 题目管理-增
import axios from 'axios';
import { ref } from 'vue';

// 创建响应式对象来存储要添加的新题目信息
const newQuestion = ref({
  title: '',
  level: '',
  description: {
    content: '',
    limitTime: '',
    limitMem: ''
  }
});

// 验证表单是否填写完整的函数
const isFormValid = () => {
  return (
      newQuestion.value.title.trim()!== '' &&
      newQuestion.value.level!== '' &&
      newQuestion.value.description.content.trim()!== '' &&
      newQuestion.value.description.limitTime!== '' &&
      newQuestion.value.description.limitMem!== ''
  );
};

const handleAddQuestion = async () => {
  if (!isFormValid()) {
    alert('请填写完整题目信息后再提交！');
    return;
  }

  const newQuestionData = {
    // 这里先保留临时id生成方式，实际中如前面所说应由后端生成更合适的唯一标识
    id: Date.now(),
    ...newQuestion.value
  };

  try {
    // 这里的URL需替换成真实后端添加题目接口地址
    const response = await axios.post('http://127.0.0.1/api/questions2', newQuestionData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.data.success) {
      console.log(response.data.message);
      alert('题目添加成功！');
      // 清空表单数据，方便下次添加题目
      newQuestion.value = {
        title: '',
        level: '',
        description: {
          content: '',
          limitTime: '',
          limitMem: ''
        }
      };
    } else {
      console.error(response.data.message);
      alert('题目添加失败，请稍后再试！');
    }
  } catch (error) {
    console.error('添加题目请求出错：', error);
    alert('添加题目请求出现问题，请检查网络或联系管理员！');
  }
};
</script>
<template>
  <!-- Modal -->
  <div class="modal fade" id="addQuestionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addQuestionModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addQuestionModalLabel">增加题目</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="questionTitle" class="form-label">题目名称</label>
            <input type="text" class="form-control" id="questionTitle" placeholder="请输入题目名称" v-model="newQuestion.title">
          </div>
          <div class="mb-3">
            <label for="questionContent" class="form-label">题目内容</label>
            <textarea class="form-control" id="questionContent" rows="3" placeholder="请输入题目内容" v-model="newQuestion.description.content"></textarea>
          </div>
          <div class="mb-3">
            <label for="questionLevel" class="form-label">题目难度</label>
            <select class="form-select" id="questionLevel" v-model="newQuestion.level">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="questionTimeLimit" class="form-label">题目时间限制</label>
            <input type="number" class="form-control" id="questionTimeLimit" placeholder="请输入时间限制" v-model="newQuestion.description.limitTime">
          </div>
          <div class="mb-3">
            <label for="questionSpaceLimit" class="form-label">题目空间限制</label>
            <input type="number" class="form-control" id="questionSpaceLimit" placeholder="请输入空间限制" v-model="newQuestion.description.limitMem">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="handleAddQuestion">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>
