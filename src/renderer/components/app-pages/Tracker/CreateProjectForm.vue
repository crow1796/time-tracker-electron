<script>
export default {
	name: 'create-project-form',
	props: {
		modalStatus: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			newProject: {
				title: null
			},
			projectFormModal: this.modalStatus
		}
	},
	watch: {
		'ticket.title' (to, from) {
			this.ticket.branch_name = '{Ticket #}_' + (to.trim().toLowerCase()).replace(/\W/g, '_')
		}
	}
}
</script>

<template>
	<Modal
        title="Create New Project"
        v-model="modalStatus"
        :mask-closable="false"
        :closable="false"
        @on-cancel="modalStatus = false">
        <div>
        	<Form :model="newProject" label-position="left" :label-width="100">
    	        <FormItem label="Title">
    	            <Input v-model="newProject.title"></Input>
    	        </FormItem>
    	    </Form>
        </div>
    </Modal>
</template>
