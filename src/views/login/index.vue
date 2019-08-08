<template>
  <el-container>
		<el-main>
		  <img src='../../assets/image/logo.png' width='80' class='logo'>
			<el-card class="form">
				<header slot="header" class="clearfix">用户登录</header>
				<el-form ref="form" :model="form" v-bind:rules="rules">
					<el-form-item label="" prop='username'>
						<el-input v-model="form.username" placeholder='用户名'></el-input>
					</el-form-item>
					<el-form-item label="" prop='password'>
						<el-input v-model="form.password" placeholder='密码' type='password'></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="submitForm('form')" class='sub'>登录</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>