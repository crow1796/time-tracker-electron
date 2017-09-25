<script>
import {mapGetters} from 'vuex'
import _ from 'lodash'
export default {
    name: 'create-team-form',
    data () {
    return {
        newTeam: {
            name: null
        },
        teamFormModal: false
    }
    },
    methods: {
        open () {
            this.teamFormModal = true
        },
        close () {
            this.newTeam = {
                name: null
            }
            this.teamFormModal = false
        },
        createTeam () {
            this.$store.commit('PAGE_LOADING', true)
            this.$store.dispatch('createTeam', this.newTeam)
                .then((response) => {
                    this.$store.dispatch('initMenus')
                            .then((response) => {
                            })
                    // if(response.data.status){
                    //     this.$store.dispatch('getProjectsOfSelectedTeam')
                    //             .then((res) => {
                    //                 this.$router.replace(`/tracker/${response.data.project.team_id}/${response.data.project.id}`)
                    //                 window.scrollTo(0, 0)
                    //                 this.close()
                    //                 this.$store.commit('PAGE_LOADING', false)
                    //             })
                    // }
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
        v-model="teamFormModal"
        :mask-closable="false"
        :closable="false"
        @on-cancel="close"
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

<style lang="scss" scoped>
	.ivu-form-item{
		margin-bottom: 0;
	}
</style>
