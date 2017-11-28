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
			showTaskDetails: false,
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
			this.showTaskDetails = true
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
				Show more <Icon type="arrow-down-b"></Icon>
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

	<Modal
		:title="`${selectedTask.id} - ${selectedTask.title}`"
		v-model="showTaskDetails"
		class-name="vertical-center-modal"
		@on-cancel="hideTaskDetails"
		ok-text="Go!"
		v-if="selectedTask"
		width="70%">
		<p>
			<Row>
				<Col span="12">
					<status-badge :status="selectedTask.status"></status-badge>
				</Col>
				<Col span="12">
					<div class="text-right">
						<i-switch v-model="selectedTask.selected" @on-change="taskTimerChanged(selectedTask)">
							<Icon type="ios-stopwatch-outline" slot="open"></Icon>
						</i-switch>
						<span class="time">
							{{ selectedTask.timerModel ? selectedTask.timerModel : '00:00:00' }}
						</span>
					</div>
				</Col>
			</Row>
			<br>
			<Row>
				<Col span="24">
					<div><strong>Description:</strong></div>
					{{ selectedTask.description }}
				</Col>
			</Row>
		</p>
		<div slot="footer"></div>
	</Modal>
</div>
</template>

<style lang="scss" scoped>
#tasks-list{
	padding-top: 15px;
}

.tasks{
	.task{
		padding: 10px;
		margin-bottom: 5px;
		position: relative;
	}

	& > .pages{
		text-align: right;
		padding-top: 20px;
	}

	.task{
		border-bottom: 1px solid rgba(0, 0, 0, .1);
	}

	.task .title > b{
		vertical-align: middle;
		color: #ed3f14;
	}

	.task .title > i{
		font-size: 1.4em;
		vertical-align: middle;
	}

	.task .description{
		padding-left: 26px;
	}

	.task .timer .time{
		display: block;
		font-size: 1.5em;
		font-style: italic;
	}

	.task .more-info-btn{
		position: absolute;
		width: 100%;
		height: 30px;
		background: linear-gradient(rgba(255, 255, 255, 0.8), #fff);
		bottom: 0;
		z-index: 1;
		text-align: center;
		line-height: 30px;
		transition: line-height .3s ease;
	}

	.task .more-info-btn:hover{
		line-height: 40px;
	}
}

.tasks .task{
	max-height: 100px;
	min-height: 100px;
	overflow: hidden;
}
</style>
