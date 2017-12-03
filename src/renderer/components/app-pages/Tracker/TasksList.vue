<script>
import StatusBadge from './TasksList/StatusBadge.vue'
import Timer from './TasksList/Timer.vue'
import _ from 'lodash'
import EasyTimer from 'easytimer'
import {mapGetters} from 'vuex'

export default {
	name: 'tasks-list',
	components: {
		StatusBadge
	},
	data () {
		return {
			selectedTask: null,
			checkedTasks: []
		}
	},
	computed: mapGetters({
		selectedTeam: 'getSelectedTeam',
		selectedProject: 'getSelectedProject',
		selectedIteration: 'getSelectedIteration',
		tasks: 'getTasks',
		tasksCount: 'getTasksCount',
	}),
	watch: {
		'$route.params.task' (to, from) {
			if (!to) return false
			this.selectedTask = _.find(this.tasks, {id: parseInt(to)})
		}
	},
	methods: {
		hideTaskDetails () {
			this.$router.replace(`/tracker/${this.selectedTeam}/${this.selectedProject}/${this.selectedIteration}`)
		},
		startTimer (val) {
			this.taskTimerChanged(this.selectedTask)
		},
		taskTimerChanged (task) {
			this.$store.commit('CONTENT_LOADING', true)
			_.map(this.tasks, (row) => {
			if (row.timer && row.id != task.id) {
				row.timer.pause()
				row.status = 'PAUSED'
				row.selected = false
			}
			})

			task.timer = task.timer ? task.timer : new EasyTimer()
			task.timer.addEventListener('secondsUpdated', (e) => {
			task.timerModel = task.timer.getTimeValues().toString()
			})

			if (task.selected) {
			task.timer.start()
			task.status = 'IN PROGRESS'
			this.$store.commit('CONTENT_LOADING', false)
			return true
			}

			task.timer.pause()
			task.status = 'PAUSED'
			this.$store.commit('CONTENT_LOADING', false)
		},
		selectTask(task){
			this.$emit('selected', task)
		},
		pageChanged(e){
			this.$store.dispatch('getTasksOf', {
				iteration: this.selectedIteration,
				query: {
					limit: 5,
					page: e
				}
			})
		}
	}
}
</script>

<template>
<div id="tasks-list">
	<div class="tasks">
		<div v-for="(task, index) in tasks" :key="index" class="task">
			<a href="#" class="more-info-btn" @click="selectTask(task)">
				<i class="pe-7s-more"></i>
			</a>
			<Row>
				<Col span="20">
					<div class="title">
						<Checkbox v-model="task.checked">&nbsp;</Checkbox>
						<b>{{ task.id }}</b>
						<i>{{ task.title }}</i>
						<status-badge :status="task.status"></status-badge>
						<small>
							{{ (new Date(task.created_at)).toLocaleString() }}
						</small>
					</div>
					<div class="description" v-html="task.description"></div>
				</Col>
				<Col span="4" class-name="text-right timer">
					<i-switch v-model="task.selected" @on-change="taskTimerChanged(task)">
						<Icon type="ios-stopwatch-outline" slot="open"></Icon>
					</i-switch>
					<span class="time">
						{{ task.timerModel ? task.timerModel : '00:00:00' }}
					</span>
				</Col>
			</Row>
		</div>
		<div v-if="!tasksCount">
			<h1 class="text-center">You don't have any tasks yet.</h1>
		</div>
		<div class="pages" v-if="tasksCount">
			<Page ref="pagination" :total="tasksCount" :page-size="5" @on-change="pageChanged" show-total></Page>
		</div>
	</div>
</div>
</template>
