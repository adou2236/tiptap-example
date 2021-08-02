<template>
  <node-view-wrapper :id="`chart-${random}`" class="chart">
  </node-view-wrapper>

</template>

<script>
import { NodeViewWrapper, nodeViewProps, NodeViewContent } from '@tiptap/vue-2'
import ResizeContent from "../../components/ResizeContent";
import * as echarts from 'echarts'
export default {
  name: "chartBox",
  components: {
    ResizeContent,
    NodeViewWrapper,
  },
  data(){
    return{
      random : Math.random()*(new Date()).getTime(),
      myCharts:null,
      xAxis:['指数1','指数2','指数3','指数4'],
      data:[100,200,300,400],
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.chartsInit()
      this.graphRender()
      this.getSrc()
    })
    window.addEventListener('resize',this.resize)
  },
  watch:{
    index(){
      for(let i = 0;i<4;i++){
        this.data[i] = Math.random()*100
      }
      this.graphRender()
    }
  },
  computed:{
    index(){
      return this.node.attrs.index
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize',this.resize)
  },
  methods:{
    resize(){
      if(this.myCharts){
        this.myCharts.resize()
      }
    },
    chartsInit(){
      let dom = document.getElementById(`chart-${this.random}`)
      if(dom){
        this.myCharts = echarts.init(dom)
      }
    },
    graphRender(){
      let options = {
        animation:false,
        xAxis:{
          data:this.xAxis
        },
        yAxis:[
            {}
        ],
        series:[
          {
            type:'line',
            data:this.data
          }
        ]
      }
      this.myCharts.setOption(options,true)
    },
    getSrc(){
      let src = this.myCharts.getDataURL({
        pixelRatio: 2,
      });
      this.updateAttributes({src:src})
    }

  }
}
</script>

<style lang="scss" scoped>


</style>
