<template>
  <el-header class='w-100 mb-10'>
		<el-menu class="el-menu-demo" mode="horizontal" >
			<el-menu-item>
			  <img src='../../assets/image/logo.png' width='50'> 药盈处方云平台
			</el-menu-item>
			<el-submenu index="2" style='float: right;'>
			  <template slot="title">
			  	<el-avatar size='small' src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563186125865&di=ea90d027cbcc6c86366674095a1a6932&imgtype=0&src=http%3A%2F%2Fimages.liqucn.com%2Fimg%2Fh1%2Fh991%2Fimg201712091150150_info400X400.jpg"></el-avatar>
					{{user.username}}
				</template>
				<el-menu-item class='f-tac'>
				  <el-switch
						v-model="status"
						v-on:change='toggleStatus'
						active-text="在线"
						inactive-text="离线">
					</el-switch>
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