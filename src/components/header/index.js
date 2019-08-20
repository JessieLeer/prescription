import qs from 'qs'

export default {
	name: 'cheader',
	data() {
		return  {
			status: true,
			isNew: false
		}
	},
	computed: {
		user() {
			return this.$store.state.user
		}
	},
	created() {
		this.interval(this.ifNew,10000)
	},
	methods: {
		open() {
      const h = this.$createElement
      this.$notify({
        message: h('i', { style: 'color: teal'}, '您有一条新的问诊')
      })
    },
		interval(func, wait) {
			let interv = function() {
				func.call(null)
				setTimeout(interv, wait)
			}
			setTimeout(interv, wait)
		},
		ifNew() {
			if(this.user.loginUid) {
				this.$http.get('/api/web/physician/getNewDiagnoseNum', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId}}).then((res) => {
					if(res.data.retcode == 1) {
						this.open()
					}else if(res.data.retcode == 2){
						this.logout()
					}
				})
			}
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