<template>
  <div class="page-main">
      <div class="top-messages">
        <span>统计共{{ templateList.length }}条</span>
        <!-- <custom-input
          class="inputer"
          placeholder="请输入搜索内容"
        ></custom-input> -->
        <el-button size="small" type="primary" round @click="dialogVisible = true">
          <i class="statistics-icon"></i>
            模板内容统计
        </el-button>
      </div>
      <div class="tempaltes-container">
        <template-box
          v-for="item in templateList"
          :key="item.id"
          :data="item"
        ></template-box>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
    <statistics-dialog v-model="dialogVisible" :data="statisticsData"></statistics-dialog>
    </div>
</template>

<script>
import templateBox from "./components/templateBox.vue";
import {getTempList,getStatisticsData} from '@/request/templateApi'
import StatisticsDialog from './components/statisticsDialog.vue';
export default {
  components: { templateBox, StatisticsDialog },
  data() {
    return {
      templateList: [],
      statisticsData: [],
      dialogVisible:false
    };
  },
  async mounted() {
    this.templateList = await this.listInit()
    this.statisticsData = await this.getStatistics()
  },
  methods:{
    async listInit(){
      let query = {
        "pageNum":1,
        "pageSize":100
      }
      let {data} = await getTempList(query)
      return data.data.data
    },
    async getStatistics(){
      let {data} = await getStatisticsData()
      return data.data.data
    }
  }
};
</script>

<style lang="scss" scoped>
.page-main {
  padding: 50px 0;
  // min-width: 1240px;
   width: 80%;
  min-width: 1200px;
  position: relative;
  margin: auto;
  .top-messages {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    .inputer {
      width: 200px;
      margin-right: -10px;
    }
    .statistics-icon{
      display: inline-block;
      margin-right: 10px;
      width: 12px;
      height: 12px;
      position: relative;
      &::after{
        content: '';
        background: url('~@/assets/imgs/tiptap/statistics_icon.png') no-repeat center/contain;
        width: 20px;
        height: 20px;
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(-4px,-4px);

      }
    }
  }
  .tempaltes-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-right: -10px;
    & > div {
      width: 260px;
      margin-bottom: 50px;

    }
    & > i {
      width: 260px;
    }
    .add-new {
      height: 380px;
    }
  }
}
</style>
