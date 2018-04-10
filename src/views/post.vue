<template lang="html">
  <div style="position:relative">
    <div class="content">
      <div class="panel">
        <div class="header">
          <ul class="breadcrumb">
            <li>
              <router-link :to="{ name: 'index', params: {} }">主页</router-link>
              <span class="divider">/</span>
              <span>发布话题</span>
            </li>
          </ul>
        </div>
        <div class="inner">
          <div class="choose-type">
            选择板块：<el-select v-model="postForm.tab" placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
          </div>
          <div class="title">
            <el-input
              placeholder="标题字数十字以上"
              v-model="postForm.title"
              clearable>
            </el-input>
          </div>
          <div class="topic">
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
    </div>
    <!-- <sideBar :sideInfo="userInfo"></sideBar> -->
  </div>
</template>

<script>
import api from '@/api'
import {mapState,mapMutations} from 'vuex'
import axios from 'axios'

export default {
  name: 'post',
  data() {
    return {
      postForm: {
        tab: '',
        title: '',
        content: ''
      },
      options: [{
          value: 'share',
          label: '分享'
        }, {
          value: 'ask',
          label: '问答'
        }, {
          value: 'job',
          label: '招聘'
        }, {
          value: 'dev',
          label: '测试'
        }],
      isModify: false
    }
  },
  beforeRouteEnter(to,from,next) {
    next(vm => {
      if(vm.modifyTopic){
        vm.$message({
          message: '请填写修改内容',
          type: 'warning'
        })
        vm.isModify = true
        let vContent=vm.modifyTopic.content.replace(/<.*?>/ig,"")
        vm.postForm = {
          tab: vm.modifyTopic.tab,
          title: vm.modifyTopic.title,
          content: vContent
        }
      }else {
        vm.$message({
          message: '请填写发布内容呦',
          type: 'warning'
        })
      }
    })
  },
  mounted() {
    let editor = new Editor();
    editor.render();
    let that = this
    document.querySelectorAll('.span-primary')[0].onclick=function(){
      that.postForm.content=marked(editor.codemirror.getValue())
      that.sendPost()
    }
  },
  computed: {
    ...mapState([
      'token','modifyTopic','user'
    ])
  },
  methods: {
    ...mapMutations([
      'SET_TOAST','MODIFY_POST'
    ]),
    checkForm() {
      for(var index in this.postForm){
        if(!this.postForm[index]){
          return false
        }
      }
      if(this.postForm.title.trim().length < 10 || this.postForm.title.trim().length > 255){
        return false
      }
      return true
    },
    sendPost() {
      if(!this.user.loginname){
        this.$router.push({name:'login'})
        return
      }
      if(!this.checkForm()){
        this.$message({
          message: '请按规定填写',
          type: 'warning'
        })
        return false
      }
      let sendObj = {
        accesstoken: this.token,
        title: this.postForm.title,
        tab: this.postForm.tab,
        content: this.postForm.content
      }
      console.log(sendObj)
      if(this.isModify){
        this.modifyPost(sendObj)
        return
      }
      console.log(api)
      axios.post(api.createPost(),sendObj).then(res => {
        this.getResThen(res)
      }).catch(err => {
        this.$message.error('发表失败：'+err)
      })
    },
    modifyPost(sendObj) {
      sendObj.topic_id = this.modifyTopic.id
      axios.post(api.modifyPost(),sendObj).then(res => {
        this.getResThen(res)
        this.isModify = false
        this.MODIFY_POST('')
      }).catch(err => {
        this.$message.error('修改失败：'+err)
      })
    },
    getResThen(res) {
      if(res.data.success){
        this.$message({
          message: '发表成功！',
          type: 'success'
        })
        this.$router.push({
          name:'detail',
          params: {
            id: res.data.topic_id
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content{
  padding: 0;
  margin-right: 305px;
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
      background: #fff;
      .choose-type,.title{
        margin-bottom: 15px
      }
    }
  }
}
</style>
