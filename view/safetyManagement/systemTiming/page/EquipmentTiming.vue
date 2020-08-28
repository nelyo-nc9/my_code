<template>
<!-- =================================================设备校时=========================================================== -->
  <div class="content-page">
    <div class="left-tree">
          <!--         :treeType="treeType"          @rootId="setRootId"-->
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
            <el-breadcrumb-item>设备校时</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
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
                <el-select size="mini" v-model="inquireForm.subSystemId" placeholder="请选择">
                  <el-option v-for="item in subSystemOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
                </el-select>
              </div>
              <div class="form-item">
                <label>标准时差（秒）</label>
                <span>
                  <el-input v-model="inquireForm.timeDiffrentStart" placeholder="请输入内容" @blur="IS_number('timeDiffrentStart')"></el-input>
                  <span>到</span>
                  <el-input v-model="inquireForm.timeDiffrentEnd" placeholder="请输入内容" @blur="IS_number('timeDiffrentEnd')"></el-input>
                </span>
              </div>
            </div>
            <div class="form">
              <div class="form-item">
                <label>设备类型</label>
                <el-select size="mini" :value="inquireForm.deviceType" v-model="inquireForm.deviceType" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.key"></el-option>
                </el-select>
              </div>
              <div class="form-item">
                <label>最近一次检查时间</label>
                {{updatedAt}}
                <!-- <el-input v-model="form.input" placeholder="请输入内容"></el-input> -->
                <!-- <el-date-picker size="mini" v-model="value1" type="datetime" placeholder="选择日期时间"></el-date-picker> -->
              </div>
            </div>
          </div>

          <div class="footer-button">
            <el-button @click="getCorrectionList">查询</el-button>
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
                <el-button @click="dialogVisible = true">校时</el-button>
                <!-- <el-button @click="centerDialogVisible = true">校时</el-button> -->
                <!-- <el-button>报修</el-button> -->
                <el-button @click="exportFile">导出</el-button>
                <el-button @click="Toprint">打印</el-button>
                <el-checkbox v-model="inquireForm.isChild">显示子机构</el-checkbox>
              </div>
              <div>
<!--                getCorrectionList(value)-->
                <span>是否符合规范</span>
<!--                <el-select v-model="value" placeholder="请选择" @change="changeeo">-->
<!--                  <el-option label="符合"  :value="1"></el-option>-->
<!--                  <el-option label="不符合" :value="2"></el-option>-->
<!--                </el-select>-->
                <el-select v-model="keyValue" filterable placeholder="请选择" @change="chengeSelect">
                  <el-option
                    v-for="item in optionsSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <el-table :data="tableData" border size="mini" stripe height="520px" @selection-change="handleSelectionChange">
            <!--      复选框        -->
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
            <!-- 页码的切换 -->
            <el-pagination
              style="text-align:center;"
              :page-sizes="[25, 50, 100, 200]"
              :page-size="inquireForm.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="this.total"
              :current-page="inquireForm.pagenum"
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
      <!---------------弹窗------------------>

    <div >
      <el-dialog
        title="校时"
        :visible.sync="dialogVisible"
        size="tiny"
        :close-on-click-modal="false"
        :before-close="handleClose">
        <span>请确认是否对所选设备进行校时</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="syncTime">确 定</el-button>
         </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCorrectionList, syncTime } from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '../../../../http/securityEquipmentControl/securityEquipmentControl.api.js'

