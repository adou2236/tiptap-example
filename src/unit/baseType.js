
let TreeData = function(array){
  this.result = array.map((item,index)=>{
    return new LineType(index,item)
  })
  this.remove = function(itemId){
    console.log(itemId,this.result)
    // this.result =  this.result.filter(item=>item.id !== id)
  }
  this.add = function(type){
    if(type === 'single'){

    }else{

    }

    // this.result.push()
  }
}

let LineType = function(id,lineData){
  this.id = id
  this.lineData = lineData.map((item,index)=>{
    return new ItemType(id,index,item.data)
  })
}
let ItemType = function(lineId,index,data){
  this.id = `${lineId}_${index}`
  this.data = data
}
export {TreeData,LineType,ItemType}

