import Vue from 'vue'
import Vuex from 'vuex'
import templateStore from './templateStore'
import reportStore from './reportStore'

Vue.use(Vuex)


export default new Vuex.Store({
    modules: {
        templateStore,
        reportStore,
    },
    strict: false
})
