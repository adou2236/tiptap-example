import { arrayDiff, chartColor, deepCopy } from "../../unit/baseType";
import { getChartGroup, getChartSeries } from "@/request/templateApi";
import ecStat, { regression } from 'echarts-stat'
import { partCheck, specialChart } from "@/request/templateApi";
import { getQueryString } from "../../../../../utils/util";


/**
 * 数据附加函数
 * @param options 图像配置
 * @param index 指标项
 * @param rootId 当前模板根Id
 * @param request 是否重新请求数据
 *
 */
const dataAttach = async function (originOption, index, rootId) {
    let options = deepCopy(originOption)
    options.animation = false
    let type = index.type
    let flag = false
    switch (type) {
        case 'pie':
            flag = await pie(options, index, rootId)
            break;
        case 'scatter':
            flag = await scatter(options, index, rootId)
            break;
        case 'combo':
            flag = await combo(options, index, rootId)
            break;
        case 'comboTime':
            flag = await comboTime(options, index, rootId)
            break;
        case 'stack':
            flag = await stack(options, index, rootId)
            break;
        case 'stackTime':
            flag = await stackTime(options, index, rootId)
            break;
        case 'map':
            flag = await map(options, index, rootId)
            break;
        case 'waterfall':
            flag = await waterfall(options, index, rootId)
            break;
        case 'doubleAxis':
            flag = await doubleAxis(options, index, rootId)
            break;
        case 'free':
            flag = await free(options, index, rootId)
            break;
    }
    if(flag&&type!=='free'){
        //坐标轴偏移
        let { xNameLeft, xNameTop, yNameLeft, yNameTop } = options.additions
        //如果坐标轴有多个则需要另外处理TODO
        if (xNameLeft || xNameTop) {
            options.xAxis.nameTextStyle = {
                verticalAlign: "bottom",
                align: 'left',
                padding: [xNameTop || 0, xNameLeft || 0]
            }
        }
        if(type !=='doubleAxis'){
            if (yNameLeft || yNameTop) {
                options.yAxis.nameTextStyle = {
                    verticalAlign: "top",
                    align: 'left',
                    padding: [yNameTop || 0, yNameLeft || 0]
                }
            }
        }else{
            if (yNameLeft || yNameTop) {
                options.yAxis[0].nameTextStyle = {
                    verticalAlign: "top",
                    align: 'left',
                    padding: [yNameTop[0] || 0, yNameLeft[0] || 0]
                }
                options.yAxis[1].nameTextStyle = {
                    verticalAlign: "top",
                    align: 'left',
                    padding: [yNameTop[1] || 0, yNameLeft[1] || 0]
                }
            }
        }
        //增加标线与图形
        let { markLine } = options.additions
        let { graphic } = options
        //参考线，通过解析接口获取具体数值
        if (markLine && markLine.length > 0) {
            let ml = { data: [] }
            await Promise.all(markLine.map(line=>{
                return markLineTransLate(line,rootId)
            })).then(res=>{
                markLine.forEach((item,index)=>{
                    let translateName = res[index].name.trim()
                    let translateValue = res[index].value.trim()
                    if(item.axis =='coord'){
                        //两点一线
                        ml.data.push([
                            {
                                name: translateName,
                                label: {
                                    formatter: '{b}',
                                    verticalAlign: 'bottom',
                                    align: 'right',
                                    padding: [20, 0, 0, -100]
                                },
                                lineStyle: {
                                    color: item.color||'#A1A1A1'
                                },
                                coord: [0,0],
                            },
                            {
                                coord: translateValue.split(',') || [0,0],
    
                            }
                        ])
                    }else if(type == 'scatter'&&(item.axis == 'xPoint'|| item.axis == 'yPoint')){
                        //指定点
                        let arr = options.series.map(obj=>obj.data[0])
                        let point = arr.find(obj=>obj.name == translateValue )
                        if(point){
                            ml.data.push({
                                name: translateName,
                                label: {
                                    formatter: '{b}',
                                    verticalAlign: 'bottom',
                                    align: 'right',
                                    padding: [20, 0, 0, -100]
                                },
                                lineStyle: {
                                    color: item.color||'#A1A1A1',
                                    type: item.style || 'dashed'
                                },
                                xAxis: item.axis === 'xPoint' ? point.value[0] : undefined,
                                yAxis: item.axis === 'yPoint' ? point.value[1] : undefined,
                            })
                        }
                    }else if(type == 'scatter'&&(item.axis == 'xAverage'||item.axis == 'yAverage')){
                        //散点平均值
                        let totalValue = 0
                        options.series.forEach(serie=>{
                            if(item.axis == 'xAverage'){
                                totalValue+=Number(serie?.data[0]?.value[0])
                            }else if(item.axis == 'yAverage'){
                                totalValue+=Number(serie?.data[0]?.value[1])
                            }
                        })
                        let averageValue = Number(totalValue/options.series.length).toFixed(2)
                        ml.data.push({
                            name: translateName,
                            label: {
                                formatter: '{b}',
                                verticalAlign: 'bottom',
                                align: 'right',
                                padding: [20, 0, 0, -100]
                            },
                            lineStyle: {
                                color: item.color||'#A1A1A1',
                                type: item.style || 'dashed'
                            },
                            type: 'average',
                            xAxis: item.axis === 'xAverage' ? averageValue : undefined,
                            yAxis: item.axis === 'yAverage' ? averageValue : undefined,
                        })
                        
                    }else if(type == 'scatter'&&item.axis == 'standPoint'){
                        //指定点斜线
                        let target = options.series.find(p=>{
                            return p.data[0].name == translateValue
                        })
                        if(target){
                            let point = target.data[0].value
                            let points = []
                            let event = []
                            let odd = []
                            for(let i = 0;i<100;i++){
                                let p = {
                                    lineStyle: {
                                        color: item.color||'#A1A1A1',
                                        type: item.style || 'dashed'
                                    },
                                    coord:point.map(v=>{
                                        return v*0.1*i
                                    })
                                }
                                odd.push(p)
                                if(i>=1){
                                    event.push(p)
                                }
                                if(i%2!=0){
                                    points.push(odd)
                                    odd = []
                                }else if(i>=2){
                                    points.push(event)
                                    event = []
                                }
                            }
                            ml.data = points
                        }
                    }else if(type == 'scatter'&&item.axis == 'coordAverage'){
                        //平均值这个点
                        let totalValueX = 0
                        let totalValueY = 0
                        options.series.forEach(serie=>{
                            if(serie.type === 'scatter'){
                                totalValueX+=Number(serie?.data[0]?.value[0])
                                totalValueY+=Number(serie?.data[0]?.value[1])
                            }
                        })
                        let averageValueX = Number(totalValueX/options.series.length).toFixed(2)
                        let averageValueY = Number(totalValueY/options.series.length).toFixed(2)
                        //做从原点到目标的的射线，可以多设置几个值，直到超出坐标系范围
                        let point = [averageValueX,averageValueY]
                        let points = []
                        let event = []
                        let odd = []
                        for(let i = 0;i<100;i++){
                            let p = {
                                lineStyle: {
                                    color: item.color||'#A1A1A1',
                                    type: item.style || 'dashed'
                                },
                                coord:point.map(v=>{
                                    return v*0.1*i
                                })
                            }
                            odd.push(p)
                            if(i>=1){
                                event.push(p)
                            }
                            if(i%2!=0){
                                points.push(odd)
                                odd = []
                            }else if(i>=2){
                                points.push(event)
                                event = []
                            }
                        }
                        ml.data = ml.data.concat(points)
                    }else{
                        //指定数值
                        ml.data.push({
                            name: translateName,
                            label: {
                                formatter: '{b}',
                                verticalAlign: 'bottom',
                                align: 'right',
                                padding: [20, 0, 0, -100]
                            },
                            lineStyle: {
                                color: item.color||'#A1A1A1',
                                type: item.style || 'dashed'
                            },
                            xAxis: item.axis === 'xAxis' ? translateValue : undefined,
                            yAxis: item.axis === 'yAxis' ? translateValue : undefined,
                            type: item.axis === 'xAverage'||item.axis === 'yAverage'? 'average' : undefined,
                            valueDim: item.axis === 'xAverage'?'x':item.axis === 'yAverage'?'y':undefined
                        })
                        
                    }
                })
            })
            options.series[0].markLine = {
                silent: 'true',
                symbol: 'none',
                animation: false,
                ...ml
            }
            
        }
        if (graphic && graphic.length > 0) {
            funcAttach(originOption, graphic)
        }
        //位置问题
        if(type!=='map'){
            options.grid={
                left:'center',
                bottom: '5%',
                top: '50',
                width:'90%',
                containLabel:true
            }
            //legend稍微搞一下
            let legendData = []
            //设置名称与形状
            //TODO设置形状遇到问题，不同形状的图例设置需要分组设置
            legendData = options.series.map((serie,index)=>{
                return{
                    name:hasHide(serie)? "":serie.name,
                }
            })
            //去重后再设置颜色
            legendData = arrSet(legendData,'name')
            legendData = legendData.map((item,index)=>{
                let color = ''
                if(type == 'scatter'){
                    color = options.additions.group[index]?.color || ''
                }else{
                    color = options.additions.colorMap[index]
                }
                return{
                    ...item,
                    itemStyle:{
                        color: color&&color == 'withRegion' ? chartColor[0] : color
                    }
                }
            })
            options.legend.data = legendData
            options.legend.top=20
            options.legend.width='80%'
        }
        //反转坐标系
        if(options.additions.reverse){
            let temp = deepCopy(options.xAxis)
            options.xAxis = options.yAxis
            options.yAxis = temp
        }
    }else if(!flag){
        options = null
    }
    return options
}

