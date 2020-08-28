
<template>
  <div id="Host">
    <!-- <div class="Left">
      <treeBox
        :lazyTreeApi="getTreeApi"
        searchType="filter"
        :treeType="treeType"
        @onceClick="onceClick"
        treeLazyToggle
        iconToggle
      ></treeBox>
    </div>-->
    <div class="right">
      <component
        id="cc"
        ref="hh"
        :tabHeight="460"
        :is="currentComponent"
        :configType="configType"
        @changeComponent="changeComponent"
        :createHost="createHost"
      ></component>
    </div>
  </div>
</template>

<script>
import { getTreeApi } from '@src/http/access/accessMan'

export default {
  components: {
    treeBox: () => import('@src/components/tree/treeBox'),
    Search: () => import('./Search'),
    List: () => import('./List'),
  },
  name: 'CameraRelate',
  props: {
    childrenComponent: {
      type: String,
      default: 'List',
    },
  },
  computed: {
    currentComponent: {
      get() {
        return this.childrenComponent
      },
      set(val) {},
    },
  },
  data() {
    return {
      createHost: {},
      treeType: 0,
      configType: '摄像机关联配置',
    }
  },
  methods: {
    // onceClick(val) {
    //   console.log('Log ???xxxxx', val)
    //   let { tierType } = val
    //   if (tierType == 'org') {
    //     //机构
    //     let { name, id } = val
    //     this.createHost.jigou = name
    //     this.createHost.jigouId = id
    //     this.$refs.hh.getList(id, ' ') // 如果是结构 部位id就不传
    //   } else if (tierType == 'loc') {
    //     // 重点部位
    //     let { name, id } = val
    //     this.createHost.buwei = name
    //     this.createHost.buweiId = id
    //     this.$refs.hh.getList(' ', id)
    //   }
    // },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    changeComponent(value) {
      console.log('Log list', value)
      this.currentComponent = value
      this.$parent.childrenComponent = value
    },
  },
}
</script>

<style lang="less" scoped>
#Host {
  width: 100%;
  // height: calc(~'100% - 40px');.
  .right {
    height: 100%;
    #cc {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
