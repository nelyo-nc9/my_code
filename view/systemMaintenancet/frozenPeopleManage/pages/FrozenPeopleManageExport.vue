<template>
  <div class="frozen-manage-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>冻结用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>导出</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="main-box">
        <div class="box-title">导出冻结用户</div>
        <div class="p-serach-from">
          <span>文件位置</span>
          <section>
            <el-input v-model="value" clearable></el-input>
          </section>
          <el-button>浏览</el-button>
        </div>
        <div class="p-search-footer">
          <el-button type="primary" @click="handle" size="small">导出</el-button>
          <!-- <input type="file" @onChange="browseFolder(e)" /> -->
          <el-button @click="reset" size="small">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'FrozenPeopleManageExport',
  data() {
    return {
      value: ''
    }
  },
  computed: {
    ...mapState({
      fromView: ({frozenPeopleManage}) => frozenPeopleManage.fromView,
      fromTitle: ({frozenPeopleManage}) => frozenPeopleManage.fromTitle,
      selectData: ({frozenPeopleManage}) => frozenPeopleManage.selectData
    })
  },
  created() {},
  methods: {
    ...mapActions('frozenPeopleManage', ['setState']),
    handle() {
      console.log('111', this.selectData)
    },
    // 关闭
    reset() {
      this.setState({ type: 'SET_STATE', key: 'currentView', value: this.fromView })
      this.setState({ type: 'SET_STATE', key: 'currentTitle', value: this.fromTitle })
    }
  }
}
</script>

<style lang="less" scoped>
.frozen-manage-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding-left: 10px;
    .top {
      width: 100%;
      .header {
        margin-bottom: 10px;
      }
      .top-main {
        margin: 10px 0;
        width: 100%;
      }
      .button-box {
        width: 100%;
        margin: 9px 0px;
      }
    }
    .main-box {
      width: 100%;
      .box-title {
        height: 60px;
        text-align: center;
        line-height: 60px;
        font-size: 18px;
      }
      .p-serach-from {
        border: 1px solid #ddd;
        padding: 10px;
        width: 100%;
        height: 80px;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        align-items: center;

        span {
          width: 150px;
          height: 70%;
          background: #f5f5f5;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        section {
          flex: 1;
          height: 100%;
          padding: 0px 10px;
          display: flex;
          align-items: center;
          .el-cascader {
            width: 100%;
          }
          el-date-picker {
            width: 100%;
          }
        }
      }
      .p-search-footer {
        padding-top: 20px;
        text-align: center;
      }
    }
  }
}
</style>
