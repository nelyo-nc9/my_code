<template>
  <div id="vsd">
    <div class="isMig" v-if="isMigrate">
      <div class="fx" style="padding:0 10px">
        <div class="treeLeft">
          <treeBox
            :lazyTreeApi="getTreeApi"
            searchType="filter"
            :treeType="treeType"
            @onceClick="onceClick"
            treeLazyToggle
            iconToggle
          ></treeBox>
        </div>

        <div class="right" v-show="!isSort">
          <div class="menu">
            <TabMenu :tabList="tabList" />
          </div>
          <div class="saveBtns">
            <el-button size="mini" @click="chageType('Create')">
              新建
              <i class="el-icon-plus"></i>
            </el-button>
            <el-button size="mini" @click="chageType('Update')">
              编辑
              <i class="el-icon-edit-outline"></i>
            </el-button>
            <el-button size="mini" @click="backList">
              删除
              <i class="el-icon-delete"></i>
            </el-button>
            <el-button size="mini" @click="getHos">
              获取
              <i class="icon el-icon-circle-check"></i>
            </el-button>
            <!-- <el-button size="mini" >复制</el-button> -->
            <el-button size="mini" @click="viewMig('Migrate')">
              迁移
              <i class="icon el-icon-rank"></i>
            </el-button>
            <el-button size="mini" @click="sorts">
              排序
              <i class="icon el-icon-sort"></i>
            </el-button>
            <!-- @click="print" -->
            <el-button size="mini" v-print="'#contentinfo'">
              打印
              <i class="el-icon-printer"></i>
            </el-button>
          </div>
          <div class="tables" id="contentinfo" style="overflow-y:auto;height: calc(100% - 60px);">
            <el-collapse :value="'1'">
              <el-collapse-item title="门禁平台信息" name="1">
                <!-- <p style="text-align:center;padding:10px 0">门禁平台信息</p> -->
                <div class="form-box form-save">
                  <div class="form-content">
                    <div class="left-form">
                      <el-form size="mini" :model="platforms" label-position="right" label-width="120px">
                        <el-form-item label="门禁平台名称">
                          <span>{{ platforms.name }}</span>
                        </el-form-item>
                        <el-form-item label="所属机构">
                          <span>{{ platforms.orgName }}</span>
                        </el-form-item>
                        <!-- <el-form-item label="所属子系统" required>
                          <span>{{platforms.subSystemName}}</span>
                        </el-form-item>-->
                        <el-form-item label="品牌">
                          <span>{{ platforms.brand }}</span>
                        </el-form-item>
                        <el-form-item label="IP地址">
                          <span>{{ platforms.ip }}</span>
                        </el-form-item>
                        <el-form-item label="用户名">
                          <span>{{ platforms.username }}</span>
                        </el-form-item>
                      </el-form>
                    </div>
                    <div class="right-form">
                      <el-form size="mini" label-position="right" label-width="120px">
                        <el-form-item label="所属重点部位">
                          <span>{{ platforms.keyPartName }}</span>
                        </el-form-item>
                        <el-form-item label="型号">
                          <span>{{ platforms.modelNum }}</span>
                        </el-form-item>
                        <el-form-item label="端口">
                          <span>{{ platforms.port }}</span>
                        </el-form-item>
                        <el-form-item label="密码">
                          <span>{{ platforms.password }}</span>
                        </el-form-item>
                        <el-form-item label>
                          <span></span>
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                  <div class="bottomInfo">
                    <div id="userInfo">
                      <ul class="box">
                        <li class="boxItem">
                          <i class="itemTitle">录入时间</i>
                          <span>{{ platforms.updatedAt || '--' }}</span>
                        </li>
                        <li class="boxItem">
                          <i class="itemTitle">录入机构</i>
                          <span>{{ platforms.updatedDept || '--' }}</span>
                        </li>
                        <li class="boxItem">
                          <i class="itemTitle">录入人</i>
                          <span>{{ platforms.updatedBy || '--' }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
            <el-collapse v-model="activeNames" @change="collapseChange">
              <el-collapse-item title name="1">
                <div class="collapse-item">
                  <div class="box-title">
                    <span class="pointer" style="color:#2D72D3" @click="toggleOpen('videoChan')">
                      门禁主机列表
                      <i :class="dropdownStatus.videoChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                    </span>
                  </div>
                  <div v-if="dropdownStatus.videoChan" style="width:100%;">
                    <div class="list-header" @click="Multifunction($event)">
                      <i class="el-icon-download" title="获取主机信息" @click="getHostTDlist"></i>
                      <i class="el-icon-circle-plus-outline" title="新增" @click="addHost"></i>
                      <i class="el-icon-edit" title="编辑"></i>
                      <i class="el-icon-delete" title="删除" @click="delHost"></i>
                      <i class="el-icon-refresh-right" title="刷新" @click="Refresh"></i>
                    </div>
                    <!-- <video-table :columns="videoChanColumns" :tableData="videoChanTableData"></video-table> -->
                    <div class="tableLoading" id="tableCon">
                      <el-table
                        ref="multipleTable"
                        :data="hosts"
                        tooltip-effect="dark"
                        style="width: 100%"
                        v-loading="loading"
                        @select="select"
                        @select-all="selectAll"
                      >
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="门禁主机名称" width="120">
                          <template slot-scope="scope">{{ scope.row.name }}</template>
                        </el-table-column>
                        <el-table-column prop="uniqueId" label="门禁主机ID" width="120"></el-table-column>
                        <el-table-column label="门禁主机类型" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <!-- 金库门禁,2|普通门禁,3|互锁门门禁 -->
                            <span v-show="scope.row.type == 1">金库门禁</span>
                            <span v-show="scope.row.type == 2">普通门禁</span>
                            <span v-show="scope.row.type == 3">互锁门门禁</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="assetCode" label="资产编码" show-overflow-tooltip></el-table-column>

                        <el-table-column prop="brand" label="品牌" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="modelNum" label="型号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="assetCode" label="资产编码" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="guardNumber" label="门禁通道数" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="readerNumber" label="读头数量" show-overflow-tooltip></el-table-column>
                        <el-table-column
                          prop="inputNumber"
                          label="报警输入数量"
                          show-overflow-tooltip
                        ></el-table-column>
                      </el-table>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <TableSort v-if="isSort" :tableDatas="platforms" :viewPage="true" @cancle="isSort = false" />
      </div>
    </div>
    <el-dialog :title="clickHostType" :visible.sync="isEditDetector" width="400px" v-if="isEditDetector">
      <!-- v-if="clickHostType == '新增'" -->
      <el-form
        :model="createHostBody"
        size="mini"
        label-position="right"
        label-width="120px"
        ref="deviceModel"
        :rules="rules"
      >
        <el-form-item
          label="门禁主机名称"
          prop="name"
          :rules="[
            { required: true, message: '必填', trigger: 'change' },
            { min: 1, max: 64, message: '名称在 1 到 64 个字符', trigger: 'change' }
          ]"
        >
          <el-input v-model="createHostBody.name"></el-input>
        </el-form-item>
        <el-form-item
          label="门禁主机ID号"
          prop="uniqueId"
          :rules="[
            { required: true, message: 'ID不能大于65535', trigger: 'change' },
            {
              pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
              message: 'ID不能大于65535'
            }
          ]"
        >
          <el-input type="number" v-model="createHostBody.uniqueId"></el-input>
        </el-form-item>
        <el-form-item
          label="门禁主机类型"
          prop="type"
          :rules="[{ required: true, message: '必填', trigger: 'change' }]"
        >
          <el-select v-model="createHostBody.type">
            <el-option
              v-for="(item, index) in CreatehostType"
              :key="index"
              :label="item.data"
              :value="item.data"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brand" :rules="[{ required: true, message: '必填', trigger: 'change' }]">
          <el-select v-model="createHostBody.brand">
            <el-option
              v-for="(item, index) in hostBrands"
              :key="index"
              :label="item.data"
              :value="item.englishName || item.data"
              @click.native="changeBrans(index)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" :rules="[{ required: true, message: '必填', trigger: 'change' }]" prop="modelNum">
          <el-select v-model="createHostBody.modelNum">
            <el-option
              v-for="(item, index) in hostModelNums"
              :key="index"
              :label="item.data"
              :value="item.data"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="资产编码"
          :rules="[
            { required: true, message: '必填', trigger: 'change' },
            { min: 1, max: 64, message: '不可超过64位', trigger: 'blur' }
          ]"
          prop="assetCode"
        >
          <el-input v-model="createHostBody.assetCode"></el-input>
        </el-form-item>
        <el-form-item
          label="门禁通道数"
          prop="guardNumber"
          :rules="[
            { type: 'number', message: '数量必须为整数', trigger: 'blur' },
            { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' }
          ]"
        >
          <el-input v-model.number="createHostBody.guardNumber"></el-input>
        </el-form-item>
        <el-form-item
          label="读头数量"
          prop="readerNumber"
          :rules="[
            { type: 'number', message: '数量必须为整数', trigger: 'blur' },
            { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' }
          ]"
        >
          <el-input v-model.number="createHostBody.readerNumber"></el-input>
        </el-form-item>
        <el-form-item
          label="报警输入数量"
          prop="inputNumber"
          :rules="[
            { type: 'number', message: '数量必须为整数', trigger: 'blur' },
            { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' }
          ]"
        >
          <el-input v-model.number="createHostBody.inputNumber"></el-input>
        </el-form-item>
      </el-form>
      <!-- 编辑 -->
      <!-- <el-form
        v-if="clickHostType == '编辑'"
        :model="hostInfo"
        size="mini"
        label-position="right"
        label-width="120px"
        ref="EmitHost"
      >
        <el-form-item
          label="门禁主机名称"
          prop="name"
          :rules="[
            { required: true, message: '必填', trigger: 'change' },
            { min: 1, max: 64, message: '名称在 1 到 64 个字符', trigger: 'change' }
          ]"
        >
          <el-input v-model="hostInfo.name"></el-input>
        </el-form-item>
        <el-form-item
          label="门禁主机ID号"
          prop="uniqueId"
          :rules="[
            { required: true, message: '必填', trigger: 'change' },
            {
              pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
              message: 'ID不能大于65535'
            }
          ]"
        >
          <el-input type="number" v-model="hostInfo.uniqueId"></el-input>
        </el-form-item>
        <el-form-item
          label="门禁主机类型"
          prop="type"
          :rules="[{ required: true, message: '必填', trigger: 'change' }]"
        >
          <el-select v-model="hostInfo.type">
            <el-option
              v-for="(item, index) in CreatehostType"
              :key="index"
              :label="item.data"
              :value="item.data"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brand" :rules="[{ required: true, message: '必填', trigger: 'change' }]">
          <el-select v-model="hostInfo.brand">
            <el-option
              v-for="(item, index) in hostBrands"
              :key="index"
              :label="item.data"
              :value="item.englishName || item.data"
              @click.native="changeBrans(index)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="modelNum" :rules="[{ required: true, message: '必填', trigger: 'change' }]">
          <el-select v-model="hostInfo.modelNum">
            <el-option
              v-for="(item, index) in hostModelNums"
              :key="index"
              :label="item.data"
              :value="item.data"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="资产编码"
          prop="assetCode"
          :rules="[
            { required: true, message: '必填', trigger: 'change' },
            { min: 1, max: 64, message: '不可超过64位', trigger: 'blur' }
          ]"
        >
          <el-input v-model="hostInfo.assetCode"></el-input>
        </el-form-item>
        <el-form-item
          label="门禁通道数"
          prop="guardNumber"
          :rules="[
            { type: 'number', message: '数量必须为整数', trigger: 'blur' },
            { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' }
          ]"
        >
          <el-input v-model.number="hostInfo.guardNumber"></el-input>
        </el-form-item>
        <el-form-item
          label="读头数量"
          prop="readerNumber"
          :rules="[
            { type: 'number', message: '数量必须为整数', trigger: 'blur' },
            { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' }
          ]"
        >
          <el-input v-model.number="hostInfo.readerNumber"></el-input>
        </el-form-item>
        <el-form-item
          label="报警输入数量"
          prop="inputNumber"
          :rules="[
            { type: 'number', message: '数量必须为整数', trigger: 'blur' },
            { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' }
          ]"
        >
          <el-input v-model.number="hostInfo.inputNumber"></el-input>
        </el-form-item>
      </el-form> -->
      <div style="text-align:center;">
        <el-button size="mini" type="primary" @click="saveDetector(clickHostType)">保存</el-button>
        <el-button size="mini" @click="cancels">取消</el-button>
      </div>
    </el-dialog>
    <component
      :is="chageCompoents"
      @modelChange="FormToList"
      :migrantData="migrantData"
      v-if="!isMigrate"
      :toList="isMigrate"
      :updataItem="platforms"
    ></component>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapMutations, mapState } from 'vuex'
