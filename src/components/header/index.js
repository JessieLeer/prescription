import qs from 'qs'

export default {
	name: 'cheader',
	data() {
		return  {
			status: true,
			lastId: 0
		}
	},
	computed: {
		user() {
			return this.$store.state.user
		}
	},
	created() {
		//this.ifNew()
	},
	methods: {
		open() {
      const h = this.$createElement
      this.$notify({
        message: h('i', { style: 'color: teal'}, '您有一条新的问诊')
      })
    },
		ifNew() {
			window.setInterval(() => {
				this.$http.get('/api/web/physician/getNewDiagnoseNum', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId}}).then((res) => {
					if(res.data.retcode == 1) {
						if(res.data.data == this.lastId) {
						}else{
							this.lastId = res.data.data
							this.open()
						}
					}else if(res.data.retcode == 2){
						this.$message({
							message: res.data.retmsg,
							type: 'warning'
						})
						this.$router.push('/login')
					}else{
						this.$message({
							message: res.data.retmsg,
							type: 'warning'
						})
					}
				})
			},10000)
		},
		toggleStatus(status) {
			this.$http.post('/api/web/physician/switchStatus', qs.stringify({loginUid: this.user.loginUid, physicianId: this.user.physicianId, status: status ? 1 : 0})).then((res) => {
				console.log(res)
			})
		},
		logout() {
			this.$http.post('/api/web/physician/logout', qs.stringify({loginUid: this.user.loginUid, physicianId: this.user.physicianId})).then((res) => {
				this.$store.commit('logout')
				this.$router.push('/login')
			})
		}
	}
}