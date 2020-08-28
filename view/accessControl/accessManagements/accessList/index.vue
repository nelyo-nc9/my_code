<template>
  <div>
    <component :is="child" :deviceModel="deviceModel" :optType="optType" @modelChange="modelChange"></component>
  </div>
</template>

<script type="text/ecmascript-6">
import List from './List'
import Create from './create'
import Import from './Import'
export default {
  components: {
    // List : () => import('./listButtons')
    List,
    Create,
    Import
  },
  props: {
    child: {
      type: String
    }
  },
  data() {
    return {
      deviceModel: {},
      optType: '' // 区分新建和删除
    }
  },
  methods: {
    modelChange(obj, type) {
      this.deviceModel = obj
      this.optType = type
    }
  },
  watch: {
    childrenComponent(val) {
      console.log('///////////////', val)
    }
  }
}
</script>

<style lang="less" scope>
</style>
