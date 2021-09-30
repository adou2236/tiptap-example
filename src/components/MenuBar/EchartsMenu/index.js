import echarts from 'echarts'
import { getLinearGradientColor } from './utils/chart'
//统一设置项
import titleOption from './chartOptions/title.vue'
import xAxisOption from './chartOptions/xAxis.vue'
import yAxisOption from './chartOptions/yAxis.vue'
import legendOption from './chartOptions/legend.vue'
import gridOption from './chartOptions/grid.vue'
import tooltipOption from './chartOptions/tooltip.vue'
import graphicOption from './chartOptions/graphic-option/index.vue'

//柱状图，饼状图设置项
import SeriesBarLine from "./chartOptions/series-bar-line/series-bar-line";
import SeriesPie from "./chartOptions/series-pie/series-pie";
import PieSize from "./chartOptions/series-pie/pie-size";
import SeriesScatter from "./chartOptions/series-scatter/series-scatter";
import SeriesCombo from "./chartOptions/series-combo/series-combo";


export default {
    components: {
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
        index:{type:Object},
        options:{type:Object},
    },
    data() {
        return {
            activeNames:[],
            activeNames2:[],
            xAxisData:[],
            backgroundColor: this.options.backgroundColor,
            title: this.options.title,
            grid: this.options.grid,
            legend: this.options.legend,
            xAxis: this.options.xAxis,
            yAxis: this.options.yAxis,
            tooltip: this.options.tooltip,
            series: this.options.series,
            graphic: this.options.graphic,
        }
    },
    computed: {
        chartType(){
            let type = this.index.type
            if(type === 'line' || type === 'bar'){
                return 'lab'
            }else{
                return type
            }
        },
        chartOptions: {
            get(){
                return {
                    // color: this.color,
                    backgroundColor: this.backgroundColor,
                    title: this.title,
                    grid: this.grid,
                    legend: this.legend,
                    xAxis: this.xAxis,
                    yAxis: this.yAxis,
                    tooltip: this.tooltip,
                    series: this.series

                }
            },
        }
    },
    watch: {
        // linearColors(to) {
        //     this.chartOptions.series.filter(item => {
        //         item.lineStyle.color = getLinearGradientColor(to, 'right')
        //     })
        // },
        //绑定值变化，重新绘图
        // chartOptions: {
        //     handler(to) {
        //         console.log("这是什么玩意")
        //         this.$emit('renderChart',to)
        //     },
        //     deep: true, // 深度监听
        // },

    },
    mounted() {
        // this.chartOptions.series.filter(item => {
        //     this.$set(item, 'isLinear', false)
        // })
    },
    beforeDestroy() {
    },
    methods: {
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
        // renderChart(options = this.options){
        //     // this.options.backgroundColor = "#FF0000"
        //     // console.log("this.options",this.editor.chain())
        //     this.editor.chain().focus().updateAttributes('custom-chart',{options:options}).run()
        //     console.log("改完是否生效",this.editor.getAttributes('custom-chart').options)
        // },
        //更改标题配置
        changeTitleOption(data) {
            this.title = data
        },
        //更改间距配置
        changeGridOption(data) {
            this.grid = data
        },
        //更改图例配置
        changeLegendOption(data) {
            this.legend = data
        },
        //更改横坐标配置
        changeXAxisOption(data) {
            //重新赋值前剔除数据
            this.xAxis = data
        },
        //更改纵坐标配置
        changeYAxisOption(data) {
            this.yAxis = data
        },
        ////更改浮窗配置
        changeTooltipOption(data) {
            this.tooltip = data;
        },

        // // 切换渐变状态
        // changeLinearStatus(isLinear, index) {
        //     if (isLinear) {
        //         let colors = this.linearColors;
        //         this.series[index].lineStyle.color = getLinearGradientColor(colors, 'right')
        //     } else {
        //         this.series[index].lineStyle.color = '#e74c3c';
        //     }
        // },
        // //
        updateDataItem(item, type = 0) {
            if(type) {
                item.push(Math.floor(Math.random() * 1000));
                let newX = this.xAxisData[this.xAxisData.length - 1] + 1
                this.xAxisData.push(newX)
            } else {
                item.pop();
                this.xAxisData.pop();
            }
        },
        // 添加数据项

    }
}
