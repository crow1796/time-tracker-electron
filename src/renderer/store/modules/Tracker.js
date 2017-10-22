import router from '@/router'
import Vue from 'vue'
import _ from 'lodash'

const state = {
  teams: [],
  selectedTeam: null,
  projects: [],
  selectedProject: null,
  iterations: [],
  selectedIteration: null,
  pageLoading: true,
  contentLoading: true
}

const mutations = {
  INIT_TEAMS (state, teams) {
    state.teams = teams
  },
  SELECTED_TEAM (state, teamId) {
    if (teamId) localStorage.setItem('selectedTeam', teamId)
    state.selectedTeam = parseInt(teamId)
  },
  INIT_PROJECTS (state, projects) {
    state.projects = projects
  },
  SELECTED_PROJECT (state, projectId) {
    if (projectId) localStorage.setItem('selectedProject', projectId)
    state.selectedProject = parseInt(projectId)
  },
  INIT_ITERATIONS (state, iterations) {
    state.iterations = iterations
  },
  SELECTED_ITERATION (state, iteration) {
    if (iteration) localStorage.setItem('selectedIteration', iteration)
    state.selectedIteration = parseInt(iteration)
  },
  PAGE_LOADING (state, loading) {
    state.pageLoading = loading
  },
  CONTENT_LOADING (state, loading) {
    state.contentLoading = loading
  }
}

const getters = {
  getTeams (state) {
    return state.teams
  },
  getSelectedTeam (state) {
    return state.selectedTeam
  },
  getSelectedTeamIndex (state) {
    return _.findIndex(state.teams, {id: state.selectedTeam})
  },
  getProjects (state) {
    return state.projects
  },
  getSelectedProject (state) {
    return state.selectedProject
  },
  getIterations (state) {
    return state.iterations
  },
  getSelectedIteration (state) {
    return state.selectedIteration
  },
  getSelectedIterationIndex (state) {
    return _.indexOf(state.iterations, state.selectedIteration)
  },
  getSelectedProjectIndex (state) {
    return _.findIndex(state.projects, {id: state.selectedProject})
  },
  getPageLoading (state) {
    return state.pageLoading
  },
  getContentLoading (state) {
    return state.contentLoading
  }
}

const actions = {
    initMenus (context, params) {
        return Vue.http.get(`${API_URL}/api/v1/teams/all`)
            .then((response) => {
                let teams = response.data.teams
                context.commit('INIT_TEAMS', teams)
                let oldSelectedTeam = teams.length && localStorage.getItem('selectedTeam') && _.find(teams, {id: parseInt(localStorage.getItem('selectedTeam'))}) ? parseInt(localStorage.getItem('selectedTeam')) : (_.head(teams) ? _.head(teams).id : null)
                context.commit('SELECTED_TEAM', oldSelectedTeam)
                if(!oldSelectedTeam) return response
                context.dispatch('getProjectsOfSelectedTeam')
                    .then((response) => {
                        context.commit('PAGE_LOADING', false)
                        context.commit('CONTENT_LOADING', false)
                    })
                return response
            })
    },
    getProjectsOfSelectedTeam (context, params) {
        return Vue.http.get(`${API_URL}/api/v1/teams/${context.getters.getSelectedTeam}/projects`)
                    .then((response) => {
                      let projects = response.data.projects
                      context.commit('INIT_PROJECTS', projects)
                      let oldSelectedProject = projects.length && localStorage.getItem('selectedProject') && _.find(projects, {id: parseInt(localStorage.getItem('selectedProject'))}) ? parseInt(localStorage.getItem('selectedProject')) : (_.head(projects) ? _.head(projects).id : null)
                      context.commit('SELECTED_PROJECT', oldSelectedProject)
                      if(!oldSelectedProject) return response
                      context.dispatch('getIterationsFor', oldSelectedProject)

                      return response
                    })
    },
    createProject (context, params) {
        return Vue.http.post(`${API_URL}/api/v1/teams/${context.getters.getSelectedTeam}/projects/create`, params) 
                    .then((response) => {
                      let iterations = _.map(response.data.iterations, 'id')
                      context.commit('INIT_ITERATIONS', iterations)
                      let oldSelectedIteration = _.head(iterations)
                      context.commit('SELECTED_ITERATION', oldSelectedIteration)

                      return response
                  })
    },
    getIterationsFor(context, project){
        return Vue.http.get(`${API_URL}/api/v1/teams/${context.getters.getSelectedTeam}/projects/${project}/iterations/all`)
                    .then((response) => {
                        let iterations = _.map(response.data.iterations, 'id')
                        context.commit('INIT_ITERATIONS', iterations)
                        let oldSelectedIteration = _.head(iterations)
                        context.commit('SELECTED_ITERATION', oldSelectedIteration)
                        if(!oldSelectedIteration) return response
                        context.dispatch('getTasksForIteration', oldSelectedIteration)

                        return response
                    })
    },
    getTasksForIteration(context, iteration){
        return Vue.http.get(`${API_URL}/api/v1/teams/${context.getters.getSelectedTeam}/projects/${context.getters.getSelectedProject}/iterations/${iteration}/tasks/all`)
                .then((response) => {
                    console.log(response)
                })
    },
    createIterationForSelectedProject(context, params){
        context.commit('CONTENT_LOADING', true)
        return Vue.http.post(`${API_URL}/api/v1/teams/${context.getters.getSelectedTeam}/projects/${context.getters.getSelectedProject}/iterations/create`)
                    .then((response) => {
                        context.commit('CONTENT_LOADING', false)
                        let iterations = _.map(response.data.iterations, 'id')
                        context.commit('INIT_ITERATIONS', iterations)
                        let oldSelectedIteration = _.head(iterations)
                        context.commit('SELECTED_ITERATION', oldSelectedIteration)

                        router.replace(`/tracker/${context.getters.getSelectedTeam}/${context.getters.getSelectedProject}/${response.data.iteration.id}`)
                        return response
                    })
    },
    createTeam (context, iteration) {
        return Vue.http.post(`${API_URL}/api/v1/teams/create`, iteration)
    },
    changeIteration(context, params){
        context.commit('SELECTED_ITERATION', to)
        console.log('getTasks')
    }
}

export default {
  state,
  getters,
  mutations,
  actions
}
