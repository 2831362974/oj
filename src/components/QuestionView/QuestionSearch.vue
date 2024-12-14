<script setup>
import {ref,defineEmits} from 'vue';
import ArgonButton from "@/components/ProfileView/ArgonButton.vue";

const searchKeyword = ref('');  // 用于保存输入框的内容

const emit = defineEmits(['search-result']);
// 触发父组件的事件，将搜索关键字传递给父组件
const handleSearch = () => {
  const keyword = searchKeyword.value.trim();
  console.log('即将传递的搜索关键词:', keyword); // 添加调试信息，打印关键词
  // 定义自定义事件
  emit('search-result', keyword);
};
</script>
<template>
  <div class="input-group mb-3">
    <!-- 搜索输入框，移除@change事件绑定 -->
    <input
        type="text"
        class="form-control"
        placeholder="输入ID或标题进行搜索"
        v-model="searchKeyword"
    />
    <!-- 搜索按钮，保留@click事件绑定来触发handleSearch函数 -->
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
