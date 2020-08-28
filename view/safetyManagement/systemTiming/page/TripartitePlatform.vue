<template>
  <!-- ================================================第三方平台======================================================== -->
  <div class="content-page">
    <div class="left-tree">
      <!-- :treeType="treeType" @rootId="setRootId" -->
      <treeBox
        :lazyTreeApi="getTreeApi"
        searchType="filter"
        @onceClick="organizeTreeClickHandle"
        treeLazyToggle
        iconToggle
      ></treeBox>
    </div>
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
            <el-breadcrumb-item>系统校时</el-breadcrumb-item>
            <el-breadcrumb-item>第三方平台</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="table-box">
        <div class="table-box">
          <div class="query-criteria">
            <div class="top-name">
              <span class="name">
                查询条件
                <i :class="{'el-icon-arrow-up': isshow, 'el-icon-arrow-down': !isshow}"></i>
              </span>
              <span class="border-span"></span>
            </div>
            <div class="form-box">
              <div class="form">
                <div class="form-item">
                  <label>所属子系统</label>
                  <el-select v-model="inquireForm.subSystemId" placeholder="请选择">
                    <el-option
                      v-for="item in subSystemOptions"
                      :key="item.key"
                      :label="item.label"
                      :value="item.key"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="form">
                <div class="form-item">
                  <label>标准时差（秒）</label>
                  <span>
                    <el-input
                      v-model="inquireForm.timeDiffrentStart"
                      placeholder="请输入内容"
                      @blur="IS_number('timeDiffrentStart')"
                    ></el-input>
                    <span>到</span>
                    <el-input
                      v-model="inquireForm.timeDiffrentEnd"
                      placeholder="请输入内容"
                      @blur="IS_number('timeDiffrentEnd')"
                    ></el-input>
                  </span>
                </div>
              </div>
            </div>
            <div class="footer-button">
              <el-button @click="getThreeList">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </div>
          <div class="query-results">
            <div>
              <div class="top-name">
                <span class="name">查询结果</span>
                <span class="border-span"></span>
              </div>
            </div>
            <div class="table-content">
              <div class="table-top">
                <div>
                  <el-button @click="exportFile">导出</el-button>
                  <el-button @click="Toprint">打印</el-button>
                  <el-checkbox v-model="isShowSubOrg">显示子机构</el-checkbox>
                </div>
              </div>
              <el-table
                :data="tableData"
                border
                size="mini"
                stripe
                height="570px"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column
                  v-for="item in tableColumn"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
              <el-pagination
                style="text-align:center;"
                :page-sizes="[25, 50, 100, 200]"
                :page-size="this.inquireForm.page"
                layout="total, sizes, prev, pager, next, jumper"
                :total="this.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getThreeList, getTreeApi } from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'
