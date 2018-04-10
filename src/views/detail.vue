<template lang="html">
  <div style="position:relative">
    <div class="content">
      <!-- 内容 -->
      <div class="panel">
        <div class="header topic_header">
          <span class="topic_full_title">
            <span class="put_top" v-show="dataRes.top">置顶</span>
            <span class="put_good" v-show="dataRes.good">精华</span>
            {{dataRes.title}}
          </span>
          <div class="changes clearfix">
            <span> 发布于 {{createTime}} 天前</span>
            <span> 作者 {{dataRes.author.loginname}}</span>
            <span> {{dataRes.visit_count}} 次浏览</span>
            <span> 最后一次编辑是 {{use.formatDate(dataRes.last_reply_at)}}</span>
            <span> 来自 {{dataRes.tab}}</span>
            <el-button :type="dataRes.is_collect ? 'message':'success'" size="small" class="pull-right" @click="collectTopic">{{dataRes.is_collect?'取消收藏':'收藏'}}</el-button>
          </div>
        </div>
        <div class="inner topic">
          <div class="topic_content" v-html="dataRes.content"></div>
        </div>
      </div>
      <!-- 评论 -->
      <div class="panel">
        <div class="header">
          <span class="col_fade">{{topic.reply_count}} 回复</span>
        </div>
        <div class="reply_area" v-for="(value,index) in topic.replies">
          <div class="author_content">
            <router-link :to="{ name: '', params: {} }" class="user_avatar">
              <img :src="value.author.avatar_url" alt="">
            </router-link>
            <div class="user_info">
              <router-link :to="{ name: '', params: {} }" class="dark reply_author">{{value.author.loginname}}</router-link>
              <router-link :to="{ name: '', params: {} }" class="reply_time">{{index+1}}楼•{{use.formatDate(value.create_at)}}</router-link>
              <span class="reply_by_author" v-if="topic.author.loginname==value.author.loginname">作者</span>
            </div>
            <div class="user_action">
              <span class="like">
                <i :class="[value.is_uped == false ? 'likesvg' : 'likedsvg']" title="喜欢" @click='setUp(value.id,index,value.author.loginname)'></i>
                <span class="up-count">{{value.ups.length}}</span>
              </span>
              <span class="response">
                <i class="response-i" title="回复" :value="index"></i>
              </span>
            </div>
          </div>
          <div class="rely_content" v-html="value.content"></div>
        </div>
      </div>
      <!-- 回复 -->
      <div class="panel parent">
        <div class="header">
          <span class="col_fade">添加回复</span>
        </div>
        <div class="inner reply">
          <!-- <VueMarkdown :source="sendContent"></VueMarkdown> -->
          <!-- <textarea name="name" rows="8" cols="80" v-model="sendContent"></textarea> -->
          <div class='markdown_editor in_editor'>
            <div class='markdown_in_editor'>
              <textarea class='editor' name='t_content' placeholder='文章支持 Markdown 语法, 请注意标记代码'></textarea>
              <div class='editor_buttons'>
                <input type="submit" class='span-primary submit_btn' data-loading-text="提交中" value="提交">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <sideBar :sideInfo="topic.author"></sideBar>
  </div>
</template>

<script>
// import VueMarkdown from 'vue-markdown'
import sideBar from '@/components/sideBar'
import axios from 'axios'
import api from '@/api'
import {mapState,mapMutations} from 'vuex'

