<template>
	<div id="app">
		<detect-network offline-class="no-connection">
		    <div slot="offline">You are offline.</div>
		</detect-network>
		<div id="not-logged-in" v-if="!isLoggedIn">
			<button class="window-close-btn" @click="closeApp">
				<Icon type="close"></Icon>
			</button>
			<div class="container">
				<div class="columns">
					<div class="column is-half is-offset-one-quarter">
						<transition name="fade" mode="out-in">
							<router-view class="view" 
									keep-alive
									transition
									transition-mode="in-out">
							</router-view>
						</transition>
					</div>
				</div>
			</div>
		</div>
		<div id="logged-in" v-if="isLoggedIn">
			<div id="top-nav">
				<span class="hamburger-menu">
					<Icon type="android-menu"></Icon>
				</span>
				<span class="logo">
					<img src="static/images/logo.png" alt="Logo">
				</span>
			</div>
			<div class="tq-layout">
				<section class="teams-section">
					<ul class="teams-list">
						<li @click="selectTeam(team.id)" class="team" v-for="(team, index) in teams" :key="team.id" :class="{ '-active': (selectedTeam == team.id) }" v-if="index < 5">
							<Tooltip :content="team.name" placement="right">
								<span class="name">
									<i class="pe-7s-portfolio"></i>
								</span>
							</Tooltip>
						</li>
						<li class="team" @click="$refs.createTeamForm.open()" v-if="teams.length > 5">
							<Tooltip :content="`Show ${teams.length - 5} More`" placement="right">
								<span class="name">
									<i class="pe-7s-more"></i>
								</span>
							</Tooltip>
						</li>
						<li class="team -add" @click="$refs.createTeamForm.open()">
							<Tooltip content="Create New Team" placement="right">
								<span class="name">
									<Icon type="plus"></Icon>
								</span>
							</Tooltip>
						</li>
					</ul>
					<ul class="user-info teams-list" v-if="user">
						<li class="team -add">
							<Icon type="person"></Icon>
							<ul class="options">
								<li>
									<a>
										<i class="pe-7s-user pe-fw"></i>
										{{ user.name }}
									</a>
								</li>
								<li>
									<router-link to="/">
										<i class="pe-7s-bell pe-fw"></i>
										Notifications
									</router-link>
								</li>
								<li>
									<router-link to="/">
										<i class="pe-7s-tools pe-fw"></i>
										Account Settings
									</router-link>
								</li>
								<li>
									<a @click.prevent="logout">
										<i class="pe-7s-power pe-fw"></i>
										Logout
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</section>
				<section class="projects-section" v-show="showTeamProjects">
					<div class="projects _relative">
						<create-project-form ref="createProjectForm"></create-project-form>
						<div class="heading">
							<i class="pe-7s-refresh-2 pe-spin" v-if="projectsLoading"></i>
							Projects 
							<div class="controls">
								<Tooltip content="Create New Project" placement="bottom">
									<button type="button" class="tq-btn -xs -default" @click="$refs.createProjectForm.open()">
										<Icon type="ios-plus-outline"></Icon>
									</button>
								</Tooltip>

								<Tooltip content="Team Settings" placement="bottom">
									<button type="button" class="tq-btn -xs -default">
										<i class="pe-7s-config"></i>
									</button>
								</Tooltip>

								<Tooltip content="Close" placement="bottom">
									<button type="button" class="tq-btn -xs -default" @click="hideTeamProjects">
										<Icon type="android-close"></Icon>
									</button>
								</Tooltip>
							</div>
						</div>
						<div>
						</div>
						<div class="text-center project-filter">
							<input type="text" v-model="projectFilter" placeholder="Search for a Project..." icon="ios-search"/>
						</div>
						<ul class="projects-list">
							<li class="project" :key="project.id" :name="project.id" v-for="(project, index) in filteredProjects" :class="{ '-active': (project.id == selectedProject) }">
								<a @click.prevent="selectProject(project.id)">
									<i class="pe-7s-box1"></i>
									{{ project.title }}
								</a>
								<div class="controls">
									<tq-dropdown>
										<ul class="tq-dropdown-menu">
											<li @click="goToSettings">
												<i class="pe-7s-config pe-fw"></i>
												Settings
											</li>
										</ul>
									</tq-dropdown>
								</div>
							</li>
						</ul>
					</div>
					<div class="iterations _relative" v-if="selectedProject">
						<div class="heading">
							<i class="pe-7s-refresh-2 pe-spin" v-if="iterationsLoading"></i> 
							Iterations
						</div>
						<div>
						</div>
						<div class="text-center project-filter">
							<input type="text" v-model="iterationFilter" placeholder="Search for an Iteration..." icon="ios-search"/>
						</div>
						<ul class="iterations-list">
							<li class="iteration" :key="iteration.id" :name="iteration.id" v-for="(iteration, index) in filteredIterations" :class="{ '-active': (iteration.id == selectedIteration) }">
								<a @click.prevent="selectIteration(iteration.id)">
									<i class="pe-7s-box1"></i>
									{{ iteration.name }}
								</a>
								<div class="controls">
									<tq-dropdown>
										<ul class="tq-dropdown-menu">
											<li @click="$refs.iterationForm.open(iteration)">
												<i class="pe-7s-config pe-fw"></i>
												Settings
											</li>
											<li @click="goToSettings">
												<i class="pe-7s-trash pe-fw"></i>
												Delete
											</li>
										</ul>
									</tq-dropdown>
								</div>
							</li>
						</ul>
					</div>
				</section>
				<section class="content-section" :class="{ '-no-projects-section': !showTeamProjects }">
					<tq-spinner v-if="contentLoading"></tq-spinner>
					<transition name="fade" mode="out-in">
						<router-view class="view" 
								keep-alive
								transition
								transition-mode="in-out">
						</router-view>
					</transition>
				</section>
			</div>
		    <create-team-form ref="createTeamForm"></create-team-form>
			<iteration-form ref="iterationForm"></iteration-form>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import CreateProjectForm from '@/components/app-pages/Tracker/CreateProjectForm.vue'
