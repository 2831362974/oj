<script setup>
import { ref } from 'vue';
import ArgonButton from "@/components/ProfileView/ArgonButton.vue";

// 定义自定义事件
const emit = defineEmits(['search-result']);
// 接收父组件传递的属性
const props = defineProps({
  questions: {
    type: Array,
    required: true
  }
});

const searchKeyword = ref('');

const handleSearch = () => {
  const keyword = searchKeyword.value.trim().toLowerCase();
  let filteredQuestions;
  if (keyword === '') {
    // 当搜索关键词为空字符串时，直接返回全部题目（即props.questions）
    filteredQuestions = props.questions;
  } else {
    filteredQuestions = props.questions.filter((question) => {
      const idMatch = question.id.toString().toLowerCase().includes(keyword);
      const titleMatch = question.title.toLowerCase().includes(keyword);
      return idMatch || titleMatch;
    });
  }
  emit('search-result', filteredQuestions);
};
</script>
<template>
  <div class="input-group mb-3">
    <!-- 搜索输入框 -->
    <input
        type="text"
        class="form-control"
        placeholder="输入ID或标题进行搜索"
        v-model="searchKeyword"
        @change="handleSearch"
    />
    <!-- 搜索按钮 -->
    <ArgonButton
        color="success"
        size="sm"
        class="ms-auto"
        @click="handleSearch"
    >
      搜索
    </ArgonButton>
  </div>
</template>

<style scoped>

</style>