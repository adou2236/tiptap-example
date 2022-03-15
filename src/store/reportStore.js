const reportStore = {
    state: {
        selectedProductType: '',//当前选中报告tab类型researchManual，zoneReport，quarterlyReport
        selectedChart: null,
        intelligentType:''
    },
    mutations: {
        updateSelectedProductType(state, type) {
            state.selectedProductType = type
        },
        updateIntelligentType(state,type) {
            state.intelligentType = type
        }
    }
};

export default reportStore


