import axios from 'axios'
import store from '../store'
const head = '/api'


const getDoc = (id) => axios({
    url:`${head}/doc/template/${id}`,
    method:'get'
})

const getFunctions = () => axios({
    url:`${head}/func/function/list`,
    method:'get'
})

const getVarsById = (id) => {
    //先访问缓存是否有这个变量组
    if(store.state.vars[id]){
        return {
            data:{
                content:{
                    data:store.state.vars[id]
                }
            }
        }
    }else{
        //缓存没有则走接口
        return axios({
            url:`${head}/doc/variable/getBySegment`,
            method:'get',
            params:{
                segments:id
            }
        }).then(res=>{
            store.commit({
                type:'setGlobalVars',
                segmentId:id,
                data:res.data.content.data
            });
            return res
        })
    }
}

const varsSave = (data) => axios({
    url:`${head}/doc/variable/batchSave`,
    method:'post',
    data:data
}).then(res=>{
    store.commit({
        type:'setGlobalVars',
        segmentId:data.segmentId,
        data:res.data.content.data

    });
    return res
})

const getTempList = (data) => axios({
    url:`${head}/doc/template/list`,
    method:'post',
    data:data

})

const getIndexList = (data) => axios({
    url:`${head}/data/indicator/list`,
    method:'post',
    data:data
})

const getGeoTree = () => axios({
    url:`${head}/data/geo/tree`,
    method:'get',
})

const getChartSeries = (data) =>axios({
    url:`${head}/doc/template/series`,
    method:'post',
    data:data
})

//部分检查
const partCheck = (data) =>axios({
    url:`${head}/doc/template/parse`,
    method:'post',
    data:data
})

const templateSave = (data) =>axios({
    url:`${head}/doc/template/save`,
    method:'post',
    data:data
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
    templateSave
}
