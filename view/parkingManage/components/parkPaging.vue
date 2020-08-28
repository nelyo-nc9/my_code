<!--
 * @Author: your name
 * @Date: 2020-06-05 17:58:58
 * @LastEditTime: 2020-06-05 17:59:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\parkingManage\components\paging.vue
--> 
<template>
  <div class="pagination-box">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, slot, prev"
      :total="total">
      <div class="first-pager" @click="jumpPage('first')">首页</div>
    </el-pagination>
    <div class="pager">
      <span>{{currentPage}}</span>&nbsp;<span>/</span>&nbsp;<span>{{totalPage}}</span>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="next, slot, jumper"
      :total="total">
      <div class="last-pager" @click="jumpPage('last')">末页</div>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: { // 总条数
      type: Number
    }
  },
  computed: {
    totalPage() { // 总页数
      let pageCount = Math.ceil(this.total / this.pageSize)
      return pageCount || 1
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSizes: [25, 50, 100, 200],
      pageSize: 25
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.$emit('paginationConfChange', {
        'currentPage': this.currentPage,
        'pageSize': this.pageSize
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('paginationConfChange', {
        'currentPage': this.currentPage,
        'pageSize': this.pageSize
      })
    },
    jumpPage(type) {
      this.currentPage = type === 'first' ? 1 : this.totalPage
      this.$emit('paginationConfChange', {
        'currentPage': this.currentPage,
        'pageSize': this.pageSize
      })
    },
    setPaginationConfig(config) { // 暴露给父组件修改子组件的变量
      this.currentPage = config.currentPage
      this.pageSize = config.pageSize
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
    height: 28px;
    line-height: 28px;
    color: #606266;
    box-sizing: border-box;
    vertical-align: top;
  }
  .frist-pager,
  .last-pager {
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
</style>
