const templateStore = {
    state: {
        //当前文本的所有变量
        vars:{},
        baseData:{},
        rootId:''

    },
    mutations: {
        //设置根节点ID
        setRootId(state,rootId){
            state.rootId = rootId
        },
        //设置全局变量
        setGlobalVars(state, payload) {
            let {segmentId,data} = payload
            state.vars[segmentId] = data
        },
        setBaseData(state, data) {
            state.baseData = data
        },
        //清空全局变量
        removeGlobalVars(state) {
            state.vars = {}
        },

    },
};


export default templateStore
