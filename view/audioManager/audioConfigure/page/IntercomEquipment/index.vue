<!-- 对讲设备配置 -->
<template>
  <component :is="childrenComponent" :deviceModel="deviceModel" :optType="optType" @modelChange="modelChange"></component>
</template>
<script>
import Search from './Search'
import List from './List'
export default {
  name: '',
  components: {
    Search,
    List,
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
        default: 'List'
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