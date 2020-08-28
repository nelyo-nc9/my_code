<template>
  <div id="changeTab">
    <el-transfer
      filterable
      :filter-method="fn"
      filter-placeholder="请输入城市拼音"
      v-model="value"
      :data="tabData"
      :titles="['源','目标']"
    ></el-transfer>
    <!-- <div class="btns" style="margin:10px auto;width:130px">
      <el-button size="mini" @click="back">保存</el-button>
      <el-button size="mini" @click="back">取消</el-button>
    </div>-->
  </div>
  
</template>

<script type="text/ecmascript-6">
export default {
  props: ['tabData', 'value', 'fn'],
  data() {
    return {}
  },
  methods: {
    back() {
      this.$emit('modelChange', {
        ListStatus: false,
        menu: this.ParList,
        parent: true
      })
    }
  }
}
</script>

<style lang="less" scoped>
#changeTab {
  width: 100%;
}
/deep/ .el-transfer-panel__list.is-filterable {
  height: 500px !important;
}
/deep/ .el-transfer-panel__body {
  height: 500px !important;
}
/deep/ .el-transfer-panel {
  margin-left: 10px !important;
}
/deep/ .el-transfer__buttons {
  padding: 0 20px !important;
}
</style>
