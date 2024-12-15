/**
 * 全局loading效果：合并多次loading请求，避免重复请求
 * 当调⽤⼀次showLoading，则次数+1；当次数为0时，则显⽰loading
 * 当调⽤⼀次hideLoading，则次数-1; 当次数为0时，则结束loading
 */
import { ElLoading } from "element-plus";
// 引入Element Plus的图标组件相关内容，用于加载动画中显示图标
import { ElIcon } from "element-plus";


// 初始化loading
let loadingInstance;
const showLoading = () => {
    // 全局实现loading效果，不⽤每个页⾯单独去v-loading
    // loading样式
    loadingInstance = ElLoading.service({
        lock: true,
        text: "Loading……",
        background: 'rgba(256,256,256, 0.3)',
        spinner: "el-icon-loading",
        color: '#FFFFFF'
    });
}
const hideLoading = () => {
        loadingInstance.close();
};
export { showLoading, hideLoading };