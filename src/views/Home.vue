<template>
  <div class="main">
    <div v-for="item in list" class="box" @click="toDetails(item)">
      <div>{{item.name}}</div>
      <div>{{item.createTime}}</div>
    </div>
  </div>
</template>

<script>
import {getTempList} from "../request/api";

export default {
  name: "Home",
  data(){
    return{
      list:[]

    }
  },
  async mounted() {
    this.list = await this.listInit()
  },
  methods:{
    toDetails(item){
      this.$router.push({name:'detail',params:{id:item.id}})
    },
    async listInit(){
      let query = {
        "pageNum":1,
        "pageSize":100
      }
      let {data} = await getTempList(query)
      return data.content.data
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  display: flex;
  padding: 50px;
  flex-wrap: wrap;
  .box{
    width: 150px;
    height: 200px;
    margin: 20px;
    border: 1px solid black;
    cursor: pointer;
  }
}

</style>
