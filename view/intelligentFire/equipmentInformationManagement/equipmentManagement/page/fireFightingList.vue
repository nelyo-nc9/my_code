<template>
    <div class="content">
        <div class="left-tree">
            <OrgTree></OrgTree>
        </div>
        <div class="right-content">
            <div class="top-box">
                <header>
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
                        <el-breadcrumb-item>消防设备管理</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ sidebarActive }}</el-breadcrumb-item>
                        <el-breadcrumb-item>列表</el-breadcrumb-item>
                    </el-breadcrumb>
                </header>
                <div class="button-box">
                    <el-button size="mini" @click="skipTo('fireFightingSubsystemManagement')">新建</el-button>
                    <el-button size="mini" @click="skipTo('fireFightingSubsystemManagement')">修改</el-button>
                    <el-button size="mini" @click="delList()">删除</el-button>
                    <el-button size="mini" @click="moveDialog = true">迁移</el-button>
                    <el-button size="mini" @click="skipTo('assessmentRanking')">查询</el-button>
                    <el-button size="mini" @click="isShowContent = 'transfer'">排序</el-button>
                    <el-button size="mini" @click="skipTo('importList')">导入</el-button>
                    <el-button size="mini" @click="exportExcel()">导出</el-button>
                    <el-button size="mini" @click="printing()">打印</el-button>
                </div>
            </div>
            <div class="table-box">
                <div class="table-top flex-between mab20">
                    <div>
                        <el-checkbox style="margin-right:12px;" v-model="isShowSubOrg">显示子机构</el-checkbox>
                        <el-button type="text" icon="el-icon-refresh" @click="getAlarmHostList">刷新列表</el-button>
                    </div>
                    <div class="flex-between">
                        <div class="label mar10">重点部位</div>
                        <el-select class="wth120 mar20" v-model="status" size="mini">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="营业网点" value="营业网点"></el-option>
                            <el-option label="办公楼" value="办公楼"></el-option>
                            <el-option label="自助银行" value="自助银行"></el-option>
                        </el-select>
                        <div class="label mar10">设备分类</div>
                        <el-select class="wth120 mar20" v-model="status" size="mini">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="启用中" value="启用中"></el-option>
                            <el-option label="已停用" value="已停用"></el-option>
                        </el-select>
                        <div class="label mar10">关联系统</div>
                        <el-select class="wth120 mar20" v-model="status" size="mini">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="启用中" value="启用中"></el-option>
                            <el-option label="已停用" value="已停用"></el-option>
                        </el-select>
                        <div class="label mar10">关联部件</div>
                        <el-select class="wth120 mar20" v-model="status" size="mini">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="启用中" value="启用中"></el-option>
                            <el-option label="已停用" value="已停用"></el-option>
                        </el-select>
                        <el-input suffix-icon="el-icon-search" style="width:200px;" size="mini"></el-input>
                    </div>
                </div>
                <div v-if="isShowContent === 'list'" style="flex:1;" ref="tableBox">
                    <el-table ref="fireList" :data="tableData" border size="mini" stripe :height="tableHeight" @row-click="showDetail" @selection-change="handleSelectionChange">
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
                            style="text-align:right;"
                            :page-sizes="[25, 50, 100, 200]"
                            :page-size="100"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="400"
                    ></el-pagination>
                </div>
                <div v-if="isShowContent === 'detail'" style="flex:1;width: 800px;text-align:center;">
                    <div>{{ sidebarActive }}详情</div>
                    <div class="detail-box">
                        <div class="detail-item">
                            <div class="item-left">所属子系统</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">所属机构</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">所属重点部位</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">设备类型</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">设备名称</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">资产编码</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">设备品牌</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">设备型号</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">网络模块品牌</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">网络模块类型</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">网络模块ID</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">键盘密码</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">IP地址</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">网络端口</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">所属服务</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">网域</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">探测器数量</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">输出通道数量</div>
                            <div class="item-right">{{activeData.orgName}}</div>
                        </div><div class="detail-item">
                        <div class="item-left">子系统数量</div>
                        <div class="item-right">{{activeData.orgName}}</div>
                    </div>
                    </div>
                    <div class="detail-bottom">
                        <div class="detail-item">
                            <div class="item-left">录入时间</div>
                            <div class="item-right">{{activeData.createdAt}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">录入机构</div>
                            <div class="item-right">{{activeData.createdDept}}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-left">录入人</div>
                            <div class="item-right">{{activeData.createdBy}}</div>
                        </div>
                    </div>
                    <div class="detail-footer">
                        <el-button type="primary" size="mini">打印</el-button>
                        <el-button size="mini" @click="closeDetail">关闭</el-button>
                    </div>
                </div>
                <transfer @goBack="isShow" v-if="isShowContent === 'transfer'"></transfer>
                <exportList @goBack="isShow" v-if="isShowContent === 'exportList'"></exportList>
            </div>
        </div>
        <!-- 迁移组件 -->
        <el-dialog
        title="移动设备"
        :visible.sync="moveDialog"
        width="30%"
        center>
            <mobileDevices ref="addParts"></mobileDevices>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="preserveParts()">保 存</el-button>
                <el-button @click="moveDialog = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import OrgTree from '../../../OrgTree'
import mobileDevices from './mobileDevices'
import transfer from './transfer'
import exportList from './exportList'
import { handleExport } from '@src/common/excel'
import {
  mapMutations,
  mapActions,
  mapState
} from 'vuex'
export default {
  name: 'fireFightingList',
  components: {
    OrgTree,
    mobileDevices,
    transfer,
    exportList
  },
  data() {
    return {
      status: '全部',
      isShowSubOrg: true,
      tableHeight: 688,
      moveDialog: false,
      tableColumn: [
      // 表格标题行内容
        {
          prop: 'orgName',
          label: '所属机构',
          width: '100'
        }, {
          prop: 'keySite',
          label: '所属重点部位',
          width: '100'
        }, {
          prop: 'deviceType',
          label: '设备类型',
          width: '120'
        }, {
          prop: 'deviceName',
          label: '设备名称',
          width: '100'
        }, {
          prop: 'code',
          label: '资产编码',
          width: '100'
        }, {
          prop: 'brand',
          label: '设备品牌',
          width: '100'
        }, {
          prop: 'deviceModel',
          label: '设备型号',
          width: '100'
        }, {
          prop: 'netModuleBrand',
          label: '网络模块品牌',
          width: '100'
        }, {
          prop: 'netModuleModel',
          label: '网络模块类型',
          width: '100'
        }, {
          prop: 'netModuleID',
          label: '网络模块ID',
          width: '100'
        }, {
          prop: 'keyboardPassword',
          label: '键盘密码',
          width: '100'
        }, {
          prop: 'ip',
          label: 'IP地址',
          width: '100'
        }, {
          prop: 'port',
          label: '网络端口',
          width: '80'
        }, {
          prop: 'userName',
          label: '用户名',
          width: '80'
        }, {
          prop: 'password',
          label: '密码',
          width: '80'
        }, {
          prop: 'service',
          label: '所属服务',
          width: '100'
        }, {
          prop: 'domain',
          label: '网域',
          width: '100'
        }, {
          prop: 'detectorNo',
          label: '探测器数量',
          width: '60'
        }, {
          prop: 'outputNo',
          label: '输出通道数量',
          width: '60'
        }, {
          prop: 'subsystemNo',
          label: '子系统数量',
          width: '60'
        }, {
          prop: 'state',
          label: '状态',
          width: '80'
        }, {
          prop: 'createdBy',
          label: '录入人',
          width: '100'
        }, {
          prop: 'createdDept',
          label: '录入机构',
          width: '100'
        }, {
          prop: 'createdAt',
          label: '录入时间',
          width: '120'
        }
      ],
      tableData: [
        // 列表数据
        {
          orgName: '创业路支行',
          keySite: '创业路营业网点',
          deviceType: '火灾自动报警'
        }, {
          orgName: '创业路支行',
          keySite: '创业路营业网点',
          deviceType: '火灾自动报警'
        }
      ],
      activeData: {
        orgName: '',
        keySite: ''
      },
      fireSelection: []
    }
  },
  created() {
    this.getAlarmHostList()
  },
  mounted() {
    window.addEventListener('resize', this.resizeFun)
    this.$nextTick(() => {
      this.resizeFun()
    })
  },
  computed: {
    ...mapState('equipmentManagement', {
      sidebarActive: 'sidebarActive',
      isShowContent: 'isShowContent'
    })
  },
  watch: {
    sidebarActive: function(newVale, oldValue) {
      if (newVale) {
        this.closeDetail()
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  methods: {
    ...mapMutations('equipmentManagement', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE',
      SET_SHOW_CONTENT: 'SET_SHOW_CONTENT'
    }),
    ...mapActions(['getAlarmHost']),
    skipTo(data) {
      this.SET_IS_NEW_FILE(data)
      // if (data === 'Add') {
      //     this.SET_IS_NEW_FILE('fireFightingSubsystemManagement')
      // } else if (data === 'edit') {
      //     this.SET_IS_NEW_FILE('fireFightingSubsystemManagement')
      // } else if (data === 'importList') {
      //     this.SET_IS_NEW_FILE('importList')
      // }
    },
    resizeFun() {
      this.tableHeight = this.$refs.tableBox.offsetHeight - 32
    },
    getAlarmHostList() {
      // this.getAlarmHost().then(res => {
      //   const result = res.data.data.results
      //   Array.isArray(result) && result.forEach(item => {
      //     item.createdAt = this.$moment(item.createdAt).format('YYYY-MM-DD hh:mm:ss')
      //   })
      //   this.tableData = result
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    showDetail(row) {
      this.activeData = row
      this.SET_SHOW_CONTENT('detail')
    },
    closeDetail() {
      this.SET_SHOW_CONTENT('list')
    },
    handleSelectionChange(val) {
      this.fireSelection = val
    },
    // 删除列表
    delList(done) {
      if (this.fireSelection.length) {
        this.$confirm('确认删除信息？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      } else {
        this.$message.error('请选择要删除信息!')
      }
    },
    isShow(data) {
      this.SET_SHOW_CONTENT(data)
    },
    // 导出excel
    exportExcel() {
      if (this.fireSelection.length) {
        // 有数据走前端导出
        let tHeader = []
        let filterVal = []
        this.tableColumn.map(n => {
          tHeader.push(n.label)
          filterVal.push(n.prop)
        })
        let filename = this.sidebarActive
        handleExport(tHeader, filterVal, filename, this.fireSelection)
      } else {
        // 无数据走接口
      }
    },
    // 打印
    async printing() {
      await this.$nextTick(() => {
        this.$print(this.$refs.tableBox)
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .content {
        width: 100%;
        height: 100%;
        position: relative;
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
            .top-box {
                .button-box {
                    margin: 12px 0;
                }
            }
            .table-box {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
        }
        .detail-box,
        .detail-bottom {
            color: #666;
            width: 100%;
            padding: 8px;
            border: 1px solid #F2F2F2;
            display: flex;
            flex-wrap: wrap;
            margin-top: 24px;
            .detail-item {
                display: flex;
                width: 50%;
                height: 32px;
                line-height: 32px;
                .item-left {
                    width: 100px;
                    background: #F8F8F8;
                    border: 1px solid #fff;
                }
                .item-right {
                    flex: 1;
                    border: 1px solid #F8F8F8;
                    border-left: none;
                }
            }
        }
        .detail-bottom {
            .detail-item {
                width: 33.33%;
            }
        }
        .detail-footer {
            margin-top: 24px;
        }
    }
    .el-button--text {
        color: #606266;
        &:hover {
            color: #66b1ff;
        }
    }
</style>
