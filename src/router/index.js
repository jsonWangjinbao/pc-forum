import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import Detail from '@/views/detail'
import Personal from '@/views/user/personal'
import UserTopics from '@/views/user/UserTopics'
import Post from '@/views/post'
import Message from '@/views/user/message'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },{
      path: '/detail/:id',
      name: 'detail',
      component: Detail
    },{
      path: '/personal/:loginname',
      name: 'personal',
      component: Personal
    },{
      path: '/user/userTopics/:userType',
      name: 'userTopics',
      component: UserTopics
    },{
      path: '/post',
      name: 'post',
      component: Post
    },{
      path: '/message',
      name: 'message',
      component: Message
    }
  ]
})
