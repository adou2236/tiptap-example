<template>
<div>
  <div class="input-area" @click="handleFocus" >
    <el-tag
        class="index-tag"
        v-for="(tag,index) in showList"
        :key="index"
        closable
        type="warning"
        size="mini"
        :effect="isActive(tag,index)?'dark':'plain'"
        @click="handleClick(tag,index)"
        @close="handleClose(tag,index)">
      {{type==='index'?tag.nodeName||tag.indicator:tag.varKey}}
    </el-tag>
    <span v-show="showList.length==0" class="placeholder">请在右侧点击选择指标</span>
  </div>
  <!-- <div v-if="type==='index'" class="translate">
      单位换算：<el-input :disabled="!selectedTag" placeholder="用X表示原值，如X*10" v-model="selectedTag.formula" size="mini"/>
  </div>
  <div v-if="type==='variety'&&resiveType == 2" class="translate" >
      前
      <el-input-number
        v-model="pass"
        :disabled="!selectedTag"
        :min="0"
        size="mini"
        style="margin: 0 10px" />
      {{updateFrequency}}
  </div> -->
</div>
</template>

<script>
import { mapState } from 'vuex';
import {EventBus} from "../../../../../unit/eventBus";

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
     * 可选最大数量
     */
    maxCount:{
      type:Number,
      default:null
    },
    /**
     * 键值对应关系
     */
    list: {
      type: [Array, String],
    },
    tagClickable:{
      type:Boolean,
      default:true
    },
    /**
     * 是否可以重复选择指标
     */
    canBeRepeat:{
      type:Boolean,
      default:false
    },
    /**
     * 作为变量选择接受的类型默认时间
     */
    resiveType:{
      type:String,
      default:'2'
    }
  },
  data(){
    return{
      showList:this.list,
      id:'',
      isFocus:false,
      selectedTag:'',
      selectedIndex:0,
      pass:0,
      valueMap:{
        '1':'指标',
        '2':'时间',
        '3':'区域类型',
        '4':'区域',
      }
    }
  },
  mounted(){
    this.id = Math.random()
    this.eventListenerInit()
  },
  watch:{
    pass(v){
      this.selectedTag.pass = v*-1
    },
    showList(val){
      this.$emit('change',val)
    }
  },
  computed:{
    ...mapState({
      baseData: (state) => state.templateStore.baseData,
    }),
    updateFrequency(){
      return this.baseData.type == 5 ? '季' : '年'
    },
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
    isActive(tag,index){
      if(this.type === 'index'){
        return index == this.selectedIndex&&tag.nodeId == this.selectedTag.nodeId&&this.multiple
      }else{
        return index == this.selectedIndex&&tag.id === this.selectedTag.id&&this.multiple
      }
    },
    handleClick(tag,index){
      this.selectedTag = tag
      this.pass = tag.pass * -1
      if(this.tagClickable){
        this.selectedIndex = index
        this.$emit('tagClick',tag,index)
      }
    },
    handleFocus(){
      this.indexSelectorId = this.id
    },
    eventListenerInit(){
      if(this.type === 'index'){
        EventBus.$on("indexSelect", (item) => {
          if(this.id===window.indexSelectorId){
            if(this.multiple){
              if(!this.canBeRepeat&&this.showList.some(obj=>obj.nodeId===item.nodeId)){
                this.showList = this.showList.filter(obj=>obj.nodeId!==item.nodeId)
              }else if(!this.maxCount||this.showList.length<this.maxCount){
                this.showList.push(item)
              }
            }else{
              this.showList = [item]
            }
          }
        });
      }else if(this.type === 'variety'){
        EventBus.$on("varSelect", (item) => {
          if(this.id===window.indexSelectorId){
            if(item.keyType != this.resiveType){
              this.$message.info(`请输入${this.valueMap[this.resiveType]}类型变量`)
            }else if(this.multiple){
              if(!this.canBeRepeat&&this.showList.some(obj=>obj.id===item.id)){
                this.showList = this.showList.filter(obj=>obj.id!==item.id)
              }else if(!this.maxCount||this.showList.length<this.maxCount){
                this.showList.push(item)
              }
            }else{
              this.showList= [item]
            }
          }
        });
      }
    },
    handleClose(tag,index){
      let count = 0
      if(this.type === 'index'){
        count = this.showList.findIndex((item,i)=>item.nodeId === tag.nodeId&&i==index)
        this.showList.splice(count,1)
      }else{
        count = this.showList.findIndex((item,i)=>item.id === tag.id&&i==index)
        this.showList.splice(count,1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-area{
  border: 1px solid #D8D8D8;
  background: #FFF;
  width: 100%;
  border-radius: 5px;
  min-height: 28px;
  display: inline-block;
  vertical-align: middle;
  padding: 0 15px;
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .index-tag{
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    padding-right: 20px;
    cursor: pointer;
    user-select: none;
    margin: 3px 3px 3px 0;
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
  .placeholder{
    color: #949393;
    font-size: 12px;
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);

  }
}
.translate{
    display: flex;
    align-items: center;
    white-space: nowrap;
    padding-top: 10px;
  }
</style>
