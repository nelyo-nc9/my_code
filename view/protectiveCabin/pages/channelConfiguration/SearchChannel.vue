<template>
  <div class="query-box">
    <div class="content">
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>防护舱管理</el-breadcrumb-item>
          <el-breadcrumb-item>防护舱通道关联配置</el-breadcrumb-item>
          <el-breadcrumb-item class="active">查询</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="query-form">
        <div class="form-title">
          <span class="title"
                @click="toggleOpen('searchCondition')">查询条件</span>
          <i :class="dropdownStatus.searchCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </div>
        <div class="form-content"
             v-if="dropdownStatus.searchCondition">
          <el-form ref="searchModel"
                   :model="searchModel"
                   :rules="rules">
            <el-form-item label="所属机构"
                          prop='orgName'>
              <el-autocomplete class="inline-input"
                               size="mini"
                               v-model="searchModel.orgName"
                               value-key="name"
                               :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}"
                               placeholder="请输入机构"
                               :trigger-on-focus="false"
                               @select="val=>{selectItem('org', val)}"></el-autocomplete>
            </el-form-item>
            <el-form-item label="所属重点部位"
                          prop='keyPartName'>
              <el-autocomplete class="inline-input"
                               size="mini"
                               v-model="searchModel.keyPartName"
                               value-key="name"
                               :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"
                               placeholder="请输入重点部位"
                               :trigger-on-focus="false"
                               @select="val=>{selectItem('kp', val)}"></el-autocomplete>
            </el-form-item>
            <el-form-item label="防护舱通道名称"
                          prop='name'>
              <el-input v-model="searchModel.name"
                        placeholder="请输入防护舱通道名称"></el-input>
            </el-form-item>
            <el-form-item label="所属防护舱主机"
                          prop='deviceName'>
              <el-input v-model="searchModel.deviceName"
                        placeholder="请输入防护舱主机名称"></el-input>
            </el-form-item>
            <el-form-item label="防护舱通道号"
                          prop='serise'>
              <el-input v-model="searchModel.serise"
                        placeholder="请输入防护舱通道号"></el-input>
            </el-form-item>
            <el-form-item label="资产编码"
                          prop='assetCode'>
              <el-input v-model="searchModel.assetCode"
                        placeholder="请输入资产编码"></el-input>
            </el-form-item>
            <el-form-item label="关联视频通道">
              <el-select v-model="searchModel.isVideoLink">
                <el-option value=""
                           label="全部"></el-option>
                <el-option value="1"
                           label="已关联"></el-option>
                <el-option value="2"
                           label="未关联"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关联对讲通道">
              <el-select v-model="searchModel.isAudioLink">
                <el-option value=""
                           label="全部"></el-option>
                <el-option value="1"
                           label="已关联"></el-option>
                <el-option value="2"
                           label="未关联"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关联防护舱通道">
              <el-select v-model="searchModel.isCabinLink">
                <el-option value=""
                           label="全部"></el-option>
                <el-option value="1"
                           label="已关联"></el-option>
                <el-option value="2"
                           label="未关联"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关联输出通道">
              <el-select v-model="searchModel.isOutputLink">
                <el-option value=""
                           label="全部"></el-option>
                <el-option value="1"
                           label="已关联"></el-option>
                <el-option value="2"
                           label="未关联"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="录入机构"
                          prop='updatedDept'>
              <el-input v-model="searchModel.updatedDept"
                        placeholder="请输入录入机构"></el-input>
            </el-form-item>
            <el-form-item label="录入人"
                          prop='updatedBy'>
              <el-input v-model="searchModel.updatedBy"
                        placeholder="请输入设备序列号"></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker v-model="startTime"
                              type="datetime"
                              :picker-options="eventPickerStartDate"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker v-model="endTime"
                              type="datetime"
                              :picker-options="eventPickerEndDate"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="form-button"
             v-if="dropdownStatus.searchCondition">
          <el-button type="primary"
                     size="samll"
                     @click="search">查询</el-button>
          <el-button size="samll"
                     @click="reset">重置</el-button>
          <el-button size="samll"
                     @click="exportFile"
                     :disabled="tableData.length===0">导出</el-button>
        </div>
      </div>
      <div class="query-table">
        <span class="title">查询结果</span>
        <el-table stripe
                  size="medium"
                  :data="tableData"
                  @select="select"
                  @select-all="select"
                  :height="dropdownStatus.searchCondition ? '381px':'640px'"
                  max-height="805"
                  style="width: 100%">
          <el-table-column type="selection"
                           width="55"></el-table-column>
          <el-table-column label="序号"
                           type="index"
                           width="80"> </el-table-column>
          <el-table-column v-for="(column, index) in columns"
                           :key="index"
                           :prop="column.prop"
                           :label="column.label"
                           :width="column.width"
                           :sortable="column.sortable"
                           show-overflow-tooltip
                           align="center">
          </el-table-column>
        </el-table>
        <video-pagination ref="searchPagination"
                          :total="total"
                          @paginationConfChange="paginationConfChange"></video-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import { download } from '@src/common/download.js'
