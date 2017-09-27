<template>
	<div id="app">
		<detect-network @detected-condition="connectionDetected">
			<div slot="offline">Your Offline Content!</div>
		</detect-network>
		<div id="not-logged-in" v-if="!isLoggedIn">
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
			<Spin fix v-if="pageLoading"></Spin>
			<div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
		        <Row type="flex">
		            <Col :span="spanLeft" class="layout-menu-left" v-if="selectedTeam">
		                <Menu :active-name="selectedProject" theme="dark" width="auto" @on-select="selectProject">
		                    <div class="layout-logo-left"></div>
                             <MenuGroup title="Projects">
                             	<MenuItem :key="project.id" :name="project.id" v-for="(project, index) in projects">
                             		<Icon type="document-text"></Icon>
                             		{{ project.title }}
                             	</MenuItem>
                             	<div class="text-center project-menu-add">
                             		<Button type="error" long @click="$refs.createProjectForm.open()">
                             			<Icon type="android-add"></Icon>
                             			Create Project
                             		</Button>
                             	</div>
                             </MenuGroup>
		                </Menu>
		            </Col>
		            <Col :span="selectedTeam ? spanRight : 24">
		                <div class="layout-header">
		                    <Menu mode="horizontal" theme="light" :active-name="selectedTeam" @on-select="headerMenuChanged">
                    		    <Row>
	                    		    <Col span="5" class-name="text-center">
	            		    		    <Button type="dashed" @click="$refs.createTeamForm.open()">Create Team</Button>
	                    		    </Col>
	                    		    <Col span="14">
	                    		    	<div class="global-search">
	                    		    		<AutoComplete
                    		    		        v-model="globalQuery"
                    		    		        icon="ios-search-strong"
                    		    		        placeholder="Search anything...">
                    		    		        <div class="searched-item">
                    		    		            
                    		    		        </div>
                    		    		    </AutoComplete>
	                    		    	</div>
	                    		    </Col>
		                            <Col span="5">
    		                            <Submenu name="2" v-if="user">
    		                                <template slot="title">
    		                                    <Icon type="android-person"></Icon>
    		                                    {{ user.name }}
    		                                </template>
    		                                <MenuItem name="account_settings">Settings</MenuItem>
    	                                    <MenuItem name="logout">Logout</MenuItem>
    		                            </Submenu>
		                            </Col>
                    		    </Row>
	                        </Menu>
		                </div>
		                <div class="layout-breadcrumb">
		                    <Breadcrumb>
		                        <BreadcrumbItem>
		                        	<BreadcrumbItem v-if="selectedTeam && teams[selectedTeamIndex]">
		                        		<Poptip v-model="teamSearchVisible" placement="bottom">
		                        			{{ teams[selectedTeamIndex] ? teams[selectedTeamIndex].name : '' }}
	                        		        <Icon type="arrow-down-b"></Icon>
	                        		        <div slot="title">
                        		        		<Row>
                    		        		        <Col span="12">
                    		        		        	<i>Teams</i>
                    		        		    	</Col>
                    		        		        <Col span="12" class-name="text-right">
	                    		        		        <Button size="small" icon="gear-b"></Button>
	                    		        		    </Col>
                    		        		    </Row>
	                        		        </div>
	                        		        <div slot="content">
	                            				<AutoComplete
	            					        	        @on-search="searchTeam"
	            					        	        @on-select="selectTeam"
	            					        	        placeholder="Select a Team"
	            					        	        icon="arrow-down-b">
    					        	                    <Option v-for="team in teams" :value="team.name" :key="team.id">
    					        	                        <span class="demo-auto-complete-title">{{ team.name }}</span>
    					        	                    </Option>
	            								</AutoComplete>
	                        		        </div>
	                        		    </Poptip>
		                        	</BreadcrumbItem>
		                        </BreadcrumbItem>
		                        <BreadcrumbItem v-if="selectedProject && projects[selectedProjectIndex]">
		                        	{{ selectedProject ? projects[selectedProjectIndex].title : '' }}
		                        	<router-link :to="`/tracker/${selectedTeam}/${selectedProject}/settings`">
		                        		<Icon type="gear-b"></Icon>
		                        	</router-link>
		                        </BreadcrumbItem>
		                        <BreadcrumbItem v-if="iteration && (selectedProject && projects[selectedProjectIndex])">
	                        		<Poptip v-model="iterationSearchVisible" placement="bottom">
	                        			{{ iteration }}
                        		        <Icon type="arrow-down-b"></Icon>
                        		        <div slot="title">
                    		        		<Row>
                		        		        <Col span="12">
                		        		        	<i>Sprints/Iterations</i>
                		        		    	</Col>
                		        		        <Col span="12" class-name="new-iteration-btn">
        				    		    		    <Poptip
        				    		    	            confirm
        				    		    	            title="Continue creating new Iteration?"
        				    		    	            @on-ok="createIteration"
        				    		    	            ok-text="Yes"
        				    		    	            cancel-text="No"
        				    		    	            placement="right">
		                		        		        <Button size="small" icon="gear-b"></Button>
        				    		    	            <Button type="error" size="small" icon="plus"></Button>
        				    		    	        </Poptip>
                    		        		    </Col>
                		        		    </Row>
                    		        	</div>
                        		        <div slot="content">
			                				<AutoComplete
			                						v-model="iteration"
								        	        :data="iterations"
								        	        @on-search="searchIteration"
								        	        @on-select="selectIteration"
								        	        placeholder="Search an Iteration"
								        	        icon="arrow-down-b">
											</AutoComplete>
                        		        </div>
                        		    </Poptip>
		                        </BreadcrumbItem>
		                    </Breadcrumb>
		                </div>
		                <div class="layout-content">
							<Spin fix v-if="contentLoading"></Spin>
		                    <transition name="fade" mode="out-in">
		                    	<router-view class="view" 
		                    			keep-alive
		                    			transition
		                    			transition-mode="in-out">
		                    	</router-view>
		                    	
		                    </transition>
		                </div>
		            </Col>
		        </Row>
		    </div>
		    <create-project-form ref="createProjectForm"></create-project-form>
		    <create-team-form ref="createTeamForm"></create-team-form>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import CreateProjectForm from '@/components/app-pages/Tracker/CreateProjectForm.vue'
