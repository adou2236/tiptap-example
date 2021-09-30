import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = {
    state: {
        //当前文本的所有变量
        vars:{}

    },
    mutations: {
        //设置全局变量
        setGlobalVars(state, payload) {
            let {segmentId,data} = payload
            state.vars[segmentId] = data
        },
        //清空全局变量
        removeGlobalVars(state) {
            state.vars = {}
        },

    },
    actions: {
    },
};

export default new Vuex.Store(store);
