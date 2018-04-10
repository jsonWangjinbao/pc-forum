<template lang="html">
  <el-table v-loading="loading" :data="tableData" style="width: 100%" :show-header="false">
    <el-table-column label="头像" width="50">
      <template slot-scope="scope">
        <img :src="scope.row.author.avatar_url" alt="" style="width:30px;height:30px;border-radius:3px">
      </template>
    </el-table-column>
    <el-table-column label="标签" width="100">
      <template slot-scope="scope">
        <span class="put_top" v-show="scope.row.top">置顶</span>
        <span class="put_good" v-show="scope.row.good">精华</span>
        <span class="topiclist-tab" v-show="scope.row.tab === 'good'">精华</span>
        <span class="topiclist-tab" v-show="scope.row.tab === 'share'">分享</span>
        <span class="topiclist-tab" v-show="scope.row.tab === 'ask'">问答</span>
        <span class="topiclist-tab" v-show="scope.row.tab === 'job'">招聘</span>
      </template>
    </el-table-column>
    <el-table-column label="标题" width="800">
      <template slot-scope="scope">
        <router-link :to="{ name: 'detail', params: {id:scope.row.id} }">{{scope.row.title}}</router-link>
      </template>
    </el-table-column>
    <el-table-column prop="last_reply_at" label="发布时间">
    </el-table-column>
  </el-table>
</template>

<script>
import {mapState,mapMutations} from 'vuex'

export default {
  name: 'topicBlock',
  data() {
    return {
      tableData: []
    }
  },
  mounted(){
    if(this.userType == 1){
        this.tableData = this.userTopics.recent_topics
    }else if(this.userType == 2){
        this.tableData = this.userTopics.recent_replies
    }else{
        this.tableData = this.userTopics
    }
    if(this.tableData!==undefined){
      if(this.tableData.constructor!== Array){
        this.tableData = []
      }
    }
  },
  computed: {
    ...mapState([
      'userTopics'
    ])
  },
  props: ['loading','userType'],
  watch: {
    userTopics(val,oldval) {
      if(this.userType == 1){
          this.tableData = this.userTopics.recent_topics
      }else if(this.userType == 2){
          this.tableData = this.userTopics.recent_replies
      }else{
          this.tableData = this.userTopics
      }
      if(this.tableData!==undefined){
        if(this.tableData.constructor!== Array){
          this.tableData = []
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped="">
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
.topiclist-tab {
    background-color: #e5e5e5;
    color: #999;
    padding: 2px 4px;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -o-border-radius: 3px;
    font-size: 12px;
}
</style>
