<script>
	import {mapGetters} from 'vuex'
	export default {
		name: 'create-task-form',
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
					title: null,
					description: null,
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
        title="Create New Task"
        v-model="taskFormModal"
        :mask-closable="false"
        :closable="false"
        @on-cancel="close"
        @on-ok="createTask"
        width="80%">
        <div>
        	<Form :model="newTask" label-position="left">
        		<FormItem>
        			<Tag closable color="blue">LawFormsUSA</Tag>
        			<Button type="dashed" icon="ios-plus-outline" size="small">Add Project</Button>
        		</FormItem>
        		<FormItem>
        			<Select v-model="newTask.status">
    			        <Option v-for="(status, index) in taskStatuses" :value="status" :key="index">{{ status }}</Option>
    			    </Select>
        		</FormItem>
    	        <FormItem>
    	            <Input v-model="newTask.title" placeholder="Title"></Input>
    	        </FormItem>
    	        <FormItem>
    	            <Input v-model="newTask.description" type="textarea" :rows="4" placeholder="Description"></Input>
    	        </FormItem>
    	    </Form>
			<div slot="footer"></div>
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