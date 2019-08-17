<template>
  <div>
	  <cheader></cheader>
		<el-container class='mt-20'>
		  <caside active='/data'></caside>
		  <el-main>
			  <el-tabs v-model="activeName">
					<el-tab-pane label="个人信息" name="first">
					  <el-form ref="form" :model="form" label-width="80px" size='small' v-bind:rules='rules' align='left'>
							<el-form-item label="姓名">
								<el-input v-model="form.physicianName" disabled></el-input>
							</el-form-item>
							<el-form-item label="用户名">
								<el-input v-model="form.username" disabled></el-input>
							</el-form-item>
							<el-form-item label="手机号" prop='phone'>
								<el-input v-model="form.phone"></el-input>
							</el-form-item>
							<el-form-item label="简介" prop='intro'>
								<el-input v-model="form.intro" type='textarea'></el-input>
							</el-form-item>
							<el-form-item label="个人成就" prop='history'>
								<el-input v-model="form.history" type='textarea'></el-input>
							</el-form-item>
							<el-form-item label=''>
								<el-button type="primary" v-on:click='updateInfo("form")'>保存</el-button>
							</el-form-item>
						</el-form>
					</el-tab-pane>
					<el-tab-pane label="修改密码" name="second">
					  <el-form :model="form1" status-icon :rules="rules1" ref="form1" label-width="80px" align='left' size='small'>
							<el-form-item label="密码" prop="password_old">
								<el-input type="password" v-model="form1.password_old" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="新密码" prop="password_new">
								<el-input type="password" v-model="form1.password_new" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="确认密码" prop="password_repeat">
								<el-input type="password" v-model="form1.password_repeat" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" v-on:click="updatePass('form1')">提交</el-button>
							</el-form-item>
						</el-form>
					</el-tab-pane>
					<el-tab-pane label="修改头像" name="third">
					  <el-form label-width="80px" align='left' size='small'>
						  <el-form-item>
							  <el-upload class="avatar-uploader" action="nourl" accept=".jpg,.jpeg,.png,.gif" v-bind:http-request='uploadAvatar' v-bind:show-file-list="false">
									<img v-if="form.headImg" v-bind:src="'http://chufang.ysk360.com' + form.headImg" class="avatar" width='100'>
									<i v-else class="el-icon-plus avatar-uploader-icon"></i>
								</el-upload>
							</el-form-item>
							<el-form-item>
							  <el-button type='primary' size='small' v-on:click='updateAvatar'>保存</el-button>
							</el-form-item>	
						</el-form>	
					</el-tab-pane>
				</el-tabs>
			</el-main>
		</el-container>
	</div>
</template>

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>

