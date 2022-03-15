<template>
  <div class="index-list">
    <el-input size="small" class="search-ipt" placeholder="搜索指标" v-model="keyword"/>
    <el-scrollbar style="flex:1">
       <el-tree
          ref="tree"
          class="index-tree"
          node-key="nodeId"
          :data = indexList
          :props="defaultProps"
          :filter-node-method="filterNode"
          icon-class="icon-my-folder"
          @node-click="handleClick">
          <span slot-scope="{node}" :title="node.label">{{node.label}}</span>
        </el-tree>
    </el-scrollbar>


  </div>
</template>

<script>
import {getIndexList,getIndexTree} from "@/request/templateApi";
import {EventBus} from "../../../unit/eventBus";

export default {
  name: "indexList",
  data(){
    return{
      indexList:[],
      keyword:'',
      defaultProps:{
        label:'nodeName'
      }
    }
  },
  async created() {
    await this.getIndexTree()
  },
  watch:{
    keyword(val){
      this.$refs.tree.filter(val)
    }
  },
  methods:{
    handleClick(item){
      if(item.isSelect){
        EventBus.$emit('indexSelect',{
          nodeId:item.nodeId,
          nodeName:item.nodeName,
          type:'product',
          formula:'round(X,2)'//默认保留两位小数
        })
      }
    },
    filterNode(value,data){
      if(!value){
        return true
      }else{
        return data.nodeName.indexOf(value) !== -1
      }
    },
    async getIndexTree(){
      let {data} = await getIndexTree()
      this.indexList = data.data.children
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
  .index-item{
    padding:5px 10px;
    cursor: pointer;
    &:hover{
      background: #c6c6c6;
    }
  }
  .index-tree{
    padding: 0 20px;
  }
}
/deep/.el-tree-node__content {
  text-align: left;
  display: flex;
  height: 18px;
  line-height: 18px;
  overflow: hidden;
  align-items: center;
  vertical-align: middle;
  white-space: nowrap;
  text-overflow: ellipsis;
  .icon-my-folder{
      background: url('~@/assets/imgs/tiptap/folder.svg') no-repeat center/contain;
      height: 12px;
      margin-right: 5px;
      &::before{
        content:'1';
        font-size: 12px;
        width: 12px;
        visibility: hidden;
      }
    }
    .icon-my-folder.is-leaf{
      background:transparent
    }
    .el-tree-node__expand-icon.expanded{
      transform: rotate(0);
    }
  &:hover {
    background: rgba(54, 164, 253, 0.2);
  }
}
/deep/.el-tree-node:focus > .el-tree-node__content {
  color: #12417f;
  background: rgba(54, 164, 253, 0.2);
}
/deep/.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: rgba(54, 164, 253, 0.2);
}
</style>
