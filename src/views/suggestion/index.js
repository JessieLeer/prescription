import qs from 'qs'
import cheader from '@/components/header/index.vue'
import caside from '@/components/aside/index.vue'

export default {
	name: 'suggestion',
	data() {
		return {
			suggestion: {
				data: [],
				total: 0
			},
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
			this.$http.get('/api/web/physician/getSuggest', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId, pageNum: page, pageSize: 10}}).then((res) => {
				this.suggestion.data = res.data.data.rows
				this.suggestion.total = res.data.data.total
			})
		},
		handleSelectionChange(val) {
			this.deletings = val.map((item) => {
				return item.id
			})
		},
		/*-- 新增诊疗意见 --*/
		save(formName) {
			this.$refs[formName].validate((valid) => {
        if (valid) {
					this.$http.post('/api/web/physician/addSuggest', qs.stringify({loginUid: this.user.loginUid, physicianId: this.user.physicianId, suggest: this.form.content})).then((res) => {
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
		/*-- 删除诊疗意见 --*/
		del(id) {
			this.$confirm('确定删除该条模版?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/api/web/physician/deleteSuggest', qs.stringify({suggestIds: id, loginUid: this.user.loginUid, physicianId: this.user.physicianId})).then((res) => {
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
        this.$http.post('/api/web/physician/deleteSuggest', qs.stringify({suggestIds: this.deletings.join(','), loginUid: this.user.loginUid, physicianId: this.user.physicianId})).then((res) => {
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