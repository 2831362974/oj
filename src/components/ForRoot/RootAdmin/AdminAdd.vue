<script setup>
// 导入新增管理员的接口函数
import {addAdminUser} from "@/api/api.js";
import { ref } from 'vue';

// 创建响应式对象来存储要添加的新管理员信息
const newAdmin = ref({
  username: '',
  password: ''
});

// 验证表单是否填写完整的函数
const isFormValid = () => {
  return (
      newAdmin.value.username!== '' &&
      newAdmin.value.password!== ''
  );
};

const handleAddAdmin = async () => {
  if (!isFormValid()) {
    ElMessage.success('请填写完整管理员信息后再提交！');
    return;
  }

  try {
    const response = await addAdminUser(newAdmin.value);
    ElMessage.success(response.data);
    // 清空表单数据，方便下次添加管理员
    newAdmin.value = {
      username: '',
      password: ''
    };
  } catch (error) {
    console.error('添加管理员请求出错：', error);
    ElMessage.success('添加管理员请求出现问题，请检查网络或联系管理员！');
  }
};
</script>
<template>
  <!-- Modal -->
  <div class="modal fade" id="addAdminModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addAdminModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addAdminModalLabel">增加管理员</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="adminUsername" class="form-label">管理员用户名</label>
            <input type="text" class="form-control" id="adminUsername" placeholder="请输入管理员用户名" v-model="newAdmin.username">
          </div>
          <div class="mb-3">
            <label for="adminPassword" class="form-label">管理员密码</label>
            <input type="password" class="form-control" id="adminPassword" placeholder="请输入管理员密码" v-model="newAdmin.password">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="handleAddAdmin">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>