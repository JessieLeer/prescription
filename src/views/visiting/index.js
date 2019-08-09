import qs from 'qs'
import cheader from '@/components/header/index.vue'
import { conn, rtcCall } from "../../webim/index"

WebIM.message = WebIM.default.message
WebIM.utils = WebIM.default.utils
WebIM.debug = WebIM.default.debug
WebIM.statusCode = WebIM.default.statusCode

export default {
	name: 'visiting',
	data() {
		return {
			dialogHistoryVisible: false,
			history: {
				data: [],
				total: 0
			},
			diainfo: {},
			form: {
				diagnosis: '',
			  suggestion: '',
			},
			rules: {
        diagnosis: [
          { 
						required: true, 
						message: '请输入初步诊断', 
						trigger: 'blur' 
				  },
        ],
				suggestion: [
					{ 
						required: true, 
						message: '请输入诊疗意见', 
						trigger: 'blur' 
				  },
				]
			},
			disease: [],
			sugtemplates: [],
			receives: [],
			sends: [],
			editing: '',
			quickApplyShow: false,
			quickApplies: [],
			medicine: {
				show: false,
				name: '',
				data: [],
				page: 1,
				total: 0
			},
			prescriptions: [],
		}
	},
	components: {
		cheader
	},
	computed: {
		user() {
			return this.$store.state.user
		},
		receive() {
			return this.$store.state.message.receive
		},
		send() {
			return this.$store.state.message.send
		},
		messages() {
			return this.receives.concat(this.sends).sort((a,b) => {
				return a.created_at < b.created_at ? -1 : 1
			})
		},
		videoShow: {
			get() {
				return this.$store.state.config.videoShow
			},
			set(newValue) {
				return this.$store.state.config.videoShow = newValue
			}
		}
	},
	watch: {
		receive(val, oldVal) {
			if(val.from == this.$route.params.imuser) {
				this.receives.push(val)
			}
		},
		send(val, oldVal) {
			if(val.to == this.$route.params.imuser) {
				this.sends.push(val)
			}
		},
		messages(val, oldVal) {
			this.$nextTick(_ => {
        this.$refs.messageWrapper.scrollTop = this.$refs.messageWrapper.scrollHeight
      })
		}
	},
	created() {	
		this.loginIm()
		this.init()
		this.prescriptionIndex()
		this.suggestionIndex()
		this.quickApplyIndex()
	},
	mounted() {
		this.$nextTick(() => {
			this.$refs.messageWrapper.style.height = window.innerHeight - 120 - 200 + 'px'
		  this.$refs.prescription.style.height = window.innerHeight - 200 + 'px'
			this.$refs.patientWrapper.style.height = window.innerHeight - 200 + 'px'
		})
	},
	methods: {
		back() {
			this.$router.back()
		},
		/*-- 开始接诊 --*/
		init() {
			this.$http.post('/api/web/physician/startDiagnose', qs.stringify({loginUid: this.user.loginUid, physicianId: this.user.physicianId, diagnoseId: this.$route.params.diagnose})).then((res) => {
				this.diainfo = res.data.data
			})
		},
		loginIm() {
      var options = {
        apiUrl: WebIM.config.apiURL,
        user: this.user.imUsername,
        pwd: this.user.imPassword,
        appKey: WebIM.config.appkey
      }
      conn.open(options)
    },
		/*-- 获取历史问诊 --*/
		historiesIndex(page) {
			this.dialogHistoryVisible = true
			this.$http.get('/api/web/physician/getHistoryDiagnose', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId, memberId: this.diainfo.memberId, pageNum: page, pageSize: 10}}).then((res) => {
				this.history.total = res.data.data.total
				this.history.data = []
				for(let prescription of res.data.data.rows) {
					prescription.drugs.forEach((item,index) => {
						this.history.data.push({
							createTime: prescription.createTime,
							diagnose: prescription.diagnose,
							diagnoseContent: prescription.diagnoseContent,
							drugName: item.drugName,
							drugManu: item.manufacturer,
							drugSpec: item.drugSpecifications,
							dosageUsage: item.usage,
							rowspan: index == 0 ? prescription.drugs.length : 0
						})
					})
				}
			})
		},
		prescriptionSpanMethod({ row, column, rowIndex, columnIndex }) {
			if (columnIndex < 3) {
        return {
          rowspan: row.rowspan,
          colspan: 1
        }
      }
		},
		/*-- 获取处方模版 --*/
		prescriptionIndex() {
			this.$http.get('/api/web/physician/getTemplateByPhysician', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId, diagnoseId: this.$route.params.diagnose}}).then((res) => {
				this.disease = res.data.data.map((item) => {
					return {
						id: item.id,
						value: item.name
					}
				})
			})
		},
		/*-- 获取所有诊疗意见 --*/
		suggestionIndex() {
			this.$http.get('/api/web/physician/getSuggestByPhysician', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId}}).then((res) => {
				this.sugtemplates = res.data.data.map((item) => {
					return {
						value: item.content
					}
				})
			})
		},
		/*--保存病例--*/
		saveCase(formName) {
			this.$refs[formName].validate((valid) => {
        if (valid) {
			    this.$http.post('/api/web/physician/editPatientCase',qs.stringify({loginUid: this.user.loginUid, physicianId: this.user.physicianId, patientCaseId: this.diainfo.patientCase, diagnose: this.form.diagnosis, medicalOpinion: this.form.suggestion})).then((res) => {
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
		rtAudioCall() {
      rtcCall.caller = this.user.imUsername
      rtcCall.makeVoiceCall(this.$route.params.imuser)
    },
		rtVideoCall() {
		  this.$store.commit('handleVideo', true)
      rtcCall.caller = this.user.imUsername
      rtcCall.makeVideoCall(this.$route.params.imuser)
    },
		handleVideoEnd() {
			this.$store.commit('handleVideo', false)
			rtcCall.endCall()
		},
		createFilter(queryString) {
      return (data) => {
        return (data.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
		querySearch(queryString, cb) {
      let results = queryString ? this.disease.filter(this.createFilter(queryString)) : this.disease
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
		querySearch1(queryString, cb) {
			let results = queryString ? this.sugtemplates.filter(this.createFilter(queryString)) : this.sugtemplates
      // 调用 callback 返回建议列表的数据
      cb(results)
		},
		handleSelect(item) {
			this.$http.get('/api/web/physician/getTemplateById', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId, templateId: item.id}}).then((res) => {
				for(let item of res.data.data.drugs) {
					this.prescriptionAdd(item.drug)
				}
			})
    },
		handleSelect1(item) {
			
		},
		// 单聊发送文本消息
		sendPrivateText() {
			let _this = this
			// 生成本地消息id 
			var id = conn.getUniqueId()   
			// 创建文本消息
			var msg = new WebIM.message('txt', id)     
			msg.set({
				// 消息内容
				msg: this.editing,  
				// 接收消息对象（用户id）
				to: this.$route.params.imuser,                          
				roomType: false,      
				// 对成功的相关定义，sdk会将消息id登记到日志进行备份处理
				success(id, serverMsgId) {
					_this.$store.commit('handleSend', {
						from: _this.user.imUsername,
						to: _this.$route.params.imuser,
						data: _this.editing,
						created_at: new Date(),
						type: 'send',
						chatType: 'text'
					})
					_this.editing = ''
				},                                       
				// 对失败的相关定义，sdk会将消息id登记到日志进行备份处理
				fail(e){
					console.log("Send private text error")
				}                                       
			})
			conn.send(msg.body)
		},
		/*-- 发送图片消息 --*/
		sendImageMessage() {
			let _this = this
			// 生成本地消息id
      let id = conn.getUniqueId()
      let msg = new WebIM.message("img", id)
      let input = this.$refs.imageInput
      let file = WebIM.utils.getFileUrl(input)
      let allowType = {
        jpg: true,
        gif: true,
        png: true,
        bmp: true
      }
      if (file.filetype.toLowerCase() in allowType) {
        var option = {
          apiUrl: WebIM.config.apiURL,
          file: file,
					// 接收消息对象
          to: this.$route.params.imuser, 
          roomType: false,
          chatType: "singleChat",
          onFileUploadError() {
            // 消息上传失败
            console.log("onFileUploadError");
          },
          onFileUploadComplete(message) {
						_this.$store.commit('handleSend', {
							from: _this.user.imUsername,
							to: _this.$route.params.imuser,
							data: message.uri + "/" + message.entities[0].uuid,
							created_at: new Date(),
							type: 'send',
							chatType: 'image'
						})
          },
          success() {
          },
          flashUpload: WebIM.flashUpload
        }
        msg.set(option)
        conn.send(msg.body)
      }
		},
		/*-- 获取快捷回复 --*/
		quickApplyIndex() {
			this.$http.get('/api/web/physician/getQuickReply', {params: {physicianId: this.user.physicianId, loginUid: this.user.loginUid}}).then((res) => {
				this.quickApplies = res.data.data.quickReplyList
			})
		},
		/*-- 药品查询 --*/
		medicineIndex(page) {
			this.$http.get('/api/web/physician/queryDrugs', {params: {diagnoseId: this.$route.params.diagnose, physicianId: this.user.physicianId, loginUid: this.user.loginUid, parameter: this.medicine.name, pageNum: page, pageSize: 10}}).then((res) => {
				this.medicine.total = res.data.data.total
				this.medicine.data = res.data.data.rows
			})
		},
		/*-- 加入处方 --*/
		prescriptionAdd(medicine) {
			this.$set(medicine, 'drugNumber', 1)
			this.prescriptions.push(medicine)
		},
		/*-- 从处方中移除 --*/
		prescriptionRemove(medicine) {
			this.prescriptions.splice(this.prescriptions.indexOf(medicine), 1)
		},
		/*-- 提交处方 --*/
		prescriptionSave() {
			this.$confirm('处方提交后不可修改，是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
				this.$http.post('/api/web/physician/commitPrescription',qs.stringify({drugs: JSON.stringify(this.prescriptions.map((item) => {return {shopDrugId: item.id, drugNumber: item.drugNumber, dosageUsage: item.dosageUsage}})), loginUid: this.user.loginUid, physicianId: this.user.physicianId, patientCaseId: this.diainfo.patientCase, diagnoseId: this.$route.params.diagnose})).then((res) => {
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
      }).catch(() => {
      })
		},
		/*-- 结束问诊 --*/
		finish() {
			this.$confirm('确定要结束本次问诊?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
				this.$router.push('/finish')
      }).catch(() => {
      })
		}
	}
}