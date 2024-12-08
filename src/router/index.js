import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QuestionView from "../views/QuestionView.vue";
import AnswerView from "../views/ForUsers/AnswerView.vue";
import Profile from "../views/ProfileView.vue";
import Signup from "../views/Signup.vue";
import SignIn from "../views/Signin.vue";
import AdminView from "@/views/ForAdmin/AdminView.vue";
import QuestionEditView from "@/views/ForAdmin/QuestionEditView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'home', component: HomeView,},
    {path: "/question", name: "question", component: QuestionView,},
    {path: '/questionEdit/:id', name: "questionEdit", component: QuestionEditView,},
    {path: "/answer/:id", name: "answer", component: AnswerView,},
    {path: "/profile", name: "profile", component: Profile},
    {path: "/signIn", name: "signIn", component: SignIn,},
    {path: "/signup", name: "signup", component: Signup,},
    {path:"/admin", name: "admin", component: AdminView,},
  ],
})
export default router
