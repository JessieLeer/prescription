import Vue from 'vue'
import axios from 'axios'

// initial state
const state = {
	serverUrl: '',
	hardwareId: '0cb4b19661f0a66df57c386e420ccecc',
	videoShow: false
}

// getters
const getters = {
}

// actions
const actions = {
	
}

// mutations
const mutations = {
	handleVideo(state,status) {
		state.videoShow = status
	},
}

export default {
  state,
  getters,
  actions,
  mutations
}