<!--
 * @Author: your name
 * @Date: 2020-06-09 14:38:18
 * @LastEditTime: 2020-06-09 14:46:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\parkingManage\parkingConfig\pages\carConfig\index.vue
--> 

<template>
  <component :is="childrenComponent"></component>
</template>

<script>
import control from './control'
import blacklist from './blacklist'
import emphasis from './emphasis'

export default {
  name: 'carConfig',
  components: {
    control,
    blacklist,
    emphasis
  },
  props: {
    childrenComponent: {
      type: String,
      default: 'emphasis'
    }
  }
}
</script>

<style lang="less" scoped>

</style>