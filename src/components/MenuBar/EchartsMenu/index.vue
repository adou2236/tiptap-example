<template>
  <el-form size="mini" label-width="100px">
    <el-form-item label="背景色">
      <el-color-picker v-model="options.backgroundColor"></el-color-picker>
      <br/>
    </el-form-item>
    通用配置
    <el-collapse v-model="activeNames" accordion>
      <title-option v-show="title" :title="options.title" ></title-option>

      <legend-option v-show="legend" :legend="options.legend"></legend-option>

      <grid-option v-if="chartType !== 'pie'" :grid="options.grid"></grid-option>

      <tooltip-option v-show="tooltip" :tooltip="options.tooltip"></tooltip-option>

      <x-axis-option v-if="chartType !== 'pie'" :xAxis="options.xAxis" @change="changeXAxisOption"></x-axis-option>

      <y-axis-option v-if="chartType !== 'pie'" :yAxis="options.yAxis" @change="changeYAxisOption"></y-axis-option>

      <graphic-option :graphic="options.graphic"
                      @addGraphic="addGraphic"
                      @deleteGraphic="deleteGraphic"></graphic-option>

    </el-collapse>
    特殊配置
    <el-collapse v-model="activeNames2" accordion>

      <pie-size v-if="chartType === 'pie'" :radius="options.series[0].radius" :center="options.series[0].center"></pie-size>

      <series-bar-line v-if="chartType === 'lab'" :index="index" :series="options.series"></series-bar-line>

      <series-pie v-if="chartType === 'pie'" :index="index" :series="options.series"></series-pie>

      <series-scatter v-if="chartType === 'scatter'"
                      :index="index"
                      :series="options.series"
                      :additions="options.additions">
      </series-scatter>

      <series-combo v-if="chartType === 'combo'"
                    :index="index"
                    :series="options.series"
                    :additions="options.additions">
      </series-combo>

    </el-collapse>


  </el-form>
</template>
<script>
import index from "./index.js";
import SeriesCombo from "./chartOptions/series-combo/series-combo";
export default index;
</script>
