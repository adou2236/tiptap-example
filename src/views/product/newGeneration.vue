<template>
  <div class="manual-detail">
      <div class="left" v-show=" manuals.includes(reportType)" :style="`${isHidden?'width:0px;margin-right:40px':'width:200px'}`">
        <div v-show="!isHidden" class="title">报告目录</div>
        <el-scrollbar v-show="!isHidden" style="height: 100%">
          <el-tree
            ref="tree"
            :data="catalogue"
            node-key="id"
            :default-expand-all="true"
            :current-node-key="currentNodeKey"
            :highlight-current="true"
            :expand-on-click-node="false"
            icon-class="icon-my-folder"
            @node-click="handleNodeClick"
          ></el-tree>
        </el-scrollbar>
        <div @click="isHidden = !isHidden" :class="isHidden?'drawer-btn filp':'drawer-btn'" ></div>
      </div>
      <div class="center">
        <div class="selector">
          <el-select v-if="reportType != 5" :value="date" size="small" @change='yearChange'>
            <el-option v-for="item in yearOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
          <season-picker
            v-if="reportType == 5"
            :year="date"
            :season="quarter"
            :lastYear="$route.query.currentDate"
            :lastSeason="$route.query.currentQuarter"
            @change="seasonChange"
            ></season-picker>
          <div class="cata-selector">
            <span v-for="item in cataTypes"
                  :key="item.id"
                  :class="cataType === item.id?'active':''"
                  @click="cataType = item.id">{{item.label}}</span>
          </div>
        </div>
        <cata-item
          v-show="cataType == 'page'"
          :data="cataDataPage"
          @rePosition="scrollTo"
        ></cata-item>
        <cata-item
          v-show="cataType == 'chart'"
          :data="cataDataChart"
          @rePosition="scrollTo"
        ></cata-item>
        <cata-item
          v-show="cataType == 'table'"
          :data="cataDataTable"
          @rePosition="scrollTo"
        ></cata-item>
      </div>
      <div class="right">
        <div class="head">
          <div class="front">
            <span class="area">{{area}}</span>
            <span class="tag area" v-if="baseMsg.area">
              {{ baseMsg.area || "" }}
            </span>
            <span class="tag type" v-if="baseMsg.name">
              {{ baseMsg.name || "" }}
            </span>
          </div>
          <div class="behind">
            <el-button
              type="primary"
              size="small"
              :loading="holding"
              @click="handleDownload">下载当前报告</el-button>
            <el-button
              type="primary"
              size="small"
              :loading="holding"
              @click="handleWholeDownload">下载数据</el-button>
            <el-button
              type="primary"
              size="small"
              @click="goBack">
              返回
            </el-button>
          </div>
        </div>
        <div class="content" ref="content">
          <over-view
            class="body"
            v-if="docId"
            :id="docId"
            :area="area"
            :date="date"
            :quarter="quarter"
            :updatefreq="updatefreq"
            :targetAreas="targetAreas"
            @renderDone="renderDone"
          ></over-view>
        </div>
      </div>
    </div>
</template>

<script>
import {
  docDownload,
  getDocHsitory,
  imgSave,
} from "@/request/templateApi";
import { mapMutations } from 'vuex';
import overView from "./overView/overView.vue";
import cataItem from "./overView/cataItem.vue";
import { base64ToBlob } from "../../utils/util";
import { excelExport } from '@/request/Api';

