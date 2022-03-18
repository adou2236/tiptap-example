import axios from './Axios'
import store from '../store'
import { getQueryString } from '../utils/util'
const head = '/doc'


const getDoc = (id) => axios({
    url: `${head}/doc/template/${id}`,
    method: 'get'
})

const getFunctions = () => axios({
    url: `${head}/func/function/list`,
    method: 'get'
})

const getVarsById = (id) => {
    let { vars } = store.state.templateStore
        //先访问缓存是否有这个变量组
    if (vars[id]) {
        return {
            data: {
                data: {
                    data: vars[id]
                }
            }
        }
    } else {
        //缓存没有则走接口
        return axios({
            url: `${head}/doc/variable/getBySegment`,
            method: 'get',
            params: {
                segments: id
            }
        }).then(res => {
            store.commit({
                type: 'setGlobalVars',
                segmentId: id,
                data: res.data.data.data
            });
            return res
        })
    }
}

const varsSave = (data) => axios({
    url: `${head}/doc/variable/batchSave`,
    method: 'post',
    data: data
}).then(res => {
    store.commit({
        type: 'setGlobalVars',
        segmentId: data.segmentId,
        data: res.data.data.data
    });
    return res
})

const getTempList = (data) => axios({
    url: `${head}/doc/template/list`,
    method: 'post',
    data: data

})

const getIndexList = (data) => axios({
    url: `${head}/data/indicator/list`,
    method: 'post',
    data: data
})

const getGeoTree = () => axios({
    url: `${head}/data/geo/tree`,
    method: 'get',
})
const getChartSeries = (data) => {
    let date = getQueryString('date')
    let area = getQueryString('area')
    let quarter = getQueryString('quarter')
    let updatefreq = getQueryString('updatefreq')
    let targetAreas = getQueryString('targetAreas')
    let customVars=[
        {
            varKey:"报告年份",
            varValue:date
        },
        {
            varKey:"报告范围",
            varValue:area
        },
        {
            varKey:"季度",
            varValue:quarter
        },
        {
            varKey:"更新频率",
            varValue:updatefreq
        },
        {
            varKey:"对标城市",
            varValue:targetAreas
        },
    ]
    return axios({
        url: `${head}/doc/template/series`,
        method: 'post',
        data: {
            ...data,
            customVars,
        },
    })
}

//部分检查
const partCheck = (data) => axios({
    url: `${head}/doc/template/parse`,
    method: 'post',
    data: data,
})

const templateSave = (data) => axios({
    url: `${head}/doc/template/save`,
    method: 'post',
    data: data
})

const templateClone = (data) => axios({
    url: `${head}/doc/template/clone`,
    method: 'post',
    data: data
})

const templateApply = (data) => axios({
    url: `${head}/doc/template/use`,
    method: 'post',
    data: data
})

const imgSave = (data) => axios({
    url: `${head}/storage/file/uploadBase64`,
    method: 'post',
    data: data
})

const getImage = (key) => {
    return `${head}/storage/file/key/${key}`
}

//图像地域分组保存
const chartGroupSave = (data) => axios({
    url: `${head}/doc/chart-group/groups`,
    method: 'post',
    data: data
})

//获取图像地域分组
const getChartGroup = (id) => axios({
    url: `${head}/doc/chart-group/groups`,
    method: 'get',
})

const getDocHsitory = (data) => axios({
    url: `${head}/doc/template/history`,
    method: 'post',
    data: data,
})

const docDownload = (data) => {
    return axios({
        url:`${head}/doc/template/word`,
        method: 'post',
        data: data,
    })
}

//获取模板列表
const getDocTemplateList = (data) => axios({
    url:`${head}/doc/segment-template/list`,
    method: 'post',
    data: data
})

//获取模板详情
const getDocTemplateDetail = (params) => axios({
    url: `${head}/doc/segment-template/detail`,
    method: 'get',
    params: params
})

//模板保存
const docTemplateSave = (data) => axios({
    url: `${head}/doc/segment-template/save`,
    method: 'post',
    data
})


//获取指标目录树
const getIndexTree = (data) => axios({
    url:`${head}/data/database-catalog/tree`,
    method: 'get',
    data: data,
})

//定制化图
const specialChart = ({templateId,customType}) => {
    let date = getQueryString('date')
    let area = getQueryString('area')
    let quarter = getQueryString('quarter')
    let updatefreq = getQueryString('updatefreq')
    let targetAreas = getQueryString('targetAreas')
    let customVars = [
        {
            varKey:"报告年份",
            varValue:date
        },
        {
            varKey:"报告范围",
            varValue:area
        },
        {
            varKey:"季度",
            varValue:quarter
        },
        {
            varKey:"更新频率",
            varValue:updatefreq
        },
        {
            varKey:"对标城市",
            varValue:targetAreas
        },
    ]
    return axios({
        url:`${head}/doc/template/customizedSeries`,
        method: 'post',
        data:{
            templateId,
            customType:`specialReport-${customType}`,
            customVars,
        }
    })
}

//获取统计数据
const getStatisticsData = () => axios({
    url:`${head}/doc/template/statistics`,
    method: 'post',
})


export {
    getDoc,
    getFunctions,
    getVarsById,
    varsSave,
    getTempList,
    getIndexList,
    getGeoTree,
    getChartSeries,
    partCheck,
    templateSave,
    templateClone,
    templateApply,
    imgSave,
    getImage,
    chartGroupSave,
    getChartGroup,
    getDocHsitory,
    docDownload,
    getDocTemplateList,
    getDocTemplateDetail,
    docTemplateSave,
    getIndexTree,
    specialChart,
    getStatisticsData
}