export default {
  name: 'detail',
  data() {
    return {
      isloading: false,
      dataRes: {
        author: {}
      },
      createTime: '',
      sendContent: '',
      replyId: '',
      sideInfo: {}
    }
  },
  components: {
    sideBar
  },
  beforeRouteEnter(to,from,next) {
    next(vm => {
      window.scrollTo(0,0)
      vm.getTopic(to.params.id)
    })
  },
  mounted() {
    let editor = new Editor();
    editor.render();
    let that = this
    document.querySelectorAll('.span-primary')[0].onclick=function(){
      that.sendContent=marked(editor.codemirror.getValue())
      that.sendComm()
    }
    $('.panel').on('click','.response-i',function(e) {
      if(!that.checkLogin()){
        return
      }
      let index=$(e.target).attr('value')
      that.sendContent ='@'+ that.topic.replies[index].author.loginname+' '
      that.replyId = that.topic.replies[index].id
      editor.codemirror.setValue(that.sendContent)
    })
  },
  computed: {
    ...mapState([
      'user','token','topic'
    ])
  },
  methods: {
    ...mapMutations([
      'SET_TOPIC'
    ]),
    getTopic(id) {
      this.isLoading = true
      axios.get(api.getTopic(id),{
        params: {
          accesstoken: this.token
        }
      }).then(res => {
        if(res.data.success){
          this.isLoading = false
          this.dataRes = res.data.data
          console.log(res.data.data)
          this.SET_TOPIC(res.data.data)
          this.createTime = this.use.formatDate(this.dataRes.create_at)
        }
      }).catch(err => {
        this.$message.error('加载失败！')
      })
    },
    checkLogin() {
      if(!this.token) {
        this.$message({
          message: '您还没有登陆呦',
          type: 'warning'
        })
        return false
      }
      return true
    },
    setUp(id,index,loginname) {
      if(!this.checkLogin()) {
        return
      }
      if(loginname === this.user.loginname) {
        this.$message({
          message: '不能给自己点赞呦',
          type: 'warning'
        })
        return
      }
      axios.post(api.upsComm(id),{
        accesstoken: this.token
      }).then(res => {
        if(res.data.success){
          if(res.data.action === 'up'){
            this.topic.replies[index].is_uped = true
            this.$message({
              message: '点赞成功！',
              type: 'success'
            })
            this.topic.replies[index].ups.length++
          }else {
            this.topic.replies[index].is_uped = false
            this.$message({
              message: '取消点赞成功！',
              type: 'success'
            })
            this.topic.replies[index].ups.length--
          }
        }
      }).catch(err => {
        this.$message.error('操作失败：'+err)
      })
    },
    sendComm() {
      if(!this.checkLogin()){
        return
      }
      if(this.sendContent.trim() === ''){
        this.$message({
          message: '不能发送空回复哦',
          type: 'warning'
        })
        return
      }
      axios.post(api.createComm(this.topic.id),{
        accesstoken: this.token,
        content: this.sendContent,
        reply_id: this.replyId
      }).then(res => {
          let date = new Date();
          this.topic.replies.push({
            author: {
                avatar_url: this.user.avatar_url,
                loginname: this.user.loginname,
            },
            content: this.sendContent,
            id: res.data.reply_id,
            is_uped: false,
            reply_at: date.getTime(),
            ups: []
          })
          this.$message({
            message: '发表成功！',
            type: 'success'
          })
      }).catch(res => {
        this.$message.error('发表失败：'+res)
      })
    },
    collectTopic() {
        if(!this.token) {
            this.$message({
              message: '您还没有登陆呦',
              type: 'warning'
            })
            return
        }
        axios.post(api.selCollect(), {
           accesstoken: this.token,
           topic_id: this.dataRes.id,
        }).then(res => {
           if (res.data.success) {
             this.$message({
               message: '收藏成功！',
               type: 'success'
             })
              this.dataRes.is_collect = true;
           } else {
           axios.post(api.delCollect(), {
              accesstoken: this.token,
              topic_id: this.dataRes.id,
           }).then(res => {
              if (res.data.success) {
                this.$message({
                  message: '取消收藏成功！',
                  type: 'success'
                })
                 this.dataRes.is_collect = false;
              }
            })
           }
        })
      },
  }
}
</script>

<style lang="scss" scoped>
.content{
  padding: 0;
  margin-right: 305px;
  .panel {
    margin-bottom: 13px;
    .header.topic_header,.inner {
      background-color: #fff;
    }
    .header {
      padding: 10px;
      background-color: #f6f6f6;
      border-radius: 3px 3px 0 0;
      .topic_full_title {
        font-size: 22px;
        font-weight: 700;
        margin: 8px 0;
        display: inline-block;
        vertical-align: bottom;
        width: 75%;
        line-height: 130%;
        .put_good, .put_top {
          background: #80bd01;
          padding: 2px 4px;
          border-radius: 3px;
          -webkit-border-radius: 3px;
          -moz-border-radius: 3px;
          -o-border-radius: 3px;
          color: #fff;
          font-size: 12px;
        }
      }
      .changes {
        font-size: 12px;
        color: #838383;
        span:before {
          content: "•";
        }
      }
    }
    .inner.post,.inner.reply,.inner.topic,.inner.userinfo{
      padding: 10px;
      border-top: 1px solid #e5e5e5;
    }
    .inner{
      border-radius: 0 0 3px 3px;
      .topic_content {
        margin: 0 10px;
      }
    }
  }
  .panel{
    .header{
      padding: 10px;
      background-color: #f6f6f6;
      border-radius: 3px 3px 0 0;
      .col_fade{
        color: #444;
        font-size: 14px;
      }
    }
    .reply_highlight{
      background-color: #f4fcf0;
    }
    .reply_area{
      padding-right: 10px;
      background: #fff;
      border-top: 1px solid #f0f0f0;
      position: relative;
      padding: 10px 0 10px 10px;
      font-size: 14px;
      overflow: hidden;
      .author_content{
        .user_avatar{
          display: inline-block;
          float: left;
          img{
            width: 30px;
            height: 30px;
            border-radius: 3px;
          }
        }
        .user_info{
          margin-left: 10px;
          display: inline-block;
          .dark{
            color: #666;
            text-decoration: none;
          }
          .reply_author {
            font-size: 12px;
            font-weight: 700;
          }
          .reply_time {
            font-size: 11px;
          }
          .reply_by_author{
            color: #fff;
            background-color: #6ba44e;
            padding: 2px;
            font-size: 12px;
          }
        }
        .user_action{
          float: right;
          margin-right: 20px;
          font-size: 15px;
          .like{
            .likesvg{
              display: inline-block;
              width: 17px;
              height: 17px;
              background: url("../assets/images/upup.svg") no-repeat center;
              background-size: 100%;
              cursor: pointer;
              position: relative;
              top: 1px;
            }
            .likedsvg{
              display: inline-block;
              width: 17px;
              height: 17px;
              background: url("../assets/images/upup2.svg") no-repeat center;
              background-size: 100%;
              cursor: pointer;
              position: relative;
              top: 1px;
            }
          }
          .response{
            i{
              display: inline-block;
              width: 17px;
              height: 17px;
              background: url("../assets/images/reply.svg") no-repeat center;
              background-size: 100%;
              cursor: pointer;
              position: relative;
              top: 2px;
              margin-left: 5px;
            }
          }
        }
      }
      .rely_content{
        padding-left: 50px;
        color: #333;
      }
    }
  }
}
</style>
