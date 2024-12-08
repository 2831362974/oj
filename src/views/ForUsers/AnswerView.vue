<script setup>
import DefaultInfoCard from "@/components/ForUsers/AnswerView/InfoCard.vue";
import CodeEditor from "@/components/ForUsers/AnswerView/CodeEditor.vue";
import {onMounted, ref} from "vue";
import { useRoute } from 'vue-router';
import { getQuestionInfo, runCode } from '@/api/api.js';

const route = useRoute();
const problemId = route.params.id;
// 用于存储题目信息的响应式对象（示例信息）
const question = ref({
  id: null,
  title: '',
  description: '',
  maxCpuTime:'',
  maxMemory:'',
  difficulty:'',
});
// 在组件挂载后获取题目数据
onMounted(async () => {
  if (problemId) {
    try {
      const response = await getQuestionInfo(problemId);
      if (response) {
        question.value = response.data;
        // 获取该题目的评测用例数据
      }
    } catch (error) {
      console.error('请求出错:', error);
    }
  }
});

//todo 用于存储运行结果的响应式对象，对象数组
const result = ref([]
);
//todo 提交代码，code数据传入语言和代码，problemId 返回一个数组，是评测用例的结果
const handleRunCode = async (codeData) => {
  // 调用api.js中定义的提交代码接口函数
  try{
  const response=await runCode(codeData)
  result.value = response.data;
  alert(response.data);
  } catch(error){
    console.error('运行代码获取结果出错：', error);
  }
};
</script>
<template>
  <div class="py-4 container-fluid">
    <div class="row align-items-center">
      <div class="col-lg-8">
        <default-info-card title="题目描述" :description1="question.description">
          <template v-slot:text1>题目描述:  </template>
        </default-info-card>
      </div>
      <div class="col-lg-4" >
        <default-info-card title="时空要求" :description1="question.maxCpuTime" :description2="question.maxMemory" >
          <template v-slot:text1>
            <span>时间限制:</span>
          </template>
          <template v-slot:text2>
            <span>空间限制:</span>
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
        <default-info-card  title="运行结果" :description1="result.value"/>
      </div>
    </div>
  </div>
</template>