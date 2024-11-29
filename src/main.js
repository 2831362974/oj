import store from "./store";
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import "./assets/bootstrap-icons/font/bootstrap-icons.css";
import ArgonDashboard from "./argon-dashboard";

const app = createApp(App)
app.use(store);
app.use(router);
app.use(ArgonDashboard);
app.mount('#app')
