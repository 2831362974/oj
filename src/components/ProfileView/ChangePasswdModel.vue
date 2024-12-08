<script setup>
//修改完成
import {changePassword} from "@/api/api.js";
import {ref} from "vue";
import {ElMessage} from "element-plus";
const dataForm=ref({
  currentPassword:'',
  newPassword:''
})

// 发送修改密码请求的函数
const handleConfirm = async () => {
  try {
    // 调用api.js中定义的changePassword接口函数（通过带拦截器的axios实例发送请求，自动添加Token）
    const response = await changePassword(dataForm.value);
    ElMessage.success(response.data);
  } catch (error) {
    console.error('请求出错：', error);
    ElMessage.success('密码修改失败，请检查输入信息或稍后重试');
  }
};
</script>

<template>
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
            <input type="password" class="form-control" v-model="dataForm.currentPassword" placeholder="请输入旧密码">
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">新密码</label>
            <input type="password" class="form-control" v-model="dataForm.newPassword" placeholder="请输入新密码">
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
