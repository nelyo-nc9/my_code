<template>
  <component :is="currentComponent"
             :showVideo="showVideo"
             :selectedData="selectedData"
             :orgId="orgId"
             :configType="configType"
             @changeSelect="changeSelect"
             @changeOrgId="changeOrgId"
             @changeComponent="changeComponent"></component>
</template>

<script>
import List from './InputList'
import SearchInput from './SearchInput'

export default {
  name: 'CameraRelate',
  components: {
    List,
    SearchInput
  },
  props: {
    childrenComponent: {
      type: String,
      default: 'List'
    }
  },
  computed: {
    currentComponent: {
      get () {
        return this.childrenComponent
      },
      set (val) { }
    }
  },
  data () {
    return {
      showVideo: false,
      orgId: '',
      configType: '报警输入关联配置',
      selectedData: []
    }
  },
  methods: {
    changeComponent (value) {
      this.currentComponent = value
      this.$parent.childrenComponent = value
    },
    changeOrgId (id) {
      this.orgId = id
    },
    changeSelect (data) {
      this.selectedData = data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
