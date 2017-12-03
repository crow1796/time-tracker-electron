<script>
	import _ from 'lodash'
	export default {
		name: 'tq-spinner',
		created(){
			this.classes.push(this.classList)
			this.classes.push({ '-fixed': this.fix, '-absolute': !this.fix })

		},
		props: {
			fix: {
				type: Boolean,
				default: false
			},
			classList: {
				default: () => []
			}
		},
		data(){
			return {
				classes: []
			}
		}
	}
</script>

<template>
	<div class="tq-spinner" :class="classes">
		<div class="spinner-component">
			<i class="pe-7s-config pe-spin"></i>
		</div>
		<!-- <div class="clock">
			<div class="pointers"></div>
		</div> -->
	</div>
</template>

<style lang="scss">
	.tq-spinner,
	.tq-spinner {
	  height: 100%;
	  width: 100%;
	  margin: 0;
	  padding: 0;
	}

	.tq-spinner {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  background: rgba(#202225, .95);
	  z-index: 999;
	  width: 100%;
	  top: 0;
	  left: 0;
	  height: 100%;
	  
	  &.-absolute{
	  	position: absolute;
	  }

	  &.-fixed{
	  	position: fixed;
	  }
	}

	.spinner-component{
		font-size: 6em;
	}

	.clock {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}

	.clock:before,
	.clock:after {
	  content: "";
	  position: absolute;
	  border-radius: 50%;
	  border: 3px solid;
	}

	.clock:before {
	  --deg: 360deg;
	  height: 200px;
	  width: 200px;
	  border-color: #ccc transparent transparent;
	  animation: spin 2s infinite linear;
	}

	.clock:after {
	  --deg: -360deg;
	  height: 180px;
	  width: 180px;
	  border-color: transparent transparent #aaa;
	  animation: spin 1500ms infinite linear;
	}

	.pointers {
	  display: flex;
	  justify-content: center;
	  align-items: flex-start;
	  border: 5px solid #222;
	  border-radius: 50%;
	}

	.pointers:before,
	.pointers:after {
	  content: "";
	  position: absolute;
	  border: 2px solid;
	  z-index: -1;
	  transform-origin: 2px 0;
	}

	.pointers:before {
	  height: 70px;
	  border-color: #666;
	  animation: spin 1s infinite linear;
	}

	.pointers:after {
	  height: 40px;
	  border-color: #999;
	  animation: spin 6s infinite linear;
	}

	@keyframes spin {
	  from {
	    transform: rotate(0deg);
	  }
	  to {
	    transform: rotate(var(--deg, 360deg));
	  }
	}
</style>