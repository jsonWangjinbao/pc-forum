<template lang="html">
  <div class="sidebar">
    <div class="panel">
      <div class="header">
        <span class="col_fade">个人信息</span>
      </div>
      <div class='inner'>
        <div class='user_card'>
          <div>
            <router-link :to="{name: 'personal', params: {loginname: sideInfos.loginname}}" class='user_avatar'>
              <img :src="[sideInfos.avatar_url ? sideInfos.avatar_url: 'http://orbmbw2o7.bkt.clouddn.com/CNode.svg']" :title="[sideInfos.loginname ? sideInfos.loginname:'您还没有登陆呦']"/>
            </router-link>
            <span class='user_name'><router-link :to="{name: 'personal', params: {loginname: sideInfos.loginname}}" class='dark'>{{sideInfos.loginname ? sideInfos.loginname:'您还没有登陆呦'}}</router-link></span>
            <div class='board clearfix'>
              <div class='floor'>
                <span class='big'>积分: 0 </span>
              </div>
            </div>
            <div class="space clearfix"></div>
            <span class="signature">我是你爹</span>
          </div>
        </div>
      </div>
    </div>
    <slot name="publicTopic"></slot>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
  name:'sideBar',
  data(){
    return {
      sideInfos: {
        avatar_url: '',
        loginname: ''
      }
    }
  },
  props:['sideInfo'],
  mounted(){
    if(this.sideInfo!==undefined){
      this.sideInfos = this.sideInfo
    }
  },
  watch: {
    sideInfo(val,oldval) {
      this.sideInfos = val
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar{
  width: 290px;
  font-size: 14px;
  margin-bottom: 20px;
  position: absolute;
  top: 0;
  right: 0;
  .panel{
    margin-bottom: 13px;
    .header{
      color: #51585c;
      border-radius: 3px 3px 0 0;
      padding: 10px;
      background-color: #f6f6f6;
      .col_fade{
        color: #444;
      }
    }
    .inner{
      padding: 10px;
      border-radius: 0 0 3px 3px;
      background: #fff;
      a{
        color: #778087;
      }
      .user_avatar{
        vertical-align: middle;
        margin-right: .5em;
        img{
          width: 48px;
          height: 48px;
          border-radius: 3px;
          max-width: 100%;
          vertical-align: middle;
          border: 0;
        }
      }
      .user_name{
        font-size: 16px;
        max-width: 120px;
        white-space: nowrap;
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .board{
        margin-top: 10px;
        margin-bottom: 8px;
        width: 80%;
        .big{
          font-size: 14px;
        }
      }
      .signature{
          font-style: italic;
      }
    }
  }
}
</style>
