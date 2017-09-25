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
			tasks: [
				{'id': 202901, 'title': 'MUST HAVE: Customer Dashboard > Delete Feature', 'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi fugiat quod voluptatem, ullam, modi facilis nesciunt impedit quaerat minus sapiente aspernatur voluptatibus accusantium ipsa voluptate temporibus nihil eligendi nisi eaque. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas laborum veniam ipsum minima voluptatem consequatur, delectus saepe reiciendis pariatur ea ad velit, totam ut dolor voluptatum eius iste repellat porro.', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false, checked: false},
				{'id': 202902, 'title': 'Task #2', 'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum quo fugiat doloremque repudiandae nostrum aut voluptatum sit, earum quae mollitia possimus omnis enim explicabo quis repellendus, corrupti! Alias, distinctio amet!', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false, checked: false},
				{'id': 202903, 'title': 'Task #3', 'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus eum doloribus neque at fuga ut voluptate, nesciunt iste eaque quasi nisi recusandae quis libero suscipit deserunt sapiente dicta provident amet.', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false, checked: false},
				{'id': 202904, 'title': 'Task #4', 'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus repellendus deserunt similique error quia alias quaerat eligendi. Sunt accusamus expedita, maiores, quod explicabo, quis eligendi corporis quos accusantium repellat ad.', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false, checked: false},
				{'id': 202905, 'title': 'Task #5', 'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque, aliquam ad enim, necessitatibus, voluptas magni non quidem veritatis cupiditate vel ipsa modi a nulla ut eum velit porro fugit. Eveniet.', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false, checked: false},
				{'id': 202906, 'title': 'Task #6', 'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo corporis, est nisi optio architecto debitis pariatur aliquid tenetur corrupti eos nobis. Pariatur, in ab necessitatibus ex repudiandae quia nemo. In!', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false, checked: false},
				{'id': 202907, 'title': 'Task #7', 'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum distinctio minus amet, consequatur quam maiores omnis quo officia mollitia tempore voluptates possimus eaque dolores. Officiis veritatis corporis numquam, pariatur laudantium!', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false, checked: false},
				{'id': 202908, 'title': 'Task #8', 'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique quasi libero consequuntur consectetur quis amet aspernatur velit tempora, perferendis reiciendis vel quod fuga obcaecati nostrum fugiat eveniet. Exercitationem debitis, quaerat.', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false, checked: false},
				{'id': 202909, 'title': 'Task #9', 'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus veritatis repudiandae fugit quas explicabo quae obcaecati maxime natus vitae libero, veniam odio quibusdam aut cupiditate facilis consequuntur! Animi, tempora, dicta.', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false, checked: false},
				{'id': 202910, 'title': 'Task #10', 'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt aspernatur numquam et, reprehenderit mollitia ducimus accusamus, blanditiis itaque rem deserunt dicta aliquam explicabo cum! Perferendis eaque ut eum recusandae velit.', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false, checked: false}
			],
			showTaskDetails: false,
			selectedTask: null,
			checkedTasks: []
		}
	},
	computed: mapGetters({
		selectedTeam: 'getSelectedTeam',
		selectedProject: 'getSelectedProject',
		selectedIteration: 'getSelectedIteration'
	}),
	watch: {
		'$route.params.task' (to, from) {
			if (!to) return false
			this.$store.commit('CONTENT_LOADING', true)
			this.showTaskDetails = true
			this.selectedTask = _.find(this.tasks, {id: parseInt(to)})
			this.$store.commit('CONTENT_LOADING', false)
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
		}
	}
}
</script>

<template>
	<div id="tasks-list">
		<div class="tasks">
			<div v-for="task in tasks" class="task">
				<router-link class="more-info-btn" :to="`/tracker/${selectedTeam}/${selectedProject}/${selectedIteration}/${task.id}`">
					Show more <Icon type="arrow-down-b"></Icon>
				</router-link>
        		<Row>
    		        <Col span="20">
    		        	<div class="title">
    		        		<Checkbox v-model="task.checked">&nbsp;</Checkbox>
    		        		<b>{{ task.id }}</b>
    		        		<i>{{ task.title }}</i>
							<status-badge :status="task.status"></status-badge>
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
			<div class="pages">
				<Page :total="30" show-total></Page>
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
