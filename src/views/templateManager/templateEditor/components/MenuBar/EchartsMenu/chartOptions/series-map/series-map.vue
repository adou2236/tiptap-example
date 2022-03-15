<template>
  <el-form @submit.native.prevent label-position="left" size="mini">
    <!-- <el-form-item label="地图">
      <el-radio-group v-model="index.xaxisIndex">
        <el-radio label="provinces">31省</el-radio>
        <el-radio label="childAreas">报告区域下辖地区</el-radio>
        <el-radio label="csj">长三角</el-radio>
        <el-radio label="yga">粤港澳</el-radio>
        <el-radio label="jjj">京津冀</el-radio>
        <el-radio label="cy">成渝</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <el-collapse-item title="数据" name="data">
      <el-form-item label="指标：" required>
        <index-inputer :tag-clickable="true"
                      :multiple="true"
                      type="index"
                      :max-count="2"
                      :canBeRepeat="true"
                      v-model="selectedIndex"
                      @tagClick="(e,index)=>handleTagClick(e,index,'index')">
          </index-inputer>
      </el-form-item>
      <el-form-item label="时间：" required>
        <time-inputer :disabled="!clickTag" v-model="selectedVar"></time-inputer>
      </el-form-item>
      <collapse-options>
        <index-formatter :disabled="!clickTag" :value="formula" @change="handleChange"></index-formatter>
      </collapse-options>
        <!-- <el-input v-if="clickTag" :disabled="!clickTag" placeholder="用X表示原值，如X*10" v-model="clickTag.formula" size="mini"/> -->

      <!-- <div class="gray-box" v-if="clickTag">
        <el-form-item label="时间" required>
          <index-inputer :tag-clickable="true"
                        :multiple="false"
                        type="variety"
                        v-if="clickTag"
                        :key="clickTagIndex"
                        v-model="selectedVar"
                        @tagClick="(e,index)=>handleTagClick(e,index,'variety')"
          ></index-inputer>
        </el-form-item>
      </div> -->
    </el-collapse-item>
    <el-collapse-item title="图表设计" name="design">
      <el-form-item label="添加单位：">
        <el-radio-group v-model="options.additions.dataType">
          <el-radio label="number">无单位</el-radio>
          <el-radio label="percentage">百分号</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="表格排序：">
        <el-radio-group v-model="options.additions.orderType">
          <el-radio label="desc">倒序</el-radio>
          <el-radio label="insc">正序</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-collapse-item>
    <el-collapse-item title="地域范围" name="region">
      <el-form-item>
        <el-button type="text" @click="groupEdit">编辑地域组</el-button>
        <collapse-options>
          <el-table :data="options.additions.group" size="mini">
            <el-table-column label="地区" prop="groupName"></el-table-column>
            <el-table-column label="颜色">
              <template slot-scope="{row}">
                <color-picker v-model="row.color"></color-picker>
              </template>
            </el-table-column>
          </el-table>
        </collapse-options>
      </el-form-item>
    </el-collapse-item>
  </el-form>
</template>

<script>
import IndexInputer from "../series-combo/indexInputer";
import {deepCopy,objectArrayUnique} from "../../../../../unit/baseType";
import ColorPicker from "../../../../color-picker";
import TimeInputer from '../components/time-inputer.vue';
import IndexFormatter from '../components/index-formatter.vue';
import CollapseOptions from '../components/collapse-options.vue';
export default {
  name: "series-map",
  components: {ColorPicker, IndexInputer,TimeInputer,IndexFormatter, CollapseOptions},
  props:{
    series:Array,
    index:Object,
    options:Object
  },
  data(){
    return{
      selectedItems:deepCopy(this.index.items),
      clickTag:null,
      clickTagIndex:null,
    }
  },
  watch:{
    selectedItems:{
      handler(v){
        this.index.items = v
      },
      immediate:false,
      deep:true
    },
  },
  computed:{
    formula(){
      return this.clickTag ? this.clickTag?.formula || '' : null
    },
    selectedIndex:{
      get(){
        return this.selectedItems.map(item=>item.index)
      },
      set(v){
        this.clickTag = null
        this.clickTagIndex = null
        this.selectedItems = v.map((item,index)=>{
          return{
            index:item,
            var:this.selectedItems[index]?.var||undefined
          }
        })
      }
    },
    selectedVar:{
      get(){
        if(this.clickTag && this.selectedItems[this.clickTagIndex].var){
          let res = this.selectedItems[this.clickTagIndex].var
          return res
        }else{
          return {}
        }
      },
      set(v){
        this.selectedItems[this.clickTagIndex].var = v
      }
    }
  },
  methods: {
    handleChange(v){
      this.clickTag.formula = v
    },
    groupEdit(){
      this.$emit('groupEdit')
    },
    handleTagClick(tag,index,type){
      if(type === 'index'){
        this.clickTagIndex = index
        this.clickTag = tag
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.group-edit{
  color: #409eff;
  cursor: pointer;
}
.gray-box{
  background: #F1F1F1;
  padding: 10px;
  margin-bottom: 20px;
}

</style>
