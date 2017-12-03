<script>
	import _ from 'lodash'
	import Vue from 'vue'
	import { ipcRenderer } from 'electron'
	import TQSpinner from '@/components/TQSpinner.vue'
	
	export default {
		components: {
			'tq-spinner': TQSpinner
		},
		created(){
			ipcRenderer.send('resize-window', {
			width: 370, 
			height: 560,
			resizable: false,
			fullscreenable: false
			})
		},
		data () {
			return {
				isLoading: false,
				registrationData: {
					email: null,
					password: null,
					password_confirmation: null,
					name: null
				},
				rules: {
					email: [
						{
							required: true,
							message: 'E-mail Address is required.'
						},
						{
							email: true,
							message: 'Must be a valid e-mail address.'
						}
					],
					password: [
						{
							required: true,
							message: 'Password is required.'
						}
					],
					password_confirmation: [
						{
							required: true,
							message: 'Password Confirmation is required.'
						}
					],
					name: [
						{
							required: true,
							message: 'Full name is required.'
						}
					]
				}
			}
		},
		methods: {
			registerUser(){
			this.$Notice.close()
			this.$Message.success('Creating an account...')
			this.isLoading = true
			this.$store.dispatch('registerUser', this.registrationData)
					.then((response) => {
						if (response.data.token) {
							this.$Message.success('Logged in Successfully!')
							localStorage.clear()
							localStorage.setItem('jwtToken', response.data.token)
							Vue.http.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token
							this.$store.commit('USER', response.data.user)
							this.$store.commit('USER_AUTH_STATUS', true)
							if (this.$router.currentRoute.query.redirect) {
								this.$router.push(this.$router.currentRoute.query.redirect)
								return true
							}
							this.$router.push(`/tracker/${this.$store.getters.getSelectedTeam}/${this.$store.getters.getSelectedProject}`)
							return true
						}
						this.$Message.destroy()
						let errors = !_.isArray(response.data.error) ? response.data.error : ''
						if (_.isArray(response.data.error)) _.map(response.data.error, (error) => errors += `<li>${error}</li>`)
						this.$Notice.error({
							title: 'Registration failed!',
							desc: `<ul>${errors}</ul>`
						})
						this.isLoading = false
					})
			}
		}
	}
</script>

<template>
	<div id="register">
		<tq-spinner :fix="true" v-if="isLoading"></tq-spinner>
		<div id="registration-form" class="tq-content">
			<div class="text-center">
				<img src="static/images/logo.png" alt="tictraQ" class="show-logo">
			</div>
			<form class="tq-form" @submit.prevent="registerUser">
				<div class="tq-form-item">
					<label for="fullname" class="tq-label">
						Full Name
					</label>
					<input type="text" name="fullname" id="fullname" class="tq-input" placeholder="Enter your Full Name" v-model="registrationData.name">
				</div>
				<div class="tq-form-item">
					<label for="email" class="tq-label">
						E-mail Address
					</label>
					<input type="text" name="email" id="email" class="tq-input" placeholder="Enter your E-mail Address" v-model="registrationData.email">
				</div>
				<div class="tq-form-item">
					<label for="password" class="tq-label">
						Password
					</label>
					<input type="password" name="password" id="password" class="tq-input" placeholder="Enter your Password" v-model="registrationData.password">
				</div>
				<div class="tq-form-item">
					<label for="password_confirmation" class="tq-label">
						Confirm Password
					</label>
					<input type="password" name="password_confirmation" id="password_confirmation" class="tq-input" placeholder="Re-enter Password" v-model="registrationData.password_confirmation">
				</div>
				<div class="tq-form-item">
					<button class="tq-btn -md -block -warning" type="submit">
						<span v-if="!isLoading">Register</span>
					</button>
				</div>
				<div class="tq-form-item text-right">
					<router-link to="/forgot-password">Forgot Password?</router-link> or 
					<router-link to="/login">Already have an account?</router-link>
				</div>
				<div class="tq-form-item is-marginless">
					<button class="tq-btn -md -block -danger" type="button">
						<span v-if="!isLoading">Connect with Google+</span>
					</button>
					<button class="tq-btn -md -block -primary" type="button">
						<span v-if="!isLoading">Connect with Facebook</span>
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<style lang="scss">
#registration-form{
	padding: 15px;

	& > .title{
		border-bottom: 1px solid rgba(0, 0, 0, .1);
		margin-bottom: 10px;
		text-align: center;
	}
}
</style>