export default {
  components: {
    treeBox
  },
  data() {
    return {
      // select的options选项(符合与不符合)
      optionsSelect: [
        {
        value: '1',
        label: '符合'
      }, {
        value: '2',
        label: '不符合'
      },
      {
        value: '3',
        label: '全部'
      }],
      dialogVisible: false, // 确认框的状态
      isId: [],
      updatedAt: '',
      selectData: [],
      value1: '',
      isshow: true, // 查询条件显隐
      total: 0,
      keyValue: '',
      inquireForm: {
        pagenum: 1,
        pagesize: 25,
        subSystemId: 1,
        timeDiffrentStart: '-30',
        timeDiffrentEnd: '30',
        deviceType: 1,
        isChild: true,
        conformRules: ''
      },
      tableColumn: [
        // 表格标题行内容
        { prop: 'subSystemId', label: '所属子系统' },
        { prop: 'orgId', label: '所属机构' },
        { prop: 'keyPartId', label: '所属重点部位' },
        { prop: 'deviceType', label: '设备类型' },
        { prop: 'deviceName', label: '设备名称' },
        { prop: 'resourceCode', label: '资源编码' },
        { prop: 'timeDifferent', label: '设备时差（秒）' },
        { prop: 'conformRules', label: '是否合规' },
        { prop: 'timing', label: '校时时间' },
        { prop: 'timingResult', label: '校时结果' }
      ],
      tableData: [
        // 列表数据
      ],
      // 子系统列表
      subSystemOptions: [
        {
          label: '全部',
          key: ''
        },
        {
          label: '视频子系统',
          key: 1
        },
        {
          label: '报警子系统',
          key: 2
        },
        {
          label: '对讲子系统',
          key: 3
        },
        {
          label: '门禁子系统',
          key: 4
        },
        {
          label: '停车场子系统',
          key: 5
        },
        {
          label: '防护舱子系统',
          key: 6
        },
        {
          label: '电视子系统',
          key: 7
        }
      ],
      optionList: {
        // 视频
        list1: [
          {
            key: '',
            label: '全部'
          },
          {
            key: 1,
            label: 'NVR'
          },
          {
            key: 2,
            label: 'HDVR'
          },
          {
            key: 3,
            label: 'DVR'
          },
          {
            key: 4,
            label: 'IPC'
          }
        ],
        // 报警
        list2: [
          {
            key: 1,
            label: '电话报警主机'
          },
          {
            key: 2,
            label: '网络报警主机'
          },
          {
            key: 3,
            label: '电子围栏总线报警主机'
          },
          {
            key: 4,
            label: '振动光纤报警主机'
          }
        ],
        // 对讲
        list3: [
          {
            key: 1,
            label: '对讲主机列表'
          },
          {
            key: 2,
            label: '话筒列表'
          }
        ],
        // 门禁
        list4: [
          {
            key: 1,
            label: '普通门禁'
          },
          {
            key: 2,
            label: '联动互锁门'
          },
          {
            key: 3,
            label: '金库门禁'
          }
        ],
        // 停车
        list5: [
          {
            key: 1,
            label: '停车场'
          }
        ],
        // 防护舱
        list6: [
          {
            key: 1,
            label: '防护舱'
          }
        ],
        // 电视墙
        list7: [
          {
            key: 1,
            label: '解码器'
          },
          {
            key: 2,
            label: '解码拼控一体机'
          },
          {
            key: 3,
            label: 'LED设备'
          }
        ]

      }
    }
  },
  computed: {
    subsystemIdChange() {
      return this.inquireForm.subSystemId || 1
    }
  },
  watch: {
    subsystemIdChange: {
      immediate: true,
      handler(val, old) {
        switch (val) {
          case 1 :
            this.options = this.optionList.list1
            // this.customizeQuery.params.subSystem = 1
            break
          case 2 :
            this.options = this.optionList.list2
            // this.customizeQuery.params.subSystem = 2
            break
          case 3 :
            this.options = this.optionList.list3
            // this.customizeQuery.params.subSystem = 3
            break
          case 4 :
            this.options = this.optionList.list4
            // this.customizeQuery.params.subSystem = 4
            break
          case 5 :
            this.options = this.optionList.list5
            // this.customizeQuery.params.subSystem = 6
            break
          case 6 :
            this.options = this.optionList.list6
            // this.customizeQuery.params.subSystem = 5
            break
          case 7 :
            this.options = this.optionList.list7
            // this.customizeQuery.params.subSystem = 7
            break
        }
      }
    }
  },
  mounted() {},
  created() {
    this.getCorrectionList()
  },
  methods: {
    // 添加的分页的事件
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        let params = {
          page : 1,
          limit : val
        }
        getCorrectionList(params).then(res => {
              console.log(res)
              this.tableData  = res.data.data.devices
            })

      },
      handleCurrentChange(val) {
        // console.log(this.inquireForm.pagesize)
          let params = {
            page : val,
            limit : 25
          }
            getCorrectionList(params).then(res => {
              console.log(res)
              this.tableData  = res.data.data.devices
            })
        console.log(`当前页: ${val}`);
      },
    //选择符合于不符合的方法
    chengeSelect(){
       let params = {
         conformRules : this.keyValue
       }
       getCorrectionList(params).then(res => {
        if(!res){
          return false
        } else {
          this.tableData = res.data.data.devices
        }
      })
    },
    // 确认校验的方法
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },

    selectSearch() {
      console.log(123)
    },
    // 输入的查询时间检测是否为非数字
    IS_number(str) {
      if (isNaN(this.inquireForm[str])) {
        this.$messageError('输的类型错误')
        this.inquireForm[str] = ''
        return false
      }
    },
    // 勾选选项
    handleSelectionChange(val) {
      // 选中的要校时的选项的数组
      this.selectData = val
      // 拿到了选中的id
      this.selectData.map(item => {
        this.isId = item.id
        this.subSystemId = item.subSystemId
      })
      // console.log(this.selectData)
      // console.log(this.isId)
      // console.log(this.subSystemId)
    },
    // 校时按钮的事件
    syncTime() {
      this.dialogVisible = false
      let params = {
        subSystemId: this.subSystemId,
        ids: this.isId
      }
      syncTime(params).then(res => {
        let result = res.data
        console.log(result)
      })
    },
    // 导出第一步
    exportFile() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = ['所属子机构', '所属机构', '所属重点部位', '设备类型', '设备名称', '资源编码', '设备时差（秒）', '是否合规', '校对时间', '校对结果']
      // 字段名
      const filterVal = ['subSystemId', 'orgId', 'keyPartId', 'deviceType', 'deviceName', 'resourceCode', 'timeDifferent', 'conformRules', 'timing', 'timingResult']
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
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 打印方法
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
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
          { field: 'deviceType', displayName: '设备类型' },
          { field: 'deviceName', displayName: '设备名称' },
          { field: 'resourceCode', displayName: '资源编码' },
          { field: 'timeDifferent', displayName: '设备时差（秒）' },
          { field: 'conformRules', displayName: '是否合规' },
          { field: 'timing', displayName: '校时时间' },
          { field: 'timingResult', displayName: '校时结果' }
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
          'border:1px solid lightgray; white-space:nowrap; font-size:12px; text-align:center; color:#222; size:auto; margin:0mm; @page {size: auto ;margin: 0mm ;}'
      })
    },
    reset() {
      this.inquireForm = {
        pagenum: 1,
        pagesize: 25,
        subSystemId: '',
        timeDiffrentStart: '',
        timeDiffrentEnd: '',
        deviceType: '',
        isChild: true
      }
    },
    // 查询按钮的事件！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
    getCorrectionList() {
      console.log(this.keyValue, '=============查询按钮=============')
      let params = {
        page: this.inquireForm.pagenum,
        limit: this.inquireForm.pagesize,
        subSystemId: this.inquireForm.subSystemId,
        timeDiffrentStart: this.inquireForm.timeDiffrentStart,
        timeDiffrentEnd: this.inquireForm.timeDiffrentEnd,
        deviceType: this.inquireForm.deviceType,
        rescusive: this.inquireForm.rescusive
      }
      getCorrectionList(params).then(res => {
        let result = res.data.data
        console.log(result)
        if (result == null) {
          console.log('没有数据')
          return false
        } else {
          console.log(result)
          this.tableData = result.devices
          console.log(this.tableData)
          this.total = result.count.total
          this.updatedAt = result.updatedAt
          console.log(result.devices)
            this.tableData.forEach(item => {
            console.log(item)
            if (item.timeDifferent >= this.inquireForm.timeDiffrentStart && item.timeDifferent <= this.inquireForm.timeDiffrentEnd) {
              this.tableData.rescusive = '符合'
              // this.tableData = item
              // getCorrectionList(params)
            }else{
              this.tableData.rescusive = '不符合'
              // getCorrectionList(params)
            }
          })
        }
      })
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    organizeTreeClickHandle(res) {
      console.log('02 当前点击的 机构树 --------- ', res, res.id, res.subType)
    }
  }
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
    padding: 17px 20px 0 20px;
    display: flex;
    flex-direction: column;
    .table-box {
      width: 100%;
      height: calc(~'100% - 34px');
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
            padding: 10px 0px;
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
