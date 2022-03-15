<template>
  <el-form @submit.native.prevent size="mini" label-position="left">
    <el-collapse-item title="数据" name="data">
      <el-form-item label="指标：" required>
        <index-inputer
          ref="index-inputer"
          :tag-clickable="true"
          :multiple="true"
          type="index"
          :canBeRepeat="true"
          v-model="selectedIndex"
          @tagClick="(e, index) => handleTagClick(e, index, 'index')"
        ></index-inputer>
      </el-form-item>
      <el-form-item v-if="index.xaxisType === 'time'" label="时间范围：" required>
        <div class="time-selector">
          近
          <el-input v-model="timeValue" />
          <el-select v-model="unit">
            <el-option
              v-for="item in units"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <series-time-option
        v-if="clickTag"
        :additions="options.additions"
        :clickTag="clickTag"
        :index="clickTagIndex"
        :key="clickTagIndex"
        :series="options.series[clickTagIndex]"
        :regionType="selectedVar"
        @close="optionClose"
      >
        <index-formatter :disabled="!clickTag" :value="formula" @change="handleChange"></index-formatter>
        <el-form-item label="选择地域：">
          <el-radio-group v-model="selectedVar">
            <el-radio label="currentArea">当前地区</el-radio>
            <el-radio v-for="(item,index) in radios" :disabled="count > 1" :key="index" :label="item.id">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="堆叠类型:">
          <el-radio-group v-model="options.additions.stackType">
            <el-radio label="value">数值堆叠</el-radio>
            <el-radio label="percentage">百分比堆叠</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图像类型:">
          <el-select v-model="chartType">
            <el-option
              v-for="item in chartTypes"
              :label="item.label"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="柱宽:" v-if="chartType === 'bar'">
          <el-input-number
            :min="1"
            :step="1"
            :step-strictly="true"
            v-model="barWidth"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="数据标签">
          <el-radio-group v-model="options.additions.showValue">
            <el-radio label="none">不显示</el-radio>
            <el-radio label="number">数值</el-radio>
            <el-radio label="percentage">百分比</el-radio>
          </el-radio-group>
        </el-form-item>
      </series-time-option>
      <collapse-options>
        <el-form-item label-width="90px" label="添加单位：">
          <el-select v-model="scale">
            <el-option v-for="(item,index) in scales" :key="index" :value="item.id" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="边界：">
          <div class="inline-form">
            <el-form-item label="最大值：" label-width="70px">
              <el-input @input="(v) => yRangeChange('max', v)" :value="options.yAxis.max"></el-input>
            </el-form-item>
            <el-form-item label="最小值：" label-width="70px">
              <el-input @input="(v) => yRangeChange('min', v)" :value="options.yAxis.min"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
      </collapse-options>

    </el-collapse-item>
    <el-collapse-item title="图表设计" name="design">
      <el-form-item label="图例显示：">
        <el-switch v-model="options.legend.show"></el-switch>
      </el-form-item>
      <el-form-item label="横纵轴转置：">
        <el-switch v-model="options.additions.reverse"></el-switch>
      </el-form-item>
    </el-collapse-item>
  </el-form>
</template>

<script>
import IndexInputer from "../series-combo/indexInputer";
import { deepCopy } from "../../../../../unit/baseType";
import ColorPicker from "../../../../color-picker";
import SeriesTimeOption from "./stack-time-option";
import CollapseOptions from '../components/collapse-options.vue';
import IndexFormatter from '../components/index-formatter.vue';
import { regions } from '../components/regions';

export default {
  name: "series-combo",
  components: { IndexInputer, ColorPicker, SeriesTimeOption, CollapseOptions, IndexFormatter },
  props: {
    //图表配置
    series: Array,
    //数据项
    index: Object,
    options: Object,
  },
  data() {
    return {
      indexOptions: [],
      selectedItems: deepCopy(this.index.items),
      isFocus: false,
      clickTag: null,
      clickTagIndex: null,
      timeValue: 1,
      unit: "year",
      units: [
        { id: "year", label: "年" },
        { id: "month", label: "月" },
        { id: "day", label: "日" },
        { id: "week", label: "周" },
        { id: "season", label: "季" },
      ],
      chartTypes: [
        { id: "bar", label: "堆叠柱状图" },
        { id: "line", label: "堆叠折线图" },
      ],
      scales:[
        {id:'',label:'无单位'},
        {id:'%',label:'百分号'},
        {id:'‰',label:'千分号'},
      ],
      radios:regions()
    };
  },
  watch: {
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
    selectedItems: {
      handler(v) {
        this.index.items = v;
        this.seriesInit();
      },
      immediate: false,
      deep: true,
    },
    comboTime(v) {
      this.index.xaxisIndex = v;
    },
    count(v) {
      if (v > 1) {
        this.selectedItems = v.map((item, index) => {
          return {
            index: item,
            area: "currentArea",
          };
        });
      }
    },
  },
  computed: {

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
    barWidth: {
      get() {
        return this.options.series[0].barWidth || 6;
      },
      set(v) {
        this.options.series.forEach((item) => {
          item.barWidth = v
          item.barMaxWidth = v
        });
      },
    },
    chartType: {
      get() {
        return this.options.series[0].type || "bar";
      },
      set(v) {
        this.options.series.forEach((item) => {
          item.type = v;
        });
      },
    },
    count() {
      return this.selectedIndex.length;
    },
    selectedIndex: {
      get() {
        return this.selectedItems.map((item) => item.index);
      },
      set(v) {
        this.clickTag = null;
        this.clickTagIndex = null;
        this.selectedItems = v.map((item, index) => {
          return {
            index: item,
            area: this.selectedItems[index]?.area || undefined,
          };
        });
      },
    },
    selectedVar: {
      get() {
        if (this.clickTag && this.selectedItems[this.clickTagIndex].area) {
          return this.selectedItems[this.clickTagIndex].area;
        } else {
          return "";
        }
      },
      set(v) {
        this.selectedItems[this.clickTagIndex].area = v;
        this.$nextTick(()=>{
          this.options.series.forEach(item=>{
            item.name = null
          })
        })
      },
    },
    comboTime() {
      return this.timeValue + this.unit;
    },
  },
  created() {
    this.timeValue = parseInt(this.index.xaxisIndex);
    this.unit = this.index.xaxisIndex.split(this.timeValue)[1];
  },
  methods: {
    optionClose(){
      this.clickTag = null
      this.$refs['index-inputer'].selectedIndex = null
    },
    handleChange(v){
      this.clickTag.formula = v
    },
    yRangeChange(type, v) {
      if (v == "" || v == null) {
        this.options.yAxis[type] = null;
      } else {
        this.options.yAxis[type] = v;
      }
    },
    groupEdit() {
      this.$emit("groupEdit");
    },
    handleTagClick(tag, index, type) {
      if (type === "index") {
        this.clickTagIndex = index;
        this.clickTag = tag;
      } else {
        this.clickTagIndex = index;
        this.clickTag = tag;
      }
    },
    //TODO重写初始化逻辑
    seriesInit() {
      let series = [];
      this.selectedItems.forEach((item, index) => {
        if (this.options.series[index]) {
          series.push(this.options.series[index]);
        } else {
          series.push({
            type: "bar", //图表名称
            name:null,
            barWidth: 6, //柱宽度
            stack: "total",
          });
        }
      });
      this.options.series = series;
    },
  },
};
</script>

<style lang='scss' scoped>
.time-selector {
  display: flex;
  & > div {
    margin-left: 8px;
  }
}
</style>
