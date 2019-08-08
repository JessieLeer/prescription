import qs from 'qs'
import cheader from '@/components/header/index.vue'
import caside from '@/components/aside/index.vue'

export default {
	name: 'datas',
	data() {
		let confirmPass = (rule, value, callback) => {
      if (value !== this.form1.password_new) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
		let phoneVerify = (rule, value, callback) => {
			const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确的手机号'))
      }
    }
		return {
			activeName: 'first',
			form: {},
			form1: {},
			rules: {
        phone: [
					{
						required: true, 
					  message: '请输入手机号', 
					  trigger: 'blur' 
					},
					{ 
					  validator: phoneVerify, 
					  trigger: 'blur' 
				  }
				],
				intro: { 
					required: true, 
					message: '请输入简介', 
					trigger: 'blur' 
				},
				history: { 
					required: true, 
					message: '请输入个人成就', 
					trigger: 'blur' 
				},
			},
			rules1: {
				password_old: [
					{
						required: true, 
            message: '请输入密码',
            trigger: 'blur'
					},
					{
						min: 6, 
            message: '密码长度不得小于6位',
            trigger: 'blur'
					},
					{
						max: 16, 
            message: '密码长度不得大于16位',
            trigger: 'blur'
					}
				],
				password_new: [
					{
						required: true, 
            message: '请输入密码',
            trigger: 'blur'
					},
					{
						min: 6, 
            message: '密码长度不得小于6位',
            trigger: 'blur'
					},
					{
						max: 16, 
            message: '密码长度不得大于16位',
            trigger: 'blur'
					}
				],
				password_repeat:[
					{
						required: true, 
            message: '请确认新密码',
            trigger: 'blur'
					},
					{ 
						validator: confirmPass, 
						trigger: 'blur' 
					}
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
		this.show()
	},
	methods: {
		/*-- 获取个人信息 --*/
		show() {
			this.$http.get('/api/web/physician/getPhysicianInfo', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId}}).then((res) => {
				this.form = res.data.data
			})
		},
		/*-- 更新个人信息 --*/
		updateInfo(formName) {
			this.$refs[formName].validate((valid) => {
        if (valid) {
					this.$http.post('/api/web/physician/updateInfo', qs.stringify({loginUid: this.user.loginUid, physicianId: this.user.physicianId, phone: this.form.phone, intro: this.form.intro, history: this.form.history})).then((res) => {
						if(res.data.retcode == 1) {
							this.$message({
								message: res.data.retmsg,
								type: 'success'
							})
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
		/*-- 修改密码 --*/
		updatePass(formName) {
			this.$refs[formName].validate((valid) => {
				if(valid) {
					this.$http.post('/api/web/physician/changePassword', qs.stringify({loginUid: this.user.loginUid, physicianId: this.user.physicianId, oldPassword: this.form1.password_old, newPassword: this.form1.password_new})).then((res) => {
						if(res.data.retcode == 1) {
							this.$message({
								message: res.data.retmsg,
								type: 'success'
							})
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
		/*-- 上传头像 --*/
		uploadAvatar(param) {
			let formData = new FormData()
			formData.append('file',param.file)
			formData.append('loginUid', this.user.loginUid)
			formData.append('physicianId', this.user.physicianId)
			this.$http.post('/api/web/physician/imgUpload',formData,{headers: {
        'Content-Type': 'multipart/form-data'
       }}).then((res) => {
				if(res.data.retcode == 1) {
					this.form.headImg = res.data.data
				}else{
					this.$message({
						message: res.data.retmsg,
						type: 'warning'
					})
				}
			})
		},
		/*-- 更新头像 --*/
		updateAvatar() {
			this.$http.post('/api/web/physician/updateHeadImg', qs.stringify({loginUid: this.user.loginUid, physicianId: this.user.physicianId, imgUrl: this.form.headImg})).then((res) => {
				if(res.data.retcode == 1) {
					this.$message({
						message: res.data.retmsg,
						type: 'success'
					})
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