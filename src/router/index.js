import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import store from "@/store";
const Login = () => import("@/views/Login.vue");
const Home = () => import("@/views/Home.vue");
const Activity = () => import("@/views/subviews/Activity.vue");
const Help = () => import("@/views/subviews/Help.vue");
const Review = () => import("@/views/subviews/Review.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  //history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/home/:id",
      name: "Home",
      component: Home,
      children: [
        {
          path: "activity",
          name: "activity",
          component: Activity,
          meta: {
            auth: ["校学生会", "学生会", "社团组织"],
          },
        },
        {
          path: "help",
          name: "help",
          component: Help,
          meta: {
            auth: ["校学生会", "学生会"],
          },
        },
        {
          path: "review",
          name: "review",
          component: Review,
          meta: {
            auth: ["校学生会"],
          },
        },
      ],
    },
  ]
})

router.beforeEach(async (to, from) => {
  if (
    // 检查用户是否已登录
    !store.state.loginUser?.id &&
    // ❗️ 避免无限重定向
    to.name !== "login"
  ) {
    // 将用户重定向到登录页面
    return { name: "login" };
  } else if (
    // 目标页面有权限列表
    to.meta?.auth &&
    // 当前用户的权限不在权限列表中
    !to.meta.auth.includes(store.state.loginUser.identity)
  ) {
    return { name: "login" };
  }
});

export default router
