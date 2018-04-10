<template lang="html">
  <el-dialog title="请输入token登陆" :visible.sync="diaIsClosed" @close="diaClose" :modal-append-to-body="false" :lock-scroll="false">
    <el-form :model="form">
      <el-form-item label="token：" :label-width="formLabelWidth">
        <el-input v-model="form.name" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="diaIsClosed = false">取 消</el-button>
      <el-button type="primary" @click="goLogin">确 定</el-button>
    </div>
</el-dialog>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import axios from 'axios'
import api from '@/api'

export default {
  name: 'login',
  data() {
    return {
      diaIsClosed: false,
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
    }
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    dialogFormVisible(val,oldval) {
      this.diaIsClosed = val
    }
  },
  methods: {
    ...mapMutations([
      'SET_USER','SET_TOKEN'
    ]),
    diaClose() {
      this.$emit('closeDia',false)
    },
    goLogin() {
      if(!this.form.name.trim()){
        this.$message({
          message: '请输入token',
          type: 'warning'
        })
        return
      }
      axios.post(api.login(),{
        accesstoken: this.form.name
      }).then(res => {
        if(res.data.success){
          localStorage.clear()
          this.SET_USER(res.data)
          this.SET_TOKEN(this.form.name)
          localStorage.setItem('userInfo',JSON.stringify(res.data))
          localStorage.setItem('token',this.form.name)
          this.diaIsClosed = false
          this.$message({
            message: '登陆成功！',
            type: 'success'
          })
        }
      }).catch(err => {
        this.diaIsClosed = false
        this.$message.error('登陆失败！请确定您的token是否正确');
      })
    }
  }
}
</script>

<style lang="scss" scoped="">
</style>
