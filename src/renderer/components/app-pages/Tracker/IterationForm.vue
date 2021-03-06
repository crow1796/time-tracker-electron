<script>
import {mapGetters} from 'vuex'
import ModalMixin from '@/components/mixins/ModalMixin.vue'
import _ from 'lodash'
export default {
	name: 'iteration-form',
    mixins: [ModalMixin],
	data () {
		return {
			newIteration: {
                name: null,
                period: null
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: 'Name is required.'
                    }
                ],
                period: [
                    {
                        required: true,
                        message: 'Period is required.'
                    }
                ]
            },
            updating: false
		}
	},
	methods: {
        open(iteration){
            if(iteration){
                this.updating = true
                this.newIteration = JSON.parse(JSON.stringify(iteration))
                this.newIteration.period = [
                    iteration.started_at,
                    iteration.ended_at
                ]
            }
            this.formModal = true
        },
		closeModal(){
			this.newIteration = {
                name: null,
                period: null
			}
		},
		createIteration () {
            this.$store.dispatch('createIterationForSelectedProject', this.newIteration)
                .then((response) => {
                    this.$store.commit('CONTENT_LOADING', false)
                    this.$Message.destroy()
					let errors = !_.isArray(response.data.error) ? response.data.error : ''
					if(_.isArray(response.data.error)){
                        _.map(response.data.error, (error) => errors += `<li>${error}</li>`)
                            this.$Notice.error({
                                title: 'Unable to create new iteration!',
                                desc: `<ul>${errors}</ul>`
                            })
                        this.formModal = true
                        return false
                    }
                    this.closeModal()
                    this.$router.replace(`/tracker/${this.selectedTeam}/${this.selectedProject}/${response.data.iteration.id}`)
                    return response
                })
        },
        updateIteration(){
            this.$store.dispatch('updateIterationForSelectedProject', this.newIteration)
                .then((response) => {
                    this.$store.commit('CONTENT_LOADING', false)
                    this.$Message.destroy()
					let errors = !_.isArray(response.data.error) ? response.data.error : ''
					if(_.isArray(response.data.error)){
                        _.map(response.data.error, (error) => errors += `<li>${error}</li>`)
                            this.$Notice.error({
                                title: 'Unable to update iteration!',
                                desc: `<ul>${errors}</ul>`
                            })
                        this.formModal = true
                        return false
                    }
                    this.$store.commit('UPDATE_ITERATION', {
                        iteration: response.data.iteration.id,
                        newIteration: response.data.iteration
                    })
                    this.closeModal()
                    return response
                })
        },
        submitForm(){
            if(this.newIteration.period){
                let startedAt = new Date(this.newIteration.period[0])
                let endedAt = new Date(this.newIteration.period[1])
                this.newIteration.period = [
                    `${startedAt.getUTCFullYear()}-${startedAt.getMonth() + 1}-${startedAt.getDate()}`,
                    `${endedAt.getUTCFullYear()}-${endedAt.getMonth() + 1}-${endedAt.getDate()}`
                ]
            }
            this.$Notice.close()
            this.$Message.success(!this.updating ? 'Creating...' : 'Updating...')
            this.$store.commit('CONTENT_LOADING', true)
            if(!this.newIteration.id) return this.createIteration()

            this.updateIteration()
        }
	},
	computed: mapGetters({
        selectedTeam: 'getSelectedTeam',
        selectedProject: 'getSelectedProject'
	})
}
</script>

<template>
	<Modal
        :title="newIteration && newIteration.id ? 'Update Iteration' : 'Create New Iteration'"
        v-model="formModal"
        :mask-closable="false"
        :closable="false"
        @on-cancel="closeModal"
        @on-ok="submitForm">
        <div>
        	<Form ref="newIterationForm" :model="newIteration" :rules="rules" label-position="left" :label-width="100">
    	        <FormItem label="Name" prop="name">
    	            <Input v-model="newIteration.name"></Input>
    	        </FormItem>
                <FormItem label="Period" prop="period">
                    <DatePicker :readonly="false" v-model="newIteration.period" type="daterange" format="MMMM dd, yyyy"></DatePicker>
                </FormItem>
    	    </Form>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>

.ivu-date-picker{
    width: 100%;
}

</style>