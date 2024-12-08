<script setup>
import { onMounted, ref } from 'vue';
import { fetchUserRecord } from "@/api/api.js";

// 接收父组件传递过来的用户名参数
const props = defineProps({
  username: String
});
const receivedUsername = ref(props.username); // 存储接收到的用户名，方便后续使用

// 存储答题记录的响应式数组
const userRecords = ref([
  {
    submissionId: null,
    result: null
  }
]);

// 定义获取答题记录数据的函数
const fetchUserRecords = async () => {
  try {
    const response = await fetchUserRecord(receivedUsername.value);
    userRecords.value = response.data; // 假设接口返回的数据就是答题记录数组
  } catch (error) {
    console.log(error);
  }
}

// 在组件挂载时调用接口获取答题记录数据
onMounted(() => {
  if (receivedUsername.value) {
    fetchUserRecords();
  }
});

</script>

<template>
    <p>当前查看用户: {{ receivedUsername }}</p>
    <ul>
      <li v-for="record in userRecords" :key="record.id">
        <p><span>提交id:</span> {{ record.submissionId }}</p>
        <p><span>提交得分:</span> {{ record.result }}</p>
      </li>
    </ul>
</template>

<style scoped>
/* 可以根据需要添加自定义样式 */
</style>
