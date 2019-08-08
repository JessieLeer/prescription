import qs from 'qs'
import cheader from '@/components/header/index.vue'
import caside from '@/components/aside/index.vue'

export default {
	name: 'waitings',
	data() {
		return {
			form: {
				shop: '',
				patient: '',
				condition: ''
			},
			page: {
				current: 1,
				total: 1
			},
			waitings: []
		}
	},
	computed: {
		user() {
			return this.$store.state.user
		}
	},
	created() {
		this.index(1)
	},
	components: {
		cheader,
		caside
	},
	methods: {
		index(page) {
			this.$http.get('/api/web/physician/waittingDiagnoseList',{params: {physicianId: this.user.physicianId,loginUid: this.user.loginUid, shopName: this.form.shop, memberName: this.form.patient, mainSymptom: this.form.condition, pageNum: page, pageSize: 10}}).then((res) => {
				this.waitings = res.data.data.rows
				this.page.total = res.data.data.total
			})
		},
		visiting(diagnoseId,imUser) {
			this.$http.post('/api/web/physician/startDiagnose', qs.stringify({diagnoseId: diagnoseId, physicianId: this.user.physicianId, loginUid: this.user.loginUid})).then((res) => {
				if(res.data.retcode == 1) {
					this.$router.push(`/visiting/${imUser}/${diagnoseId}`)
				}else{
					this.$message({
						message: res.data.retmsg,
						type: 'warning'
					})
				}
			})
		}
	}
}