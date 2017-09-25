<script>
import _ from 'lodash'
export default {
  name: 'status-badge',
  props: {
    status: {
      default: null
    }
  },
  methods: {
    __taskStatusIs (taskStatus, status) {
      return _.includes(!_.isArray(status) ? [status] : status, taskStatus)
    }
  }
}
</script>

<template>
	<span class="tag" :class="{ 
	'-dark': __taskStatusIs(status, ['NOT YET STARTED']),
	'-black': __taskStatusIs(status, ['CLOSED']), 
	'-primary': __taskStatusIs(status, ['IN PROGRESS', 'CODE REVIEW', 'REQUEST MERGE']), '-success': __taskStatusIs(status, ['TEST-DEV', 'TEST-STAGING', 'TEST-MASTER']), 
	'-warning': __taskStatusIs(status, ['REVIEWING', 'PAUSED']), 
	'-danger': __taskStatusIs(status, ['RE-OPEN', 'WITH DEFECTS', 'PROCESSING'])
	}">{{ status }}</span>
</template>

<style lang="scss" scoped>
	.tag{
		font-size: 0.9em;
		padding: 4px;
		color: white;
		border-radius: 30px;
		
		&.-dark{
			background: #969696;
		}

		&.-black{
			background: #2d2d2d;
		}

		&.-primary{
			background: #2d8cf0;
		}

		&.-success{
			background: #19be6b;
		}

		&.-warning{
			background: #ff9900;
		}

		&.-danger{
			background: #ed3f14;
		}

	}
</style>
