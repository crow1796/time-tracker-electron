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
			height: 430,
			resizable: false,
			fullscreenable: false
			})
	},
	data () {
		return {
		isLoading: false,
		loginData: {
			email: null,
			password: null,
			remember: false
		},
		rules: {
			email: [
			{
				required: true,
				message: 'E-mail Address is required.'
			}
			],
			password: [
			{
				required: true,
				message: 'Password is required.'
			}
			]
		}
		}
	},
	methods: {
		loginUser () {
			this.$Notice.close()
			this.$Message.success('Logging in...')
			this.isLoading = true
			this.$store.dispatch('loginUser', this.loginData)
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
							title: 'Login failed!',
							desc: `<ul>${errors}</ul>`
						})
						this.isLoading = false
					})
					.catch((err) => {
						this.$Message.error(err.message)
						this.$store.commit('PAGE_LOADING', false)
						this.$store.commit('CONTENT_LOADING', false)
					})
		}
	}
}
</script>

<template>
	<div id="login">
		<tq-spinner :fix="true" v-if="isLoading"></tq-spinner>
		<div id="login-form" class="tq-content">
			<h1 class="text-center">
				tictraQ
			</h1>
			<form class="tq-form">
				<div class="tq-form-item">
					<label for="email" class="tq-label">E-mail Address</label>
					<input type="text" v-model="loginData.email" name="email" id="email" class="tq-input" placeholder="Enter you E-mail Address">
				</div>
				<div class="tq-form-item">
					<label for="password" class="tq-label">Password</label>
					<input type="password" v-model="loginData.password" name="password" id="password" class="tq-input" placeholder="Enter Password">
				</div>
				<label for="remember_me">
					<input v-model="loginData.remember" type="checkbox" name="remember_me" id="remembere_me">
					Remember Me?
				</label>
				<div class="tq-form-item text-center">
					<button class="tq-btn -md -block -primary" type="submit" @click="loginUser">
						<span v-if="!isLoading">Login</span>
					</button>
				</div>
				<div class="tq-form-item text-right">
					<router-link to="/forgot-password">Forgot Password?</router-link> or 
					<router-link to="/register">Create an account</router-link>
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