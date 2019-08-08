import qs from 'qs'
import cheader from '@/components/header/index.vue'
import caside from '@/components/aside/index.vue'

export default {
	name: 'prescription',
	data() {
		return {
			type: '1',
			shops: [],
			searchForm: {
				shop: '',
				medicine: '',
				prescription: ''
			},
			prescriptions: [],
			currentPage: 1,
			total: 0,
			addFormVisible: false,
			addForm: {
				shop: '',
				prescription: '',
				medicines: []
			},
			editFormVisible: false,
			editForm: {
				id: '',
				shop: '',
				prescription: '',
				medicines: []
			},
			rules: {
        shop: [
          { 
						required: true, 
						message: '请选择药店', 
						trigger: 'change' 
				  },
        ],
				prescription: [
					{ 
						required: true, 
						message: '请输入处方名称', 
						trigger: 'blur' 
				  },
				],
				medicines: [
					{
						required: true, 
						message: '请添加至少一种药品', 
						trigger: 'blur' 
					}
				]
			},
			medicineVisible: false,
			medicine: {
				show: false,
				name: '',
				data: [],
				page: 1,
				total: 0
			},
		}
	},
	components: {
		cheader,
		caside
	},
	computed: {
		user() {
			return this.$store.state.user
		},
	},
	created() {
		this.shopIndex()
		this.index(1)
	},
	methods: {
		shopIndex() {
			this.$http.get('/api/web/physician/getShopByPhysician', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId}}).then((res) => {
				this.shops = res.data.data
			})
		},
		index(page) {
			this.currentPage = page
			this.$http.get('/api/web/physician/getTemplate', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId, type: this.type, shopId: this.searchForm.shop, drugName: this.searchForm.medicine, templateName: this.searchForm.prescription, pageNum: page, pageSize: 10}}).then((res) => {
				this.total = res.data.data.total
				this.prescriptions = []
				for(let prescription of res.data.data.rows) {
					prescription.drugs.forEach((item,index) => {
						this.prescriptions.push({
							id: prescription.id,
							name: prescription.name,
							shop: prescription.shopName,
							type: prescription.type,
							drugId: item.drug.id,
							drugName: item.drug.drugName,
							drugManu: item.drug.manufacturer,
							drugCode: item.drug.drugCode,
							drugPackageSpec: item.drug.packageSpec,
							dosageUsage: item.drug.dosageUsage,
							rowspan: index == 0 ? prescription.drugs.length : 0
						})
					})
				}
			})
		},
		prescriptionSpanMethod({ row, column, rowIndex, columnIndex }) {
			if (columnIndex == 0 || columnIndex == 6) {
        return {
          rowspan: row.rowspan,
          colspan: 1
        }
      }
		},
		handleMedicineShow() {
			this.medicineVisible = true
			this.medicineIndex(1)
		},
		/*-- 药品查询 --*/
		medicineIndex(page) {
			this.$http.get('/api/web/physician/searchDrugs', {params: {physicianId: this.user.physicianId, loginUid: this.user.loginUid, shopId: this.addForm.shop, parameter: this.medicine.name, pageNum: page, pageSize: 10}}).then((res) => {
				this.medicine.total = res.data.data.total
				this.medicine.data = res.data.data.rows
			})
		},
		/*-- 改变药店时候清除所选药品 --*/
		clearMedicine(form) {
			this[form].medicines = []
		},
		/*-- 药品加入处方 --*/
		medicineAdd(medicine) {
			this.$set(medicine, 'count', 1)
			this.addForm.medicines.push(medicine)
		},
		/*-- 从处方中移除药品 --*/
		medicineRemove(form,item) {
			this[form].medicines.splice(this[form].medicines.indexOf(item), 1)
		},
		/*-- 封装处理要提交的药品 --*/
		subMedicines(activeForm) {
			return this[activeForm].medicines.map((item) => {
				return {
					shopDrugId: item.id,
					drugNumber: item.count,
					dosageUsage: item.dosageUsage
				}
			})
		},
		/*-- 新增处方模版 --*/
		save(formName) {
			this.$refs[formName].validate((valid) => {
        if (valid) {
					this.$http.post('/api/web/physician/addTemplate', qs.stringify({loginUid: this.user.loginUid, physicianId: this.user.physicianId, name: this.addForm.prescription, shopId: this.addForm.shop, templateDrugStr: JSON.stringify(this.subMedicines('addForm'))})).then((res) => {
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
        } else {
          return false
        }
      })
		},
		/*-- 编辑处方模版 --*/
		handlEdit(id) {
			this.$http.get('/api/web/physician/getTemplateById', {params: {loginUid: this.user.loginUid, physicianId: this.user.physicianId, templateId: id}}).then((res) => {
				this.editForm.id = res.data.data.id
				this.editForm.shop = res.data.data.shop
				this.editForm.prescription = res.data.data.name
				this.editForm.medicines = res.data.data.drugs.map((item) => {
					this.$set(item.drug, 'count', item.drugNumber)
					return item.drug
				})
				this.editFormVisible = true
			})
		},
		update(formName) {
			this.$refs[formName].validate((valid) => {
        if (valid) {
					this.$http.post('/api/web/physician/updateTemplate', qs.stringify({loginUid: this.user.loginUid, physicianId: this.user.physicianId, templateId: this.editForm.id, name: this.editForm.prescription, shopId: this.editForm.shop, templateDrugStr: JSON.stringify(this.subMedicines('editForm'))})).then((res) => {
						if(res.data.retcode == 1) {
							this.$message({
								message: res.data.retmsg,
								type: 'success'
							})
							this.editFormVisible = false
							this.index(this.currentPage)
						}else{
							this.$message({
								message: res.data.retmsg,
								type: 'warning'
							})
						}
					})
				} else {
					return false
				}
			})
		},
		/*-- 删除处方模版 --*/
		del(id) {
			this.$confirm('确定删除该模版?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
				this.$http.post('/api/web/physician/deleteTemplate', qs.stringify({loginUid: this.user.loginUid, physicianId: this.user.physicianId, templateId: id})).then((res) => {
					if(res.data.retcode == 1) {
						this.$message({
							message: res.data.retmsg,
							type: 'success'
						})
						this.editFormVisible = false
						this.index(this.currentPage)
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