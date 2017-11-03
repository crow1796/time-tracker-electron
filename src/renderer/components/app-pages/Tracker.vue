<script>
import TasksList from './Tracker/TasksList.vue'
import {mapGetters} from 'vuex'
import _ from 'lodash'
import CreateProjectForm from './Tracker/CreateProjectForm.vue'
import CreateIterationForm from './Tracker/CreateIterationForm.vue'
import TaskForm from './Tracker/TaskForm.vue'

export default {
    components: {
        TasksList,
        CreateProjectForm,
        CreateIterationForm,
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
                    <Button type="warning" icon="ios-plus-outline" @click="createNewTask">New Task</Button>
					<Button type="default" icon="ios-plus-outline" @click="$refs.createIterationForm.open()">New Sprint/Iteration</Button>
                </div>
		    	<tasks-list ref="tasksList" @selected="editTask"></tasks-list>
		    	<div class="task-view-toggle">
		    		<Tooltip content="Board View" placement="left">
	    				<div class="toggle">
	    					<Icon type="ios-list-outline"></Icon>
	    				</div>
		            </Tooltip>
		    	</div>
				<create-iteration-form ref="createIterationForm"></create-iteration-form>
		    </div>

		    <div v-if="!projects.length && !selectedProject">
            	<h1 class="text-center">You don't have any projects yet.</h1>
		    </div>
            <task-form ref="taskForm"></task-form>
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
