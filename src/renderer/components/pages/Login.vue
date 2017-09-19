<script>
import _ from 'lodash'
export default {
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
				    if(response.data.token){
				    	this.$Message.success('Logged in Successfully!')
				    	localStorage.setItem('jwtToken', response.data.token)
				        this.$store.commit('USER_AUTH_STATUS', true)
				        if (this.$router.currentRoute.query.redirect) {
				            this.$router.push(this.$router.currentRoute.query.redirect)
				            return true
				        }
				        this.$router.push(`/tracker/${this.$store.getters.getSelectedTeam}/${this.$store.getters.getSelectedProject}`)
				        return true
				    }
				    this.$Message.destroy()
					let errors = ''
					_.map(response.data.error, (error) => errors += `<li>${error}</li>`)
				    this.$Notice.error({
                        title: 'Login failed!',
                        desc: `<ul>${errors}</ul>`
                    })
				    this.isLoading = false
				})
		}
	}
}
</script>

<template>
	<div id="login">
		<div id="login-form">
			<Row>
				<Col span="9" offset="7">
					<Card>
						<p slot="title">
							<Icon type="locked"></Icon>
							Login
						</p>
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
					            <Button v-if="!isLoading" type="primary" @click="loginUser" long login>Login</Button>
					            <Spin size="large" fix v-if="isLoading"></Spin>
					        </FormItem>
					        <FormItem>
					        	<router-link to="/forgot-password">Forgot Password?</router-link> or 
					        	<router-link to="/register">Create an account</router-link>
					        </FormItem>
					    </Form>
					</Card>
				</Col>
			</Row>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	#login-form{
		margin-top: 80px;
	}
</style>
