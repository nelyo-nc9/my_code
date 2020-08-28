<template>
  <div class="list-box">
    <treeBox
      ref="tree"
      class="leftTree"
      :lazyTreeApi="getTreeApi"
      :customizeQuery="customizeQuery"
      searchType="filter"
      @onceClick="onceClick"
      @clickData="clickData"
      treeLazyToggle
    ></treeBox>
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <breadcrumb :breadcrumbItem="['视频管理', '中心录像计划配置', '存储路径配置']"></breadcrumb>
        <!-- 操作按钮 编辑-->
        <div class="button-box">
          <div class="left">
            <el-button size="mini" type="primary" @click="saveUpdate">保存</el-button>
            <el-button size="mini" @click="changComponent">取消</el-button>
            <el-checkbox style="margin-left:12px;" v-model="showStore">批量配置</el-checkbox>
            <span v-if="showStore" style="margin-left:20px;">
              <span>存储位置</span>
              <el-select v-model="storageLocType" size="mini" placeholder="请选择">
                <el-option
                  v-for="(item, index) of storageLocOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </span>
          </div>
          <div class="right">
            <!-- 搜索 -->
            <el-form
              size="mini"
              label-position="right"
              label-width="0px"
              ref="searchForm"
              :model="searchForm"
              :rules="rulesCheck"
              @submit.native.prevent
            >
              <el-form-item label="" prop="keyword">
                <el-input
                  v-model="searchForm.keyword"
                  style="width:220px;"
                  :placeholder="`请输入资源名称`"
                  size="small"
                  @keyup.enter.native="search"
                >
                  <i slot="suffix" @click="search" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="tableBox storagePathConfig">
          <el-table
            ref="table"
            v-if="reload"
            stripe
            border
            size="small"
            :data="tableData"
            @select="select"
            @select-all="select"
            height="100%"
            max-height="805"
            style="width: 100%"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            empty-text
          >
            <el-table-column type="selection" width="55" align="center" :selectable="selectable"></el-table-column>
            <el-table-column label="序号" type="index" :index="indexMethod" width="60" align="center"></el-table-column>
            <el-table-column
              v-for="e of columns"
              :key="e.prop"
              :prop="e.prop"
              :label="e.label"
              :width="e.width"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="60"
              align="center"
              :formatter="formatterTable"
            ></el-table-column>
            <el-table-column
              prop="storageServerId"
              label="存储位置"
              width="180"
              align="center"
              show-overflow-tooltip
              :sortable="true"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.storageServerId" size="mini" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in storageLocOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center" :resizable="false">
              <template slot-scope="scope">
                <div class="option">
                  <i @click="saveFun(scope.$index, scope.row)" class="iconfont icon-save"></i>
                  <i @click="recoverFun(scope.$index, scope.row)" class="el-icon-refresh-left"></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <video-pagination
          ref="listPagination"
          :total="pageInfo.total"
          @paginationConfChange="paginationConfChange"
        ></video-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '../common/breadcrumb.vue'
import treeBox from '@src/components/tree/treeBox'
import VideoPagination from '../../../components/VideoPagination'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'

