<script>
	import {mapGetters} from 'vuex'
	export default {
	  created () {
	    this.projectSettings.title = this.projects[this.selectedProjectIndex].title
	  },
	  data () {
	    return {
	      projectSettings: {
	        title: null,
	        description: null
	      },
	      members: [
	        {
	          id: 1,
	          first_name: 'Joshua',
	          last_name: 'Tundag',
	          role: 'Administrator'
	        },
	        {
	          id: 2,
	          first_name: 'Kirsty',
	          last_name: 'Falle',
	          role: 'Watergirl'
	        },
	        {
	          id: 2,
	          first_name: 'Kirsty',
	          last_name: 'Falle',
	          role: 'Watergirl'
	        },
	        {
	          id: 2,
	          first_name: 'Kirsty',
	          last_name: 'Falle',
	          role: 'Watergirl'
	        }
	      ]
	    }
	  },
	  computed: mapGetters({
	    teams: 'getTeams',
	    projects: 'getProjects',
	    selectedTeam: 'getSelectedTeam',
	    selectedProject: 'getSelectedProject',
	    selectedTeamIndex: 'getSelectedTeamIndex',
	    selectedProjectIndex: 'getSelectedProjectIndex'
	  }),
	  methods: {
	    removeMemberFromProject (member) {
	      console.log(member)
	    }
	  }
	}
</script>

<template>
	<div id="project-settings">
		<Tabs value="general">
			<TabPane icon="settings" label="General" name="general">
				<Row>
					<Col span="12">
						<Form :model="projectSettings" label-position="left" :label-width="100">
					        <FormItem label="Project Title">
					            <Input v-model="projectSettings.title"></Input>
					        </FormItem>
					        <FormItem label="Description">
					        	<Input v-model="projectSettings.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Description..."></Input>
					        </FormItem>
					        <FormItem>
			                    <Button type="primary">Save Changes</Button>
			                </FormItem>
					    </Form>
					</Col>
					<Col span="12">
						<Card style="width:100%">
					        <p slot="title">
					            <Icon type="person"></Icon>
					            Members
					        </p>
					        <a href="#" slot="extra">
					            <Icon type="person-add"></Icon>
					            Add Member
					        </a>
					        <ul>
					            <li v-for="member in members" class="member">
					            	<Avatar style="background-color: #87d068" icon="person" />
				                	<span class="name">
				                		{{ member.first_name + ' ' + member.last_name }}
				                		<a class="remove" @click.prevent="removeMemberFromProject(member)">
				                			<Icon type="trash-b"></Icon>
				                		</a>
				                	</span>
					            </li>
					        </ul>
					    </Card>
						<div class="text-right" style="margin-top: 20px;">
							<Button type="error" size="small">
								Delete Project
							</Button>
						</div>
					</Col>
				</Row>
			</TabPane>
			<TabPane icon="checkmark" label="Workflow" name="workflow">
				Workflow
			</TabPane>
			<TabPane icon="checkmark" label="Auto-Deploy" name="auto_deploy">
				Auto Deploy
			</TabPane>
		</Tabs>
	</div>
</template>

<style lang="scss" scoped>
	.ivu-col-span-12{
		padding: 0 10px;
	}
	
	.member{
		padding: 5px 0;
		&:not(:last-child){
			border-bottom: 1px solid rgba(0, 0, 0, .05);
		}

		& > .ivu-avatar{
			vertical-align: middle;
		}

		& > .name {
			display: inline-block;
			width: 88%;
			text-align: right;
		}

		& > .name > .remove{
			padding-left: 20px;
		}
	}

	.ivu-card-body{
		padding: 5px 16px;
	}

	.ivu-card:hover{
		box-shadow: none;
	}

</style>
