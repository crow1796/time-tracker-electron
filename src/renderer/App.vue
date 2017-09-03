<template>
	<div id="app">
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
		            <Col :span="spanLeft" class="layout-menu-left">
		                <Menu :active-name="selectedProject" theme="dark" width="auto" @on-select="selectProject">
		                    <div class="layout-logo-left"></div>
                             <MenuGroup title="Projects">
                             	<MenuItem :key="project.id" :name="project.id" v-for="(project, index) in projects">
                             		<Icon type="document-text"></Icon>
                             		{{ project.title }}
                             	</MenuItem>
                             </MenuGroup>
		                </Menu>
		            </Col>
		            <Col :span="spanRight">
		                <div class="layout-header">
		                    <Menu mode="horizontal" theme="light" :active-name="selectedTeam" @on-select="headerMenuChanged">
	                            <Submenu name="1">
	                                <template slot="title">
	                                    <Icon type="home"></Icon>
	                                    {{ selectedTeam ? teams[selectedTeamIndex].name : '' }}
	                                </template>
	                                <MenuGroup title="Teams">
	                                    <MenuItem :name="team.id" :key="team.id" v-for="(team, index) in teams">{{ team.name }}</MenuItem>
	                                </MenuGroup>
	                                <MenuGroup title="Options">
	                                    <MenuItem name="create_team">Create New Team</MenuItem>
	                                    <MenuItem name="team_settings">Settings</MenuItem>
	                                </MenuGroup>
	                            </Submenu>
	                            <Submenu name="2">
	                                <template slot="title">
	                                    <Icon type="android-person"></Icon>
	                                    Joshua Tundag
	                                </template>
	                                <MenuItem name="account_settings">Settings</MenuItem>
                                    <MenuItem name="logout">Logout</MenuItem>
	                            </Submenu>
                        	    <Poptip
                                    confirm
                                    title="Continue creating new Iteration?"
                                    @on-ok="createIteration"
                                    ok-text="Yes"
                                    cancel-text="No"
                                    placement="bottom">
                                    <Button type="default" shape="circle" icon="ios-plus-outline">New Iteration</Button>
                                </Poptip>
	                        </Menu>
		                </div>
		                <div class="layout-breadcrumb">
		                    <Breadcrumb>
		                        <BreadcrumbItem href="">{{ teams[selectedTeamIndex] ? teams[selectedTeamIndex].name : '' }}</BreadcrumbItem>
		                        <BreadcrumbItem>
                    				<AutoComplete
    					        	        v-model="iteration"
    					        	        :data="iterations"
    					        	        @on-search="searchIteration"
    					        	        placeholder="Search an Iteration"
    					        	        icon="arrow-down-b"
    					        	        style="width: 75px;">
    								</AutoComplete>
		                        </BreadcrumbItem>
		                        <BreadcrumbItem v-if="selectedProject">{{ selectedProject ? projects[selectedProjectIndex].title : '' }}</BreadcrumbItem>
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
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
	name: 'my-project',
	created(){
		this.$store.dispatch('initMenus')
			.then((response) => {
				this.iteration = _.last(this.iterations)
			})
	},
	data(){
		return {
			spanLeft: 5,
            spanRight: 19,
            iteration: null
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
		iconSize: (this.spanLeft === 5 ? 14 : 24)
	}),
	methods: {
		selectProject(project){
			this.$router.replace(`/tracker/${this.selectedTeam}/${project}`)
		},
		selectTeam(team){
			this.$router.replace(`/tracker/${team}`)
		},
		headerMenuChanged(e){
			switch(e){
				case 'logout':
					this.$store.dispatch('logoutUser')
				break;
				case 'create_team':
				break;
				case 'team_settings':
				break;
				case 'account_settings':
				break;
				case 'logout':
				break;
				default:
					this.selectTeam(e)
				break;
			}
		},
		searchIteration(query){
			
		},
		createIteration(){

		}
	}
}
</script>

<style>
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
</style>
