<script setup>
import { ref } from 'vue';

const emit = defineEmits(['filter-result']);
const props = defineProps({
  questions: {
    type: Array,
    required: true,
  },
});

const selectedDifficulty = ref('');

const handleFilter = () => {
  const filteredQuestions = selectedDifficulty.value
      ? props.questions.filter((question) => question.level === selectedDifficulty.value)
      : props.questions;
  emit('filter-result', filteredQuestions);
};
</script>

<template>
  <div class="container">
  <div class="row">
    <select class="form-select" id="difficultyFilter" v-model="selectedDifficulty" @change="handleFilter">
      <option value="">全部难度</option>
      <option value="1">简单</option>
      <option value="2">较简单</option>
      <option value="3">中等</option>
      <option value="4">较难</option>
      <option value="5">困难</option>
    </select>
  </div>
  </div>
</template>

<style scoped>

</style>