<template>
  <div class="index-list">
    <el-input v-model="keyword" size="small" class="search-ipt" placeholder="搜索变量" />
    <el-scrollbar style="flex:1">
      <div class="list-scroll">
        <div v-for="item in varList"
            v-show="item.varKey.indexOf(keyword) !== -1"
            class="index-item"
            @click="handleClick(item)"
            :key="item.id">
            <el-tooltip :content="item.note" :disabled="item.note == ''">
              <span style="width:100%">{{item.varKey}}</span>
            </el-tooltip>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import {EventBus} from "../../../unit/eventBus";
import {getVarsById} from "@/request/templateApi";

export default {
  name: "varList",
  props:{
    rootId:String
  },
  data(){
    return{
      varList:[],
      keyword:''
    }
  },
  async created() {
    await this.getAllVar()
  },
  methods:{
    handleClick(item){
      if(item.keyType == 2){
        item.pass = 0
      }
      EventBus.$emit('varSelect',item)
    },
    async search(){
      await this.getAllVar()
    },
    async getAllVar(){
      let {data} = await getVarsById(this.rootId)
      this.varList = data.data.data.filter(item=>item.isShow)
    },
  }
}
</script>

<style lang="scss" scoped>
.index-list{
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  .search-ipt{
    padding: 0 20px 20px;
  }
  .list-scroll{
    padding: 0 20px;

  }
  .index-item{
    height: 18px;
    line-height: 18px;
    display: flex;
    cursor: pointer;
    &:hover{
      color: #12417f;
      background: rgba(54, 164, 253, 0.2);
    }
  }
}
</style>
