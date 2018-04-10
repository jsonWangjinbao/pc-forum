<template>
   <div style="position:relative">
     <div class="content">
       <header>
         <span v-for="(value,index) in list" :class="[active == index?'current-tab':'']" @click="changeType(index)">{{value}}</span>
       </header>
       <listBlock :resList="resList" :loading="isLoading" :tableData="tableData"></listBlock>
       <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000" :page-size="pagesize" :current-page="currentPage"></el-pagination>
     </div>
     <sideBar :sideInfo="user">
       <div slot="publicTopic" class="panel">
         <div class="inner">
           <el-button type="primary" @click="$router.push({name:'post'})">发布话题</el-button>
         </div>
       </div>
     </sideBar>
   </div>
 </template>

 <script>
 import listBlock from './listBlock'
 import sideBar from '@/components/sideBar'
 import {mapState,mapMutations} from 'vuex'
 import api from '@/api'
 import axios from 'axios'

 export default {
   name: 'index',
   components: {
     listBlock,sideBar
   },
   data() {
     return {
       page: 1,
       resList: [],
       isLoading: false,
       pagesize: 40,
       currentPage: 1,
       tableData: [],
			 active:'all',
       list: {
         all: '全部',
         good: '精华',
         share: '分享',
         ask: '问答',
         job: '招聘'
       }
     }
   },
    created() {    
      this.getTopics(this.type)
    },
    mounted() {
      console.log(this.user)
    },
   computed: {
      ...mapState([
          'type','user'
      ])
   },
   methods: {
     ...mapMutations([
       'SET_TYPE'
     ]),
     getTopics(type) {
       this.isLoading = true
       axios.get(api.getTopics(type,this.page,40)).then(res => {
         if(res.data.success) {
           let value = res.data.data.map((value) => {
             let vContent=value.content.replace(/<.*?>/ig,"").trim()
  					 return {
  						 data: value,
  						 content: vContent
  					 }
		       })
           this.resList = value
           this.isLoading = false
         }
       }).catch(err => {
         this.$message.error('获取话题失败');
       })
     },
     handleCurrentChange(val) {
       this.currentPage = val
       this.page = val
       this.tableData = []
       this.getTopics(this.type)
     },
     changeType(index) {
       this.active = index
       this.SET_TYPE(index)
     }
  },
  watch: {
    type(val,oldval) {
      if(val !== oldval){
        this.tableData = [];
    		this.page = 1;
        this.getTopics(val)
      }
    }
  }

 }
 </script>

<style lang="scss" scoped="">
  .content{
    padding: 0;
    margin-right: 305px;
    background: #fff;
    border-radius: 3px 3px 0 0;
    header{
      padding: 10px;
      background-color: #f6f6f6;
      border-radius: 3px 3px 0 0;
      span{
        margin: 0 10px;
        color: #80bd01;
        font-size: 14px;
        cursor: pointer;
      }
      span.current-tab{
        background-color: #80bd01;
        color: #fff !important;
        padding: 3px 4px;
        border-radius: 3px;
      }
      span:hover{
        color: #005580;
      }
    }
    .el-pagination{
      margin: 20px 0;
      float: right;
    }
  }
</style>
