<template>
    <el-input
        :placeholder="placeholder"
        :size="size"
        :value="value"
        :prefix-icon="prefixIcon"
        :suffix-icon="suffixIcon"
        @input="handleInput"
        @change="$emit('change')"/>
</template>

<script>
export default {
    model:{
        prop:'value',
        event:'valueChange'
    },
    props:{
        value:{
            type:[String,Number],
            default:''
        },
        placeholder:{
            type:String,
            default:''
        },
        numberOnly:{
            type:Boolean,
            default:false
        },
        size:{
            type:String,
            default:"medium"
        },
        maxLength:{
            type:Number,
            default: 50
        },
        prefixIcon:{
            type:String,
        },
        suffixIcon:{
            type:String,
        }

    },
    methods:{
        handleInput(e){
            if(e.length>this.maxLength){
                return
            }
            if(this.numberOnly){
                e = e.replace(/^\.+|[^\d.]/g,'')
            }
            e = e.replace(/[`~!?@#$%^&*【】{}（）\[\]<>《》？！，。/；“”‘’,.;"'+-]/g,'')
            this.$emit('valueChange',e)
            this.$emit('input',e)
        }
    }

}
</script>

<style lang="scss" scoped>
/deep/input{
    padding-right: 30px;
}
</style>