import CreateTeamForm from '@/components/app-pages/Tracker/CreateTeamForm.vue'
import detectNetwork from 'v-offline';

export default {
	name: 'my-project',
	components: {
		CreateProjectForm,
		CreateTeamForm,
		detectNetwork
	},
	created () {
		this.$store.dispatch('initMenus')
				.then((response) => {
					this.iteration = _.head(this.iterations)
				})
	},
	data () {
		return {
			spanLeft: 5,
			spanRight: 19,
			iteration: null,
			teamSearchVisible: false,
			iterationSearchVisible: false,
			globalQuery: null
		}
	},
	computed: mapGetters({
		teams: 'getTeams',
		projects: 'getProjects',
		selectedTeam: 'getSelectedTeam',
		selectedProject: 'getSelectedProject',
		selectedTeamIndex: 'getSelectedTeamIndex',
		selectedProjectIndex: 'getSelectedProjectIndex',
		iterations: 'getIterations',
		isLoggedIn: 'isLoggedIn',
		pageLoading: 'getPageLoading',
		contentLoading: 'getContentLoading',
		connectivity: 'getConnectivity',
		iconSize: (this.spanLeft === 5 ? 14 : 24),
		user: 'getUser'
	}),
	methods: {
		connectionDetected(e){
			this.$store.commit('CONNECTIVITY', e)
		},
		selectProject (project) {
			this.$router.replace(`/tracker/${this.selectedTeam}/${project}`)
		},
		selectTeam (team) {
			team = _.find(this.teams, {name: team})
			team = team.id
			this.teamSearchVisible = false
			this.$router.replace(`/tracker/${team}`)
		},
		headerMenuChanged (e) {
			switch (e) {
				case 'logout':
					this.$store.dispatch('logoutUser')
					break
				case 'create_team':
					break
				case 'team_settings':
					break
				case 'account_settings':
					break
				case 'logout':
					break
				default:
					this.selectTeam(e)
					break
			}
		},
		searchIteration (query) {

		},
		selectIteration (iteration) {
			this.iterationSearchVisible = false
		},
		searchTeam (query) {

		},
		createIteration () {

		}
  },
  watch: {
	'$route.params.team' (to, from) {
		if (!to) return false
		this.$store.commit('PAGE_LOADING', true)
		this.$store.commit('SELECTED_TEAM', to)
		this.$store.dispatch('getProjectsOfSelectedTeam', to)
			.then((response) => {
				this.$store.commit('PAGE_LOADING', false)
			})
	},
	'$route.params.project' (to, from) {
		if (!to) return false
		this.$store.commit('CONTENT_LOADING', true)
		this.$store.commit('SELECTED_PROJECT', to)
		this.$store.commit('CONTENT_LOADING', false)
	},
	'$route.params.iteration' (to, from) {
		if (!to) return false
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
</style>
