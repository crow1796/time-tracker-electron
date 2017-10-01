<script>
import _ from 'lodash'
export default {
    name: 'status-badge',
    props: {
        status: {
            default: null
        }
    },
    created(){
        this.tagColors = {
            'NOT YET STARTED': '#969696',
            'IN PROGRESS': '#2d8cf0',
            'CODE REVIEW': '#2d8cf0',
            'REQUEST MERGE': '#2d8cf0',
            'TEST-DEV': '#19be6b',
            'TEST-STAGING': '#19be6b',
            'TEST-MASTER': '#19be6b',
            'REVIEWING': '#ff9900',
            'PAUSED': '#ff9900',
            'RE-OPEN': '#ed3f14',
            'WITH DEFECTS': '#ed3f14',
            'PROCESSING': '#ed3f14',
            'CLOSED': '#2d2d2d'
        }
    },
    data(){
        return {
            tagColors: null
        }
    },
    computed: {
        'tagColor'(){
            return this.tagColors[this.status]
        }
    }
}
</script>

<template>
	<span class="tag" :style="{ backgroundColor: tagColor }">
		{{ status }}
	</span>
</template>

<style lang="scss" scoped>
    .tag{
        font-size: 0.9em;
        padding: 4px;
        color: white;
        border-radius: 4px;
    }
</style>