import CreateTeamForm from '@/components/app-pages/Tracker/CreateTeamForm.vue'
import IterationForm from '@/components/app-pages/Tracker/IterationForm.vue'
import detectNetwork from 'v-offline'
import {ipcRenderer} from 'electron'
import {remote} from 'electron'
import TQSpinner from '@/components/TQSpinner.vue'
import TQDropdown from '@/components/TQDropdown.vue'
import VueAvatar from 'vue-avatar'

export default {
	name: 'my-project',
	components: {
		CreateProjectForm,
		CreateTeamForm,
		detectNetwork,
		IterationForm,
		VueAvatar,
		'tq-spinner': TQSpinner,
		'tq-dropdown': TQDropdown
	},
	created () {
		if(!this.isLoggedIn){
			this.$store.commit('PAGE_LOADING', false)
			this.$store.commit('CONTENT_LOADING', false)
		}
	},
	data () {
		return {
			spanLeft: 5,
			spanRight: 19,
			iteration: null,
			teamSearchVisible: false,
			iterationSearchVisible: false,
			globalQuery: null,
			projectFilter: null,
			iterationFilter: null
		}
	},
	computed: {
		...mapGetters({
			teams: 'getTeams',
			projects: 'getProjects',
			selectedTeam: 'getSelectedTeam',
			selectedProject: 'getSelectedProject',
			selectedIteration: 'getSelectedIteration',
			selectedTeamIndex: 'getSelectedTeamIndex',
			selectedProjectIndex: 'getSelectedProjectIndex',
			selectedIterationIndex: 'getSelectedIterationIndex',
			iterations: 'getIterations',
			isLoggedIn: 'isLoggedIn',
			pageLoading: 'getPageLoading',
			contentLoading: 'getContentLoading',
			projectsLoading: 'getProjectsLoading',
			iterationsLoading: 'getIterationsLoading',
			connectivity: 'getConnectivity',
			showTeamProjects: 'getShowTeamProjects',
			iconSize: (this.spanLeft === 5 ? 14 : 24),
			user: 'getUser'
		}),
		filteredProjects(){
			if(!this.projectFilter) return this.projects
			return _.filter(this.projects, (project) => project.title.toLowerCase().indexOf(this.projectFilter.toLowerCase()) > -1)
		},
		filteredIterations(){
			if(!this.iterationFilter) return this.iterations
			return _.filter(this.iterations, (iteration) => iteration.name.toLowerCase().indexOf(this.iterationFilter.toLowerCase()) > -1)
		}
	},
	methods: {
		connectionDetected (e) {
			this.$store.commit('CONNECTIVITY', e)
		},
		selectProject (project) {
			if(this.selectedProject == project) return false
			this.$router.replace(`/tracker/${this.selectedTeam}/${project}/${this.selectedIteration ? this.selectedIteration : '' }`)
		},
		selectTeam (team) {
			if(this.selectedTeam == team){
				this.$store.dispatch('showTeamProjects')
				return false
			}
			this.$router.replace(`/tracker/${team}/${this.selectedProject ? this.selectedProject : '' }/${this.selectedIteration ? this.selectedIteration : '' }`)
		},
		logout(){
			this.$store.dispatch('logoutUser')
		},
		selectIteration (iteration) {
			if(this.selectedIteration == iteration) return false
			this.$router.replace(`/tracker/${this.selectedTeam}/${this.selectedProject}/${iteration.id}`)
		},
		searchTeam (query) {
			this.$store.dispatch('queryTeam', query)
		},
		closeApp(){
			let currentWindow = remote.getCurrentWindow()
			currentWindow.close()
		},
		goToSettings(){
			this.$router.replace(`/tracker/${this.selectedTeam}/${this.selectedProject}/settings`)
		},
		hideTeamProjects(){
			this.$store.dispatch('hideTeamProjects')
		}
	},
	watch: {
		'$route.params.team' (to, from) {
			if (!to) return false
			this.$store.dispatch('getProjectsOf', to)
				.then((response) => {
					let projects = response.data.projects
					this.$store.commit('INIT_PROJECTS', projects)
					this.$store.dispatch('showTeamProjects')
					let oldSelectedProject = projects.length && localStorage.getItem('selectedProject') && _.find(projects, {id: parseInt(localStorage.getItem('selectedProject'))}) ? parseInt(localStorage.getItem('selectedProject')) : (_.head(projects) ? _.head(projects).id : null)
					this.$store.commit('SELECTED_PROJECT', oldSelectedProject)
					if(!oldSelectedProject) return response
					this.$router.replace(`/tracker/${to}/${oldSelectedProject}`)
				})
		},
		'$route.params.project' (to, from) {
			if (!to) return false
			this.$store.dispatch('getIterationsOf', to)
				.then((response) => {
					let iterations = response.data.iterations
					this.$store.commit('INIT_ITERATIONS', iterations)
					let oldSelectedIteration = _.head(iterations).id
					if(!oldSelectedIteration) return response
					this.$router.replace(`/tracker/${this.selectedTeam}/${to}/${oldSelectedIteration}`)
				})
		},
		'$route.params.iteration' (to, from) {
			if (!to) return false
			this.$store.dispatch('getTasksOf', {iteration: to})
		},
		'isLoggedIn'(to, from){
			if(to){
				ipcRenderer.send('resize-window', {
					width: 1248, 
					height: 580,
					resizable: true
				})
			}
			this.$store.dispatch('initMenus')
		}
	}
}
</script>

