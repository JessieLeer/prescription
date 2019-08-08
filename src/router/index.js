import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/index.vue'
import Waitings from '@/views/waitings/index.vue'
import Visiting from '@/views/visiting/index.vue'
import Finish from '@/views/finish/index.vue'
import Inquiry from '@/views/inquiry/index/index.vue'
import Inquiry1 from '@/views/inquiry/index1/index.vue'
import InquiryShow from '@/views/inquiry/show/index.vue'
import Suggestion from '@/views/suggestion/index.vue'
import Prescription from '@/views/prescription/index.vue'
import Reply from '@/views/reply/index.vue'
import Data from '@/views/data/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
		{
      path: '/',
      name: 'index',
      component: Login
    },
		{
      path: '/login',
      name: 'login',
      component: Login
    },
		{
			path: '/waitings',
			name: 'waitings',
			component: Waitings
		},
		{
			path: '/visiting/:imuser/:diagnose',
			name: 'visiting',
			component: Visiting
		},
		{
			path: '/finish',
			name: 'finish',
			component: Finish
		},
		{
			path: '/inquiry',
			name: 'inquiry',
			component: Inquiry
		},
		{
			path: '/inquiry1',
			name: 'inquiry1',
			component: Inquiry1
		},
		{
			path: '/inquiry/show/:id',
			name: 'inquiryShow',
			component: InquiryShow
		},
		{
			path: '/suggestion',
			name: 'suggestion',
			component: Suggestion
		},
		{
			path: '/prescription',
			name: 'prescription',
			component: Prescription
		},
		{
			path: '/reply',
			name: 'reply',
			component: Reply
		},
		{
			path: '/data',
			name: 'datas',
			component: Data
		}
  ]
})
