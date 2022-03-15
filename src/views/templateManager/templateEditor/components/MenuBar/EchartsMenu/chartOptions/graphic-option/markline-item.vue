<template>
  <div class="markline-item">
    <el-form label-position="left" size="mini">
      <el-form-item label="名称：" >
        <span>
          <el-button size="mini" type="text" @click="tagInsert('variety')">变量</el-button>
          <el-button size="mini" type="text" @click="tagInsert('function')">表达式</el-button>
          <el-button size="mini" type="text" @click="tagInsert('formula')">公式</el-button>
        </span>
        <inline-editor
          :ref="`inline-editor-name-${index}`"
          class="inline-ipt"
          :key="index"
          :value="row.name"
          :range-id="rootId"
          @update="(json) => handleUpdate('name', json)"
          @focus="valueIptFocus('name', index)"
          :varsList="varsList"
          :functionsList="functionsList"
        >
        </inline-editor>
      </el-form-item>
      <el-form-item label-width="70px" label="类型：">
        <el-select size="mini" v-model="row.axis">
          <el-option value="xAxis" label="横坐标">横坐标</el-option>
          <el-option value="yAxis" label="纵坐标">纵坐标</el-option>
          <el-option v-if="chartType === 'scatter'" value="coord" label="斜线">斜线</el-option>
          <el-option value="xAverage" label="横坐标平均值">横坐标平均值</el-option>
          <el-option value="yAverage" label="纵坐标平均值">纵坐标平均值</el-option>
          <el-option
            v-if="chartType === 'scatter'"
            value="coordAverage"
            label="平均值斜线">平均值斜线</el-option>
          <el-option
            v-if="chartType === 'scatter'"
            value="xPoint"
            label="参考点横坐标">参考点横坐标</el-option>
          <el-option
            v-if="chartType === 'scatter'"
            value="yPoint"
            label="参考点纵坐标">参考点纵坐标</el-option>
          <el-option
            v-if="chartType === 'scatter'"
            value="standPoint"
            label="参考点">参考点斜线</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数值：">
        <span>
          <el-button size="mini" type="text" @click="tagInsert('variety')">变量</el-button>
          <el-button size="mini" type="text" @click="tagInsert('function')">表达式</el-button>
          <el-button size="mini" type="text" @click="tagInsert('formula')">公式</el-button>
        </span>
        <inline-editor
          :ref="`inline-editor-value-${index}`"
          class="inline-ipt"
          :key="index"
          :value="row.value"
          :range-id="rootId"
          @update="(json) => handleUpdate('value', json)"
          @focus="valueIptFocus('value', index)"
          :varsList="varsList"
          :functionsList="functionsList"
        >
        </inline-editor>
      </el-form-item>
      <el-form-item label-width="90px" label="线条类型：">
        <el-select v-model="row.style" size="mini">
          <el-option value="dashed" label="虚线">虚线</el-option>
          <el-option value="solid" label="实线">实线</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="60px" label="颜色：">
        <div class="color-setting">
          <color-picker v-model="row.color"></color-picker>
        </div>
      </el-form-item>
    </el-form>
    <i class="el-icon-circle-close close" @click="handleRemove"></i>
  </div>
</template>

<script>
import ColorPicker from "../../../../color-picker.vue";
import InlineEditor from "../../../../inlineEditor.vue";

export default {
  components: { ColorPicker, InlineEditor },
  props: {
    index: {
      type: Number,
    },
    row: {
      type: Object,
    },
    varsList: {
      type: Array,
      default: () => [],
    },
    functionsList: {
      type: Array,
      default: () => [],
    },
    rootId: {
      type: String,
    },
    chartType: {
      type: String,
    },
  },
  data() {
    return {
      focusIndex: "",
      foucsType: "",
    };
  },
  methods: {
    handleUpdate(param,json){
      this.row[param] = json
    },
    //TODO行内富文本输入框聚焦逻辑待优化，聚焦复制逻辑放入组件内部
    valueIptFocus(type, v) {
      this.foucsType = type;
      this.focusIndex = v;
    },
    //智能文本插入
    tagInsert(type) {
      this.$refs[`inline-editor-${this.foucsType}-${this.focusIndex}`].tagType =
        type;
    },
    handleRemove() {
      this.$emit("remove", this.index);
    },
  },
};
</script>

<style lang="scss" scoped>
.markline-item {
  background: #f1f1f1;
  padding: 10px;
  margin-bottom: 20px;
  position: relative;
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 20px;
    &:hover{
      cursor: pointer;
      color: #f19d5f;
    }
  }
}
.inline-ipt{
  min-height:28px;
  border-radius: 4px;
  display: inline-block;
  width: 100%;
  &.focus{
    border:1px solid #1890ff
  }

}
.color-setting{
  height: 28px;
  display: flex;
  align-items: center;
  &>span{
    margin-right: 10px;
  }
}
</style>
