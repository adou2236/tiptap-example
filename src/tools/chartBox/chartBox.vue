<template>
  <node-view-wrapper :id="`chart-${random}`" class="chart" v-loading="loading" element-loading-text="模拟异步加载">
  </node-view-wrapper>
</template>

<script>
import {NodeViewWrapper, nodeViewProps, NodeViewContent} from '@tiptap/vue-2'
import * as echarts from 'echarts'
import {baseOptions, deepCopy} from "../../unit/baseType";
import {randomTweenData} from "../../assets/maps";
import '../../assets/china.js'
export default {
  name: "chartBox",
  components: {
    NodeViewWrapper,
    NodeViewContent
  },
  data() {
    return {
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
    this.$nextTick(() => {
      this.loading = true
      this.chartsInit()
      let temple = deepCopy(this.options)
      this.complateOptions = this.dataAttach(temple,this.index)
      this.graphRender()
    })
    window.addEventListener('resize', this.resize)
  },
  watch: {
    index: {
      handler() {
        this.loading = true
        //指标变化，异步请求
        setTimeout(()=>{
          let temple = deepCopy(this.options)
          this.complateOptions = this.dataAttach(temple,this.index)
          this.graphRender()
        },1500)
      },
      deep: true, // 深度监听数据变化
    },
    options: {
      handler() {
        let temple = deepCopy(this.options)
        this.complateOptions = this.dataAttach(temple,this.index)
        this.graphRender()
      },
      deep: true, // 深度监听数据变化
    }
  },
  computed: {
    options(){
      return  this.node.attrs.options
    },
    index() {
      return this.node.attrs.index
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    /**
     * 数据附加，为防止无效数据请求，应该只对index的变化做响应
     * @param options 配置项
     * @param index 数据指标
     * @returns {*} options处理后的原对象
     */
    dataAttach(options,index){
      //柱线图
      if(index.type === 'lab'){
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
        let data = []
        index.items.forEach((item,index)=>{
          data.push({
            name:`指标名称${index+1}`,
            value:item
          })
        })
        options.series[0].data = data
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
            markLine:markLine
          })
        }
      }
      return options
    },
    //函数附加(自定义图形移动函数)
    funcAttach(options){
      const that = this
      options?.graphic.forEach((item,index)=>{
        item.ondragend = function(){
          that.onShapDragging(item.id, [this.x, this.y]);
        }
      })
    },
    onShapDragging(id,position){
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
        this.myCharts = echarts.init(dom)
      }
    },
    graphRender() {
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
      this.node.attrs.src = this.src
      // this.node.attrs.options = options.options
      // this.editor.chain().focus().updateAttributes('custom-chart',{src: this.src}).run()
      // this.editor.chain().focus().updateAttributes('custom-chart',{options: options.options}).run()
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
