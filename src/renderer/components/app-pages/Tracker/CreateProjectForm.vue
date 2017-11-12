<script>
import {mapGetters} from 'vuex'
import ModalMixin from '@/components/mixins/ModalMixin.vue'
export default {
	name: 'create-project-form',
	mixins: [ModalMixin],
	data () {
		return {
			newProject: {
				title: null
			}
		}
	},
	methods: {
		closeModal(){
			this.newProject = {
				title: null
			}
		},
		createProject () {
			this.$store.commit('CONTENT_LOADING', true)
			this.$store.dispatch('createProject', this.newProject)
				.then((response) => {
					this.newProject = {
						title: null
					}
				})
		}
	},
	computed: mapGetters({
		selectedTeam: 'getSelectedTeam'
	})
}
</script>

<template>
	<Modal
        title="Create New Project"
        v-model="formModal"
        :mask-closable="false"
        :closable="false"
        @on-cancel="closeModal"
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