export default {
  components: { overView, cataItem },
  data() {
    return {
      pdfSrc: "",
      isHidden:false,
      cataType:'page',
      cataTypes:[
        {label:'文章目录',id:'page'},
        {label:'图目录',id:'chart'},
        {label:'表目录',id:'table'},
      ],
      catalogue: [
        {
          id: "2",
          label: "研究手册",
          disabled: true,
          children: [
            { id: "6", label: "产业篇" },
            { id: "7", label: "人口消费篇" },
            { id: "9", label: "工业篇"  },
            { id: "10", label: "财政篇"  },
            { id: "11", label: "金融篇" },
          ],
        },
      ],
      manuals:['6','7','9','10','11'],
      //pdf文件读取所用的key
      baseMsg: {
        name: "",
        area: "",
      },
      holding: false,
      htmlContent: "",
      cataDataPage: [],
      cataDataChart: [],
      cataDataTable: [],
      yearOptions: [],
      lastvision: "",
      offsetTop: 0,
      id: this.$route.params.id,
      area: this.$route.query.area,
      updatefreq: this.$route.query.updatefreq,
      reportType: this.$route.query.reportType,
      targetAreas: this.$route.query.targetAreas,
      fullLoading:null,
    };
  },
  created() {
    let type = this.$route.query.reportType
    let year = Number(this.$route.query.currentDate)+1;
    this.yearOptions = [];
    if(type == 5){
      for (let i = 0; i < 5; i++) {
        this.yearOptions.push({
          label:year - i + '年',
          value:year - i + ''
        });
      }
    }else{
      for (let i = 0; i < 5; i++) {
        this.yearOptions.push({
          label:year - i + '年',
          value:year - i - 1 + ''
        });
      }

    }

  },
  async mounted() {
    this.updateIntelligentType('')
    this.baseMsg = await this.idInit(this.reportType)
    this.routerReplace({id:this.baseMsg.id},{reportType:this.baseMsg.type})
  },
  watch: {},
  computed:{
    date(){
      return this.$route.query.date + ''
    },
    quarter(){
      return this.$route.query.quarter
    },
    docId(){
      return this.$route.params.id
    },
    currentNodeKey(){
      return this.$route.query.reportType
    }
  },
  beforeDestroy(){
    if(this.fullLoading){
      this.fullLoading.close()
      this.fullLoading = null
    }
  },
  methods: {
    ...mapMutations(["updateIntelligentType"]),
    goBack(){
      this.updateIntelligentType(this.reportType)
      this.$router.go(-1)
    },
    yearChange(year){
      this.fullLoadingToggle('正在加载')
      this.routerReplace({},{date:year})
    },
    seasonChange(v){
      this.fullLoadingToggle('正在加载')
      let time = v.split('Q')
      let year = time[0]
      let season = time[1]
      this.routerReplace({},{date:year,quarter:season})
    },
    //研报id重定向
    async idInit(typeId){
      this.fullLoadingToggle('正在加载')
      let {data} = await this.getReportHistory(typeId);
      let index = data.findIndex(item=>item.status == 1)
      return data[index]
    },
    renderDone() {
      this.catalogueInit(this.$refs.content);
      this.chartCatalogueInit(this.$refs.content);
      this.tableCatalogueInit(this.$refs.content);
      this.fullLoadingToggle()
      setTimeout(()=>{
        this.holding = false
      },2000)
    },
    async catalogueInit(dom) {
      const offsetTops = [];
      this.$nextTick(() => {
        const els = dom.querySelectorAll("h1,h2,h3,h4,h5");
        [...els].forEach((ele, elIndex) => {
          const key = "page" + elIndex;
          const label = ele.innerText;
          const level = ele.nodeName.replace("H", "");
          offsetTops.push({
            key: key,
            label: label,
            level: level,
            offsetTop: this.getPosition(ele, dom),
            eleHg: ele.offsetHeight,
          });
        });
        this.cataDataPage = offsetTops;
      });
    },
    //图像目录生成
    async chartCatalogueInit(dom) {
      const offsetTops = [];
      this.$nextTick(() => {
        const els = dom.querySelectorAll("[type='figure-chart']");
        [...els].forEach((ele, elIndex) => {
          const key = "chart" + elIndex;
          const label = ele.querySelectorAll("[type='chart-title']")[0].innerText;
          const level = 0;
          offsetTops.push({
            key: key,
            label: label,
            level: level,
            offsetTop: this.getPosition(ele, dom),
            eleHg: ele.offsetHeight,
          });
        });
        this.cataDataChart = offsetTops;
      });
    },
    //表格目录生成
    async tableCatalogueInit(dom) {
      const offsetTops = [];
      this.$nextTick(() => {
        const els = dom.querySelectorAll("[type='figure-table']");
        [...els].forEach((ele, elIndex) => {
          const key = "table" + elIndex;
          const label = ele.querySelectorAll("[type='table-title']")[0].innerText;
          const level = 0;
          offsetTops.push({
            key: key,
            label: label,
            level: level,
            offsetTop: this.getPosition(ele, dom),
            eleHg: ele.offsetHeight,
          });
        });
        this.cataDataTable = offsetTops;
      });
    },
    /**
     * 获取dom元素相对父节点垂直位置
     * @param curEle 子元素
     * @param containerEle 父元素
     * @param offsetTop 相对高度
     * @returns {number|*}
     */
    getPosition(curEle, containerEle, offsetTop = 0) {
      if (curEle === containerEle) {
        return offsetTop;
      }
      offsetTop += curEle.offsetTop;
      return this.getPosition(curEle.offsetParent, containerEle, offsetTop);
    },
    scrollTo(path) {
      let offsetTop = path.offsetTop
      let parent = this.$refs.content;
      if (offsetTop) {
        parent.scrollTop = offsetTop;
      } else {
        parent.scrollTop = 0;
      }
    },
    updateCatalogue(a, b, c) {
      this.cataDataPage = a;
      this.cataDataChart = b;
      this.cataDataTable = c;
    },
    async getReportHistory(type) {
      let query = {
        type: type,
        pageNum: 1,
        pageSize: 100,
      };
      let { data } = await getDocHsitory(query);
      return data.data;
    },
    fullLoadingToggle(text){
      if(this.fullLoading){
        this.holding = false
        this.fullLoading.close()
        this.fullLoading = null
      }else{
        this.holding = true
        this.fullLoading = this.$loading({
          lock:true,
          text:text,
          background: 'rgb(0,0,0,0.7)'
        })
      }
    },
    async imageUpload(){
      let urls = this.getChartDoms()
      return Promise.all(
        urls.map(item=>{
          let date = this.date
          let area = this.area
          let key = item.id
          if(date&&area){
            key = `${item.id}_${date}_${area}`
          }
          let data = {
            key:key,
            base64:item.url
          }
          return imgSave(data)
        })
      )
    },
    async handleDownload() {
      this.fullLoadingToggle('正在下载')
      await this.imageUpload()
      let params = {
        id: this.docId,
        customVars: [
          {
            varKey: "报告年份",
            varValue: this.date,
          },
          {
            varKey: "报告范围",
            varValue: this.area,
          },
          {
            varKey: "季度",
            varValue: this.quarter,
          },
          {
            varKey: "更新频率",
            varValue: this.updatefreq,
          },
          {
            varKey: "对标城市",
            varValue: this.targetAreas,
          },
        ],
      };

      let { data } = await docDownload(params);
      this.fullLoadingToggle()
      if (data.code === 200) {
        let blob = base64ToBlob(data.data);
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", `${this.baseMsg.name}.docx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    },
    async handleWholeDownload() {
      this.fullLoadingToggle('正在下载')
      let entityIds = []
      let charts = this.$refs.content.querySelectorAll('.chart')
      charts.forEach(item=>{
        entityIds = entityIds.concat(item.dataset.entityids.split(','))
      })
      let param = { entityIds };
      let { data } = await excelExport(param,'智能研报全部数据下载');
      this.fullLoadingToggle()
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

    //遍历全文图像并保存
    getChartDoms() {
      let urls = []
      let charts = document.querySelectorAll('.chart') || []
      charts.forEach(item=>{
        urls.push({
          id:item.id,
          url:item.dataset.pic
        })
      })
      return urls
    },
    getWholeDom(ele){
      if (ele.nodeName === 'FIGURE'||ele.nodeName === 'figure') {
        return ele
      }
      return this.getWholeDom(ele.offsetParent);
    },
    async handleNodeClick(res) {
      if(!res.disabled && res.id != this.currentNodeKey){
        let doc = await this.idInit(res.id)
        this.baseMsg = doc
        this.routerReplace({id:doc.id},{reportType:doc.type})
      }
    },
    routerReplace(a = {},b = {}){
      let {name,params,query} = this.$route
      this.$router.replace({
        name,
        params:{
          ...params,
          ...a,
        },
        query:{
          ...query,
          ...b
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.manual-detail {
  display: flex;
  width: 100%;
  margin: 0 auto;
  background: #ffffff;
  height: 100vh;
  min-width: 1200px;
  .left {
    height: 100%;
    width: 200px;
    padding: 30px 0;
    border-right: 1px solid #f3f3f3;
    flex-shrink: 0;
    position: relative;
    transition: all ease 0.3s;
    .title {
      background: #f7f7f7;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      font-size: 16px;
      color: #333333;
      font-weight: bold;
    }
    .drawer-btn{
      position: absolute;
      cursor: pointer;
      right: 20px;
      top: 40px;
      right: 20px;
      white-space: nowrap;
      width: 20px;
      height: 20px;
      background: url("~@/assets/imgs/tiptap/drawBar.svg") no-repeat center/contain;
      transition: all ease 0.3s;
      &.filp{
        transform: rotate(180deg);
        right: -30px;
      }
    }
  }
  .center {
    flex-shrink: 0;
    height: 100%;
    width: 380px;
    padding-top: 30px;
    overflow: hidden;
    border-right: 1px solid #f3f3f3;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    & > div {
      flex-grow: 1;
    }
    .selector{
      width:100%;
      padding: 0 20px;
      height: 100px;
      display: flex;
      flex-direction: column;
      .cata-selector{
        display: flex;
        flex-direction: row;
        &>span{
          cursor: pointer;
          height:35px;
          line-height:35px;
          text-align: center;
          flex:1;
          border: 1px solid #D7D7D7;
          border-right: none;
          font-size: 14px;
          transition: all ease 0.3s;
        }
        &>span.active{
          color: #FFF;
          background: #36A4FD;
        }
        &>span:last-child{
          border-right: 1px solid #D7D7D7;
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
        &>span:first-child{
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
        }

      }
      &>div{
        margin-bottom: 20px;
      }
    }
  }
  @media screen and (max-width: 1280px) {
    .left{
      width:100px
    }
    .center {
      width: 250px;
    }
  }
  .right {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .head {
      padding: 15px 20px;
      box-sizing: content-box;
      margin: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: url("../../assets/imgs/Product/report_title.png") no-repeat
        center / cover;
      margin-bottom: 20px;
      border-radius: 6px;
      box-shadow: 0 4px 14px 0 rgba(181, 181, 181, 0.5);
      .front {
        display: flex;
        align-items: center;
        & > span {
          margin-right: 15px;
        }
        .area {
          color: #12417f;
          font-size: 20px;
        }
        .tag {
          padding: 0px 20px;
          border-radius: 5px;
          font-size: 14px;
          &.area {
            background: #ffc1c6;
            color: #f77780;
          }
          &.type {
            background: #ffc470;
            color: #ff9000;
          }
        }
      }
    }
    .content {
      margin: 0;
      overflow: auto;
      position: relative;
    }
  }
}
/deep/.el-tree-node__content {
  text-align: left;
  display: flex;
  min-height: 34px;
  height: auto;
  line-height: 20px;
  padding: 0 15px!important;
  align-items: center;
  vertical-align: middle;
  white-space: normal;
  &:hover {
    background: rgba(54, 164, 253, 0.2);
  }
}
/deep/.el-tree-node:focus > .el-tree-node__content {
  color: #12417f;
  background: rgba(54, 164, 253, 0.2);
}
/deep/.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: rgba(54, 164, 253, 0.2);
}
/deep/.el-tree-node__content {
    align-items: flex-start;
    height: 18px;
    line-height: 18px;
    font-size: 13px;
    align-items: center;
    vertical-align: middle;
    .icon-my-folder{
      background: url('~@/assets/imgs/tiptap/folder.svg') no-repeat center/contain;
      height: 12px;
      margin-right: 5px;
      &::before{
        content:'1';
        font-size: 12px;
        width: 12px;
        visibility: hidden;
      }
    }
    .icon-my-folder.is-leaf{
      background:transparent
    }
    .el-tree-node__expand-icon.expanded{
      transform: rotate(0);
    }
    &:hover {
      background: rgba(54, 164, 253, 0.2);
    }
}
</style>
