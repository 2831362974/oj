import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QuestionView from "../views/QuestionView.vue";
import AnswerView from "../views/ForUsers/AnswerView.vue";
import Profile from "../views/ProfileView.vue";
import SignUp from "../views/Signup.vue";
import SignIn from "../views/Signin.vue";
import AdminView from "@/views/ForAdmin/AdminView.vue";
import QuestionEditView from "@/views/ForAdmin/QuestionEditView.vue";
import RootAdminView from "@/views/ForRoot/RootAdminView.vue";
import RootLogin from "@/views/ForRoot/RootLogin.vue";
import MyRecordView from "@/views/ForUsers/MyRecordView.vue";
import StatisticView from "@/views/ForRoot/StatisticView.vue";
import Reset from "@/views/Reset.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'home', component: HomeView,},
    {path: "/question", name: "question", component: QuestionView,},
    {path: '/questionEdit/:id', name: "questionEdit", component: QuestionEditView,},
    {path: "/question/:id", name: "answer", component: AnswerView,},
    {path: "/profile", name: "profile", component: Profile},
    {path:"/record",name:"record",component:MyRecordView},
    {path:"/statistic", name:"statistic",component:StatisticView},
    {path: "/signIn", name: "signIn", component: SignIn,},
    {path: "/signUp", name: "signUp", component: SignUp,},
    {path:"/reset", name: "reset", component: Reset,},
    {path:"/admin", name: "admin", component: AdminView,},
    {path:"/admin/root", name: "rootAdmin", component: RootAdminView,},
    {path:"/signIn/root",name:"sysAdmin", component: RootLogin,}
  ],
})
export default router
