<template>
  <el-aside>
	  <el-menu v-bind:default-active="active" router @open="handleOpen" @close="handleClose">
			<el-menu-item index="/waitings">
        <h4 slot="title">待接诊列表</h4>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <h4>已问诊列表</h4>
        </template>
        <el-menu-item index="/inquiry">已开处方</el-menu-item>
				<el-menu-item index="/inquiry1">未开处方</el-menu-item>
      </el-submenu>
			<el-submenu index="2">
        <template slot="title">
          <h4>个人中心</h4>
        </template>
        <el-menu-item index="/suggestion">诊疗意见管理</el-menu-item>
				<el-menu-item index="/prescription">处方模版管理</el-menu-item>
				<el-menu-item index="/reply">快捷回复管理</el-menu-item>
				<el-menu-item index="/data">个人资料管理</el-menu-item>
      </el-submenu>
    </el-menu>
	</el-aside>
</template>

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>