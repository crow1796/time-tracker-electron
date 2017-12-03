<script>
	// import Quill from 'quill'
	// import { someModule } from '../yourModulePath/someQuillModule.js'
	// Quill.register('modules/someModule', someModule)

	import {mapGetters} from 'vuex'
	import _ from 'lodash'
	import VueQuillEditor from 'vue-quill-editor'

	export default {
		name: 'task-form',
		components: {
			'quill-editor': VueQuillEditor.quillEditor
		},
		created(){
			this.taskStatuses = [
				'NOT YET STARTED',
				'IN PROGRESS',
				'CODE REVIEW',
				'REQUEST MERGE',
				'TEST-DEV',
				'TEST-STAGING',
				'TEST-MASTER',
				'REVIEWING',
				'PAUSED',
				'RE-OPEN',
				'WITH DEFECTS',
				'PROCESSING',
				'CLOSED'
			]
		},
		data(){
			return {
				newTask: null,
				taskFormModal: false,
				taskStatuses: [],
				originalTask: null,
				editorOption: {
					theme: 'bubble',
					placeholder: 'Insert description here...'
				}
			}
		},
		methods: {
			open(task){
				this.originalTask = task
				this.newTask = JSON.parse(JSON.stringify(task))
				this.taskFormModal = true
			},
			close(){
				if(_.isEqual(this.newTask, this.originalTask)) return false
				this.$store.commit('CONTENT_LOADING', true)
				this.$store.dispatch('updateTask', this.newTask)
					.then((response) => {
						this.$store.dispatch('refreshTasksList')
							.then((response) => {
								this.originalTask = null
								this.newTask = null
								this.taskFormModal = false
							})
					})
			},
			createTask(){
			},
			updateTask(){
				if(_.isEqual(this.newTask, this.originalTask)) return false
				this.$store.dispatch('updateTask', this.newTask)
			},
			applyTextEditTo(e, target){
				console.log(e, target)
			},
			taskTimerChanged(){
				
			}
		},
		computed: mapGetters({
			selectedIteration: 'getSelectedIteration',
			selectedTeam: 'getSelectedTeam'
		}),
		watch: {
			'ticket.title' (to, from) {
				this.ticket.branch_name = '{Ticket #}_' + (to.trim().toLowerCase()).replace(/\W/g, '_')
			}
		}
	}
</script>

<template>
	<Modal
		v-if="newTask"
        v-model="taskFormModal"
        :closable="false"
        @on-cancel="close"
        @on-ok="createTask"
		class-name="tracker-modal">
		<div slot="header">
				<div class="task-options">
					<Row>
						<Col span="12">
							<ButtonGroup size="small">
								<Button type="primary">
									IN PROGRESS
								</Button>
								<Button type="ghost" icon="android-clipboard">
									Copy Link
								</Button>
							</ButtonGroup>
						</Col>
						<Col span="12" class-name="text-right">
							<span v-if="newTask">
								<i-switch v-model="newTask.selected" @on-change="taskTimerChanged">
									<Icon type="ios-stopwatch-outline" slot="open"></Icon>
								</i-switch>
								<span class="time">
									{{ newTask.timerModel ? newTask.timerModel : '00:00:00' }}
								</span>
							</span>
						</Col>
					</Row>
				</div>
				<div class="content">
					<div class="form-group task-title">
						<input type="text" name="title" id="title" class="tq-input -lg" @blur="updateTask" v-model="newTask.title" placeholder="Title">
					</div>
				</div>
		</div>
        <div class="task-description" v-if="newTask">
			<quill-editor v-model="newTask.description"
			                ref="taskDescriptionEditor"
			                :options="editorOption"
			                height="200px"
			                @blur="updateTask">
			  </quill-editor>
        </div>
		<div slot="footer" class="text-left">
			<div class="comments">
				<h3>Comments</h3>
				<div class="comment">
					<div class="reviewer-info">
						<a href="#">
							<img src="http://lazymarket.dev:8080/images/bg-03.jpg" class="reviewer-thumbnail">
						</a>
						<a href="#" class="reviewer-name">
							Admin Admin
						</a>
						<small class="reviewed-at">
							May 19, 2016
						</small>
					</div>

					<div class="review-comment">
						Created this task.
					</div>
				</div>
				<div class="comment">
					<div class="reviewer-info">
						<a href="#">
							<img src="http://lazymarket.dev:8080/images/bg-03.jpg" class="reviewer-thumbnail">
						</a>
						<a href="#" class="reviewer-name">
							Admin Admin
						</a>
						<small class="reviewed-at">
							May 19, 2016
						</small>
					</div>

					<div class="review-comment">
						Moved this task from 'IN PROGRESS' to 'CODE REVIEW'
					</div>
				</div>
			</div>
		</div>
    </Modal>
</template>