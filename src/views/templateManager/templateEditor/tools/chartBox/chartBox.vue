<template>
  <node-view-wrapper class="chart-content">
    <div  :id="id" class="chart" ref="chart-container"
          :data-entityIds="entityIds"
          v-loading="loading">
    </div>
    <div v-show="drawFault" class="placeholder">
      数据未发布
    </div>
    <el-dropdown size="mini"
                trigger="hover"
                class="option-handle"
                :disabled="editor.view.editable"
                @command="selectItem">
      <span class="el-dropdown-link" data-html2canvas-ignore v-show="!editor.view.editable&&!drawFault">
        <svg class="remix">
            <use :xlink:href="require('remixicon/fonts/remixicon.symbol.svg') + `#ri-menu-line`" />
        </svg>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
            class="item"
            v-for="(item, index) in items"
            :key="index"
            :command="item.id">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <details-dialog v-model="detailsVisible" :data="detailsData" @reRender="handleReRender">
      <div ref="innerChart" style="width:100%;height:100%"></div>
    </details-dialog>
  </node-view-wrapper>
</template>

<script>
import {NodeViewWrapper, nodeViewProps} from '@tiptap/vue-2'
import * as echarts from 'echarts'
import '../../assets/china.js'
import {getChartSeries} from "@/request/templateApi";
import {EventBus} from "../../unit/eventBus";
import {dataAttach} from "./units";
import html2canvas from 'html2canvas';
import { base64ToBlob } from '../../../../../utils/util';
import { excelExport,getTableData } from '@/request/Api';
import DetailsDialog from './detailsDialog.vue';
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
    DetailsDialog
  },
  data() {
    return {
      inChange:false,
      random: Math.random() * (new Date()).getTime(),
      myCharts: null,
      src: '#',
      loading:false,
      complateOptions:{},//附加数据的完整配置
      drawFault:false,
      items:[
        {id:'showDetails',label:'查看详情'},
        {id:'copyPic',label:'复制图片'},
        {id:'downloadPic',label:'下载图片'},
        {id:'downloadData',label:'下载数据'},
      ],
      entityIds:[],
      detailsVisible:false,
      detailsData:{}
    }
  },
  mounted() {
    this.$nextTick(async () => {
      this.chartsInit()
      if(!this.node.attrs.placeholder){
        this.flowRequest(this.options,this.index,true)
      }
    })
    this.EventBusListener()
    window.addEventListener('resize', this.resize)
  },
  watch: {

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
  },
  beforeDestroy() {
    //移除监听防止多次请求
    EventBus.$off()
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    handleReRender(){
      let dom = this.$refs['innerChart']
      let innerChart = echarts.init(dom,'templateTheme')
      innerChart.setOption(this.complateOptions)
    },
    async getPicObject(){
      let figureDom = this.$refs['chart-container'].offsetParent
      let res = await html2canvas(figureDom,{
        scale:2,
      })
      return res.toDataURL()
    },
    //下载图片
    downloadPic(base64){
      let file = base64ToBlob(base64);
      let a = document.createElement("a");
      let url = window.URL.createObjectURL(file);
      let fileName = "图表.png";
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    //复制图片
    copyPic(base64){
      let img = document.createElement("img");
      img.style.width = "0px";
      img.src = base64;
      document.body.appendChild(img);
      window.getSelection().removeAllRanges();
      let range = document.createRange();
      range.selectNode(img);
      window.getSelection().addRange(range);
      document.execCommand("Copy");
      document.body.removeChild(img);
      this.$message.success("图片复制成功");
    },
    //下载数据
    async downloadData() {
      let param = {
        entityIds: this.entityIds,
      };
      let { data } = await excelExport(param,'智能研报图表数据下载');
      if (data.code === 200) {
        let blob = base64ToBlob(data.data);
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "原始数据.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    },
    async getDetailsDatas(){
      let title,source = ''
      let figureDom = this.$refs['chart-container'].offsetParent
      title = figureDom.children[0].innerText
      source = figureDom.children[2].innerText

      let param = {
        entityIds: this.entityIds.join(','),
        needValue:false
      };
      let {data} = await getTableData(param)
      let origin = data.data.map(item=>item.label)
      this.detailsData = {
        title,
        source,
        origin
      }
      this.detailsVisible = true
    },
    async selectItem(a){
      let base64 = ''
      switch(a){
        case 'showDetails':
          this.getDetailsDatas()
          break
        case 'copyPic':
          base64 = await this.getPicObject()
          this.copyPic(base64)
          break
        case 'downloadPic':
          base64 = await this.getPicObject()
          this.downloadPic(base64)
          break
        default:
          this.downloadData()
      }
    },
    //防抖处理
    flowRequest(options,index,request = true){
      let as = this.debounce(async ()=>{
        this.drawFault  = false
        this.loading = true
        this.complateOptions = await dataAttach(options,index,this.$route.params.id,request)
        this.entityIds = this.complateOptions?.entityIds || []
        this.graphRender(this.complateOptions,request)
        this.loading = false
      },this.id,1000)
      as()
    },
    //增加ID区分，防止多个函数之间的相互影响
    debounce(fn, id, delay = 500) {
      this.timer;
      let that = this
      return function () {
        let args = arguments;
        if (that.timer) {
          clearTimeout(that.timer);
        }
        that.timer = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      };
    },
    EventBusListener(){
      EventBus.$on("optionChange", async (options,id) => {
        if(id==this.id){
          console.log("配置改变-----》",options)
          this.flowRequest(options,this.index,false)
        }
      });
      EventBus.$on("indexChange", async (index,id) => {
        if(id==this.id){
          console.log("指标改变-----》")
          this.flowRequest(this.options,index,true)
        }
      });
    },
    resize() {
      if (this.myCharts) {
        this.myCharts.resize()
      }
    },
    chartsInit() {
      let dom = this.$refs['chart-container']
      if (dom) {
        this.myCharts = echarts.init(dom,'templateTheme')
      }
    },
    graphRender(options) {
      //异步执行，指标更新需要重新获取数据，配置项更新不做处理
      if(this.myCharts&&options){
        try {
          this.myCharts.setOption(options,true)
        } catch (error) {
          console.error(error)
          this.myCharts.clear()
          this.drawFault  = true
        }
      }else{
        this.myCharts.clear()
        this.drawFault  = true
      }
      if(!this.editor.view.editable&&!this.drawFault){
        let offCanvas = this.myCharts.getRenderedCanvas({
          pixelRatio:2,
          backgroundColor:"#FFF"
        })
        const width = this.myCharts.getWidth()
        const height = this.myCharts.getHeight()
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(offCanvas,0,0,width,height)
        //添加上下黑线
        ctx.fillStyle = '#000'
        ctx.fillRect(0,0,width,2)
        ctx.fillRect(0,height,width,-2)
        const base64 = canvas.toDataURL('image/png')
        this.$refs['chart-container'].dataset.pic = base64
      }
    },

    generateImage(src){
      return new Promise((resolve,reject)=>{
        const img = new Image()
        img.src = src
        img.onload = () => {
          resolve(img)
        }
        img.onerror = (error) => {
          reject(error)
        }
      })
    },
    //渲染配置数据初始化
    async getChartsData(query){
      let {data} = await getChartSeries(query)
      return data.data
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-content{
  box-sizing: border-box;
  overflow: visible;
  /deep/ *::selection{
    color: #000;

  }
  .option-handle{
    position:absolute;
    right: 0;
    top: 0;
    width: 1.2rem;
    height: 1.2rem;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0.3rem;
    box-sizing: content-box;
    .remix{
      width: 100%;
      height: 100%;
      fill: #13427E;
    }
    &:hover{
      background: #DBDBFF;
      border-radius: 50%;
    }
    &[disabled]{
      cursor: default;
      pointer-events: none;
    }
  }
  .chart{
    display: flex;
    align-items: center;
    justify-content: center;
    border-color: black;
    border-width: 2px 0;
    border-style: solid;
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
}



</style>
