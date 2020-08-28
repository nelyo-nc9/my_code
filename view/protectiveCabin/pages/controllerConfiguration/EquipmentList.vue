<template>
  <div class="list-box">
    <div class="tree-content">
      <treeBox ref="treeDiv"
               :lazyTreeApi="getTreeApi"
               searchType="search"
               :lazyTreeSearchApi="getLazyTreeSearchApi"
               :treeType="treeType"
               treeLazyToggle
               iconToggle
               @clickData="playBackGetData">
      </treeBox>
    </div>
    <div class="content">
      <div class="content-box">
        <div class="header"
             v-if="!isShowDetail && !isShowSort && !moveShow">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>防护舱管理</el-breadcrumb-item>
            <el-breadcrumb-item>防护舱设备配置</el-breadcrumb-item>
            <el-breadcrumb-item class="active">列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="button-box"
             v-if="!isShowDetail && !isShowSort && !moveShow">
          <el-button size="small"
                     @click="changComponent('AddEquipment')">
            <span class="iconfont-ccb ccbxinjian1"></span>新建</el-button>
          <el-button size="small"
                     @click="changComponent('Update')"
                     :disabled="multipleSelection.length!==1">
            <span class="iconfont-ccb ccbbianji"></span>编辑</el-button>
          <el-button size="small"
                     @click="remove"
                     :disabled="multipleSelection.length<1">
            <span class="iconfont-ccb ccbshanchu"></span>删除</el-button>
          <el-button size="small"
                     @click="move"
                     :disabled="multipleSelection.length<1">
            <span class="iconfont-ccb ccbqianyi1"></span>迁移</el-button>
          <el-button size="mini"
                     @click="sort"
                     :disabled="multipleSelection.length!==1">
            <span class="iconfont-ccb ccbpaixu"></span>排序</el-button>
          <el-button size="small"
                     @click="get"
                     :disabled="multipleSelection.length<1">
            <span class="iconfont-ccb ccbhuoqu"></span>获取</el-button>
          <el-button size="mini"
                     @click="expor">
            <span class="iconfont-ccb ccbdaochu"></span>导出</el-button>
          <el-button size="small"
                     @click="toprint">
            <span class="iconfont-ccb ccbdayin"></span>打印</el-button>
        </div>
        <div class="query"
             v-if="!isShowDetail && !isShowSort && !moveShow">
          <div>
            <el-checkbox v-model="getHostDataObj.rescusive"
                         @change="getHosts">显示子机构</el-checkbox>
            <span @click="getHosts(1)"
                  class="refresh">
              <i class="el-icon-refresh-right"></i>
              <span>刷新列表</span>
            </span>
          </div>
          <div class="right-header-search">
            <span class="title-status">在线状态</span>
            <el-select v-model="getHostDataObj.status">
              <el-option v-for="(item, index) in optionData"
                         :key="index"
                         :label="item.label"
                         :value="item.value"
                         @click.native="updateList(item)"></el-option>
            </el-select>
            <div class="search">
              <el-input v-model="getHostDataObj.key"
                        suffix-icon="el-icon-search"
                        @change="getHosts()"
                        placeholder="请输入IP或主机名称"></el-input>
            </div>
          </div>
        </div>
        <div class="right-table"
             ref="tableBox"
             v-if="!isShowDetail && !isShowSort && !moveShow">
          <el-table :data="aisleTableData"
                    style="width: 100%;"
                    size="mini"
                    tooltip-effect="dark"
                    stripe
                    :height="tableHeight"
                    @select="selectChange"
                    @select-all='selectChangeAll'
                    @selection-change="handleSelectionChange"
                    @row-dblclick="rowDbClick">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"
                             label="序号"></el-table-column>
            <el-table-column v-for="item in aisleTableColumn"
                             :key="item.label"
                             :prop="item.prop"
                             :label="item.label"
                             :width="item.width"
                             show-overflow-tooltip
                             sortable></el-table-column>
          </el-table>
          <video-pagination ref="listPagination"
                            :total="total"
                            @paginationConfChange="paginationConfChange"></video-pagination>
        </div>
        <SortEquipment v-if="isShowSort"
                       :isShowSort.sync="isShowSort"
                       :aisleTableData='sortArr'></SortEquipment>
        <move v-if="moveShow"
              :migrantData='multipleSelection'
              type='1'></move>
      </div>
    </div>
  </div>
