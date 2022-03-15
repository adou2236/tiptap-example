import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'remixicon/fonts/remixicon.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as Echarts from 'echarts'
import {TEMPLATE_THEME} from "./assets/js/colors";

Vue.use(ElementUI);
Vue.config.productionTip = false
Echarts.registerTheme('templateTheme',TEMPLATE_THEME)


Vue.prototype.$Echarts = Echarts


new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
