<template>
  <div class="creat-box">
    <div class="content" v-if="isView">
      <!-- updataItem -->
      <div class="main">
        <div class="treeLeft">
          <treeBox
            :lazyTreeApi="getTreeApi"
            searchType="filter"
            :treeType="treeType"
            @onceClick="onceClick"
            treeLazyToggle
            iconToggle
            @clickData="playBackGetData"
          ></treeBox>
        </div>
        <div class="rightCreate">
          <div class="top">
            <div class="header">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
                <el-breadcrumb-item>门禁管理</el-breadcrumb-item>
                <el-breadcrumb-item>门禁平台配置</el-breadcrumb-item>
                <el-breadcrumb-item>新建</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
          <!-- 创建门禁平台 -->
          <div>
            <el-collapse value="1">
              <el-collapse-item title name="1">
                <p style="text-align:center;padding:10px 0">新建门禁平台</p>
                <div class="form-box">
                  <div class="form-content">
                    <div class="left-form">
                      <el-form
                        :model="createPlatformBody"
                        size="mini"
                        label-position="right"
                        ref="deviceModel"
                        label-width="120px"
                        :rules="rules"
                      >
                        <el-form-item label="门禁平台名称" prop="name">
                          <el-input v-model="createPlatformBody.name"></el-input>
                        </el-form-item>
                        <el-form-item prop="orgName" label="所属机构">
                          <el-input v-model="createPlatformBody.orgName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="品牌" prop="brand">
                          <el-select v-model="createPlatformBody.brand" @change="updateList">
                            <el-option
                              v-for="(item, index) in brands"
                              :key="index"
                              :label="item.data"
                              :value="item.data"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="IP地址" prop="ip">
                          <el-input v-model="createPlatformBody.ip"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名" prop="username">
                          <el-input v-model="createPlatformBody.username"></el-input>
                        </el-form-item>
                        <!-- prop="accessService" -->
                        <el-form-item label="接入服务器" prop="accessService">
                          <el-select v-model="createPlatformBody.accessService">
                            <el-option
                              v-for="item in accessServiceArr"
                              :key="item.value"
                              :label="item.value"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-form>
                    </div>
                    <div class="right-form">
                      <el-form
                        :model="createPlatformBody"
                        size="mini"
                        label-position="right"
                        ref="deviceModel2"
                        label-width="120px"
                        :rules="rules"
                      >
                        <el-form-item label="资产编码" prop="assetCode">
                          <el-input v-model="createPlatformBody.assetCode"></el-input>
                        </el-form-item>
                        <el-form-item label="所属重点部位" prop="keyPartName">
                          <el-select v-model="createPlatformBody.keyPartName" disabled @change="keyPartChange">
                            <el-option
                              v-for="item in keyParts"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="型号" prop="modelNum">
                          <el-select v-model="createPlatformBody.modelNum" @change="changeModelNums">
                            <el-option
                              v-for="(item, index) in modelNums"
                              :key="index"
                              :label="item.data"
                              :value="item.data"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="端口" prop="port">
                          <el-input placeholder v-model="createPlatformBody.port"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                          <el-input
                            :type="isShowPassword ? 'password' : 'text'"
                            placeholder
                            v-model="createPlatformBody.password"
                          >
                            <i @click="isShowPassword = !isShowPassword" slot="suffix" class="el-icon-view"></i>
                          </el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                  <div id="userInfo">
                    <ul class="box">
                      <li class="boxItem">
                        <i class="itemTitle">录入时间</i>
                        <span>{{ updatedAt || '--' }}</span>
                      </li>
                      <li class="boxItem">
                        <i class="itemTitle">录入机构</i>
                        <span>{{ updatedDept || '--' }}</span>
                      </li>
                      <li class="boxItem">
                        <i class="itemTitle">录入人</i>
                        <span>{{ updatedBy || '--' }}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="form-footer">
                    <el-button
                      type="primary"
                      size="mini"
                      :disabled="platFormLogin"
                      :loading="platFormLogin"
                      style="margin-right:10px;"
                      @click="saveDevice()"
                      >{{ platFormLogin ? '登录中' : '保存' }}</el-button
                    >
                    <el-button size="mini" @click="cancel" style="margin-right:10px;">取消</el-button>
                    <el-button size="mini" @click="reset">重置</el-button>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
    <viewPage
      :isView="isView"
      v-if="!isView"
      @modelChange="modelChange"
      :ViewTableData="tableData"
      :afterUpdata="afterUpdataItem"
      :host="host"
      :createItem="createItem"
      :createPLatFromID="createPLatFromID"
      :Info="Info"
      :updateId="platformId"
      @backlist="toList"
    />
  </div>