//函数附加(自定义图形移动函数)
const funcAttach = function (originOption, graphic) {
    if (graphic && graphic.length > 0) {
        graphic.forEach((item, index) => {
            item.ondragend = function () {
                let height = this.__zr.dom.offsetHeight
                let width = this.__zr.dom.offsetWidth
                onShapeDragging(item, item.id, [this.x, this.y]);
                originOption.graphic[index].left = ((this.x / width) * 100).toFixed(2) + '%'
                originOption.graphic[index].top = ((this.y / height) * 100).toFixed(2) + '%'
            }
        })
    }
}

const onShapeDragging = function (item, id, position) {
    let element = item
    element.left = position[0]
    element.top = position[1]
}



/**
 * 赋值逻辑，不同类型的图像逻辑不同
 */
//组合图
const combo = async function (options, index, rootId) {
    if(canRequire(index.items,1)){
        //复杂组合图
        let groupData = options.additions.group || []
        let data = await getChartData(index, rootId)
        let { xaxisSeries = [], yaxisSeries = [],entityIds = [] } = data
        options.entityIds = entityIds
        if(xaxisSeries.length<=0){
            return false
        }
        let { orderIndex = 0, orderType = 'desc', groupBy = false } = options.additions
        //排序，多系列序列化
        let valueArray = yaxisSeries.map(item => item.value)
        let orderArray = []
        for (let i = 0; i < xaxisSeries.length; i++) {
            let obj = {}
            valueArray.forEach((v, n) => {
                obj[n] = v[i]
            })
            orderArray.push({
                name: xaxisSeries[i],
                ...obj
            })
        }
        //如果勾选了百分比堆叠
        if(options.additions.stackType === 'percentage'){
            let sumArray = []
            for (let i = 0; i < yaxisSeries.length; i++) {
                let tempArray = orderArray.map(item => item[i])
                sumArray = arraySum(sumArray, tempArray)
            }
            for (let i = 0; i < orderArray.length; i++) {
                for(let j = 0;j < yaxisSeries.length;j++) {
                    orderArray[i][j] = (orderArray[i][j] / sumArray[i] * 100).toFixed(1)
                }
            }
        }
        orderArray = sortFunc(orderArray, orderIndex, orderType)
        //图像是否分组,分组影响横坐标分组
        if (groupBy) {
            let res = getGroup(orderArray, 'name', groupData)
            orderArray = res[0]
            let groupMark = res[1]
            let intervalData = [0]
            let intervalLabel = []
            groupMark.forEach((item,index)=>{
                for(let i = 0;i<item.length;i++){
                    if(i === parseInt(item.length/2)){
                        intervalLabel.push(item.name)
                    }else{
                        intervalLabel.push('')
                    }
                }
                intervalData.push(item.length+intervalData[index])
            })
            let xAxis = {
                ...options.xAxis,
                data: orderArray.map(item => item.name)
            }
            let markXaxis = {
                ...options.xAxis,
                offset:40,
                axisLine:{
                    show:false
                },
                position:'bottom',
                axisTick:{
                    length:40,
                    inside:true,
                    interval:(index,value)=>{
                        return intervalData.includes(index)
                    }
                },
                data:intervalLabel
            }
            options.xAxis = [xAxis,markXaxis]
        }else{
            options.xAxis.data = orderArray.map(item => item.name)
        }
        //图像数据数量
        for (let i = 0; i < options.series.length; i++) {
            if(hasHide(options.series[i])){
                break;
            }
            let color = options.additions.colorMap[i]
            let groupArrays = orderArray.map((v, index) => {
                let value = v[i]
                let innerColor = color
                if (color === 'withRegion' && groupData.length > 0) {
                    for (let groupIndex = 0; groupIndex < groupData.length; groupIndex++) {
                        let groupItem = groupData[groupIndex]
                        if (groupItem.areas.includes(v.name)) {
                            //当前区域在分组中
                            innerColor = groupItem.color
                        }
                    }
                }
                return {
                    value,
                    itemStyle: {
                        color: innerColor === 'withRegion'? '#000' : innerColor
                    }
                }
            })
            options.series[i] = {
                ...options.series[i],
                lineStyle:{
                    color:color
                },
                data:groupArrays,
                name:options.series[i]&&options.series[i]?.name!=null?options.series[i].name:data.yaxisSeries[i].name,
                label:{
                    show:true,
                    position:'top',
                    formatter:(params)=>{
                        if(showStateInArray(params,options.series[i].labelShowing,groupArrays)){
                            return params.value
                        }else{
                            return ''
                        }

                    }
                }
            }
            if (options.series[i].type === 'stackBar') {
                options.series[i].stack = 'stackBar'
                options.series[i].type = 'bar'
            }
            if (options.series[i].type === 'stackLine') {
                options.series[i].stack = 'stackLine'
                options.series[i].type = 'line'
            }
        }
        if (index.xaxisType === 'region'&&!options.additions.reverse) {
            if(options.xAxis[0]){
                options.xAxis[0].axisLabel = {
                    formatter: (params) => {
                        return params.split('').join('\n')
                    }
                }
            }else{
                options.xAxis.axisLabel = {
                    formatter: (params) => {
                        return params.split('').join('\n')
                    }
                }
            }
        }
        return options
    }else{
        return false
    }
}

