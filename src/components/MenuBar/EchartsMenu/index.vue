<template>
  <div>
<!--    <el-form size="mini" label-width="50px">-->

<!--      <legend-option v-show="chartOptions.legend" :legend="chartOptions.legend" @change="(data)=>somethingChange('legend',data)"></legend-option>-->

<!--      <x-axis-option v-if="chartType !== 'pie'&& chartType !== 'map'" :xAxis="chartOptions.xAxis" @change="(data)=>somethingChange('xAxis',data)"></x-axis-option>-->

<!--      <y-axis-option v-if="chartType !== 'pie' && chartType !== 'map'" :yAxis="chartOptions.yAxis" @change="(data)=>somethingChange('yAxis',data)"></y-axis-option>-->


<!--      <pie-size v-if="chartType === 'pie'"-->
<!--                :additions="chartOptions.additions"-->
<!--                @additionChange="(data)=>somethingChange('additions',data)"></pie-size>-->

<!--      &lt;!&ndash;      <series-bar-line v-if="chartType === 'lab'" :index="index" :series="series"></series-bar-line>&ndash;&gt;-->

<!--      <series-pie v-if="chartType === 'pie'"-->
<!--                  :index="attrs.index"-->
<!--                  :series="chartOptions.series"-->
<!--                  @indexChange="indexChange"-->
<!--                  @seriesChange="(data)=>somethingChange('series',data)">-->
<!--      </series-pie>-->
<!--    </el-form>-->
    <series-scatter v-if="chartType === 'scatter'"
                    :index="attrs.index"
                    :series="attrs.options.series"
                    :additions="attrs.options.additions"
                    :xAxis="attrs.options.xAxis"
                    :yAxis="attrs.options.yAxis"
                    @indexChange="indexChange"
                    @xAxisChange="(data)=>somethingChange('xAxis',data)"
                    @yAxisChange="(data)=>somethingChange('yAxis',data)"
                    @additionChange="(data)=>somethingChange('additions',data)"
                    @seriesChange="(data)=>somethingChange('series',data)"
                    @groupEdit="showGroupDialog">
    </series-scatter>

    <series-combo v-if="chartType === 'combo'"
                  :index="attrs.index"
                  :series="chartOptions.series"
                  :additions="chartOptions.additions"
                  @indexChange="indexChange"
                  @additionChange="(data)=>somethingChange('additions',data)"
                  @seriesChange="(data)=>somethingChange('series',data)">
    </series-combo>


    <pie-size v-if="chartType === 'pie'"
              :additions="chartOptions.additions"
              @additionChange="(data)=>somethingChange('additions',data)">
    </pie-size>

    <series-pie v-if="chartType === 'pie'"
                :index="attrs.index"
                :series="chartOptions.series"
                @indexChange="indexChange"
                @seriesChange="(data)=>somethingChange('series',data)">
    </series-pie>

    <series-map v-if="chartType === 'map'"
                :index="attrs.index"
                :series="chartOptions.series"
                @indexChange="indexChange"
                @seriesChange="(data)=>somethingChange('series',data)">
    </series-map>

    <group-editor-dialog v-model="groupDialogVisible"
                         :additions="chartOptions.additions"
                         :chartId="attrs.id"
                         @additionChange="(data)=>somethingChange('additions',data)">
    </group-editor-dialog>
  </div>



</template>
<script>
import index from "./index.js";
export default index;
</script>
