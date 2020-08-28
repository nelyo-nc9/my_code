
<template>
    <div class="content">
        <div class="left-tree">
            <OrgTree></OrgTree>
        </div>
        <div class="right-content">
            <div v-if="!isShowDetail && !isShowConfig && !isShowSort && !isShowMove" class="top-box">
                <header>
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
                        <el-breadcrumb-item>维保管理</el-breadcrumb-item>
                        <el-breadcrumb-item>维保任务管理</el-breadcrumb-item>
                        <el-breadcrumb-item>列表</el-breadcrumb-item>
                    </el-breadcrumb>
                </header>
                <div class="button-box">
                    <el-button size="mini" @click="addDialog = true">新建</el-button>
                    <el-button size="mini" @click="addDialog = true">编辑</el-button>
                    <el-button size="mini" @click="delList()">删除</el-button>
                    <el-button size="mini" @click="exportExcel()">导出</el-button>
                    <el-button size="mini" @click="printing()">打印</el-button>
                </div>
                <div  class="button-box">
                    <el-checkbox style="margin-right:12px;" v-model="isShowSubOrg">显示子机构</el-checkbox>
                </div>
            </div>
            <div v-if="!isShowDetail  && !isShowConfig && !isShowSort && !isShowMove" style="flex:1;" ref="tableBox">
                <el-table :data="tableData" border size="mini" stripe :height="tableHeight" ref="tableBox" @selection-change="handleSelectionChange">
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
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button @click="serverEvaluate(scope.row)" type="text">服务评价</el-button>
                          <el-button type="text" @click="seeMore(scope.row)">查看</el-button>
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
        <!-- 新增修改维保任务 -->
        <el-dialog
        title="新增修改维保任务"
        :visible.sync="addDialog"
        width="40%"
        center>
            <addMaintenance ref="addMaintenance"></addMaintenance>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="preserveParts()">保 存</el-button>
                <el-button @click="addDialog = false">取消</el-button>
            </span>
        </el-dialog>
        <!-- 任务评价 -->
        <div class="serverEva" v-show="evaModelBool">
          <service-evaluation ref="evaluation" @closeModelBox="closeModelBox"></service-evaluation>
        </div>
    </div>
</template>

<script>
import OrgTree from '../../OrgTree'
import { handleExport } from '@src/common/excel'
import addMaintenance from './addMaintenance'
import serviceEvaluation from './serviceEvaluation'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'maintenance',
  components: {
    OrgTree,
    addMaintenance,
    serviceEvaluation
  },
  data() {
    return {
      addDialog: false,
      isShowSubOrg: true, // 显示子机构
      isShowDetail: false, // 控制详情页显隐
      isShowConfig: false, // 控制 关联配置页 显隐
      isShowSort: false, // 控制 排序页
      isShowMove: false, // 控制 移动页
      tableHeight: 728,
      exportLoading: false,
      evaModelBool:false,
      tableColumn: [
        // 表格标题行内容
        {
          prop: 'orgName',
          label: '所属机构'
        }, {
          prop: 'keySite',
          label: '所属重点部位'
        }, {
          prop: 'deviceType',
          label: '维保任务名称'
        }, {
          prop: 'deviceName',
          label: '维保任务内容'
        }, {
          prop: 'code',
          label: '完成时间点'
        }, {
          prop: 'brand',
          label: '维保人员'
        }, {
          prop: 'deviceModel',
          label: '联系电话'
        }, {
          prop: 'netModuleBrand',
          label: '任务状态'
        }, {
          prop: 'netModuleModel',
          label: '维保状态'
        }
      ],
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
  watch: {
  },
  created() {
  },
  computed: {
    ...mapState('fireOperationManagement', {
      componentStatus: 'componentStatus'
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  mounted() {
    window.addEventListener('resize', this.resizeFun)
    this.$nextTick(() => {
      this.resizeFun()
    })
  },
  methods: {
    resizeFun() {
      this.$refs.tableBox && (this.tableHeight = this.$refs.tableBox.offsetHeight - 32)
    },
    handleSelectionChange(val) {
      this.fireSelection = val
    },
    //服务评价
    serverEvaluate(row){
      this.evaModelBool = true;
    },
    //关闭子组件弹窗
    closeModelBox(){
       this.evaModelBool = false;
    },
    //查看
    seeMore(row){

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
        let filename = '维保任务管理列表'
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
            .button-box {
                margin: 12px 0;
            }
        }
        .serverEva{
          width: 100%;
          height: 90vh;
          background: #fff;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 333;
        }
    }
</style>
