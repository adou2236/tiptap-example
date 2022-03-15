<template>
  <el-dialog
    :visible="visible"
    :before-close="dialogHide"
    @opened="handleOpen"
    width="1400px"
    :close-on-click-modal="false"
  >
    <div class="dialog-title" slot="title">图表查看</div>
    <div class="dialog-content">
      <!-- 图库left -->
      <div class="left">
        <h3>
          图表名称:
          <p>{{ data.title }}</p>
        </h3>
        <h3>
          相关指标:
          <div class="tag-area">
            <span class="tag" v-for="(item, index) in data.origin" :key="index">
              {{ item }}
            </span>
          </div>
        </h3>
        <h3>
          图表来源:
          <p>CEIC、中经网</p>
        </h3>
      </div>
      <div class="right">
        <slot></slot>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  model:{
    prop:'visible',
    event:'change'
  },
  props: {
    data: {
      type: Object,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {

    };
  },
  methods: {
    handleOpen(){
      this.$emit('reRender')
    },
    dialogHide(){
      this.$emit('change',false)
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__header {
  border-bottom: 1px solid #e4e4e4;
  padding: 25px 20px 20px !important;
}
/deep/ .el-dialog__body {
  padding: 0 40px;
}
.dialog-title {
  padding-left: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #333333;
}
.dialog-content {
  min-height: 650px;
  width: 100%;
  display: flex;
  flex-direction: row;
  .left {
    width: 28%;
    padding: 40px 20px 40px 0;
    // padding: 40px 20px 0px 0;
    border-right: 1px solid #e4e4e4;
    h3 {
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      p {
        color: #979696;
        font-size: 14px;
        // padding: 0 14px;
        margin: 24px 0;
      }
      .tag-area {
        display: flex;
        flex-direction: column;
        max-height: 300px;
        padding: 0 14px;
        overflow-y: auto;
        .tag {
          color: #12417f;
          font-size: 14px;
          margin-bottom: 24px;
          &:first-child {
            margin-top: 24px;
          }
        }
      }
    }
    .indeexOut {
      max-height: 245px;
      overflow-y: auto;
      margin-top: 5px;
      // lex-direction: column;
    }
  }
  .right {
    box-sizing: content-box;
    padding: 45px 0 40px 40px;
    width: 740px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
}
</style>
