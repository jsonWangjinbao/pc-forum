<template lang="html">
  <div style="position:relative">
    <div class="content">
      <div class="panel">
        <div class="header">
          <ul class="breadcrumb">
            <li>
              <router-link :to="{ name: 'index', params: {} }">主页</router-link>
              <span class="divider">/</span>
              <span>新消息</span>
            </li>
          </ul>
        </div>
        <div class="inner userInfo">
          <div class="cell" v-if="has_not_read_messages.length==0">
            无消息
          </div>
          <div class="cell" v-else v-for="value in has_not_read_messages">
        		<span>
        			<a>{{value.author.loginname}}</a>
        			回复了你的话题
        			<a>{{value.topic.title}}</a>
        		</span>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="header">
          <span class="col_fade">过往消息</span>
        </div>
        <div class="inner">
          <div class="cell" v-for="value in has_read_messages">
            <span>
        			<a>{{value.author.loginname}}</a>
        			回复了你的话题
        			<a>{{value.topic.title}}</a>
        		</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <sideBar :sideInfo="userInfo"></sideBar> -->
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
    sideBar
  },
  data() {
    return {
      msgList: [],
      has_read_messages: [],
      has_not_read_messages: []
    }
  },
  beforeRouteEnter(to,from,next) {
    next(vm => {
      vm.getMsg(vm.token)
    })
  },
  computed: {
    ...mapState([
      'token'
    ])
  },
  methods: {
    getMsg(token) {
        axios.get(api.getMsg(),{
          params: {
            accesstoken: token,
            mdrender: false
          }
        }).then(res => {
          if(res.data.success){
            console.log(res.data.data)
            this.has_read_messages = res.data.data.has_read_messages
            this.msgList = res.data.data.has_read_messages
            this.hasnot_read_messages = res.data.data.hasnot_read_messages
          }
        }).catch(err => {
          this.$message.error('加载消息失败')
        })
      }
  },
}
</script>

<style lang="scss" scoped>
  .content{
    padding: 0;
    margin-right: 305px;
    a{
      color: #08c;
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
        .cell{
          padding: 10px;
          font-size: 14px;
          border-top: 1px solid #f0f0f0;
        }
      }
    }
  }
</style>