import { lookupApi } from '@src/http/protectiveCabin/channe.api'
import rules from '@src/assets/rules/validation/security/protectiveCabin.js'
export default {
  name: 'Search',
  components: {
    VideoPagination,
  },
  data() {
    return {
      eventPickerStartDate: {
        disabledDate: (time) => {
          if (!this.endTime) {
            return time.getTime() > Date.now() - 8.64e6
          } else {
            return time.getTime() > new Date(this.endTime).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        },
      },
      eventPickerEndDate: {
        disabledDate: (time) => {
          if (!this.startTime) {
            return time.getTime() > Date.now() - 8.64e6
          } else {
            return (
              time.getTime() < new Date(this.startTime).getTime() - 1 * 24 * 60 * 60 * 1000 ||
              time.getTime() > Date.now() - 8.64e6
            )
          }
        },
      },
      dropdownStatus: {
        searchCondition: true,
        searchResult: true,
      },
      total: 0,
      columns: [
        { prop: 'orgName', sortable: true, label: '所属机构', width: '100' },
        { prop: 'keyPartName', sortable: true, label: '所属重点部位', width: '160' },
        { prop: 'deviceName', sortable: true, label: '防护舱主机名称', width: '160' },
        { prop: 'name', sortable: true, label: '防护舱通道名称', width: '160' },
        { prop: 'serise', sortable: true, label: '防护舱通道号', width: '140' },
        { prop: 'isVideoLink', label: '关联视频通道', width: '140px', sortable: 'true' },
        { prop: 'isAudioLink', label: '关联对讲通道', width: '140px', sortable: 'true' },
        { prop: 'isOutputLink', label: '关联输出通道', width: '140px', sortable: 'true' },
        { prop: 'isCabinLink', label: '关联防护舱通道', width: '140px', sortable: 'true' },
        { prop: 'assetCode', label: '资产编码', width: '120' },
        { prop: 'updatedDept', label: '录入机构', width: '' },
        { prop: 'updatedBy', label: '录入人', width: '' },
        { prop: 'updatedAt', label: '录入时间', width: '' },
      ],
      paginationConfig: {
        limit: 25,
        page: 1,
      },
      tableData: [],
      selectedData: [],
      endTime: '',
      startTime: '',
      searchModel: {
        deviceName: '',
        assetCode: '',
        keyPartId: '',
        orgId: '',
        name: '',
        serise: '',
        isVideoLink: '',
        isOutputLink: '',
        isAudioLink: '',
        isCabinLink: '',
        updatedDept: '',
        updatedBy: '',
        updatedAt: '',
        type: '1',
        orgName: '',
        keyPartName: '',
      },
      rules: rules.channelConfiguration,
    }
  },
  methods: {
    //分页隐藏
    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },

    //重置
    reset() {
      this.searchModel = {
        deviceName: '',
        assetCode: '',
        keyPartId: '',
        orgId: '',
        name: '',
        serise: '',
        isVideoLink: '',
        isOutputLink: '',
        isAudioLink: '',
        isCabinLink: '',
        updatedDept: '',
        updatedBy: '',
        updatedAt: '',
        type: '1',
        orgName: '',
        keyPartName: '',
      }
      this.endTime = ''
      this.startTime = ''
    },

    //查询
    search() {
      this.$refs['searchModel'].validate((valid) => {
        if (valid) {
          delete this.searchModel.orgId
          delete this.searchModel.keyPartId
          let body = {
            target: 'channel',
            page: this.paginationConfig.page,
            limit: this.paginationConfig.limit,
            like: this.searchModel,
            startTime: this.startTime,
            endTime: this.endTime,
            equal: {
              serise: this.searchModel.serise,
            },
          }
          lookupApi(body).then((res) => {
            if (res.data.data) {
              res.data.data.channels.forEach((item, index) => {
                item.index = index + 1
                item.isAudioLink = item.isAudioLink == 1 ? '已关联' : '未关联'
                item.isCabinLink = item.isCabinLink == 1 ? '已关联' : '未关联'
                item.isOutputLink = item.isOutputLink == 1 ? '已关联' : '未关联'
                item.isVideoLink = item.isVideoLink == 1 ? '已关联' : '未关联'
              })
              this.tableData = res.data.data.channels
              this.total = res.data.data.count.total
            }
          })
        }
      })
    },

    //复选框
    select(s, row) {
      this.selectedData = s
      console.log(this.selectedData)
    },

    //分页
    paginationConfChange(obj) {
      this.paginationConfig = obj
    },

    //导出
    exportFile() {
      const { export_json_to_excel } = require('@src/common/vendor/Export2Excel')
      let tHeader = this.columns.map((item) => item.label)
      let filterVal = this.columns.map((item) => item.prop)
      filterVal.unshift('index')
      tHeader.unshift('序号')
      let list = this.$lodash.cloneDeep(this.selectedData)
      if (this.selectedData && this.selectedData.length > 0) {
        list.forEach((n) => {
          if (n.status) {
            if (n.status == '1') {
              n.status = '离线'
            } else if (n.status == '2') {
              n.status = '在线'
            }
          }
        })
        const data = list.map((v) => filterVal.map((j) => v[j]))
        export_json_to_excel(
          tHeader,
          data,
          `防护舱通道关联配置导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`
        )
      } else {
        let params = {
          pattern: 'inquery',
          equal: {
            ...this.searchModel,
          }, // {object} equal 查询条件中等值条件集合
          like: {
            ...this.searchModel,
          }, // {object} like 查询条件中模糊条件集合
        }
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/cabin/channel/linkage/download`
        let name = `防护舱通道关联配置导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(
          url,
          name,
          () => {},
          () => {
            this.$message({ type: 'info', message: '导出文件下载失败！' })
          },
          () => {},
          'post',
          params
        )
      }
    },

    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.searchModel.orgId : undefined,
      }
      getSearchOrgApi(params)
        .then((res) => {
          if (!res.data.data.code) {
            callback(res.data.data.orgList || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch((err) => {
          console.log(err)
          callback([])
        })
    },

    // 选中 机构/重点部位 下拉选
    selectItem(type, val) {
      if (type === 'org') {
        this.searchModel.orgId = val.id
        this.searchModel.orgName = val.name
      } else if (type === 'kp') {
        this.searchModel.keyPartId = val.id
        this.searchModel.keyPartName = val.name
      }
    },
  },
}
</script>

<style lang="less" scoped>
.query-box {
  width: 100%;
  height: 100%;
  background: #eaeef3;
  padding: 6px;
  box-sizing: border-box;
  .content {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 0 24px;
    box-sizing: border-box;
    .title {
      margin-left: 7px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      position: relative;
      cursor: pointer;
    }
    .title::before {
      content: '';
      width: 2px;
      height: 12px;
      display: block;
      background: #2d72d3;
      position: absolute;
      left: -7px;
      top: 2.5px;
    }
    .header {
      padding: 17px 0 21px;
      /deep/ .el-breadcrumb {
        font-size: 12px;
        .active {
          .el-breadcrumb__inner {
            color: #2d72d3;
          }
        }
      }
    }
    .query-form {
      margin-top: 7px;
      margin-bottom: 40px;
      .form-title {
        margin-bottom: 15px;
        i {
          color: #333;
        }
      }
      .form-content {
        width: 100%;
        background: rgba(245, 245, 245, 1);
        padding: 16px 16px 2px 16px;
        box-sizing: border-box;
        /deep/ .el-form {
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            margin-right: 23px;
            display: inline-block;
            width: 19.23%;
            margin-bottom: 15px;
            .el-form-item__label {
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              width: 96px;
            }
            .el-form-item__content {
              display: inline-block;
              width: calc(~'100% - 96px');
              .el-select {
                width: 100%;
                .el-input__inner {
                  width: 100%;
                  height: 35px;
                  border-radius: 0px;
                }
              }
              .el-autocomplete {
                width: 100%;
                .el-input__inner {
                  width: 100%;
                  height: 35px;
                  border-radius: 0px;
                }
              }
              .el-input {
                width: 100%;
                .el-input__inner {
                  width: 100%;
                  height: 35px;
                  border-radius: 0px;
                  font-size: 12px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: rgba(51, 51, 51, 1);
                }
              }
            }
          }
          .el-form-item:first-child {
            width: 17.27%;
            .el-form-item__label {
              width: 60px;
            }
            .el-form-item__content {
              width: calc(~'100% - 60px');
            }
          }
          .el-form-item:nth-child(5n) {
            margin-right: 0px;
          }
          .el-form-item:nth-child(5n + 1) {
            width: 17.27%;
            .el-form-item__label {
              width: 60px;
            }
            .el-form-item__content {
              width: calc(~'100% - 60px');
            }
          }
        }
      }
      .form-button {
        margin-top: 25px;
        text-align: center;
        .el-button {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
      }
    }
    .query-table {
      /deep/ .el-table {
        margin-top: 10px;
      }
    }
  }
}
</style>
