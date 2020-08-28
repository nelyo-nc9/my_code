<template>
  <div class="drop-result">
    <div class="drop-box" @click="changeDrop()">
      <div class="drop-query">{{label}}</div>
      <div class="drop-icon">
        <i :class=" show ? 'el-icon-arrow-up' :'el-icon-arrow-down'"></i>
      </div>
      <el-divider class="drop-divider"></el-divider>
    </div>
    <slot v-if="show"></slot>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
    // 标识区分查询条件，查询结果
    _key: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: '标题'
    }
  },
  methods: {
    changeDrop() {
      this.$emit('changeDrop', { _key: this._key, isShow: !this.show })
    }
  }
}
</script>
<style lang="less" scoped>
.drop-result {
  width: 100%;
}
.drop-box {
  width: 100%;
  display: flex;
  margin: 20px 0 0 10px;
  align-items: center;
  > *:not(:last-child) {
    margin-right: 8px;
  }
  > :nth-child(1) {
    width: 5em;
  }
  /deep/ .el-divider {
    margin: 0px;
  }
}
</style>