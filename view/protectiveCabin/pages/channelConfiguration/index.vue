<template>
  <component :is="currentComponent" :showVideo="showVideo" :selectedData="selectedData" :orgId="orgId" :configType="configType" @changeSelect="changeSelect" @changeOrgId="changeOrgId" @changeComponent="changeComponent"></component>
</template>

<script>
import List from './ChannelList'
import SearchChannel from './SearchChannel'

export default {
  name: 'CameraRelate',
  components: {
    List,
    SearchChannel
  },
  props: {
    childrenComponent: {
      type: String,
      default: 'List'
    }
  },
  computed: {
    currentComponent: {
      get() {
        return this.childrenComponent
      },
      set(val) {}
    }
  },
  data() {
    return {
      showVideo: false,
      orgId: '',
      configType: '防护舱通道关联配置',
      selectedData: []
    }
  },
  methods: {
    changeComponent(value) {
      this.currentComponent = value
      this.$parent.childrenComponent = value
    },
    changeOrgId(id) {
      this.orgId = id
    },
    changeSelect(data) {
      this.selectedData = data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
