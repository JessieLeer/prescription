import qs from 'qs'

export default {
	data() {
		return {
			form: {
				username: 'ceshiyishi',
				password: '111111'
			},
			rules: {
        username: [
          { 
						required: true, 
						message: '请输入用户名', 
						trigger: 'blur' 
				  },
        ],
				password: [
					{ 
						required: true, 
						message: '请输入密码', 
						trigger: 'blur' 
				  },
				]
			}
		}
	},
	methods: {
		submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
					this.$http.post('/api/web/physician/login',qs.stringify(this.form)).then((res) => {
						this.$message(res.data.retmsg)
						if(res.data.retcode == 1) {
							this.$store.commit('login', res.data.data)
							this.$router.push('/waitings')
						}
					})
        } else {
          return false
        }
      })
    },
	}
}