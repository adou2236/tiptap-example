<template>
    <div class="list" >
      <div class="type-tag">
        <i class="icon"></i>
        指标：
        <div @click="handleDraw" :class="isHidden?'drawer-btn':'drawer-btn filp'" ></div>
      </div>
      <index-list></index-list>
      <!-- <var-list :rootId="rootId" v-show="activeSpan === 'variety'"></var-list> -->
    </div>
</template>

<script>
import IndexList from "./indexList";
export default {
  name: "index",
  components: {IndexList},
  model:{
    prop:'isHidden',
    event:'change'
  },
  props:{
    rootId:String,
    isHidden:Boolean
  },
  data(){
    return{
    }
  },
  methods:{
    handleDraw(){
      this.$emit('change',!this.isHidden)
    }
  }
}
</script>

<style lang="scss" scoped>
.list{
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px 0;
}
.type-tag{
  width: 100%;
  display: flex;
  margin-bottom: 15px;
  padding: 0 20px;
  align-items: center;
  .icon{
    width: 20px;
    height: 20px;
    background: url('~@/assets/imgs/tiptap/index.png') no-repeat center / contain;
    margin-right: 8px;
  }
  .drawer-btn{
    position: absolute;
    cursor: pointer;
    right: 20px;
    top: 20px;
    right: 20px;
    white-space: nowrap;
    width: 20px;
    height: 20px;
    background: url("~@/assets/imgs/tiptap/drawBar.svg") no-repeat center/contain;
    transition: all ease 0.3s;
    &.filp{
      transform: rotate(180deg);
    }
  }

}


</style>
