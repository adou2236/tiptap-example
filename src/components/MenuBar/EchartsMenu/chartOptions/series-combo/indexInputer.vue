<template>
  <div class="input-area" @click="handleFocus" >
    <el-tag
        v-show="multiple"
        v-for="(tag,index) in showList"
        :key="index"
        closable
        size="mini"
        @close="handleClose(tag)">
      {{tag}}
    </el-tag>
    <el-tag
        v-show="!multiple&&showList"
        closable
        size="mini"
        @close="handleClose">
      {{showList}}
    </el-tag>
  </div>
</template>

<script>
import {EventBus} from "../../../../../unit/eventBus";
import {deepCopy} from "../../../../../unit/baseType";

export default {
  name: "indexInputer",
  model:{
    prop:'list',
    event:'change'
  },
  props:{
    type:{
      type:String,
      default:'index'//index指标variety变量
    },
    /**
     * 是否可多选，多选状态下响应点击事件
     */
    multiple:{
      type:Boolean,
      default:false
    },
    /**
     * 键值对应关系
     */
    list:{
      type:[Array,String],
    }
  },
  data(){
    return{
      showList:this.list,
      id:'',
      isFocus:false
    }
  },
  mounted(){
    this.id = Math.random()
    this.eventListenerInit()
  },
  watch:{
    showList(val){
      this.$emit('change',val)
    }
  },
  computed:{
    indexSelectorId:{
      get(){
        this.$nextTick(()=>{
          this.isFocus = window.indexSelectorId === this.id;
          return window.indexSelectorId
        })
      },
      set(v){
        window.indexSelectorId = v
      }
    },
  },
  methods:{
    handleFocus(){
      this.indexSelectorId = this.id
    },
    eventListenerInit(){
      if(this.type === 'index'){
        EventBus.$on("indexSelect", (item) => {
          if(this.id===window.indexSelectorId){
            if(this.multiple){
              if(this.showList.some(obj=>obj===item.indicator)){
                this.showList = this.showList.filter(obj=>obj!==item.indicator)
              }else{
                this.showList.push(item.indicator)
              }
            }else{
              this.showList = item.indicator
            }
          }
        });
      }else if(this.type === 'variety'){
        EventBus.$on("varSelect", (item) => {
          if(this.id===window.indexSelectorId){
            if(this.multiple){
              if(this.showList.some(obj=>obj===item.varKey)){
                this.showList = this.showList.filter(obj=>obj!==item.varKey)
              }else{
                this.showList.push(item.varKey)
              }
            }else{
              this.showList= item.varKey
            }
          }
        });
      }
    },
    handleClose(tag){
      if(this.multiple){
        this.showList.splice(this.showList.findIndex(item=>item=== tag),1)
      }else{
        this.showList = ''
      }
      this.$emit('change',this.showList)
    }
  }
}
</script>

<style lang="scss" scoped>
.input-area{
  border: 1px solid #D8D8D8;
  border-radius: 5px;
  padding: 5px;
  min-height: 20px;
  &.isFocus{
    border-color: blue;
  }
}
</style>