import { getRecordPathApi, putRecordPathApi } from '@src/http/video/recordConfig.api.js'
import { mapState, mapGetters } from 'vuex'
import common from '../common'
import create from '@src/assets/rules/validation/security/video/video_search.js'
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
  name: 'recordList',
  mixins: [common],
  components: {
    treeBox,
    VideoPagination,
    breadcrumb
  },
  created() {
    this.pageInfo.limit = this.$PageInfo.limit
    this.search = this.$lodash.debounce(this._search, 800)
  },
  mounted() {
    this.storageLocType = this.storageLocOption.length && this.storageLocOption[0].value
    console.log(this.storageLocOption, '这个是下拉框里面的数据')
    if (!this.storageLocType) {
      this.storageLocType = ''
    }
    this.setPageInfo()
    // this.getTableList(this.pageInfo.page)
  },
  data() {
    return {
      //
      rulesCheck: create.searchCheck_storePathList, // 表单校验
      //
      reload: true,
      showStore: false,
      // keyword: '', // 搜索条件 名称
      searchForm: {
        keyword: ''
      },
      columns: [
        // 表格项
        { prop: 'orgName', label: '所属机构', width: '220' },
        { prop: 'keyPartName', label: '所属重点部位', width: '220' },
        { prop: 'deviceName', label: '所属设备', width: '220' },
        { prop: 'channelName', label: '资源名称', width: '220' },
        { prop: 'ip', label: 'IP地址', width: '' }
        // { prop: 'status', label: '录像状态', width: '100' }
      ],
      tableTmpData: [], // 表格data tmp
      tableData: [], // 表格data
      pageInfo: {
        // 页码组件返回参数
        limit: 25,
        page: 1,
        total: 0 // 总页码
      },
      selectData: [], // 选中项
      storageLocType: '', // 存储路径选中项
      customizeQuery: {
        // 机构树传参
        params: {
          subSystem: 1,
          channelType: 1
        }
      },
      selectTreeid: {} // 点击机构树获取的id
    }
  },
  computed: {
    ...mapGetters('videoManage', {
      storageLocAllOption: 'storageLocAllOption' // 存储路径 请选择
    }),
    ...mapState('videoManage', {
      storageLocOption: ({ recordConfig }) => recordConfig.storageLocOption // 存储路径备

    })
  },
  watch: {
    showStore() {
      if (!this.showStore) {
        this.storageLocType = this.storageLocOption.length && this.storageLocOption[0].value
        // 补 防错 判断state是否有数据
        // if(!this.storageLocType){
        //   this.storageLocType=""
        // }
        this.selectData = []
        this.$refs.table.clearSelection()
        //  document.getElementsByClassName('el-checkbox__inner')[0].style.display="none";
      }
    },
    immediate: true
  },
  methods: {
    selectable() {
      if (this.showStore) {
        return true
      } else {
        return false
      }
    },
    // 请求表格data
    getTableList(page) {
      // 接口改过了
      let params = {
        page,
        limit: this.pageInfo.limit,
        ...this.selectTreeid
      }
      if (this.searchForm.keyword) {
        // 名称
        params.keyword = this.searchForm.keyword
      }
      this.tableData = []
      getRecordPathApi(params)
        .then(res => {
          if (!res.data.code) {
            if (!res.data.data.hasOwnProperty('linkages')) {
              this.pageInfo.total = 0
            } else {
              let param = []
              res.data.data.linkages.forEach(e => {
                if (this.storageLocOption.length && this.storageLocOption[0].value) {
                  let sOptionList = this.storageLocOption
                  let sid = e.storageServerId
                  if (sOptionList[0].value == sid) {
                    e.storageServerId = sOptionList[0].label
                  } else if (sOptionList[0].label == sid) {
                    // && isNaN(sOptionList[0].label)
                    e.storageServerId = sOptionList[0].label
                  } else {
                    e.storageServerId = ''// 存储位置找不到
                  }
                  //  sOptionList.forEach(item=>{
                  //     if(item.value == sid){
                  //       e.storageServerId=item.label
                  //     }else{
                  //        e.storageServerId=""
                  //     }
                  //  })
                } else {
                  e.storageServerId = ''// 存储位置找不到
                }
                param.push({
                  channelId: e.channelId, // string
                  orgName: e.orgName, // string 所属机构名称
                  keyPartName: e.keyPartName, // string 所属重点部位名称
                  deviceName: e.deviceName, // string 所属设备名称
                  channelName: e.channelName, // string 资源名称
                  status: e.status, // integer 录像状态  1启用，2停用
                  ip: e.ip, // string ip地址
                  storageServerId: e.storageServerId // integer 存储路径
                })
              })
              this.tableData = param
              this.tableTmpData = this.$lodash.cloneDeep(param)
              this.pageInfo.total = res.data.data.total
            }
          } else {
            throw res.data.message
          }
        })
        .catch(err => {
          console.log(err)

          this.$notify({
            title: NOTIFY.TITLE.ERROR,
            message: '获取中心录像计划配置列表失败，请稍后重试',
            type: NOTIFY.TYPE.ERROR
          })
        })
    },
    // 上层取消按钮
    changComponent() {
      this.storageLocType = this.storageLocOption.length && this.storageLocOption[0].value
      this.selectData = []
      this.searchForm.keyword = ''
      this.tableData = this.$lodash.cloneDeep(this.tableTmpData)
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
    },
    formatterTable(row, column) {
      // 中文映射
      let status = row.status
      if (status == '1') {
        return '离线'
      } else {
        return '在线'
      }
    },
    // 保存编辑
    saveUpdate() {
      /**
       * 1、无勾选，全局保存
       * 2、有勾选，仅保存勾选项
       * 3、若未编辑全局存储位置项，不可全局保存
       */
      let param = []
      // if (this.selectData.length) { // 有勾选
      // console.log(this.selectData)
      //   this.selectData.forEach(e => {
      //     console.log(e)
      //     if (this.storageLocType !== '' && this.storageLocType !== e.storageServerId) {
      //       param.push({
      //         channelId: e.channelId,
      //         storageServerId: this.storageLocType // 存储位置
      //       })
      //     }else{   //列表有勾选  顶部存储位置没有选
      //       param.push({
      //         channelId: e.channelId,
      //         storageServerId: e.storageServerId // 存储位置
      //       })
      //     }
      //   })
      // } else {
      //   this.tableData.forEach(e => {
      //     if (this.storageLocType !== '' && this.storageLocType !== e.storageServerId) {
      //       param.push({
      //         channelId: e.channelId,
      //         storageServerId: this.storageLocType // 存储位置
      //       })
      //     }
      //   })
      // }

      // if (this.selectData.length) { // 有勾选
      //       console.log(this.selectData)
      //         this.selectData.forEach(e => {
      //           console.log(e)
      //           if (this.storageLocType !== '' && this.storageLocType !== e.storageServerId) {
      //             param.push({
      //               channelId: e.channelId,
      //               storageServerId: this.storageLocType // 存储位置
      //             })
      //           }else{   //列表有勾选  顶部存储位置没有选
      //             param.push({
      //               channelId: e.channelId,
      //               storageServerId: e.storageServerId // 存储位置
      //             })
      //           }
      //         })
      //       } else {
      //         this.tableData.forEach(e => {
      //           if (this.storageLocType !== '' && this.storageLocType !== e.storageServerId) {
      //             param.push({
      //               channelId: e.channelId,
      //               storageServerId: this.storageLocType // 存储位置
      //             })
      //           }
      //         })
      //       }
      let channelIds = this.selectData.map(v => v.channelId)
      if (this.showStore && !channelIds.length) {
        this.$notify({
          title: NOTIFY.TITLE.ERROR,
          message: '您未勾选列表行数据',
          type: NOTIFY.TYPE.ERROR
        })

        return false
      }
      this.tableData.forEach(e => {
        param.push({
          channelId: e.channelId,
          storageServerId: channelIds.includes(e.channelId) ? this.storageLocType : e.storageServerId // 存储位置
        })
      })

      putRecordPathApi({ linkages: param, groupStorageServerId: '' })
        .then(res => {
          if (!res.data.code) {
            this.storageLocType = this.storageLocOption.length && this.storageLocOption[0].value
            this.selectTreeid = {}
            this.selectData = []
            this.searchForm.keyword = ''

            this.$notify({
              title: NOTIFY.TITLE.SUCCESS,
              message: '编辑成功',
              type: NOTIFY.TYPE.SUCCESS
            })
            this.getTableList(this.pageInfo.page)
          } else {
            throw res.data.message
          }
        })
        .catch(err => {
          console.log(err)

          this.$notify({
            title: NOTIFY.TITLE.ERROR,
            message: '编辑失败，请稍后重试',
            type: NOTIFY.TYPE.ERROR
          })
        })
    },
    // 选择列表
    select(s, row) {
      this.selectData = s
    },
    // 页码控件返回参数
    paginationConfChange(obj) {
      this.pageInfo.page = obj.page
      this.pageInfo.limit = obj.limit
      this.getTableList(this.pageInfo.page)
    },
    // 搜索按钮
    _search() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          //
          this.setPageInfo()
          this.getTableList(this.pageInfo.page)
        } else {
        }
      })
    },
    // 设置页码
    setPageInfo(page = 1) {
      this.pageInfo.page = page
      this.$refs.listPagination.setPaginationConfig({ page: this.pageInfo.page, limit: this.pageInfo.limit })
    },
    // 机构树API
    getTreeApi(params) {
      return getTreeApi(params)
    },
    // 单击机构树
    /**
     * 单击机构树 获取当前节点下的所有资源数据
     */
    onceClick(data, node) {
      this.setPageInfo()
      this.searchForm.keyword = ''
      switch (data.tierType) {
        case 'res':
          this.selectTreeid = { channelId: data.id + '' }
          break
        case 'equ':
          this.selectTreeid = { deviceId: data.id + '' }
          break
        case 'loc':
          this.selectTreeid = { keyPartId: data.id + '' }
          break
        case 'org':
          this.selectTreeid = { orgId: data.id + '' }
          break
      }
      this.getTableList(this.pageInfo.page)
    },
    clickData(data) {
      if (data && data.nodeKey) {
        console.log(data)
        this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点this.setPageInfo();
        this.searchForm.keyword = ''
        switch (data.tierType) {
          case 'res':
            this.selectTreeid = { channelId: data.id + '' }
            break
          case 'equ':
            this.selectTreeid = { deviceId: data.id + '' }
            break
          case 'loc':
            this.selectTreeid = { keyPartId: data.id + '' }
            break
          case 'org':
            this.selectTreeid = { orgId: data.id + '' }
            break
        }
        this.getTableList(this.pageInfo.page)
      }
    },
    // 保存按钮
    saveFun(index, data) {
      const param = [
        {
          channelId: data.channelId,
          storageServerId: data.storageServerId // 存储路径
        }
      ]
      putRecordPathApi({ linkages: param })
        .then(res => {
          if (!res.data.code) {
            this.$notify({
              title: NOTIFY.TITLE.SUCCESS,
              message: '编辑成功',
              type: NOTIFY.TYPE.SUCCESS
            })
            this.tableTmpData[index].storageServerId = data.storageServerId
          } else {
            throw res.data.message
          }
        })
        .catch(err => {
          console.log(err)

          this.$notify({
            title: NOTIFY.TITLE.ERROR,
            message: '编辑失败，请稍后重试',
            type: NOTIFY.TYPE.ERROR
          })
        })
    },
    // 恢复按钮
    recoverFun(index, data) {
      this.tableData[index].storageServerId = this.tableTmpData[index].storageServerId
    }
  }
}
</script>

