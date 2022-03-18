import FakeData from "../assets/fakeData";


let axios = function(config){

    let {url} = config
    console.log(url)
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve({data:FakeData[url]})
        },500)
    })
}


export default axios
