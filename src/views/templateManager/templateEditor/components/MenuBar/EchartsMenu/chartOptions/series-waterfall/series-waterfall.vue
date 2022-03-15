<template>
  <div>
    <el-collapse-item title="数据" name="data">
      <el-form @submit.native.prevent size="mini" label-position="left">
        <el-form-item label="指标：" required>
          <index-inputer :tag-clickable="false"
                        :multiple="false"
                        type="index"
                        v-model="selectedIndex"
          ></index-inputer>
        </el-form-item>
        <el-form-item label="结束时间：" required>
          <time-inputer v-model="endTime"></time-inputer>
        </el-form-item>
        <el-form-item label="开始时间：" required>
          <time-inputer v-model="startTime"></time-inputer>
        </el-form-item>
        <collapse-options>
          <index-formatter :value="formula" @change="handleChange"></index-formatter>
          <el-form-item label="添加单位：" label-width="90px">
            <el-select v-model="scale">
              <el-option v-for="(item,index) in scales" :key="index" :value="item.id" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </collapse-options>
      </el-form>
    </el-collapse-item>
    <el-collapse-item title="图表设计" name="design">
      <el-form @submit.native.prevent label-position="left">
        <el-form-item label="图例显示：">
          <el-switch v-model="options.legend.show"></el-switch>
        </el-form-item>
        <el-form-item label="横坐标地域分组：">
          <el-switch v-model="options.additions.groupBy"></el-switch>
        </el-form-item>
        <el-form-item>
          <div style="display:flex;align-items: center;">
            上升颜色：
            <color-picker v-model="options.additions.colorMap[0]" @change="(v)=>colorChange(0,v)">
            </color-picker>
          </div>
          <div style="display:flex;align-items: center;">
            下降颜色：
            <color-picker v-model="options.additions.colorMap[1]" @change="(v)=>colorChange(1,v)">
            </color-picker>
          </div>
        </el-form-item>
      </el-form>
    </el-collapse-item>
    <el-collapse-item title="地域范围">
      <el-form @submit.native.prevent size="mini">
        <el-form-item v-if="index.xaxisType === 'region'" label="选择地域：">
          <el-radio-group v-model="index.xaxisIndex">
            <el-radio v-for="(item,index) in radios" :key="index" :label="item.id">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button type="text" @click="groupEdit">编辑地域组</el-button>
      </el-form>
    </el-collapse-item>
  </div>
</template>

<script>
import {objectArrayUnique, deepCopy} from "../../../../../unit/baseType";
import ColorPicker from "../../../../color-picker";
import IndexInputer from '../series-combo/indexInputer.vue';
import TimeInputer from '../components/time-inputer.vue';
import CollapseOptions from '../components/collapse-options.vue';
import IndexFormatter from '../components/index-formatter.vue';
import { regions } from '../components/regions';


export default {
  name: "series-combo",
  components: { IndexInputer, ColorPicker, TimeInputer, CollapseOptions, IndexFormatter},
  props:{
    //图表配置
    series:Array,
    //数据项
    index:Object,
    options:Object
  },
  data(){
    return{
      indexOptions:[],
      isFocus:false,
      //选择的指标
      selectedIndex:[],
      //选择的变量
      endTime:{},
      startTime:{},
      scales:[
        {id:'',label:'无单位'},
        {id:'%',label:'百分号'},
        {id:'‰',label:'千分号'},
      ],
      radios:regions()
      // clickTag:null,
      // clickTagIndex:null,
    }
  },
  watch:{
    comboIndex:{
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
      return this.selectedIndex?this.selectedIndex[0]?.formula || '' : null
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
    //时间与指标的组合指标
    comboIndex:{
      get(){
        let result = []
        try {
          result = [
            {
              index:this.selectedIndex[0],
              var:this.endTime
            },
            {
              index:this.selectedIndex[0],
              var:this.startTime
            },
          ]
        }catch (e) {
          result = []
        }
        return result
      }
    },
  },
  created(){
    this.selectedIndex = objectArrayUnique(this.index.items.map(item=>item.index),'nodeId')
    this.endTime = this.index.items.map(item=>item.var)[0]  
    this.startTime = this.index.items.map(item=>item.var)[1]  
  },
  methods:{
    handleChange(v){
      this.selectedIndex.forEach(item=>{
        item.formula = v
      })
      console.log(this.index)
    },
    colorChange(index,value){
      this.options.additions.colorMap.splice(index,1,value)
    },
    groupEdit(){
      this.$emit('groupEdit')
    },
    seriesInit(){
      // this.clickTag = null
      // this.clickTagIndex = null
      let series = []
      this.comboIndex.forEach((item,index)=>{
        if(this.options.series[index]){
          series.push(this.options.series[index])
        }else{
          series.push({
            "name": item.time+item.indicator,//指标名称
            "type": "stackBar",//图表名称
            "symbol":'circle',
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
