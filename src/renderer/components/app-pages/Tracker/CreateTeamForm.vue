<script>
import {mapGetters} from 'vuex'
import _ from 'lodash'
import ModalMixin from '@/components/mixins/ModalMixin.vue'
export default {
    name: 'create-team-form',
	mixins: [ModalMixin],
    data () {
        return {
            newTeam: {
                name: null
            }
        }
    },
    methods: {
        closeModal() {
            this.newTeam = {
                name: null
            }
        },
        createTeam () {
            this.$store.commit('CONTENT_LOADING', true)
			this.$store.commit('PROJECTS_LOADING', true)
			this.$store.commit('ITERATIONS_LOADING', true)
            this.$store.dispatch('createTeam', this.newTeam)
                .then((response) => {
                        this.$store.dispatch('initMenus')
                            .then((res) => {
                                this.$router.replace(`/tracker/${response.data.team.id}`)
                                this.newTeam = {
                                    name: null
                                }
                            })
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
        title="Create New Team"
        v-model="formModal"
        :mask-closable="false"
        :closable="false"
        @on-cancel="closeModal"
        @on-ok="createTeam">
        <div>
        	<Form :model="newTeam" label-position="left" :label-width="100">
    	        <FormItem label="Name">
    	            <Input v-model="newTeam.name"></Input>
    	        </FormItem>
    	    </Form>
        </div>
    </Modal>
</template>
