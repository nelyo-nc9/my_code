<!--
 * @Author: xutianyun
 * @Date: 2020-08-01 10:32:02
 * @LastEditTime: 2020-08-01 10:21:02
 * @LastEditors: Please set LastEditors
 * @Description: 电视墙漫游组件
 * @FilePath: \CCB\client\src\view\tvWall\components\wanderTvModal.vue
-->

<template>
  <div class="preview-container"></div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: '',
  components: {},
  props: {
    showPreviewVideo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  created() { },
  computed: {},
  mounted() { },
  methods: {
    /**
     * @description: 通知父组件关闭查看回放对话框
     * @param {type} 无
     * @return: 无
     */
  }
}
</script>

<style lang="less" scoped>
.preview-container {
}
</style>
