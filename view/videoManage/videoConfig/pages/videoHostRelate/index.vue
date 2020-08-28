<template>
  <component :is="currentComponent" :orgId="orgId" :selectedData="selectedData" :configType="configType" @changeSelect="changeSelect" @changeComponent="changeComponent" @changeOrgId="changeOrgId"></component>
</template>

<script>
import List from './List.vue'
import Search from './Search.vue'
import RelevanceConf from '../../../components/RelevanceConf'
import viewLink from '../../../components/viewRelevance'

export default {
  name: 'VideoHostRelate',
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
      configType: '视频主机关联配置',
      orgId: '',
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
