<template>
  <div class="search-box">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>视频管理</el-breadcrumb-item>
        <el-breadcrumb-item>报警输入关联配置</el-breadcrumb-item>
        <el-breadcrumb-item class="active">查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-container">
      <div class="conditions-box">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('searchCondition')">
            查询条件
            <i :class="dropdownStatus.searchCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropdownStatus.searchCondition">
          <div class="form-box">
            <!--  -->
            <div class="condition-box">
              <div class="query-form">
                <el-form :rules="checkForm" ref="videoHostIOModel" :model="videoHostIOModel">
                  <el-form-item label="所属机构" prop="orgName">
                    <el-autocomplete
                      class="inline-input"
                      size="mini"
                      v-model="orgName"
                      value-key="name"
                      :fetch-suggestions="
                        (val, callback) => {
                          querySearch('org', val, callback)
                        }
                      "
                      placeholder="请输入所属机构"
                      :trigger-on-focus="false"
                      @select="
                        val => {
                          selectItem('org', val)
                        }
                      "
                    ></el-autocomplete
                  ></el-form-item>
                  <el-form-item label="所属重点部位" prop="keyPartName">
                    <el-autocomplete
                      class="inline-input"
                      size="mini"
                      :disabled="!videoHostIOModel.orgId"
                      v-model="keyPartName"
                      value-key="name"
                      :fetch-suggestions="
                        (val, callback) => {
                          querySearch('kp', val, callback)
                        }
                      "
                      placeholder="请输入所属重点部位"
                      :trigger-on-focus="false"
                      @select="
                        val => {
                          selectItem('kp', val)
                        }
                      "
                    ></el-autocomplete
                  ></el-form-item>
                  <el-form-item label="所属设备" prop="deviceName">
                    <el-input type="text" v-model="videoHostIOModel.deviceName" placeholder="请输入所属设备"></el-input
                  ></el-form-item>
                  <el-form-item label="资源名称" prop="name">
                    <el-input type="text" v-model="videoHostIOModel.name" placeholder="请输入资源名称"></el-input>
                  </el-form-item>
                  <el-form-item label="资源类型" prop="class">
                    <el-select v-model="videoHostIOModel.class">
                      <el-option v-for="item in deviceTypes" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="品牌" prop="brand">
                    <el-select v-model="videoHostIOModel.brand">
                      <el-option
                        v-for="item in brands"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value || item.label"
                      >
                      </el-option> </el-select
                  ></el-form-item>
                  <el-form-item label="型号" prop="modelNum">
                    <el-select v-model="videoHostIOModel.modelNum">
                      <el-option v-for="item in models" :key="item.value" :label="item.label" :value="item.value">
                      </el-option> </el-select
                  ></el-form-item>
                  <el-form-item label="资产编码" prop="assetCode">
                    <el-input type="text" v-model="videoHostIOModel.assetCode" placeholder="请输入资产编码"></el-input>
                  </el-form-item>
                  <el-form-item label="状态" prop="status">
                    <el-select v-model="videoHostIOModel.status">
                      <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="录入机构" prop="updatedDept">
                    <el-input type="text" v-model="videoHostIOModel.updatedDept" placeholder="请输入录入机构"></el-input
                  ></el-form-item>
                  <el-form-item label="录入人" prop="updatedBy">
                    <el-input type="text" v-model="videoHostIOModel.updatedBy" placeholder="请输入录入人"></el-input
                  ></el-form-item>
                  <el-form-item label="录入时间" prop="">
                    <el-date-picker
                      v-model="videoHostIOModel.updatedAt"
                      type="datetimerange"
                      :editable="false"
                      :clearable="false"
                      size="mini"
                      format="yyyy-MM-dd HH:mm:ss"
                      align="center"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-form>
              </div>
              <div class="opt-button">
                <el-button type="primary" size="samll" @click="search">查询</el-button>
                <el-button size="samll" @click="reset">重置</el-button>
                <el-button icon="icon iconfont-ccb ccbdaochu1 el-icon-" size="samll" @click="exportFile">导出</el-button>
              </div>
            </div>
            <!--  -->

            <!-- <div class="form-content">
              <div class="form-content-item">
                <div class="item-label">所属机构</div>
                <div class="item-box">
                  <el-autocomplete class="inline-input" size="mini" v-model="orgName" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构" :trigger-on-focus="false" @select="val=>{selectItem('org', val)}"></el-autocomplete>
                </div>
              </div>
              <div class="form-content-item">
                <div class="item-label">所属重点部位</div>
                <div class="item-box">
                  <el-autocomplete class="inline-input" size="mini" :disabled="!videoHostIOModel.orgId" v-model="keyPartName" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"  placeholder="请输入重点部位" :trigger-on-focus="false" @select="val=>{selectItem('kp', val)}"></el-autocomplete>
                </div>
              </div>
              <div class="form-content-item">
                <div class="item-label">所属设备</div>
                <div class="item-box">
                  <el-input type="text" v-model="videoHostIOModel.deviceName"></el-input>
                </div>
              </div>
              <div class="form-content-item">
                <div class="item-label">资源名称</div>
                <div class="item-box">
                  <el-input type="text" v-model="videoHostIOModel.name"></el-input>
                </div>
              </div>
              <div class="form-content-item">
                <div class="item-label">资源类型</div>
                <div class="item-box">
                  <el-select v-model="videoHostIOModel.class">
                     <el-option
                      v-for="item in deviceTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="form-content-item">
                <div class="item-label">品牌</div>
                <div class="item-box">
                  <el-select v-model="videoHostIOModel.brand">
                    <el-option
                      v-for="item in brands"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value || item.label">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="form-content-item">
                <div class="item-label">型号</div>
                <div class="item-box">
                  <el-select v-model="videoHostIOModel.modelNum">
                    <el-option
                      v-for="item in models"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="form-content-item">
                <div class="item-label">资产编码</div>
                <div class="item-box">
                  <el-input type="text" v-model="videoHostIOModel.assetCode"></el-input>
                </div>
              </div>
              <div class="form-content-item">
                <div class="item-label">状态</div>
                <div class="item-box">
                  <el-select v-model="videoHostIOModel.status">
                    <el-option
                      v-for="item in statusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="form-content-item">
                <div class="item-label">录入机构</div>
                <div class="item-box">
                  <el-input type="text" v-model="videoHostIOModel.updatedDept"></el-input>
                </div>
              </div>
               <div class="form-content-item">
                <div class="item-label">录入人</div>
                <div class="item-box">
                  <el-input type="text" v-model="videoHostIOModel.updatedBy"></el-input>
                </div>
              </div>
               <div class="form-content-item">
                <div class="item-label">录入时间</div>
                <div class="item-box">
                  <el-date-picker
                    v-model="videoHostIOModel.updatedAt"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </div>
              </div>
            </div> -->
            <!-- <div class="form-footer">
              <el-button type="primary" size="samll" @click="search">查询</el-button>
              <el-button size="samll" @click="reset">重置</el-button>
              <el-button size="samll" @click="exportFile">导出</el-button>
            </div> -->
          </div>
        </div>
      </div>
      <div class="result-box">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('searchResult')">
            查询结果
            <i :class="dropdownStatus.searchResult ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropdownStatus.searchResult" :style="{ height: dropdownStatus.searchCondition ? '494px' : '729px' }">
          <el-table
            stripe
            border
            size="medium"
            :data="tableData"
            @select="select"
            @select-all="select"
            height="100%"
            max-height="684"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="序号" prop="index" type="index" width="80"> </el-table-column>
            <el-table-column
              v-for="(column, index) in columns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :formatter="formatterTable"
            >
            </el-table-column>
          </el-table>
          <video-pagination
            ref="searchPagination"
            :total="total"
            @paginationConfChange="paginationConfChange"
          ></video-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPagination from '../../../components/VideoPagination'
