<!--
 * @Author: shikai
 * @Date: 2020-07-10 01:05:10
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-16 19:21:47
-->
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
                        <el-breadcrumb-item>消防系统管理</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ sidebarActive }}</el-breadcrumb-item>
                        <el-breadcrumb-item>导入</el-breadcrumb-item>
                    </el-breadcrumb>
                </header>
                <div class="button-box flex-row">
                    <div class="voice-upload">
                        <el-upload
                            action=""
                            :on-preview="handlePreview"
                            :on-exceed="handleExceed"
                            :before-upload="beforeAvatarUpload"
                            :on-change="handleAvatarSuccess"
                            :limit="1"
                            :auto-upload="false"
                            :show-file-list="false">
                            <el-input v-model="voiceValue.name" placeholder="未选择任何文件" size="mini" style="margin-right:20px;"></el-input>
                        </el-upload>
                    </div>
                    <div>
                        <el-button type="primary" size="mini" @click="importData">导入</el-button>
                        <el-button size="mini" @click="">充值</el-button>
                        <el-button size="mini" @click="">覆盖</el-button>
                        <el-button type="primary" size="mini" @click="">保存</el-button>
                        <el-button size="mini" @click="skipToList">关闭</el-button>
                    </div>
                </div>
            </div>
            <div class="table-box">
                <div class="box-title mab20">导入设备列表</div>
                <div style="flex:1;" ref="tableBox">
                        <el-table ref="fireList" :data="tableData" border size="mini" :stripe="true" :height="tableHeight" @row-click="showDetail" @selection-change="handleSelectionChange">
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
            </div>
        </div>
    </div>
</template>

<script>
import OrgTree from '../../../OrgTree'
import { handleImport } from '@src/common/excel'
import {
  mapMutations,
  mapActions,
  mapState
} from 'vuex'
export default {
  name: 'fireFightingList',
  components: {
    OrgTree
  },
  data() {
    return {
      status: '全部',
      isShowSubOrg: true,
      tableHeight: 'auto',
      moveDialog: false,
      voiceValue: '',
      tableColumn: [
      // 表格标题行内容
        {
          prop: 'orgName',
          label: '所属机构',
          width: '100'
        }, {
          prop: 'keySite',
          label: '所属部位',
          width: '100'
        }, {
          prop: 'deviceType',
          label: '设备名称',
          width: '120'
        }, {
          prop: 'deviceName',
          label: '设备位置',
          width: '100'
        }, {
          prop: 'deviceDepar',
          label: '资产编码',
          width: '100'
        }, {
          prop: 'code',
          label: '设备厂家',
          width: '100'
        }, {
          prop: 'brand',
          label: '设备型号',
          width: '100'
        }, {
          prop: 'deviceModel',
          label: '设备标签',
          width: '100'
        }, {
          prop: 'netModuleBrand',
          label: '设备有效期',
          width: '100'
        }, {
          prop: 'netModuleModel',
          label: '标签编码',
          width: '100'
        }, {
          prop: 'netModuleID',
          label: '生产日期',
          width: '100'
        }, {
          prop: 'keyboardPassword',
          label: '状态',
          width: '100'
        }, {
          prop: 'ip',
          label: '录入人',
          width: '100'
        }, {
          prop: 'port',
          label: '录入机构',
          width: '80'
        }, {
          prop: 'userName',
          label: '录入时间',
          width: '80'
        }
      ],
      tableData: [{
        orgName: '创业路支行',
        keySite: '创业路营业网点',
        deviceType: '火警报警系统-营业网点'
      }, {
        orgName: '创业路支行',
        keySite: '创业路营业网点',
        deviceType: '火警报警系统-营业网点'
      }],
      activeData: null,
      isShowDetail: 'list',
      fireSelection: [],
      newData: []
    }
  },
  created() {
    this.closeDetail()
    this.getAlarmHostList()
  },
  mounted() {
    window.addEventListener('resize', this.resizeFun)
    this.$nextTick(() => {
      this.resizeFun()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  watch: {
    sidebarActive: function(newVale, oldValue) {
      if (newVale) {
        this.closeDetail()
      }
    }
  },
  computed: {
    ...mapState('equipmentManagement', {
      sidebarActive: 'sidebarActive'
    })
  },
  methods: {
    ...mapMutations('equipmentManagement', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE'
    }),
    ...mapActions(['getAlarmHost']),
    skipTo(data) {
      if (data === 'Add') {
        this.SET_IS_NEW_FILE('fireFightingSubsystemManagement')
      } else if (data === 'edit') {
        this.SET_IS_NEW_FILE('fireFightingSubsystemManagement')
      }
    },
    // 跳转到列表页
    skipToList() {
      this.SET_IS_NEW_FILE('fireFightingList')
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
      this.isShowDetail = 'detail'
    },
    closeDetail() {
      this.isShowDetail = 'list'
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
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {},
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {},
    // 格式限制
    beforeAvatarUpload(file) {
      const isWav = file.type === 'audio/wav'
      if (!isWav) {
        this.$message.error('上传文件格式只能是WAV格式!')
      }
      return isWav
    },
    // 上传成功
    handleAvatarSuccess(file, fileList) {
      let obj = {}
      this.tableColumn.map(n => {
        Object.assign(obj, {[n.label]: n.prop})
      })
      handleImport(file, obj, (data) => {
        this.newData = data
      })
      this.voiceValue = file
    },
    // 导入数据
    importData(event) {
      this.tableData = [...this.newData, ...this.tableData]
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
        .box-title {
            position: relative;
            height: 24px;
            line-height: 24px;
            color: #606266;
            i {
                position: absolute;
                top: 50%;
                left: 100px;
                transform: translateY(-50%);
            }
            &::after {
                display: block;
                content: '';
                border-top: 1px solid #e1e1e1;
                width: calc(~'100% - 120px');
                margin-left: 120px;
                margin-top: -12px;
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
