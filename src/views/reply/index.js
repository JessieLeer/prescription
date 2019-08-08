import qs from 'qs'
import cheader from '@/components/header/index.vue'
import caside from '@/components/aside/index.vue'

export default {
	name: 'reply',
	data() {
		return {
			replies: [],
			deletings: [],
			dialogFormVisible: false,
			form: {
				content: ''
			},
			rules: {
        content: [
          { 
						required: true, 
						message: '请输入内容', 
						trigger: 'blur' 
				  },
        ],
			}
		}
	},
	components: {
		cheader,
		caside
	},
	computed: {
		user() {
			return this.$store.state.user
		}
	},
	created() {
		this.index(1)
	},
	methods: {
		index(page) {
			this.$http.get('/api/web/physician/getQuickReply', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId}}).then((res) => {
				this.replies = res.data.data
			})
		},
		handleSelectionChange(val) {
			this.deletings = val.map((item) => {
				return item.id
			})
		},
		/*-- 新增快捷回复 --*/
		save(formName) {
			this.$refs[formName].validate((valid) => {
        if (valid) {
					this.$http.post('/api/web/physician/addQuickReply', qs.stringify({loginUid: this.user.loginUid, physicianId: this.user.physicianId, replyContent: this.form.content})).then((res) => {
						if(res.data.retcode == 1) {
							this.$message({
								message: res.data.retmsg,
								type: 'success'
							})
							window.setTimeout(() => {
								window.location.reload()
							},1500)
						}else{
							this.$message({
								message: res.data.retmsg,
								type: 'warning'
							})
						}
					})
				}else{
					return false
				}
			})
		},
		/*-- 删除快捷回复 --*/
		del(id) {
			this.$confirm('确定删除该条模版?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/api/web/physician/deleteQuickReply', qs.stringify({replyIds: id, loginUid: this.user.loginUid, physicianId: this.user.physicianId})).then((res) => {
					if(res.data.retcode == 1) {
						this.$message({
							message: res.data.retmsg,
							type: 'success'
						})
						window.setTimeout(() => {
							window.location.reload()
						},1500)
					}else{
						this.$message({
							message: res.data.retmsg,
							type: 'warning'
						})
					}
				})
      }).catch(() => {
      })
		},
		delAll() {
			this.$confirm('确定删除所选中的模版?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/api/web/physician/deleteQuickReply', qs.stringify({replyIds: this.deletings.join(','), loginUid: this.user.loginUid, physicianId: this.user.physicianId})).then((res) => {
					if(res.data.retcode == 1) {
						this.$message({
							message: res.data.retmsg,
							type: 'success'
						})
						window.setTimeout(() => {
							window.location.reload()
						},1500)
					}else{
						this.$message({
							message: res.data.retmsg,
							type: 'warning'
						})
					}
				})
      }).catch(() => {
      })
		}
	}
}