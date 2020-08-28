<template>
  <component :is="currentComponent" :showVideo="showVideo" :selectedData="selectedData" :orgId="orgId" :configType="configType" @changeSelect="changeSelect" @changeOrgId="changeOrgId" @changeComponent="changeComponent"></component>
</template>

<script>
import List from './List.vue'
import Search from './Search.vue'
import RelevanceConf from '../../../components/RelevanceConf'
import viewLink from '../../../components/viewRelevance'

export default {
  name: 'CameraRelate',
  components: {
    List,
    Search,
    RelevanceConf,
    viewLink
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
      configType: '摄像机关联配置',
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
