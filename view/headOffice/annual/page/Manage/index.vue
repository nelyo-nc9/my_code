<!-- 网关配置 -->
<template>
  <component
    :is="childrenComponent"
    :deviceModel="deviceModel"
    :optType="optType"
    @modelChange="modelChange"
  ></component>
</template>
<script>
import Check from './check'
import Self from './self'
import Matter from './matter'
import Security from './security'
import Schedule from './schedule'
export default {
  name: '',
  components: {
    Check,
    Self,
    Matter,
    Security,
    Schedule
  },
  data() {
    return {
      deviceModel: {},
      optType: '' // 区分新建和删除
    }
  },
  props: {
    childrenComponent: {
      type: String,
      default: 'Self'
    }
  },
  methods: {
    modelChange(obj, type, childrenComponent) {
      this.$emit('ChangeRoute', childrenComponent)
      this.deviceModel = obj
      this.optType = type
    }
  },
  created() {},
  computed: {},
  watch: {}
}
</script>
<style lang="less" scoped>
</style>