<template>
  <div>
	  <cheader></cheader>
		<el-container class='mt-20'>
		  <caside active='/prescription'></caside>
		  <el-main>
				<el-tabs v-model="type" @tab-click="index(1)">
					<el-tab-pane label="我的模版" name="1"></el-tab-pane>
					<el-tab-pane label="药店模版" name="2"></el-tab-pane>
				</el-tabs>
				<el-form v-bind:inline="true" :model="searchForm" size='small' align='right'>
					<el-form-item>
						<el-select v-model="searchForm.shop" placeholder="药店">
							<el-option v-for='(item, index) in shops' v-bind:key='index' v-bind:label="item.name" v-bind:value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-input v-model="searchForm.medicine" placeholder="药品名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input v-model="searchForm.prescription" placeholder="处方名"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="index(1)">查询</el-button>
						<el-button type="default" v-on:click='addFormVisible = true'>新增模版</el-button>
					</el-form-item>
				</el-form>
				<el-table v-bind:data="prescriptions" v-bind:span-method="prescriptionSpanMethod" max-height="500">
					<el-table-column label="处方名称" align='center'>
					  <template slot-scope='scope'>
						  {{scope.row.name}}
							<el-tag size="small">{{scope.row.shop}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="drugName" label="药品名" align='center'></el-table-column>
					<el-table-column prop="drugCode" label="药品批号" align='center'></el-table-column>
					<el-table-column prop="drugManu" label="厂商" align='center' show-overflow-tooltip> </el-table-column>
					<el-table-column prop="drugPackageSpec" label="规格" align='center'></el-table-column>
					<el-table-column prop="dosageUsage" label="用法用量" align='center'></el-table-column>
					<el-table-column label="操作" align='center' v-if='type == 1' width='130'>
					  <template slot-scope='scope'>
						  <el-button size='mini' type='primary' icon='el-icon-edit' v-on:click='handlEdit(scope.row.id)' title='编辑'></el-button>
							<el-button size='mini' type='danger' icon='el-icon-delete' title='删除' v-on:click='del(scope.row.id)'></el-button>
						</template>
					</el-table-column>
				</el-table>
				<br>
				<el-pagination layout="prev, pager, next" v-bind:total="total" v-on:current-change='index' v-bind:page-size='10'></el-pagination>
				<el-dialog title="新增模版" :visible.sync="addFormVisible" class='prescription-dialog'>
					<el-form :model="addForm" label-width="100px" size='small' align='left' v-bind:rules='rules' ref='addForm'>
						<el-form-item label="所属药店" prop='shop'>
							<el-select v-model="addForm.shop" v-on:change='clearMedicine("addForm")'>
							  <el-option v-for='(item, index) in shops' v-bind:key='index' v-bind:label="item.name" v-bind:value="item.id"></el-option>
						  </el-select>
						</el-form-item>
						<el-form-item label="处方名称" prop='prescription'>
						  <el-input v-model="addForm.prescription"></el-input>
						</el-form-item>
						<el-form-item label='处方内药品' prop='medicines'>
						  <div class='medicine-wrapper'>
								<el-form v-for='(item, index) in addForm.medicines' v-bind:key='index' label-width='40px' class='prescription-form f-tal'>
									<el-form-item class='no-mb f-cb f-fwb' label-width='0'>
										{{item.drugName}}
										<i class="el-icon-delete f-csp f-fr" title='移除' v-on:click='medicineRemove("addForm",item)'></i>
									</el-form-item>
									<el-form-item label='批号' class='no-mb'>{{item.drugCode}}</el-form-item>
									<el-form-item label='厂商' class='no-mb'>{{item.manufacturer}}</el-form-item>
									<el-form-item label='规格' class='no-mb'>{{item.packageSpec}}</el-form-item>
									<el-form-item label-width='0' class='medicine-useage no-mb'>
										<el-input placeholder='用法用量' v-model='item.dosageUsage' size='small' class='useage-text f-fl'></el-input>
										<el-input-number v-model="item.count" size='small' v-bind:min='1' controls-position="right" class='useage-count f-fr'></el-input-number>
									</el-form-item>
								</el-form>
							</div>
					  </el-form-item>
					  <el-form-item>
					    <el-button type="primary" v-on:click="save('addForm')">提交</el-button>
							<el-button type='default' v-on:click='handleMedicineShow' v-bind:disabled='addForm.shop == ""' v-bind:title='addForm.shop == "" ? "请先选择药店" : ""'>新增药品</el-button>	
					  </el-form-item>
				  </el-form>
					<el-dialog v-bind:visible.sync="medicineVisible" append-to-body class='prescription-dialog' v-bind:show-close='false'>
					  <el-input placeholder="药品名称/助记码" v-model="medicine.name" slot='title' size='small'>
							<el-button slot="append" icon="el-icon-search" v-on:click='medicineIndex(1)'></el-button>
							<el-button slot="prepend" type='danger' v-on:click='medicineVisible = false'>关闭</el-button>
						</el-input>
						<el-table v-bind:data="medicine.data" max-height="280">
							<el-table-column fixed prop="drugName" label="名称" show-overflow-tooltip></el-table-column>
							<el-table-column prop="drugCode" label="批号" show-overflow-tooltip></el-table-column>
							<el-table-column prop="manufacturer" label="生产厂家" show-overflow-tooltip></el-table-column>
							<el-table-column prop="packageSpec" label="规格" show-overflow-tooltip></el-table-column>
							<el-table-column label="操作" width='100'>
								<template slot-scope='scope'>
									<el-button type='primary' size='small' v-on:click='medicineAdd(scope.row)' v-bind:disabled='addForm.medicines.filter((item) => {return item.id == scope.row.id}).length > 0'>加入处方</el-button>
								</template>
							</el-table-column>
						</el-table>	
						<el-pagination layout="prev, pager, next" v-on:current-change='medicineIndex' v-bind:total="medicine.total" align='center' class='mt-10 mb-10'></el-pagination>
				  </el-dialog>
				</el-dialog>
				
				<el-dialog title="编辑模版" :visible.sync="editFormVisible" class='prescription-dialog'>
					<el-form :model="editForm" label-width="100px" size='small' align='left' v-bind:rules='rules' ref='editForm'>
						<el-form-item label="所属药店" prop='shop'>
							<el-select v-model="editForm.shop" v-on:change='clearMedicine("editForm")'>
							  <el-option v-for='(item, index) in shops' v-bind:key='index' v-bind:label="item.name" v-bind:value="item.id"></el-option>
						  </el-select>
						</el-form-item>
						<el-form-item label="处方名称" prop='prescription'>
						  <el-input v-model="editForm.prescription"></el-input>
						</el-form-item>
						<el-form-item label='处方内药品' prop='medicines'>
						  <div class='medicine-wrapper'>
								<el-form v-for='(item, index) in editForm.medicines' v-bind:key='index' label-width='40px' class='prescription-form f-tal'>
									<el-form-item class='no-mb f-cb f-fwb' label-width='0'>
										{{item.drugName}}
										<i class="el-icon-delete f-csp f-fr" title='移除' v-on:click='medicineRemove("editForm",item)'></i>
									</el-form-item>
									<el-form-item label='批号' class='no-mb'>{{item.drugCode}}</el-form-item>
									<el-form-item label='厂商' class='no-mb'>{{item.manufacturer}}</el-form-item>
									<el-form-item label='规格' class='no-mb'>{{item.packageSpec}}</el-form-item>
									<el-form-item label-width='0' class='medicine-useage no-mb'>
										<el-input placeholder='用法用量' v-model='item.dosageUsage' size='small' class='useage-text f-fl'></el-input>
										<el-input-number v-model="item.count" size='small' v-bind:min='1' controls-position="right" class='useage-count f-fr'></el-input-number>
									</el-form-item>
								</el-form>
							</div>
					  </el-form-item>
					  <el-form-item>
					    <el-button type="primary" v-on:click="update('editForm')">提交</el-button>
							<el-button type='default' v-on:click='handleMedicineShow' v-bind:disabled='editForm.shop == ""' v-bind:title='editForm.shop == "" ? "请先选择药店" : ""'>新增药品</el-button>	
					  </el-form-item>
				  </el-form>
					<el-dialog v-bind:visible.sync="medicineVisible" append-to-body class='prescription-dialog' v-bind:show-close='false'>
					  <el-input placeholder="药品名称/助记码" v-model="medicine.name" slot='title' size='small'>
							<el-button slot="append" icon="el-icon-search" v-on:click='medicineIndex(1)'></el-button>
							<el-button slot="prepend" type='danger' v-on:click='medicineVisible = false'>关闭</el-button>
						</el-input>
						<el-table v-bind:data="medicine.data" max-height="280">
							<el-table-column fixed prop="drugName" label="名称" show-overflow-tooltip></el-table-column>
							<el-table-column prop="drugCode" label="批号" show-overflow-tooltip></el-table-column>
							<el-table-column prop="manufacturer" label="生产厂家" show-overflow-tooltip></el-table-column>
							<el-table-column prop="packageSpec" label="规格" show-overflow-tooltip></el-table-column>
							<el-table-column label="操作" width='100'>
								<template slot-scope='scope'>
									<el-button type='primary' size='small' v-on:click='medicineAdd(scope.row)' v-bind:disabled='addForm.medicines.filter((item) => {return item.id == scope.row.id}).length > 0'>加入处方</el-button>
								</template>
							</el-table-column>
						</el-table>	
						<el-pagination layout="prev, pager, next" v-on:current-change='medicineIndex' v-bind:total="medicine.total" align='center' class='mt-10 mb-10'></el-pagination>
				  </el-dialog>
				</el-dialog>
			</el-main>
		</el-container>
	</div>
</template>	

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>
