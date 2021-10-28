import {arrayDiff, chartColor} from "../../unit/baseType";
import {getChartGroup, getChartSeries} from "../../request/api";

/**
 * 数据附加函数
 * @param options 图像配置
 * @param index 指标项
 * @param rootId 当前模板根Id
 * @param chartId 当前图像Id
 *
 */
const dataAttach = async function (options, index, rootId, chartId) {
    let type = index.type
    switch (type) {
        case 'pie':
            await pie(options, index, rootId,chartId)
            break;
        case 'scatter':
            await scatter(options, index, rootId,chartId)
            break;
        case 'combo':
            await combo(options, index, rootId,chartId)
            break;
        case 'map':
            await map(options, index, rootId,chartId)
            break;

    }
    return options
}



/**
 * 赋值逻辑，不同类型的图像逻辑不同
 */
//组合图
const combo = async function(options,index,rootId){
    //复杂组合图
    let data = await getChartData(index,rootId)
    options.xAxis.data = data.xaxisSeries || []
    //图像数据数量
    for(let i = 0;i<options.series.length;i++){
        options.series[i].data = data.yaxisSeries[i].value
        if(options.series[i].type==='stackBar'){
            options.series[i].stack='stackBar'
            options.series[i].type='bar'
        }
        if(options.series[i].type==='stackLine'){
            options.series[i].stack='stackLine'
            options.series[i].type='line'
        }
    }
}
//散点图
const scatter = async function(options,index,rootId,chartId){
    if(index.items.length>=2) {
        let groupData = options.additions.group
        let data = await getChartData(index,rootId)
        // await Promise.all([
        //     getChartData(index,rootId),
        //     groupInit(chartId)
        // ]).then(res=>{
        //     data = res[0]
        //     groupData = res[1]
        // })
        let {xaxisSeries, yaxisSeries} = data
        let series = []
        const pinArea = options.additions.locationPin
        const size = options.additions.symbolSize
        xaxisSeries.forEach((region,index)=>{
            let name = ''
            let color = ''
            let labelFormatter = '{b}'
            groupData.forEach((groupItem,groupIndex)=>{
                if(groupItem.areas.includes(region)) {
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
                    position: [0, 0],
                    formatter: labelFormatter
                },
                symbolSize: (value, params) => {
                    return pinArea && pinArea.includes(params.name) ? size + 10 : size
                },
                labelLine: {
                    show: false
                },
                itemStyle: {
                    color: color || chartColor[groupData.length]
                },
                data: [{
                    name: region,
                    value: [yaxisSeries[0]?.value[index], yaxisSeries[1]?.value[index]]
                }]
            })

        })
        // if(groupData.length>0){
        //     groupData.forEach((item, index) => {
        //         let arr = []
        //         const pinArea = options.additions.locationPin
        //         const size = options.additions.symbolSize
        //         for (let i = 0; i < item.areas.length; i++) {
        //             const num = xaxisSeries.indexOf(item.areas[i])
        //             //附加节点大小，突出部分地区
        //             arr.push({
        //                 name: item.areas[i],
        //                 value: [yaxisSeries[0]?.value[num], yaxisSeries[1]?.value[num]]
        //             })
        //         }
        //         series.push({
        //             type: 'scatter',
        //             name: item.groupName,
        //             label: {
        //                 show: options.additions.labShow,
        //                 position: [0, 0],
        //                 formatter: `{b}`
        //             },
        //             symbolSize: (value, params) => {
        //                 return pinArea && pinArea.includes(params.name) ? size + 10 : size
        //             },
        //             labelLine: {
        //                 show: false
        //             },
        //             itemStyle: {
        //                 color: options.additions.groupColor[index]
        //             },
        //             data: arr,
        //         })
        //     })
        // }
        // else{
        //     let arr = []
        //     const pinArea = options.additions.locationPin
        //     const size = options.additions.symbolSize
        //     for (let i = 0; i < xaxisSeries.length; i++) {
        //         arr.push({
        //             name: xaxisSeries[i],
        //             value: [yaxisSeries[0]?.value[i], yaxisSeries[1]?.value[i]]
        //         })
        //     }
        //     series.push({
        //         type: 'scatter',
        //         label: {
        //             show: options.additions.labShow,
        //             position: [0, 0],
        //             formatter: `{b}`
        //         },
        //         symbolSize: (value, params) => {
        //             return pinArea && pinArea.includes(params.name) ? size + 10 : size
        //         },
        //         labelLine: {
        //             show: false
        //         },
        //         itemStyle: {
        //             color: options.additions.groupColor[0]
        //         },
        //         data: arr,
        //     })
        //
        // }
        console.log(series)
        options.series = series
    }
}
//饼图
//饼图不分区
const pie = async function(options,index,id){
    if(index.items.length>0){
        let data = await getChartData(index,id)
        let {xaxisSeries,yaxisSeries} = data
        let result = []
        let dataList = yaxisSeries[0]?.value || []
        dataList.forEach((item,index)=>{
            if(item){
                result.push({
                    name:xaxisSeries[index],
                    value:item,

                })
            }
        })
        options.series = {
            data:result,
            type:'pie',
            radius:options.additions.radius,
            center:options.additions.center,
        }
    }

}
//热力图
const map = async function(options,index,rootId,chartId){
    let data,groupData = []
    await Promise.all([
        getChartData(index,rootId),
        groupInit(chartId)
    ]).then(res=>{
        data = res[0]
        groupData = res[1]
    })
    let {xaxisSeries,yaxisSeries} = data
    if(xaxisSeries&&yaxisSeries){
        let result = []
        let dataList = yaxisSeries[0]?.value || []
        dataList.forEach((item,index)=>{
            if(item){
                result.push({
                    name:xaxisSeries[index],
                    value:item
                })
            }
        })
        options.series[0].data = result
        //显示文字格式化
        options.geo.label = {
            show:true,
            formatter:(params) => {
                let value = ''
                value = result.find(item=>item.name === params.name)?.value || ''
                return `${params.name}\n${value}`

            }
        }
        //添加表格
        options.yAxis.data = xaxisSeries
        options.series[1].data = dataList
    }
    //分组颜色渲染
    let regions = []
    groupData.forEach((objs,index)=>{
        regions = regions.concat(objs.areas.map(province=>{
            return {
                name:province,
                itemStyle:{
                    areaColor:chartColor[index],
                    color:chartColor[index]
                }
            }
        }))
    })
    options.geo.regions = regions
}

/**
 * 获取数据
 */
const getChartData = async function(index,rootId){
    let result = {}
    if(index.items.length>0){
        let query = {
            "templateId": rootId,
            ...index
        }
        let {data} = await getChartSeries(query)
        result = data.content
    }
    return result
}
/**
 * 获取分组信息
 */
const groupInit = async function(id){
    let {data} = await getChartGroup(id)
    return data.content.content
}

const colorMatch = function(group,itemName,colors){
    group.forEach((item,index)=>{
        if(item.include(itemName)){
            return colors[index]
        }
    })
    return false
}

export {dataAttach}
