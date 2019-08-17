<template>
  <div>
	  <cheader></cheader>
		<el-container class='mt-20'>
		  <caside active='/inquiry'></caside>
		  <el-main>
			  <el-tabs v-model="activeName" @tab-click="index(1)">
					<el-tab-pane label="未审核处方" name="1"></el-tab-pane>
					<el-tab-pane label="审核通过处方" name="2"></el-tab-pane>
					<el-tab-pane label="审核不通过处方" name="3"></el-tab-pane>
				</el-tabs>
				<el-form :inline="true" :model="form" size='small' class='f-tar'>
					<el-form-item>
						<el-input v-model="form.shop" placeholder="药店名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input v-model="form.patient" placeholder="患者名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input v-model="form.condition" placeholder="病情"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="index(1)">查询</el-button>
					</el-form-item>
				</el-form>
				<el-card class="box-card mb-20" v-for='(item,index) in prescription.data' v-bind:key='index' shadow='never'>
					<header slot="header" class="f-cb">
						<b class='f-fl'>{{item.shopName}}</b>
						<time class='f-fr'>{{item.createTime}}</time>
					</header>
					<div class='f-cb'>
						<el-avatar shape="square"  src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" class='avatar f-fl'></el-avatar>
						<el-form :inline="true" class='f-fl ml-20 form f-tal' lebal-width='80px'>
							<el-form-item class='f-fwb'>{{item.memberName}}</el-form-item>
							<el-form-item>{{item.gender}}</el-form-item>
							<el-form-item>{{item.age}}岁</el-form-item>
							<el-form-item>{{item.memberPhone}}</el-form-item>
							<br>
							<el-form-item label='过敏史' class='f-fl'>{{item.checkContent == '' ? '无' : item.checkContent}}</el-form-item>
							<el-form-item label='患者主诉'>{{item.mainSymptom}}</el-form-item>
						</el-form>
						<el-button class='receive f-fr' type="primary" size='small' v-on:click='go(`/inquiry/show/${item.diagnoseId}`)'>查看详情</el-button>
					</div>
				</el-card>
				<el-pagination
					layout="prev, pager, next"
					v-on:current-change='index'
					v-bind:total="prescription.total">
				</el-pagination>
			</el-main>
		</el-container>
	</div>
</template>	

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>