import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QuestionView from "../views/QuestionView.vue";
import AnswerView from "../views/ForUsers/AnswerView.vue";
import Profile from "../views/ProfileView.vue";
import Signup from "../views/Signup.vue";
import SignIn from "../views/Signin.vue";
import AdminView from "@/views/ForAdmin/AdminView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'home', component: HomeView,},
    {path: "/question", name: "Question", component: QuestionView,},
    {path: "/answer/:id", name: "Answer", component: AnswerView,},
    {path: "/profile", name: "Profile", component: Profile, meta: { requiresAuth: true }},
    {path: "/signIn", name: "SignIn", component: SignIn,},
    {path: "/signup", name: "Signup", component: Signup,},
    {path:"/admin", name: "Admin", component: AdminView,},
  ],
})
export default router
