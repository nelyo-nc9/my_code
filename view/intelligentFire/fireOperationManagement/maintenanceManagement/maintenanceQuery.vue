
<template>
    <div class="content">
        <div class="left-tree">
            <OrgTree></OrgTree>
        </div>
        <div class="right-content">
            <header class="mab20">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
                    <el-breadcrumb-item>报警管理</el-breadcrumb-item>
                    <el-breadcrumb-item>报警主机配置</el-breadcrumb-item>
                    <el-breadcrumb-item>查询</el-breadcrumb-item>
                </el-breadcrumb>
            </header>
            <div style="width:100%;">
                <div v-show="isDropdown" class="form-box mab20">
                    <el-form :model="formData" label-position="right" label-width="110px" size="mini" inline>
                        <el-form-item label="所属机构">
                            <el-select v-model="formData.orgName"></el-select>
                        </el-form-item>
                        <el-form-item label="设备类型">
                            <el-select v-model="formData.deviceType"></el-select>
                        </el-form-item>
                        <el-form-item label="维保任务名称">
                            <el-select v-model="formData.orgName"></el-select>
                        </el-form-item>
                        <el-form-item label="维保人">
                            <el-select v-model="formData.orgName"></el-select>
                        </el-form-item>
                        <el-form-item label="维保人联系电话">
                            <el-select v-model="formData.orgName"></el-select>
                        </el-form-item>
                        <el-form-item label="任务状态">
                            <el-select v-model="formData.orgName"></el-select>
                        </el-form-item>
                        <el-form-item label="开始时间">
                            <el-date-picker
                              v-model="formData.time"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="维保内容">
                            <el-select v-model="formData.orgName"></el-select>
                        </el-form-item>
                    </el-form>
                    <div style="width:100%;text-align:center;position:absolute;bottom:5px;">
                        <el-button size="mini" type="primary">查询</el-button>
                        <el-button size="mini">重置</el-button>
                        <el-button size="mini" @click="exportExcel()">导出</el-button>
                    </div>
                </div>
            </div>
            <div class="table-box" ref="tableBox">
                <div class="box-title">查询结果</div>
                <div style="position:absolute;top:85px;width:100%;">
                    <el-table :data="tableData" size="mini" border :height="tableHeight" ref="tableBox" @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="orgName" label="所属机构"></el-table-column>
                        <el-table-column prop="keySite" label="所属重点部位"></el-table-column>
                        <el-table-column prop="deviceType" label="维保任务名称"></el-table-column>
                        <el-table-column prop="deviceName" label="维保任务内容"></el-table-column>
                        <el-table-column prop="code" label="完成时间点"></el-table-column>
                        <el-table-column prop="brand" label="维保人员"></el-table-column>
                        <el-table-column prop="deviceModel" label="联系电话"></el-table-column>
                        <el-table-column prop="netModuleBrand" label="任务状态" width="100"></el-table-column>
                        <el-table-column prop="netModuleModel" label="维保状态" width="100"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                            <div class="flex-row">
                                <span @click="" class="mar20">服务评价</span>
                            </div>
                            </template>
                        </el-table-column>
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
import OrgTree from '../../OrgTree'
import { handleExport } from '@src/common/excel'
import { mapMutations } from 'vuex'
export default {
  name: 'maintenanceQuery',
  components: {
    OrgTree
  },
  data() {
    return {
      isDropdown: true,
      tableHeight: 200,
      formData: {
        // 查询条件字段
        time: '',
        orgName: '',
        deviceType: '',
        code: '',
        deviceModel: '',
        netModuleModel: '',
        ip: '',
        service: '',
        detectorNo: '',
        subsystemNo: '',
        keySite: '',
        deviceName: '',
        brand: '',
        netModuleBrand: '',
        netModuleID: '',
        port: '',
        domain: '',
        outputNo: ''
      },
      tableData: [
        {
          orgName: '保定分行',
          keySite: '汇融支行营业网点',
          deviceType: '每月维保任务',
          deviceName: '火警报警主机和水系统巡查检测',
          code: '2020-05-12',
          brand: '张三',
          deviceModel: '157271627162',
          netModuleBrand: '进行中',
          netModuleModel: '服务中'
        },
        {
          orgName: '保定分行',
          keySite: '汇融支行营业网点',
          deviceType: '每月维保任务',
          deviceName: '火警报警主机和水系统巡查检测',
          code: '2020-05-12',
          brand: '张三',
          deviceModel: '157271627162',
          netModuleBrand: '进行中',
          netModuleModel: '服务中'
        }
      ],
      fireSelection: []
    }
  },
  mounted() {
    this.changeTableHeight()
    window.addEventListener('resize', this.changeTableHeight)
  },
  created() {
  },
  methods: {
    ...mapMutations('fireOperationManagement', {
      SET_COMPONENT_ID: 'SET_COMPONENT_ID'
    }),
    changeTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = this.$refs.tableBox.offsetHeight - 114
      })
    },
    toggle() {
      this.isDropdown = !this.isDropdown
      this.changeTableHeight()
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
        let filename = '维保任务执行列表'
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
        height: 100%;
        position: relative;
        font-size: 14px;
        margin: 0 10px;
        display: flex;
        flex-direction: column;
        width: 100%;
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
            .button-box {
                margin: 12px 0;
            }
        }
        .box-title {
            position: relative;
            height: 24px;
            line-height: 24px;
            color: #606266;
            margin: 10px 0;
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
        .pointer {
            cursor: pointer;
            display: inline-block;
            width: 120px;
        }
        .form-box {
            // width: 650px;
            position: relative;
            display: flex;
            justify-content: space-between;
            padding: 10px 10px 26px;
            border: 1px solid #E1E1E1;
        }
        .table-box {
            position: relative;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
    }
</style>
