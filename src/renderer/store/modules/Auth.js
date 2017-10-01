import router from '@/router'
import store from '@/store'
import Vue from 'vue'

const state = {
  isLoggedIn: false,
  user: null
}

const mutations = {
  USER_AUTH_STATUS (state, status) {
    state.isLoggedIn = status
  },
  USER (state, user) {
    state.user = user
  }
}

const getters = {
  isLoggedIn (state) {
    return state.isLoggedIn
  },
  getUser (state) {
    return state.user
  }
}

const actions = {
  checkAuth (store) {
    let token = localStorage.getItem('jwtToken')
    if (!token) return false
    return Vue.http.get(`${API_URL}/api/v1/user`)
                    .then((response) => {
                        let data = response.data
                        if (response.status == 404) {
                            router.go('/login')
                        } else if (response.status == 401) {
                          console.log(data.refreshed_token)
                          if(data && data.refreshed_token) localStorage.setItem('jwtToken', data.refreshed_token)
                        } else if (data && data.token_expired) {
                            return store.dispatch('logoutUser')
                        }
                        if (data && data.user) {
                            store.commit('USER', data.user)
                            store.commit('USER_AUTH_STATUS', true)
                            return response
                        }
                    }, (error) => {
                        let data = error.data
                        let refreshedToken = data && data.refreshed_token ? data.refreshed_token : null 
                        if (!refreshedToken && error.status == 401) {
                            store.dispatch('logoutUser')
                            return false
                        }
                        // Auth Failed message here
                    })
  },
  loginUser (context, params) {
    return Vue.http.post(`${API_URL}/api/v1/login`, params)
  },
  logoutUser (context, params) {
    context.commit('PAGE_LOADING', true)
    localStorage.clear()
    context.commit('USER_AUTH_STATUS', false)
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
