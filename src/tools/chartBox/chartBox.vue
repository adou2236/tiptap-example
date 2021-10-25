<template>
  <node-view-wrapper class="chart-content">
    <div :id="`chart-${random}`" class="chart"
         v-loading="loading">
    </div>
    <div v-if="node.attrs.placeholder" class="placeholder" @click="showDialog">
      +选择图表
    </div>
    <chart-select v-model="dialogVisible"
                  @commit="handleChartReplace">
    </chart-select>
  </node-view-wrapper>
</template>

<script>
import {NodeViewWrapper, nodeViewProps, NodeViewContent} from '@tiptap/vue-2'
import * as echarts from 'echarts'
import {baseOptions, chartColor, deepCopy, optionsInit} from "../../unit/baseType";
import {geography, province, randomData, randomTweenData} from "../../assets/maps";
import '../../assets/china.js'
import {getChartSeries, getImage, imgSave} from "../../request/api";
import {EventBus} from "../../unit/eventBus";
import ChartSelect from "../../components/Dialog/chartSelect";
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
    ChartSelect,
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
      dialogVisible:false,

    }
  },
  mounted() {
    this.$nextTick(async () => {
      this.chartsInit()
      if(!this.node.attrs.placeholder){
        this.loading = true
        let temple = deepCopy(this.options)
        this.complateOptions = await this.dataAttach(temple,this.index)
        this.graphRender("初始化，周期")
      }
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
    showDialog(){
      this.dialogVisible = true
    },
    handleChartReplace(type){
      let timestamp = (new Date()).getTime()
      let index = {
        //图类型
        type:type,
        //横坐标类型/饼状图扇叶
        xaxisType:'region',
        //横坐标指标(地域或者时间)
        xaxisIndex:'provinces',
        //纵坐标指标/饼状图数值
        items:[]
      }
      let attrs = {
        "index": index,
        "placeholder":false,
        "id":`${this.$route.params.id}_${timestamp}`,
        "src": "",
        "options": optionsInit(type)
      }
      this.node.attrs = attrs
      // this.editor.chain().focus().updateAttributes('custom-chart',attrs).run()
      this.dialogVisible = false
    },
    EventBusListener(){
      EventBus.$on("optionChange", async (option,id) => {
        console.log("配置改变-----》")
        if(id===this.id){
          this.loading = true
          let temple = deepCopy(option)
          this.complateOptions = await this.dataAttach(temple,this.index)
          this.graphRender("事件总线(option)")
        }
      });
      EventBus.$on("indexChange", async (index,id) => {
        console.log("指标改变-----》")
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
          let query = {
            "templateId": this.$route.params.id,
            ...this.index
          }
          if(this.index.items.length>=2){
            let data = await this.getChartsData(query)
            //模拟异步获取分组信息
            let group = [
              {id: 'west', label: '西部', children:['新疆','甘肃','内蒙古','西藏','青海','宁夏','陕西','四川','重庆','云南','贵州','广西'], color: chartColor[0], labelFormatter: "{b}"},
              {id: 'east', label: '东部', children:['北京','上海','天津','河北','山东','江苏','浙江','福建','广东'], color: chartColor[1], labelFormatter: "{b}"},
              {id: 'center', label: '中部', children:['山西','河南','湖北','安徽','湖南','江西','海南'], color: chartColor[2], labelFormatter: "{b}"},
              {id: 'north-east', label: '东北部', children:['黑龙江','吉林','辽宁'], color: chartColor[3], labelFormatter: "{b}"},
            ]
            if(options.additions.group.length<=0){
              options.additions.group = group
            }
            let {xaxisSeries,yaxisSeries} = data
            let series = []
            options.additions.group.forEach((item,index)=>{
              let arr = []
              const pinArea = options.additions.locationPin
              const size = options.additions.symbolSize
              for(let i = 0;i<item.children.length;i++){
                const num = xaxisSeries.indexOf(item.children[i])
                //附加节点大小，突出部分地区
                arr.push({
                  name:item.children[i],
                  value:[yaxisSeries[0]?.value[num],yaxisSeries[1]?.value[num]]
                })
              }
              series.push({
                type: 'scatter',
                name:item.label,
                label:{
                  show:options.additions.labShow,
                  position:[0,0],
                  formatter:item.labelFormatter
                },
                symbolSize: (value,params) =>{
                  return pinArea&&pinArea.includes(params.name)?size+10:size
                },
                labelLine:{
                  show:false
                },
                itemStyle:{
                  color:item.color
                },
                data:arr,
              })
            })
            console.log(series)
            options.series = series
            //添加参考线
            // if(options.additions.markLine){
            //   let markLine = {data:[]}
            //   options.additions.markLine.forEach((item,index)=>{
            //     markLine.data.push({
            //       name:item.name,
            //       label: {
            //         formatter: '{b}'
            //       },
            //       xAxis:item.axis === 'xAxis'?item.value:undefined,
            //       yAxis:item.axis === 'yAxis'?item.value:undefined
            //     })
            //   })
            //   options.series.push({
            //     type:"scatter",
            //     markLine:{
            //       animation:false,
            //       ...markLine
            //     }
            //   })
            // }
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
        else if(index.type === 'map'){
          //饼状图数据附加
          let query = {
            "templateId": this.$route.params.id,
            ...this.index
          }
          let data = await this.getChartsData(query)
          let {xaxisSeries,yaxisSeries} = data
          let result = {}
          let dataList = yaxisSeries[0]?.value || []
          dataList.forEach((item,index)=>{
            if(item){
              result[xaxisSeries[index]] = item
            }
          })
          console.log(result)
          options.geo.label.formatter = (params) => {
            return params.name + (result[params.name] ? result[params.name]:'')
          }
          // options.series.data = result
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
      let data = {
        key:this.id,
        base64:this.src
      }
      imgSave(data)
      this.node.attrs.src = getImage(this.id)
      // this.editor.chain().focus().updateAttributes('custom-chart', {src:getImage(this.id)}).run()
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
  box-sizing: border-box;
  border-color: black;
  border-width: 2px 0;
  border-style: solid;
  .chart{
    display: flex;
    align-items: center;
    justify-content: center;

  }
  .placeholder{
    position: absolute;
    cursor: pointer;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width:100%;
  }
  .source{
    color: #000000;
    border-top: 2px solid black;
    font-family: STSong;
    line-height: 1rem;
    min-height: 1rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width:100%;
  }
}



</style>
