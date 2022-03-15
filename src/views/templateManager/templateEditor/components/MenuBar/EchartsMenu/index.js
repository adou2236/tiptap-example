//统一设置项
import xAxisOption from './chartOptions/xAxis.vue'
import yAxisOption from './chartOptions/yAxis.vue'
import legendOption from './chartOptions/legend.vue'
import graphicOption from './chartOptions/graphic-option/index.vue'
import GroupEditorDialog from "../../Dialog/groupEditorDialog";


//柱状图，饼状图设置项
import SeriesScatter from "./chartOptions/series-scatter/series-scatter";
import SeriesCombo from "./chartOptions/series-combo/series-combo";
import SeriesComboTime from "./chartOptions/series-combo/series-combo-time";
import SeriesStack from "./chartOptions/series-stack/series-stack";
import SeriesStackTime from "./chartOptions/series-stack/series-stack-time";
import SeriesMap from "./chartOptions/series-map/series-map";
import SeriesWaterfall from "./chartOptions/series-waterfall/series-waterfall";
import SeriesDoubleAxis from "./chartOptions/series-doubleAxis/series-doubleAxis";
import SeriesFree from "./chartOptions/series-free/series-free";
import { deepCopy } from "../../../unit/baseType";
import { EventBus } from "../../../unit/eventBus";
import { docTemplateSave } from '@/request/templateApi';




export default {
    components: {
        GroupEditorDialog,
        SeriesDoubleAxis,
        SeriesWaterfall,
        SeriesMap,
        SeriesCombo,
        SeriesComboTime,
        SeriesStack,
        SeriesScatter,
        SeriesStackTime,
        SeriesFree,
        xAxisOption,
        yAxisOption,
        legendOption,
        graphicOption,
    },
    props: {
        editor: { type: Object },
        attrs: { type: Object },
        rootId: { type: String },
    },
    data() {
        return {
            defaultOpen: ['xAxis','yAxis','data'],
            groupDialogVisible: false,
            //克隆对象，对其进行监听并数据绑定
            chartOptions: deepCopy(this.attrs.options),
            chartIndex: deepCopy(this.attrs.index),
            rememberOptions: deepCopy(this.attrs.options),
            rememberIndex: deepCopy(this.attrs.index),
            saveLoading:false
        }
    },
    computed: {
        chartType() {
            let type = this.attrs.index.type
            if (type === 'line' || type === 'bar') {
                return 'lab'
            } else {
                return type
            }
        },

    },
    watch: {
        // //绑定值变化，重新绘图//不重新请求数据
        chartOptions: {
            handler(newVal, oldVal) {
                if (JSON.stringify(newVal) != JSON.stringify(this.rememberOptions)) {
                    this.editor.chain().setChartOption(newVal).run()
                    EventBus.$emit('optionChange', newVal, this.attrs.id)
                    this.rememberOptions = deepCopy(newVal)
                }

            },
            immediate: false,
            deep: true, // 深度监听
        },
        // //绑定值变化，请求数据
        chartIndex: {
            handler(newVal, oldVal) {
                if (JSON.stringify(newVal) != JSON.stringify(this.rememberIndex)) {
                    this.editor.chain().setChartIndex(newVal).run()
                    EventBus.$emit('indexChange', newVal, this.attrs.id)
                    this.rememberIndex = deepCopy(newVal)
                }

            },
            immediate: false,
            deep: true, // 深度监听
        },

    },
    methods: {
        //地域组弹窗
        showGroupDialog() {
            this.groupDialogVisible = true
        },
        handleChange(type, value) {
            this[type] = value
        },
        saveAsTemplate() {
            this.$prompt("请输入模板描述", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                inputValidator: (v) => {
                    let reg = /[`~!?@#$%^&*【】{}（）\[\]<>《》？！，。/；“”‘’,.;"'+-]/.test(v)
                    if (reg) {
                        return false
                    }
                    if (v.length > 20) {
                        return false
                    }
                    return !!v && v.trim().length > 0
                }
            }).then(async ({ value }) => {
                this.saveLoading = true
                let data = {
                    name: value,
                    type: 1,
                    doc: {
                        type: "custom-chart",
                        attrs: this.attrs
                    }
                }
                let res = await docTemplateSave(data)
                this.saveLoading = false
                if (res.data.code === 200) {
                    this.$message.success("保存成功");
                    let newValue = {
                        name: value,
                        id: res.data.data
                    }
                    EventBus.$emit('templateUpdate', newValue, 1)
                } else {
                    this.$message.info(res.data.msg);
                }
            })
        },
    }
}
