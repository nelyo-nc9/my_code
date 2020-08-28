<template>
  <div class="pagination-box">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pageSizes"
      :page-size="limit"
      :layout="firstLayout"
      :total="total">
      <div v-if="showSolt" class="first-pager" @click="jumpPage('first')">首页</div>
    </el-pagination>
    <div class="pager">
      <span>{{page}}</span>&nbsp;<span>/</span>&nbsp;<span>{{totalPage}}</span>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pageSizes"
      :page-size="limit"
      :layout="lastLayout"
      :total="total">
      <div v-if="showSolt" class="last-pager" @click="jumpPage('last')">末页</div>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: { // 总条数
      type: Number
    },
    showSolt: { // 是否显示插槽
      type: Boolean,
      default: true
    },
    showSize: { // 是否显示一页展示数据大小
      type: Boolean,
      default: true
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 25, 50, 100]
      }
    },
    type: { // 为了解决一个页面有多个分页，触发的方法写多个
      type: String,
      default: ''
    }
  },
  computed: {
    totalPage() { // 总页数
      //console.log(this.total,'总数|每页',this.limit)
      let pageCount = Math.ceil(this.total / this.limit)
      return pageCount || 1
    },
    firstLayout() {
      if (this.showSolt) {
        if (this.showSize) {
          return 'total, sizes, slot, prev'
        } else {
          return 'total, slot, prev'
        }
      } else {
        return 'total, prev'
      }
    },
    lastLayout() {
      return this.showSolt ? 'next, slot, jumper' : 'next, jumper'
    }
  },
  watch: {
    showSize(nv) {
      this.limit = nv ? 10 : 16
    }
  },
  data() {
    return {
      page: 1,
      limit: 25
    }
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val
      this.$emit('paginationConfChange', {
        'page': this.page,
        'limit': this.limit
      }, this.type)
    },
    handleCurrentChange(val) {
      this.page = val
      this.$emit('paginationConfChange', {
        'page': this.page,
        'limit': this.limit
      }, this.type)
    },
    jumpPage(type) {
      this.page = type === 'first' ? 1 : this.totalPage
      this.$emit('paginationConfChange', {
        'page': this.page,
        'limit': this.limit
      }, this.type)
    },
    setPaginationConfig(config) { // 暴露给父组件修改子组件的变量
      this.page = config.page
      this.limit = config.limit
    },
    setTotal(limit) {
      this.limit = limit
    }
  }
}
</script>

<style lang='less' scoped>
.pagination-box {
  width: 100%;
  height: 35px;
  line-height: 35px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .first-pager,
  .last-pager {
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
    padding-right: 10px;
    &:hover {
      color: #409EFF;
    }
  }
  .last-pager {
    padding-left: 10px;
    &:hover {
      color: #409EFF;
    }
  }
  .pager {
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
