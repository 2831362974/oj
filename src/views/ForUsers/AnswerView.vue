<script setup>
//todo 1.向后端发送代码的post请求接口 从后端获取代码提交结果的逻辑
//todo 2.从后端获取评测用例信息的get
import DefaultInfoCard from "@/components/ForUsers/AnswerView/InfoCard.vue";
import CodeEditor from "@/components/ForUsers/AnswerView/CodeEditor.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import { useRoute } from 'vue-router';
const route = useRoute();
// 用于存储题目信息的响应式对象（示例信息）
const question = ref({
  title: '',
  description: {
    content:'',
    limitTime:'',
    limitMem:''
  },
  level: '',
});
const questionCase = ref({
  case_in:'',
  case_out:'',
  case_id:''
});
// 用于存储运行结果的响应式对象
const result = ref({
  description: ''
});
//todo 在组件挂载后获取题目信息
onMounted(() => {
  const question_id = route.params.id;
  console.log('获取到的题目id:', question_id); // 添加这行调试代码
  if (question_id) {
    axios.get(`http://127.0.0.1:5000/api/question/${question_id}`)
        .then((response) => {
          question.value = response.data;
        })
        .catch((error) => {
          console.error('获取题目信息出错：', error);
        });
    axios.get(`http://127.0.0.1:5000/api/question-case/${question_id}`)
        .then((response) => {
          questionCase.value = response.data;
        })
        .catch((error) => {
          console.error('获取用例信息出错：', error);
        });
  }
});
//下方监听子组件抛出的事件，获取到code数据
//todo 这是提交代码的接口，这个code数据应该是传入语言和代码 还有模拟的控制台输入 有改动则在子组件CodeEditor中修改
const handleRunCode = (code) => {
  // 向后台发送代码运行请求，这里假设后台接口接收一个code参数
  axios.post('后端运行代码的接口地址',  code )
      .then((response) => {
        result.value = response.data;
      })
      .catch((error) => {
        console.error('运行代码获取结果出错：', error);
      });
};
</script>
<template>
  <div class="py-4 container-fluid">
    <div class="row align-items-center">
      <div class="col-lg-8">
        <default-info-card title="题目描述" :description1="question.description.content" :description2="question.description.limitTime">
          <template v-slot:text1>
            <span>要求:</span>
          </template>
          <template v-slot:text2>
            <span>时空限制:</span>
          </template>
          </default-info-card>
      </div>
      <div class="col-lg-4">
        <default-info-card title="评测用例" :description1="questionCase.case_in" :description2="questionCase.case_out">
          <template v-slot:text1>
            <span>标准输入:</span>
          </template>
          <template v-slot:text2>
            <span>标准输出:</span>
          </template>
        </default-info-card>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-lg-8">
        <div class="code-input">
          <CodeEditor @runCode="handleRunCode"/>
        </div>
      </div>
      <div class="col-lg-4">
        <default-info-card  title="运行结果" :description="result.description"/>
      </div>
    </div>
  </div>
</template>