<template>
  <div>
	  <cheader></cheader>
    <el-container>
		  <el-main class='no-pt'>
			  <el-row>
				  <el-col :span='12'>
					  <el-page-header @back="back" content="问诊详情" class='back'></el-page-header>
					</el-col>
					<el-col :span='12' class='f-tar'>
					  <el-button type="warning" icon="el-icon-close" size='mini' class='end' v-on:click='finish'>结束问诊</el-button>
					</el-col>
				</el-row>
				<hr color='#e6e6e6' size='1'>
			  <el-row :gutter="20">
				  <el-col :span='5' class='patient-wrapper'>
					  <div ref='patientWrapper' class='f-oa'>
							<el-form class='form f-tal' label-width='80px' ref="form" :model="form" v-bind:rules="rules">
								<el-form-item class='f-pr'>
									<el-avatar src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" slot='label' size='small' class='avatar'></el-avatar>
									<b>患者病例</b>
								</el-form-item>
								<el-form-item label="姓名">
									{{diainfo.name}}
									<el-button type="text" size='small' v-on:click='historiesIndex(1)'>(历史问诊)</el-button>
								</el-form-item>
								<el-form-item label='性别'>{{diainfo.gender}}</el-form-item>
								<el-form-item label='电话'>{{diainfo.phone}}</el-form-item>
								<el-form-item label='日期'>{{diainfo.date}}</el-form-item>
								<el-form-item label='问诊药店'>{{diainfo.shopName}}</el-form-item>
								<el-form-item label='过敏史'>
									{{diainfo.checks}}
								</el-form-item>
								<el-form-item label='主诉'>{{diainfo.mainSymptom}}</el-form-item>
								<el-form-item label='初步诊断' prop='diagnosis'>
									<el-autocomplete v-model="form.diagnosis" v-bind:fetch-suggestions="querySearch" v-bind:trigger-on-focus="false" v-on:select="handleSelect" type='textarea'></el-autocomplete>
								</el-form-item>
								<br>
								<el-form-item label='诊疗意见' prop='suggestion'>
									<el-autocomplete v-model="form.suggestion" v-bind:fetch-suggestions="querySearch1" v-bind:trigger-on-focus="false" v-on:select="handleSelect1" type='textarea'></el-autocomplete>
								</el-form-item>
								<br>
								<el-form-item>
									<el-button type='primary' size='small' v-on:click='saveCase("form")' v-bind:disabled='prescriptionUrl != ""' v-bind:title='prescriptionUrl == "" ? "" : "处方已经提交，不可再更改病例"'>保存病例</el-button>
								</el-form-item>
							</el-form>
						</div>	
					</el-col>
					<el-col :span='12' class='chat-wrapper' style='padding-left: 0; padding-right: 0'>
					  <div class='message-wrapper' ref='messageWrapper'>
						  <ul class="infinite-list">
								<li v-for='(item,index) in messages' v-bind:key='index' class="infinite-list-item f-cb" v-bind:class='item.type == "receive" ? "f-tal" : "f-tar"'> 
								  <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" v-bind:class='item.type == "receive" ? "f-fl" : "f-fr"' class='chat-avatar'></el-avatar>
									<i class='message f-fsn f-ib f-fs2' v-bind:class='item.type == "receive" ? "message-receive" : "message-send"' v-if='item.chatType == "text"' v-html='item.data'></i>
									<a v-bind:href='item.data' target='_blank' v-if='item.chatType == "image"' class='message-image f-ib' v-bind:class='item.type == "receive" ? "message-receive" : "message-send"'>
									  <img v-bind:src='item.data' class='chat-image'>
									</a>
								</li>
							</ul>
						</div>
						<el-card class="input-wrapper" shadow="never">
							<header slot="header" class="f-cb">
							  <el-row>
								  <el-col :span='18' class='f-tal'>
									  <label>
									    <input v-on:change="sendImageMessage" ref="imageInput" type="file" class='f-dn'>
										  <i class='chat-opera el-icon-picture-outline f-csp mr-10' title='发送图片'></i>
										</label>
										<i class='chat-opera el-icon-microphone f-csp mr-10' title='语音通话' v-on:click='rtAudioCall'></i>
										<i class='chat-opera el-icon-video-camera f-csp mr-10' title='视频通话' v-on:click='rtVideoCall'></i>
									</el-col>
									<el-col :span='6' class='f-tar'>
									  <i class='chat-opera el-icon-document f-csp' title='快捷回复' v-on:click='quickApplyShow = true'></i>
									</el-col>
								</el-row>
							</header>
							<div>
								<el-input type="textarea" rows='3' v-model="editing" @keyup.native.enter='sendPrivateText' class='text-input'></el-input>
								<section class='f-tar'>
						      <el-button class='mr-20' type='primary' v-on:click='sendPrivateText' size='small' v-bind:disabled='editing == "" ? true : false'>发送</el-button>
								</section>
							</div>
						</el-card>
					</el-col>
					<el-col :span='7'>
					  <el-card class="medicine-wrapper box-card" shadow='never'>
							<header slot="header" class="medicine-header">
								<h4 class='f-tal'>处方信息</h4>
								<el-button class='opera' type="text" v-on:click='medicine.show = true; medicineIndex(medicine.page)' v-if='prescriptionUrl == ""'>手动添加药品</el-button>
							</header>
							
							<div ref='prescription' class='pr-20 f-oa' v-if='prescriptionUrl == ""'>
								<el-form v-for='(item, index) in prescriptions' v-bind:key='index' label-width='40px' class='prescription-form f-tal'>
									<el-form-item class='no-mb f-cb f-fwb' label-width='0'>
										{{item.drugName}}
										<i class="el-icon-delete f-csp f-fr" title='移除' v-on:click='prescriptionRemove(item)'></i>
									</el-form-item>
									<el-form-item label='批号' class='no-mb'>{{item.drugCode}}</el-form-item>
									<el-form-item label='厂商' class='no-mb'>{{item.manufacturer}}</el-form-item>
									<el-form-item label='规格' class='no-mb'>{{item.packageSpec}}</el-form-item>
									<el-form-item label-width='0' class='medicine-useage no-mb'>
										<el-input placeholder='用法用量' v-model='item.dosageUsage' size='small' class='useage-text f-fl'></el-input>
										<el-input-number v-model="item.drugNumber" size='small' v-bind:min='1' controls-position="right" class='useage-count f-fr'></el-input-number>
									</el-form-item>
								</el-form>
								<el-button type='primary' size='small' v-if='prescriptions.length > 0' v-on:click='prescriptionSave'>提交处方</el-button>
							</div>
							<el-image v-bind:src="prescriptionUrl" fit="fit" v-else></el-image>
						</el-card>
					</el-col>
				</el-row>
				<el-dialog title="历史问诊" :visible.sync="dialogHistoryVisible" class='history'>
					<el-table v-bind:data="history.data" v-bind:span-method="prescriptionSpanMethod" max-height="500">
						<el-table-column label="问诊时间" align='center'>
							<template slot-scope='scope'>
								{{scope.row.createTime.substr(0,10)}}
							</template>
						</el-table-column>
						<el-table-column prop='diagnose' label="病症" align='center' show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop='diagnoseContent' label="诊疗意见" align='center' show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="drugName" label="药品名" align='center' show-overflow-tooltip></el-table-column>
						<el-table-column prop="drugManu" label="厂商" align='center' show-overflow-tooltip> </el-table-column>
						<el-table-column prop="drugSpec" label="规格" align='center'></el-table-column>
						<el-table-column prop="dosageUsage" label="用法用量" align='center' show-overflow-tooltip></el-table-column>
					</el-table>
				  <el-pagination layout="prev, pager, next" v-bind:total="history.total"></el-pagination>
				</el-dialog>
				<el-dialog v-bind:visible.sync="quickApplyShow" width="50%" class='quick-apply'>
				  <header slot="title">
						<h4>快捷回复<small class='f-fwn'>(可在个人中心内管理快捷回复)</small></h4>
					</header>
					<ul class='quick-apply-wrapper f-tal'>
					  <li v-for='(item,index) in quickApplies' v-bind:key='index' class='apply f-csp' v-on:click='editing = item.content; quickApplyShow = false'>{{index+1}}.{{item.content}}</li>
					</ul>
				</el-dialog>
				<el-dialog v-bind:visible.sync="medicine.show" width="50%" v-bind:show-close='false' class='quick-apply'>
				  <el-input placeholder="药品名称/助记码" v-model="medicine.name" slot='title' size='small' @keyup.native.enter='medicineIndex(1)'>
					  <el-button slot="prepend" v-on:click='medicine.show = false'>关闭</el-button>
						<el-button slot="append" icon="el-icon-search" v-on:click='medicineIndex(1)'></el-button>
					</el-input>
				  <el-table v-bind:data="medicine.data" max-height="280">
					  <el-table-column fixed prop="drugName" label="名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="drugCode" label="批号" show-overflow-tooltip></el-table-column>
						<el-table-column prop="manufacturer" label="生产厂家" show-overflow-tooltip></el-table-column>
						<el-table-column prop="packageSpec" label="规格" show-overflow-tooltip></el-table-column>
						<el-table-column label="操作" width='100'>
						  <template slot-scope='scope'>
							  <el-button type='primary' size='small' v-on:click='prescriptionAdd(scope.row)' v-bind:disabled='prescriptions.filter((item) => {return item.id == scope.row.id}).length > 0'>加入处方</el-button>
							</template>
						</el-table-column>
					</el-table>	
					<el-pagination
						layout="prev, pager, next"
						v-on:current-change='medicineIndex'
						v-bind:total="medicine.total">
					</el-pagination>
				</el-dialog>
				<VueDragResize :isActive="true" v-bind:w="200" v-bind:h='100' v-on:resizing="resize" v-on:dragging="resize" v-show="audioShow" class='bg-white'>
				  <section class='pt-5 pb-5 f-tar'>
				    <el-button type="warning" icon="el-icon-close" circle v-on:click='handleAudioEnd' class='video-close' size='small'> </el-button>
					</section>
				  <section class='f-tac f-fs2'>语音通话中...</section>
					<!--<section class='f-tac'>{{callDuration.minute}} : {{callDuration.second}}</section>-->
				</VueDragResize>
				<VueDragResize :isActive="true" v-bind:w="width" v-bind:h='height' v-on:resizing="resize" v-on:dragging="resize" v-show="videoShow" class='bg-white'>
				  <section class='pt-5 pb-5 f-tar'>
						<el-button type="warning" icon="el-icon-close" circle v-on:click='handleVideoEnd' class='video-close' size='small'> </el-button>
						<el-button type="success" circle v-on:click='minimize' class='video-close' size='small' icon='el-icon-minus'></el-button>
						<el-button type="primary" circle v-on:click='reduction' class='video-close' size='small' icon='el-icon-full-screen'></el-button>
					</section>
          <video id="v1" autoplay class='w-100'></video>
        </VueDragResize>
			</el-main>
	  </el-container>
	</div>
</template>

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>