import { getTreeApi } from '@src/http/access/accessMan'
import { dePlatformList, getPlatformListT, getHosts, getDetal, del } from '@src/http/access/accessMan'
import { getZhiDhosts } from '@src/http/access/control'
import { creatHost, removeHost, delHostList, getRmOrDelHostsList } from '@src/http/access/host'
import { getServeId, brandOrModelNum } from '@src/http/access/getId'

export default {
  components: {
    treeBox: () => import('@src/components/tree/treeBox'),
    TabMenu: () => import('../../components/tabMenu'),
    TableSort: () => import('@src/view/accessControl/accessManagement/pages/videoHost/TableSort.vue'),
    userInfo: () => import('@src/view/accessControl/components/userInfo.vue'),
    update: () => import('@src/view/accessControl/accessManagement/pages/videoHost/Update.vue'),
    Migrate: () => import('@src/view/accessControl/accessManagement/pages/videoHost/Migrate.vue'),
  },
  props: [
    'createPLatFromID',
    'isView',
    'deviceModel',
    'ViewTableData',
    'afterUpdata',
    'host',
    'updataAfter',
    'createItem',
    'Info',
    'updateId',
    'updataToViewPageId',
  ],
  data() {
    return {
      delHostArr: [],
      hostInfo: {},
      hostBrands: [],
      hostModelNums: [],
      CreatehostType: [], // 主机品牌
      chageCompoents: '',
      sortOrMar: true,
      migrantData: [], // 迁移弹窗的源数据
      UpDataId: '',
      toUpdate: true, // 点击编辑到update页面
      currtRmHost: {},
      isEditDetector: false,
      createHostBody: {
        platformId: '',
        assetCode: '', //资产编码
        uniqueId: '', // 唯一标识id
        name: '', // 主机名称
        type: '', //主机类型
        brand: '', // 品牌
        modelNum: '', // 型号i
        readerNumber: '', //读头通道数量
        guardNumber: '', // 门禁通道数量
        inputNumber: '', //报警输入数量
      },
      clickHostType: '',
      isSort: false,
      migrantData: [], // 迁移弹窗的源数据
      platforms: {},
      flag: false,
      hosts: [],
      platformData: {},
      treeType: 2,
      detectorData: {
        name: '',
        serialNumber: '',
        deviceType: '',
        count: '',
        brand: '',
        code: '',
      },
      loading: false,
      isEditDetector: false,

      dropdownStatus: {
        videoChan: true,
        audioChan: false,
        inputChan: false,
      },
      isMigrate: true,
      toSort: true,
      Infos: {
        // mechanism: '石家庄机构分行',
        // user: '张三'
      },
      currentPage4: 4,
      isCreate: '',
      activeNames: ['1'],
      tabList: ['门禁管理', '门禁平台配置', '新建', '查看'],
      tableData: [],
      delList: '',
      // 创建主机表单验证
      rules: {
        uniqueId: [{ required: true, message: '必填', trigger: 'blur' }],
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 1, max: 15, message: '名称在 1 到 15 个字符', trigger: 'blur' },
        ],
        type: [{ required: true, message: '必填', trigger: 'blur' }],
        brand: [{ required: true, message: '必填', trigger: 'blur' }],
        modelNum: [{ required: true, message: '必填', trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapState('access', {
      comDatas: 'comDatas',
    }),
  },
  methods: {
      selectAll(selection){
      this.delHostArr = selection
    },
    //主机型号
    changeBrans(index) {
      // homeClass
      this.createHostBody.modelNum = ''
      this.hostInfo.modelNum = ''
      // 新建门禁主机型号
      let hostModelNumsType = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '5' }]
      let HostModelNumsType = hostModelNumsType
      brandOrModelNum({ queryList: HostModelNumsType }).then((res) => {
        this.hostModelNums = res.data.data[0].attr
        let brand = this.hostBrands
        this.AllmodelList = this.hostModelNums
        let modelList = this.hostModelNums
        let data1 = brand[index].data
        let arr = []
        modelList.filter((v) => {
          if (v.homeClass == data1) {
            arr.push(v)
          }
          this.hostModelNums = arr
        })
      })
    },
    // 获取平台下的主机及所属通道信息
    getHostTDlist(type) {
      let params = {
        id: this.platforms.id,
      }
      this.loading = true
      getZhiDhosts(params).then((res) => {
        if (res.data.code != 0) {
           this.loading = false
              this.$notify({
              title: '错误',
              message: '门禁平台不在线',
              type: 'error',
            })
        }
        setTimeout(() => {
          getHosts({ id: this.platforms.id }).then((res) => {
            if(res.data.code != 0) {
              this.loading = false
              return
            }
            if(this.loading == false){
              return
            }
              this.$notify({
              title: '成功',
              message:'获取完毕',
              type: 'success',
            })
            this.hosts = res.data.data
            this.loading = false
          })
        }, 300)
      })
    },
    addHost() {
      this.isEditDetector = true
    },
    delHost() {
      if (!this.hosts.length) {
           this.$notify({
                title: '失败',
                message:'暂无主机',
                type: 'error',
              })
        return
      } else if (!this.delHostArr.length) {
          this.$notify({
                title: '失败',
                message:'请选择主机',
                type: 'error',
              })
        return
      } else {
        this.$confirm('此操作将删除指定主机, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            let idsArr = this.delHostArr
              .map((item) => item.id)
              .join()
              .split(',')
            let ids = idsArr
            delHostList({ ids: idsArr }).then((res) => {
              if(res.data.code != 0){
                             this.$notify({
                title: '失败',
                message:'删除失败',
                type: 'error',
              })
                return

              }
              this.delHostArr = []  // 清楚选中的arr
              this.$refs.multipleTable.clearSelection()  // 清除多选框

              this.isEditDetector = false
              this.loading = true
              setTimeout(() => {
                // 刷新主机列表
                getRmOrDelHostsList(`/resource/v1/guard/platform/${this.platformId}/host`).then((res) => {
                    this.$notify({
                      title: '成功',
                      message:'删除主机成功',
                      type: 'success',
                    })
                    this.hosts = res.data.data
                  })
                  this.loading = false
              }, 300)
            })
          })
          .catch(() => {
            this.$messageSuccess('取消成功')
            this.$refs.multipleTable.clearSelection()
            this.delHostArr = []
          })
      }
    },
    Refresh() {
      this.loading = true
      setTimeout(() => {
        getHosts({ id: this.platforms.id }).then((res) => {
          this.$notify({
            title: '成功',
            message: '刷新完毕',
            type: 'success',
          })
          this.hosts = res.data.data
          this.loading = false
        })
      }, 300)
    },
    // 新建查看页面迁移 刷新列表查看迁移后的数据
    FormToList(a) {
      if (a.ParerntFlag) {
        this.isMigrate = !this.isMigrate
        getDetal(this.UpDataId).then((res) => {
          console.log('Log ---------------?', res)
          this.platforms = res.data.data.platform
          this.UpDataId = this.platforms.id
          this.hosts = res.data.data.hosts || []
          let result = [res.data.data.platform]
          this.migrantData = result
        })
      }
    },
    ...mapMutations('access', {
      GETINFO: 'getinfo',
      comData: 'comData',
    }),
    cancels() {
      for (let key in this.createHostBody) {
        this.createHostBody[key] = ''
      }
      this.delHostArr = []
      this.isEditDetector = false
      this.$refs.multipleTable.clearSelection()
    },
    saveDetector(hostType) {
      if (hostType == '新增') {
        this.$refs['deviceModel'].validate((valid) => {
          if (valid) {
            let body = {
              platformId: this.createPLatFromID, // 必须
              uniqueId: this.createHostBody.uniqueId, // 唯一标识id
              name: this.createHostBody.name, // 主机名称
              type: this.createHostBody.type, //主机类型
              brand: this.createHostBody.brand, // 品牌
              modelNum: this.createHostBody.modelNum, // 型号
              assetCode: this.createHostBody.assetCode,
              readerNumber: this.createHostBody.readerNumber || 0, //读头通道数量
              guardNumber: this.createHostBody.guardNumber || 0, // 门禁通道数量
              inputNumber: this.createHostBody.inputNumber || 0, //报警输入数量
            }
            if (this.createHostBody.type == '金库门禁') {
              body.type = 1
            } else if (this.createHostBody.type == '普通门禁') {
              body.type = 2
            } else {
              body.type = 3
            }
            creatHost(body).then((res) => {
              if (res.data.code != 0) {
                this.$notify({
                  title: '失败',
                  message: '门禁主机ID重复,创建失败!',
                  type: 'error',
                })
                return
              }
              this.isEditDetector = false
                this.$notify({
                  title: '成功',
                  message: `新建${this.createHostBody.type}主机成功`,
                  type: 'success',
                })
              getRmOrDelHostsList(`/resource/v1/guard/platform/${this.createPLatFromID}/host`).then((res) => {
                this.hosts = res.data.data
              })
              for (const key in this.createHostBody) {
                this.createHostBody[key] = ''
              }
              this.isEditDetector = false
              this.$refs['deviceModel'].resetFields() // 创建完毕之后清楚校验效果
            })
          } else {
            return false
          }
        })
      }
      if (hostType == '编辑') {
        // 编辑主机校验
        this.$refs['deviceModel'].validate((valid) => {
          if (valid) {
            let body = {
              platformId: this.createPLatFromID, // 必须
              assetCode: this.createHostBody.assetCode,
              uniqueId: this.createHostBody.uniqueId,
              name: this.createHostBody.name,
              id: this.createHostBody.id,
              type: this.createHostBody.type,
              brand: this.createHostBody.brand,
              modelNum: this.createHostBody.modelNum,
              assetCode: this.createHostBody.assetCode,
              readerNumber: this.createHostBody.readerNumber || 0,
              guardNumber: this.createHostBody.guardNumber || 0,
              inputNumber: this.createHostBody.inputNumber || 0,
              // status: this.hostInfo.status,
            }
            if (this.createHostBody.type == '金库门禁') {
              body.type = 1
            } else if (this.createHostBody.type == '普通门禁') {
              body.type = 2
            } else {
              body.type = 3
            }

            // 修改主机
            removeHost(`/resource/v1/guard/host/${this.createHostBody.id}`, body).then((res) => {
              if (res.data.code != 0) {
                this.$notify({
                  title: '失败',
                  message: '门禁主机ID重复,修改失败!',
                  type: 'error',
              })
                return
              }
              this.isEditDetector = false
              this.loading = true
              this.$refs['deviceModel'].resetFields() // 创建完毕之后清楚校验效果
                for (const key in this.createHostBody) {
                this.createHostBody[key] = ''
              }
              let that = this
              setTimeout(() => {
                // 获取修改后的主机
                getHosts(that.platforms).then((res) => {
                  if(res.data.code != 0){
                    that.loading = false
                  }
                  that.hosts = res.data.data
                  that.loading = false
                  that.delHostArr = []
                  this.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success',
                  })
                })
              }, 300)
            })
          } else {
            return false
          }
        })
      }
      this.$refs.multipleTable.clearSelection()
    },
    /**
     * @description: 获取平台主机 主机在线可获取成功 调用远程接口
     * @param {type}: object 平台id
     * @return: code
     */
    getHos() {
      this.loading = true
      let that = this
      this.getHostTimer = setTimeout(() => {
        // 获取修改后的主机
        getZhiDhosts({ id: this.platforms.id }).then((res) => {
          if (res.data.code != 0) {
            this.$messageError('获取失败')
            this.loading = false
            return
          } else {
            getHosts({ id: this.platforms.id }).then((res) => {
              if (res.data.code != 0) {
                this.$messageError('获取失败')
                this.loading = false
              }
              this.hosts = res.data.data
              this.loading = false
              this.$messageSuccess('获取完毕')
            })
          }
          clearTimeout(this.getHostTimer)
        })
      }, 500)
    },
    onceClick(val) {
      let { tierType } = val
      if (tierType == 'org') {
        //机构
        let { name, id } = val
        this.createHost.jigou = name
        this.createHost.jigouId = id
        this.$refs.hh.dbGetList(id, ' ') // 如果是结构 部位id就不传
      } else if (tierType == 'loc') {
        // 重点部位
        let { name, id } = val
        this.createHost.buwei = name
        this.createHost.buweiId = id
        this.$refs.hh.dbGetList(' ', id)
      }
      // console.log('Log asd ', val)
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    select(s, row) {
      this.delHostArr = s
      let RmObj = row
      this.createHostBody = this.$lodash.cloneDeep(RmObj)

      for (let key in this.createHostBody) {
        if (key == 'type') {
          if (this.createHostBody[key] == 1) {
            this.createHostBody[key] = '金库门禁'
          } else if (this.createHostBody[key] == 2) {
            this.createHostBody[key] = '普通门禁'
          } else {
            this.createHostBody[key] = '互锁门门禁'
          }
        }
      }
      this.createHostBody.readerNumber = Number(this.createHostBody.readerNumber)
      this.createHostBody.guardNumber = Number(this.createHostBody.guardNumber)
      this.createHostBody.inputNumber = Number(this.createHostBody.inputNumber)
      this.createHostBody = {
        platformId: this.createPLatFromID || '', // 必修
        assetCode: this.createHostBody.assetCode || '',
        uniqueId: this.createHostBody.uniqueId || '',
        name: this.createHostBody.name || '',
        id: this.createHostBody.id || '',
        type: this.createHostBody.type || '',
        brand: this.createHostBody.brand || '',
        modelNum: this.createHostBody.modelNum || '',
        readerNumber: this.createHostBody.readerNumber || 0,
        guardNumber: this.createHostBody.guardNumber || 0,
        inputNumber: this.createHostBody.inputNumber || 0,
      }
    },
    /**
     * @description: 主机增删改统一处理Fn
     * @param {type}: 无
     * @return: 无
     */
    Multifunction(v) {
      switch (v.target.title) {
        case '获取主机信息':
          this.clickHostType = '获取主机信息'

          break
        case '新增':
          this.clickHostType = '新增'
          break
        case '编辑':
          /* fn... */
          this.clickHostType = '编辑'
          if (this.hosts.length < 1) {
            this.$notify({
              title: '失败',
              message: '暂无主机',
              type: 'error',
            })
            return
          }
          if (this.delHostArr.length < 1) {
            this.$notify({
              title: '失败',
              message: '请选择要编辑的门禁主机',
              type: 'warning',
            })
            return
          }
          if(this.delHostArr.length > 1){
              this.$notify({
                title: '失败',
                message: '不支持多选编辑!',
                type: 'warning',
              })
              return
            }
            this.isEditDetector = true
          break
        case '删除':
          break
        case '刷新':
          break
        default:
          break
      }
    },
    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },
    print() {
      printJS({ printable: 'tables', type: 'html' })
    },
    viewList(a) {
      // this.isMigrate = !this.isMigrate
    },
    sorts() {
      this.chageCompoents = 'TableSort'
      this.isMigrate = !this.isMigrate
    },
    //查看页面迁移
    viewMig() {
      this.chageCompoents = 'Migrate'
      this.isMigrate = !this.isMigrate
    },
    // 删除当前修改的平台并返回列表
    backList() {
      let idsArr = []
      idsArr.push(this.UpDataId)
      del({ ids: idsArr }).then((res) => {
        // this.$emit('backlist', 123)
      })
      this.$parent.$parent.childrenComponent = 'List'
    },
    handleSelectionChange(val) {
      this.delList = val
    },
    cuurtRow(row, column, event) {
      console.log('Log', row, column, event)
    },
    collapseChange(chageItem) {},

    chageType(comType, data) {
      console.log(comType)
      if (comType == 'Create') {
        //新建按钮
        this.$emit(
          'modelChange',
          {
            title: 'Create',
          },
          'Create'
        )
        comType = comType
        console.log('xxxxxxxxxx',this.$parent.$parent);
        this.$parent.$parent.childrenComponent = 'Create'
      } else if (comType === 'Update') {
        this.comData(JSON.parse(JSON.stringify(this.platforms)))
        this.$parent.$parent.childrenComponent = 'Update'
        this.$emit('modelChange', this.platforms, true)
      }
    },
    handleSizeChange() {},
    handleCurrentChange() {},
  },
  created() {
    //新建门禁主机类型
    let hostTypes = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '6' }]
    let HostQueryList = hostTypes
    brandOrModelNum({ queryList: HostQueryList }).then((res) => {
      this.CreatehostType = res.data.data[0].attr
    })
    //新建门禁主机品牌
    let hostBrands = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '4' }]
    let HostBrandsType = hostBrands
    brandOrModelNum({ queryList: HostBrandsType }).then((res) => {
      this.hostBrands = res.data.data[0].attr
    })
  },
  mounted() {
    if (this.createPLatFromID) {
      getDetal(this.createPLatFromID).then((res) => {
        console.log('Log ---------------?', res)
        this.platforms = res.data.data.platform
        this.UpDataId = this.platforms.id
        // this.hosts = res.data.data.hosts || []
        let { updatedAt, updatedBy, updatedDept } = this.platforms
        let obj = {
          updatedAt,
          updatedBy,
          updatedDept,
        }
        this.Infos = obj
        let result = [res.data.data.platform]
        result &&
          result.forEach((item) => {
            this.migrantData.push({
              id: item.id,
              name: item.name,
            })
          })
      })
    } else {
      // alert('新建平台后进来的')
      getDetal(this.updataToViewPageId).then((res) => {
        console.log('Log ---------------?', res)
        this.platforms = res.data.data.platform
        this.UpDataId = this.platforms.id
        // this.hosts = res.data.data.hosts || []
        let result = [res.data.data.platform]
        result &&
          result.forEach((item) => {
            this.migrantData.push({
              id: item.id,
              name: item.name,
            })
          })
      })
    }

    for(let i = 0; i < 200; i++){
      this.hosts.push({name:i,id:i})
    }
  },
}
</script>

