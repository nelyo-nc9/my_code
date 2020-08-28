<!--
 * @Author: your name
 * @Date: 2020-06-08 10:13:14
 * @LastEditTime: 2020-07-11 22:07:15
 * @LastEditors: dfk
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\parkingManage\parkingConfig\pages\platformConfig\index.vue
-->
<template>
  <component :is="childrenComponent"></component>
</template>

<script>
import List from './list.vue'
import Query from './query.vue'
import Create from './Create.vue'

export default {
  name: 'platformConfig',
  components: {
    List,
    Query,
    Create
  },
  props: {
    childrenComponent: {
      type: String,
      default: 'List'
    }
  },

  methods: {}
}
</script>

<style lang="less" scoped>
</style>
