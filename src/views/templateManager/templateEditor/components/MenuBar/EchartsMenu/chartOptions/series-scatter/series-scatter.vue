<template>
  <div>
    <el-collapse-item title="横坐标数据" name="xAxis">
      <el-form @submit.native.prevent size="mini" label-position="left">
        <el-form-item label="横坐标指标：" required>
          <index-inputer v-model="xIndex"></index-inputer>
        </el-form-item>
        <el-form-item label="时间：" required>
          <time-inputer v-model="xTime"></time-inputer>
        </el-form-item>
        <collapse-options>
          <index-formatter :disabled="xFormula == null" :value="xFormula" @change="(v)=>{xIndex[0].formula = v}"></index-formatter>
          <el-form-item label="添加单位：" label-width="90px">
            <el-select v-model="xscale">
              <el-option v-for="(item,index) in scales" :key="index" :value="item.id" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="边界：">
            <div class="inline-form">
              <el-form-item label="最大值：" label-width="70px">
                <el-input  @input="(v)=>xRangeChange('max',v)" :value="options.xAxis.max"></el-input>
              </el-form-item>
              <el-form-item label="最小值：" label-width="70px">
                <el-input  @input="(v)=>xRangeChange('min',v)" :value="options.xAxis.min"></el-input>
              </el-form-item>
            </div>
          </el-form-item>
        </collapse-options>
      </el-form>
    </el-collapse-item>
    <el-collapse-item title="纵坐标数据" name="yAxis">
      <el-form @submit.native.prevent size="mini" label-position="left">
        <el-form-item label="纵坐标指标：" required>
          <index-inputer v-model="yIndex"></index-inputer>
        </el-form-item>
        <el-form-item label="时间：" required>
          <time-inputer v-model="yTime"></time-inputer>
        </el-form-item>
        <collapse-options>
          <index-formatter :disabled="yFormula == null" :value="yFormula" @change="(v)=>{yIndex[0].formula = v}"></index-formatter>
          <el-form-item label="添加单位：" label-width="90px" >
            <el-select v-model="yscale">
              <el-option v-for="(item,index) in scales" :key="index" :value="item.id" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="边界：">
            <div class="inline-form">
              <el-form-item label="最大值" label-width="70px">
                <el-input @input="(v)=>yRangeChange('max',v)" :value="options.yAxis.max"></el-input>
              </el-form-item>
              <el-form-item label="最小值" label-width="70px">
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
        <el-form-item label="标签显示：">
          <el-switch v-model="options.additions.labShow"></el-switch>
        </el-form-item>
        <el-form-item label="标签连线显示：">
          <el-switch v-model="options.additions.labLine"></el-switch>
        </el-form-item>
        <el-form-item label="相关域显示：">
          <el-switch v-model="options.additions.regressArea"></el-switch>
        </el-form-item>
        <el-form-item label="散点大小：">
          <el-input-number v-model="options.additions.symbolSize"></el-input-number>
        </el-form-item>
        <el-form-item label="标签偏移：" >
          <div class="inline-form">
            <el-form-item label="横向：">
              <el-input-number :disabled="!options.additions.labShow" style="width:150px;" v-model="options.additions.labPosX" />
            </el-form-item>
            <el-form-item label="纵向：" >
              <el-input-number :disabled="!options.additions.labShow" style="width:150px;" v-model="options.additions.labPosY" />
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>
    </el-collapse-item>
    <el-collapse-item title="地域范围" name="region">
      <el-form size="mini" label-position="left">
        <el-form-item label="选择地域：">
          <el-radio-group v-model="index.xaxisIndex">
            <el-radio v-for="(item,index) in radios" :key="index" :label="item.id">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
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
              <el-table-column label="数据标签">
                <template slot-scope="{row}">
                  <el-radio-group v-model="row.labelFormatter">
                    <el-radio label="{c}">数值</el-radio>
                    <el-radio label="{b}">地域</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
            </el-table>
          </collapse-options>
        </el-form-item>
        <el-form-item label="突出地区：(逗号分隔)">
          <el-input v-model="locationPinArr"></el-input>
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </div>
</template>

<script>
import IndexInputer from "../series-combo/indexInputer";
import ColorPicker from "../../../../color-picker";
import TimeInputer from '../components/time-inputer.vue';
import IndexFormatter from '../components/index-formatter.vue';
import CollapseOptions from '../components/collapse-options.vue';
import { regions } from '../components/regions';

export default {
  name: "series-scatter",
  components: {ColorPicker, IndexInputer,TimeInputer, IndexFormatter, CollapseOptions},
  props:{
    //图表配置
    series:Array,
    //额外配置（辅助线，放大地区，标记大小）
    additions:Object,
    //数据项
    index:Object,
    //配置项
    options:Object
  },
  data(){
    return{
      group:[],
      //横坐标指标
      xIndex: [],
      //纵坐标指标
      yIndex: [],
      //横坐标选择的时间
      xTime: {},
      //纵坐标选择的时间
      yTime: {},
      scales:[
        {id:'',label:'无单位'},
        {id:'%',label:'百分号'},
        {id:'‰',label:'千分号'},
      ],
      radios:regions()
    }
  },
  watch:{
    comboIndex:{
      handler(v){
        this.index.items = v
      },
      immediate:false,
      deep:true
    },
  },
  computed:{
    xscale:{
      get(){
        let v = ''
        try {
          v = this.options.xAxis.axisLabel.formatter.split('{value}')[1]
        } catch (error) {
          v = ''
        }
        return v
      },
      set(v){
        let {xAxis} = this.options
        xAxis.axisLabel = {
          formatter : `{value}${v}`
        }
        this.options.xAxis = xAxis
      }
    },
    yscale:{
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
    xFormula(){
      return this.xIndex[0] ? this.xIndex[0].formula || '' : null
    },
    yFormula(){
      return this.yIndex[0] ? this.yIndex[0].formula || '' : null
    },
    comboIndex:{
      get(){
        let result = []
        let selectedIndex = [...this.xIndex,...this.yIndex]
        let selectedVar = [this.xTime,this.yTime]
        try {
          selectedIndex.forEach((v,i)=>{
            result.push({
                index:v,
                var:selectedVar[i]
              })
          })
        }catch (e) {
          result = []
        }
        return result
      }
    },
    locationPinArr:{
      get(){
        return this.options.additions.locationPin ? this.options.additions.locationPin.toString() : ''
      },
      set(v){
        this.options.additions.locationPin = v.split(',')
      }
    },
  },
  created(){
    this.indexInit()
  },
  methods:{
    yRangeChange(type,v){
      if(v == '' || v==null){
        this.options.yAxis[type] = null
      }else{
        this.options.yAxis[type] = v
      }
    },
    xRangeChange(type,v){
      if(v == '' || v==null){
        this.options.xAxis[type] = null
      }else{
        this.options.xAxis[type] = v
      }
    },
    groupEdit(){
      this.$emit('groupEdit')
    },
    indexInit(){
      //TODO数值初始化步骤需要优化
      let {items} = this.index
      let xIndicator = []
      let yIndicator = []
      let xVariety = {}
      let yVariety = {}
      for(let i = 0;i<items.length;i++){
        if(i==0){
          xIndicator.push(items[i].index)
          xVariety = items[i].var
        }
        if(i==1){
          yIndicator.push(items[i].index)
          yVariety = items[i].var
        }
      }
      this.xIndex = xIndicator
      this.yIndex = yIndicator
      this.xTime = xVariety
      this.yTime = yVariety
    },


  }
}
</script>

<style lang="scss" scoped>
.group-edit{
  color: #409eff;
  cursor: pointer;
}

</style>
