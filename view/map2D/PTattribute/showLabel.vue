<!--
 * @Description: 鼠标移入标签
-->
<template>
  <div id="labelName" class="labelBox">{{overFlowFeature.name}}</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'show-label',
  computed: {
    ...mapState('map2d/mapIndex', ['overFlowFeature'])
  },
  data() {
    return {
      name: ''
    }
  }
}
</script>
<style lang="less" scoped>
.labelBox {
  font-size: 12px;
  width: 150px;
  position: relative;
  text-align: center;
  color: #000;
}
</style>
