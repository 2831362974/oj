<script setup>
//todo 排序功能让后端来做,做好接口沟通
import { ref } from 'vue';

// 响应式的用于存储用户选择的排序方式
const selectedSortOrder = ref('id_asc');

// 处理排序方式改变并发射自定义事件通知父组件的方法
const handleSortChange = () => {
  const emit = defineEmits(['sort-change']);
  emit('sort-change', selectedSortOrder.value);
};
</script>

<template>
  <div class="form-group">
    <select class="form-select" id="sortOrder" v-model="selectedSortOrder" @change="handleSortChange">
      <option value="id_asc">id-从小到大</option>
      <option value="id_desc">id-从大到小</option>
      <option value="difficulty_asc">由易到难</option>
      <option value="difficulty_desc">由难到易</option>
    </select>
  </div>
</template>

<style scoped>
</style>
