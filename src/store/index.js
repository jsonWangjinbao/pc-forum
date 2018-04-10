import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    type: 'all',
    rollDown: false,
    checkAside: false,
    topic: {},
    user: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')) || {},
    token: localStorage.getItem('token') || '',
    userTopics: localStorage.getItem('userTopics') && JSON.parse(localStorage.getItem('userTopics')) || {},
    toast: {
      isShow: false,
      content: '这是一个toast',
      duration: 1000,
    },
    modifyTopic: '',
    asdAct: 'index',
    userResList:{},
  },
  mutations: {
    SET_USER_RESLIST(state,obj){
      state.userResList = obj;
    },
    SET_TYPE(state, type) {
      state.type = type;
    },
    SET_ROLLDOWN(state, bool) {
      state.rollDown = bool;
    },
    SET_TOPIC(state, obj) {
      state.topic = obj;
    },
    CHECK_ASIDE(state, bool) {
      state.checkAside = bool;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER_TOPICS(state, obj) {
      state.userTopics = obj;
    },
    SET_TOAST(state, obj) {
      state.toast = obj;
    },
    MODIFY_POST(state, obj) {
      state.modifyTopic = obj;
    },
    SET_ASDACT(state, act) {
      state.asdAct = act;
    }
  }
})
export default store
