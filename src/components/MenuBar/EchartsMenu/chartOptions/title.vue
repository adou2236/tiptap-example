<template>
  <el-collapse-item title="标题配置" name="s-1">
    <el-form-item label="标题">
      <el-input v-model="title.text"></el-input>
    </el-form-item>
    <el-form-item label="文本颜色">
      <el-color-picker v-model="title.textStyle.color"></el-color-picker>
    </el-form-item>
    <el-form-item label="字体大小">
      <el-input-number v-model="title.textStyle.fontSize" :min="1" :max="60"></el-input-number>
    </el-form-item>
    <el-form-item label="字体样式">
      <el-select v-model="title.textStyle.fontStyle">
        <el-option label="normal" value="normal"></el-option>
        <el-option label="italic" value="italic"></el-option>
        <el-option label="oblique" value="oblique"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="字体粗细">
      <el-select v-model="title.textStyle.fontWeight">
        <el-option label="normal" value="normal"></el-option>
        <el-option label="bold" value="bold"></el-option>
        <el-option label="bolder" value="bolder"></el-option>
        <el-option label="lighter" value="lighter"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="top">
      <el-radio-group v-model="topType">
        <el-radio-button label="1" value="1">绝对值</el-radio-button>
        <el-radio-button label="2" value="2">百分比</el-radio-button>
      </el-radio-group>
      <el-slider v-if="topType == 2" v-model="title.top" @change="handleChangePosition(title.top, 'top')"></el-slider>
      <el-input-number v-model="title.top" controls-position="right" @change="handleChangePosition(title.top, 'top')" :min="0" :max="topType == 1 ? 1000 : 100"></el-input-number>
    </el-form-item>
    <el-form-item label="right">
      <el-radio-group v-model="rightType">
        <el-radio-button label="1" value="1">绝对值</el-radio-button>
        <el-radio-button label="2" value="2">百分比</el-radio-button>
      </el-radio-group>
      <el-slider v-if="rightType == 2" v-model="title.right" @change="handleChangePosition(title.right, 'right')"></el-slider>
      <el-input-number v-model="title.right" controls-position="right" @change="handleChangePosition(title.right, 'right')" :min="0" :max="rightType == 1 ? 1000 : 100"></el-input-number>
    </el-form-item>
    <el-form-item label="bottom">
      <el-radio-group v-model="bottomType">
        <el-radio-button label="1" value="1">绝对值</el-radio-button>
        <el-radio-button label="2" value="2">百分比</el-radio-button>
      </el-radio-group>
      <el-slider v-if="bottomType == 2" v-model="title.bottom" @change="handleChangePosition(title.bottom, 'bottom')"></el-slider>
      <el-input-number v-model="title.bottom" controls-position="right" @change="handleChangePosition(title.bottom, 'bottom')" :min="0" :max="bottomType == 1 ? 1000 : 100"></el-input-number>
    </el-form-item>
    <el-form-item label="left">
      <el-radio-group v-model="leftType">
        <el-radio-button label="1" value="1">绝对值</el-radio-button>
        <el-radio-button label="2" value="2">百分比</el-radio-button>
      </el-radio-group>
      <el-slider v-if="leftType == 2" v-model="title.left" @change="handleChangePosition(title.left, 'left')"></el-slider>
      <el-input-number v-model="title.left" controls-position="right" @change="handleChangePosition(title.left, 'left')" :min="0" :max="leftType == 1 ? 1000 : 100"></el-input-number>
    </el-form-item>
  </el-collapse-item>
</template>
<script>
export default {
  name: "titleOption",
  props:{
    title:{
      type:Object
    }
  },
  data() {
    return {
      topType: '1',
      leftType: '1',
      rightType: '1',
      bottomType: '1',
    };
  },
  watch: {
    title: {
      handler(to) {
        this.$emit("change", to);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleChangePosition(data, type) {
      let key = `${type}Type`
      this.title[type] = this[key] == 1 ? data : data + '%'
    }
  }
};
</script>
