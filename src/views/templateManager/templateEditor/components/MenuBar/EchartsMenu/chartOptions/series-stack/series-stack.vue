<template>
  <div>
    <el-collapse-item title="数据" name="data">
      <el-form @submit.native.prevent size="mini" label-position="left">
        <el-form-item label="指标：" required>
          <index-inputer ref="index-inputer"
                        :tag-clickable="true"
                        :multiple="true"
                        type="index"
                        :canBeRepeat="true"
                        v-model="selectedIndex"
                        @tagClick="(e,index)=>handleTagClick(e,index,'index')"
          ></index-inputer>
        </el-form-item>
        <stack-option  v-if="clickTag"
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
          <el-form-item label="堆叠类型：">
            <el-radio-group v-model="options.additions.stackType">
              <el-radio label="value">数值堆叠</el-radio>
              <el-radio label="percentage">百分比堆叠</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="图像类型：">
            <el-select v-model="chartType">
              <el-option v-for="item in chartTypes" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="柱宽：" v-if="chartType === 'bar'">
            <el-input-number :min="1" :step="1" :step-strictly="true" v-model="barWidth"></el-input-number>
          </el-form-item>
          <el-form-item label="数据标签：">
            <el-radio-group v-model="options.additions.showValue">
              <el-radio label="none">不显示</el-radio>
              <el-radio label="number">数值</el-radio>
              <el-radio label="percentage">百分比</el-radio>
            </el-radio-group>
          </el-form-item>
        </stack-option>
        <collapse-options>
          
          <el-form-item label="添加单位：" label-width="90px">
            <el-select v-model="scale">
              <el-option v-for="(item,index) in scales" :key="index" :value="item.id" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="边界：">
            <div class="inline-form">
              <el-form-item label="最大值：" label-width="70px">
                <el-input @input="(v)=>yRangeChange('max',v)" :value="options.yAxis.max"></el-input>
              </el-form-item>
              <el-form-item label="最小值：" label-width="70px">
                <el-input @input="(v)=>yRangeChange('min',v)" :value="options.yAxis.min"></el-input>
              </el-form-item>
            </div>
          </el-form-item>
        </collapse-options>
      </el-form>
    </el-collapse-item>
    <el-collapse-item title="图表设计" name="design">
      <el-form size="mini" label-position="left">
        <el-form-item label="图例显示：">
          <el-switch v-model="options.legend.show"></el-switch>
        </el-form-item>
        <el-form-item label="横纵轴转置：">
          <el-switch v-model="options.additions.reverse"></el-switch>
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
      <el-form size="mini" label-position="left">
        <el-form-item v-if="index.xaxisType === 'region'" label="选择地域：">
          <el-radio-group v-model="index.xaxisIndex">
            <el-radio v-for="(item,index) in radios" :key="index" :label="item.id">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="groupEdit">编辑地域组</el-button>
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
import StackOption from './stack-option.vue';
import TimeInputer from '../components/time-inputer.vue';
import CollapseOptions from '../components/collapse-options.vue';
import IndexFormatter from '../components/index-formatter.vue';
import { regions } from '../components/regions';


export default {
  name: "series-combo",
  components: {SeriesOption, IndexInputer, ColorPicker, StackOption, TimeInputer, CollapseOptions, IndexFormatter},
  props:{
    //数据项
    index:Object,
    //图表配置
    options:Object
  },
  data(){
    return{
      selectedItems:deepCopy(this.index.items),
      clickTag:null,
      clickTagIndex:null,
      chartTypes:[
        {id:'bar',label:'堆叠柱状图'},
        {id:'line',label:'堆叠折线图'},
      ],
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
    scale:{
      get(){
        let v = ''
        try {
          v = this.options.yAxis.axisLabel.formatter.split('{value}')[1]
        } catch (error) {
          v = ''
        }
        return v
      },
      set(v){
        let {yAxis} = this.options
        yAxis.axisLabel = {
          formatter : `{value}${v}`
        }
        this.options.yAxis = yAxis
      }
    },
    barWidth:{
      get(){
        return this.options.series[0].barWidth || 6
      },
      set(v){
        this.options.series.forEach(item=>{
          item.barWidth = v,
          item.barMaxWidth = v
        })
      }
    },
    chartType:{
      get(){
        return this.options.series[0].type || 'bar'
      },
      set(v){
        this.options.series.forEach(item=>{
          item.type = v
        })
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
    yRangeChange(type,v){
      if(v == '' || v==null){
        this.options.yAxis[type] = null
      }else{
        this.options.yAxis[type] = v
      }
    },
    barWidthChange(v){
      this.series.barMaxWidth = v
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
    seriesInit(){
      let series = []
      this.selectedItems.forEach((item,index)=>{
        if(this.options.series[index]){
          series.push(this.options.series[index])
        }else{
          series.push({
            type: "bar",//图表名称
            name: null,
            barWidth: 6,//柱宽度
            stack:'total',
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