/**
 * 赋值逻辑，不同类型的图像逻辑不同
 */
//组合图
const comboTime = async function (options, index, rootId) {
    if(canRequire(index.items,1)){
        //复杂组合图
        let groupData = options.additions.group || []
        let data = await getChartData(index, rootId)
        let { xaxisSeries = [], yaxisSeries = [],entityIds = [] } = data
        options.entityIds = entityIds
        if(xaxisSeries.length<=0){
            return false
        }
        let { orderIndex = 0, orderType = 'desc', groupBy = false } = options.additions
        //排序，多系列序列化
        let valueArray = yaxisSeries.map(item => item.value)
        let orderArray = []
        for (let i = 0; i < xaxisSeries.length; i++) {
            let obj = {}
            valueArray.forEach((v, n) => {
                obj[n] = v[i]
            })
            orderArray.push({
                name: xaxisSeries[i],
                ...obj
            })
        }
        //如果勾选了百分比堆叠
        if(options.additions.stackType === 'percentage'){
            let sumArray = []
            for (let i = 0; i < yaxisSeries.length; i++) {
                let tempArray = orderArray.map(item => item[i])
                sumArray = arraySum(sumArray, tempArray)
            }
            for (let i = 0; i < orderArray.length; i++) {
                for(let j = 0;j < yaxisSeries.length;j++) {
                    orderArray[i][j] = (orderArray[i][j] / sumArray[i] * 100).toFixed(1)
                }
            }
        }
        orderArray = sortFunc(orderArray, orderIndex, orderType)
        //图像是否分组,分组影响横坐标分组
        options.xAxis.data = orderArray.map(item => item.name)
        //图像数据数量
        for (let i = 0; i < yaxisSeries.length; i++) {
            let color = options.additions.colorMap[i]
            let groupArrays = orderArray.map((v, index) => {
                let value = v[i]
                let innerColor = color
                if (color === 'withRegion' && groupData.length > 0) {
                    for (let groupIndex = 0; groupIndex < groupData.length; groupIndex++) {
                        let groupItem = groupData[groupIndex]
                        if (groupItem.areas.includes(v.name)) {
                            //当前区域在分组中
                            innerColor = groupItem.color
                        }
                    }
                }
                return {
                    value,
                    itemStyle: {
                        color: innerColor === 'withRegion'? '#000' : innerColor
                    },
                    
                }
            })
            //多指标单地区
            let as = {}
            if(index.items.length>1){
                as = deepCopy(options.series[i])
            }else{
                as = deepCopy(options.series[0])
            }
            options.series[i] = {
                ...as,
                lineStyle:{
                    color:color
                },
                data:groupArrays,
                name:options.series[i]&&options.series[i]?.name!=null?options.series[i].name:data.yaxisSeries[i].name,
                label:{
                    show:true,
                    position:'top',
                    formatter:(params)=>{
                        if(showStateInArray(params,options.series[i].labelShowing,groupArrays)){
                            return params.value
                        }else{
                            return ''
                        }
                    }
                }
            }
            if (options.series[i].type === 'stackBar') {
                options.series[i].stack = 'stackBar'
                options.series[i].type = 'bar'
            }
            if (options.series[i].type === 'stackLine') {
                options.series[i].stack = 'stackLine'
                options.series[i].type = 'line'
            }
        }
        
        return options
    }else{
        return false
    }
}

