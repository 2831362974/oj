<script setup>
//todo 1.向后端发送修改的post接口 2.根据数据库设计修改v-model绑定的变量名称
import {ref, onMounted, computed} from 'vue';
import axios from 'axios';
import { useStore } from "vuex";

const store = useStore();
// 编辑后的题目数据副本
const editedQuestion = ref({});
const showProblemConfig=computed(()=>store.state.showProblemConfig);

// 保存题目修改的方法
const saveQuestion = () => {
  axios.post('后端保存题目修改的接口地址', editedQuestion.value)
      .then(() => {
        // 关闭弹窗
        const modal = document.getElementById('problemConfigModal');
        if (modal) {
          const bootstrapModal = new bootstrap.Modal(modal);
          bootstrapModal.hide();
        }
        // 这里可以添加成功提示或刷新题目列表等操作
        console.log('题目修改保存成功');
      })
      .catch((error) => {
        console.error('保存题目修改出错：', error);
      });
};
</script>

<template>
  <div class="modal fade" id="problemConfigModal" tabindex="-1" aria-labelledby="problemConfigModalLabel" v-if="showProblemConfig">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="problemConfigModalLabel">题目配置</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="editTitle">标题</label>
            <input type="text" class="form-control" id="editTitle" v-model="editedQuestion.title">
          </div>
          <div class="form-group">
            <label for="editDescription">描述</label>
            <textarea class="form-control" id="editContent" v-model="editedQuestion.content"></textarea>
          </div>
          <div class="form-group">
            <label for="editDescription">时间限制</label>
            <textarea class="form-control" id="editTime" v-model="editedQuestion.limitTime"></textarea>
          </div>
          <div class="form-group">
            <label for="editDescription">空间限制</label>
            <textarea class="form-control" id="editMem" v-model="editedQuestion.limitMem"></textarea>
          </div>
          <div class="form-group">
            <label for="editDifficulty">难度</label>
            <select class="form-select" id="editDifficulty" v-model="editedQuestion.level">
              <option value="1">简单</option>
              <option value="2">较简单</option>
              <option value="3">中等</option>
              <option value="4">较难</option>
              <option value="5">困难</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary" @click="saveQuestion">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>