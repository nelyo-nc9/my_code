<!--
 * @Author: your name
 * @Date: 2020-06-05 16:58:05
 * @LastEditTime: 2020-07-01 16:11:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\dutyManagement\admin\pages\checkLogModel.vue
-->
<template>
  <div class="check-log-model">
    <!-- 检查记录详情弹框 -->
        <div class="check-log"  v-if="checkLogDialogVisible">
          <el-dialog :visible.sync="checkLogDialogVisible" class="check-log-dialog" width= '706px' :before-close="checkLogHandleClose">
            <div slot="title" class="dialog-title" style="height:35px;line-height:35px;font-size:16px;">
              <div style="float:left;width:100%;">
                <span>检查记录</span>
                <div style="float:right;margin-right:30px;font-size:16px;cursor: pointer;" v-print="'#contentinfo'">
                  <span title="打印" class="el-icon-printer"></span>
                </div>
                <div style="width:100%;margin-top:5px;display: flex;">
                  <div style="width:100px;font-size:14px;">
                    今日检查记录
                  </div>
                  <div style="width:80%;">
                    <hr style="color:#333;position:relative;top:18px;left:7px;width:100%;">
                  </div>
                </div>
                <div style="height:35px;width:100%;line-height:35px;font-size:16px;cursor: pointer;" @click="deleteCheckLog">
                  <span class="el-icon-delete" title="全部删除" style="float:right;"></span>
                </div>
              </div>
            </div>
            <div id="contentinfo">
              <el-table :data="checkLogDetailsTableData" height="250" @selection-change="handleSelectionChange" stripe style="width: 100%"></el-table-column>
              <el-table-column type="selection" width="" align="center"></el-table-column>
              <el-table-column type="index" label="序号" width="" align="center"></el-table-column>
              <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label" :width="column.width" :sortable="column.sortable" show-overflow-tooltip align="center">
              </el-table-column>
              <el-table-column label="操作" width="" align="center">
                <template slot-scope="scope">
                  <i  @click="checkLogDetailsHandleClick(scope.row)" title="查看" :class="[scope.row.event === '抓图' ? 'el-icon-picture-outline' : 'el-icon-video-camera']" class="button"></i>
                  <i @click="deleteCheckLogHandleClick(scope.row)"  title="删除" class="el-icon-delete button"></i>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top:5px;display: flex;">
              <div style="width:100px;font-size:14px;">
                记录处理
              </div>
              <div style="width:590px;">
                <hr style="color:#333;position:relative;top:12px;left:3px;width:100%;">
              </div>
            </div>
            <div class="record-processing">
              <el-form ref="form" :model="recordProcessingForm" label-width="80px">
                <el-row>
                    <el-col :span="11" style="margin-top:10px;">
                      <el-form-item label="值班员">
                        <el-input v-model="recordProcessingForm.username" readonly></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col style="margin-top:10px;" :span="11">
                      <el-form-item label="检查类型">
                        <el-input v-model="recordProcessingForm.event" readonly></el-input>
                      </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                      <el-form-item label="检查项目">
                        <el-input v-model="recordProcessingForm.project" readonly></el-input>
                      </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                  <el-col :span="22">
                    <el-form-item label="内容描述">
                      <el-input type="textarea" resize="none" v-model="recordProcessingForm.desc" readonly></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-col :span="11" style="margin-top:10px;">
                    <el-form-item label="填写单位">
                      <el-input v-model="recordProcessingForm.updatedDept" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col style="margin-top:10px;" :span="11">
                    <el-form-item label="填写时间">
                      <el-input v-model="recordProcessingForm.updatedAt" readonly></el-input>
                    </el-form-item>
                </el-col>
              </el-form>
            </div>
            </div>
          </el-dialog>
        </div>
        <!-- 查看图片详情弹窗 -->
        <checkLogScreenShot @closeScreenshot="closeScreenshot" :screenShotVisible="screenShotVisible"></checkLogScreenShot>
  </div>
</template>

<script>
import Bus from '../common/Bus'
import { deleteChecklogApi } from '@src/http/dutyManagement/dutyManagement.api'
import checkLogScreenShot from './checkLogScreenShot'
export default {
  name: 'checkLogModel',
  components: {
    checkLogScreenShot
  },
  data() {
    return {
      columns: [
        { prop: 'org', sortable: true, label: '机构', width: '' },
        { prop: 'keyPart', sortable: true, label: '重点部位', width: '' },
        { prop: 'channelName', sortable: true, label: '镜头', width: '' },
        { prop: 'action', sortable: true, label: '检查动作', width: '' },
        { prop: 'time', sortable: true, label: '记录时间', width: '' }
      ],
      // 表单label宽度
      formLabelWidth: '80px',
      // 检查记录详情弹窗
      checkLogDialogVisible: false,
      screenShotVisible: false,
      // 检查记录弹窗表单数据
      recordProcessingForm: {
      },
      // 检查记录xi详情表格数据
      checkLogDetailsTableData: [
      ],
      selectData: []
    }
  },
  created() {
  },
  mounted() {
    Bus.$on('checkLogTable', (e, data) => {
      this.checkLogDialogVisible = e
      this.recordProcessingForm = JSON.parse(JSON.stringify(data))
      this.checkLogDetailsTableData[0] = JSON.parse(JSON.stringify(data))
    })
  },
  methods: {
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(this.selectData, '列表勾选')
    },
    deleteCheckLog() {
      if (!this.selectData.length) { return }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        this.selectData.forEach(item => {
          ids.push(item.id)
        })
        let param = {
          ids: ids.join(',')
        }
        this.deleteChecklogApiFuc(param)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    closeScreenshot() {
      this.screenShotVisible = false
    },
    /**
     * @description:  检查记录弹窗右上角关闭按钮
     * @param {无}
     * @return: 无
     */
    checkLogHandleClose() {
      this.checkLogDialogVisible = false
    },
    /**
     * @description:  检查记录详情弹窗中的查看按钮
     * @param {无}
     * @return: 无
     */
    checkLogDetailsHandleClick(row) {
      if (row.event === '抓图') {
        this.screenShotVisible = true
      } else if (row.event === '紧急录像') {
        console.log('这里放视频组件')
      }
    },
    deleteChecklogApiFuc(ids) {
      deleteChecklogApi(ids).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('删除成功')
          this.checkLogDetailsTableData = []
          this.recordProcessingForm = {}
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * @description:  检查记录详情弹窗删除按钮
     * @param {无}
     * @return: 无
     */
    deleteCheckLogHandleClick(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          ids: row.id
        }
        this.deleteChecklogApiFuc(param)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
.check-log-model {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  .button {
    font-size: 18px;
    cursor: pointer;
    color: cornflowerblue;
  }
}
/deep/.el-dialog {
  height: 680px!important;
  min-height: 680px;
}
/deep/.el-dialog__header {
  padding: 14px 20px 10px;
}
</style>
