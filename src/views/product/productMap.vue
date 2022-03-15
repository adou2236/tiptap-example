<template>
  <div class="map-selector">
    <div class="title-tab">{{selectedLevel=='province'?'选择省份':'选择城市'}}</div>
    <div class="close-btn" @click="close">
      <el-button
        size="small"
        round
        icon="el-icon-back"
      ></el-button>
      <span>返回</span>
    </div>
      <el-button
        v-show="currentCity !== '全国'"
        size="small"
        round
        class="back-btn"
        icon="el-icon-back"
        @click="backToCountry"
      ></el-button>

    <div id="canvas-container" v-loading="loading">

    </div>
  </div>
</template>

<script>
import { getMap } from "@/request/Api";
import { geography } from "../../assets/js/region";
import "../../assets/js/china";


export default {
  model: {
    prop: "selectedCity",
    event: "change",
  },
  props: {
    selectedLevel:{
      type:String,//选取模式province省/市 city市/区（可下钻）
      default:'province'
    },
    selectedCity: {
      type: String,
      default: "全国",
    },
    mapBd: {
      type: Boolean
    }
  },
  data() {
    return {
      geography,
      currentCity:'全国',
      geoId: "100000",
      myCharts: null,
      countryJson: "",
      cityJson: "",
      loading: false,
      areaColor: {
        'east': "#a60922",
        'center': "#1362b0",
        'west': "#c29d1b",
        'north-east': "#1ea288",
      },
      mapMessage: [],
      barClick:{}
    };
  },
  async mounted() {
    this.chartsInit();
    this.countryJson = await this.getMapJson(this.geoId);
    this.mapMessage = this.countryJson.features.map((item) => {
      return {
        name: item.properties.name,
        level: item.properties.level,
      };
    });
    this.loadMap(this.countryJson);
    if(this.barClick){
      this.barClick = null
    }
    this.barClick =  window.addEventListener('click',this.close)
  },
  beforeDestroy(){
    window.removeEventListener('click',this.close)
    this.barClick = null
  },
  watch: {
    async currentCity(val) {
      let id =
        val === "全国"
          ? this.geoId
          : this.countryJson.features.find((item) => {
              return item.properties.name.includes(val);
            }).properties.adcode;
      if (!this.$Echarts.getMap(val)) {
        let json = await this.getMapJson(id);
        this.loadMap(json);
      } else {
        this.alreadyLoad();
      }
    },
  },
  computed: {
    option() {
      let regions = []
      regions = this.mapMessage.map(item=>{
        let color = "#b0defa";
        this.geography.forEach((element) => {
          if (element.province.includes(item.name)) {
            color = this.areaColor[element.id];
          }
        });
        return{
          ...item,
          value:'123',
          itemStyle:{
            areaColor: color
          }
        }
      })
      return {
        backgroundColor: "transparent",
        tooltip: {
          show: false,
          itemStyle: {
            color: "black",
          },
          trigger: "item",
        },
        geo: [
          {
            map: this.currentCity == "全国" ? "china" : this.currentCity,
            zoom: 1,
            z: 0,
            scaleLimit: {
              min: 0.5,
              max: 15,
            },
            label: {
              show: true,
              formatter:'{a}',
              color: "#000000"
            },
            itemStyle: {
              borderWidth:1,
              borderColor: "rgba(0,0,0,0.3)",
              areaColor: "#b0defa",
            },
            emphasis: {
              label: {
                show: true,
                color: "#36a4fd",
              },
              itemStyle:{
                areaColor:'#FFF',
                shadowColor: "#215380",
                shadowOffsetY: 6
              }
            },
            select:{
              label: {
                color: "#36a4fd",
              },
              itemStyle:{
                areaColor:'#FFF',
                shadowColor: "#215380",
                shadowOffsetY: 6
              }
            },
            regions: [
              ...regions,
              {
                name: "南海诸岛",
                itemStyle: {
                  borderColor: "#8fa1e6",
                  areaColor: "#b0defa",
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  emphasis: {
                    label: {
                      show:true,
                      color: "#000000",
                    },
                    borderColor: "#8fa1e6",
                    areaColor: "#0C3261",
                    shadowOffsetY: 0
                  },
                },
              },
            ],
          },
        ],
        series: [
          {
            type: "map",
            zoom: 1,
            geoIndex: 0,
            map: this.currentCity,
            selectedMode: 'single',
            data:regions
          },
        ],
        // animation: false,
        animationDuration: 1000,
        animationEasing: "cubicOut",
        // 数据更新动画的时长。
        animationDurationUpdate: 1000,
      };
    },
  },
  methods: {
    close(){
      this.$emit('close')
    },
    backToCountry() {
      this.currentCity = '全国'
      this.$emit('change','全国')
      this.$nextTick(()=>{
        this.myCharts.dispatchAction({type:'toggleSelected',name:''})
      })
    },
    async getMapJson(geoId) {
      let params = {
        key: geoId,
      };
      this.loading = true;
      let { data } = await getMap(params);
      return data;
    },
    chartsInit() {
      this.myCharts = this.$Echarts.init(document.getElementById("canvas-container"));
      this.myCharts.on("click", (params) => {
        let city = params.name;
        if(!params.dataIndex == undefined){
          return false
        }
        if(this.selectedLevel == 'province'){
          this.$emit('change',city)
          return false
        }else if(this.selectedLevel == 'city'&&params.data?.level === "province") {
          this.currentCity = city
        }else{
          this.$emit('change',city)
        }
      });
    },
    loadMap(json) {
      this.$Echarts.registerMap(this.currentCity, json);
      this.myCharts.setOption(this.option);
      this.loading = false;
    },
    alreadyLoad() {
      this.myCharts.setOption(this.option);
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.map-selector {
  margin: 0 auto;
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
    z-index: 2;
  }
  .back-btn {
    position: absolute;
    top: 50px;
    left: 65px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    line-height: 33px;
    text-align: center;
    font-size: 20px;
    border: 1px solid #36A4fd;
    color: #36A4fd;
    cursor: pointer;
    z-index: 101;
    &:hover {
      color: #ffffff;
      background: #36A4fd;
    }
  }
  .close-btn{
    position: absolute;
    top: 0;
    left: -150px;
    height: 50px;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    &>button{
      text-align: center;
      width: 50px;
      height: 50px;
      font-size: 20px;
      border-radius: 25px;
      border: 1px solid #36A4fd;
      color: #36A4fd;
      cursor: pointer;
      z-index: 101;

    }
    &>span{
      color:#FFF;
      margin-left: 15px;
    }
    &:hover {
      color: #ffffff;
      button{
        background: #36A4fd;
        color: #ffffff;
      }
      span{
        color: #36A4fd;
      }
    }

  }
  #canvas-container {
    height: 100%;
    width: 100%;
    background: #FFF;
    border-radius: 5px;
    border: 1px solid #D5D5D5;
    margin: 0 auto;

  }
}
</style>