</template>

<script>
import {
  manCreate,
  getAccessList,
  getPlatformListT,
  AccessmModify,
  getDetal,
  getPlatformList,
  getTreeApi,
  getHosts
} from '@src/http/access/accessMan'
import { creatHost, removeHost, delHostList, getRmOrDelHostsList } from '@src/http/access/host'
import { getServeId, brandOrModelNum } from '@src/http/access/getId'
import { getZhiDhosts } from '@src/http/access/control'
import { mapState, mapMutations, mapActions } from 'vuex'
import { time } from '@src/view/accessControl/components/formData.js'
export default {
  props: {
    planPop: {
      type: Object
    },
    updataItem: {
      type: Object
    },
    optType: {
      type: String
    },
    qianyiItem: {
      type: Object
    },
    treeData: {
      type: Object
    },
    updata: {
      type: Boolean
    },
    listflag: {
      type: Boolean
    }
  },
  name: 'Create',
  components: {
    treeBox: () => import('@src/components/tree/treeBox'),
    userInfo: () => import('@src/view/accessControl/components/userInfo'),
    TabMenu: () => import('../../components/tabMenu'),
    viewPage: () => import('./ViewPage'),
    UpDataHost: () => import('./Update')
  },
  data() {
    // ip
    var validcodeip = (rule, value, callback) => {
      const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('IP不合法'))
      }
    }
    // prot
    var validcodePort = (rule, value, callback) => {
      const regPort = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
      if (regPort.test(value)) {
        callback()
      } else {
        return callback(new Error('port不合法'))
      }
    }

    return {
      platFormLogin: false,
      updatedAt: '',
      updatedDept: '',
      updatedBy: '',
      isShowPassword: true,
      endTime: '',
      up: 0,
      keyParts: [],
      brands: [],
      modelNums: [],
      platformDatas: {},
      createPlatform: {
        orgName: '',
        orgId: '',
        locName: '',
        keyPartId: '',
        keyPartType: ''
      },
      accessServiceArr: '',
      value: '',
      createPLatFromID: '',
      createItem: {},
      afterUpdataItem: {}, // 修改的某一项展示
      platformId: '', //修改平台id
      updatePlform: {}, //修改平台接口回来的平台数据
      platfirmInfo: {
        orgName: '',
        locName: ''
      },
      cloneDeepHostInfo: {},
      serveArr: [],
      delHostArr: [],
      hostInfo: {},
      clickHostType: '',
      isKeyPart: false,
      // 创建门禁平台参数
      createPlatformBody: {
        orgName: '', // 所属机构
        keyPartName: '',
        orgId: '',
        keyPartId: '',
        keyPartType: '',
        assetCode: '',
        name: '',
        brand: '',
        modelNum: '',
        username: '',
        password: '',
        ip: '',
        port: '',
        accessService: '',
        keyPartType: '',
        sdk: ''
      },
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
        status: '' // 在线状态 1 离线 2在线
      },
      locId: '',
      treeType: 2,
      host: [],
      createData: {},
      addHostList: {},
      AllmodelNums: [],
      // optType:'',
      rule: {},
      afterUpdata: {},
      tableCuurtItem: [],
      isEditDetector: false,
      loading: false,
      passes: [],
      dropdownStatus: {
        videoChan: true,
        audioChan: false,
        inputChan: false
      },

      isView: true,
      childrenComponent: '',
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      activeNames: ['1'],
      tabList: [],
      tableData: [],
      Info: {},
      viewListNeedID: '',
      userInfo: {},
      /* 表单验证 */
      rules: {
        name: [
          { required: true, message: '平台名称不可为空', trigger: 'change' },
          { min: 1, max: 64, message: '名称在 1 到 64 个字符', trigger: 'change' }
        ],
        orgName: [{ required: true, message: '机构名字必须存在', trigger: 'change' }],
        brand: [{ required: true, message: '品牌必须存在', trigger: 'change' }],
        ip: [
          { required: true, message: 'IP不可为空', trigger: 'change' },
          {
            validator: validcodeip,
            trigger: 'change'
          }
        ],
        username: [{ required: true, message: '名字不能为空', trigger: 'change' }],
        accessService: [{ required: true, message: '接入协议不可为空', trigger: 'change' }],
        keyPartName: [{ required: true, message: '不可为空', trigger: 'change' }],
        modelNum: [{ required: true, message: '请选择型号', trigger: 'change' }],
        port: [
          { required: true, message: '请输入端口', trigger: 'change' },
          {
            validator: validcodePort,
            trigger: 'change'
          }
        ],
        assetCode: [
          { message: '必填', trigger: 'change' },
          { min: 1, max: 64, message: '不可超过64位', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
        keyPartId: [{ required: true, message: '重点部位不可为空', trigger: 'change' }]
      },
      messageEd: {}
    }
  },
  methods: {
    playBackGetData(data) {
      if (JSON.stringify(data) !== '{}') {
        this.messageEd = data
      }
    },
    keyPartChange(data) {
      // debugger
      // console.log('Log-----------------', data)
      let selectData = this.keyParts.filter(i => i.value === data)[0]
      this.$forceUpdate()
      this.createPlatformBody.keyPartType = selectData.type
    },

    toList(a) {
      // 查看页面点击新建需要跳到新建页面 机构数显示问题
      // this.$parent.$parent.childrenComponent = 'List'
    },
    cancels() {
      for (let key in this.createHostBody) {
        this.createHostBody[key] = ''
      }
      this.isEditDetector = false
    },
    ...mapActions('access', {
      getBrand: 'getBrand'
    }),
    ...mapMutations('access', {
      GETINFO: 'getinfo'
    }),
    //主机刷新
    Refresh() {
      this.getHostTDlist('刷新完毕')
    },
    // changeSelect(value) {
    //   let AllmodelNums = this.AllmodelNums
    //   let modelNums = []
    //   for (let v of AllmodelNums) {
    //     if (v.homeClass == value) {
    //       modelNums.push(v)
    //     }
    //   }
    //   console.log('xxxxxxxxx', this.modelNums)
    // },
    delHost() {
      if (this.host.length < 1) {
        this.$message({
          message: '暂无主机数据,请添加',
          type: 'warning'
        })
        return
      } else if (this.delHostArr.length < 1) {
        this.$message({
          message: '请选择要删除的主机',
          type: 'warning'
        })
        return
      } else {
        this.$confirm('此操作将删除指定主机, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let idsArr = this.delHostArr
              .map(item => item.id)
              .join()
              .split(',')
            let ids = idsArr
            delHostList({ ids: idsArr }).then(res => {
              // this.$refs.multipleTable.clearSelection()
              this.isEditDetector = false
              // this.dbGetList()
              this.loading = true
              setTimeout(() => {
                getRmOrDelHostsList(`/resource/v1/guard/platform/${this.platformId}/host`).then(res => {
                  // console.log('Log 查看数据完成', res)
                  this.$message({
                    type: 'success',
                    message: '删除主机成功'
                  })
                  this.host = res.data.data
                })
                this.loading = false
              }, 1000)
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    getKeyPartSelect(oId, kId) {
      let _this = this
      // 获取机构下的重点部位
      _this.keyParts = []
      let params = {
        type: 2,
        oId: oId,
        subSystem: '3',
        isRecursion: '0'
      }
      getTreeApi(params).then(res => {
        if (res.data.code === 0) {
          if (kId) {
            _this.createPlatformBody.keyPartId = kId
          }
          let data = res.data.data.nodes
          data.forEach(item => {
            if (item.tierType === 'loc') {
              _this.keyParts.push({
                label: item.name,
                value: item.id,
                type: item.keyPartType
              })
            }
          })
        }
      })
    },
    onceClick(val, node) {
      // console.log('Log 查看门禁平台新建页面的机构数据源', val)
      let { tierType } = val
      if (tierType == 'org') {
        this.createPlatformBody.orgId = val.id
        this.createPlatformBody.orgName = val.name
        // this.getKeyPartSelect(val.serial)
        this.$set(this.createPlatformBody, 'keyPartType', '')
        this.$set(this.createPlatformBody, 'keyPartId', '')
        this.$set(this.createPlatformBody, 'keyPartName', '')

        this.Info = {
          updatedAt: this.createPlatform.orgName,
          updatedBy: this.createPlatform.username
        }
        // this.GETINFO(UserInfo)
      } else {
        let parentNode = node.parent
        if (!parentNode) return
        this.createPlatformBody.orgId = (parentNode.data && node.parent.data.id) || ''
        this.createPlatformBody.orgName = (parentNode.data && node.parent.data.name) || ''
        // this.getKeyPartSelect(parentNode.data.serial, val.id)
        this.$set(this.createPlatformBody, 'keyPartType', val.keyPartType)
        this.$set(this.createPlatformBody, 'keyPartId', val.id)
        this.$set(this.createPlatformBody, 'keyPartName', val.name)

        let { name, id, keyPartType } = val
        this.platfirmInfo.locName = name
        this.Info = {
          updatedAt: this.createPlatform.orgName,
          updatedBy: this.createPlatform.username
        }
      }
      this.isKeyPart = val.tierType == 'loc' ? true : false //平台只能创建在重点部位下面

      let UserInfo = {
        updatedAt: this.createPlatform.orgName,
        updatedBy: this.createPlatform.username
      }
      // this.GETINFO(UserInfo)
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },

    // 获取平台下的主机及所属通道信息
    getHostTDlist(type) {
      // console.log('Log 查看平台id', this.updataItem)
      let { id } = this.updataItem
      let params = {
        id: this.platformId
      }
      this.loading = true
      getZhiDhosts(params).then(res => {
        // console.log('Log 查看指定平台下的所有主机是否成功?', res)
        if (res.data.code != 0) {
          // this.$message({
          //   message: '服务器繁忙',
          //   type: 'success',
          // })
          this.loading = false
          // return
        }
        setTimeout(() => {
          getHosts({ id: this.platformId }).then(res => {
            // console.log('Log ???---------', res)
            this.$notify({
              title: '成功',
              message: type == '刷新完毕' ? type : '更新主机成功',
              type: 'success'
            })
            this.host = res.data.data
            this.loading = false
          })
        }, 1000)
        // }
      })
    },
    //保存切换查看页面  门禁平台
    saveDevice() {
      this.$refs['deviceModel'].validate(valid => {
        if (valid) {
          this.$refs['deviceModel2'].validate(valid2 => {
            if (valid2) {
              let body = this.createPlatformBody
              if (!this.isKeyPart) {
                this.$notify.error({
                  title: '失败',
                  message: '该节点不是重点部位,无法创建平台!',
                  type: 'success'
                })
                return
              }
              // 创建门禁平台
              this.createPlatformBody.port = Number(this.createPlatformBody.port) // 创建平台端口必须为Number
              this.platFormLogin = true
              manCreate(this.createPlatformBody)
                .then(res => {
                  if (res.data.code != 0) {
                    this.$messageError('IP或端口重复')
                    this.platFormLogin = false
                    return
                  }
                  this.createPLatFromID = res.data.data.id
                  this.$notify({
                    title: '成功',
                    message: '新建平台成功',
                    position: 'top-right',
                    type: 'success'
                  })
                  // 创建平台入参
                  let params = {}
                  if (this.messageEd.tierType === 'loc') {
                    params.keyPartId = this.messageEd.id
                  } else if (this.messageEd.tierType === 'org') {
                    params.orgId = this.messageEd.id
                    this.orgId = this.messageEd.id
                  }
                  this.endTime = time(new Date())
                  // 刷新列表
                  getAccessList(params).then(res => {
                    this.createItem = res.data.data.platforms[0]
                    this.platFormLogin = false
                  })
                  this.isView = true
                  this.childrenComponent = 'viewPage'
                  this.tabList = ['基础信息', '门禁平台管理', '新建']
                  this.isView = false

                  // 创建表单清空
                  this.createPlatformBody = {
                    orgName: '', // 所属机构
                    keyPartName: '',
                    orgId: '',
                    keyPartId: '',
                    keyPartType: '',
                    assetCode: '',
                    name: '',
                    brand: '',
                    modelNum: '',
                    username: '',
                    password: '',
                    ip: '',
                    port: '',
                    accessService: '',
                    keyPartType: '',
                    sdk: ''
                  }
                  this.$refs['deviceModel'].resetFields()
                  this.$refs['deviceModel2'].resetFields()
                })
                .catch(err => {})
            } else {
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    select(s, row) {
      this.hostInfo = row

      console.log('------------', this.hostInfo)
      this.cloneDeepHostInfo = row
      this.delHostArr = s
      // console.log('Log 查看勾选的主机信息?', this.hostInfo)
      this.tableCuurtItem = s
      this.addHostList = row
    },
    prompt(promptVal, fn, args) {
      return fn(args)
        .then(res => {
          /* .... */
          let { success, error } = promptVal
          if (success.trim()) {
            this.$message({
              message: success,
              type: 'success'
            })
          }
        })
        .catch(err => {
          /* ... */
          this.$message({
            message: '服务器错误',
            type: 'error'
          })
        })
    },
    //
    async saveDetector(hostType) {
      if (hostType == '新增') {
        this.isEditDetector = false
        let { keyPartType, keyPartId, id, subSystem, orgId } = this.updataItem
        // console.log('Log -----------', this.createPLatFromID)
        this.createHostBody.platformId = id
        // 创建门禁主机
        await creatHost(this.createHostBody).then(res => {
          // console.log('Log ??/', res)
          this.$message({
            message: '新建主机成功',
            type: 'success'
          })
          getRmOrDelHostsList(`/resource/v1/guard/platform/${id}/host`).then(res => {
            // console.log('Log 查看数据完成', res)
            this.host = res.data.data
          })
        })
      }
      if (hostType == '编辑') {
        this.isEditDetector = false
        let body = {
          assetCode: this.hostInfo.assetCode,
          uniqueId: this.hostInfo.uniqueId,
          name: this.hostInfo.name,
          id: this.hostInfo.id,
          type: this.hostInfo.type,
          brand: this.hostInfo.brand,
          modelNum: this.hostInfo.modelNum,
          readerNumber: this.hostInfo.readerNumber,
          guardNumber: this.hostInfo.guardNumber,
          inputNumber: this.hostInfo.inputNumber,
          status: this.hostInfo.status
        }
        // 修改主机
        removeHost(`/resource/v1/guard/host/${this.updataItem.id}`, this.cloneDeepHostInfo).then(res => {
          // console.log('Log 主机是否修改成功?', res)
          this.loading = true
          setTimeout(() => {
            getHosts(this.updataItem).then(res => {
              // 获取修改后的主机
              // console.log('Log ???---------', res)
              this.host = res.data.data
              this.$message({
                message: '编辑主机成功',
                type: 'success'
              })
              this.loading = false
              this.isEditDetector = false
            })
          }, 1000)

          // this.$refs.multipleTable.clearSelection()
        })
      }
      if (hostType == '删除') {
        this.isEditDetector = false
      }
      for (const key in this.createHostBody) {
        this.createHostBody[key] = ''
      }
    },
    Multifunction(v) {
      // 获取指定平台下的主机列表
      switch (v.target.title) {
        case '获取主机信息':
          this.clickHostType = '获取主机信息'
          return
          // alert('xxxxxxxxxxx')
          this.loading = true
          setTimeout(() => {
            getHosts(this.updataItem).then(res => {
              // console.log('Log 查看指定平台下的所有主机', res)
              this.host = res.data.data.hosts
              if (this.host.length < 1) {
                this.$message({
                  message: '暂无主机信息,请添加主机后查看',
                  type: 'warning'
                })
              } else {
                this.$message({
                  message: '获取主机信息成功',
                  type: 'success'
                })
              }

              this.loading = false
            })
          }, 1000)
          break
        case '新增':
          /* fn... */
          this.clickHostType = '新增'
          return
          let param = {}
          if (false) {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
          }
          this.isEditDetector = true
          break
        case '编辑':
          this.clickHostType = '编辑'
          if (this.host.length < 1) {
            this.$message({
              message: '暂无主机',
              type: 'error'
            })
            return
          }
          if (this.delHostArr.length < 1) {
            this.$message({
              message: '请选择主机',
              type: 'error'
            })
            return
          }
          this.isEditDetector = true
          break
        case '删除':
          this.clickHostType = '删除'
          return
          if (false) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
          }
          break
        case '刷新':
          /* fn... */
          this.loading = true
          return
          setTimeout(() => {
            getHosts(this.updataItem).then(res => {
              // console.log('Log 查看指定平台下的所有主机', res)
              this.host = res.data.data.hosts
              this.$message({
                message: '刷新成功',
                type: 'success'
              })
            })
            this.loading = false
          }, 1000)
          break
        default:
          break
      }
    },
    modelChange(val, type) {
      this.isView = true
      // this.optType = 'Update'
    },
    tableRowClassName({ row, rowIndex }) {},
    clickRow(val) {},
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
    },
    //取消
    cancel() {
      this.$confirm('此操作返回列表页, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$parent.$parent.childrenComponent = 'List'
          this.$notify({
            title: '成功',
            message: '返回列表页成功',
            type: 'success'
          })
        })
        .catch(() => {})
    },
    //重置 清空表单fm
    reset() {
      this.$refs['deviceModel'].resetFields()
      this.$refs['deviceModel2'].resetFields()
      for (let key in this.createPlatformBody) {
        this.createPlatformBody[key] = ''
      }
    },
    //折叠面板fn
    collapseChange(chageItem) {},
    goBack() {
      this.$parent.$parent.childrenComponent = 'List'
    },
    changeModelNums(index) {
      this.modelNums.forEach(item => {
        if (index == item.data) {
          this.createPlatformBody.sdk = item.sdkName
        }
      })
    },
    updateList(index) {
      this.modelNums = []
      this.createPlatformBody.modelNum = ''
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '2' }]
      brandOrModelNum({ queryList }).then(res => {
        this.modelNums = res.data.data[0].attr
        let modelList = this.modelNums
        let arr = []
        modelList.filter(v => {
          if (v.homeClass == index) {
            arr.push(v)
          }
          this.modelNums = arr
        })
      })
    }
  },
  computed: {
    ...mapState('access', {
      treeInfo: 'treeInfo',
      brand: 'brand',
      modelNum: 'modelNum'
    })
  },
  watch: {
    treeInfo: {
      handler(val, oldVal) {
        // console.log('Log--------===========', val)
        this.Info = {
          updatedAt: this.updataItem.updatedAt,
          updatedDept: val.orgName,
          updatedBy: this.updataItem.updatedBy
        }
        this.createPlatformBody.orgName = val.orgName
        this.createPlatformBody.locName = val.locName
      },
      immediate: true // 默认立即触发一次
    }
  },
  created() {},
  mounted() {
    let brands = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '1' }]
    let queryList = brands
    brandOrModelNum({ queryList }).then(res => {
      this.brands = res.data.data[0].attr
    })
    if (this.updata == true) {
      getDetal(this.updataItem.id).then(res => {
        let resultData = res.data.data.platform
        this.platformDatas = this.$lodash.cloneDeep(resultData)
        // console.log('Log ------------------------', this.platformDatas)
        this.platformId = this.platformDatas.id
        this.host = res.data.data.hosts
      })
    }
    this.Info = {
      updatedAt: this.updataItem.updatedAt,
      updatedDept: this.updataItem.orgName,
      updatedBy: this.updataItem.updatedBy
    }
    this.createData = this.updataItem
    // 接入服务器接口
    getServeId({ servername: 'DA' }).then(res => {
      //this.createPlatformBody;
      let accessService = []
      res.data.filter((item, index) => {
        if (item.indexOf('DAPYTHON') > -1) {
          accessService.push({
            key: item,
            value: item
          })
        }
      })
      this.accessServiceArr = accessService
    })
    this.afterUpdata = this.updataItem
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    this.platformDatas = {}
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-form-item {
  margin-bottom: 20px !important;
}
.creat-box {
  width: 100%;
  height: calc(100% - 100px);
  display: flex;

  .content {
    width: 100%;
    .top {
      .header {
        margin-bottom: 10px;
      }
    }
    .main {
      // margin-top: 10px;
      display: flex;
      height: 100%;
      .treeLeft {
        height: 100%;
        border-right: 1px solid #e6e6e6;
        width: 290px;
        .treeBox {
          width: 290px;
          .tree {
            width: 290px;
          }
        }
      }
      .rightCreate {
        height: 100%;
        width: calc(~'100% - 200px');
        padding-right: 10px;
        border: 5px solid #eaeef3;
        padding: 10px;
        .form-box {
          width: 80%;
          height: auto;
          // margin: 90px 0 0 24px;
          margin-left: 24px;
          .form-content {
            display: flex;
            font-size: 12px;
            padding: 10px;
            background: rgba(245, 245, 245, 1);
            .left-form {
              width: 50%;
              margin-right: 24px;
            }
            .right-form {
              width: 50%;
            }
            /deep/ .el-form-item {
              margin-bottom: 13px !important;
              .el-select {
                width: 100%;
              }
              .el-input__suffix {
                .el-input__suffix-inner {
                  vertical-align: middle;
                }
              }
            }
            /deep/ .el-input__inner {
              // width: 240px;
              height: 35px;
              border-radius: 0px;
              line-height: 35px;
            }
            /deep/ .el-form-item__label {
              line-height: 35px;
            }
          }
          .form-footer {
            width: 100%;
            margin: 29px 0 0 0;
            text-align: center;
            /deep/ .el-button {
              width: 80px;
            }
          }
        }
        .block {
          text-align: center;
          margin: 20px 0;
          margin-left: -190px;
        }
        .colls {
          .collapses {
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
          /deep/ .el-input__inner {
            width: 240px;
          }
        }
      }
    }
    .footer {
      // overflow: hidden;
      // padding: 10px 0;
      ul {
        width: 850px;
        height: 30px;
        margin: 0 auto;
        text-align: left;
        border: 1px solid #e6e6e6;
        li {
          line-height: 30px;
          text-indent: 1em;
          display: inline-block;
          width: 30%;
          i {
            text-align: center;
            width: 60px;
          }
        }
      }
    }
  }
  /deep/ .el-collapse-item__content {
    padding: 0 !important;
    margin: 0 !important;
  }
  /deep/ .el-collapse {
    border: none;
  }
  /deep/ .el-collapse-item__header {
    display: none;
  }

  #userInfo {
    border: 1px solid rgba(225, 225, 225, 1);
    margin: 30px 0 0 0;
    .box {
      display: flex;
      margin: 0 auto;
      .boxItem {
        display: flex;
        flex: 1;
        height: 35px;
        .itemTitle {
          padding: 0 10px;
          width: 30%;
          display: block;
          text-align: center;
          background: #f5f5f5;
          line-height: 30px;
          height: 35px;
          line-height: 35px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(33, 33, 33, 1);
        }
        span {
          padding: 0 10px;
          height: 35px;
          line-height: 35px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(33, 33, 33, 1);
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
