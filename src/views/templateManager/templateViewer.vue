<template>
  <div class="viewer">
    <div class="header">
      <div class="front">
        <span class="icon"></span>
        {{lastVersion.name}}
      </div>
      <div class="end">
        <el-button @click="edit" type="primary">编辑</el-button>
      </div>
    </div>
    <div class="content">
      <el-scrollbar class="left">
        <div class="paper">
          <over-view :origin="true" v-if="lastVersion.id" :id="lastVersion.id"></over-view>
        </div>
      </el-scrollbar>
      <el-scrollbar class="right">
        <div class="messages">
          <div class="front">
            <span class="icon"></span>
            {{ lastVersion.name }}
          </div>
          <!-- <div>报告级别：{{ baseMessage.level }}</div>
          <div>更新频率：{{ baseMessage.updateFrequency }}</div> -->
          <div>创建人：{{ lastVersion.author }}</div>
          <div>创建时间：{{ lastVersion.updateTime }}</div>
          <div class="versions">
            历史版本
            <span
              v-for="item in versions"
              :key="item.id"
              @click="changeVersion(item)"
              :class="lastVersion.id === item.id ? 'active version' : 'version'">
              <div>{{ item.createTime }}</div>
              <div>{{ item.name }}</div>
              <div v-show="item.status == 1" class="in-unsing">应用中</div>
            </span>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { getDocHsitory } from '@/request/templateApi';
import OverView from '../product/overView/overView.vue';
export default {
  components: { OverView },
  data() {
    return {
      root_id:'',
      baseMessage: {
        name: "",
        level: "省",
        updateFrequency: "年",
        creator: "",
        createTime: "",
      },
      versions:[],
      lastVersion:{}
    };
  },
  async mounted(){
    let type = this.$route.query.type
    this.versions = await this.getReportHistory(type)
    this.lastVersion = this.versions[0]
  },
  methods: {
    async getReportHistory(type){
        let query = {
            type:type,
            pageNum:1,
            pageSize:100
        }
        let {data} = await getDocHsitory(query)
        return data.data.data
    },
    edit(){
      this.$router.push({name:'templateEditor',params:{id:this.lastVersion.id}})
    },
    changeVersion(v) {
      this.lastVersion = v
    },
  },
};
</script>

<style lang="scss" scoped>
.viewer {
  width: 100%;
  height: 100%;
  .header {
    height: 100px;
    width: 100%;
    background: #ffffff;
    border-bottom: 1px solid #dadada;
    padding: 20px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;

  }
  .content {
    height: calc(100vh - 100px);
    display: flex;
    .left {
      flex: 1;
      .paper {
        margin: 20px auto;
        background: #ffffff;
        padding: 20px;
        box-sizing: content-box;
        width: 1000px;
        box-shadow: 0 4px 22px 2px rgba(221,221,221,0.4);
      }
    }
    .right {
      width: 500px;
      background: #ffffff;
      .messages {
        padding: 20px 40px;
        color: #B5B5B5;
        line-height: 24px;
        &>div{
          margin-bottom: 10px;
        }
        .versions {
          color:#333333;
          font-size: 16px;
          margin-top: 20px;
          &>span{
            position: relative;
            display: block;
            margin-top: 20px;
            border: 1px solid #E1E1E1;
            height: 80px;
            padding: 15px;
            color: #B5B5B5;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            cursor: pointer;
            .in-unsing{
              position: absolute;
              background: #D0E4FA;
              border-radius: 4px;
              color: #36A4FD;
              padding: 5px 10px;
              font-size: 14px;
              right: 20px;
              top: 50%;
              transform: translateY(-50%);
            }

            &.active {
              border-color: #36A4FD;
              background: #EBF6FF;
              color:#000000
            }
          }
        }
      }
    }
  }
}
.front{
      color:#333333;
      font-size: 24px;
      display: flex;
      align-items: center;
      .icon{
        width: 45px;
        height: 45px;
        margin-right: 20px;
        background: url('~@/assets/imgs/tiptap/books.png') no-repeat center/contain;
      }
    }
</style>
