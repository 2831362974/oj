<script setup>
import { ref, onMounted } from 'vue';
import { VAceEditor }  from 'vue3-ace-editor';
import ace from 'ace-builds';

// 引入语言模式和主题（这里以JavaScript模式和monokai主题为例，可按需更改）
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-chrome';

// 编辑器内容的响应式数据
const content = ref('');
// 控制台输入框的响应式数据
const consoleInputValue = ref('');
// 默认语言模式为JavaScript
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
    consoleInput: consoleInputValue.value
  };
  emit('runCode', codeData);
};

// 提交代码的方法（这里只是占位，实际功能需根据需求实现）
const submitCode = () => {
  console.log('提交代码，当前语言：', languageMode.value, '，代码：', content.value);
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
      <!-- Bootstrap 5 表单输入模拟控制台 -->
      <div class="form-group mb-3 col-md-6">
        <label for="consoleInput">控制台输入</label>
        <input
            type="text"
            class="form-control"
            id="consoleInput"
            v-model="consoleInputValue"
        />
      </div>
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
    </div>


    <!-- 运行按钮和提交按钮 -->
    <div class="d-flex justify-content-center">
      <button
          type="button"
          class="btn btn-primary me-2"
          @click="runCode"
      >运行</button>
      <button
          type="button"
          class="btn btn-success"
          @click="submitCode"
      >提交</button>
    </div>
  </div>
</template>

<style scoped>

</style>