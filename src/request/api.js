import axios from 'axios'
const head = '/api'

const getDoc = () => axios({
    url:`${head}/doc/template/3`,
    methods:'get'
})

const getFunctions = () => axios({
    url:`${head}/func/function/list`,
    methods:'get'
})

export {
    getDoc,
    getFunctions
}
