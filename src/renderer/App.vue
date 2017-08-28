<template>
	<div id="app">
		<div id="not-logged-in" v-if="!isLoggedIn">
			<div class="container">
				<div class="columns">
					<div class="column is-half is-offset-one-quarter">
						<transition name="fade" mode="out-in">
							<router-view class="view" 
									keep-alive
									transition
									transition-mode="in-out">
							</router-view>
						</transition>
					</div>
				</div>
			</div>
		</div>
		<div id="logged-in" v-if="isLoggedIn">
			<div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
		        <Row type="flex">
		            <Col :span="spanLeft" class="layout-menu-left">
		                <Menu active-name="1" theme="dark" width="auto">
		                    <div class="layout-logo-left"></div>
		                    <Submenu name="1">
                                <template slot="title">
                                    <Icon type="ios-navigate"></Icon>
                                    <span class="layout-text">Projects</span>
                                </template>
                                <MenuItem name="1-1">LawFormsUSA</MenuItem>
                                <MenuItem name="1-2">PDFRun</MenuItem>
                                <MenuItem name="1-3">PassportUSA</MenuItem>
                                <MenuItem name="1-4">Oill.io</MenuItem>
                                <MenuItem name="1-5">PDFFormPro</MenuItem>
                            </Submenu>
		                </Menu>
		            </Col>
		            <Col :span="spanRight">
		                <div class="layout-header">
		                    <Menu mode="horizontal" theme="light" active-name="1">
	                            <Submenu name="1">
	                                <template slot="title">
	                                    <Icon type="stats-bars"></Icon>
	                                    Baytech
	                                </template>
	                                <MenuGroup title="Teams">
	                                    <MenuItem name="1-1">Syntactics</MenuItem>
	                                    <MenuItem name="1-2">Team 1</MenuItem>
	                                </MenuGroup>
	                                <MenuGroup title="Options">
	                                    <MenuItem name="1-4">Create New Team</MenuItem>
	                                    <MenuItem name="1-5">Settings</MenuItem>
	                                </MenuGroup>
	                            </Submenu>
	                            <Submenu name="2">
	                                <template slot="title">
	                                    <Icon type="stats-bars"></Icon>
	                                    Joshua Tundag
	                                </template>
	                                <MenuItem name="2-1">Settings</MenuItem>
                                    <MenuItem name="2-2" @on-select="logoutUser">Logout</MenuItem>
	                            </Submenu>
	                        </Menu>
		                </div>
		                <div class="layout-breadcrumb">
		                    <Breadcrumb>
		                        <BreadcrumbItem href="#">Baytech</BreadcrumbItem>
		                        <BreadcrumbItem>LawFormsUSA</BreadcrumbItem>
		                    </Breadcrumb>
		                </div>
		                <div class="layout-content">
		                    <transition name="fade" mode="out-in">
		                    	<router-view class="view" 
		                    			keep-alive
		                    			transition
		                    			transition-mode="in-out">
		                    	</router-view>
		                    </transition>
		                </div>
		            </Col>
		        </Row>
		    </div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'my-project',
	data(){
		return {
			spanLeft: 5,
            spanRight: 19
		}
	},
	computed: {
		isLoggedIn () {
			return this.$store.getters.isLoggedIn
		},
		iconSize () {
		    return this.spanLeft === 5 ? 14 : 24;
		}
	},
	methods: {
		logoutUser () {
			this.$store.dispatch('logoutUser')
		}
	}
}
</script>

<style>
	.layout{
		border: 1px solid #d7dde4;
		background: #f5f7f9;
		position: relative;
		border-radius: 4px;
		overflow: hidden;
	}
	.layout-breadcrumb{
		padding: 10px 15px 0;
	}
	.layout-content{
		min-height: 100vh;
		margin: 15px;
		overflow: hidden;
		background: #fff;
		border-radius: 4px;
	}
	.layout-content-main{
		padding: 10px;
	}
	.layout-copy{
		text-align: center;
		padding: 10px 0 20px;
		color: #9ea7b4;
	}
	.layout-menu-left{
		background: #464c5b;
	}
	.layout-header{
		height: 60px;
		background: #fff;
		box-shadow: 0 1px 1px rgba(0,0,0,.1);
	}
	.layout-logo-left{
		width: 90%;
		height: 30px;
		background: #5b6270;
		border-radius: 3px;
		margin: 15px auto;
	}
	.layout-ceiling-main a{
		color: #9ba7b5;
	}
	.layout-hide-text .layout-text{
		display: none;
	}
	.ivu-col{
		transition: width .2s ease-in-out;
	}
</style>
