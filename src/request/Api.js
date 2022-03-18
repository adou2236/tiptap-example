import axios from './Axios'
import store from '../store'
const head = '/api'

const getTableData = (params) => axios({
    url: `${head}/common-data/data-mining`,
    method: 'get',
    params: params,
})

const getRegionTree = (params) => axios({
    url: `${head}/data/data-regions`,
    method: 'get',
    params: params,
})

const excelExport = (data) => axios({
    url: `${head}/common-data/downloadExcel`,
    method: 'post',
    data: data,
})
const getMap = (params) => axios({
    url: `${head}/label/getGeo`,
    method: 'post',
    params: params,
})

export {
    getTableData,
    getRegionTree,
    excelExport,
    getMap,

}
