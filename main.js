import App from './App'
import lodash from './utils/lodash.js'
import store from './store'
import Vue from 'vue'
import publicMethods from './utils/public.js'
import cuCustom from './colorui/components/cu-custom.vue'
import CustomPage from './components/custom-page.vue'
import PageComp from './components/UIComp/PageComp/pageComp.vue';
import appConfig from './configs';
import { toastFun } from './utils/tools.js';

// 全局混入
import "./utils/mixins";

// var QQMapWX = require("./js_sdk/qqmap-wx-jssdk.min.js");
// const qqmapsdk = new QQMapWX({
// 	key: appConfig.qqMapSDKKey
// });
import Api from './api/apiUrl.js'

Vue.component('cu-custom', cuCustom)
Vue.component('CustomPage', CustomPage)
Vue.component('PageComp', PageComp)
Vue.prototype.$config = appConfig
Vue.prototype.$toast = toastFun

Vue.prototype.$api = Api
// Vue.prototype.$qqmapsdk = qqmapsdk
Vue.prototype.$store = store
Vue.prototype.publicMethods = publicMethods
// 网络图片前缀
Vue.prototype.IMGURL = appConfig.IMGURL

Vue.prototype.$onLaunched = new Promise(resolve => {
	Vue.prototype.$isResolve = resolve
})

Vue.use(lodash)
App.mpType = 'app'
const app = new Vue({
	...App,
	store
})
app.$mount()
