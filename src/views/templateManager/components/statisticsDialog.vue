<template>
  <el-dialog :visible="dialogVisible" width="50%"
  title="模板内容统计" custom-class="static-dialog"
  :close-on-click-modal="false"
  @close="handleClose" >
    <el-table :data="data" border>
      <el-table-column label="模板内容统计" prop="name"></el-table-column>
      <el-table-column label="图" prop="chartCount"></el-table-column>
      <el-table-column label="表" prop="tableCount"></el-table-column>
      <el-table-column
        label="文字（段落数）"
        prop="paragraphCount"
      ></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  model: {
    prop: "dialogVisible",
    event: "change",
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleClose() {
      this.$emit("change", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.static-dialog{
    padding: 10px 50px;
}
/deep/.el-form-item__label{
  font-size: 16px;
}
/deep/.el-dialog__header{
  border-bottom: 1px solid #E4E4E4;
}
/deep/ .el-table th,
.el-table tr {
  background: rgb(215, 237, 255);
  color: rgb(51, 51, 51);
  text-align: center;
}
/deep/ .el-table td,
.el-table th {
  height: 60px;
  text-align: center;
}
/deep/ .el-table td,
.el-table th.is-leaf {
  border-color: rgb(223, 223, 223);
}
</style>
