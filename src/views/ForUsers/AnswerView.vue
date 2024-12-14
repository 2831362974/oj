<script setup>
import DefaultInfoCard from "@/components/ForUsers/AnswerView/InfoCard.vue";
import CodeEditor from "@/components/ForUsers/AnswerView/CodeEditor.vue";
import {onMounted, ref} from "vue";
import { useRoute } from 'vue-router';
import {cancelStar, getIsStar, getQuestionInfo, runCode, star} from '@/api/api.js';
import {ElMessage} from "element-plus";

const route = useRoute();
const problemId = route.params.id;
const isStar=ref(false)
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
      const response2 = await getIsStar(problemId);
      if (response) {
        question.value = response.data;
        isStar.value=response2.data;
        // 获取该题目的评测用例数据
      }
    } catch (error) {
      console.error('请求出错:', error);
    }
  }
});

//todo 用于存储运行结果的响应式对象，对象数组
const result = ref([]);
//todo 提交代码，code数据传入语言和代码，problemId 返回一个数组，是评测用例的结果
const handleRunCode = async (currentCode) => {
  // 调用api.js中定义的提交代码接口函数
  const codeData={
    code:currentCode.code,
    language:currentCode.language,
    problemId:problemId,
  }
  try{
  const response=await runCode(codeData)
  result.value = response.data;
  ElMessage.success('提交成功!')
  } catch(error){
    console.error('运行代码获取结果出错：', error);
  }
};
const handleStars = async ()=>{
  try{
    const response = await star(problemId);
    ElMessage.success(response.data);
    getIsStar(problemId);
  }
  catch(error){
    console.error('收藏出错：', error);
  }
}
const handleCancelStars = async ()=>{
  try{
    const response = await cancelStar(problemId);
    ElMessage.success(response.data);
    getIsStar(problemId);
  }
  catch(error){
    console.error('取消收藏出错：', error);
  }
}
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
          <CodeEditor :isStar="isStar" @runCode="handleRunCode" @handleStar="handleStars" @handleCancelStar="handleCancelStars"/>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card" style="height: 165px;overflow:auto;">
          <div class="p-3 mx-4 text-center card-header d-flex justify-content-center">
            <h5 class="mt-0 text-center">提交结果</h5>
          </div>
          <div class="p-3 pt-0 card-body">
            <p class="px-1 mt-2"><span class="text-start text-xl"><slot name="text1"/>得分:{{result.score }}</span></p>
            <div v-for="item in result.data" :key="item.test_case">
              <p class="px-1 mt-1"><span class="text-center text-xl"><slot name="text2"/>结果:{{ item.result }}</span></p>
              <p class="px-1 mt-1"><span class="text-center text-xl"><slot name="text2"/>时间{{ item.cpu_time }}</span></p>
              <p class="px-1 mt-1"><span class="text-center text-xl"><slot name="text2"/>{{ item.memory }}</span></p>
              <p class="px-1 mt-1"><span class="text-center text-xl"><slot name="text2"/>{{ item.test_case }}</span></p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>