<style lang="less" scoped>
#vsd {
  width: 100%;
  height: 100%;
  padding: 10px;
  .isMig {
    height: 100%;
  }
  .fx {
    display: flex;
    height: calc(~'100% - 40px');
    height: 100%;
    .treeLeft {
      height: 100%;
      border-right: 1px solid #e6e6e6;
      width: 240px;
      .treeBox {
        width: 240px;
        .tree {
          width: 240px;
        }
      }
      /deep/ .el-input__inner {
        width: 230px;
      }
    }
    .right {
      height: 100%;
      width: calc(~'100% - 200px');
      padding: 10px;
      border: 5px solid #eaeef3;

      .saveBtns {
        padding: 10px 0;
      }
      .tables {
        padding: 10px 0;
        .form-box {
          width: 80%;
          height: auto;
          margin: 0 auto;
          .form-content {
            display: flex;
            font-size: 12px;
            border-top: 1px solid rgba(225, 225, 225, 1);
            border-left: 1px solid rgba(225, 225, 225, 1);
            border-right: 1px solid rgba(225, 225, 225, 1);
            .left-form {
              width: 50%;
            }
            .right-form {
              width: 50%;
            }
            /deep/ .el-form-item {
              margin-bottom: 0px !important;
              border-bottom: 1px solid rgba(225, 225, 225, 1);
              .el-select {
                width: 100%;
              }
              span {
                padding-left: 10px;
              }
            }
            /deep/ .el-form-item__label {
              background: rgba(245, 245, 245, 1);
              padding: 0 10px;
              line-height: 35px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(33, 33, 33, 1);
            }
            /deep/ .el-form-item__content {
              line-height: 35px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(33, 33, 33, 1);
            }
            /deep/ .el-form-item:last-child {
              border-bottom: 1px solid #e6e6e6;
            }
          }
          .form-footer {
            width: 100%;
            margin-top: 40px;
            text-align: center;
          }
        }
        .collapse-item {
          width: 100%;
          margin-bottom: 10px;
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
          .list-header {
            text-align: right;
            margin-bottom: 10px;
            i {
              cursor: pointer;
              width: 35px;
              margin-right: 10px;
              font-size: 16px;
              height: 28px;
              line-height: 20px;
              border: 1px solid #e1e1e1;
              border-radius: 3px;
              line-height: 28px;
              text-align: center;
            }
          }
        }
      }
      .bottomInfo {
        margin: 20px 0;
        #userInfo {
          .box {
            display: flex;
            border: 1px solid rgba(225, 225, 225, 1);
            margin: 0 auto;
            .boxItem {
              display: flex;
              flex: 1;
              height: 35px;
              .itemTitle {
                padding: 0 10px;
                width: 30%;
                height: 35px;
                display: block;
                text-align: center;
                background: #f5f5f5;
                height: 35px;
                line-height: 35px;
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(33, 33, 33, 1);
              }
              span {
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(33, 33, 33, 1);
                line-height: 35px;
                padding: 0 10px;
              }
            }
          }
        }
      }
    }
  }
  /deep/ .el-collapse-item__header {
    text-align: center;
  }
  /deep/ .el-input__inner {
    width: 240px;
  }
}
</style>
<style lang="less">
@media print {
  #contentinfo {
    .form-box {
      width: 80%;
      height: auto;
      border: 1px solid rgba(225, 225, 225, 1);
      .form-content {
        display: flex;
        font-size: 12px;
        border: 1px solid rgba(225, 225, 225, 1);
        // border-top: 1px solid rgba(225, 225, 225, 1);
        // border-left: 1px solid rgba(225, 225, 225, 1);
        // border-right: 1px solid rgba(225, 225, 225, 1);
        .left-form {
          width: 50%;
        }
        .right-form {
          width: 50%;
        }
        /deep/ .el-form-item {
          margin-bottom: 0px !important;
          // border-bottom: 1px solid rgba(225, 225, 225, 1);
          .el-select {
            width: 100%;
          }
          span {
            padding-left: 10px;
          }
        }
        /deep/ .el-form-item__label {
          background: rgba(245, 245, 245, 1);
          padding: 0 10px;
          line-height: 35px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(33, 33, 33, 1);
        }
        /deep/ .el-form-item__content {
          line-height: 35px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(33, 33, 33, 1);
          margin-left: -20px;
        }
        /deep/ .el-form-item:last-child {
          // border-bottom: 1px solid #e6e6e6;
        }
      }
      .form-footer {
        width: 100%;
        margin-top: 40px;
        text-align: center;
      }
    }
    .bottomInfo {
      margin: 20px 0;
      #userInfo {
        .box {
          display: flex;
          border: 1px solid rgba(225, 225, 225, 1);
          margin: 0 auto;
          .boxItem {
            display: flex;
            flex: 1;
            height: 35px;
            .itemTitle {
              padding: 0 10px;
              width: 30%;
              height: 35px;
              display: block;
              text-align: center;
              background: #f5f5f5;
              height: 35px;
              line-height: 35px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(33, 33, 33, 1);
            }
            span {
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(33, 33, 33, 1);
              line-height: 35px;
              padding: 0 10px;
            }
          }
        }
      }
    }
    .collapse-item {
      width: 100%;
      margin-bottom: 10px;
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
      .list-header {
        text-align: right;
        i {
          cursor: pointer;
          margin-right: 10px;
          font-size: 16px;
          height: 20px;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