/**
 * 赋值逻辑，不同类型的图像逻辑不同
 */
//堆叠柱状图-地域
const stack = async function (options, index, rootId) {
    let flag = await combo(options, index, rootId)
    if(flag && options.additions.showValue!=='none'){
        let total = []
        options.xAxis.data.forEach((item,index)=>{
            total[index] = sum(flag.series.map(as=>as.data[index].value))
        })
        flag.series.forEach((item,index)=>{
            item.label = {
                show:true,
                position:'inside',
                color:'#000',
                textBorderWidth:2,
                formatter:options.additions.showValue == 'number'?'{c}':(params)=>{
                    return ((params.value / total[params.dataIndex])*100).toFixed(1) + '%'
                }
            }
        })
    }
    return flag
}

//堆叠柱状图-时间
const stackTime = async function (options, index, rootId) {
    let flag = await comboTime(options, index, rootId)
    if(flag && options.additions.showValue!=='none'){
        let total = []
        options.xAxis.data.forEach((item,index)=>{
            total[index] = sum(flag.series.map(as=>as.data[index].value))
        })
        flag.series.forEach((item,index)=>{
            item.label = {
                show:true,
                position:'inside',
                color:'#000',
                textBorderWidth:2,
                formatter:options.additions.showValue == 'number'?'{c}':(params)=>{
                    return ((params.value / total[params.dataIndex])*100).toFixed(1) + '%'
                }
            }
        })
    }
    return flag
}

//散点图
const scatter = async function (options, index, rootId, chartId) {
    if (canRequire(index.items,2)) {
        let groupData = options.additions.group
        let data = await getChartData(index, rootId)
        let { xaxisSeries = [], yaxisSeries = [],entityIds = [] } = data
        options.entityIds = entityIds
        if(xaxisSeries.length<=0){
            return false
        }
        let series = []
        const pinArea = options.additions.locationPin
        const size = options.additions.symbolSize
        const xMin = Number(options.xAxis.min)
        const xMax = Number(options.xAxis.max)
        const yMin = Number(options.yAxis.min)
        const yMax = Number(options.yAxis.max)
        let inRange = []
        let outRange = []
        xaxisSeries.forEach((region, index) => {
            if((xMin&&xMin>yaxisSeries[0]?.value[index])
                ||(xMax&&xMax<yaxisSeries[0]?.value[index])
                ||(yMin&&yMin>yaxisSeries[1]?.value[index])
                ||(yMax&&yMax<yaxisSeries[1]?.value[index])){
                    outRange.push({
                        name:region,
                        value:[yaxisSeries[0]?.value[index], yaxisSeries[1]?.value[index]]
                    })
            }else{
                inRange.push({
                    name:region,
                    value:[yaxisSeries[0]?.value[index], yaxisSeries[1]?.value[index]]
                })
            }
        })
        inRange.forEach((item, index) => {
            let name = ''
            let color = ''
            let labelFormatter = '{b}'
            groupData.forEach((groupItem, groupIndex) => {
                if (groupItem.areas.includes(item.name)) {
                    //当前区域在分组中
                    name = groupItem.groupName
                    color = groupItem.color
                    labelFormatter = groupItem.labelFormatter
                }
            })
            series.push({
                type: 'scatter',
                name: name,
                label: {
                    show: options.additions.labShow,
                    position: [options.additions.labPosX, options.additions.labPosY],
                    formatter: labelFormatter,
                    color: color
                },
                symbolSize: (value, params) => {
                    return pinArea && pinArea.includes(params.name) ? size + 5 : size
                },
                labelLine: {
                    show: options.additions.labLine
                },
                itemStyle: {
                    color: color || chartColor[groupData.length]
                },
                tooltip:{
                    formatter: (params)=>{
                        return `${params.name}<br/>${params.value.join('<br/>')}`
                    },
                },
                data: [item]
            })

        })
        // outRange = outRange.sort(function(a,b){
        //     return a.value[0]-b.value[0]
        // }).sort(function(a,b){
        //     return a.value[1]-b.value[1]
        // })
        // console.log("排序过后",outRange)
        outRange = outRange.map((item,index)=>{
            let x = item.value[0]
            let y = item.value[1]
            let ofs = [0,0]
            if(xMax&&x>xMax){
                // x = xMax*(0.9+0.02*index)
                x = xMax
                ofs[0] = -1
            }else if(xMin&&x<xMin){
                x = xMin
                ofs[0] = 1
                // x = xMin+Math.abs(xMin*(0.05+0.05*index))
            }
            if(yMax&&y>yMax){
                // y = yMax*(0.9+0.02*index)
                y = yMax
                ofs[1] = 1
            }else if(yMin&&y<yMin){
                // y = yMin+Math.abs(yMin*(0.05+0.05*index))
                y = yMin
                ofs[1] = -1
            }
            return{
                name:item.name,
                value:[x,y],
                realValue:item.value,
                ofs,
            }
        })
        outRange.forEach((item, index) => {
            let name = ''
            let color = ''
            let labelFormatter = '{b}'
            groupData.forEach((groupItem, groupIndex) => {
                if (groupItem.areas.includes(item.name)) {
                    //当前区域在分组中
                    name = groupItem.groupName
                    color = groupItem.color
                    labelFormatter = groupItem.labelFormatter
                }
            })
            series.push({
                type: 'scatter',
                name: name,
                label: {
                    show: options.additions.labShow,
                    position: [options.additions.labPosX, options.additions.labPosY],
                    formatter: (params)=>{
                        return `${params.name}(${params.data.realValue})`
                    },
                    offset:[(item.ofs[0]-1)*(50),item.ofs[1]*(10)],
                    color: color
                },
                tooltip:{
                    formatter: (params)=>{
                        return `${params.name}<br/>${params.data.realValue.join('<br/>')}`
                    },
                },
                symbolSize: (value, params) => {
                    return pinArea && pinArea.includes(params.name) ? size + 5 : size
                },
                labelLine: {
                    show: options.additions.labLine
                },
                itemStyle: {
                    color: color || chartColor[groupData.length]
                },
                data: [item]
            })
        })

        //线性回归属性
        if(options.additions.regressArea){
            let points = series.map(item=>{
                return item.data[0].value.map(Number)
            })
            let myRegression = ecStat.regression('linear',points)
            series.push({
                name:'',
                type:'line',
                
                lineStyle:{
                    color:"#A1A1A1",
                    opacity:0.3,
                    width:120,
                    cap:'square'
                },
                data:myRegression.points
            })
        }
        options.series = series
        return options
    }else{
        return false
    }
}

