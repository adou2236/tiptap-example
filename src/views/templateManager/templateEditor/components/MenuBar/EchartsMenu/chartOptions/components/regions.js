import store from '@/store'

const regions = () => {
    let { baseData } = store.state.templateStore
    console.log("报告类型",baseData.type)
    switch (baseData.type) {
        //研究手册
        case 6:
        case 7:
        case 9:
        case 10:
        case 11:
            return [
                { id: 'provinces', label: '31省' },
                { id: 'provincesAndCountry', label: '31省+全国' },
            ]
        //专题报告
        case 1:
            return [
                { id: 'provinces', label: '31省' },
                { id: 'provincesAndCountry', label: '31省+全国' },
                { id: 'childAreas', label: '报告区域下辖地区' },
                { id: 'regionAreas', label: '报告区域所属地区' },
                { id: 'provinceCoreCity', label: '当前省份核心城市' },
                { id: 'provinceAreasCoreCity', label: '所属地区核心城市' },
                { id: 'mainRegion', label: '全国主要城市' },
            ]
        //金融规划
        case 3:
            return [
                { id: 'targetAreas', label: "对标城市" }
            ]
        //季报
        case 5:
            return [
                { id: 'provinces', label: '31省' },
                { id: 'provincesAndCountry', label: '31省+全国' },
            ]
        default:
            return [
                { id: 'provinces', label: '31省' },
                { id: 'provincesAndCountry', label: '31省+全国' },
                { id: 'childAreas', label: '报告区域下辖地区' },
                { id: 'regionAreas', label: '报告区域所属地区' },
                { id: 'provinceCoreCity', label: '当前省份核心城市' },
                { id: 'provinceAreasCoreCity', label: '所属地区核心城市' },
                { id: 'mainRegion', label: '全国主要城市' },
                { id: 'targetAreas', label: "对标城市" }
            ]
    }


}

const defaultRegion = () => {
    let { baseData } = store.state.templateStore
    switch (baseData.type) {
        //研究手册
        case 6:
        case 7:
        case 9:
        case 10:
        case 11:
            return 'provinces'
        //专题报告
        case 1:
            return 'provinces'
        //金融规划
        case 3:
            return 'targetAreas'
        //季报
        case 5:
            return 'provinces'
        default:
            return 'provinces'
    }

}

export {regions,defaultRegion}
