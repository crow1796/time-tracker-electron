import router from '@/router'
import Vue from 'vue'

const state = {
    isLoggedIn: false
}

const mutations = {
    USER_AUTH_STATUS (state, status) {
        state.isLoggedIn = status
    }
}

const getters = {
    isLoggedIn (state) {
        return state.isLoggedIn
    }
}

const actions = {
    loginUser (context, params) {
        Vue.http.post(`${API_URL}/api/v1/login`, params)
                .then((response) => {
                    if(response.data.status){
                        context.commit('USER_AUTH_STATUS', true)
                    }
                })
        if (router.currentRoute.query.redirect) {
            router.push(router.currentRoute.query.redirect)
            return true
        }
        router.push('/')
    },
    logoutUser (context, params) {
        context.commit('USER_AUTH_STATUS', false)
        router.push('/login')
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
