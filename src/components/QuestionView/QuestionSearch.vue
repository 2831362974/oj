<script setup>
import { ref } from 'vue';
import ArgonButton from "@/components/ProfileView/ArgonButton.vue";

const emit = defineEmits(['search-result']);
const props = defineProps({
  questions: {
    type: Array,
    required: true,
  },
});

const searchKeyword = ref('');

const handleSearch = () => {
  const keyword = searchKeyword.value.trim().toLowerCase();
  const filteredQuestions = keyword
      ? props.questions.filter((question) => {
        const idMatch = question.id.toString().includes(keyword);
        const titleMatch = question.title.toLowerCase().includes(keyword);
        return idMatch || titleMatch;
      })
      : props.questions;
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