import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home'
import Login from '@/components/pages/Login'
import Register from '@/components/pages/Register'
import ForgotPassword from '@/components/pages/ForgotPassword'
import Tracker from '@/components/app-pages/Tracker'
import Page404 from '@/components/pages/404'
import Middlewares from '@/middlewares'
import NProgress from 'nprogress'
import iView from 'iview'

Vue.use(Router)

const router = new Router({
  routes: [
        { path: '/login', component: Login, beforeEnter: Middlewares.redirectIfAuthenticated },
        { path: '/register', component: Register, beforeEnter: Middlewares.redirectIfAuthenticated },
        { path: '/forgot-password', component: ForgotPassword, beforeEnter: Middlewares.redirectIfAuthenticated },
    {
      path: '/tracker',
      component: Tracker,
      beforeEnter: Middlewares.redirectIfNotAuth,
      alias: '/',
      children: [
            { path: '/tracker/:team', component: Tracker },
            { path: '/tracker/:team/:project', component: Tracker },
            { path: '/tracker/:team/:project/:iteration', component: Tracker },
            { path: '/tracker/:team/:project/:iteration/:task', component: Tracker }
      ]
    },
        { path: '/404', component: Page404 },
        { path: '*', redirect: '/404' }
  ]
})

iView.LoadingBar.config({
  color: '#2d8cf0',
  failedColor: '#f0ad4e',
  height: 3
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish()
})

export default router
