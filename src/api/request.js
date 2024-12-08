import { ref } from 'vue';
import axios from 'axios';

// 创建axios实例，方便统一配置
const instance = axios.create({
    baseURL: 'http://localhost:8080/api', // 根据实际后端接口域名和基础路径修改
    timeout: 10000, // 设置请求超时时间
});

// 请求拦截器，统一添加token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器（可自定义）
instance.interceptors.response.use(
    (response) => {
        console.log('response', response);
        // 可添加自定义的响应逻辑
        return response; // 直接返回接口数据

    },
    (error) => {
        // 全局错误处理
        console.log('error', error);

    }
);

export default instance;
