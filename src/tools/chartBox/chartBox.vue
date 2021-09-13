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
      loading:false

    }
  },
  mounted() {
    this.$nextTick(() => {
      this.chartsInit()
      this.graphRender()
    })
    window.addEventListener('resize', this.resize)
  },
  watch: {
    index() {
      for (let i = 0; i < 4; i++) {
        this.data[i] = Math.random() * 100
      }
      this.graphRender()
    },
    options: {
      handler() {
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
    //完整opt加上数据
    complateOptions(){
      let temple = deepCopy(this.options)
      this.dataAttach(temple)
      return temple
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    //数据附加
    dataAttach(options){
      if(options.series[0].type === 'line' || options.series[0].type === 'bar'){
        //折线，柱状图数据附加
        options.xAxis.data = this.xAxis
        options.series.forEach((item,index)=>{
          let arr = []
          for (let i = 0; i < 4; i++) {
            arr[i] = parseInt( i * 100 * item.dataIndex)
          }
          item.data = arr
        })
      }
      else if(options.series[0].type === 'pie'){
        //饼状图数据附加
        let data = []
        options.series[0].dataIndex.forEach((item,index)=>{
          data.push({
            name:`指标名称${index+1}`,
            value:item
          })
        })
        options.series[0].data = data
      }
      else if(options.series[0].type === 'scatter'){
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
      else return options
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
      this.loading = true
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
