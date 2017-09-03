<script>
export default {
	name: 'timer',
	props: {
		onChange: {
			default: null
		},
		task: {
			default: null
		},
		switchModel: {
			default: false
		},
		time: {
			default: null
		}
	},
	data(){
		return {
			timerToggle: this.switchModel
		}
	},
	methods: {
		timerChanged(val){
			this.$emit('change', val, this.task)
		}
	}
}
</script>

<template>
	<div>
		<i-switch v-model="timerToggle" @on-change="timerChanged">
			<Icon type="ios-stopwatch-outline" slot="open"></Icon>
		</i-switch>
		<span class="time" v-if="time">
			{{ time }}
		</span>
	</div>
</template>