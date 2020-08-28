<template>
  <div id="plormsUpdata">
    <div class="left">
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
    </div>
    <div class="right">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
        <el-breadcrumb-item>门禁管理</el-breadcrumb-item>
        <el-breadcrumb-item>门禁平台配置</el-breadcrumb-item>
        <el-breadcrumb-item>修改</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="hostAuto" style="overflow-y:auto;height: calc(100% - 40px);">
        <el-collapse :value="'1'">
          <el-collapse-item title name="1">
            <p style="text-align:center;padding:10px 0">修改门禁平台</p>
            <div class="form-box">
              <div class="form-content">
                <div class="left-form">
                  <el-form
                    :model="platformDatas"
                    size="mini"
                    label-position="right"
                    ref="platformRules"
                    label-width="120px"
                    :rules="platformRules"
                  >
                    <el-form-item label="门禁平台名称" prop="name">
                      <el-input v-model="platformDatas.name"></el-input>
                    </el-form-item>
                    <el-form-item label="所属机构" prop="orgName">
                      <el-input size="mini" disabled v-model="platformDatas.orgName"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌" prop="brand">
                      <el-select v-model="platformDatas.brand" @change="updateList">
                        <el-option
                          v-for="(item, index) in brands"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="IP地址" prop="ip">
                      <el-input v-model="platformDatas.ip"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="username">
                      <el-input v-model="platformDatas.username"></el-input>
                    </el-form-item>
                    <el-form-item label="接入服务器" prop="accessService">
                      <el-select v-model="platformDatas.accessService">
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
                    :model="platformDatas"
                    size="mini"
                    label-position="right"
                    ref="ruleForm"
                    label-width="120px"
                    :rules="platformRules"
                  >
                    <el-form-item label="资产编码" prop="assetCode">
                      <el-input size="mini" v-model="platformDatas.assetCode"></el-input>
                    </el-form-item>
                    <el-form-item label="所属重点部位" prop="keyPartName">
                      <el-input disabled v-model="platformDatas.keyPartName"></el-input>
                    </el-form-item>
                    <el-form-item label="型号" prop="modelNum">
                      <el-select v-model="platformDatas.modelNum" @change="changeModelNums">
                        <el-option
                          v-for="(item, index) in modelNums"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="端口" prop="port">
                      <el-input placeholder v-model="platformDatas.port"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                      <el-input type="password" placeholder v-model="platformDatas.password"></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="form-footer">
                <el-button type="primary" size="mini" style="margin-right:10px;" @click="savePlatform">保存</el-button>
                <el-button size="mini" @click="cancel" style="margin-right:10px;">取消</el-button>
                <el-button size="mini" @click="reset">重置</el-button>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="colls">
          <div class="collapses">
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
                <div class="tableLoading">
                  <el-table
                    ref="multipleTable"
                    :data="host"
                    tooltip-effect="dark"
                    style="width: 100%"
                    v-loading="loading"
                    @select="select"
                    @select-all="selectAll"
                  >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column show-overflow-tooltip label="门禁主机名称" width="120">
                      <template slot-scope="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="uniqueId"
                      label="门禁主机ID"
                      width="120"
                    ></el-table-column>
                    <el-table-column show-overflow-tooltip label="门禁主机类型">
                      <template slot-scope="scope">
                        <span v-show="scope.row.type == 1">金库门禁</span>
                        <span v-show="scope.row.type == 2">普通门禁</span>
                        <span v-show="scope.row.type == 3">互锁门门禁</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="brand" label="品牌" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="modelNum" label="型号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="assetCode" label="资产编码" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="guardNumber" label="门禁通道数量" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="readerNumber" label="读头通道数量" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="inputNumber" label="报警输入数量" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
          <el-dialog
            :title="clickHostType"
            :showClose="false"
            :close-on-click-modal="false"
            :visible.sync="isEditDetector"
            width="400px"
            v-if="isEditDetector"
          >
            <!--  v-if="clickHostType == '新增'" -->
            <el-form
              :model="createHostBody"
              size="mini"
              label-position="right"
              label-width="120px"
              ref="deviceModel"
              :rules="rules"
            >
              <el-form-item label="门禁主机名称" prop="name">
                <el-input v-model="createHostBody.name"></el-input>
              </el-form-item>
              <el-form-item label="门禁主机ID" prop="uniqueId">
                <el-input type="number" v-model="createHostBody.uniqueId"></el-input>
              </el-form-item>
              <el-form-item label="主机类型" prop="type">
                <el-select v-model="createHostBody.type">
                  <el-option
                    v-for="(item, index) in CreatehostType"
                    :key="index"
                    :label="item.data"
                    :value="item.data"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="品牌" prop="brand">
                <el-select v-model="createHostBody.brand" @change="changeBrans">
                  <el-option
                    v-for="(item, index) in hostBrands"
                    :key="index"
                    :label="item.data"
                    :value="item.data"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="型号" prop="modelNum">
                <el-select v-model="createHostBody.modelNum" @change="hostSdk">
                  <el-option
                    v-for="(item, index) in hostModelNums"
                    :key="index"
                    :label="item.data"
                    :value="item.data"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="资产编码" prop="assetCode">
                <el-input v-model="createHostBody.assetCode"></el-input>
              </el-form-item>
              <el-form-item label="读头通道数量" prop="readerNumber">
                <el-input v-model.number="createHostBody.readerNumber"></el-input>
              </el-form-item>
              <el-form-item label="门禁通道数量" prop="guardNumber">
                <el-input v-model.number="createHostBody.guardNumber"></el-input>
              </el-form-item>
              <el-form-item label="报警输入数量" prop="inputNumber">
                <el-input v-model.number="createHostBody.inputNumber"></el-input>
              </el-form-item>
            </el-form>
            <!-- <el-form
              v-if="clickHostType == '编辑'"
              :model="hostInfo"
              size="mini"
              label-position="right"
              label-width="120px"
              ref="EmitHost"
              :rules="removeHost"
              :showClose="false"
              :close-on-click-modal="false"
            >
              <el-form-item label="门禁主机名称" prop="name">
                <el-input v-model="hostInfo.name"></el-input>
              </el-form-item>
              <el-form-item label="唯一标识ID" prop="uniqueId">
                <el-input v-model="hostInfo.uniqueId"></el-input>
              </el-form-item>

              <el-form-item label="主机类型" prop="type">
                <el-select v-model="hostInfo.type">
                  <el-option
                    v-for="(item, index) in CreatehostType"
                    :key="index"
                    :label="item.data"
                    :value="item.data"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="品牌" prop="brand">
                <el-select v-model="hostInfo.brand" @change="changeBrans">
                  <el-option
                    v-for="(item, index) in hostBrands"
                    :key="index"
                    :label="item.data"
                    :value="item.data"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="型号" prop="modelNum">
                <el-select v-model="hostInfo.modelNum">
                  <el-option
                    v-for="(item, index) in hostModelNums"
                    :key="index"
                    :label="item.data"
                    :value="item.data"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="资产编码" prop="assetCode">
                <el-input v-model="hostInfo.assetCode"></el-input>
              </el-form-item>
              <el-form-item label="读头通道数量" prop="readerNumber">
                <el-input type="number" v-model.number="hostInfo.readerNumber"></el-input>
              </el-form-item>
              <el-form-item label="门禁通道数量" prop="guardNumber">
                <el-input type="number" v-model.number="hostInfo.guardNumber"></el-input>
              </el-form-item>
              <el-form-item label="报警输入数量" prop="inputNumber">
                <el-input type="number" v-model.number="hostInfo.inputNumber"></el-input>
              </el-form-item>
            </el-form> -->
            <div style="text-align:center;">
              <el-button size="mini" type="primary" @click="saveDetector(clickHostType)">保存</el-button>
              <el-button size="mini" @click="cancels(clickHostType)">取消</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <!-- 修改平台 增删改主机 -->
  </div>
