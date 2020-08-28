<!-- 网关配置 -->
<template>
  <component :is="childrenComponent" :deviceModel="deviceModel" :optType="optType" @modelChange="modelChange"></component>
</template>
<script>
import Grade from './grade'
import Synthesize from './synthesize'
export default {
  name: '',
  components: {
    Grade,
    Synthesize
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
        default: 'Grade'
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