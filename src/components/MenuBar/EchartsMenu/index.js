import echarts from 'echarts'
//统一设置项
import titleOption from './chartOptions/title.vue'
import xAxisOption from './chartOptions/xAxis.vue'
import yAxisOption from './chartOptions/yAxis.vue'
import legendOption from './chartOptions/legend.vue'
import gridOption from './chartOptions/grid.vue'
import tooltipOption from './chartOptions/tooltip.vue'
import graphicOption from './chartOptions/graphic-option/index.vue'
import GroupEditorDialog from "../../Dialog/groupEditorDialog";


//柱状图，饼状图设置项
import SeriesBarLine from "./chartOptions/series-bar-line/series-bar-line";
import SeriesPie from "./chartOptions/series-pie/series-pie";
import PieSize from "./chartOptions/series-pie/pie-size";
import SeriesScatter from "./chartOptions/series-scatter/series-scatter";
import SeriesCombo from "./chartOptions/series-combo/series-combo";
import SeriesMap from "./chartOptions/series-map/series-map";
import {deepCopy} from "../../../unit/baseType";
import {EventBus} from "../../../unit/eventBus";


export default {
    components: {
        GroupEditorDialog,
        SeriesMap,
        SeriesCombo,
        SeriesScatter,
        PieSize,
        SeriesPie,
        SeriesBarLine,
        titleOption,
        xAxisOption,
        yAxisOption,
        legendOption,
        gridOption,
        tooltipOption,
        graphicOption
    },
    props:{
        editor:{type:Object},
        attrs:{type:Object}
    },
    data() {
        return {
            activeNames:[],
            activeNames2:[],
            xAxisData:[],
            groupDialogVisible:false,
            // chartOptions:{},
        }
    },
    computed: {
        chartType(){
            let type = this.attrs.index.type
            if(type === 'line' || type === 'bar'){
                return 'lab'
            }else{
                return type
            }
        },
        chartOptions: {
            get(){
                return deepCopy(this.attrs.options)

            },
        }
    },
    watch: {
        /**
         * 重新利用起来，不要在原来对象的基础上进行数值的更改，不容易监听到
         */
        // //绑定值变化，重新绘图
        // chartOptions: {
        //     handler(newVal,oldVal) {
        //         console.log(newVal,oldVal,newVal===oldVal)
        //         if(newVal!==oldVal){
        //
        //         }
        //     },
        //     immediate:false,
        //     deep: true, // 深度监听
        // },

    },
    created() {
        // this.chartOptions = deepCopy(this.attrs.options)
    },
    beforeDestroy() {
    },
    methods: {
        //地域组弹窗
        showGroupDialog(){
            this.groupDialogVisible = true
        },
        //指标变化（触发重新搜索）
        indexChange(v){
            // this.editor.chain().updateAttributes('custom-chart',{index:v}).run()
            this.editor.chain().setChartIndex(v).run()
            EventBus.$emit('indexChange',v,this.attrs.id)
        },
        //标题变化
        titleChange(v){
            this.editor.chain().updateAttributes('custom-chart',{title:v}).run()
        },
        //来源变化
        sourceChange(v){
            this.editor.chain().updateAttributes('custom-chart',{source:v}).run()
        },
        //删除图形
        deleteGraphic(id){
            this.options.graphic = this.options.graphic.filter(item=>item.id!==id)
        },
        /**
         * 生成新的自定义图形
         * id根据时间戳生成以保证唯一
         */
        addGraphic(){
            let graphic = {
                id: parseInt(new Date().getTime() / 1000),
                type: 'text',
                z: 100,
                draggable:true,
                left: 'center',
                top: 'middle',
                style: {
                    borderWidth:1,
                    borderColor:'#000000',
                    padding:[10,10],
                    backgroundColor:"#FFFFFF",
                    fill: '#000000',
                    text: `新建文本`
                },
            }
            this.options.graphic.push(graphic)
        },
        //更改配置
        somethingChange(key,data) {
            this.chartOptions[key] = data
            this.editor.chain().setChartOption(this.chartOptions).run()

            // this.editor.chain().updateAttributes('custom-chart',{options:this.chartOptions}).run()
            EventBus.$emit('optionChange',this.chartOptions,this.attrs.id)
        },
    }
}
