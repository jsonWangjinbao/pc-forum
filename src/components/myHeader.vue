<template lang="html">
  <div class="">
    <div class="navbar">
      <div class="navbar-inner">
        <div class="container clearfix">
          <div class="brand"></div>
          <el-input
            size="small"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="input">
          </el-input>
          <el-button type="primary" size="medium" @click="dialogFormVisible = true">登陆</el-button>
          <a @click="$router.push({name:'message'})" class="message">未读消息</a>
        </div>
      </div>
    </div>
    <login :dialogFormVisible='dialogFormVisible' @closeDia="closeDialog"></login>
  </div>

</template>
<script>
import login from './login'
export default {
  name: 'myHeader',
  data() {
    return {
      dialogFormVisible: false,
      input: ''
    }
  },
  components: {
    login
  },
  methods: {
    closeDialog(bool) {
      this.dialogFormVisible = bool
    }
  }
}
</script>

<style lang="scss" scoped="">
.navbar {
  margin-bottom: 0;
  z-index: 9;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.25);
  font-size: 13px;
  .navbar-inner {
    background: 0 0;
    border-radius: 0;
    border: none;
    box-shadow: none;
    width: 90%;
    margin: auto;
    padding: 5px;
    .container {
      width: 100%;
      min-width: 960px;
      margin: 0 auto;
      max-width: 1400px;
      div.el-input{
        width: 180px;
        float: left;
        margin-top: 5px;
      }
      button{
        float: right;
        margin-top: 2px;
      }
      .brand {
        float: left;
        width: 120px;
        padding: 3px 20px;
        height: 34px;
        line-height: 34px;
        color: #ccc;
        font-weight: 700;
      }
      .message{
        float: right;
        display: block;
        width: 100px;
        height: 41px;
        text-align: center;
        line-height: 41px;
        font-size: 14px;
        color: #80bd01;
        cursor: pointer;
      }
    }
  }
}
</style>
