<template>
  <div>
    <div v-if="chartType == 'doubleAxis'" >
      <el-radio-group style="margin:10px 0" size="mini" v-model="axisIndex">
        <el-radio-button :label="0">左轴</el-radio-button>
        <el-radio-button :label="1">右轴</el-radio-button>
      </el-radio-group>
      <el-form @submit.native.prevent size="mini" label-position="left">
        <el-form-item label="纵轴标题" label-width="90px">
          <el-input placeholder="请输入纵轴标题" v-model="options.yAxis[axisIndex].name"/>
        </el-form-item>
        <el-form-item label="纵轴标题位置">
          <div class="inline-form">
            <el-form-item :label="options.yAxis[axisIndex].nameRotate == 90?'左右偏移':'上下偏移'">
              <el-input-number v-model="options.additions.yNameTop[axisIndex]" />
            </el-form-item>
            <el-form-item :label="options.yAxis[axisIndex].nameRotate == 90?'上下偏移':'左右偏移'">
              <el-input-number v-model="options.additions.yNameLeft[axisIndex]" />
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-form v-else @submit.native.prevent size="mini" label-position="left">
      <el-form-item label-width="90px" label="纵轴标题">
        <el-input placeholder="请输入纵轴标题" v-model="options.yAxis.name"/>
      </el-form-item>
      <el-form-item label="纵轴标题位置">
        <div class="inline-form">
          <el-form-item :label="options.yAxis.nameRotate == 90?'左右偏移':'上下偏移'">
            <el-input-number v-model="options.additions.yNameTop" />
          </el-form-item>
          <el-form-item :label="options.yAxis.nameRotate == 90?'上下偏移':'左右偏移'">
            <el-input-number v-model="options.additions.yNameLeft" />
          </el-form-item>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  props:{
    options:Object,
    chartType:String
  },
  data(){
    return{
      axisIndex:0,
      scales:[
        {id:'',label:'无单位'},
        {id:'%',label:'百分号'},
        {id:'‰',label:'千分号'},
      ]
    }
  },
  mounted(){
  },
  computed:{
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
    }

  },
  methods:{
    yRangeChange(type,index,v){
      if(v == '' || v==null){
        this.options.yAxis[index][type] = null
      }else{
        this.options.yAxis[index][type] = v
      }
    },
  }
};
</script>