//饼图
//饼图不分区
const pie = async function (options, index, id) {
    if (canRequire(index.items,1)) {
        let data = await getChartData(index, id)
        let { xaxisSeries = [], yaxisSeries = [], entityIds = [] } = data
        options.entityIds = entityIds
        if(xaxisSeries.length<=0){
            return false
        }
        let result = []
        let dataList = yaxisSeries[0]?.value || []
        dataList.forEach((item, index) => {
            if (item) {
                result.push({
                    name: xaxisSeries[index],
                    value: item,

                })
            }
        })
        options.series = {
            data: result,
            type: 'pie',
            radius: options.additions.radius,
            center: options.additions.center,
        }
        return options
    }else{
        return false
    }
}

//地图
const map = async function (options, index, rootId, chartId) {
    if (canRequire(index.items,1)) {
        let data, groupData = []
        data = await getChartData(index, rootId)
        let { xaxisSeries = [], yaxisSeries = [], entityIds = [] } = data
        options.entityIds = entityIds
        groupData = options.additions.group
        if(xaxisSeries.length<=0){
            return false
        }
        if (xaxisSeries && yaxisSeries) {
            let result = []
            let dataList = yaxisSeries[0]?.value || []
            let tableList = []
            if(yaxisSeries.length == 1){
                tableList = dataList
            }else if(yaxisSeries.length == 2){
                tableList = yaxisSeries[1]?.value || []
            }
            dataList.forEach((item, index) => {
                if (item) {
                    result.push({
                        name: xaxisSeries[index],
                        value: item
                    })
                }
            })
            //这是地图上的数值
            options.series[0].data = result
            options.geo.right = '20%'
            options.geo.top = '10%'
            options.geo.left = '10%'
            options.geo.bottom = '10%'
            options.geo.label = {
                show:true,
                fontSize:14,
                formatter:(params)=>{
                    let value = ''
                    value = result.find(item=>item.name === params.name)?.value || ''
                    return `${params.name}\n${value}`
                }
            }
            //添加表格并排序这是表格
            //百分比序列化
            let orderData = []
            let {dataType = 'number'} = options.additions
            //表格显示的是数值还是百分比
            orderData = xaxisSeries.map((item, index) => {
                return {
                    name: item,
                    value: tableList[index]
                }
            })
            options.yAxis.data = xaxisSeries
            options.series[1].data = sortFunc(orderData, 'value', options.additions?.orderType)
            options.series[1].label = {
                ...options.series[1].label,
                formatter: (params) => {
                    if (params.dataIndex % 2 > 0) {
                        return `{table|${params.name}}{table|${params.value}${dataType === 'percentage'?'%':''}}`
                    } else {
                        return `{tableOdd|${params.name}}{tableOdd|${params.value}${dataType === 'percentage'?'%':''}}`
                    }
                },
                rich: {
                    table: {
                        verticalAlign: 'middle',
                        width: 40,
                        align: 'center',
                        color: "#000",
                        fontSize:14,
                    },
                    tableOdd: {
                        backgroundColor: '#D8D8D8',
                        verticalAlign: 'middle',
                        width: 40,
                        align: 'center',
                        color: "#000",
                        fontSize:14,
                    }
                }
            }
            options.grid = {
                left: '80%',
                bottom:-10,
            }
        }
        //分组颜色渲染
        let regions = []
        groupData.forEach((objs, index) => {
            regions = regions.concat(objs.areas.map(province => {
                return {
                    name: province,
                    itemStyle: {
                        areaColor: objs.color,
                        color: objs.color
                    }
                }
            }))
        })
        options.geo.silent = false//TODO是否可以去掉
        options.geo.regions = regions
        return options
    }else{
        return false
    }
}

