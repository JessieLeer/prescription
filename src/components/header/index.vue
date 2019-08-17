<template>
  <el-header class='w-100 mb-10'>
		<el-menu class="el-menu-demo" mode="horizontal" >
			<el-menu-item>
			  <img src='../../assets/image/logo.png' width='50'> 药盈处方云平台
			</el-menu-item>
			<el-submenu index="2" style='float: right;'>
			  <template slot="title">
					{{user.username}}
				</template>
				<el-menu-item class='f-tac'>
				  <el-switch v-model="status" v-on:change='toggleStatus' active-text="在线" inactive-text="离线"></el-switch>
				</el-menu-item>
        <el-menu-item class='f-tac' v-on:click='logout'>退出登录</el-menu-item>
			</el-submenu>
		</el-menu>
	</el-header>
</template>

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>