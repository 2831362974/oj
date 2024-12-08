import store from "./store";
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "@/assets/nucleo-icons/css/nucleo-icons.css";
import "@/assets/nucleo-icons/css/nucleo-svg.css";
import "./assets/fontawesome/css/all.min.css"
import "./assets/fontawesome/js/all.min.js"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import ArgonDashboard from "./argon-dashboard";
import Element from 'element-plus';
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(Element);
app.use(store);
app.use(router);
app.use(ArgonDashboard);
app.mount('#app')

