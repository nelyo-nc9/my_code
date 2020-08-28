<!-- 网关配置 -->
<template>
  <component :is="childrenComponent" :deviceModel="deviceModel" :optType="optType" @modelChange="modelChange"></component>
</template>
<script>
import OwnresManage from './ownresManage'
import MiderTire from './miderTire'
import ParentManage from './parentManage'
import SubateManage from './subateManage'
export default {
  name: '',
  components: {
    OwnresManage,
    MiderTire,
    ParentManage,
    SubateManage,
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
        default: 'OwnresManage'
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