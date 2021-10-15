<template>
  <div>
    <div>
      <span v-for="item in types" @click="handleClick(item.id)"
            :class="activeSpan === item.id?'bar active':'bar'">{{item.label}}</span>
    </div>
    <index-list v-show="activeSpan === 'index'"></index-list>
    <var-list :rootId="rootId" v-show="activeSpan === 'variety'"></var-list>
  </div>
</template>

<script>
import IndexList from "./indexList";
import VarList from "./varList";
export default {
  name: "index",
  components: {VarList, IndexList},
  props:{
    rootId:String
  },
  data(){
    return{
      activeSpan:'index',
      types:[
        {id:'index',label:'指标'},
        {id:'variety',label:'函数/变量'}
      ]
    }
  },
  methods:{
    handleClick(item){
      this.activeSpan  = item
    },

  }
}
</script>

<style lang="scss" scoped>
.bar{
  background: #b4b4b4;
  color: black;
  padding: 5px 10px;
  cursor: pointer;
  &.active{
    background: dodgerblue;
    color: #FFFFFF;
  }
}

</style>