<style lang="scss" scoped>
	.layout{
		border: 1px solid #d7dde4;
		background: #f5f7f9;
		position: relative;
		border-radius: 4px;
		overflow: hidden;
	}
	.layout-breadcrumb{
		padding: 10px 15px 0;
	}
	.layout-content{
		min-height: 100vh;
		margin: 15px;
		overflow: hidden;
		background: #fff;
		border-radius: 4px;
		padding: 15px;
	}
	.layout-content-main{
		padding: 10px;
	}
	.layout-copy{
		text-align: center;
		padding: 10px 0 20px;
		color: #9ea7b4;
	}
	.layout-menu-left{
		background: #464c5b;
	}
	.layout-header{
		height: 60px;
		background: #fff;
		box-shadow: 0 1px 1px rgba(0,0,0,.1);

		.ivu-poptip.ivu-poptip-confirm{
			padding-left: 20px;
		}
	}
	.layout-logo-left{
		width: 90%;
		height: 30px;
		background: #5b6270;
		border-radius: 3px;
		margin: 15px auto;
	}
	.layout-ceiling-main a{
		color: #9ba7b5;
	}
	.layout-hide-text .layout-text{
		display: none;
	}
	.ivu-col{
		transition: width .2s ease-in-out;
	}
	.project-menu-add{
		.ivu-btn{
			border-radius: 0;
		}
	}

	.global-search .ivu-input-wrapper{
		line-height: initial;
	}

	.window-close-btn{
		position: absolute;
		right: 0;
		top: 0;
		font-size: 1.2em;
		width: 30px;
		height: 30px;
		text-align: center;
		vertical-align: middle;
		line-height: 30px;
		cursor: pointer;
		background-color: transparent;
		border: 0;
	}
</style>
