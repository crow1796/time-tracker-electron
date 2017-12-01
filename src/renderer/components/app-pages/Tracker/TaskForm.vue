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
						<Input placeholder="Title" v-if="newTask" type="text" v-model="newTask.title" @on-blur="updateTask"></Input>
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
			<h3>Comments</h3>
			<div class="comments">
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

<style lang="scss" scoped>

	.form-group{
		margin-bottom: 10px;
	}

	.comments {
		& > .comment{
			padding: 8px 8px 15px 8px;
			// border-bottom: 1px solid #afafaf;
		}

		& > .comment .reviewer-info .reviewer-thumbnail{
			width: 30px;
			height: 30px;
			object-fit: cover;
			border-radius: 50%;
			vertical-align: middle;
			margin-right: 5px;
		}

		& > .comment .reviewer-info .reviewer-name{
			color: #222;
			font-weight: bold;
		}

		& > .comment .reviewer-info .reviewed-at{
			padding: 0 8px;
		}

		& > .comment .review-comment{
			padding-left: 37px;
			position: relative;
			transition: all .3s ease;
		}
		
	}



	.quillWrapper .ql-snow.ql-toolbar{
		display: block;
	}
</style>