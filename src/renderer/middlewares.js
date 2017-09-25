import store from '@/store'

export default {
    redirectIfNotAuth (to, from, next) {
        store.dispatch('checkAuth')
            .then((response) => {
                if (!store.getters.isLoggedIn) {
                    next({
                        path: '/login',
                        query: { redirect: to.fullPath }
                    })
                    return true
                }
            })
        next()
    },
    redirectIfAuthenticated (to, from, next) {
        store.dispatch('checkAuth')
            .then((response) => {
                if (store.getters.isLoggedIn) {
                  next({
                    path: '/'
                  })
                  return true
                }
            })
        next()
    }
}
