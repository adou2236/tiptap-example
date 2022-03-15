<template>
  <div>
    <el-collapse-item title="参考线" name="markline" v-if="chartType === 'scatter'||chartType === 'combo'||chartType === 'comboTime'">
      <el-button type="text" @click="addMarkLine">添加参考线</el-button>
      <markline-item v-for="(row,index) in options.additions.markLine"
        :key="index"
        :index="index"
        :row="row"
        :varsList="varsList"
        :functionsList="functionsList"
        :rootId="rootId"
        :chartType="chartType"
        @remove="deleteRow(index, options.additions.markLine)"
      ></markline-item>
      <!-- <el-table :data="options.additions.markLine" size="mini">
        <el-table-column width="200">
          <template slot="header">
            名称
            <el-button size="mini" type="text" @click="tagInsert('variety')">变量</el-button>
            <el-button size="mini" type="text" @click="tagInsert('function')">表达式</el-button>
            <el-button size="mini" type="text" @click="tagInsert('formula')">公式</el-button>
          </template>
          <template slot-scope="{row,$index}">
            <inline-editor :ref="`inline-editor-name-${$index}`"
                          class="inline-ipt"
                          :key="$index"
                          :value="row.name"
                          :range-id="rootId"
                          @update="(json)=>handleUpdate(row,'name',json)"
                          @focus="valueIptFocus('name',$index)"
                          :varsList="varsList"
                          :functionsList="functionsList">
            </inline-editor>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="150">
          <template slot-scope="{row}">
            <el-select size="mini" v-model="row.axis">
              <el-option value="xAxis" label="横坐标">横坐标</el-option>
              <el-option value="yAxis" label="纵坐标">纵坐标</el-option>
              <el-option v-if="chartType === 'scatter'" value="coord" label="斜线">斜线</el-option>
              <el-option value="xAverage" label="横坐标平均值">横坐标平均值</el-option>
              <el-option value="yAverage" label="纵坐标平均值">纵坐标平均值</el-option>
              <el-option v-if="chartType === 'scatter'" value="coordAverage" label="平均值斜线">平均值斜线</el-option>
              <el-option v-if="chartType === 'scatter'" value="xPoint" label="参考点横坐标">参考点横坐标</el-option>
              <el-option v-if="chartType === 'scatter'" value="yPoint" label="参考点纵坐标">参考点纵坐标</el-option>
              <el-option v-if="chartType === 'scatter'" value="standPoint" label="参考点">参考点斜线</el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="200" >
          <template slot="header">
            数值
            <el-button size="mini" type="text" @click="tagInsert('variety')">变量</el-button>
            <el-button size="mini" type="text" @click="tagInsert('function')">表达式</el-button>
            <el-button size="mini" type="text" @click="tagInsert('formula')">公式</el-button>
          </template>
          <template slot-scope="{row,$index}" v-if="row.axis!=='xAverage'&&row.axis!=='yAverage'&&row.axis!=='coordAverage'">
            <inline-editor :ref="`inline-editor-value-${$index}`"
                          class="inline-ipt"
                          :key="$index"
                          :value="row.value"
                          :range-id="rootId"
                          @update="(json)=>handleUpdate(row,'value',json)"
                          @focus="valueIptFocus('value',$index)"
                          :varsList="varsList"
                          :functionsList="functionsList">
            </inline-editor>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template slot-scope="{row}">
              <el-select v-model="row.style" size="mini">
                <el-option value="dashed" label="虚线">虚线</el-option>
                <el-option value="solid" label="实线">实线</el-option>
              </el-select>
          </template>
        </el-table-column>
        <el-table-column label="颜色">
          <template slot-scope="{row}">
            <color-picker v-model="row.color"></color-picker>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
                @click="deleteRow(scope.$index, options.additions.markLine)"
                type="text"
                size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table> -->
    </el-collapse-item>
    <el-collapse-item title="添加文本" name="graphic">
      <el-button type="text" @click="addGraphic">添加文本框</el-button>
      <el-table :data="options.graphic" :show-header="false" size="mini">
        <el-table-column>
          <template slot-scope="{row}">
            <el-input v-model="row.style.text" size="mini"/>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="text" @click="deleteRow(scope.$index, options.graphic)">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
  </div>
</template>

<script>
import { getFunctions, getVarsById } from '@/request/templateApi';
import ColorPicker from '../../../../color-picker.vue';
import InlineEditor from '../../../../inlineEditor.vue';
import MarklineItem from './markline-item.vue';

export default {
  components: { ColorPicker, InlineEditor, MarklineItem },
  name: "index",
  props:{
    options:Object,
    chartType:String,
    rootId:String,
  },
  data(){
    return{
      varsList:[],
      functionsList:[],
      focusIndex:'',
      foucsType:''
    }
  },
  computed:{
    coord:{
      get(){
        return
      }
    }
  },
  created(){
    Promise.all([
      this.getRangeVarietyList(this.rootId),
      this.getRangeFunctionList()
    ]).then(res=>{
      this.varsList = res[0]
      this.functionsList = res[1]
      // this.loading = false
    })
  },
  methods:{
    //TODO行内富文本输入框聚焦逻辑待优化，聚焦复制逻辑放入组件内部
    valueIptFocus(type,v){
      this.foucsType = type
      this.focusIndex = v
    },
    //智能文本插入
    tagInsert(type){
      this.$refs[`inline-editor-${this.foucsType}-${this.focusIndex}`].tagType = type
    },
    //此处的变量层层递进使用
    //获取局部变量列表
    async getRangeVarietyList(rangeId){
      let {data} = await getVarsById(rangeId)
      return data.data.data
    },
    //获取局部函数列表
    async getRangeFunctionList(){
      let {data} = await getFunctions()
      return data.data
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    handleUpdate(row,param,json){
      row[param] = json
    },
    addMarkLine(){
      this.options.additions.markLine.push({
        name:'新参考线',
        axis:'xAxis',
        value:'',
        color:'#A1A1A1',
        style:'dashed'
      })
    },
    /**
     * 生成新的自定义图形
     * id根据时间戳生成以保证唯一
     */
    addGraphic(){
      let graphic = {
        id: parseInt(new Date().getTime() / 1000),
        type: 'text',
        z: 100,
        draggable:true,
        left: 'center',
        top: 'center',
        style: {
            backgroundColor:'#A1A1A1',
            padding:[5,10],
            fill:"#FFFFFF",
            fontFamily:'KaiTi',
            text: `文本内容`,
            fontSize:16
        },
      }
      if(!this.options.graphic){
        this.options.graphic = []
      }
      this.options.graphic.push(graphic)
    }
  }
}
</script>

<style lang="scss" scoped>

.inline-ipt{
  min-height:28px;
  border-radius: 4px;
  &.focus{
    border:1px solid #1890ff
  }

}

</style>
