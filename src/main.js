// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import axios from 'axios'
import store from './store'
import use from '@/assets/js/use'
import $ from 'jquery'
import { Button, Select ,Input,Dialog,Form,FormItem,Table,TableColumn,loading,pagination,Message,Option} from 'element-ui'

Vue.config.productionTip = false
Vue.prototype.use = use

Vue.use(Button)
Vue.use(Select)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(loading)
Vue.use(pagination)
Vue.use(Option)
Vue.component(Message.name, Message)
Vue.prototype.$message = Message
// Vue.use(Message)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: { App },
  template: '<App/>'
})
