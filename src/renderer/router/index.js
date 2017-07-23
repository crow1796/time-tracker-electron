import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home'
import Login from '@/components/pages/Login'
import Register from '@/components/pages/Register'
import ForgotPassword from '@/components/pages/ForgotPassword'
import Tasks from '@/components/app-pages/Tasks'
import Projects from '@/components/app-pages/Projects'
import Team from '@/components/app-pages/Team'
import Page404 from '@/components/pages/404'
import Middlewares from '@/middlewares'
import NProgress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [
        { path: '/', component: Home, beforeEnter: Middlewares.redirectIfNotAuth },
        { path: '/login', component: Login, beforeEnter: Middlewares.redirectIfAuthenticated },
        { path: '/register', component: Register, beforeEnter: Middlewares.redirectIfAuthenticated },
        { path: '/forgot-password', component: ForgotPassword, beforeEnter: Middlewares.redirectIfAuthenticated },
    {
      path: '/tasks',
      component: Tasks,
      beforeEnter: Middlewares.redirectIfNotAuth,
      children: [
                { path: '/tasks/:task', component: Tasks }
      ]
    },
        { path: '/projects', component: Projects, beforeEnter: Middlewares.redirectIfNotAuth },
        { path: '/team', component: Team, beforeEnter: Middlewares.redirectIfNotAuth },
        { path: '/404', component: Page404 },
        { path: '*', redirect: '/404' }
  ]
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach((to, from) => {
  NProgress.done()
})

export default router