//瀑布柱状图，只是柱状图，同个项目的开始时间减去结束时间，series[1]透明不响应
//排序无效,单指标设置无效
const waterfall = async function (options, index, rootId) {
    if (canRequire(index.items,2)) {
        let groupData = options.additions.group || []
        let data = await getChartData(index, rootId)
        let { xaxisSeries = [], yaxisSeries = [], entityIds = [] } = data
        options.entityIds = entityIds
        if(xaxisSeries.length<=0){
            return false
        }
        let { orderIndex = 0, orderType = 'desc', groupBy = false } = options.additions
        //排序，多系列序列化
        let valueArray = yaxisSeries.map(item => item.value)
        let orderArray = []
        for (let i = 0; i < xaxisSeries.length; i++) {
            let obj = {}
            valueArray.forEach((v, n) => {
                obj[n] = v[i]
            })
            orderArray.push({
                name: xaxisSeries[i],
                ...obj
            })
        }
        //计算绝对值最大值最小值
        orderArray = orderArray.map((item,index)=>{
            return{
                ...item,
                ...getWaterfallData(item)
            }
        })
        //此处不排序
        // orderArray = sortFunc(orderArray, orderIndex, orderType)
        //图像是否分组
        if (groupBy) {
            let res = getGroup(orderArray, 'name', groupData)
            orderArray = res[0]
            let groupMark = res[1]
            let intervalData = [0]
            let intervalLabel = []
            groupMark.forEach((item,index)=>{
                for(let i = 0;i<item.length;i++){
                    if(i === parseInt(item.length/2)){
                        intervalLabel.push(item.name)
                    }else{
                        intervalLabel.push('')
                    }
                }
                intervalData.push(item.length+intervalData[index])
            })
            let xAxis = {
                ...options.xAxis,
                data: orderArray.map(item => item.name)
            }
            let markXaxis = {
                ...options.xAxis,
                offset:40,
                axisLine:{
                    show:false
                },
                position:'bottom',
                axisTick:{
                    length:40,
                    inside:true,
                    interval:(index,value)=>{
                        return intervalData.includes(index)
                    }
                },
                data:intervalLabel
            }
            options.xAxis = [xAxis,markXaxis]
        }else{
            options.xAxis.data = orderArray.map(item => item.name)
        }
        options.xAxis.data = orderArray.map(item => item.name)
        //图像数据数量
        for (let i = 0; i < options.series.length; i++) {
            options.series[i].data = orderArray.map(item=>{
                return{
                    value:i==0?item.min:item.absValue,
                    itemStyle:{
                        color:i==0?'transparent':item.symbol=='plus'?options.additions.colorMap[0]:options.additions.colorMap[1]
                    },
                }
                
            })
            options.series[i].name = data.yaxisSeries[i].name
            if (options.series[i].type === 'stackBar') {
                options.series[i].stack = 'stackBar'
                options.series[i].type = 'bar'
            }
            if (options.series[i].type === 'stackLine') {
                options.series[i].stack = 'stackLine'
                options.series[i].type = 'line'
            }

        }
        // options.tooltip = {
        //     formatter:(params)=>{
        //         console.log(params)
        //         return 'aa'
        //     }
        // }
        if (index.xaxisType === 'region') {
            if(options.xAxis[0]){
                options.xAxis[0].axisLabel = {
                    formatter: (params) => {
                        return params.split('').join('\n')
                    }
                }
            }else{
                options.xAxis.axisLabel = {
                    formatter: (params) => {
                        return params.split('').join('\n')
                    }
                }
            }
        }
        return options
    }else{
        return false
    }

}