</template>
<script>
import { getTreeApi, getChannes, getHostApi, mistsSearch } from '../../../../http/protectiveCabin/channe.api'
import { download } from '@src/common/download.js'
import treeBox from '@src/components/tree/treeBox'
import SortEquipment from './SortEquipment'
import { postDownLoadFile } from '@src/view/protectiveCabin/download.js'
import move from '../../components/Move'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    treeBox,
    SortEquipment,
    move,
    VideoPagination,
  },
  data() {
    return {
      searchData: '', //根据名称模糊搜索
      optionData: [
        {
          value: '',
          label: '全部',
        },
        {
          value: '2',
          label: '在线',
        },
        {
          value: '1',
          label: '离线',
        },
      ],
      isShowSort: false,
      // isShowMove: false,
      isShowDetail: false,
      tableHeight: 624,
      orgChecked: true,
      aisleTableData: [],
      aisleTableColumn: [
        // 表格标题行内容
        {
          prop: 'orgName',
          label: '所属机构',
          width: '120px',
          sortable: 'true',
        },
        {
          prop: 'keyPartName',
          label: '所属重点部位',
          width: '140px',
          sortable: 'true',
        },
        {
          prop: 'name',
          label: '防护舱主机名称',
          width: '140px',
          sortable: 'true',
        },
        { prop: 'ip', label: '防护舱主机IP', width: '140px', sortable: 'true' },
        { prop: 'port', label: '端口', width: '', sortable: 'true' },
        {
          prop: 'cabinNumber',
          label: '防护舱通道数量',
          width: '140px',
          sortable: 'true',
        },
        {
          prop: 'inputNumber',
          label: '报警输入数量',
          width: '140px',
          sortable: 'true',
        },
        {
          prop: 'outputNumber',
          label: '报警输出数量',
          width: '140px',
          sortable: 'true',
        },
        { prop: 'brand', label: '品牌', width: '', sortable: 'true' },
        { prop: 'modelNum', label: '型号', width: '', sortable: 'true' },
        { prop: 'username', label: '用户名', width: '120px', sortable: 'true' },
        { prop: 'password', label: '密码', width: '100px', sortable: 'true' },
        {
          prop: 'deviceSerise',
          label: '设备序列号',
          width: '120px',
          sortable: 'true',
        },
        {
          prop: 'assetCode',
          label: '资产编码',
          width: '120px',
          sortable: 'true',
        },
        { prop: 'status', label: '在线状态', width: '120px', sortable: 'true' },
        {
          prop: 'updatedBy',
          label: '录入人',
          width: '120px',
          sortable: 'true',
        },
        {
          prop: 'updatedDept',
          label: '录入机构',
          width: '120px',
          sortable: 'true',
        },
        {
          prop: 'updatedAt',
          label: '录入时间',
          width: '120px',
          sortable: 'true',
        },
      ],
      getHostDataObj: {
        page: 1,
        limit: 25,
        rescusive: true,
        key: '',
        status: '',
      }, //获取列表参数
      listInfoData: {}, //查看页面表单
      aisleList: [], //防护舱通道列表
      inputList: [], //报警输入列表
      outputList: [], //报警输出列表
      findObject: {}, //查看页面数据
      idsObject: [], //删除传参
      downloadObject: [], //导出数据
      updateObject: '', //判断新增修改id,
      moveShow: false,
      isShowMechanism: false, //查看机构详情
      isShowPosition: false, //查看部位详情
      isShowHost: false, //查看主机详情
      isShowChannel: false, //查看通道详情
      isShowMechanismList: {}, //查看机构详情数据
      isShowPositionList: {}, //查看部位详情数据
      isShowHostList: {}, //查看主机详情数据
      isShowChannelList: {}, //查看通道详情数据
      multipleSelection: [],
      messageEd: {},
      total: 0,
      elemIF: '',
      sortArr: [],
      treeType: 2,
    }
  },
  watch: {},
  computed: {
    ...mapState({
      isShowMove: ({ protectiveCabin }) => protectiveCabin.isShowMove,
    }),
  },
  created() {
    this.ISSHOWMOVE(false)
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    ...mapMutations(['SET_EQUIPMENT_COMPONENTID']),
    ...mapMutations(['SETTERIDSOBG']), //id
    ...mapMutations(['ISSHOWMOVE']), //迁移判断
    ...mapMutations(['ISSHOWMOVEOBJ']), //迁移Obj
    ...mapMutations(['ADDTITLE']), //新建页面表单标题

    ...mapActions(['lookup']), //根据名称模糊搜索
    ...mapActions(['getHost']), //防护舱设备配置列表获取
    ...mapActions(['deleteHost']), //防护舱设备配置列表删除
    ...mapActions(['listInfo']), // 防护舱设备配置列表修改、查看(表单+通道列表)
    paginationConfChange(data) {
      this.getHostDataObj.limit = data.limit
      this.getHostDataObj.page = data.page
      this.getHosts()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 机构数 后台搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem: 5,
        key: params.search,
      }
      return mistsSearch(params)
    },

    // 点击获取节点信息
    playBackGetData(data) {
      if (JSON.stringify(data) !== '{}') {
        this.messageEd = data
        this.getHosts()
      }
    },
    //树api
    getTreeApi(params) {
      return getTreeApi(params)
    },
    //防护舱设备配置列表获取
    getHosts(num) {
      let obj = {
        rescusive: this.getHostDataObj.rescusive,
        key: this.getHostDataObj.key,
        page: this.getHostDataObj.page,
        limit: this.getHostDataObj.limit,
      }
      if (this.getHostDataObj.status !== '') {
        obj.status = this.getHostDataObj.status
      }
      if (this.messageEd.tierType === 'loc') {
        obj.keyPartId = this.messageEd.id
      } else if (this.messageEd.tierType === 'org') {
        obj.orgId = this.messageEd.id
      }
      this.getHost(obj).then((res) => {
        res.data.data.hosts.forEach((item, index) => {
          item.index = index + 1
          item.outputNumber = Number(item.outputNumber)
          item.inputNumber = Number(item.inputNumber)
          item.cabinNumber = Number(item.cabinNumber)
          if (item.status === 1) {
            item.status = '离线'
          } else {
            item.status = '在线'
          }
        })
        this.aisleTableData = res.data.data.hosts
        this.total = res.data.data.count.total
        if (num) {
          this.$message({
            message: '刷新成功',
            type: 'success',
          })
        }
      })
    },
    //刷新列表
    Refresh() {
      this.aisleTableData = []
      this.getHosts()
    },
    //根据名称模糊搜索
    getsearchData() {
      this.lookup({
        target: 'host',
        like: { name: this.searchData },
        equal: { name: this.searchData },
      }).then((res) => {
        console.log(res)
        this.aisleTableData = res.data.data.hosts
      })
    },
    //筛选在线状态
    updateList(item) {
      this.aisleTableData = []
      let query = this.$lodash.cloneDeep(this.getHostDataObj)
      if (query.status == '') {
        delete query.status
      }
      this.getHost(query).then((res) => {
        res.data.data.hosts.forEach((item) => {
          item.status = item.status === 2 ? '在线' : '离线'
        })
        this.aisleTableData = res.data.data.hosts
      })
    },
    // 列表勾选
    selectChange(select, row) {
      this.idsObject = select //删除
      this.ISSHOWMOVEOBJ(row) //迁移
      this.updateObject = row.id //修改ID
      this.downloadObject = select //打印/导出数据
    },
    //列表全选
    selectChangeAll(select, row) {
      this.idsObject = select //删除
      this.ISSHOWMOVEOBJ(row) //迁移
      this.downloadObject = select //打印/导出数据
    },
    //获取
    get() {
      let ids = this.multipleSelection.map((item) => item.id)
      getChannes({ ids: ids }).then((res) => {
        let succcess = 0
        let error = 0
        res.data.data.forEach((item) => {
          if (item.message === '同步失败') {
            error++
          } else {
            succcess++
          }
        })
        this.$messageSuccess('获取成功' + succcess + '个，获取失败' + error + '个')
      })
    },
    //删除
    remove() {
      if (this.idsObject.length == 0) {
        this.$message('没有勾选删除项')
      } else {
        this.$confirm('确认删除该主机?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            let ids = this.idsObject.map((item) => {
              let { id } = item
              return id
            })
            this.deleteHost({ ids }).then((res) => {
              if (res.data.code == 0) {
                this.getHosts()
                this.$message('删除成功')
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      }
    },
    changComponent(componentName) {
      if (componentName === 'Update') {
        this.$emit('modelChange', this.multipleSelection[0], 'Update')
        componentName = 'AddEquipment'
      } else if (componentName === 'AddEquipment') {
        this.$emit(
          'modelChange',
          {
            // 表单数据
            name: '',
            accessService: '',
            ip: '',
            brand: '',
            username: '',
            assetCode: '',
            cabinNumber: 0,
            outputNumber: 0,
            inputNumber: 0,
            port: '',
            cport: '',
            password: '',
            modelNum: '',
            orgId: '',
            keyPartId: '',
            orgName: '',
            keyPartName: '',
            deviceSerise: '',
          },
          'AddEquipment'
        )
      }
      this.$parent.$parent.childrenComponent = componentName
    },
    //迁移
    move() {
      if (this.multipleSelection.length > 0) {
        this.moveShow = true
      } else {
        this.$message('请选择要迁移的源')
      }
    },
    //查看
    rowDbClick(row) {
      this.$emit('modelChange', row)
      this.$parent.$parent.childrenComponent = 'Info'
    },
    //排序
    sort() {
      getHostApi({ keyPartId: this.multipleSelection[0].keyPartId }).then((res) => {
        this.sortArr = res.data.data.hosts
        this.isShowSort = true
      })
    },
    //导出
    expor() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      if (this.downloadObject && this.downloadObject.length > 0) {
        let tHeader = this.aisleTableColumn.map((item) => item.label)
        let filterVal = this.aisleTableColumn.map((item) => item.prop)
        filterVal.unshift('index')
        tHeader.unshift('序号')
        let list = this.downloadObject
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, `防护舱设备导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`)
      } else {
        let body = {
          pattern: 'list', // {string} pattern 模式。 必输， list:列表模式，inquery: 查询模式
          key: this.getHostDataObj.key, // {string} key 查询关键字，可以为空、任意值。 空位不模糊检索，任意值代表在ip与名称中模糊搜索
          rescusive: this.getHostDataObj.rescusive, // {boolean}   rescusive
        }
        if (this.getHostDataObj.status !== '') {
          body.status = this.getHostDataObj.status
        }
        if (this.messageEd.tierType === 'loc') {
          body.keyPartId = this.messageEd.id
        } else if (this.messageEd.tierType === 'org') {
          body.orgId = this.messageEd.id
        }
        // zp去掉url中间的/host
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/cabin/host/download`
        let name = `防护舱设备导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(
          url,
          name,
          () => {},
          () => {
            this.$message({ type: 'info', message: '导出文件下载失败！' })
          },
          () => {},
          'post',
          body
        )
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    //打印
    toprint() {
      // 判断打印全部还是选中
      let list = []
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
      } else {
        list = this.aisleTableData
      }
      printJS({
        //表格数据的来源
        printable: list,
        //field 表格内容  displayName：表头名
        properties: [
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'name', displayName: '防护舱主机名称' },
          { field: 'ip', displayName: '防护舱主机IP' },
          { field: 'port', displayName: '端口' },
          { field: 'cabinNumber', displayName: '防护舱通道数量' },
          { field: 'inputNumber', displayName: '报警输入数量' },
          { field: 'outputNumber', displayName: '报警输出数量' },
          { field: 'brand', displayName: '品牌' },
          { field: 'modelNum', displayName: '型号' },
          { field: 'username', displayName: '用户名' },
          { field: 'password', displayName: '密码' },
          { field: 'deviceSerise', displayName: '设备序列号' },
          { field: 'assetCode', displayName: '资产编码' },
          { field: 'status', displayName: '在线状态' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'updatedAt', displayName: '录入时间' },
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">防护舱设备配置</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        //表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        //内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;',
      })
    },
  },
}
</script>


