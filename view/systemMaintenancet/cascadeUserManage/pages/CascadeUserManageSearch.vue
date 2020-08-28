<template>
  <div class="cascadeUser-manage-search-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>级联用户管理</el-breadcrumb-item>
            <el-breadcrumb-item class="active">{{currentTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="box-title">级联用户管理查询</div>
            <div class="p-serach-from">
              <ul>
                <li>
                  <span>姓名</span>
                  <section>
                    <el-input v-model="form.name" size="small" clearable></el-input>
                  </section>
                </li>
                <li>
                  <span>登录用户</span>
                  <section>
                    <el-input v-model="form.logUser" size="small" clearable></el-input>
                  </section>
                </li>
                <li class="last">
                  <span>平台名称</span>
                  <section>
                    <el-input v-model="form.platform" size="small" clearable></el-input>
                  </section>
                </li>
                <li>
                  <span>所属机构</span>
                  <section>
                    <el-select v-model="form.org" placeholder="请选择机构" size="small" clearable @clear="handleClear"  ref="selectTree">
                      <el-option hidden value="tree"></el-option>
                      <el-tree :data="data" :props="defaultProps" node-key="id"
                        :expand-on-click-node="false"
                        :check-on-click-node="true"
                        @node-click="handleNodeClick"
                      >
                      </el-tree>
                    </el-select>
                  </section>
                </li>
                <!-- <li>
                  <span>职务</span>
                  <section>
                    <el-input v-model="form.job" size="small" clearable></el-input>
                  </section>
                </li> -->
                <li>
                  <span>用户IP</span>
                  <section>
                    <el-input v-model="form.ip" size="small" clearable></el-input>
                  </section>
                </li>
                <li>
                  <span>登录类型</span>
                  <section>
                    <el-select v-model="form.type" placeholder="请选择类型" size="small">
                      <el-option label="web登录" value="web登录"></el-option>
                      <el-option label="app登录" value="app登录"></el-option>
                    </el-select>
                  </section>
                </li>
                <li>
                  <span>登录时间</span>
                  <section>
                    <el-date-picker
                      v-model="form.time"
                      type="datetimerange"
                      :picker-options="pickerOptions"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      align="center" style="width: 100%;"
                      size="small"
                    ></el-date-picker>
                  </section>
                </li>
                <li>
                  <span>登录时长</span>
                  <section>
                    <el-select v-model="form.duration" placeholder="请选择时长" size="small">
                      <el-option label="2小时以内" value="2小时以内"></el-option>
                      <el-option label="6小时以内" value="6小时以内"></el-option>
                      <el-option label="一天以内" value="一天以内"></el-option>
                      <el-option label="一天以上" value="一天以上"></el-option>
                    </el-select>
                  </section>
                </li>
              </ul>
            </div>
            <div class="p-search-footer">
              <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
              <el-button @click="reset" size="small">重置</el-button>
            </div>
          </div>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small">导出</el-button>
          <el-button size="small">打印</el-button>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table
            stripe
            border
            size="medium"
            :data="tableData"
            highlight-current-row
            @selection-change="handleSelectionChange"
            ref="Table"
            height="100%"
            max-height="700"
            style="width: 100%"
          >
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
            <el-table-column
              v-for="(column, index) in columns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable"
            ></el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageNum"
            :page-sizes="[200,100,50,25]"
            :page-size="pageSize"
            :current-page="page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'CascadeUserManageSearch',
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      resizable: false,
      columns: [
        { prop: 'name', sortable: true, label: '姓名', width: '150' },
        { prop: 'logUser', sortable: true, label: '登录用户', width: '200' },
        { prop: 'platform', sortable: true, label: '平台名称', width: '180' },
        { prop: 'org', sortable: true, label: '所属机构', width: '200' },
        { prop: 'ip', sortable: true, label: '用户IP', width: '200' },
        { prop: 'type', sortable: true, label: '登录类型', width: '200' },
        { prop: 'time', sortable: true, label: '登录时间', width: '200' },
        { prop: 'duration', sortable: true, label: '登录时长', width: '200' }
      ],
      tableData: [
        {
          roleName: 'roleName',
          roleType: 'roleType',
          addPermissionType: 'addPermissionType',
          description: 'description'
        },
        {
          roleName: 'roleName1',
          roleType: 'roleType1',
          addPermissionType: 'addPermissionType1',
          description: 'description1'
        },
        {
          roleName: 'roleName2',
          roleType: 'roleType2',
          addPermissionType: 'addPermissionType2',
          description: 'description2'
        }
      ],
      total: 0,
      selectData: [],
      obj: {},
      form: {
        name: '',
        logUser: '',
        platform: '',
        userRole: '',
        org: '',
        ip: '',
        type: '',
        time: '',
        duration: ''
      },
      pageSize: 25,
      page: 1,
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 11,
          label: '二级 1-1',
          children: [{
            name: '三级 1-1-1'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 22,
          label: '二级 2-1',
          children: [{
            id: 221,
            label: '三级 2-1-1'
          }]
        }, {
          id: 23,
          label: '二级 2-2',
          children: [{
            id: 224,
            label: '三级 2-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapState({
      currentView: ({ cascadeUserManage }) => cascadeUserManage.currentView,
      currentTitle: ({ cascadeUserManage }) => cascadeUserManage.currentTitle
    })
  },
  created() {
    this.obj = { ...this.form }
  },
  methods: {
    ...mapActions('cascadeUserManage', ['setState']),
    ...mapMutations('cascadeUserManage', ['SET_STATE']),
    getTableList(obj = { pageSize: 10, page: 1 }) {
      // 请求表格数据方法
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(val, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      let obj = { pageSize: this.pageSize, page: val }
      this.getTableList(obj)
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    // 查询预置
    onSubmit() {
      console.log('submit!', this.form)
    },
    // 重置
    reset() {
      this.form = { ...this.obj }
      this.tableData = []
    },
    // 节点点击事件
    handleNodeClick(data) {
      // 这里主要配置树形组件点击节点后，设置选择器的值；自己配置的数据，仅供参考
      this.form.org = data.label
      // 选择器执行完成后，使其失去焦点隐藏下拉框的效果
      this.$refs.selectTree.blur()
    },
    // 选择器配置可以清空选项，用户点击清空按钮时触发
    handleClear() {
      // 将选择器的值置空
      this.form.org = ''
    }
  }
}
</script>

<style lang="less" scoped>
.cascadeUser-manage-search-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding: 5px 0px 5px 10px;
    .top {
      width: 100%;
      .header {
        margin-bottom: 10px;
        color: #333333;
        /deep/ .el-breadcrumb {
          font-size: 12px;
          .active {
            .el-breadcrumb__inner {
              color: #2D72D3;
            }
          }
        }
      }
      .top-main {
        width: 100%;
        .main-box {
          padding: 0px 20px;
          .box-title {
            height: 60px;
            text-align: center;
            line-height: 60px;
            font-size: 18px;
          }
          .p-serach-from {
            border: 1px solid #ddd;
            padding: 10px;
            width: 80%;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
            ul {
              width: 100%;
              height: 96%;
              display: flex;
              flex-wrap: wrap;
              li {
                width: 50%;
                height: 36px;
                display: flex;
                span {
                  width: 150px;
                  height: 96%;
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
                  .el-select {
                    width: 100%;
                  }
                  el-date-picker {
                    width: 100%;
                  }
                }
              }
              .last {
                width: 100%;
              }
            }
          }
          .p-search-footer {
            padding: 10px 0px;
            text-align: center;
          }
        }
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 340px');
      .list-box-table {
        width: 100%;
        overflow: auto;
        height: calc(~'100% - 40px');
      }
      .main-footer {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        /deep/ .el-pager li.active {
          color: #2d72d3!important;cursor: pointer;background: rgba(255, 236, 236, 0.1);
        }
      }
    }
  }
}
</style>