//双轴组合图
const doubleAxis = async function (options, index, rootId){
    if(canRequire(index.items,1)){
        //复杂组合图
        let groupData = options.additions.group || []
        let data = await getChartData(index, rootId)
        let { xaxisSeries = [], yaxisSeries = [], entityIds = [] } = data
        options.entityIds = entityIds
        if(xaxisSeries.length<=0){
            return false
        }
        let { orderIndex = 0, orderType = 'desc', groupBy = false } = options.additions
        //排序，多系列序列化
        let valueArray = yaxisSeries.map(item => item.value)
        let orderArray = []
        for (let i = 0; i < xaxisSeries.length; i++) {
            let obj = {}
            valueArray.forEach((v, n) => {
                obj[n] = v[i]
            })
            orderArray.push({
                name: xaxisSeries[i],
                ...obj
            })
        }
        orderArray = sortFunc(orderArray, orderIndex, orderType)
        //图像是否分组,分组影响横坐标分组
        if (groupBy) {
            let res = getGroup(orderArray, 'name', groupData)
            orderArray = res[0]
            let groupMark = res[1]
            let intervalData = [0]
            let intervalLabel = []
            groupMark.forEach((item,index)=>{
                for(let i = 0;i<item.length;i++){
                    if(i === parseInt(item.length/2)){
                        intervalLabel.push(item.name)
                    }else{
                        intervalLabel.push('')
                    }
                }
                intervalData.push(item.length+intervalData[index])
            })
            let xAxis = {
                ...options.xAxis,
                data: orderArray.map(item => item.name)
            }
            let markXaxis = {
                ...options.xAxis,
                offset:40,
                axisLine:{
                    show:false
                },
                position:'bottom',
                axisTick:{
                    length:40,
                    inside:true,
                    interval:(index,value)=>{
                        return intervalData.includes(index)
                    }
                },
                data:intervalLabel
            }
            options.xAxis = [xAxis,markXaxis]
        }else{
            options.xAxis.data = orderArray.map(item => item.name)
        }
        //图像数据数量
        for (let i = 0; i < options.series.length; i++) {
            let color = options.additions.colorMap[i]
            let groupArrays = orderArray.map((v, index) => {
                let value = v[i]
                let innerColor = color
                if (color === 'withRegion' && groupData.length > 0) {
                    for (let groupIndex = 0; groupIndex < groupData.length; groupIndex++) {
                        let groupItem = groupData[groupIndex]
                        if (groupItem.areas.includes(v.name)) {
                            //当前区域在分组中
                            innerColor = groupItem.color
                        }
                    }
                }
                return {
                    value,
                    itemStyle: {
                        color: innerColor === 'withRegion'? '#000' : innerColor
                    },
                    label:{
                        show:true,
                        position:'top',
                        formatter:(params)=>{
                            if(showStateInArray(params,options.series[i].labelShowing,groupArrays)){
                                return params.value
                            }else{
                                return ''
                            }
                        }
                    }
                }
            })
            options.series[i] = {
                ...options.series[i],
                lineStyle:{
                    color:color
                },
                data:groupArrays,
                name:options.series[i].name==null?data.yaxisSeries[i].name:options.series[i].name,
            }
            if (options.series[i].type === 'stackBar') {
                options.series[i].stack = 'stackBar'
                options.series[i].type = 'bar'
            }
            if (options.series[i].type === 'stackLine') {
                options.series[i].stack = 'stackLine'
                options.series[i].type = 'line'
            }
        }
        //如果是百分比堆叠柱状图
        if (options.additions.stackType === 'percentage') {
            let sumArray = []
            let seriesCount = options.series.length
            for (let i = 0; i < seriesCount; i++) {
                let tempArray = orderArray.map(item => item[i])
                sumArray = arraySum(sumArray, tempArray)
            }
            for (let i = 0; i < seriesCount; i++) {
                options.series[i].data = options.series[i].data.map((v, vIndex) => {
                    return {
                        ...v,
                        value: (v.value / sumArray[vIndex] * 100).toFixed(1)
                    }
                })
            }
        }
        if (index.xaxisType === 'region') {
            if(options.xAxis[0]){
                options.xAxis[0].axisLabel = {
                    formatter: (params) => {
                        return params.split('').join('\n')
                    }
                }
            }else{
                options.xAxis.axisLabel = {
                    formatter: (params) => {
                        return params.split('').join('\n')
                    }
                }
            }
        }
        return options
    }else{
        return false
    }
}

//自由图
const free = async function (options, index, rootId){
    let data = await getSpecialChartData(index, rootId)
    let {xaxisSeries=[],yaxisSeries=[],dateSeries=[],entityIds = []} = data
    options.entityIds = entityIds
    if(xaxisSeries.length == 0){
        return false
    }
    let source = []
    let dimensions=yaxisSeries.map(item=>item.name)
    for (let i = 0; i < xaxisSeries.length; i++) {
        let obj = {}
        yaxisSeries.forEach((v, n) => {
            obj[v.name] = v.value[i]
        })
        source.push({
            name: xaxisSeries[i],
            ...obj
        })
    }
    options.dataset = {
        ...options?.dataset,
        source:source,
        dimensions:['name',...dimensions]
    }
    if(Array.isArray(options.xAxis)){
        //产业结构变化
        let unitYear = []
        for(let i = 0;i<xaxisSeries.length;i++){
            unitYear.push(dateSeries.join('\n'))
        }
        options.xAxis[1].data = unitYear
        options.xAxis[0].axisLabel = {
            formatter:(params)=>{
                let fullLength = params.length > 5 ? Math.ceil(params.length/5)*5 : params.length
                let array = params.split('')
                let result = []
                for(let i = 0;i<fullLength;i++){
                    if(result[i%5] == undefined){
                        result[i%5] = ''
                    }
                    if(array[i]!==undefined){
                        result[i%5] += array[i]
                    }else{
                        result[i%5] += '  '
                    }
                }
                return result.join('\n')
            },
            
        }
    }else{
        options.xAxis.axisLabel = {
            formatter:(params)=>{
                let fullLength = params.length > 8 ? Math.ceil(params.length/8)*8 : params.length
                let array = params.split('')
                let result = []
                for(let i = 0;i<fullLength;i++){
                    if(result[i%8] == undefined){
                        result[i%8] = ''
                    }
                    if(array[i]!==undefined){
                        result[i%8] += array[i]
                    }else{
                        result[i%8] += '  '
                    }
                }
                return result.join('\n')
            },
        }

    }
    return true

}

//获取瀑布图数据，最大值，最小值，绝对值
const getWaterfallData = function(obj){
    let min = Number(obj[0])
    let max = Number(obj[1])
    for(let key in obj){
        let num = Number(obj[key])
        if(num&&num<min){
            min = num
        }
        if(num&&num>max){
            max = num
        }
    }
    let absValue = (max-min).toFixed(3)
    return {
        max,
        min,
        absValue,
        symbol:Number(obj[0])>=Number(obj[1])?'plus':'minus'
    }

}

const getGroup = function (array, key, orderList) {
    let template = []
    let noGroup = []//无分组接在最后
    let groupMark = []//横坐标分组信息
    for (let i = 0; i < orderList.length; i++) {
        let flag = 0
        for (let j = 0; j < array.length; j++) {
            if (orderList[i].areas.includes(array[j][key])) {
                template.push(array[j])
                flag++
            }
        }
        groupMark.push({
            name:orderList[i].groupName,
            length:flag
        })
    }
    noGroup = arrayDiff(array,template)
    if(noGroup.length>0){
        groupMark.unshift({
            name:'',
            length:noGroup.length
        })
    }
    return [noGroup.concat(template),groupMark]
}

