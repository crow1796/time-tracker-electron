<script>
	import StatusBadge from './TasksTable/StatusBadge.vue'
	import Timer from './TasksTable/Timer.vue'
	import _ from 'lodash'
	import EasyTimer from 'easytimer'
	import {mapGetters} from 'vuex'

	export default {
	  name: 'tasks-table',
	  data () {
	    return {
	      columns: [
	        {
	          type: 'selection',
	          width: 60,
	          align: 'center'
	        },
				    {
				        title: 'Ticket ID',
				        key: 'ticket_id',
				        render: (createElement, params) => createElement('router-link', {
				        	attrs: {
				        		to: `/tracker/${this.selectedTeam}/${this.selectedProject}/${this.selectedIteration}/${params.row.ticket_id}`
				        	}
				        }, [params.row.ticket_id])
				    },
				    {
				        title: 'Title',
				        key: 'title'
				    },
				    {
				        title: 'Status',
				        key: 'status',
	          align: 'center',
				        render: (h, params) => h(StatusBadge, {
				        	props: {
				        		status: params.row.status
				        	}
				        })
				    },
				    {
				        title: 'Timer',
				        key: 'timer',
				        align: 'center',
				        render: (h, params) => h(Timer, {
				        	props: {
				        		task: params.row,
				        		time: params.row.timerModel ? params.row.timerModel : '00:00:00',
				        		switchModel: params.selected
				        	},
				        	on: {
				        		change: this.taskTimerChanged
				        	}
				        })
				    }
	      ],
	      tableData: [
					{'id': 1, 'ticket_id': '202901', 'title': 'Task #1', 'description': 'Task Desc #1', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false},
					{'id': 2, 'ticket_id': '202902', 'title': 'Task #2', 'description': 'Task Desc #2', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false},
					{'id': 3, 'ticket_id': '202903', 'title': 'Task #3', 'description': 'Task Desc #3', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false},
					{'id': 9, 'ticket_id': '202904', 'title': 'Task #4', 'description': 'Task Desc #4', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false},
					{'id': 5, 'ticket_id': '202905', 'title': 'Task #5', 'description': 'Task Desc #5', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false},
					{'id': 6, 'ticket_id': '202906', 'title': 'Task #6', 'description': 'Task Desc #6', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false},
					{'id': 7, 'ticket_id': '202907', 'title': 'Task #7', 'description': 'Task Desc #7', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false},
					{'id': 8, 'ticket_id': '202908', 'title': 'Task #8', 'description': 'Task Desc #8', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false},
					{'id': 9, 'ticket_id': '202909', 'title': 'Task #9', 'description': 'Task Desc #9', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false},
					{'id': 10, 'ticket_id': '202910', 'title': 'Task #10', 'description': 'Task Desc #10', status: 'NOT YET STARTED', timer: null, timerModel: null, selected: false}
	      ],
	      showTaskDetails: false,
	      selectedTask: null
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
	      this.selectedTask = _.find(this.tableData, { ticket_id: to })
	      this.$store.commit('CONTENT_LOADING', false)
	    }
	  },
	  methods: {
	    hideTaskDetails () {
	      this.$router.replace(`/tracker/${this.selectedTeam}/${this.selectedProject}/${this.selectedIteration}`)
	    },
	    startTimer (val) {
	      console.log(val)
	    },
	    taskTimerChanged (val, task) {
    			task.selected = val
	      this.$store.commit('CONTENT_LOADING', true)
	      _.map(this.tableData, (row) => {
	        if (row.id === task.id) return false
	        if (row.timer) {
	          row.timer.pause()
	          task.status = 'PAUSED'
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
	<div id="tasks-table">
		<Table border :columns="columns" :data="tableData"></Table>

		<Modal
	        :title="selectedTask.title"
	        v-model="showTaskDetails"
	        class-name="vertical-center-modal"
	        @on-ok="startTimer"
	        @on-cancel="hideTaskDetails"
	        ok-text="Start!"
	        v-if="selectedTask">
	        <p>
	        	<div><strong>Description:</strong></div>
	        	{{ selectedTask.description }}
	        </p>
	    </Modal>
	</div>
</template>

<style lang="scss" scoped>
	#tasks-table{
		padding-top: 15px;
	}
</style>
