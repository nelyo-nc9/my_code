<!--
 * @Author: dfk
 * @Date: 2020-08-18 20:46:26
 * @LastEditTime: 2020-08-25 19:28:24
 * @LastEditors: zhangcg
 * @Description:
-->
<template>
  <div class="page" style="display: flex;align-items: center">
      <!-- <a @click="handleCurrentChange(1)">首页</a> -->
      <div class="pagination">
        <el-pagination
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="prev,slot, next"
          :current-page="pagingPage.pageNum"
          :page-size="pagingPage.pageSize"
          :total="pagingPage.total">
          <div class="pagerNum">{{page}}/{{totalPage}}</div>
        </el-pagination>
      </div>
      <!-- <a @click="handleCurrentChange(Math.ceil(pagingPage.total/pagingPage.pageSize))">末页</a> -->
  </div>
</template>

<script>
export default {
  name: 'Paging',
  inheritAttrs: false,
  data() {
    return {
      page: 1,
    }
  },
  props: {
    pagingPage:{
      type: Object,
      default: () => {
        return {}
      }
    },
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    checkedWmode: {
      type: Number
    },
    videoStatusArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    iconPlay: {
      type: String
    }
  },
  computed: {
    totalPage() { // 总页数
      let pageCount = Math.ceil(this.pagingPage.total / this.pagingPage.pageSize)
      return pageCount || 1
    },
  },
  mounted(){
    
  },
  methods: {
    playStop() {
      this.$emit('iconClick', 'paging')
    },
    handleCurrentChange(val) {
      let _this = this;
      // console.log(`当前页: ${val}`);
      _this.pagingPage.pageNum = val
      _this.$emit('handleCurrentChange',val);
    },
    handleSizeChange(pageSize) {
      this.pagingPage.pageSize = pageSize;
      this.handleCurrentChange(1)
    },
    setPaginationConfig(config) { // 暴露给父组件修改子组件的变量
      this.page = config.page
      // this.limit = config.limit
    },
  }
}
</script>
<style lang='less' scoped>
.page {
    // width: 200px;
    height: 56px;
    padding: 8px 0;
    a {
      flex: 1;
      cursor: pointer;
    }
    .pagination {
      // width: 110px;
      height: 56px;
      // padding: 14px 0 0 0;
      /deep/ .el-pagination{
        button{
          margin-top: 13px;
        }
      }
    }
    p {
      line-height: 36px;
      margin-left: 50px;
      padding: 0 5px;
      span:first-child {
        font-size: 24px;
        cursor: pointer;
      }
      span:hover {
        color: rgba(45, 114, 211, 1);
      }
    }
    p:last-child {
      line-height: 36px;
      padding: 0 5px;
      span:first-child {
        font-size: 24px;
        cursor: pointer;
      }
      span:hover {
        color: rgba(45, 114, 211, 1);
      }
    }
    .pagerNum{
      display: inline-block;
      padding: 0 10px;
    }
  }
</style>
