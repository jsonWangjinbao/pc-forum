<template lang="html">
  <div style="position:relative">
    <div class="content">
      <div class="panel">
        <div class="header">
          <ul class="breadcrumb">
            <li>
              <router-link :to="{ name: 'index', params: {} }">主页</router-link>
              <span class="divider">/</span>
            </li>
          </ul>
        </div>
        <div class="inner userInfo">
          <div class="user_big_avatar">
            <img :src="userInfo.avatar_url" alt="" :title="userInfo.loginname" class="user_avatar">
          </div>
          <a class="dark">{{userInfo.loginname}}</a>
          <div class="user_profile">
            <ul class="unstyled">
              <li><span class="big">{{userInfo.score}}</span>积分</li>
              <li>
                <a class="dark" @click="moreCollect" v-if="collectData.length>0">
                  <span class="big collect-topic-count">{{collectData.length}}</span>个收藏话题
                </a>
              </li>
            </ul>
          </div>
          <p class="col_fade">注册时间 {{use.formatDate(userInfo.create_at)}}</p>
        </div>
      </div>
      <div class="panel">
        <div class="header">
          <span class="col_fade">最近创建的话题</span>
        </div>
        <topicBlock :userType='1'></topicBlock>
        <div class="more" >
          <a @click="showMore($route.params.loginname,'1')">查看更多»</a>
        </div>
      </div>
      <div class="panel">
        <div class="header">
          <span class="col_fade">最近参与的话题</span>
        </div>
        <topicBlock :userType='2'></topicBlock>
        <div class="more" >
          <a @click="showMore($route.params.loginname,'2')">查看更多»</a>
        </div>
      </div>
    </div>
    <sideBar :sideInfo="userInfo"></sideBar>
  </div>
</template>

<script>
import sideBar from '@/components/sideBar'
import topicBlock from '@/views/user/topicBlock'
import {mapState,mapMutations} from 'vuex'
import axios from 'axios'
import api from '@/api'

export default {
  name: 'personal',
  components: {
    sideBar,topicBlock
  },
  data() {
    return {
      userInfo: {},
      collectData: {}
    }
  },
  computed: {
    ...mapState([
      'token','user'
    ])
  },
  beforeRouteEnter(to,from,next){
    next(vm => {
      if(!to.params.loginname){
        vm.userInfo = {}
        return false
      }
      vm.getUser(to.params.loginname)
      // vm.getCollect(vm.user.loginname)
    })
  },
  mounted() {
    // this.getUser(this.$route.params.loginname)
    this.getCollect(this.$route.params.loginname)
  },
  methods: {
    ...mapMutations([
      'SET_USER_TOPICS'
    ]),
    getUser(loginname){
      axios.get(api.personal(loginname)).then(res => {
        if(res.data.success){
          this.userInfo = res.data.data
          for(var key in this.userInfo.recent_topics){
            this.userInfo.recent_topics[key].last_reply_at = this.use.formatDate(this.userInfo.recent_topics[key].last_reply_at)
          }
          for(var key in this.userInfo.recent_replies){
            this.userInfo.recent_replies[key].last_reply_at = this.use.formatDate(this.userInfo.recent_replies[key].last_reply_at)
          }
          this.userInfo.recent_topics = this.userInfo.recent_topics.slice(0,5)
          this.userInfo.recent_replies = this.userInfo.recent_replies.slice(0,5)
          this.SET_USER_TOPICS(this.userInfo)
          localStorage.setItem('userTopics',JSON.stringify(this.userInfo))
        }
      })
    },
    getCollect(loginname) {
      axios.get(api.getCollect(loginname)).then(res => {
        if(res.data.success){
          this.collectData = res.data.data
        }
      }).catch((err) => {
        this.$message.error('加载收藏列表失败！'+err)
      })
    },
    moreCollect() {
      this.SET_USER_TOPICS(this.collectData)
      localStorage.setItem('userTopics',JSON.stringify(this.collectData))
      this.$router.push({name:'userTopics',params:{userType:'3'}})
    },
    showMore(loginname,Type) {
      axios.get(api.personal(loginname)).then(res => {
        if(res.data.success){
          this.userInfo = res.data.data
          for(var key in this.userInfo.recent_topics){
            this.userInfo.recent_topics[key].last_reply_at = this.use.formatDate(this.userInfo.recent_topics[key].last_reply_at)
          }
          for(var key in this.userInfo.recent_replies){
            this.userInfo.recent_replies[key].last_reply_at = this.use.formatDate(this.userInfo.recent_replies[key].last_reply_at)
          }
          this.SET_USER_TOPICS(this.userInfo)
          localStorage.setItem('userTopics',JSON.stringify(this.userInfo))
          this.$router.push({name:'userTopics',params:{userType:Type}})
        }
      })
    },
    checkLogin() {
			if(!this.userInfo.loginname){
				this.$router.push({name:'login'});
				return false;
			}else{
				return true;
			}
		},
    checkTopics(type) {
			if(!this.checkLogin()){
				return;
			}
			this.SET_USER_TOPICS(type);
			localStorage.setItem('userTopics',JSON.stringify(type));
		}
  }
}
</script>

<style lang="scss" scoped>
  .content{
    padding: 0;
    margin-right: 305px;
    a{
      cursor: pointer;
    }
    .panel{
      margin-bottom: 13px;
      .header.topic_header,.inner {
        background-color: #fff;
      }
      .header{
        padding: 10px;
        background-color: #f6f6f6;
        border-radius: 3px 3px 0 0;
        .breadcrumb {
          padding: 0;
          margin: 0;
          border: none;
          background: 0 0;
          text-shadow: none;
          a{
            color: #80bd01;
            font-size: 14px;
            cursor: pointer;
          }
          .divider{
            padding: 0 5px;
            color: #ccc;
          }
        }
      }
      .inner{
        padding: 10px;
        border-top: 1px solid #e5e5e5;
        .user_big_avatar {
          float: left;
          margin-right: 10px;
          img{
            width: 40px;
            height: 40px;
            border-radius: 3px;
          }
        }
        a{
          color: #778087;
          text-decoration: none;
        }
        .user_profile {
          margin-top: 20px;
          clear: left;
          .big {
            font-size: 14px;
          }
        }
        .col_fade {
          color: #ababab;
        }
      }
      .more{
        padding: 10px;
        background: #fff;
      }
    }
  }
</style>
