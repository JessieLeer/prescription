import qs from 'qs'
import cheader from '@/components/header/index.vue'
import caside from '@/components/aside/index.vue'

export default {
	name: 'inquiry',
	data() {
		return {
			activeName: '1',
			prescription: {
				data: [],
				total: 0
			},
			form: {
				shop: '',
				patient: '',
				condition: ''
			}
		}
	},
	computed: {
		user() {
			return this.$store.state.user
		}
	},
	components: {
		cheader,
		caside
	},
	created() {
		this.index(1)
	},
	methods: {
		go(url) {
			this.$router.push(url)
		},
		index(page) {
			this.$http.get('/api/web/physician/prescriptionList', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId, status: this.activeName, shopName: this.form.shop, memberName: this.form.patient, mainSymptom: this.form.condition, pageNum: page, pageSize: 10}}).then((res) => {
				this.prescription.data = res.data.data.rows
				this.prescription.total = res.data.data.total
			})
		}
	}
}