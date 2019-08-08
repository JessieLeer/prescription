<template>
  <div class='main'>
	  <el-alert title="问诊结束" type="success" show-icon v-bind:closable='false'></el-alert>
		<br>
		<el-button type='primary' size='small' v-on:click='go("/waitings")'>继续问诊</el-button>
		<el-button type='default' size='small' v-on:click='go("/inquiry")'>已问诊列表</el-button>
	</div>
</template>

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>
