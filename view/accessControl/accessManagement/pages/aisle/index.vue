
<template>
  <div id="box">
    <component
      :tabHeight="460"
      :is="currentComponent"
      :configType="configType"
      @changeComponent="changeComponent"
    ></component>
  </div>
</template>

<script>
export default {
  name: 'VideoHostRelate',
  components: {
    Search: () => import('./Search'),
    List: () => import('./List')
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
      // currentComponent: this.childrenComponent,
      configType: '视频主机关联配置'
    }
  },
  methods: {
    changeComponent(value) {
      this.currentComponent = value
      this.$parent.childrenComponent = value
    }
  }
}
</script>

<style lang="less" scoped>
#box {
  width: 100%;
}
</style>
