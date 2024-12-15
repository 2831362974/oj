import { ref } from 'vue';
import axios from 'axios';
import { showLoading, hideLoading } from "../utils/loading";
// 创建axios实例，方便统一配置
const instance = axios.create({
/*    baseURL: 'http://47.98.100.224:8080/api', // 根据实际后端接口域名和基础路径修改*/
    baseURL: 'http://localhost:8080/api',
    timeout: 10000, // 设置请求超时时间
});

// 请求拦截器，统一添加token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        showLoading();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器（可自定义）
instance.interceptors.response.use(
    (response) => {
        // 响应拦截进来隐藏loading效果，此处采⽤延时处理是合并loading请求效果，避免多次请求loading关闭⼜开启
        setTimeout(() => {
            hideLoading();
        }, 200);
        console.log('response', response);
        // 可添加自定义的响应逻辑
        return response; // 直接返回接口数据

    },
    (error) => {
        // 响应拦截进来隐藏loading效果，此处采⽤延时处理是合并loading请求效果，避免多次请求loading关闭⼜开启

        setTimeout(() => {
            hideLoading();
        }, 200);
        // 全局错误处理
        console.log('error', error);
    }
);

export default instance;
