<script>
import _ from 'lodash'
import Vue from 'vue'
import { ipcRenderer } from 'electron'

export default {
	created(){
		ipcRenderer.send('resize-window', {
			width: 370, 
			height: 470,
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
		<div id="login-form">
			<h1 class="title">
				<Icon type="locked"></Icon>
				Login
			</h1>
			<Form ref="loginForm" :model="loginData" :rules="rules" label-position="top">
				<FormItem label="Email" prop="email">
					<Input type="text" v-model="loginData.email" placeholder="Enter your E-mail Address"></Input>
				</FormItem>
				<FormItem label="Password" prop="password">
					<Input type="password" v-model="loginData.password" placeholder="Enter Password"></Input>
				</FormItem>
				<FormItem>
					<Checkbox v-model="loginData.remember">Remember Me?</Checkbox>
				</FormItem>
				<FormItem>
					<Button v-if="!isLoading" type="primary" @click="loginUser" long>Login</Button>
					<Spin size="large" fix v-if="isLoading"></Spin>
				</FormItem>
				<FormItem class="text-right">
					<router-link to="/forgot-password">Forgot Password?</router-link> or 
					<router-link to="/register">Create an account</router-link>
				</FormItem>
				<FormItem class="_no-margin">
					<Button v-if="!isLoading" type="error" long>Connect with Google+</Button>
					<Spin size="large" fix v-if="isLoading"></Spin>
					<Button v-if="!isLoading" type="primary" long>Connect with Facebook</Button>
					<Spin size="large" fix v-if="isLoading"></Spin>
				</FormItem>
			</Form>
		</div>
	</div>
</template>

<style lang="scss">
#login-form{
	padding: 15px;

	& > .title{
		border-bottom: 1px solid rgba(0, 0, 0, .1);
		margin-bottom: 10px;
		text-align: center;
	}
}
</style>