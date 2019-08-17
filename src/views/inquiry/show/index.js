import cheader from '@/components/header/index.vue'
import caside from '@/components/aside/index.vue'

export default {
	name: 'inquiryShow',
	data() {
		return {
			check: false,
			message: '',
			src: '',
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
		this.show()
	},
	methods: {
		back() {
			this.$router.back()
		},
		show() {
			this.$http.get('/api/web/physician/prescriptionDetail', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId, diagnoseId: this.$route.params.id}}).then((res) => {
				this.check = res.data.data.check
				this.message = res.data.data.checkMessage
				this.src = res.data.data.prescription_img
			})
		}
	}
}