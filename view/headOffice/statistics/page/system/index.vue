<!-- 网关配置 -->
<template>
  <component :is="childrenComponent" :deviceModel="deviceModel" :optType="optType" @modelChange="modelChange"></component>
</template>
<script>
import Overall from './overall'
import General from './general'
export default {
  name: '',
  components: {
    Overall,
    General
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
        default: 'Overall'
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