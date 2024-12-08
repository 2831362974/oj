// 引入封装好的 axios 实例
import instance from './request';

/**
 * 通用的请求函数封装
 * @param {Object} options 请求配置，包含 method, url, data, params 等
 * @returns {Promise} 返回一个 Promise，解析为接口响应数据
 */
const http = (options) => {
    const { method = 'get', url, data = {}, params = {} } = options;

    return instance({
        method,
        url,
        data,
        params,
    });
};

/**
 * 常用 HTTP 方法的封装
 */

// GET 请求
http.get = (url, params = {}) => {
    return instance({
        method: 'get',
        url,
        params,
    });
};

// POST 请求
http.post = (url, data = {}) => {
    console.log(data);
    return instance({
        method: 'post',
        url,
        data,
    });
};

// PUT 请求
http.put = (url, data = {}) => {
    return instance({
        method: 'put',
        url,
        data,
    });
};

// DELETE 请求
http.delete = (url, params = {}) => {
    return instance({
        method: 'delete',
        url,
        params,
    });
};

export default http;
