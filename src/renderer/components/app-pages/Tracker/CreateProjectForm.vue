<script>
import {mapGetters} from 'vuex'
export default {
	name: 'create-project-form',
	data () {
		return {
			newProject: {
				title: null
			},
			projectFormModal: false
		}
	},
	methods: {
		open(){
			this.projectFormModal = true
		},
		close(){
			this.newProject = {
				title: null
			}
			this.projectFormModal = false
		},
		createProject(){
			this.$store.commit('PAGE_LOADING', true)
			this.$store.dispatch('createProject', this.newProject)
				.then((response) => {
					this.$router.replace(`/tracker/${this.selectedTeam}/${response.data.project.id}`)
				})
		}
	},
	computed: mapGetters({
		selectedTeam: 'selectedTeam'
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
        title="Create New Project"
        v-model="projectFormModal"
        :mask-closable="false"
        :closable="false"
        @on-cancel="close"
        @on-ok="createProject">
        <div>
        	<Form :model="newProject" label-position="left" :label-width="100">
    	        <FormItem label="Title">
    	            <Input v-model="newProject.title"></Input>
    	        </FormItem>
    	    </Form>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
	.ivu-form-item{
		margin-bottom: 0;
	}
</style>
