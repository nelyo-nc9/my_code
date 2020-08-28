
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
            <div style="width:100%;" class="mab20">
                <el-button size="mini" @click="autoGeneration">自动生成文件存档</el-button>
            </div>
            <div class="table-box" ref="tableBox">
                <div class="table-top">
                    <el-checkbox style="margin-right:12px;" v-model="isShowSubOrg">显示子机构</el-checkbox>
                    <el-button type="text" icon="el-icon-refresh" @click="getAlarmHostList">刷新列表</el-button>
                </div>
                <div style="position:absolute;top:40px;width:100%;">
                    <el-table :data="tableData" size="mini" border :height="tableHeight">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="orgName" label="所属机构"></el-table-column>
                        <el-table-column prop="keySite" label="所属重点部位" width="100"></el-table-column>
                        <el-table-column prop="deviceType" label="巡检任务名称"></el-table-column>
                        <el-table-column prop="deviceName" label="巡检人"></el-table-column>
                        <el-table-column prop="brand" label="巡检点"></el-table-column>
                        <el-table-column prop="deviceModel" label="巡检规则"></el-table-column>
                        <el-table-column prop="netModuleBrand" label="开始时间" width="100"></el-table-column>
                        <el-table-column prop="netModuleModel" label="结束时间" width="100"></el-table-column>
                        <el-table-column prop="netModuleID" label="任务下发时间" width="100"></el-table-column>
                        <el-table-column prop="keyboardPassword" label="任务状态"></el-table-column>
                        <el-table-column prop="port" label="存档状态"></el-table-column>
                        <el-table-column label="操作">
                          <template slot-scope="scope">
                            <div class="flex-row">
                              <span type="primary" @click="seeMore(scope)">查看</span>
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

export default {
  name: 'patrolQuery',
  components: {
    OrgTree
  },
  data() {
    return {
      isDropdown: true,
      tableHeight: 600,
      tableData: [
        {
          orgName: '保定分行',
          keySite: '汇融支行营业网点',
          deviceType: '每月维保任务',
          deviceName: '火警报警主机和水系统巡查检测',
          brand: '张三'
        },
        {
          orgName: '保定分行',
          keySite: '汇融支行营业网点',
          deviceType: '每月维保任务',
          deviceName: '火警报警主机和水系统巡查检测',
          brand: '张三'
        }
      ]
    }
  },
  mounted() {
    this.changeTableHeight()
    window.addEventListener('resize', this.changeTableHeight)
  },
  methods: {
    changeTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = this.$refs.tableBox.offsetHeight - 114
      })
    },
    toggle() {
      this.isDropdown = !this.isDropdown
      this.changeTableHeight()
    },
    seeMore() {
    },
    // 自动生成文档
    autoGeneration(done) {
      this.$confirm('巡检记录文件已自动生成存档文件')
        .then(_ => {
          done()
        })
        .catch(_ => {})
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
            width: 650px;
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
