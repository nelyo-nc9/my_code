<template>
  <div class="role-manage-search-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item class="active">{{currentTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="box-title">角色管理查询</div>
            <div class="p-serach-from">
              <ul>
                <li>
                  <span>角色名称</span>
                  <section :class="[rules.name ? 'blur-rule' : '']">
                    <el-input v-model="form.name" size="small" clearable @clear="rules.name=false" @blur="regExp(form.name, 'name', ['long'])"></el-input>
                    <p v-if="rules.name">{{ruleTitle.name}}</p>
                  </section>
                </li>
                <li>
                  <span>角色类型</span>
                  <section>
                    <el-select v-model="form.type" placeholder="请选择类型" size="small">
                      <el-option label="全部" value="0"></el-option>
                      <el-option label="正常授权" value="1"></el-option>
                      <el-option label="排除授权" value="2"></el-option>
                    </el-select>
                  </section>
                </li>
                <li>
                  <span>权限分配方式</span>
                  <section>
                    <el-select v-model="form.authorityAssignType" placeholder="请选择分配方式" size="small">
                      <el-option label="全部" value="0"></el-option>
                      <el-option label="按部位授权" value="1"></el-option>
                      <el-option label="按点位授权" value="2"></el-option>
                    </el-select>
                  </section>
                </li>
                <li class="last">
                  <span>备注</span>
                  <section :class="[rules.description ? 'blur-rule' : '']">
                    <el-input v-model="form.description" size="small" clearable @clear="rules.description=false" @blur="regExp(form.description, 'description', ['long'])"></el-input>
                    <p v-if="rules.description">{{ruleTitle.description}}</p>
                  </section>
                </li>
              </ul>
            </div>
            <div class="p-search-footer">
              <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
              <el-button @click="reset" size="small">重置</el-button>
              <el-button size="small" @click="educe" icon="icon iconfont-ccb ccbdaochu1 el-icon-">导出</el-button>
            </div>
          </div>
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
            style="width: 100%;height: 100%;"
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
            :page-sizes="[25,50,100,200]"
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
import { download } from '@src/common/download.js'
export default {
  name: 'RoleManageSearch',
  data() {
    return {
      resizable: true,
      columns: [
        { prop: 'name', sortable: true, label: '角色名称', width: '200' },
        { prop: 'type', sortable: true, label: '角色类型', width: '200' },
        { prop: 'authorityAssignType', sortable: true, label: '权限分配方式', width: '240' },
        { prop: 'description', sortable: true, label: '备注', width: '200' }
      ],
      tableData: [],
      total: 0,
      selectData: [],
      obj: {},
      form: {
        name: '',
        type: '0',
        authorityAssignType: '0',
        description: ''
      },
      ruleTitle: {
        name: '',
        type: '',
        authorityAssignType: '',
        description: ''
      },
      rules: {
        title: '',
        name: false,
        type: false,
        authorityAssignType: false,
        description: false
      },
      pageSize: 25,
      page: 1
    }
  },
  computed: {
    ...mapState({
      currentView: ({ roleManage }) => roleManage.currentView,
      currentTitle: ({ roleManage }) => roleManage.currentTitle
    })
  },
  created() {
    this.obj = { ...this.form }
  },
  methods: {
    ...mapActions('roleManage', ['setState', 'getList', 'exportManage']),
    ...mapMutations('roleManage', ['SET_STATE']),
    // 请求表格数据方法
    getTableList(obj = { pageSize: 25, page: 1 }) {
      this.getList(obj).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          this.total = data.page.totalNumber
          if (data.roles.length > 0) {
            this.$messageSuccess('列表获取成功')
          }
          let arr = JSON.parse(JSON.stringify(data.roles))
          console.log(arr)
          arr.forEach(item => {
            if (item.type === 1) {
              item.type = '正常授权'
            }
            if (item.type === 2) {
              item.type = '排除授权'
            }
            if (item.authorityAssignType === 1) {
              item.authorityAssignType = '按部位授权'
            }
            if (item.authorityAssignType === 2) {
              item.authorityAssignType = '按点位授权'
            }
            item.roleName = item.name
          })
          this.tableData = arr.filter(item => item.type !== 3)
        }
      })
    },
    select(val) {
      console.log(val)
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(val, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      // let obj = { pageSize: this.pageSize, page: val }
      let obj = Object.assign({page: val, pageSize: this.pageSize}, this.form)
      obj.type = obj.type * 1
      obj.authorityAssignType = obj.authorityAssignType * 1
      this.getTableList(obj)
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    // 查询
    onSubmit() {
      let obj = Object.assign({page: this.page, pageSize: this.pageSize}, this.form)
      obj.roleName = obj.name
      if (obj.authorityAssignType === '1' || obj.authorityAssignType === '2') {
        obj.authorityAssignType = obj.authorityAssignType * 1
      } else {
        delete obj.authorityAssignType
      }
      if (obj.type === '1' || obj.type === '2') {
        obj.roleType = obj.type * 1
      }
      if (obj.description.length <= 0 || obj.description === '') {
        delete obj.description
      }
      if (obj.name.length <= 0 || obj.name === '') {
        delete obj.roleName
      }
      delete obj.type
      delete obj.name
      console.log(obj)
      this.getTableList(obj)
    },
    // 重置
    reset() {
      this.form = { ...this.obj }
      this.tableData = []
      this.total = 0
      // this.pageSize = 25
      this.page = 1
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['角色名称', '角色类型', '权限分配方式', '备注']
      const filterVal = ['roleName', 'type', 'authorityAssignType', 'description']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '角色查询')
      } else {
        // let obj = Object.assign({sync: 1}, this.handleForm(this.form))
        let obj = Object.assign({}, this.form)
        obj.roleName = obj.name
        if (obj.authorityAssignType === '1' || obj.authorityAssignType === '2') {
          obj.authorityAssignType = obj.authorityAssignType * 1
        } else {
          delete obj.authorityAssignType
        }
        if (obj.type === '1' || obj.type === '2') {
          obj.roleType = obj.type * 1
        }
        if (obj.description.length <= 0 || obj.description === '') {
          delete obj.description
        }
        if (obj.name.length <= 0 || obj.name === '') {
          delete obj.roleName
        }
        delete obj.type
        delete obj.name
        this.exportEduce(obj)
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    async exportEduce(obj = {sync: 1, isChildren: this.showSubOrg ? 1 : 2, org: this.orgId}) {
      await this.exportManage(obj).then(res => {
        // console.log(res)
        let {code, data} = res.data
        if (code === 0) {
          let fileName = data.fileName && data.fileName
          if (fileName) {
            let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/user/v1/operation/downFile?fileName=${fileName}`
            let name = `角色查询列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
            download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) })
          }
        } else {
          throw res.data.message
        }
      }).catch(err => {
        throw err
      })
    },
    // 校验
    regExp(value, key, arr) {
      // console.log(value, key, arr)//
      let str = value.replace(/(^\s*)|(\s*$)/g, '')
      // console.log(str)
      arr.forEach(item => {
        if (item === 'null') {
          if (str === '') {
            this.rules[key] = true
            this.ruleTitle[key] = '内容不能为空'
          } else if (str.length > 64) {
            this.rules[key] = true
            this.ruleTitle[key] = '内容长度不能超出64个字符'
          } else {
            this.rules[key] = false
          }
        } else if (item === 'long') {
          if (str.length > 128) {
            this.rules[key] = true
            this.ruleTitle[key] = '内容长度不能超出128个字符'
          } else {
            this.rules[key] = false
          }
        } else {
          this.rules[key] = false
        }
      })
    }
    // 打印
    // print() {
    //   return this.$message('打印')
    // }
    // ,
    // // 角色类型
    // roleType(val) {
    //   if (val === '正常授权') {
    //     this.checkTree = false
    //   }
    //   if (val === '排除授权') {
    //     this.checkTree = true
    //   }
    // },
    // // 权限分配方式
    // authorityAssignType(val) {
    //   if (val === '按点位授权') {
    //     this.statusTitle = '资源点'
    //   }
    //   if (val === '按部位授权') {
    //     this.statusTitle = '机构部'
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.role-manage-search-box {
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
        margin: 10px 0;
        width: 100%;
        .main-box {
          padding: 20px;
          .box-title {
            height: 60px;
            text-align: center;
            line-height: 60px;
            font-size: 18px;
          }
          .p-serach-from {
            border: 1px solid #ddd;
            padding: 15px 10px 5px 20px;
            width: 80%;
            max-width: 1300px;
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
                height: 48px;
                display: flex;
                span {
                  width: 150px;
                  height: 32px;
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
                  flex-direction: column;
                  .el-select {
                    width: 100%;
                  }
                  el-date-picker {
                    width: 100%;
                  }
                  p{
                    color: red;font-size: 12px;
                  }
                }
                .blur-rule{
                  .el-input {
                    /deep/ input{border-color: red;}
                  }
                }
              }
              .last {
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
    .main {
      width: 972px;
      margin: 0 auto;
      height: calc(~'100% - 350px');
      .list-box-table {
        // width: 100%;
        overflow: auto;
        height: calc(~'100% - 50px');
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
