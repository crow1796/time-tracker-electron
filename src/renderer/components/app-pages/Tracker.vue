<script>
import TasksTable from './Tracker/TasksTable.vue'
import {mapGetters} from 'vuex'
import _ from 'lodash'
import CreateProjectForm from './Tracker/CreateProjectForm.vue'

export default {
	components: {
		TasksTable,
		CreateProjectForm
	},
	data () {
		return {
			createProjectModal: false
		}
	},
	computed: mapGetters({
		teams: 'getTeams',
		projects: 'getProjects',
		selectedTeam: 'getSelectedTeam',
		selectedProject: 'getSelectedProject',
		selectedTeamIndex: 'getSelectedTeamIndex',
		selectedProjectIndex: 'getSelectedProjectIndex'
	}),
	watch: {
		'$route.params.team'(to, from){
			if(!to) return false
			this.$store.commit('PAGE_LOADING', true)
			this.$store.commit('SELECTED_TEAM', to)
			this.$store.dispatch('getProjectsOfSelectedTeam')
			    .then((response) => {
			        this.$store.commit('PAGE_LOADING', false)
			    })
		},
		'$route.params.project'(to, from){
			if(!to) return false
			this.$store.commit('CONTENT_LOADING', true)
			this.$store.commit('SELECTED_PROJECT', to)
			this.$store.commit('CONTENT_LOADING', false)
		},
		'$route.params.iteration'(to, from){
			if(!to) return false
		}
	},
	methods: {
		createTask(){

		}
	}
}
</script>

<template>
	<div id="tasks">
		<div class="tasks">
		    <div class="tracker-filter-fields _no-padding" v-if="projects.length && selectedProject">
    		    <Poptip
    	            confirm
    	            title="Continue creating new Task?"
    	            @on-ok="createTask"
    	            ok-text="Yes"
    	            cancel-text="No"
    	            placement="right-start">
    	            <Button type="default" shape="circle" icon="ios-plus-outline">New Task</Button>
    	        </Poptip>
		    	<tasks-table></tasks-table>
		    </div>

		    <div v-if="!projects.length && !selectedProject">
            	<h1 class="text-center">You don't have any projects yet. <Button type="primary" shape="circle" size="small" icon="ios-plus-outline" @click="createProjectModal = true">Create New</Button></h1>
            	<create-project-form :modal-status="createProjectModal"></create-project-form>
		    </div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.tracker-filter-fields{
		padding: 15px 0;
		
		&.-right{
			text-align: right;
		}
	}

	._no-padding{
		padding: 0 !important;
	}

	._text-align{
		&.-left{
			text-align: left !important;
		}
	}

	.vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
</style>