/**
 * 
 * @param {要排序的数组} array 
 * @param {排序字段} key 0-n系列排序 total堆叠柱状图排序
 * @param {排序方式，正序，倒序，无序} sortType 
 * @returns 
 */
const sortFunc = function (array, key, sortType = 'desc') {
    let sortArr = array
    if (key !=='' && key !== null && sortType !== 'none') {
        if(key === 'total'){
            sortArr = array.sort((a, b) => {
                let aTotal = 0
                let bTotal = 0
                for(key in a){
                    aTotal+=Number(a[key])||0
                    bTotal+=Number(b[key])||0
                }
                if (sortType === 'desc') {
                    return bTotal - aTotal
                } else {
                    return aTotal - bTotal
                }
            })
        }else{
            sortArr = array.sort((a, b) => {
                if (sortType === 'desc') {
                    return b[key] - a[key]
                } else {
                    return a[key] - b[key]
                }
            })
        }
    }
    return sortArr

}
//多个数组对应项相加
const arraySum = function (arr1, arr2) {
    if (arr2.length === 0) {
        return arr1
    } else {
        arr1.forEach((item, index) => {
            arr2[index] = (Number(arr2[index]) + Number(item)).toFixed(4)
        })
    }
    return arr2
}

//TODO精度丢失问题待优化
const sum = function (array) {
    let total = 0
    for (let i = 0; i < array.length; i++) {
        total += Number(array[i])
    }
    return total
}

/**
 * 是否满足条件开始请求数据
 * @param {指标数组} items 
 */

const canRequire = function(items,limit){
    let count = 0
    for(let i = 0;i<items.length;i++){
        if(!!items[i]?.index?.nodeId&&(!!items[i]?.var?.id||!!items[i]?.area)){
            count++
        }
    }
    if(count >= limit && count == items.length){
        return true
    }else{
        return false
    }

}

/**
 * 获取数据
 */
const getChartData = async function (index, rootId) {
    let result = {}
    if (index.items.length > 0) {
        let query = {
            "templateId": rootId,
            ...index
        }
        let { data } = await getChartSeries(query)
        //将空值剔除
        let yData = data.data.yaxisSeries.map(item=>item.value)
        let i = 0
        result = data.data
        while(i<result.xaxisSeries.length){
            let as = yData.map(x=>x[i])
            if(as.some(obj => obj == null)){
                result.xaxisSeries.splice(i,1)
                result.yaxisSeries.forEach(arr=>{
                    arr.value.splice(i,1)
                })
            }else{
                i++
            }
        }
    }
    return result
}
/**
 * 特殊图获取数据
 * @param {特殊图ID} id 
 * @returns 
 */
const getSpecialChartData = async function (index,rootId){
    let result = {}
    if (index.customType) {
        let query = {
            "templateId": rootId,
            ...index
        }
        let { data } = await specialChart(query)
        //将空值剔除
        let yData = data.data.yaxisSeries.map(item=>item.value)
        let i = 0
        result = data.data
        while(i<result.xaxisSeries.length){
            let as = yData.map(x=>x[i])
            if(as.some(obj => obj == null)){
                result.xaxisSeries.splice(i,1)
                result.yaxisSeries.forEach(arr=>{
                    arr.value.splice(i,1)
                })
            }else{
                i++
            }
        }
    }
    return result
}
/**
 * 获取分组信息
 */
const groupInit = async function (id) {
    let { data } = await getChartGroup(id)
    return data.data.content
}

/**
 * 对象数据组去重
 * @param {对象数组} array 
 * @param {去重依据字段} array 
 * @returns 
 */
const arrSet = function(array,key){
    let obj = {}
    const arrays = array.reduce((setArr,item)=>{
        obj[item[key]] ? '' : obj[item[key]] = true && setArr.push(item);
        return setArr
    },[])
    return arrays

}

const colorMatch = function (group, itemName, colors) {
    group.forEach((item, index) => {
        if (item.include(itemName)) {
            return colors[index]
        }
    })
    return false
}

/**
 * 获取当前对象在数组中的状态
 */
const showStateInArray = function(obj,state,array){
    if(state){
        if(state.includes('all')){
            return true
        }
        if(state.includes('sne')&&(obj.dataIndex == 0||obj.dataIndex == array.length-1)){
            return true
        }
        let valueArray = array.map(item=>item.value)
        if(state.includes('max')&&Math.max.apply(Math,valueArray) == obj.value){
            return true
        }
        if(state.includes('min')&&Math.min.apply(Math,valueArray) == obj.value){
            return true
        }
    }
    return false
}

const hasHide = function(item){
    let reportType = getQueryString('reportType')
    let quarter = getQueryString('quarter')
    let { hideInQ1 = false } = item
    return reportType == 5&&quarter == 1&&hideInQ1
}

const markLineTransLate = async function(line,rootId){
    let name = await richTranslate(line.name,rootId)
    let value = await richTranslate(line.value,rootId)
    return {
        name:name+'',
        value:value+''
    }
}

const richTranslate = async function(obj,rootId){
    let content = []
    let result = ''
    if(Array.isArray(obj)){
        content = obj
    }else{
        return obj
    }
    
    let data = {
        id:rootId,
        doc:{
            type:'paragraph',
            content:content
        },
        customVars: [
            {
              varKey: "报告年份",
              varValue: getQueryString('date'),
            },
            {
              varKey: "报告范围",
              varValue: getQueryString('area'),
            },
            {
              varKey: "季度",
              varValue: getQueryString('quarter'),
            },
            {
              varKey: "更新频率",
              varValue: getQueryString('updatefreq'),
            },
            {
              varKey: "对标城市",
              varValue: getQueryString('targetAreas')
            },
        ],
    }
    let res = await partCheck(data)
    result = res?.data?.data?.doc?.text
    return result
}

export { dataAttach }
