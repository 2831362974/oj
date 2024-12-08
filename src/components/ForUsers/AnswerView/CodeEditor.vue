<script setup>
// todo 修改code数据格式
import {ref, onMounted} from 'vue';
import {VAceEditor} from 'vue3-ace-editor';
import ace from 'ace-builds';

// 引入语言模式和主题（这里以JavaScript模式和monokai主题为例，可按需更改）
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-chrome';

// 编辑器内容的响应式数据
const content = ref('');
// 默认语言模式为Java
const languageMode = ref('java');

// 编辑器配置选项
const editorOptions = ref({
  mode: languageMode.value, // 设置语言模式，可更改
  theme: 'chrome', // 设置主题，可更改
  fontSize: 16, // 设置字体大小等其他常用配置
  showPrintMargin: false,
});

// 获取编辑器实例的引用
const editorRef = ref(null);
editorRef.value = undefined;

// 更新编辑器语言模式的方法
const updateEditorLanguage = () => {
  editorOptions.value.mode = languageMode.value;
};
onMounted(() => {
  if (editorRef.value) {
    const editor = editorRef.value.editor;
    // 在这里可以进行更多针对ace编辑器实例的操作，比如添加自定义命令等

  }
});

const emit = defineEmits(['runCode']);
// 运行代码的方法 抛出事件runCode，父组件可调用数据
const runCode = () => {
  const codeData = {
    language: languageMode.value,
    code: content.value,

  };
  emit('runCode', codeData);
};

</script>

<template>
  <div>
    <v-ace-editor
        ref="editorRef"
        v-model:value="content"
        :options="editorOptions"
        style="height: 300px; border-radius: 16px;"
    />
    <div class="row">
      <!-- Bootstrap 5 下拉菜单 -->
      <div class="form-group mb-3 col-md-6">
        <label for="languageSelect">选择编程语言</label>
        <select
            class="form-select"
            id="languageSelect"
            v-model="languageMode"
            @change="updateEditorLanguage"
        >
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="c_cpp">Cpp</option>
        </select>
      </div>
      <div class="col-md-3 d-flex justify-content-center text-center mt-4">
          <button
              type="button"
              class="btn btn-success me-2"
              @click="runCode"
          >提交
          </button>
      </div>
      <div class="col-md-3 d-flex justify-content-center text-center mt-4">
        <button
            type="button"
            class="btn btn-success me-2"
            @click="handleStar"
        >收藏
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>