import treeBox from '@src/components/tree/treeBox'
export default {
  components: {
    treeBox,
  },
  data() {
    return {
      selectData: [],
      total: 0,
      inquireForm: {
        subSystemId: '',
        timeDiffrentStart: '-30',
        timeDiffrentEnd: '30',
        page: 1,
        limit: 25,
      },
      isShowSubOrg: true,
      form: {
        value: '1',
        input1: '',
        input2: '',
      },
      isshow: false,
      tableColumn: [
        // 表格标题行内容
        { prop: 'subsystemId', label: '所属子系统' },
        { prop: 'orgId', label: '所属机构' },
        { prop: 'KeyPartId', label: '所属重点部位' },
        { prop: 'platformEvent', label: '平台名称' },
        { prop: 'resourceCode', label: '资源编码' },
        { prop: 'platformEvent', label: '平台时间' },
        { prop: 'systemTime', label: '系统时间' },
        { prop: 'platformTimeDiffrent', label: '平台时差（秒）' },
        { prop: 'timing', label: '校时时间' },
        { prop: 'timingResult', label: '校对结果' },
        { prop: 'updatedAt', label: '录入人' },
        { prop: 'updatedDept', label: '录入机构' },
        { prop: 'updatedAt', label: '录入时间' },
      ],
      tableData: [
        // 列表数据
      ],
      // 子系统列表
      subSystemOptions: [
        {
          label: '全部',
          key: '',
        },
        {
          label: '视频子系统',
          key: 1,
        },
        {
          label: '报警子系统',
          key: 2,
        },
        {
          label: '对讲子系统',
          key: 3,
        },
        {
          label: '门禁子系统',
          key: 4,
        },
        {
          label: '停车场子系统',
          key: 5,
        },
        {
          label: '防护舱子系统',
          key: 6,
        },
        {
          label: '电视子系统',
          key: 7,
        },
      ],
    }
  },
  created() {
    let params = {
      page: 1,
      limit: 25,
      // subSystemId: this.inquireForm.subSystemId,
      // timeDiffrentStart: this.inquireForm.timeDiffrentStart,
      // timeDiffrentEnd: this.inquireForm.timeDiffrentEnd,
      // // deviceType: 0,
      // isChild: true
    }
    getThreeList(params).then((res) => {
      console.log('加载页面', res)
      let result = res.data.data
      console.log(result)
      if(res.data.message == 'success'){
        this.tableData = result.platforms
         this.total = result.count.total
         this.$messageSuccess('获取列表成功')
      }else{
        this.$messageError('获取列表失败')
      }
      
    })
  },
  mounted() {},
  methods: {
    // 表格中勾选项的事件
    handleSelectionChange(val) {
      this.selectData = val
      // console.log(this.selectData)
    },
    // 添加的分页的事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      let params = {
        page: 1,
        limit: val,
      }
      getThreeList(params).then((res) => {
        console.log(res)
        if(res.data.message == 'success'){
          this.tableData = res.data.data.platforms
            this.$messageSuccess('获取列表成功')
        }else{
          this.$messageError('获取列表成功')
        }
      })
    },
    handleCurrentChange(val) {
      // console.log(this.inquireForm.pagesize)
      let params = {
        page: val,
        limit: 25,
      }
      getThreeList(params).then((res) => {
        console.log(res)
        if(res.data.message == 'success'){
            this.tableData = res.data.data.platforms
            this.$messageSuccess('获取列表成功')
        }else{
            this.$messageError('获取列表成功')
        }
       
      })
      console.log(`当前页: ${val}`)
    },
    //输入的查询时间检测是否为非数字
    IS_number(str) {
      if (isNaN(this.inquireForm[str])) {
        this.$messageError('输的类型错误')
        this.inquireForm[str] = ''
        return false
      }
    },
    // 重置
    reset() {
      this.inquireForm = {
        subSystemId: '',
        timeDiffrentStart: '',
        timeDiffrentEnd: '',
      }
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    organizeTreeClickHandle(res) {
      console.log('02 当前点击的 机构树 --------- ', res, res.id, res.subType)
    },
    //保存按钮的事件 =======================================================
    getThreeList() {
      let params = {
        page: 1,
        limit: 25,
        subSystemId: this.inquireForm.subSystemId,
        timeDiffrentStart: this.inquireForm.timeDiffrentStart,
        timeDiffrentEnd: this.inquireForm.timeDiffrentEnd,
        // deviceType: 0,
        isChild: true,
      }
      getThreeList(params).then((res) => {
        console.log('查询按钮', res)
        let result = res.data.data
        console.log(result)
        this.tableData = result.platforms
        this.total = result.count.total
      })
    },
    // 导出第一步
    exportFile() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = [
        '所属子系统',
        '所属机构',
        '所属重点部位',
        '平台名称',
        '资源编码',
        '平台时间',
        '系统时间',
        '平台时差',
        '校时时间',
        '校时结果',
        '录入人',
        '录入机构',
        '录入时间',
      ]
      // 字段名
      const filterVal = [
        'subSystemId',
        'orgId',
        'keyPartId',
        'platformName',
        'resourceCode',
        'platformEvent',
        'systemTime',
        'platformTimeDiffrent',
        'timing',
        'timingResult',
        'updatedBy',
        'updatedDept',
        'updatedAt',
      ]
      let list = []
      // 导出全部或导出选中
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
    },
    // 导出第二步
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    // 打印方法
    Toprint() {
      // 判断打印全部还是选中
      console.log('打印按钮')
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
        console.log(list)
        console.log('---------------------', list)
      } else {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'subSystemId', displayName: '所属子系统' },
          { field: 'orgId', displayName: '所属机构' },
          { field: 'keyPartId', displayName: '所属重点部位' },
          { field: 'platformName', displayName: '平台名称' },
          { field: 'resourceCode', displayName: '资源编码' },
          { field: 'platformEvent', displayName: '平台时间' },
          { field: 'systemTime', displayName: '系统时间' },
          { field: 'platformTimeDiffrent', displayName: '平台时差' },
          { field: 'timing', displayName: '校时时间' },
          { field: 'timingResult', displayName: '校对结果' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'updatedAt', displayName: '录入时间' },
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">设备状态列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000}; @page{} body {color:pink}',
        // 表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#111; ',
        // 内容样式
        gridStyle:
          'border:1px solid lightgray; white-space:nowrap; font-size:12px; text-align:center; color:#222; size:auto; margin:0mm; @page {size: auto ;margin: 0mm ;}',
      })
    },
  },
}
</script>

