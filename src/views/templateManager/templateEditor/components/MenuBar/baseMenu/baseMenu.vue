<template>
  <el-form @submit.native.prevent size="mini" label-position="left">
    <el-form-item label="模板名称：">
      <el-input v-model="baseData.name" />
    </el-form-item>
    <el-form-item label="报告级别：" label-width="90px">
      {{ baseData.type == "1" ? "省" : baseData.type == "3" ? "市" : "全国" }}
    </el-form-item>
    <el-form-item label="更新频率：" label-width="90px">
      {{ baseData.type == "5" ? "季" : "年" }}
    </el-form-item>
    <el-form-item v-if="baseData.type == '5'">
      <el-form-item label="一季度报：" label-width="90px">
        <el-date-picker
          style="width:auto"
          popper-class="update-time"
          type="date"
          value-format="MM-dd"
          format="MM-dd"
          v-model="reportUpdateTime[0]"
          @change="(e) => timeChange(0, e)"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="半年报：" label-width="90px">
        <el-date-picker
          style="width:auto"
          popper-class="update-time"
          type="date"
          value-format="MM-dd"
          format="MM-dd"
          v-model="reportUpdateTime[1]"
          @change="(e) => timeChange(1, e)"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="三季度报：" label-width="90px">
        <el-date-picker
          style="width:auto"
          popper-class="update-time"
          type="date"
          value-format="MM-dd"
          format="MM-dd"
          v-model="reportUpdateTime[2]"
          @change="(e) => timeChange(2, e)"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="年报：" label-width="90px">
        <el-date-picker
          style="width:auto"
          popper-class="update-time"
          type="date"
          value-format="MM-dd"
          format="MM-dd"
          v-model="reportUpdateTime[3]"
          @change="(e) => timeChange(3, e)"
        ></el-date-picker>
      </el-form-item>
    </el-form-item>
    <el-form-item v-else label="更新时间：" label-width="85px">
      <el-date-picker
        style="width:auto"
        popper-class="update-time"
        type="date"
        value-format="MM-dd"
        format="MM-dd"
        v-model="reportUpdateTime[0]"
        @change="(e) => timeChange(0, e)"
      ></el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    baseData: {
      type: Object,
      default: () => {
        return {
          name: "",
          type: "1",
          reportUpdateTime: [],
        };
      },
    },
  },
  data() {
    return {
      reportUpdateTime: new Array(4),
    };
  },
  created() {
    for (let i = 0; i < 4; i++) {
      if (this.baseData.reportUpdateTime[i] !== undefined) {
        this.reportUpdateTime[i] = this.baseData.reportUpdateTime[i];
      } else {
        this.reportUpdateTime[i] = "";
      }
    }
  },
  watch: {
    baseData: {
      handler(v) {
        this.$emit("change", v);
      },
      deep: true,
    },
  },
  methods: {
    timeChange(num, value) {
      this.baseData.reportUpdateTime.splice(num, 1, value);
    },
  },
};
</script>

<style lang="scss" >
.el-date-picker.update-time{
  .el-icon-d-arrow-left{
    display: none;
  }
  .el-icon-d-arrow-right{
    display: none;
  }
  .el-date-picker__header-label:first-of-type{
    display: none;
  }


}


</style>