import { postSearchListApi } from '@src/http/video/videoConfig.api.js'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import treeBox from '@src/components/tree/treeBox'
import { RESOURCETYPEVINPUT, RESOURCEBRANDSINPUT, RESOURCEMODELSINPUT } from '../../../components/selectConf'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import { download } from '@src/common/download.js'
import create from '@src/assets/rules/validation/security/video/video_searchmany.js'
const NOTIFY = {
  TITLE: {
    SUCCESS: '成功',
    FAIL: '失败',
    ERROR: '错误',
    WARNING: '警告'
  },
  TYPE: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning'
  }
}
export default {
  name: 'IOSearch',
  components: {
    VideoPagination,
    treeBox
  },
  data() {
    return {
      brands: RESOURCEBRANDSINPUT,
      deviceTypes: RESOURCETYPEVINPUT,
      dropdownStatus: {
        searchCondition: true,
        searchResult: true
      },
      total: 0,
      columns: [
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'keyPartName', label: '所属重点部位', width: '' },
        { prop: 'deviceName', label: '所属设备', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'deviceType', label: '类型', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'name', label: '资源名称', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
        { prop: 'isVideoLink', label: '关联视频通道', width: '' },
        { prop: 'isAudioLink', label: '关联对讲通道', width: '' },
        { prop: 'isGuardLink', label: '关联门禁通道', width: '' },
        { prop: 'isOutputLink', label: '关联输出通道', width: '' },
        { prop: 'remark', label: '备注', width: '' }
      ],
      tableData: [],
      selectedData: [],
      videoHostIOModel: {
        orgId: '',
        keyPartId: '',
        deviceName: '',
        name: '',
        class: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        status: '',
        updatedDept: '',
        updatedBy: '',
        updatedAt: ''
      },
      paginationConfig: {
        page: 1,
        limit: 25
      },
      statusOptions: [
        { value: '', label: '全部' },
        { value: 1, label: '离线' },
        { value: 2, label: '在线' }
      ],
      showOrgTree: false,
      orgName: '',
      keyPartName: '',
      keyParts: [],
      treeType: 3,
      checkForm: create.searchCheck_videoHostIO_Search // 表单校验
    }
  },
  computed: {
    models() {
      let curType = this.brands.find(i => (i.value || i.label) === this.videoHostIOModel.brand)
      let type = curType && curType.label
      return RESOURCEMODELSINPUT[type] || []
    }
  },
  watch: {
    'videoHostIOModel.brand'() {
      this.videoHostIOModel.modelNum = ''
    }
  },
  methods: {
    formatterTable(row, column, cellValue, index) {
      let params = ''
      switch (column.property) {
        case 'status':
          params = cellValue ? '在线' : '离线'
          break
        case 'isVideoLink':
        case 'isAudioLink':
        case 'isGuardLink':
        case 'isOutputLink':
          params = cellValue === 2 ? '已关联' : ''
          break
        case 'deviceType':
          let type = RESOURCETYPEVINPUT.filter(i => i.value === row.deviceType)[0]
          console.log(type)
          params = type ? type.label : cellValue
          break
        case 'brand':
          console.log(RESOURCEBRANDSINPUT)
          let brand = RESOURCEBRANDSINPUT.filter(i => i.value === row.brand)[0]
          console.log(brand)
          params = brand ? brand.label : row.brand
          break
        default:
          params = cellValue
          break
      }
      return params
    },
    getTreeApi(params) {
      // 机构树接口
      return getTreeApi(params)
    },
    onceClick(node) {
      // 机构树点击
      this.videoHostIOModel.orgId = node.id
      this.getKeyPartSelect(node.id)
      this.orgName = node.name
    },
    getKeyPartSelect(oId) {
      // 获取机构下的重点部位
      this.keyParts = []
      let params = {
        type: 2,
        oId: oId,
        subSystem: '1',
        isRecursion: '0'
      }
      this.getTreeApi(params).then(res => {
        if (res.data.code === 0) {
          let data = res.data.data.nodes
          data.forEach(item => {
            if (item.tierType === 'loc') {
              this.keyParts.push({
                label: item.name,
                value: item.id
              })
            }
          })
        }
      })
    },
    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },
    select(s) {
      this.selectedData = s
    },
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.search()
    },
    search() {
      this.$refs['videoHostIOModel'].validate(valid => {
        if (valid) {
          let sendData = {
            page: this.paginationConfig.page,
            limit: this.paginationConfig.limit,
            type: '3',
            ...this.videoHostIOModel
          }
          postSearchListApi(sendData).then(res => {
            if (res.data.code === 0) {
              console.log('数据查询成功')
              let arr = res.data.data.channels
              let parms = {}
              let length = res.data.data.channels.length
              parms['limit'] = length
              parms['page'] = this.paginationConfig.page - 1
              // parms['page']= parseInt(parms.total/length)+1;
              console.log(res.data)
              arr.forEach((item, index) => {
                item['index'] = index + 1 + parms.page * parms.limit
              })
              this.tableData = arr
              // this.tableData = res.data.data.channels
              this.total = res.data.data.count.total || 0
              this.dropdownStatus.searchResult = true
            }
          })
        } else {
          this.$notify({
            title: NOTIFY.TITLE.WARNING,
            message: '查询条件不规范',
            type: NOTIFY.TYPE.WARNING
          })
        }
      })
    },
    reset() {
      this.videoHostIOModel = {
        orgId: '',
        keyPartId: '',
        deviceName: '',
        name: '',
        class: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        status: '',
        updatedDept: '',
        updatedBy: '',
        updatedAt: ''
      }
      this.orgName = ''
      this.keyPartName = ''
    },
    exportFile() {
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      const tHeader = ['序号', '所属机构', '所属重点部位', '所属设备', '品牌', '类型', '型号', '资源名称', '资产编码', '备注']
      const filterVal = [
        'index',
        'orgName',
        'keyPartName',
        'deviceName',
        'brand',
        'deviceType',
        'modelNum',
        'name',
        'assetCode',
        'remark'
      ]
      let list = []
      if (this.selectedData && this.selectedData.length > 0) {
        list = this.$lodash.cloneDeep(this.selectedData)
        //  list.forEach((n)=> {
        //   if(n.status){
        //       if(n.status=='1'){
        //         n.status='离线'
        //       }else if(n.status=='2'){
        //         n.status='在线'
        //       }
        //   }
        //   // isVideoLink"isAudioLink"isGuardLink"isOutputLink"
        //   if(n.isVideoLink){
        //       if(n.isVideoLink=='1'){
        //         n.isVideoLink=''
        //       }else if(n.isVideoLink=='2'){
        //         n.isVideoLink='已关联'
        //       }
        //   }
        //   if(n.isAudioLink){
        //       if(n.isAudioLink=='1'){
        //         n.isAudioLink=''
        //       }else if(n.isAudioLink=='2'){
        //         n.isAudioLink='已关联'
        //       }
        //   }
        //   if(n.isGuardLink){
        //       if(n.isGuardLink=='1'){
        //         n.isGuardLink=''
        //       }else if(n.isGuardLink=='2'){
        //         n.isGuardLink='已关联'
        //       }
        //   }
        //   if(n.isOutputLink){
        //       if(n.isOutputLink=='1'){
        //         n.isOutputLink=''
        //       }else if(n.isOutputLink=='2'){
        //         n.isOutputLink='已关联'
        //       }
        //   }
        //  })
        list.forEach(n => {
          if (n.deviceType) {
            let type = RESOURCETYPEVINPUT.filter(i => i.value === n.deviceType)[0]
            n.deviceType = type ? type.label : '  '
          }
          if (n.brand) {
            let type = RESOURCEBRANDSINPUT.filter(i => i.value === n.brand)[0]
            n.brand = type ? type.label : n.brand
          }
          if (n.isVideoLink) {
            if (n.isVideoLink === '1') {
              n.isVideoLink = ''
            } else if (n.isVideoLink === '2') {
              n.isVideoLink = '已关联'
            }
          }
          if (n.isAudioLink) {
            if (n.isAudioLink === '1') {
              n.isAudioLink = ''
            } else if (n.isAudioLink === '2') {
              n.isAudioLink = '已关联'
            }
          }
          if (n.isGuardLink) {
            if (n.isGuardLink === '1') {
              n.isGuardLink = ''
            } else if (n.isGuardLink === '2') {
              n.isGuardLink = '已关联'
            }
          }
          if (n.isOutputLink) {
            if (n.isOutputLink === '1') {
              n.isOutputLink = ''
            } else if (n.isOutputLink === '2') {
              n.isOutputLink = '已关联'
            }
          }
        })
        const data = list.map(v => filterVal.map(j => v[j]))
        export_json_to_excel(
          tHeader,
          data,
          `报警输入关联配置查询导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        )
      } else {
        let params = {
          pattern: 'inquery',
          type: 3,
          equal: {
            orgId: this.videoHostIOModel.orgId,
            keyPartId: this.videoHostIOModel.keyPartId,
            class: this.videoHostIOModel.class,
            brand: this.videoHostIOModel.brand,
            modelNum: this.videoHostIOModel.modelNum,
            status: this.videoHostIOModel.status,
            updatedAt: this.videoHostIOModel.updatedAt
          }, // {object} equal 查询条件中等值条件集合
          like: {
            deviceName: this.videoHostIOModel.deviceName,
            name: this.videoHostIOModel.name,
            assetCode: this.videoHostIOModel.assetCode,
            updatedDept: this.videoHostIOModel.updatedDept,
            updatedBy: this.videoHostIOModel.updatedBy
          } // {object} like 查询条件中模糊条件集合
        }
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/video/channel/linkage/download`
        let name = `报警输入关联配置查询导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(
          url,
          name,
          () => {},
          () => {
            this.$notify({
              title: NOTIFY.TITLE.ERROR,
              message: '导出文件下载失败',
              type: NOTIFY.TYPE.ERROR
            })
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
        oId: type === 'kp' ? this.videoHostIOModel.orgId : undefined
      }
      getSearchOrgApi(params)
        .then(res => {
          if (!res.data.data.code) {
            callback(res.data.data.orgList || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch(err => {
          console.log(err)
          // callback([])
        })
    },
    // 选中 机构/重点部位 下拉选
    selectItem(type, val) {
      if (type === 'org') {
        this.videoHostIOModel.orgId = val.id
        this.orgName = val.name
      } else if (type === 'kp') {
        this.videoHostIOModel.keyPartId = val.id
        this.keyPartName = val.name
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  width: 100%;
  height: 100%;
  padding-left: 22px;
  .header {
    color: #333333;
    margin: 23px 0;
    /deep/ .el-breadcrumb {
      font-size: 12px;
      .active {
        .el-breadcrumb__inner {
          color: #2d72d3;
        }
      }
    }
  }
  .search-container {
    width: 100%;
    height: calc(~'100% - 60px');
    overflow: auto;
    .box-title {
      position: relative;
      height: 24px;
      line-height: 24px;
      color: #606266;
      i {
        position: absolute;
        top: 50%;
        left: 85px;
        transform: translateY(-50%);
      }
      &::after {
        display: block;
        content: '';
        border-top: 1px solid #e1e1e1;
        width: calc(~'100% - 120px');
        margin-left: 100px;
        margin-top: -12px;
      }
    }
    .conditions-box {
      margin: 10px 0;
      .form-box {
        height: auto;
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        padding: 15px 10px 5px 0px;
        border-radius: 5px;
        width: 100%;
        margin: 0 auto;
        .condition-box {
            width: 100%;
            // max-width: 1360px;
            margin-bottom: 10px;
            .query-form {
              width: 100%;
              background: rgba(245, 245, 245, 1);
              padding: 16px 16px 2px 16px;
              box-sizing: border-box;
              /deep/ .el-form {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                .el-form-item {
                  width: 25%;
                  display: flex;
                  // margin-left: 3%;
                  /deep/ .el-form-item__label {
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    width: 150px;
                  }
                  .el-form-item__content {
                    width: 100%;
                    .el-autocomplete {
                      width: 100%;
                    }
                    .el-select {
                      width: 100%;
                    }
                    .el-range-editor--mini{
                      width: 100%;
                    }
                  }
                }
              }
            }
            .opt-button {
              text-align: center;
              margin-top: 20px;
            }
        }
        .form-footer {
          width: 100%;
          margin-top: 10px;
          text-align: center;
        }
      }
      // /deep/ .el-autocomplete {
      //   width: 100%;
      //   height: 40px;
      //   .el-input {
      //     height: 100%;
      //     input {
      //       height: 100%;
      //     }
      //   }
      // }
    }
    .result-box {
      width: 100%;
      .button-box {
        margin: 10px 0;
      }
    }
  }
}
//

//
</style>
