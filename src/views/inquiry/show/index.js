import cheader from '@/components/header/index.vue'
import caside from '@/components/aside/index.vue'

export default {
	name: 'inquiryShow',
	data() {
		return {
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
		show() {
			this.$http.get('/api/web/physician/prescriptionDetail', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId, diagnoseId: this.$route.params.id}}).then((res) => {
				this.src = res.data.data.prescription_img
			})
		}
	}
}