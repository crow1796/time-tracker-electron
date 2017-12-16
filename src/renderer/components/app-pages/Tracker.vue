<script>
import TasksList from '@/components/app-pages/Tracker/TasksList.vue'
import {mapGetters} from 'vuex'
import _ from 'lodash'
import CreateProjectForm from '@/components/app-pages/Tracker/CreateProjectForm.vue'
import IterationForm from '@/components/app-pages/Tracker/IterationForm.vue'
import TaskForm from '@/components/app-pages/Tracker/TaskForm.vue'

export default {
    components: {
        TasksList,
        CreateProjectForm,
        IterationForm,
        TaskForm
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
        selectedIteration: 'getSelectedIteration',
        selectedTeamIndex: 'getSelectedTeamIndex',
        selectedProjectIndex: 'getSelectedProjectIndex'
    }),
    methods: {
		createNewTask(){
			this.$store.dispatch('createNewTask')
				.then((response) => {
					if(response.data.task){
						this.$store.dispatch('refreshTasksList')
							.then((res) => {
								this.$refs.taskForm.open(response.data.task)
							})
					}
				})
		},
		editTask(task){
			this.$refs.taskForm.open(task)
		}
    }
}
</script>

<template>
	<div id="tasks">
		<div class="tasks">
		    <div class="tracker-filter-fields _no-padding" v-if="projects.length && selectedProject">
    		    <div class="text-left">
                    <button class="tq-btn -md -warning" type="button" @click="createNewTask">New Task</button>
                </div>
		    	<tasks-list ref="tasksList" @selected="editTask"></tasks-list>
				<iteration-form ref="createIterationForm"></iteration-form>
            	<task-form ref="taskForm"></task-form>
		    </div>

		    <div v-if="!teams.length">
            	<h1 class="text-center">
					You don't have any team yet.
                </h1>
		    </div>

		    <div v-if="!projects.length && teams.length">
            	<h1 class="text-center">
					You don't have any project yet.
                </h1>
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

    .task-view-toggle{
    	position: fixed;
    	top: 110px;
    	right: 0;
    	z-index: 5;

    	.toggle{
    		cursor: pointer;
    		background: #464c5b;
    		color: white;
    		width: 40px;
    		height: 40px;
    		text-align: center;
    		line-height: 40px;
    		border-top-left-radius: 3px;
    		border-bottom-left-radius: 3px;
    		font-size: 1.7em;
    	}
    }
</style>