<style scoped lang='less'>
.list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .tree-content {
    width: 290px;
    height: auto;
    background: #fff;
    padding: 17px 9px 0px 9px;
    box-sizing: border-box;
  }
  .content {
    width: calc(~'100% - 290px');
    height: 100%;
    background: #eaeef3;
    padding: 6px 7px 0px 8px;
    .content-box {
      width: 100%;
      height: 100%;
      background: #fff;
      padding: 0px 25px 0px 24px;
      box-sizing: border-box;
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
      .button-box {
        .iconfont-ccb {
          font-size: 12px;
          margin-right: 7px;
        }
      }
      .query {
        margin: 23px 0px 17px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        .right-header-search {
          .title-status {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            margin-right: 12px;
          }
          /deep/ .el-select {
            margin-right: 15px;
            .el-input {
              .el-input__inner {
                width: 87px;
                height: 35px;
                background: rgba(51, 51, 51, 0);
                border: 1px solid rgba(225, 225, 225, 1);
                border-radius: 2px;
              }
              .el-input__suffix {
                .el-input__suffix-inner {
                  .el-input__icon {
                    line-height: 25px;
                  }
                }
              }
            }
          }
          .search {
            display: inline-block;
            /deep/ .el-input--suffix {
              display: inline-block;
              width: 100%;
              .el-input__inner {
                width: 230px;
                height: 35px;
                border: 1px solid rgba(225, 225, 225, 1);
                border-radius: 2px;
              }
            }
          }
        }
        /deep/ .el-checkbox {
          margin-right: 25px;
          .el-checkbox__label {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }
        }
        .refresh {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          cursor: pointer;
          i {
            font-size: 15px;
            margin-right: 6px;
          }
        }
      }
    }
  }
}
</style>
