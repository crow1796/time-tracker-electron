<script>
	import {mapGetters} from 'vuex'
	import editor from 'vue2-medium-editor'
	export default {
		name: 'create-task-form',
		components: {
			'medium-editor': editor
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
			this.newTask.status = this.taskStatuses[0]
		},
		data(){
			return {
				newTask: {
					title: 'New Task',
					description: 'Ullamco proident aliqua sunt eiusmod tempor. Nostrud aliqua eu consequat eu ex quis laboris laboris non nisi ullamco. Adipisicing nisi anim cillum dolor sunt minim sint. Magna aute aliqua laboris voluptate non ad commodo. Consequat reprehenderit ea consequat consectetur duis consequat velit consectetur quis cupidatat.',
					status: null
				},
				taskFormModal: false,
				taskStatuses: []
			}
		},
		methods: {
			open(){
				this.taskFormModal = true
			},
			close(){
				this.newTask = {
					title: null
				}
				this.taskFormModal = false
			},
			createTask(){
				this.$store.commit('PAGE_LOADING', true)
			},
			applyTextEditTo(e, target){
				console.log(e, target)
			}
		},
		computed: mapGetters({
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
			<medium-editor :text="newTask.title" custom-tag="h2" @edit="applyTextEditTo($event, newTask.title)"></medium-editor>
		</div>
        <div>
        	<medium-editor :text="newTask.description" custom-tag="p" @edit="applyTextEditTo($event, newTask.description)"></medium-editor>
        </div>
		<div slot="footer">
			<div class="comments">
				<div class="comment">
					
				</div>
			</div>
		</div>
    </Modal>
</template>

<style lang="scss" scoped>
	.ivu-form-item:last-child{
		margin-bottom: 0;
	}

	.ivu-input{
		height: auto;
		border: 0;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}
</style>