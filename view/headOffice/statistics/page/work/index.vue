<!-- 网关配置 -->
<template>
  <component :is="childrenComponent" :deviceModel="deviceModel" :optType="optType" @modelChange="modelChange"></component>
</template>
<script>
import Category from './category'
import Orgation from './orgation'
export default {
  name: '',
  components: {
    Category,
    Orgation
  }, 
  data() {
    return {
      deviceModel: {},
      optType: '' // 区分新建和删除
    }
  },
  props:{
       childrenComponent: {
        type: String,   
        default: 'Category'
    }
  },
  methods: {
     modelChange(obj, type) {
      this.deviceModel = obj
      this.optType = type
    }
  },
  created() {
    
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style lang="less" scoped>
  
</style>