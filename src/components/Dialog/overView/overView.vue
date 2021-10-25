<template>
  <el-dialog
      width="1200px"
      custom-class="over-view-dialog"
      :visible="dialogVisible"
      center
      @opened="handleOpen"
      @close="handleClose">
    <div class="contain">
      <div class="left">
        <el-radio-group v-model="active">
          <el-radio-button v-for="item in catalogueList" :label="item.id">{{item.label}}</el-radio-button>
        </el-radio-group>
        <catalogue v-if="active === 'page'" class="catalogue" :currentPath="currentPath" :cataData="cataData" @scrollTo="(e)=>scrollTo(e,'page')"></catalogue>
        <catalogue v-else-if="active === 'chart'" class="catalogue" :currentPath="currentPath2" :cataData="cataData2" @scrollTo="(e)=>scrollTo(e,'chart')"></catalogue>
        <catalogue v-else-if="active === 'table'" class="catalogue" :currentPath="currentPath3" :cataData="cataData3" @scrollTo="(e)=>scrollTo(e,'chart')"></catalogue>
      </div>
      <dl ref="content" class="right" v-html="content" @scroll="scrolling">
        {{content}}
      </dl>
    </div>

  </el-dialog>
</template>

<script>
import Catalogue from "./catalogue";
export default {
  name: "overView",
  components: {Catalogue},
  model:{
    prop:'dialogVisible',
    event:'change'
  },
  props:{
    dialogVisible:{
      type:Boolean,
      default:false
    },
    content:{
      type:String,
    }
  },
  data(){
    return{
      catalogueList:[
        {id:'page',label:'文章目录'},
        {id:'chart',label:'图像目录'},
        {id:'table',label:'表格目录'},
      ],
      active:'page',
      currentPath:'',
      cataData:[],
      currentPath2:'',
      cataData2:[],
      currentPath3:'',
      cataData3:[]
    }
  },
  methods:{
    scrolling(e,type){
      if(type === 'page'){
        let data = this.cataData
        let scrollTop = e.target.scrollTop
        for(let i = 0; i<data.length; i++){
          const { eleHg, offsetTop } = data[i];
          if (scrollTop >= offsetTop && scrollTop <= offsetTop + eleHg) {
            this.currentPath = data[i].key
            break;
          }
        }
      }else{
        let data = this.cataData2
        let scrollTop = e.target.scrollTop
        for(let i = 0; i<data.length; i++){
          const { eleHg, offsetTop } = data[i];
          if (scrollTop >= offsetTop && scrollTop <= offsetTop + eleHg) {
            this.currentPath2 = data[i].key
            break;
          }
        }
      }
    },
    scrollTo(path){
      let parent = this.$refs.content
      if(path){
        parent.scrollTop = path.offsetTop;
        setTimeout(()=>{
          this.currentPath = path.key
        },50)
      }else{
        this.currentPath = this.cataData[0].key
        parent.scrollTop = 0;
      }
    },
    handleOpen(){
      this.catalogueInit(this.$refs.content)
      this.chartCatalogueInit(this.$refs.content)
      this.tableCatalogueInit(this.$refs.content)
    },
    handleClose(){
      this.$emit('change',false)
    },
    catalogueInit(dom){
      const offsetTops = [];
      this.$nextTick(()=>{
        const els = dom.querySelectorAll("h1,h2,h3,h4,h5");
        [...els].forEach((ele, elIndex) => {
          const key = 'page'+elIndex;
          const label = ele.innerText;
          const level = ele.nodeName.replace('H','')
          if (elIndex === 0) {
            this.currentPath = key; //当前选中
          }
          offsetTops.push({
            key: key,
            label: label,
            level: level,
            offsetTop: this.getPosition(ele, dom),
            eleHg: ele.offsetHeight,
          })
        });
        this.cataData = offsetTops;
      })
    },
    //图像目录生成
    chartCatalogueInit(dom){
      const offsetTops = [];
      this.$nextTick(()=>{
        const els = dom.querySelectorAll("[type='figure-chart']");
        [...els].forEach((ele, elIndex) => {
          const key = 'chart'+elIndex;
          const label = ele.querySelectorAll("[type='chart-title']")[0].innerText;
          const level = 0
          if (elIndex === 0) {
            this.currentPath2 = key; //当前选中
          }
          offsetTops.push({
            key: key,
            label: label,
            level: level,
            offsetTop: this.getPosition(ele, dom),
            eleHg: ele.offsetHeight,
          })
        });
        this.cataData2 = offsetTops;
      })
    },
    //表格目录生成
    tableCatalogueInit(dom){
      const offsetTops = [];
      this.$nextTick(()=>{
        const els = dom.querySelectorAll("[type='figure-table']");
        [...els].forEach((ele, elIndex) => {
          const key = 'table'+elIndex;
          const label = ele.querySelectorAll("[type='table-title']")[0].innerText;
          const level = 0
          if (elIndex === 0) {
            this.currentPath3 = key; //当前选中
          }
          offsetTops.push({
            key: key,
            label: label,
            level: level,
            offsetTop: this.getPosition(ele, dom),
            eleHg: ele.offsetHeight,
          })
        });
        this.cataData3 = offsetTops;
      })
    },
    /**
     * 获取dom元素相对父节点垂直位置
     * @param curEle 子元素
     * @param containerEle 父元素
     * @param offsetTop 相对高度
     * @returns {number|*}
     */
    getPosition(curEle, containerEle, offsetTop=0){
      if (curEle === containerEle) {
        return offsetTop;
      }
      offsetTop += curEle.offsetTop;
      return this.getPosition(curEle.offsetParent, containerEle, offsetTop);
    },
  }
}
</script>

<style lang="scss" scoped>
/deep/.over-view-dialog{
  margin-top: 5vh!important;
}
.contain{
  display: flex;
  height:80vh;
  .left{
    width: 30%;
    display: flex;
    flex-direction: column;
    .catalogue{
      overflow-y: auto;
    }
  }
  .right{
    width: 70%;
    overflow-y: auto;
    position: relative;
    /deep/>div{
      display: flex;
      flex-direction: column;
    }
    /deep/>div[isSplit=true]{
      flex-direction: row;

    }
    /deep/p{
      margin: 0;
    }
    /deep/table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 0;
      overflow: hidden;
    }
    /deep/td, th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;
    }
    /deep/th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }
    /deep/.chart{
      flex: 1;
      width: 100%;
      min-height: 250px;
      box-sizing: border-box;
      padding: 10px;
      border-color: black;
      border-width: 2px 0;
      border-style: solid;
    }
    /deep/figure {
      margin: 0;
      padding: 0.5rem;
      flex: 1;
    }
    /deep/figcaption {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

}

</style>
