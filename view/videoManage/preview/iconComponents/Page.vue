<template>
  <div class="page-box" v-if="totalPage > 1">
    <el-pagination
      small
      layout="prev, slot, next"
      @current-change="pageChange"
      :page-size="checkedWmode"
      :current-page="curPage"
      :total="videoPageData.length">
      <div class="first-pager">{{curPage}}</div>
    </el-pagination>
    <div class="total-page">
      <span>共{{totalPage}}页</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page',
  inheritAttrs: false,
  data() {
    return {
    }
  },
  props: {
    curPage: {
      type: Number
    },
    totalPage: Number,
    checkedWmode: {
      type: Number
    },
    videoPageData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    pageChange(val) {
      this.$emit('iconClick', 'pageChange', val)
    }
  }
}

</script>
<style lang='less' scoped>
.page-box {
  width: 100%;
  height: 25px;
  line-height: 25px;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .first-pager {
    display: inline-block;
    font-size: 13px;
    cursor: pointer;
    font-weight: 400;
    height: 25px;
    line-height: 25px;
    color: #606266;
    box-sizing: border-box;
    vertical-align: top;
  }
  .first-pager {
    padding: 0 10px;
    &:hover {
      color: #409EFF;
    }
  }
  .total-page {
    white-space: nowrap;
    padding: 2px 5px;
    color: #303133;
    font-weight: 700;
    span {
      display: inline-block;
      font-size: 13px;
      cursor: pointer;
      font-weight: 400;
      height: 28px;
      line-height: 28px;
      color: #606266;
      box-sizing: border-box;
      vertical-align: top;
    }
  }
}
/deep/ .el-pagination {
  button {
    width: 27px;
    height: 25px;
    padding: 0;
    min-width: 27px;
  }
}
</style>