</template>

<script type="text/ecmascript-6">
import { mapMutations, mapState } from 'vuex'

import {
  manCreate,
  getAccessList,
  getPlatformListT,
  AccessmModify,
  getDetal,
  getPlatformList,
  getTreeApi,
  getHosts,
} from '@src/http/access/accessMan'
import { getZhiDhosts } from '@src/http/access/control'
import { creatHost, removeHost, delHostList, getRmOrDelHostsList } from '@src/http/access/host'
import { getServeId, brandOrModelNum } from '@src/http/access/getId'
export default {
  data() {
    // ip 验证
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
      copyPlatInfo:{},
      accessServiceArr: '',
      isToList: false, //如果是列表勾选修改保存直接到列表
      hostInfo: {}, //编辑主机数据源
      host: [], //主机列表
      delHostArr: [], // 删除的主机arr
      platformId: '', // 平台id
      upDataPlatform: {
        assetCode: '',
        name: '',
        brand: '',
        modelNum: '',
        username: '',
        password: '',
        ip: '',
        port: '',
        accessServer: '',
        id: '',
      },
      platfirmInfo: {
        orgName: '',
        locName: '',
      },
      isKeyPart: false,
      keyParts: [],
      treeType: 2,
      loading: false,
      platformDatas: {},
      host: [],
      clickHostType: '',
      isEditDetector: false,
      dropdownStatus: {
        videoChan: true,
        audioChan: false,
        inputChan: false,
      },
      // 创建主机
      createHostBody: {
        platformId: '',
        assetCode: '', //资产编码
        uniqueId: '', // 唯一标识id
        name: '', // 主机名称

        type: '', //主机类型
        brand: '', // 品牌
        modelNum: '', // 型号
        readerNumber: '', //读头通道数量
        guardNumber: '', // 门禁通道数量
        inputNumber: '', //报警输入数量
        // status: '', // 在线状态 1 离线 2在线
        // sdk:''
      },
      brands: [], //平台品牌
      hostBrands: [], //主机品牌
      hostModelNums: [], //主机型号
      modelNums: [], //平台型号
      CreatehostType: [], //主机类型
      // 创建主机表单验证
      rules: {
        name: [{ required: true, message: '必填', trigger: 'change' },
         { min: 1, max: 64, message: '名称在 1 到 64 个字符', trigger: 'change' }],
          uniqueId: [

           { pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, message: 'ID不能大于65535' },

          ],
        type: [{ required: true, message: '必填', trigger: 'change' }],
        brand: [{ required: true, message: '必填', trigger: 'change' }],
        modelNum: [{ required: true, message: '必填', trigger: 'change' }],
        assetCode: [
          { required: true, message: '必填', trigger: 'change' },
          { min: 1, max: 64, message: '不可超过64位', trigger: 'blur' },
        ],
        readerNumber: [
          //  { pattern: /^[0-9]*$/, message: '数量必须为整数且最大64' },
          // { type: 'number', min: 0, max: 64, message: '数量不能大于64', trigger: 'blur' },
            { type: 'number', message: '数量必须为整数', trigger: 'blur' },
          { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' },
        ],
        guardNumber: [
          //           { pattern: /^[0-9]*$/ , message: '数量必须为整数且最大64' },
          // { type: 'number', min: 0, max: 64, message: '数量不能大于64', trigger: 'blur' },
          { type: 'number', message: '数量必须为整数', trigger: 'blur' },
          { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' },

        ],
        inputNumber: [
          { type: 'number', message: '数量必须为整数', trigger: 'blur' },
          { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' },
        ],
      },
      removeHost: {
        name: [
          { required: true, message: '必填', trigger: 'change' },
         { min: 1, max: 64, message: '名称在 1 到 64 个字符', trigger: 'change' }
        ],
        type: [{ required: true, message: '必填', trigger: 'change' }],
        brand: [{ required: true, message: '必填', trigger: 'change' }],
        modelNum: [{ required: true, message: '必填', trigger: 'change' }],
        assetCode: [
          { required: true, message: '必填', trigger: 'change' },
          { min: 1, max: 64, message: '不可超过64位', trigger: 'blur' },
        ],
        readerNumber: [
          { type: 'number', message: '数量必须为整数', trigger: 'blur' },
          { pattern: /^[0-9]*$/ , message: '数量必须为整数且最大64' }

        ],
        guardNumber: [
          { type: 'number', message: '数量必须为整数', trigger: 'blur' },
          { pattern: /^[0-9]*$/ , message: '数量必须为整数且最大64' }

        ],
        inputNumber: [
          { type: 'number', message: '数量必须为整数', trigger: 'blur' },
                    { pattern: /^[0-9]*$/ , message: '数量必须为整数且最大64' }

        ],
      },
      // 修改平台检验
      /* 表单验证 */
      platformRules: {
        name: [
          { required: true, message: '平台名称不可为空', trigger: 'change' },
          { min: 1, max: 64, message: '名称在 1 到 64 个字符', trigger: 'change' },
        ],
        orgName: [{ required: true, message: '机构名字必须存在', trigger: 'change' }],
        brand: [{ required: true, message: '品牌必须存在', trigger: 'change' }],
        ip: [
          { required: true, message: 'IP不可为空', trigger: 'blur' },
          {
            validator: validcodeip,
            trigger: 'change',
          },
        ],
        assetCode: [
          { required: true, message: '必须存在', trigger: 'change' },
          { min: 1, max: 64, message: '最大64位字符', trigger: 'change' },
        ],

        username: [{ required: true, message: '名字不能为空', trigger: 'change' }],
        accessService: [{ required: true, message: '接入协议不可为空', trigger: 'change' }],
        keyPartName: [{ required: true, message: '不可为空', trigger: 'change' }],
        modelNum: [{ required: true, message: '请选择型号', trigger: 'change' }],
        port: [
          { required: true, message: '请输入端口', trigger: 'change' },
          {
            validator: validcodePort,
            trigger: 'change',
          },
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
        keyPartId: [{ required: true, message: '重点部位不可为空', trigger: 'change' }],
      },
    }
  },
  props: {
    getHosts: {
      type: Object,
      default: () => {},
    },
    platforms: {
      type: Object,
      default: () => {},
    },
    deviceModel: {
      type: Object,
      default: () => {},
    },
    updataItem: {
      type: Object,
      default: () => {},
    },
    // planPop: {
    //   type: Object,
    //   default: () => {},
    // },
  },
  components: {
    treeBox: () => import('@src/components/tree/treeBox'),
  },
  computed: {
    ...mapState('access', {
      comDatas: 'comDatas',
    }),
  },
  created() {
    getServeId({ servername: 'DA' }).then((res) => {
      let accessService = []
      res.data.filter((item, index) => {
        if (item.indexOf('DAPYTHON') > -1) {
          accessService.push({
            key: item,
            value: item,
          })
        }
      })
      this.accessServiceArr = accessService
    })
  },
  mounted() {
    /*this.updataItem.id 如果不是列表勾选 则会有警告 */
    if (this.updataItem.id) {
      getDetal(this.updataItem.id).then((res) => {
        if (res.data.code == 0) {
          this.platformDatas = res.data.data.platform
          this.platformId = res.data.data.platform.id
          this.host = res.data.data.hosts
          this.isToList = true
          this.copyPlatInfo = this.$lodash.cloneDeep(this.platformDatas)
        }
      })
    } else {
      getDetal(this.comDatas.id).then((res) => {
        if (res.data.code == 0) {
          this.platformDatas = res.data.data.platform
          this.platformId = res.data.data.platform.id
          this.host = res.data.data.hosts
          this.isToList = false
          this.copyPlatInfo = this.$lodash.cloneDeep(this.platformDatas)

        }
      })
    }


    /*  */
    let brandsA = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '1' }]
    let queryList = brandsA
    let _this = this
    brandOrModelNum({ queryList }).then((res) => {
      _this.brands = res.data.data[0].attr
    })
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
  methods: {
    changeModelNums(index) {
      this.modelNums.forEach(item => {
        if (index == item.data) {
          this.platformDatas.sdk = item.sdkName
        }
      })
      console.log('xxxxxxxx',this.platformDatas.sdk);
    },
    hostSdk(index){
      // console.log('aaa?',index);
      this.hostModelNums.forEach(item => {
        if(index == item.data){
          // this.createHostBody.sdk = item.sdkName
          // console.log('xxx',this.createHostBody.sdk);
        }
      })
    },
    ...mapMutations('access', {
      GETINFO: 'getinfo',
    }),
    //主机型号
    changeBrans(index) {
      this.hostModelNums = []
      this.createHostBody.modelNum = ''
      this.hostInfo.modelNum = ''
      let hostModelNumsType = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '5' }]
      let HostModelNumsType = hostModelNumsType
      brandOrModelNum({ queryList: HostModelNumsType }).then((res) => {
        this.hostModelNums = res.data.data[0].attr
        let modelList = this.hostModelNums
        let arr = []
        modelList.filter((v) => {
          if (v.homeClass == index) {
            arr.push(v)
          }
          this.hostModelNums = arr
        })
      })
    },
    // 平台型号
    updateList(index) {
      this.modelNums = []
      this.platformDatas.modelNum = ''
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '2' }]
      brandOrModelNum({ queryList }).then((res) => {
        this.modelNums = res.data.data[0].attr
        let modelList = this.modelNums
        let arr = []
        modelList.filter((v) => {
          if (v.homeClass == index) {
            arr.push(v)
          }
        this.modelNums = arr

        })
      })
    },
    // 获取平台下的主机及所属通道信息
    getHostTDlist(type) {
      let { id } = this.updataItem
      let params = {
        id: this.platformId,
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
          getHosts({ id: this.platformId }).then((res) => {
            // if(res.data.code != 0) return
            if(this.loading == false){
              return
            }
            this.$notify({
              title: '成功',
              message: type == '刷新完毕' ? type : '获取完毕',
              type: 'success',
            })
            this.host = res.data.data
            this.loading = false
          })
        }, 300)
        // }
      })
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
            getHosts(this.updataItem).then((res) => {
              // console.log('Log 查看指定平台下的所有主机', res)
              this.host = res.data.data.hosts
              if (this.host.length < 1) {
                this.$message({
                  message: '暂无主机信息,请添加主机后查看',
                  type: 'warning',
                })
              } else {
                this.$message({
                  message: '获取主机信息成功',
                  type: 'success',
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
              type: 'success',
            })
          }
          this.isEditDetector = true
          break
        case '编辑':
          this.clickHostType = '编辑'
          if (this.host.length < 1) {
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
          this.clickHostType = '删除'
          if (this.host.length < 1) {
            return
          }
          break
        case '刷新':
          /* fn... */
          this.loading = true
          return
          setTimeout(() => {
            getHosts(this.updataItem).then((res) => {
              // console.log('Log 查看指定平台下的所有主机', res)
              this.host = res.data.data.hosts
              this.$message({
                message: '刷新成功',
                type: 'success',
              })
            })
            this.loading = false
          }, 1000)
          break
        default:
          break
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
        isRecursion: '0',
      }
      getTreeApi(params).then((res) => {
        if (res.data.code === 0) {
          if (kId) {
            _this.platformDatas.keyPartId = kId
          }
          let data = res.data.data.nodes
          data.forEach((item) => {
            if (item.tierType === 'loc') {
              _this.keyParts.push({
                label: item.name,
                value: item.id,
                type: item.keyPartType,
              })
            }
          })
        }
      })
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    keyPartChange(data) {
      let selectData = this.keyParts.filter((i) => i.value === data)[0]
      this.$forceUpdate()
      this.platformDatas.keyPartType = selectData.type
    },
    onceClick(val, node) {
      let { tierType } = val
      if (tierType == 'org') {
        ;(this.platformDatas.orgId = val.id),
          (this.platformDatas.orgName = val.name),
          // this.platformDatas.keyPartId = ''
          this.getKeyPartSelect(val.serial)
      } else {
        let parentNode = node.parent
        if (!parentNode) return
        ;(this.platformDatas.orgId = (parentNode.data && node.parent.data.id) || ''),
          (this.platformDatas.orgName = (parentNode.data && node.parent.data.name) || ''),
          this.getKeyPartSelect(parentNode.data.serial, val.id)
        let { name, id, keyPartType } = val
        this.platfirmInfo.locName = name
      }
      this.isKeyPart = val.tierType == 'loc' ? true : false //平台只能创建在重点部位下面
      //   this.$emit('modelChange', this.createPlatform)
      //   this.GETINFO(JSON.parse(JSON.stringify(this.createPlatform)))
    },
    savePlatform() {
      // 修改平台校验验证
      this.$refs['platformRules'].validate((valid) => {
        if (valid) {
          this.$refs['ruleForm'].validate((valid2) => {
            if (valid2) {
              let _this = this
              let body = {
                orgId: this.platformDatas.orgId,
                keyPartId: this.platformDatas.keyPartId,
                keyPartType: this.platformDatas.keyPartType,
                accessService: this.platformDatas.accessService,
                assetCode: this.platformDatas.assetCode || '',
                name: this.platformDatas.name,
                brand: this.platformDatas.brand,
                modelNum: this.platformDatas.modelNum,
                username: this.platformDatas.username,
                password: this.platformDatas.password,
                ip: this.platformDatas.ip,
                port: Number(this.platformDatas.port),
                accessServer: this.platformDatas.accessServer,
                id: this.platformDatas.id,
                sdk:this.platformDatas.sdk
              }
              // 修改平台
              AccessmModify(`/resource/v1/guard/platform/${this.comDatas.id || this.updataItem.id}`, body).then(
                (res) => {
                  console.log('Log 修改平台信息是否成功?', res)
                  if (res.data.code != 0) {
                    this.$messageError('IP或端口重复,无法修改!')
                    return
                  }
                   this.$notify({
                    title: '成功',
                    message:'修改成功',
                    type: 'success'
                  })
                  let params = {
                    page: 1,
                    limit: 25,
                  }
                  _this.GETINFO(this.platformDatas)
                  getAccessList(params).then((res) => {
                    if (res.data.code == 0) {
                      res.data.data.platforms.forEach((item) => {
                        if (item.id == this.platformId) {
                          this.afterUpdataItem = item
                          return
                        }
                      })
                    }
                    // 组件切换
                    this.$emit('modelChange', {
                      path: 'ViewPage',
                      id: _this.platformDatas.id,
                    })
                    if (this.isToList) {
                      this.$parent.$parent.childrenComponent = 'List'
                    }
                    if (!this.isToList) {
                      this.$parent.$parent.childrenComponent = 'ViewPage'
                    }
                  })
                }
              )
            } else {
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    addHost() {
      this.isEditDetector = true
      // this.$refs['deviceModel'].resetFields()
    },
    // 批量删除门禁主机
    delHost() {
      if (!this.host.length) {
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
                  this.host = res.data.data
                })
                this.loading = false
              }, 300)
            })
          })
          .catch(() => {
            this.delHostArr = []
            this.$refs.multipleTable.clearSelection()
            this.$messageSuccess('取消成功')
          })
      }
    },
    Refresh() {
      this.loading = true
          setTimeout(() => {
          getHosts({ id: this.platformId }).then((res) => {
            if(res.data.code != 0){
             this.loading = false
              this.$notify({
                title: '失败',
                message:'刷新失败',
                type: 'error',
              })
             return
            }
            this.$notify({
              title: '完毕',
              message: '刷新完毕',
              type: 'success',
            })
            this.loading = false
            this.host = res.data.data
          })
        }, 200)
    },
    select(s, row) {

      // 修改主机数据处理 此处需要优化
      this.delHostArr = s   // 删除主机 arr
      let EmitObj = row
      this.createHostBody = this.$lodash.cloneDeep(EmitObj)
      this.createHostBody.readerNumber = Number(this.createHostBody.readerNumber)
      this.createHostBody.guardNumber = Number(this.createHostBody.guardNumber)
      this.createHostBody.inputNumber = Number(this.createHostBody.inputNumber)
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
      this.createHostBody = {
        platformId: this.platformId || this.platformDatas.id, // 必修
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
    // 全选处理
    selectAll(selection){
      this.delHostArr = selection
    },
    //编辑主机取消
    cancels(Type) {
        for (let key in this.createHostBody) {
          this.createHostBody[key] = ''
        }
      this.delHostArr = []
      this.isEditDetector = false
      this.$refs.multipleTable.clearSelection()
    },
    cancel() {
      this.$confirm('此操作取消编辑, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$notify({
            title: '成功',
            message: '返回列表页成功',
            type: 'success',
          })
          this.$parent.$parent.childrenComponent = 'List'
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
      this.delHostArr = []
    },

    reset() {
      let res = this.$lodash.cloneDeep( this.copyPlatInfo)
      this.platformDatas = res
      // for (let key in this.platformDatas) {
      //   this.platformDatas[key] = ''
      // }
    },
    // 新建主机 || 编辑等操作按钮
    saveDetector(hostType) {
      if (hostType == '新增') {
        //form验证
        this.$refs['deviceModel'].validate((valid) => {
          if (valid) {
            let { keyPartType, keyPartId, id, subSystem, orgId } = this.updataItem
            this.createHostBody.platformId = id

            let body = {
              platformId: this.platformId || this.platformDatas.id, // 必修
              uniqueId: this.createHostBody.uniqueId, // 唯一标识id
              name: this.createHostBody.name, // 主机名称
              type: this.createHostBody.type, //主机类型
              brand: this.createHostBody.brand, // 品牌
              modelNum: this.createHostBody.modelNum, // 型号
              assetCode: this.createHostBody.assetCode,
              readerNumber: this.createHostBody.readerNumbe || 0, //读头通道数量
              guardNumber: this.createHostBody.guardNumber  || 0, // 门禁通道数量
              inputNumber: this.createHostBody.inputNumber || 0, //报警输入数量
              // sdk:this.createHostBody.sdk
            }
            // let body = this.$lodash.cloneDeep(this.createHostBody)
            if (this.createHostBody.type == '金库门禁') {
              body.type = 1
            } else if (this.createHostBody.type == '普通门禁') {
              body.type = 2
            } else {
              body.type = 3
            }
            // 创建门禁主机
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
              // 新建完主机之后刷新该平台下的主机
              this.loading = true
              this.timer = setTimeout(() => {
                getRmOrDelHostsList(`/resource/v1/guard/platform/${this.platformId}/host`).then((res) => {
                if(res.data.code == 0){
                  this.isEditDetector = false
                  this.host = res.data.data
                  this.loading = false
                }else{
                  this.isEditDetector = false
                }
              })
              for (const key in this.createHostBody) {
                this.createHostBody[key] = ''
              }
              this.$refs['deviceModel'].resetFields() // 创建完毕之后清楚校验效果


                // clearTimeout(this.timer)
              },300)

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
              platformId: this.platformId || this.platformDatas.id, // 必修
              assetCode: this.createHostBody.assetCode,
              uniqueId: this.createHostBody.uniqueId,
              name: this.createHostBody.name,
              id: this.createHostBody.id,
              type: this.createHostBody.type,
              brand: this.createHostBody.brand,
              modelNum: this.createHostBody.modelNum,
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
              let taht = this
              setTimeout(() => {
                // 获取修改后的主机
                getHosts(taht.updataItem).then((res) => {
                  taht.host = res.data.data
                  taht.loading = false
                  taht.delHostArr = []
                })
                  taht.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success',
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
    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },
  },
  watch: {
    comDatas: {
      handler(newVal, oldVal) {},
      immediate: true,
    },
  },
}
</script>

<style lang="less" scoped>
// .left {
//   width: 240px;
//   height: 100%;
//   border-right: 1px solid #e6e6e6;
// }
#plormsUpdata {
  display: flex;
  height: 100%;
  width: 100%;
  .left {
    height: 100%;
    width: 290px;
    .treeLeft {
      width: 290px;
      height: 100%;
      border-right: 1px solid #e6e6e6;
      /deep/ .treeBox {
        width: 290px;
        border: 1px solid #e6e6e6;
        height: 100%;
      }
    }
  }
  .right {
    width: calc(~'100% - 290px');
    flex: 1;
    padding: 10px;
    border: 5px solid #eaeef3;
    .hostAuto {
      width: 100%;
      .form-box {
        width: 80%;
        .form-content {
          display: flex;
          font-size: 12px;
          padding: 10px;
          border: 1px solid rgba(225, 225, 225, 1);
          background: #f5f5f5;
          .left-form {
            width: 50%;
            margin-right: 24px;
          }
          .right-form {
            width: 50%;
          }
          /deep/ .el-form-item {
            margin-bottom: 20px;
            .el-select {
              width: 100%;
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
          margin: 10px 0;
          text-align: center;
        }
      }
      .colls {
        width: 100%;
        // width: 400px;
        .collapses {
          .collapse-item {
            // width: 100%;
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
              .pointer {
                position: relative;
                margin-left: 5px;
                color: #2d71d3;
                padding-left: 5px;
                &::after {
                  position: absolute;
                  content: '';
                  display: block;
                  width: 2px;
                  height: 12px;
                  background: #2d71d3;
                  left: -5px;
                  top: 50%;
                  transform: translateY(-50%);
                }
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
        /deep/ .el-input__inner {
          width: 240px;
        }
      }
    }
  }
}

/deep/ .el-collapse {
  border: none;
}
/deep/ .el-collapse-item__header {
  display: none;
}
/deep/ .el-collapse-item__wrap {
  border: none;
}
</style>
