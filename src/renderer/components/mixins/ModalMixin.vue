<script>

export default {
    data(){
        return {
            formModal: false
        }
    },
    methods: {
        open () {
            this.formModal = true
        },
        close () {
            this.formModal = false
        }
    }
}
</script>


<style lang="scss" scoped>
	.ivu-form-item:last-child{
		margin-bottom: 0;
	}
</style>