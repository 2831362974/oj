<script setup>
//todo 修改密码结果提示弹窗
import {changePassword} from "@/api.js";

// 发送修改密码请求的函数
const handleConfirm = async () => {
  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  try {
    // 调用api.js中定义的changePassword接口函数（通过带拦截器的axios实例发送请求，自动添加Token）
    const result = await changePassword(oldPassword, newPassword);
    // 根据后端返回结果做相应处理，比如提示用户修改成功与否等
    console.log(result);
    alert('密码修改成功');
  } catch (error) {
    console.error('请求出错：', error);
    alert('密码修改失败，请检查输入信息或稍后重试');
  }
};
</script>

<template>
  <!-- Modal -->
  <div class="modal fade" id="changePasswd" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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