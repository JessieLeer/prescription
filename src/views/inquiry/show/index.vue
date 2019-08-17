<template>
  <div>
		<cheader></cheader>
		<el-container class='mt-20'>
		  <caside active=''></caside>
		  <el-main class='p-0'>
			  <el-row>
				  <el-col :span='24' class='f-tar'>
			      <el-button type='text' v-on:click='back'>返回上级</el-button>
					</el-col>
				</el-row>
				<p>{{check ? '审核原因:' + message: ''}}</p>
			  <el-image v-bind:src="src + '?t=' + Date.parse(new Date())"></el-image>
			</el-main>
		</el-container>
	</div>
</template>

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>
