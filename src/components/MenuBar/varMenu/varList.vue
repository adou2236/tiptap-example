<template>
  <div class="index-list">
    <el-input v-model="keyword" @keyup.enter.native="search"/>
    <div class="list-scroll">
      <div v-for="item in varList"
           class="index-item"
           @click="handleClick(item)"
           :key="item.id">
        {{item.varKey}}
      </div>
    </div>
  </div>
</template>

<script>
import {EventBus} from "../../../unit/eventBus";
import {getVarsById} from "../../../request/api";

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
      EventBus.$emit('varSelect',item)
    },
    async search(){
      await this.getAllVar()
    },
    async getAllVar(){
      let {data} = await getVarsById(this.rootId)
      this.varList = data.content.data
    },
  }
}
</script>

<style lang="scss" scoped>
.index-list{
  display: flex;
  flex-direction: column;
  .list-scroll{

  }
  .index-item{
    padding:5px 10px;
    cursor: pointer;
    &:hover{
      background: #c6c6c6;
    }
  }
}
</style>
