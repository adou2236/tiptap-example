<template>
  <el-form size="mini" label-width="50px">
<!--    <el-form-item label="背景色">-->
<!--      <el-color-picker :value="chartOptions.backgroundColor" @change="(data)=>somethingChange('backgroundColor',data)"></el-color-picker>-->
<!--    </el-form-item>-->
    <el-form-item label="标题">
      <el-input :value="attrs.title" @input="titleChange"/>
    </el-form-item>
    <el-form-item label="来源">
      <el-input :value="attrs.source" @input="sourceChange"/>
    </el-form-item>
    通用配置
    <el-collapse v-model="activeNames" accordion>
<!--      <title-option v-show="chartOptions.title" :title="chartOptions.title" @change="(data)=>somethingChange('title',data)"></title-option>-->
      <legend-option v-show="chartOptions.legend" :legend="chartOptions.legend" @change="(data)=>somethingChange('legend',data)"></legend-option>

      <grid-option v-if="chartType !== 'pie'" :grid="chartOptions.grid" @change="(data)=>somethingChange('grid',data)"></grid-option>

<!--      <tooltip-option v-show="chartOptions.tooltip" :tooltip="chartOptions.tooltip" @change="(data)=>somethingChange('tooltip',data)"></tooltip-option>-->

      <x-axis-option v-if="chartType !== 'pie'" :xAxis="chartOptions.xAxis" @change="(data)=>somethingChange('xAxis',data)"></x-axis-option>

      <y-axis-option v-if="chartType !== 'pie'" :yAxis="chartOptions.yAxis" @change="(data)=>somethingChange('yAxis',data)"></y-axis-option>

<!--      <graphic-option :graphic="chartOptions.graphic"-->
<!--                      @addGraphic="addGraphic"-->
<!--                      @deleteGraphic="deleteGraphic"></graphic-option>-->

    </el-collapse>
<!--    特殊配置-->
    <el-collapse v-model="activeNames2" accordion>

      <pie-size v-if="chartType === 'pie'"
                :additions="chartOptions.additions"
                @additionChange="(data)=>somethingChange('additions',data)"></pie-size>

<!--      <series-bar-line v-if="chartType === 'lab'" :index="index" :series="series"></series-bar-line>-->

      <series-pie v-if="chartType === 'pie'"
                  :index="attrs.index"
                  :series="chartOptions.series"
                  @indexChange="indexChange"
                  @seriesChange="(data)=>somethingChange('series',data)">
      </series-pie>

      <series-scatter v-if="chartType === 'scatter'"
                      :index="attrs.index"
                      :series="chartOptions.series"
                      :additions="chartOptions.additions"
                      @indexChange="indexChange"
                      @additionChange="(data)=>somethingChange('additions',data)"
                      @seriesChange="(data)=>somethingChange('series',data)">
      </series-scatter>

      <series-combo v-if="chartType === 'combo'"
                    :index="attrs.index"
                    :series="chartOptions.series"
                    :additions="chartOptions.additions"
                    @indexChange="indexChange"
                    @additionChange="(data)=>somethingChange('additions',data)"
                    @seriesChange="(data)=>somethingChange('series',data)">
      </series-combo>

      <series-map v-if="chartType === 'map'"
                  :index="attrs.index"
                  :series="chartOptions.series"
                  @indexChange="indexChange"
                  @seriesChange="(data)=>somethingChange('series',data)">
      </series-map>

    </el-collapse>


  </el-form>
</template>
<script>
import index from "./index.js";
export default index;
</script>
