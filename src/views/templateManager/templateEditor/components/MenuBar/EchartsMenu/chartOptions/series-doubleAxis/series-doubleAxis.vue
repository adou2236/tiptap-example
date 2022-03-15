<template>
  <div>
    <el-collapse-item title="数据" name="data">
      <el-form size="mini" label-position="left">
        <el-form-item label="指标：" required>
          <index-inputer :tag-clickable="true"
                        :multiple="true"
                        type="index"
                        :canBeRepeat="true"
                        v-model="selectedIndex"
                        ref="index-inputer"
                        @tagClick="(e,index)=>handleTagClick(e,index,'index')"
          ></index-inputer>
        </el-form-item>
        <series-option  v-if="clickTag"
                        :additions="options.additions"
                        :clickTag="clickTag"
                        :index="clickTagIndex"
                        :key="clickTagIndex"
                        :series="options.series[clickTagIndex]"
                        @close="optionClose">
          <el-form-item label="时间：" required>
            <time-inputer :disabled="!clickTag" v-model="selectedVar"></time-inputer>
          </el-form-item>
          <index-formatter :disabled="!clickTag" :value="formula" @change="handleChange"></index-formatter>
          <el-form-item label="对应轴：">
            <el-radio-group v-model="options.series[clickTagIndex].yAxisIndex">
              <el-radio :label="0">左轴</el-radio>
              <el-radio :label="1">右轴</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="数据标签：">
            <el-checkbox-group style="display:inline-block" 
                              v-model="options.series[clickTagIndex].labelShowing">
              <el-checkbox label="all">所有值</el-checkbox>
              <el-checkbox label="sne">始末值</el-checkbox>
              <el-checkbox label="max">最高值</el-checkbox>
              <el-checkbox label="min">最低值</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </series-option>
        <collapse-options>
          
          <el-radio-group style="margin:10px 0" size="mini" v-model="axisIndex">
            <el-radio-button :label="0">左轴</el-radio-button>
            <el-radio-button :label="1">右轴</el-radio-button>
          </el-radio-group>
          <el-form-item label="添加单位：" label-width="90px">
            <el-select v-model="dscale">
              <el-option v-for="(item,index) in scales" :key="index" :value="item.id" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="边界：">
            <div class="inline-form">
              <el-form-item label="最大值：" label-width="70px">
                <el-input @input="(v)=>yRangeChange('max',axisIndex,v)" :value="options.yAxis[axisIndex].max"></el-input>
              </el-form-item>
              <el-form-item label="最小值：" label-width="70px"> 
                <el-input @input="(v)=>yRangeChange('min',axisIndex,v)" :value="options.yAxis[axisIndex].min"></el-input>
              </el-form-item>
            </div>
          </el-form-item>
        </collapse-options>
      </el-form>
    </el-collapse-item>
    <el-collapse-item title="图表设计" name="design">
      <el-form label-position="left" size="mini">
        <el-form-item label="图例显示：">
          <el-switch v-model="options.legend.show"></el-switch>
        </el-form-item>
        <el-form-item label="横坐标地域分组：">
          <el-switch v-model="options.additions.groupBy"></el-switch>
        </el-form-item>
        <el-form-item label="指标排序：">
          <el-radio-group v-model="options.additions.orderType" >
            <el-radio label="desc">倒序</el-radio>
            <el-radio label="insc">正序</el-radio>
            <el-radio label="none">不排序</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-collapse-item>
    <el-collapse-item title="地域范围" name="region">
      <el-form label-position="left" size="mini">
        <el-form-item>
          <el-form-item v-if="index.xaxisType === 'region'" label="选择地域：">
            <el-radio-group v-model="index.xaxisIndex">
              <el-radio v-for="(item,index) in radios" :key="index" :label="item.id">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
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
      </el-form>
    </el-collapse-item>
  </div>
</template>

<script>
import IndexInputer from "../series-combo/indexInputer";
import SeriesOption from "../series-combo/series-option";
import {deepCopy} from "../../../../../unit/baseType";
import ColorPicker from "../../../../color-picker";
import TimeInputer from '../components/time-inputer.vue';
import CollapseOptions from '../components/collapse-options.vue';
import IndexFormatter from '../components/index-formatter.vue';
import { regions } from '../components/regions';


export default {
  name: "series-doubleAxis",
  components: {SeriesOption, IndexInputer, ColorPicker, TimeInputer, CollapseOptions, IndexFormatter},
  props:{
    //图表配置
    series:Array,
    //数据项
    index:Object,
    options:Object
  },
  data(){
    return{
      selectedItems:deepCopy(this.index.items),
      clickTag:null,
      clickTagIndex:null,
      axisIndex:0,
      scales:[
        {id:'',label:'无单位'},
        {id:'%',label:'百分号'},
        {id:'‰',label:'千分号'},
      ],
      radios:regions()
    }
  },
  watch:{
    selectedItems:{
      handler(v){
        this.index.items = v
        this.seriesInit()
      },
      immediate:false,
      deep:true
    },
  },
  computed:{
    formula(){
      return this.clickTag ? this.clickTag?.formula || '' : null
    },
    dscale:{
      get(){
        let v = ''
        try {
          v = this.options.yAxis[this.axisIndex].axisLabel.formatter.split('{value}')[1]
        } catch (error) {
          v = ''
        }
        return v
      },
      set(v){
        let {yAxis} = this.options
        yAxis[this.axisIndex].axisLabel = {
          formatter : `{value}${v}`
        }
        this.options.yAxis = yAxis
      }
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
  methods:{
    optionClose(){
      this.clickTag = null
      this.$refs['index-inputer'].selectedIndex = null
    },
    handleChange(v){
      this.clickTag.formula = v
    },
    yRangeChange(type,index,v){
      if(v == '' || v==null){
        this.options.yAxis[index][type] = null
      }else{
        this.options.yAxis[index][type] = v
      }
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
    //TODO重写初始化逻辑
    seriesInit(){
      let series = []
      this.selectedItems.forEach((item,index)=>{
        if(this.options.series[index]){
          series.push(this.options.series[index])
        }else{
          series.push({
            type: "bar",//图表名称
            name: null,
            yAxisIndex:0,//对应哪个轴
            barWidth: 6,//柱宽度
            symbol:'circle',//散点图形状
            labelShowing:[]
          })
        }
      })
      this.options.series = series
    },
  }
}
</script>

<style scoped>

</style>
