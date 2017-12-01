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
	tasks: [],
	tasksCount: 0,
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
	UPDATE_ITERATION(state, params){
		let updateData = params.newIteration
		let oldIteration = _.findIndex(state.iterations, {id: params.iteration})
		state.iterations[oldIteration] = updateData
	},
	INIT_TASKS (state, tasks) {
		state.tasks = tasks
	},
	TASKS_COUNT (state, tasksCount) {
		state.tasksCount = tasksCount
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
		return _.findIndex(state.iterations, {id: state.selectedIteration})
	},
	getSelectedProjectIndex (state) {
		return _.findIndex(state.projects, {id: state.selectedProject})
	},
	getTasks (state) {
		return state.tasks
	},
	getTasksCount (state) {
		return state.tasksCount
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
		context.commit('CONTENT_LOADING', true)
		return Vue.http.get(`${API_URL}/api/v1/teams/all`)
				.then((response) => {
					if(!response.data.teams.length) {
						context.commit('PAGE_LOADING', false)
						context.commit('CONTENT_LOADING', false)
						return false
					}
					let teams = response.data.teams
					context.commit('INIT_TEAMS', teams)
					let oldSelectedTeam = teams.length && localStorage.getItem('selectedTeam') && _.find(teams, {id: parseInt(localStorage.getItem('selectedTeam'))}) ? parseInt(localStorage.getItem('selectedTeam')) : (_.head(teams) ? _.head(teams).id : null)
					context.commit('SELECTED_TEAM', oldSelectedTeam)

					return context.dispatch('getProjectsOf', oldSelectedTeam)
						.then((response) => {
							let projects = response.data.projects
							context.commit('INIT_PROJECTS', projects)
							let oldSelectedProject = projects.length && localStorage.getItem('selectedProject') && _.find(projects, {id: parseInt(localStorage.getItem('selectedProject'))}) ? parseInt(localStorage.getItem('selectedProject')) : (_.head(projects) ? _.head(projects).id : null)
							context.commit('SELECTED_PROJECT', oldSelectedProject)
							if(!oldSelectedProject) return response
							return context.dispatch('getIterationsOf', oldSelectedProject)
								.then((response) => {
									let iterations = response.data.iterations
									context.commit('INIT_ITERATIONS', iterations)
									let oldSelectedIteration = _.head(iterations).id
									if(!oldSelectedIteration) return response
									context.dispatch('getTasksOf', {iteration: oldSelectedIteration})
								})
						})
				})
	},
	getProjectsOf (context, params) {
		context.commit('PAGE_LOADING', true)
		context.commit('SELECTED_TEAM', params)
		context.commit('INIT_TASKS', [])
		return Vue.http.get(`${API_URL}/api/v1/teams/${context.getters.getSelectedTeam}/projects`)
				.then((response) => {
					if(!response.data.projects.length) {
						context.commit('PAGE_LOADING', false)
						context.commit('CONTENT_LOADING', false)
					}
					context.commit('PAGE_LOADING', false)
					return response
				})
	},
	createProject (context, params) {
		return Vue.http.post(`${API_URL}/api/v1/teams/${context.getters.getSelectedTeam}/projects/create`, params) 
					.then((response) => {
						return context.dispatch('initMenus')
							.then((res) => {
								context.commit('SELECTED_PROJECT', response.data.project.id)
								let iterations = response.data.iterations
								context.commit('INIT_ITERATIONS', iterations)
								let oldSelectedIteration = _.head(iterations).id
								context.commit('SELECTED_ITERATION', oldSelectedIteration)
								return res
							})
					})
	},
	getIterationsOf(context, project){
		context.commit('CONTENT_LOADING', true)
		context.commit('SELECTED_PROJECT', project)
		context.commit('INIT_TASKS', [])
		return Vue.http.get(`${API_URL}/api/v1/teams/${context.getters.getSelectedTeam}/projects/${project}/iterations/all`)
								.then((response) => {
									if(!response.data.iterations.length) {
										context.commit('PAGE_LOADING', false)
										context.commit('CONTENT_LOADING', false)
									}

									return response
								})
	},
	getTasksOf(context, params){
		context.commit('CONTENT_LOADING', true)
		context.commit('SELECTED_ITERATION', parseInt(params.iteration))
		context.commit('INIT_TASKS', [])
		if(!params.query){
			params.query = {
				limit: 5,
				page: 1
			}
		}
		return Vue.http.get(`${API_URL}/api/v1/teams/${context.getters.getSelectedTeam}/projects/${context.getters.getSelectedProject}/iterations/${params.iteration}/tasks/all?page=${params.query.page}&limit=${params.query.limit}`)
						.then((response) => {
							if(!response.data.tasks.length) {
								context.commit('PAGE_LOADING', false)
								context.commit('CONTENT_LOADING', false)
							}
							_.map(response.data.tasks, (task) => {
								task.timer = null
								task.timerModel = null
								task.selected = false
								task.checked = false
							})
							let tasks = response.data.tasks
							context.commit('INIT_TASKS', tasks)
							context.commit('TASKS_COUNT', response.data.total)
							context.commit('CONTENT_LOADING', false)
						})
	},
	refreshTasksList(context, params){
		return context.dispatch('getTasksOf', {iteration: context.getters.getSelectedIteration})
	},
	createIterationForSelectedProject(context, params){
		return Vue.http.post(`${API_URL}/api/v1/teams/${context.getters.getSelectedTeam}/projects/${context.getters.getSelectedProject}/iterations/create`, params)
			.then((response) => {
				let iterations = response.data.iterations
				context.commit('INIT_ITERATIONS', iterations)
				return response
			})
	},
	updateIterationForSelectedProject(context, params){
		return Vue.http.post(`${API_URL}/api/v1/teams/${context.getters.getSelectedTeam}/projects/${context.getters.getSelectedProject}/iterations/update`, params)
			.then((response) => {
				let iterations = response.data.iterations
				context.commit('INIT_ITERATIONS', iterations)
				return response
			})
	},
	createTeam (context, iteration) {
		return Vue.http.post(`${API_URL}/api/v1/teams/create`, iteration)
	},
	createNewTask(context, params){
		context.commit('CONTENT_LOADING', true)
		return Vue.http.post(`${API_URL}/api/v1/teams/${context.getters.getSelectedTeam}/projects/${context.getters.getSelectedProject}/iterations/${context.getters.getSelectedIteration}/tasks/store`, params)
	},
	updateTask(context, task){
		return Vue.http.post(`${API_URL}/api/v1/teams/${context.getters.getSelectedTeam}/projects/${context.getters.getSelectedProject}/iterations/${context.getters.getSelectedIteration}/tasks/update`, task)
	},
	queryTeam(context, query){
		return Vue.http.get(`${API_URL}/api/v1/teams/all`, { params: query })
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
