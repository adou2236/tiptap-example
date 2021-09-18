import Vue from 'vue'
import App from './App.vue'
import 'remixicon/fonts/remixicon.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import TagMenu from '../src/components/MenuBar/tagMenu/tagMenu'


Vue.component("TagMenu", TagMenu);
Vue.use(ElementUI);
Vue.config.productionTip = false


new Vue({
  render: h => h(App),
}).$mount('#app')
