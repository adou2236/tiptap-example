<template>
  <div>
    <el-collapse class="collapse" v-model="defaultOpen">

      <series-scatter v-if="chartType === 'scatter'"
                      :index="chartIndex"
                      :options="chartOptions"
                      @groupEdit="showGroupDialog">
      </series-scatter>

      <series-combo v-if="chartType === 'combo'"
                    :index="chartIndex"
                    :options="chartOptions"
                    @groupEdit="showGroupDialog">
      </series-combo>

      <series-combo-time v-if="chartType === 'comboTime'"
                    :index="chartIndex"
                    :options="chartOptions"
                    @groupEdit="showGroupDialog">
      </series-combo-time>

      <series-stack v-if="chartType === 'stack'"
                    :index="chartIndex"
                    :options="chartOptions"
                    @groupEdit="showGroupDialog"></series-stack>

      <series-stack-time v-if="chartType === 'stackTime'"
                    :index="chartIndex"
                    :options="chartOptions"
                    @groupEdit="showGroupDialog"></series-stack-time>

      <series-map v-if="chartType === 'map'"
                  :index="chartIndex"
                  :options="chartOptions"
                  @groupEdit="showGroupDialog">
      </series-map>

      <series-waterfall v-if="chartType === 'waterfall'"
                  :index="chartIndex"
                  :options="chartOptions"
                  @groupEdit="showGroupDialog">
      </series-waterfall>

      <series-double-axis v-if="chartType === 'doubleAxis'"
                  :index="chartIndex"
                  :options="chartOptions"
                  @groupEdit="showGroupDialog">
      </series-double-axis>

      <!-- <series-free v-if="chartType === 'free'"
                  :index="chartIndex"
                  :options="chartOptions"
                  @dataChange="handleChange">
      </series-free> -->
      <el-collapse-item  v-if="chartType !== 'pie' && chartType !== 'map' && chartType !== 'free'" title="坐标轴标题" name="axis">
        <x-axis-option
          :chartType="chartType"
          :options="chartOptions">
        </x-axis-option>
         <y-axis-option
          :chartType="chartType"
          :options="chartOptions">
        </y-axis-option>
      </el-collapse-item>


      <graphic-option :chartType="chartType" :options="chartOptions" :rootId="rootId"></graphic-option>

    </el-collapse>

    <group-editor-dialog v-model="groupDialogVisible"
                         :additions="chartOptions.additions"
                         :chartId="attrs.id">
    </group-editor-dialog>

    <el-button :loading="saveLoading" type="primary" @click="saveAsTemplate">保存至模板</el-button>

  </div>



</template>
<script>
import index from "./index.js";
export default index;
</script>

<style lang="scss" scoped>
.collapse{
  border:none;
  /deep/.el-collapse-item__header{
    border: none;
    font-size: 16px;
    flex-direction: row-reverse;
    justify-content: flex-end;
    i{
      margin: 0;
    }
    i::before{
      content: "\e791";
    }
  }
  /deep/.el-collapse-item__wrap{
    border: none;
    padding: 0 16px;
  }
  /deep/.el-collapse-item__content{
    padding-bottom: 0
  }
}
/deep/.inline-form{
  padding-left:20px;
  width:100%;
  display: flex;
  flex-direction: column;
}

</style>
