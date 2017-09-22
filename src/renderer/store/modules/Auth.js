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

  checkAuth ({ commit }) {
        let token = localStorage.getItem('jwtToken')
        if (!token) return false
        return Vue.http.get(`${API_URL}/api/v1/user`)
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
