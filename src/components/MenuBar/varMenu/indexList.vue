<template>
  <div class="index-list">
    <el-input v-model="keyword" @keyup.enter.native="search"/>
    <div>
      <div v-for="item in indexList"
           class="index-item"
           @click="handleClick(item)"
           :key="item.indicator">
        {{item.indicator}}
      </div>
    </div>
  </div>
</template>

<script>
import {getIndexList} from "../../../request/api";
import {EventBus} from "../../../unit/eventBus";

export default {
  name: "indexList",
  data(){
    return{
      indexList:[],
      keyword:''
    }
  },
  async created() {
    await this.getAllIndex()
  },
  methods:{
    handleClick(item){
      EventBus.$emit('indexSelect',item)
    },
    async search(){
      await this.getAllIndex()
    },
    async getAllIndex(){
      let params = {
        "keyword":this.keyword,
        "pageNum":1,
        "pageSize":500
      }
      let {data} = await getIndexList(params)
      this.indexList = data.content.data
    },
  }
}
</script>

<style lang="scss" scoped>
.index-list{
  display: flex;
  flex-direction: column;
  .index-item{
    padding:5px 10px;
    cursor: pointer;
    &:hover{
      background: #c6c6c6;
    }
  }
}
</style>
