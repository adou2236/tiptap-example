<template>
  <div id="intelligent" @click="(event)=>event.stopPropagation()">
    <div class="background"></div>
    <div class="product-report" v-if="!showMap">
      <div class="template-manager" @click="toTempManager" v-show="hasAuthority('templateList')">
        <span class="icon"></span>
        模板管理
      </div>
      <div
        v-for="(item, index) in option"
        :class="!hasAuthority(item.id) ? 'product-option disabled' : 'product-option'"
        :key="index"
        @click="!hasAuthority(item.id) ? null : routerToReport(item)">
        <img class="cover" :src="item.img"/>
        <div class="option" >
          <div class="title">{{ item.title }}</div>
        </div>
      </div>
    </div>
    <productMap
      v-else
      ref="productMap"
      :mapBd="mapBd"
      class="product-map"
      :selectedLevel="activeReportType.type == '3'?'city':'province'"
      v-model="activeRegion"
      @change="regionSelect"
      @close="showMap = false"
    >
    </productMap>
    <city-selector v-model="dialogVisible" @handleCommit="handleCommit" ></city-selector>
  </div>
</template>

<script>
import productMap from "./productMap";
import { mapMutations } from 'vuex';
import { china } from "../../assets/js/region";
import CitySelector from './citySelector.vue';
import { mapState } from 'vuex';
import { getTempList } from '@/request/templateApi';
import { hasAuthority } from '../../utils/util';
export default {
  name: "intelligent",
  //dataMap
  components: { productMap, CitySelector },
  data() {
    return {
      china,
      hasAuthority,
      activeRegion: "全国",
      activeYear: '2021',
      activeType: {
        id:'1',
        label:'第一季度'
      },
      activeTabs: "现有产品",
      activeReportType: null,
      option: [
        {
          title: "研究手册", //只有全国能点
          id:'intelligent_6',
          type: "6",
          withMap:false,
          withyear:true,
          withType:false,
          img: require("../../assets/imgs/Product/yjsc.jpg"),
        },
        {
          title: "专题报告",
          id:'intelligent_1',
          type: "1",
          withMap:true,
          withyear:true,
          withType:false,
          img: require("../../assets/imgs/Product/ztbg.jpg"),
        },
        {
          title: "金融规划",
          id:'intelligent_3',
          type: "3",
          withMap:true,
          withyear:true,
          withType:false,
          img: require("../../assets/imgs/Product/jrgh.jpg"),
        },
        {
          title: "季度跟踪", //只有全国能点
          id:'intelligent_5',
          type: "5",
          withMap:false,
          withyear:true,
          withType:true,
          img: require("../../assets/imgs/Product/jb.jpg"),
        },
      ],
      mapBd: false,
      showMap:false,
      dialogVisible:false,
    };
  },
  computed:{
    ...mapState({
      intelligentType: (state) => state.reportStore.intelligentType,
    }),
  },
  async mounted(){
    let type = this.intelligentType
    if(type&&type=='1'||type == '3'){
      this.activeReportType = this.option.find(item=>item.type == type)
      this.showMap = true
      this.updateIntelligentType('')
    }
    this.baseData = await this.listInit()
  },
  methods: {
    ...mapMutations(["updateIntelligentType"]),
    regionSelect(v){
      if(v&&this.activeReportType.type == '1'){
        this.reportSubmit('1',v)
      }else if(v&&v!=='全国'&&this.activeReportType.type == '3'){
        this.dialogVisible = true
      }
    },
    toTempManager() {
      this.$router.push({ name: "templateList" });
    },
    handleCommit(e){
      let targetAreas = e.join('、')
      this.reportSubmit('3',this.activeRegion,targetAreas)
    },
    changeYear(e) {
      this.activeYear = e;
    },
    changeType(e) {
      this.activeType = e;
    },
    routerToReport(row) {
      //6研究手册不做操作
      //1专题报告选省市
      //3金融规划选市跟对标城市
      //5季报不做操作
      this.activeReportType = row
      switch(row.type){
        case '6':
          this.reportSubmit('6')
          break;
        case '1':
          this.showMap = true
          break;
        case '3':
          this.showMap = true
          break;
        default:
          this.reportSubmit('5')

      }
    },
    async reportSubmit(type,region,targetAreas) {
      let {date,quarter} = this.baseData.find(item=>item.type == type)
      this.$router.push({
        name: "newGeneration",
        query: {
          reportType: this.activeReportType.type,
          area: this.activeRegion,
          date,
          currentDate:date,
          quarter,
          currentQuarter:quarter,
          updatefreq: this.activeReportType.type == 5?'quarter':'year',
          targetAreas
        },
      });
    },
     async listInit(){
      let query = {
        "pageNum":1,
        "pageSize":100
      }
      let {data} = await getTempList(query)
      return data.data.data
    },
  },
};
</script>
<style scoped lang="scss">
.option {
  .title {
    color: #fff;
    text-shadow: #333 1px 1px 2px;
  }
}
#intelligent {
  display: flex;
  height: 100vh;
  width: 1200px;
  margin: auto;
  align-items: center;
  .background{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: url('~@/assets/imgs/Product/background.png') no-repeat top;
    background-size: 100% 70%;
    background-color: #FFF;
  }

  .report-submit {
    position: absolute;
    bottom: 25px;
    right: 20px;
    display: flex;
    align-items: center;
    .already-choose{
      width: 80%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      &>*{
        margin-right: 10px;
      }
    }
  }
  .product-report {
    flex: 1.5;
    height: 60%;
    display: flex;
    justify-content: space-between;
    align-content: center;
    position: relative;
    .template-manager {
      position: absolute;
      right: 0;
      top: -25%;
      font-size: 18px;
      color: #36A4FD;
      background: #FFF;
      cursor: pointer;
      display: flex;
      align-items: center;
      width: 200px;
      height: 60px;
      border-radius: 30px;
      text-align: center;
      justify-content: center;
      .icon{
        width: 24px;
        height: 24px;
        margin-right: 10px;
        background: url("../../assets/imgs/tiptap/template_manager.png") no-repeat center/contain;
      }
    }
    .product-option {
      border-radius: 10px;
      height: 100%;
      width: 20%;
      cursor: pointer;
      box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.2);
      position: relative;
      transition: all 200ms ease;
      overflow: hidden;
      .cover{
        object-fit: cover;
        overflow: hidden;
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
      .option {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translate(-50%, 0%);
        .title {
          font-size: 22px;
          text-align: center;
        }
      }
      &.disabled{
        cursor: not-allowed;
      }
      &.active{
        transform: translate(0, -5px);
        box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.7);
        border: 1px solid #3da6fa;
        &::before {
          content: "";
          position: absolute;
          right: 10px;
          top: 10px;
          width: 20px;
          height: 10px;
          border: 2px solid;
          border-color: transparent transparent white white;
          transform: rotate(-45deg);
          z-index: 2;
        }
        &::after {
          content: "";
          position: absolute;
          right: 0;
          top: 0;
          width: 0px;
          height: 0px;
          border-top: 60px solid rgb(61, 166, 250);
          border-left: 80px solid transparent;
          z-index: 1;
        }
      }
      &:not(.disabled):hover{
        transform: translate(0, -5px);
        box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.7);
      }
    }
  }
  .product-map {
    height: 80%;
    width: 70%;
    position: relative;
  }
}
.title-tab{
  width: 150px;
  height: 30px;
  background: url('~@/assets/imgs/Product/tab_background_blue.png') no-repeat center/contain;
  line-height: 30px;
  text-align: center;
  color:#FFF;
  font-size: 14px;
  position: absolute;
  top: 0;
  left:50%;
  transform: translateX(-50%);
}
</style>
