<template>
  <component
    :is="childrenComponent"
    :deviceModel="deviceModel"
    :optType="optType"
    @modelChange="modelChange"
  ></component>
</template>
<script>
import sumList from './sumList'
export default {
  name: '',
  components: {
    sumList
   
  },
  data() {
    return {
      deviceModel: {},
      optType: '' // 区分新建和删除
    }
  },
  props: {
    childrenComponent: {
      type: String,
      default: 'sumList'
    }
  },
  methods: {
    modelChange(obj, type) {
      this.deviceModel = obj
      this.optType = type
    }
  },
  created() {},
  computed: {},
  watch: {}
}
</script>
<style lang="less" scoped>
</style>