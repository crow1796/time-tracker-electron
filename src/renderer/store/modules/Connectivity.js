import router from '@/router'
import Vue from 'vue'
import _ from 'lodash'

const state = {
	connectivity: window.navigator.onLine
}

const getters = {
	getConnectivity(state){
		return state.connectivity
	}
}

const mutations = {
	CONNECTIVITY(state, status){
		state.connectivity = status
	}
}

export default {
  state,
  getters,
  mutations
}