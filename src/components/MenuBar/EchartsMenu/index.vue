<template>
  <el-form size="mini" label-width="100px">
    <el-form-item label="背景色">
      <el-color-picker v-model="options.backgroundColor"></el-color-picker>
      <br/>
    </el-form-item>
    <el-collapse v-model="activeNames" accordion>
      <title-option v-show="title" :title="options.title" ></title-option>

      <legend-option v-show="legend" :legend="options.legend"></legend-option>

      <grid-option v-if="chartType === 'lab'" :grid="options.grid"></grid-option>

      <pie-size v-if="chartType === 'pie'" :radius="options.series[0].radius" :center="options.series[0].center"></pie-size>

      <tooltip-option v-show="tooltip" :tooltip="options.tooltip"></tooltip-option>

      <x-axis-option v-if="chartType !== 'pie'" :xAxis="options.xAxis" @change="changeXAxisOption"></x-axis-option>

      <y-axis-option v-if="chartType !== 'pie'" :yAxis="options.yAxis" @change="changeYAxisOption"></y-axis-option>

      <series-bar-line v-if="chartType === 'lab'" :series="options.series"></series-bar-line>

      <series-pie v-if="chartType === 'pie'" :series="options.series"></series-pie>

      <series-scatter v-if="chartType === 'scatter'" :series="options.series" :additions="options.additions"></series-scatter>

      <graphic-option :graphic="options.graphic"
                      @addGraphic="addGraphic"
                      @deleteGraphic="deleteGraphic"></graphic-option>

    </el-collapse>
  </el-form>
</template>
<script>
import index from "./index.js";
export default index;
</script>
