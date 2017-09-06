<script>
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
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$Message.success('Logging in...')
        } else {
          this.$Message.error('Please fill in the required data.')
        }
      })
      this.isLoading = true
      this.$store.dispatch('loginUser', this.loginData)
				.then((response) => {
  this.isLoading = false
  if (response.data.token) this.$Message.success('Logged in Successfully!')
  this.$router.push('/')
})
    }
  }
}
</script>

<template>
	<div id="login">
		<div id="login-form">
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
		</div>
	</div>
</template>

<style lang="scss" scoped>
	#login-form{
		margin-top: 80px;
	}
</style>
