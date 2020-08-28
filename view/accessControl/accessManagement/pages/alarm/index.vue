<template>
  <div id="box">
    <component
      :is="currentComponent"
      :configType="configType"
      @changeComponent="changeComponent"
    ></component>
  </div>
</template>

<script>
export default {
  name: 'Host',
  
  components: {
    List: () => import('./List'),
    Search: () => import('./Search')
  },

  //子组件
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
      configType: '门禁主机关联配置'
    }
  },
  methods: {
    changeComponent(value) {
      console.log(value)
      this.currentComponent = value
      this.$parent.childrenComponent = value
    }
  }
}
</script>

<style lang="less" scoped>
#box{
  width: 100%;
  height: 100%;
}
</style>
