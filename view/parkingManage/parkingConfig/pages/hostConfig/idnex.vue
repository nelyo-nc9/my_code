<!--
 * @Author: your name
 * @Date: 2020-06-08 17:53:16
 * @LastEditTime: 2020-06-08 17:56:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\parkingManage\parkingConfig\pages\hostConfig\idnex.vue
-->
<template>
  <component :is="childrenComponent"></component>
</template>

<script>
import List from './List.vue'
import Query from './Query.vue'

export default {
  name: 'hostConfig',
  components: {
    List,
    Query
  },
  props: {
    childrenComponent: {
      type: String,
      default: 'List'
    }
  }
}
</script>

<style lang="less" scoped>

</style>
