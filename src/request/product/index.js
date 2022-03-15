import axios from 'axios'
const head = '/api'

//获取区域评级列表
const getRegionLevel = (data) => axios({
    url: `${head}/label/getAreaRating`,
    method: 'get',
    data: data
})

//获取区域评级列表(表格)
const getAllRegionLevel = (data) => axios({
    url: `${head}/label/allAreaRating`,
    method: 'get',
    data: data
})
export {
    getRegionLevel,
    getAllRegionLevel
}
