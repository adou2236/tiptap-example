<template>
  <div class="input-area" @click="handleFocus" >
    <el-tag
        class="index-tag"
        v-for="(tag,index) in showList"
        :key="index"
        closable
        size="mini"
        @click="handleClick(tag)"
        @close="handleClose(tag)">
      {{tag.dataType==='index'?tag.indicator:tag.varKey}}
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
    list: {
      type: [Array, String],
    },
    tagClickable:{
      type:Boolean,
      default:false
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
    handleClick(tag){
      if(this.tagClickable){
        this.$emit('tagClick',tag)
      }
    },
    handleFocus(){
      this.indexSelectorId = this.id
    },
    eventListenerInit(){
      if(this.type === 'index'){
        EventBus.$on("indexSelect", (item) => {
          /**
           * frequency: (...)
           id: (...)
           indicator: (...)
           label: (...)
           type: (...)
           unit: (...)
           */
          item.dataType = 'index'
          if(this.id===window.indexSelectorId){
            if(this.multiple){
              if(this.showList.some(obj=>obj.indicator===item.indicator)){
                this.showList = this.showList.filter(obj=>obj.indicator!==item.indicator)
              }else{
                this.showList.push(item)
              }
            }else{
              this.showList = [item]
            }
          }
        });
      }else if(this.type === 'variety'){
        EventBus.$on("varSelect", (item) => {
          /**
           * id: (...)
           keyType: (...)
           segmentId: (...)
           valueType: (...)
           varKey: (...)
           varValue: (...)
           */
          item.dataType = 'variety'
          if(this.id===window.indexSelectorId){
            if(this.multiple){
              if(this.showList.some(obj=>obj.varKey===item.varKey)){
                this.showList = this.showList.filter(obj=>obj.varKey!==item.varKey)
              }else{
                this.showList.push(item)
              }
            }else{
              this.showList= [item]
            }
          }
        });
      }
    },
    handleClose(tag){
      if(tag.dataType === 'index'){
        this.showList.splice(this.showList.findIndex(item=>item.indicator === tag.indicator),1)
      }else{
        this.showList.splice(this.showList.findIndex(item=>item.varKey === tag.varKey),1)
      }
      this.$emit('change',this.showList)
    }
  }
}
</script>

<style lang="scss" scoped>
.input-area{
  border: 1px solid #D8D8D8;
  width: 250px;
  border-radius: 5px;
  padding: 5px;
  min-height: 20px;
  display: inline-block;
  vertical-align: middle;
  .index-tag{
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    padding-right: 20px;
    /deep/i{
      position: absolute!important;
      right: 3px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  &.isFocus{
    border-color: blue;
  }
}
</style>
