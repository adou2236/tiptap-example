<template>
  <node-view-wrapper  class="chart-content">
    <div class="title">{{ title }}</div>
    <div :id="`chart-${random}`" class="chart"
         v-loading="loading"></div>
    <div class="source">{{ source }}</div>
  </node-view-wrapper>
</template>

<script>
import {NodeViewWrapper, nodeViewProps, NodeViewContent} from '@tiptap/vue-2'
import * as echarts from 'echarts'
import {baseOptions, deepCopy} from "../../unit/baseType";
import {province, randomData, randomTweenData} from "../../assets/maps";
import '../../assets/china.js'
import {getChartSeries} from "../../request/api";
import {EventBus} from "../../unit/eventBus";
import Chart from "./components/chart";
export default {
  name: "chartBox",
  props: {
    ...nodeViewProps,
    updateAttributes: {
      type: Function,
      required: true,
    },
  },
  components: {
    NodeViewWrapper,
    NodeViewContent
  },
  data() {
    return {
      inChange:false,
      random: Math.random() * (new Date()).getTime(),
      myCharts: null,
      xAxis: ['指数1', '指数2', '指数3', '指数4'],
      data: [200, 100, 300, 400],
      src: '#',
      loading:false,
      complateOptions:{},//附加数据的完整配置

    }
  },
  mounted() {
    this.$nextTick(async () => {
      this.chartsInit()
      this.loading = true
      let temple = deepCopy(this.options)
      this.complateOptions = await this.dataAttach(temple,this.index)
      this.graphRender("初始化，周期")
    })
    this.EventBusListener()
    window.addEventListener('resize', this.resize)
  },
  watch: {
    // index: {
    //   async handler(oldVal,newVal) {
    //     console.log("走loading",oldVal,newVal)
    //     this.loading = true
    //     //指标变化，异步请求
    //     let temple = deepCopy(this.options)
    //     this.complateOptions = await this.dataAttach(temple,this.index)
    //     this.graphRender("指标变化")
    //   },
    //   immediate:false,
    //   deep: true, // 深度监听数据变化
    // },
  },
  computed: {
    id(){
      return this.node.attrs.id
    },
    options(){
      return this.node.attrs.options
    },
    index() {
      return this.node.attrs.index
    },
    title(){
      return this.node.attrs.title
    },
    source(){
      return this.node.attrs.source
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    EventBusListener(){
      EventBus.$on("optionChange", async (option,id) => {
        if(id===this.id){
          this.loading = true
          let temple = deepCopy(option)
          this.complateOptions = await this.dataAttach(temple,this.index)
          this.graphRender("事件总线(option)")
        }
      });
      EventBus.$on("indexChange", async (index,id) => {
        if(id===this.id){
          this.loading = true
          let temple = deepCopy(this.options)
          this.complateOptions = await this.dataAttach(temple,index)
          this.graphRender("事件总线(index)")
        }
      });
    },
    handleInput(v){
      this.updateAttributes({
        source: v,
      })
    },
    /**
     * 数据附加，为防止无效数据请求，应该只对index的变化做响应
     * @param options 配置项
     * @param index 数据指标
     * @param request 是否重新请求数据 option变化不要重新请求，index变化重新请求
     * @returns {*} options处理后的原对象
     */
    async dataAttach(options,index,request = true){
      //index变化，数据重新请求
      if(request){
        if(index.type === 'lab'){
          //柱线图
          options.xAxis.data = this.xAxis
          options.series.forEach((item,num)=>{
            let arr = []
            for (let i = 0; i < 4; i++) {
              arr[i] = parseInt( i * 100 * index.items[num])
            }
            item.data = arr
          })
        }
        else if(index.type === 'pie'){
          //饼状图数据附加
          let query = {
            "templateId": this.$route.params.id,
            ...this.index
          }
          let data = await this.getChartsData(query)
          let {xaxisSeries,yaxisSeries} = data
          let result = []
          let dataList = yaxisSeries[0]?.value || []
          dataList.forEach((item,index)=>{
            if(item){
              result.push({
                name:xaxisSeries[index],
                value:item,

              })
            }
          })
          options.series = {
            data:result,
            type:'pie',
            radius:options.additions.radius,
            center:options.additions.center,
          }
        }
        else if(index.type === 'scatter'){
          //散点图
          options.series.forEach((item,index)=>{
            let arr = []
            const pinArea = options.additions.locationPin
            const size = options.additions.symbolSize
            for(let i = 0;i<item.items.length;i++){
              //附加节点大小，突出部分地区
              item.symbolSize = (value,params) =>{
                return pinArea&&pinArea.includes(params.name)?size+10:size
              }
              arr.push({
                name:item.items[i],
                value:randomTweenData[index][i]
              })
            }
            item.data = arr
          })
          //添加参考线
          if(options.additions.markLine){
            let markLine = {data:[]}
            options.additions.markLine.forEach((item,index)=>{
              markLine.data.push({
                name:item.name,
                label: {
                  formatter: '{b}'
                },
                xAxis:item.axis === 'xAxis'?item.value:undefined,
                yAxis:item.axis === 'yAxis'?item.value:undefined
              })
            })
            options.series.push({
              type:"scatter",
              markLine:{
                animation:false,
                ...markLine
              }
            })
          }
        }
        else if(index.type === 'combo'){
          //复杂组合图
          let query = {
            "templateId": this.$route.params.id,
            ...this.index
          }
          let data = await this.getChartsData(query)
          options.xAxis.data = data.xaxisSeries || []
          //图像数据数量
          for(let i = 0;i<options.series.length;i++){
            options.series[i].data = data.yaxisSeries[i].value
            if(options.series[i].type==='stackBar'){
              options.series[i].stack='stackBar'
              options.series[i].type='bar'
            }
            if(options.series[i].type==='stackLine'){
              options.series[i].stack='stackLine'
              options.series[i].type='line'
            }
          }
        }
      }else{
        //options变化，不需要重新请求
        if(index.type === 'combo'){
          options.xAxis = this.myCharts.getOption().xAxis[0]
          options.series = this.myCharts.getOption().series
        }
      }
      return options
    },
    //函数附加(自定义图形移动函数)
    funcAttach(options){
      const that = this
      options?.graphic.forEach((item,index)=>{
        item.ondragend = function(){
          that.onShapeDragging(item.id, [this.x, this.y]);
        }
      })
    },
    onShapeDragging(id,position){
      let element = this.options.graphic.find(item=>item.id === id)
      element.left = position[0]
      element.top = position[1]
    },
    resize() {
      if (this.myCharts) {
        this.myCharts.resize()
      }
    },
    chartsInit() {
      let dom = document.getElementById(`chart-${this.random}`)
      if (dom) {
        this.myCharts = echarts.init(dom,'reportTheme')
      }
    },
    graphRender(source) {
      // console.log(source)
      //异步执行，指标更新需要重新获取数据，配置项更新不做处理
      this.funcAttach(this.options)
      if(this.myCharts&&this.complateOptions){
        this.myCharts.setOption(this.complateOptions,true)
        this.loading = false
        setTimeout(()=>{
          this.getSrc()
        },2000)

      }

    },
    //渲染配置数据初始化
    getSrc() {
      this.src = this.myCharts.getDataURL({
        pixelRatio: 2,
      });
      // let options = new baseOptions(this.options)
      this.updateAttributes({
        src: this.src,
      })
      // this.node.attrs.options = options.options
      // this.editor.chain().focus().updateAttributes('custom-chart',{src: this.src}).run()
      // this.editor.chain().focus().updateAttributes('custom-chart',{options: options.options}).run()
    },
    async getChartsData(query){
      let {data} = await getChartSeries(query)
      return data.content
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-content{
  position: relative;
  margin: 10px 0;
  .mask{
    position: absolute;
    border: 2px dashed #0D0D0D20;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1000;
  }
  .click-bar{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background: rgba(255, 0, 0, 0.19);
    z-index: 2;
  }
  .chart{
    z-index: 1;
  }

  &.focus{
    outline: 3px solid #68cef8;
  }
  .title{
    color: #C8152E;
    border-bottom: 2px solid black;
    font-family: STSong;
    line-height: 1.5rem;
    min-height: 1.5rem;
    font-size: 1.5rem;
  }
  .source{
    color: #000000;
    border-top: 2px solid black;
    font-family: STSong;
    line-height: 1rem;
    min-height: 1rem;
  }
}



</style>
