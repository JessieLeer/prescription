<template>
  <div>
	  <cheader></cheader>
		<el-container class='mt-20'>
		  <caside active='/suggestion'></caside>
		  <el-main>
			  <el-table ref="table" v-bind:data="suggestion.data" tooltip-effect="dark" @selection-change="handleSelectionChange">
				  <el-table-column type="selection" width="55"></el-table-column><el-table-column prop="content">
					  <template slot="header" slot-scope="scope">
						  <el-button type='primary' size='small' v-on:click='dialogFormVisible = true'>新增模版</el-button>
            </template>
					</el-table-column>
					<el-table-column width='100' align='right'>
					  <template slot="header" slot-scope="scope">
						  <el-button type='danger' size='small' v-on:click='delAll' v-bind:disabled='deletings.length == 0'>批量删除</el-button>
            </template>
					  <template slot-scope='scope'>
						  <el-button type='danger' size='small' v-on:click='del(scope.row.id)'>删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<br>
				<el-pagination layout="prev, pager, next" v-bind:total="suggestion.total"></el-pagination>
				<el-dialog title="新增诊疗意见" :visible.sync="dialogFormVisible" class='suggestion'>
					<el-form ref="form" :model="form" v-bind:rules="rules" class='form'>
						<el-form-item prop='content'>
							<el-input v-model="form.content" type='textarea' rows='4' placeholder='输入诊疗意见内容'></el-input> 
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogFormVisible = false" size='small'>取 消</el-button>
						<el-button type="primary" size='small' v-on:click="save('form')">确 定</el-button>
					</div>
				</el-dialog>
			</el-main>
		</el-container>
	</div>
</template>	

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>