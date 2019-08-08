<template>
  <div>
		<cheader></cheader>
		<el-container class='mt-20'>
		  <caside active=''></caside>
		  <el-main class='p-0'>
			  <el-image v-bind:src="src"></el-image>
			</el-main>
		</el-container>
	</div>
</template>

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>
