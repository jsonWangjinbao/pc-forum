<template lang="html">
  <div style="position:relative">
    <div class="content">
      <div class="panel">
        <div class="header">
          <span class="col_fade" v-if="$route.params.userType == 1">最近创建的话题</span>
          <span class="col_fade" v-if="$route.params.userType == 2">最近参与的话题</span>
          <span class="col_fade" v-if="$route.params.userType == 3">最近收藏的话题</span>
        </div>
        <topicBlock :userType='$route.params.userType'></topicBlock>
      </div>
    </div>
    <!-- <sideBar :sideInfo="userInfo"></sideBar> -->
  </div>
</template>

<script>
import topicBlock from '@/views/user/topicBlock'

export default {
  data(){
    return {

    }
  },
  components: {
    topicBlock
  }

}
</script>

<style lang="scss" scoped>
  .content{
    padding: 0;
    margin-right: 305px;
    .panel{
      margin-bottom: 13px;
      .header{
        padding: 10px;
        background-color: #f6f6f6;
        border-radius: 3px 3px 0 0;
        .col_fade {
          color: #ababab;
        }
      }
    }
  }
</style>