<style lang="less" scoped>
.content-page {
  width: 100%;
  height: 100%;
  position: relative;
  /deep/ .el-button {
    width: 70px;
    padding: 7px 20px;
    font-size: 13px;
  }
  .left-tree {
    width: 240px;
    height: 100%;
    position: absolute;
    border-right: 1px solid #e1e1e1;
  }
  .right-content {
    height: 100%;
    width: calc(~'100% - 240px');
    position: absolute;
    left: 240px;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 17px 20px 0 20px;
    .table-box {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .top-name {
        display: flex;
        width: 100%;
        align-content: center;
        height: 19px;
        .name {
          color: #606266;
          font-size: 14px;
          // margin: 0 7px;
          width: 75px;
        }
        .border-span {
          height: 1px;
          width: calc(~'100% - 75px');
          background: #ccc;
          margin-top: 10px;
        }
      }
      .query-criteria {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .form-box {
          width: 920px;
          border: 1px solid #ccc;
          padding: 5px;
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          .form {
            width: 49%;
            .form-item {
              margin-bottom: 5px;
              label {
                width: 140px;
                margin-left: 5px;
                background: #f1f1f1;
                display: inline-block;
                height: 30px;
                font-size: 13px;
                line-height: 30px;
                text-align: center;
              }
              /deep/ .el-select {
                .el-input {
                  .el-input__inner {
                    height: 30px;
                    width: 290px;
                    border-radius: 0px;
                  }
                  .el-input__suffix {
                    .el-input__suffix-inner {
                      i {
                        line-height: 30px;
                      }
                    }
                  }
                }
              }
              /deep/ .el-input {
                width: 290px;
                .el-input__inner {
                  height: 30px;
                  width: 290px;
                  border-radius: 0px;
                }
              }
            }
            .form-item > span {
              span {
                margin: 0 14px;
              }
              /deep/ .el-input {
                width: 120px;
                .el-input__inner {
                  height: 30px;
                  width: 120px;
                  border-radius: 0px;
                }
              }
            }
          }
        }
        .footer-button {
          margin-top: 10px;
        }
      }
      .query-results {
        flex: 1;
        .table-content {
          height: calc(~'100% - 19px');
          .table-top {
            display: flex;
            justify-content: space-between;
            padding: 10px 5px;
            /deep/ .el-select {
              margin-left: 5px;
              .el-input {
                .el-input__inner {
                  height: 25px;
                  width: 81px;
                  border-radius: 0px;
                }
                .el-input__suffix {
                  .el-input__suffix-inner {
                    i {
                      line-height: 25px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