<style lang="less" scoped>
.list-box {
  width: 100%;
  height: calc(~'100% - 10px');
  margin-top: 10px;
  display: flex;
  .leftTree {
    width: 280px;
    height: 100%;
  }
  .content {
    width: calc(~'100% - 290px');
    // max-width: 1260px;
    height: 100%;
    padding-left: 10px;
    .top {
      .button-box {
        // 操作按钮
        .left {
          float: left;
          margin-left: 5px;
          > div {
            width: 120px;
            margin-right: 12px;
          }
        }
        .right {
          float: right;
        }
        &:after {
          display: block;
          content: '';
          clear: both;
        }
        .left,
        .right {
          user-select: none;
          // margin-right: 12px;
          // width: 100px;
          div {
          }
          & > span {
            margin-right: 5px;
          }
        }
      }
    }
    .main {
      width: 100%;
      margin-top: 10px;
      height: calc(~'100% - 81px');
      .tableBox {
        width: 100%;
        height: calc(~'100% - 60px');
        .showValue {
          display: inline-block;
          width: calc(100% - 20px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
        /deep/ table tr th.is-sortable > .cell {
          top: 2px;
        }
        .option {
          display: flex;
          justify-content: space-around;
          i {
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            line-height: 29px;
            color: #2d72d3;
            &:hover {
              color: #66b1ff;
            }
          }
        }
      }
    }
  }
}
</style>
