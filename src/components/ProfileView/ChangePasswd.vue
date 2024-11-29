<script setup>
//todo 修改密码接口 结果提示弹窗
import axios from 'axios';
import { ref } from 'vue';

// 这里模拟发送请求的函数，实际中要替换成真实的axios等请求库调用后端接口的逻辑
const handleConfirm = async () => {
  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  try {
    // 使用axios发送POST请求，这里的URL需替换成真实后端接口地址
    const response = await axios.post('修改密码的地址', {
      oldPassword: oldPassword,
      newPassword: newPassword
    });
    // 根据后端返回结果做相应处理，比如提示用户修改成功与否等
    console.log(response.data);
  } catch (error) {
    console.error('请求出错：', error);
    // 可以在这里添加更友好的错误提示逻辑，比如给用户弹出提示框告知请求失败等
  }
};
</script>

<template>
  <!-- Modal -->
  <div class="modal fade" id="changepasswd" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">修改密码</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="oldPassword" class="form-label">旧密码</label>
            <input type="password" class="form-control" id="oldPassword" placeholder="请输入旧密码">
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">新密码</label>
            <input type="password" class="form-control" id="newPassword" placeholder="请输入新密码">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="handleConfirm">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* 可以自定义样式 */
</style>