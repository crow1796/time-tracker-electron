<script>
	import _ from 'lodash'
	import Vue from 'vue'
	export default {
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
		<div id="registration-form">
			<Row>
				<Col span="9" offset="7">
					<Card>
						<p slot="title">
							<Icon type="locked"></Icon>
							Register
						</p>
						<Form ref="registrationForm" :model="registrationData" :rules="rules" label-position="top">
							<FormItem label="Full Name" prop="name">
					            <Input type="text" v-model="registrationData.name" placeholder="Enter your Full Name"></Input>
					        </FormItem>
							<FormItem label="Email" prop="email">
					            <Input type="text" v-model="registrationData.email" placeholder="Enter your E-mail Address"></Input>
					        </FormItem>
					        <FormItem label="Password" prop="password">
					            <Input type="password" v-model="registrationData.password" placeholder="Enter Password"></Input>
					        </FormItem>
							<FormItem label="Password Confirmation" prop="password_confirmation">
					            <Input type="password" v-model="registrationData.password_confirmation" placeholder="Re-enter Password"></Input>
					        </FormItem>
							<FormItem>
					            <Button v-if="!isLoading" type="primary" @click="registerUser" long>Register</Button>
					            <Spin size="large" fix v-if="isLoading"></Spin>
					        </FormItem>
					        <FormItem class="text-right">
					        	<router-link to="/forgot-password">Forgot Password?</router-link> or 
					        	<router-link to="/login">Already have an account?</router-link>
					        </FormItem>
							<FormItem class="_no-margin">
					            <Button v-if="!isLoading" type="error" long>Connect with Google+</Button>
					            <Spin size="large" fix v-if="isLoading"></Spin>
								<Button v-if="!isLoading" type="primary" long>Connect with Facebook</Button>
					            <Spin size="large" fix v-if="isLoading"></Spin>
					        </FormItem>
						</Form>
					</Card>
				</Col>
			</Row>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	#registration-form{
		margin-top: 40px;
	}
</style>
