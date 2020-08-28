<template>
  <div class="creat-box">
    <!-- 中间树 -->
    <div class="tree-content">
      <treeBox :lazyTreeApi="getLazyTreeApi" ref="tree"
        searchType="filter"
        :treeType="treeType"
        @onceClick="onceClick" @clickData="clickData"
        treeLazyToggle iconToggle
        :customizeQuery="customizeQuery"></treeBox>
    </div>
    <template v-if="deviceModel.orgName">
      <div v-show="!migrant" class="content">
        <!-- 顶部操作栏 -->
        <div class="top">
          <!-- 面包屑 -->
          <div class="header">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>视频管理</el-breadcrumb-item>
              <el-breadcrumb-item>视频主机配置</el-breadcrumb-item>
              <el-breadcrumb-item class="active">{{title}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <!-- 操作按钮 -->
          <div class="button-box" v-if="createPreview">
            <el-button size="small" icon="el-icon-plus" @click="createDevice">新建</el-button>
            <el-button size="small" icon="el-icon-edit-outline" @click="updateDevice">编辑</el-button>
            <el-button size="small" icon="el-icon-delete" @click="deleteDevice">删除</el-button>
            <el-button size="small" icon="el-icon-refresh-right" @click="getDeviceAndResourceInfo">获取</el-button>
            <el-button size="small" icon="el-icon-document-copy" @click="copyDevice">复制</el-button>
            <el-button size="small" icon="icon iconfont-ccb ccbqianyi el-icon-" @click="_ => {
              this.showContent = 'migrant'
              this.migrant = true
              }">迁移</el-button>
            <el-button size="small" icon="el-icon-sort" @click="storTble">排序</el-button>
            <el-button size="small" icon="el-icon-printer" v-print="'#printJS_people'">打印</el-button>
          </div>
        </div>
        <div class="main" ref="printJS_people" id="printJS_people">
          <!-- 新建表单 -->
          <div v-if="!createPreview">
            <div class="title-box">
            {{jumpType === 'Create' ? '新增视频主机设备' : (jumpType === 'Update' ? '编辑视频主机设备' : '视频主机查看')}}
            </div>
            <div class="form-box">
              <div class="form-content">
                <div class="left-form">
                  <el-form size="mini" label-position="right" label-width="140px" ref="deviceModel" :model="deviceModel" :rules="rulesLeft">
                    <el-form-item label="所属机构" prop="orgName">
                      <el-input disabled v-model="deviceModel.orgName"></el-input>
                    </el-form-item>
                    <el-form-item label="设备名称"  prop="name">
                      <el-input placeholder="输入设备名称" v-model="deviceModel.name"></el-input>
                    </el-form-item>
                    <template v-if="!vnvrs">
                      <el-form-item label="设备品牌"  prop="brand">
                        <el-select v-model="deviceModel.brand">
                          <el-option
                            v-for="item in brands"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value || item.label">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="接入协议"  prop="accessProtocol">
                        <el-select v-model="deviceModel.accessProtocol">
                          <el-option
                            v-for="item in protocols"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="接入服务器"  prop="accessService">
                        <el-select v-model="deviceModel.accessService" :popper-append-to-body="false">
                          <el-option
                            v-for="item in serverSelectData"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="控制端口"  prop="cport">
                        <el-input type="number" min='0' max='65535' v-model="deviceModel.cport"></el-input>
                      </el-form-item>
                      <el-form-item label="用户名"  prop="username">
                        <el-input v-model="deviceModel.username"></el-input>
                      </el-form-item>
                      <el-form-item label="传输协议"  prop="protocol">
                        <el-select v-model="deviceModel.protocol">
                          <el-option
                            v-for="item in transportProtocols"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="模拟视频通道数量" prop="analogNumber">
                        <!-- <el-select v-model="deviceModel.analogNumber">
                          <el-option
                            v-for="item in channelCount"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select> -->
                        <el-input type="number" min='0' v-model="deviceModel.analogNumber" :disabled="deviceModel.type==1||deviceModel.type==4" ></el-input>
                      </el-form-item>
                      <el-form-item label="报警输入数量" prop="inputNumber">
                        <!-- <el-select v-model="deviceModel.inputNumber">
                          <el-option
                            v-for="item in channelCount"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select> -->
                        <el-input type="number" min='0' v-model="deviceModel.inputNumber"></el-input>
                      </el-form-item>
                      <el-form-item label="资产编号" prop="assetCode">
                        <el-input v-model="deviceModel.assetCode"></el-input>
                      </el-form-item>
                    </template>
                  </el-form>
                </div>
                <div class="right-form">
                  <el-form size="mini" label-position="right" label-width="140px" ref="deviceModel2" :model="deviceModel" :rules="rulesRight">
                    <el-form-item label="所属重点部位" prop="keyPartName">
                      <!-- <el-select v-model="deviceModel.keyPartId" @change="keyPartChange" disabled>
                        <el-option
                          v-for="item in keyParts"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select> -->
                      <el-input v-model="deviceModel.keyPartName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="设备类型" prop='type'>
                      <el-select v-model="deviceModel.type" @change="changeType">
                        <el-option
                          v-for="item in deviceTypes"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <template v-if="!vnvrs">
                      <el-form-item label="设备型号" prop='modelNum'>
                        <el-select v-model="deviceModel.modelNum">
                          <el-option
                            v-for="item in models"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="序列号" prop="uniqueId">
                        <el-input v-model="deviceModel.uniqueId"></el-input>
                      </el-form-item>
                      <el-form-item label="IP地址" prop="ip">
                        <el-input v-model="deviceModel.ip"></el-input>
                      </el-form-item>
                      <el-form-item label="数据端口" prop="dport">
                        <el-input type="number" min='0' max='65535' v-model="deviceModel.dport"></el-input>
                      </el-form-item>
                      <el-form-item label="密码" prop="password">
                        <el-input v-model="deviceModel.password" type="password"></el-input>
                      </el-form-item>
                      <el-form-item  label="数字视频通道数量" prop="digitalNumber">
                        <!-- <el-select v-model="deviceModel.digitalNumber">
                          <el-option
                            v-for="item in channelCount"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select> -->
                        <el-input type='number' min='0' v-model="deviceModel.digitalNumber" :disabled="deviceModel.type==3"></el-input>
                      </el-form-item>
                      <el-form-item label="音频通道数量" prop="audioNumber">
                        <!-- <el-select v-model="deviceModel.audioNumber">
                          <el-option
                            v-for="item in channelCount"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select> -->
                        <el-input type='number' min='0' v-model="deviceModel.audioNumber" ></el-input>
                      </el-form-item>
                      <el-form-item label="报警输出数量" prop="outputNumber">
                        <!-- <el-select v-model="deviceModel.outputNumber">
                          <el-option
                            v-for="item in channelCount"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select> -->
                        <el-input v-model="deviceModel.outputNumber" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"></el-input>
                      </el-form-item>
                    </template>
                  </el-form>
                </div>
              </div>
              <div class="form-content-bottom">
                <div class="form-item">
                  <div class="form-item-label">录入时间</div>
                  <div class="form-item-value">{{jumpType === 'Create' ? '' : deviceModel.updatedAt}}</div>
                </div>
                <div class="form-item">
                  <div class="form-item-label">录入机构</div>
                  <div class="form-item-value">{{jumpType === 'Create' ? '' : deviceModel.updatedDept}}</div>
                </div>
                <div class="form-item">
                  <div class="form-item-label">录入人</div>
                  <div class="form-item-value">{{jumpType === 'Create' ? '' : deviceModel.updatedBy}}</div>
                </div>
              </div>
              <div class="form-footer">
                <el-button type="primary" size="small" style="margin-right:10px;" @click="saveDevice()">保存</el-button>
                <el-button size="small" style="margin-right:10px;"  @click="goBack">取消</el-button>
                <el-button size="small" @click="reset">重置</el-button>
              </div>
            </div>
          </div>
          <!-- 新建预览表单 -->
          <div class="form-box" style="margin-bottom:10px;" v-if="createPreview"
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.1)"
          >
            <div class="title">
              <span>视频主机设备</span>
            </div>
            <div class="info-detail">
              <div class="info-detail-item">
                <div class="info-item-label">所属机构</div>
                <div class="info-item-value">{{deviceModel.orgName}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">所属重点部位</div>
                <div class="info-item-value">{{deviceModel.keyPartName}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">设备类型</div>
                <div class="info-item-value">
                  {{deviceModel.type}}
                  <!-- <span v-for="i in deviceTypes" :key="i.value">
                    <template v-if="i.value==deviceModel.type">{{i.label}}</template>
                  </span> -->
                </div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">设备名称</div>
                <div class="info-item-value">{{deviceModel.name}}</div>
              </div>
              <template v-if="!vnvrs">
                <div class="info-detail-item">
                  <div class="info-item-label">设备品牌</div>
                  <div class="info-item-value">{{deviceModel.brand}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">设备型号</div>
                  <div class="info-item-value">{{deviceModel.modelNum}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">序列号</div>
                  <div class="info-item-value">{{deviceModel.uniqueId}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">接入协议</div>
                  <div class="info-item-value">{{deviceModel.accessProtocol}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">接入服务器</div>
                  <div class="info-item-value">{{deviceModel.accessService}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">IP地址</div>
                  <div class="info-item-value">{{deviceModel.ip}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">传输协议</div>
                  <div class="info-item-value">{{deviceModel.protocol}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">控制端口</div>
                  <div class="info-item-value">{{deviceModel.cport}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">数据端口</div>
                  <div class="info-item-value">{{deviceModel.dport}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">数字视频通道数量</div>
                  <div class="info-item-value">{{deviceModel.digitalNumber}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">模拟通道数量</div>
                  <div class="info-item-value">{{deviceModel.analogNumber}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">报警输入数量</div>
                  <div class="info-item-value">{{deviceModel.inputNumber}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">报警输出数量</div>
                  <div class="info-item-value">{{deviceModel.outputNumber}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">音频通道数量</div>
                  <div class="info-item-value">{{deviceModel.audioNumber}}</div>
                </div>
                <div class="info-detail-item">
                  <div class="info-item-label">资产编码</div>
                  <div class="info-item-value">{{deviceModel.assetCode}}</div>
                </div>
              </template>
            </div>
            <div class="info-user">
              <div class="info-detail-item">
                <div class="info-item-label">录入时间</div>
                <div class="info-item-value">{{jumpType === 'Create' ? '' : deviceModel.updatedAt}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">录入机构</div>
                <div class="info-item-value">{{jumpType === 'Create' ? '' : deviceModel.updatedDept}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">录入人</div>
                <div class="info-item-value">{{jumpType === 'Create' ? '' : deviceModel.updatedBy}}{{bottomResult}}</div>
              </div>
            </div>
          </div>
          <!-- 底部Tab -->
          <template v-if="jumpType !== 'Create'">
            <create-result
            :id="deviceId" :devInfo="devInfo" :reloadChanelInfo="reloadChanelInfo" :deviceName="deviceName"
            :jumpType="jumpType" :deviceData="deviceModel" :key="bottomResult"></create-result>
          </template>
        </div>
        <!-- 迁移弹窗 -->
      </div>
    </template>
    <div v-if="showContent==='sort'" v-show="migrant" class="content">
      <sort :come="'create'" v-if="sortData.length>0" :sortData="sortData"></sort>
    </div>
    <div v-else-if="showContent==='migrant'" v-show="migrant" class="content">
      <migrant :come="'create'" :migrantData="migrantData"></migrant>
    </div>
  </div>
</template>

<script>
import CreateResult from './CreateResult'
import { addDeviceApi, putDeviceApi, deleteDeviceApi, getServersApi, getDeviceInfoApi, getNvrChannelInfoApi, getDeviceListApi } from '@src/http/video/videoConfig.api.js'
import { getLazyTreeApi } from '@src/http/video/videoPreview.api.js'
import treeBox from '@src/components/tree/treeBox'
import { BRANDS, MODELS, PROTOCOL, TRANSPORTPROTOCOLS, DEVICETYPE, CHANNLECOUNT } from '../../../components/selectConf'
import { mapActions, mapState, mapGetters } from 'vuex'
import Migrant from './Migrant'
import Sort from './LookSort'
import create from '@src/assets/rules/validation/security/video.js'
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
  name: 'Create',
  components: {
    treeBox,
    CreateResult,
    Migrant,
    Sort
  },
  props: {
    deviceData: {
      type: Object,
      require: true
    },
    optType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      bottomResult: new Date().getTime().toString().slice(-6),
      timer: '',
      loading: false,
      reloadChanelInfo: true, // 为了点击设备预览页面的获取按钮重新触发tableResult.vue通道管理组件重新加载可重新获取通道信息
      jumpType: this.optType, // 方便在新建的时候进行切换
      deviceModel: {},
      treeType: 2,
      customizeQuery: {
        params: {
          subSystem: '1',
          isRecursion: '0'
        }
      },
      brands: BRANDS,
      deviceTypes: DEVICETYPE,
      transportProtocols: TRANSPORTPROTOCOLS,
      protocols: PROTOCOL,
      channelCount: CHANNLECOUNT,
      createPreview: false, // 控制显示新建页面还是新建预览的dom
      orgObj: {
        id: this.deviceData.orgId || '',
        name: this.deviceData.orgName || ''
      },
      devInfo: {},
      keyParts: [],
      migrant: false,
      showContent: '',
      sortData: [], // 视频主机排序数据
      serverSelectData: [], // 服务器下拉列表
      rulesLeft: create.inCreateLeft, // 表单校验
      rulesRight: create.inCreateRight// 表单校验
    }
  },
  filters: {
    formatt(val, data) {
      return (data.filter((vm) => vm.value == val))[0].label || val
    }
  },
  computed: {
    vnvrs() {
      if (typeof (this.deviceModel.type) === 'number') {
        if ([5].some(i => i === this.deviceModel.type)) {
          console.log(this.deviceModel)
          return true
        } else {
          return false
        }
      } else {
        if (['Vnvr'].some(i => i === this.deviceModel.type)) {
          console.log(this.deviceModel)
          return true
        } else {
          return false
        }
      }
    },
    models() {
      let curType = this.brands.find(i => i.value === this.deviceModel.brand)
      let type = curType && curType.label
      return this.MODELS[type] || []
    },
    deviceId: { // 记录当前的设备id
      get() {
        return this.deviceModel.id || ''
      },
      set(val) {
      }
    },
    deviceName() { // 记录当前的设备名称
      return this.deviceModel.name || ''
    },
    migrantData() { // 迁移的源数据
      return [{
        id: this.deviceId,
        name: this.deviceName
      }]
    },
    title() {
      if (this.jumpType === 'Create') {
        return '新建'
      } else if (this.jumpType === 'Update') {
        return '编辑'
      } else {
        return '新建预览'
      }
    },
    ...mapGetters('videoManage/videoConfig', ['BRANDS', 'MODELS', 'DEVICETYPE', 'TRANSPORTPROTOCOLS', 'PROTOCOL'])
  },
  watch: {
    'deviceModel.brand'() {
      // this.deviceModel.modelNum = ''
    },
    orgObj: {
      handler(newValue, oldValue) {
        // if (this.jumpType === 'Create') {
        //   this.deviceModel['orgId'] = newValue.id
        //   this.deviceModel['orgName'] = newValue.name
        // }
        console.log(newValue, this.deviceModel)
      },
      deep: true
    }
  },
  created() {
    let deviceModel = this.doubleMeaning(this.deviceData, 'toLabel')
    if (!deviceModel.orgName && !deviceModel.orgId) {
      deviceModel['orgName'] = this.orgObj.name
      deviceModel['orgId'] = this.orgObj.id
    }
    this.deviceModel = deviceModel
    console.log(this.deviceData, this.deviceModel)
    this.brands = this.BRANDS
    this.deviceTypes = this.DEVICETYPE
    this.transportProtocols = this.TRANSPORTPROTOCOLS
    this.protocols = this.PROTOCOL
    console.log(this.MODELS)
    this.getServerData() // 后期接口需要变动
    // if (!this.orgObj.id) { return }
    // this.getKeyPartSelect(this.orgObj.id)
    // console.log(this.objs, this.getDataInfos(this.objs))
    // this.setInfoUser()
  },
  methods: {
    ...mapActions('videoManage/videoConfig', ['setState']),
    setInfoUser() {
      this.timer = setInterval(_ => {
        this.deviceModel.updatedAt = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }, 1000)
      this.deviceModel.updatedDept = JSON.parse(sessionStorage.user).orgName
      this.deviceModel.updatedBy = JSON.parse(sessionStorage.user).name
    },
    doubleMeaning(datas = {}, type) {
      let obj = {}
      let data = JSON.parse(JSON.stringify(datas))
      console.log(data, type)
      if (type === 'toLabel') {
        for (let i in data) {
          if (i === 'type') {
            // console.log(i, data[i], DEVICETYPE)
            if (DEVICETYPE.some(j => j.value === data[i])) {
              obj[i] = DEVICETYPE.filter(j => j.value === data[i])[0].label
            }
          } else if (i === 'brand') {
            // console.log(i, data[i], BRANDS)
            if (BRANDS.some(j => j.value === data[i])) {
              obj[i] = BRANDS.filter(j => j.value === data[i])[0].label
            }
          } else if (i === 'protocol') {
            // console.log(i, data[i], TRANSPORTPROTOCOLS)
            if (TRANSPORTPROTOCOLS.some(j => j.value === data[i])) {
              obj[i] = TRANSPORTPROTOCOLS.filter(j => j.value === data[i])[0].label
            }
          } else if (i === 'status') {
            // console.log(i, data[i])
            if (data[i] === 1) {
              obj[i] = '离线'
            } else if (data[i] === 2) {
              obj[i] = '在线'
            }
          }
        }
      }
      if (type === 'toValue') {
        for (let i in data) {
          if (i === 'type') {
            // console.log(i, data[i], DEVICETYPE)
            if (DEVICETYPE.some(j => j.label === data[i])) {
              obj[i] = DEVICETYPE.filter(j => j.label === data[i])[0].value
            }
          } else if (i === 'brand') {
            // console.log(i, data[i], BRANDS)
            if (BRANDS.some(j => j.label === data[i])) {
              obj[i] = BRANDS.filter(j => j.label === data[i])[0].value
            }
          // } else if (i === 'modelNum') {
          //   let arr = MODELS[data['brand']] || []
          //   console.log(i, data[i])
          //   if (arr.some(j => j.label === data[i])) {
          //     console.log(arr, obj[i], data[i])
          //     obj[i] = arr.filter(j => j.label === data[i])[0].value
          //   }
          } else if (i === 'protocol') {
            // console.log(i, data[i], TRANSPORTPROTOCOLS)
            if (TRANSPORTPROTOCOLS.some(j => j.label === data[i])) {
              obj[i] = TRANSPORTPROTOCOLS.filter(j => j.label === data[i])[0].value
            }
          } else if (i === 'status') {
            // console.log(i, data[i])
            if (data[i] === '离线') {
              obj[i] = 1
            } else if (data[i] === '在线') {
              obj[i] = 2
            }
          } else if (['keyPartType', 'dport', 'cport', 'protocol', 'inputNumber', 'outputNumber', 'analogNumber', 'digitalNumber', 'audioNumber'].some(j => j === i)) {
            obj[i] = data[i] * 1
          }
        }
      }
      return Object.assign(data, obj)
    },
    async storTble() {
      // this.showContent = 'sort'
      // this.createPreview = false
      await getDeviceListApi({
        limit: 1000,
        page: 1,
        keyPartId: this.deviceModel.keyPartId
      }).then(res => {
        console.log(res)
        res = res.data.data
        this.sortData = []
        if (res.hosts && res.hosts.length !== 0) {
          this.sortData = res.hosts
        }
        //
      }).then(_ => {
        this.showContent = 'sort'
        this.migrant = true
      }).catch(() => {})
    },
    changeType(value) { // 设备类型变化时设置默认值
    // if(this.jumpType === 'Create'){

      if (value == 1 || value == 4) {
        this.deviceModel.analogNumber = 0

        this.deviceModel.inputNumber = 0
        this.deviceModel.outputNumber = 0
        this.deviceModel.digitalNumber = 0
        this.deviceModel.audioNumber = 0
      } if (value == 4) {
        this.deviceModel.digitalNumber = 1

        this.deviceModel.inputNumbe = 0
        this.deviceModel.outputNumber = 0
        this.deviceModel.analogNumber = 0
        this.deviceModel.audioNumber = 0
      } else {
        this.deviceModel.digitalNumber = 0

        this.deviceModel.inputNumber = 0
        this.deviceModel.outputNumber = 0
        this.deviceModel.analogNumber = 0
        this.deviceModel.audioNumber = 0
      }
      // }
    },
    getDeviceAndResourceInfo() { // 获取设备和通道信息从硬件
      this.loading = true
      getNvrChannelInfoApi({
        hostId: this.deviceId
      }).then(res => {
        if (res.data.code === 0) {
          if (res.data.data) {
            this.getDeviceInfo(this.deviceId)
            // 为了点击设备预览页面的获取按钮重新触发tableResult.vue通道管理组件重新加载可重新获取通道信息
            this.reloadChanelInfo = false
            this.$nextTick(_ => {
              this.reloadChanelInfo = true
            })
          }
        } else {
          throw res.data.message
        }
      }).then(_ => {
        this.$notify({
          title: NOTIFY.TITLE.SUCCESS,
          message: '获取成功',
          type: NOTIFY.TYPE.SUCCESS
        })
        let timer = setTimeout(() => {
          this.loading = false
        }, 1000)
        this.$once('hook:beforeDestroy', _ => clearTimeout(timer))
      }).catch(err => {
        this.$notify({
          title: NOTIFY.TITLE.ERROR,
          message: err,
          type: NOTIFY.TYPE.ERROR
        })
        let timer = setTimeout(() => {
          this.loading = false
        }, 1000)
        this.$once('hook:beforeDestroy', _ => clearTimeout(timer))
      })
    },
    getServerData() { // 获取服务器下拉列表
      getServersApi().then((res) => {
        res.data && res.data.forEach(item => {
          this.serverSelectData.push({
            label: item,
            value: item
          })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    getLazyTreeApi(params) {
      return getLazyTreeApi(params)
    },
    onceClick(data, node) { // 点击机构返回重点部位的下拉，记录当前节点的信息
      if (data.tierType === 'org') {
        if (this.jumpType != 'Update' && this.jumpType != 'CreatePreview') {
          this.orgObj = {
            id: data.id,
            name: data.name
          }
          // this.deviceModel.keyPartType = ''
          // this.deviceModel.keyPartId = ''
          // this.deviceModel.keyPartName = ''
          this.$set(this.deviceModel, 'orgName', data.name)
          this.$set(this.deviceModel, 'orgId', data.id)
          this.$set(this.deviceModel, 'keyPartType', '')
          this.$set(this.deviceModel, 'keyPartId', '')
          this.$set(this.deviceModel, 'keyPartName', '')
        }
        // this.getKeyPartSelect(data.serial) // 请求机构的关系，现在需要换成serial字段，todo，不清楚编辑后对配置的影响
      } else {
        console.log(data)
        let parentNode = node.parent
        if (!parentNode) { return }
        if (this.jumpType != 'Update' && this.jumpType != 'CreatePreview') {
          this.orgObj = {
            id: (parentNode.data && node.parent.data.id) || '',
            name: (parentNode.data && node.parent.data.name) || ''
          }
          // this.deviceModel.keyPartType = data.keyPartType;
          // this.deviceModel.keyPartId = data.id;
          // this.deviceModel.keyPartName = data.name;
          this.$set(this.deviceModel, 'keyPartType', data.keyPartType)
          this.$set(this.deviceModel, 'keyPartId', data.id)
          this.$set(this.deviceModel, 'keyPartName', data.name)
          this.$set(this.deviceModel, 'orgName', (parentNode.data && node.parent.data.name) || '')
          this.$set(this.deviceModel, 'orgId', (parentNode.data && node.parent.data.id) || '')
        }

        // this.getKeyPartSelect(parentNode.data.serial)
      }
    },
    clickData(data) {
      if (data && data.nodeKey && data.isRoot) {
        console.log(data)
        this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点this.setPageInfo();
        // if (this.jumpType === 'Create') {
        //   this.deviceModel['orgId'] = data.id
        //   this.deviceModel['orgName'] = data.name
        //   this.orgObj = {id: data.id, name: data.name}
        // }
        if (data.tierType === 'org') {
          if (this.jumpType != 'Update' && this.jumpType != 'CreatePreview') {
            this.orgObj = {
              id: data.id,
              name: data.name
            }
            // this.deviceModel.keyPartType = ''
            // this.deviceModel.keyPartId = ''
            // this.deviceModel.keyPartName = ''
            this.$set(this.deviceModel, 'orgName', data.name)
            this.$set(this.deviceModel, 'orgId', data.id)
            this.$set(this.deviceModel, 'keyPartType', '')
            this.$set(this.deviceModel, 'keyPartId', '')
            this.$set(this.deviceModel, 'keyPartName', '')
          }
        // this.getKeyPartSelect(data.serial) // 请求机构的关系，现在需要换成serial字段，todo，不清楚修改后对配置的影响
        } else {
          console.log(data)
          let parentNode = node && node.parent
          if (!parentNode) { return }
          if (this.jumpType != 'Update' && this.jumpType != 'CreatePreview') {
            this.orgObj = {
              id: (parentNode.data && node.parent.data.id) || '',
              name: (parentNode.data && node.parent.data.name) || ''
            }
            // this.deviceModel.keyPartType = data.keyPartType;
            // this.deviceModel.keyPartId = data.id;
            // this.deviceModel.keyPartName = data.name;
            this.$set(this.deviceModel, 'keyPartType', data.keyPartType)
            this.$set(this.deviceModel, 'keyPartId', data.id)
            this.$set(this.deviceModel, 'keyPartName', data.name)
            this.$set(this.deviceModel, 'orgName', (parentNode.data && node.parent.data.name) || '')
            this.$set(this.deviceModel, 'orgId', (parentNode.data && node.parent.data.id) || '')
          }

        // this.getKeyPartSelect(parentNode.data.serial)
        }
        // this.keyword='';
        // switch (data.tierType) {
        //   case 'res':
        //     this.selectTreeid = { channelId: data.id + '' }
        //     break
        //   case 'equ':
        //     this.selectTreeid = { deviceId: data.id + '' }
        //     break
        //   case 'loc':
        //     this.selectTreeid = { keyPartId: data.id + '' }
        //     break
        //   case 'org':
        //     this.selectTreeid = { orgId: data.id + '' }
        //     break
        // }
        // this.getTableList(this.pageInfo.page)
      }
    },
    // getKeyPartSelect(oId) { // 获取机构下的重点部位
    //   this.keyParts = []
    //   let params = {
    //     type: 2,
    //     oId: oId,
    //     subSystem: '1',
    //     isRecursion: '0'
    //   }
    //   this.getLazyTreeApi(params).then((res) => {
    //     if (res.data.code === 0) {
    //       let data = res.data.data.nodes
    //       data.forEach((item) => {
    //         if (item.tierType === 'loc') {
    //           this.keyParts.push({
    //             label: item.name,
    //             value: item.id,
    //             type: item.keyPartType
    //           })
    //         }
    //       })
    //     }
    //   })
    // },
    // keyPartChange(data) {
    //   let selectData = this.keyParts.filter(i => i.value === data)[0]
    //   this.deviceModel.keyPartType = selectData.type
    // },
    // getKeyPartName(id) { // 通过重点部位id，得到重点部位的名称
    //   let name = ''
    //   this.keyParts.forEach((item) => {
    //     if (item.value === id) {
    //       name = item.label
    //       this.deviceModel.keyPartType = item.type
    //     }
    //   })
    //   return name
    // },
    goBack() { // 返回列表
      this.$confirm('请确定放弃保存正在编辑的内容吗', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '取消',
        cancelButtonText: '确定',
        type: 'warning'
      }).then(() => {}).catch(() => {
        this.$emit('modelChange', {}, `List`)
        // this.$parent.$parent.childrenComponent = 'List'
      })
    },
    createModel() {
      return {
        orgId: this.orgObj.id,
        orgIName: this.orgObj.name,
        keyPartId: '',
        keyPartName: '',
        keyPartType: '',
        subSystem: 1,
        assetCode: '',
        uniqueId: '',
        name: '',
        type: '',
        brand: '',
        modelNum: '',
        accessServer: '192.168.30.61',
        username: '',
        password: '',
        ip: '',
        dport: '',
        cport: '',
        accessProtocol: '',
        protocol: '',
        inputNumber: 0,
        outputNumber: 0,
        analogNumber: 0,
        digitalNumber: 0,
        audioNumber: 0
      }
    },
    updateModel() {
      let oid = this.orgObj.id
      return {
        orgId: oid,
        orgIName: '',
        keyPartId: '',
        keyPartName: '',
        keyPartType: '',
        subSystem: 1,
        assetCode: '',
        uniqueId: '',
        name: '',
        type: '',
        brand: '',
        modelNum: '',
        accessServer: '192.168.30.61',
        username: '',
        password: '',
        ip: '',
        dport: '',
        cport: '',
        accessProtocol: '',
        protocol: '',
        inputNumber: 0,
        outputNumber: 0,
        analogNumber: 0,
        digitalNumber: 0,
        audioNumber: 0
      }
    },
    reset() { // 重置设备模型
      if (this.jumpType === 'Create') {
        let deviceModel = this.doubleMeaning(this.deviceData, 'toLabel')
        if (!deviceModel.orgName && !deviceModel.orgId) {
          deviceModel['orgName'] = this.orgObj.name
          deviceModel['orgId'] = this.orgObj.id
        }
        this.deviceModel = deviceModel
      } else {
        let deviceModel = this.doubleMeaning(this.deviceData, 'toLabel')
        if (!deviceModel.orgName && !deviceModel.orgId) {
          deviceModel['orgName'] = this.orgObj.name
          deviceModel['orgId'] = this.orgObj.id
        }
        this.deviceModel = deviceModel
      }
      this.$refs['deviceModel'].resetFields()
      this.$refs['deviceModel2'].resetFields()
    },
    saveDevice() {
      // zp 添加校验
      this.$refs['deviceModel'].validate((valid) => {
        if (valid) {
          console.log('1111', valid)
          this.$refs['deviceModel2'].validate((valid2) => {
            if (valid2) {
              if (!(/^[\u4e00-\u9fa5]+$/i.test(this.deviceModel.brand))) {
                this.deviceModel = this.doubleMeaning(this.deviceModel, 'toLabel')
              }
              let models = MODELS[`${this.deviceModel.brand}`] || []
              // console.log(MODELS, MODELS[this.deviceModel.brand], models, this.deviceModel.brand)
              let deviceModel = this.doubleMeaning(this.deviceModel, 'toValue')
              // this.deviceModel.cport = Number(this.deviceModel.cport) || 0
              // this.deviceModel.dport = Number(this.deviceModel.dport) || 0
              // this.
              // console.log('1111', deviceModel)
              // this.deviceModel.sdk = this.deviceModel.modelNum != '' && this.models.filter(v => v.value == this.deviceModel.modelNum)[0].sdk
              deviceModel.sdk = deviceModel.modelNum !== '' && models.filter(v => v.value === deviceModel.modelNum)[0].sdk
              deviceModel.orgId = this.orgObj.id
              delete deviceModel.updatedAt
              delete deviceModel.updatedDept
              delete deviceModel.updatedBy
              if (this.vnvrs) {
                delete deviceModel.inputNumber
                delete deviceModel.outputNumber
                delete deviceModel.analogNumber
                delete deviceModel.digitalNumber
                delete deviceModel.audioNumber
              }
              console.log('deviceModel-------', deviceModel)
              if (this.jumpType === 'Create') {
                addDeviceApi(deviceModel).then((res) => {
                  if (res.data.code === 0) {
                    this.deviceId = res.data.data.id
                    // 获取单个设备详情
                    this.getDeviceInfo(res.data.data.id, _ => {
                      this.createPreview = true
                      this.jumpType = 'CreatePreview'
                    })
                  } else {
                    throw res.data.message
                  }
                }).then(_ => {
                  this.$notify({
                    title: NOTIFY.TITLE.SUCCESS,
                    message: '新增设备成功',
                    type: NOTIFY.TYPE.SUCCESS
                  })
                }).catch(err => {
                  this.$notify({
                    title: NOTIFY.TITLE.ERROR,
                    message: err,
                    type: NOTIFY.TYPE.ERROR
                  })
                })
              } else if (this.jumpType === 'Update') {
                putDeviceApi(this.deviceId, deviceModel).then((res) => {
                  if (res.data.code === 0) {
                    this.getDeviceInfo(this.deviceId, _ => {
                      this.createPreview = true
                      this.jumpType = 'CreatePreview'
                    })
                  } else {
                    throw res.data.message
                  }
                }).then(_ => {
                  this.$notify({
                    title: NOTIFY.TITLE.SUCCESS,
                    message: '更新数据成功',
                    type: NOTIFY.TYPE.SUCCESS
                  })
                }).catch(err => {
                  this.$notify({
                    title: NOTIFY.TITLE.ERROR,
                    message: err,
                    type: NOTIFY.TYPE.ERROR
                  })
                })
              }
            } else {
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    getDeviceInfo(dId, next) { // 获取单个设备的信息
      getDeviceInfoApi(dId).then((res) => {
        if (res.data.code === 0) {
          let info = this.$lodash.cloneDeep(res.data.data.host)
          console.log(this.doubleMeaning(info, 'toLabel'), res.data)
          info = this.doubleMeaning(info, 'toLabel')
          console.log(info)
          this.devInfo = info
          this.deviceModel = this.$lodash.cloneDeep(info)
          this.bottomResult = new Date().getTime().toString().slice(-6)
          next()
        } else {
          throw res.data.message
        }
      }).then(_ => {
        this.$notify({
          title: NOTIFY.TITLE.SUCCESS,
          message: '获取设备信息成功',
          type: NOTIFY.TYPE.SUCCESS
        })
      }).catch(err => {
        this.$notify({
          title: NOTIFY.TITLE.ERROR,
          message: err,
          type: NOTIFY.TYPE.ERROR
        })
      })
    },
    createDevice() {
      this.deviceModel = this.createModel()
      this.createPreview = false
      this.jumpType = 'Create'
    },
    filterNum(oldModel) { // 过滤通道数量为空字符串时默认是0
      if (oldModel.analogNumber == '') {
        oldModel.analogNumber = 0
      }
      if (oldModel.audioNumber == '') {
        oldModel.audioNumber = 0
      }
      if (oldModel.digitalNumber == '') {
        oldModel.digitalNumber = 0
      }
      if (oldModel.inputNumber == '') {
        oldModel.inputNumber = 0
      }
      if (oldModel.outputNumber == '') {
        oldModel.outputNumber = 0
      }
    },
    async updateDevice() {
      console.log(this.deviceModel)
      // let oldModel = this.$lodash.cloneDeep(this.deviceModel)
      // await this.filterNum(oldModel)
      // this.deviceModel = {
      //   ...this.updateModel(),
      //   ...oldModel
      // }
      this.createPreview = false
      this.jumpType = 'Update'
    },
    copyDevice() {
      let oldModel = this.$lodash.cloneDeep(this.deviceModel)
      let newModel = this.createModel()
      Object.keys(oldModel).forEach((key) => {
        if (newModel.hasOwnProperty(key)) {
          newModel[key] = oldModel[key]
        }
      })
      this.deviceModel = this.$lodash.cloneDeep(newModel)
      this.createPreview = false
      this.jumpType = 'Create'
      this.$parent.$parent.childrenComponent = 'Create'
    },
    deleteDevice() {
      this.$confirm('请确定该设备是否删除?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        deleteDeviceApi({
          ids: [this.deviceId]
        }).then((res) => {
          if (res.data.code === 0) {
          } else {
            throw res.data.message
          }
        }).then(_ => {
          this.$notify({
            title: NOTIFY.TITLE.SUCCESS,
            message: '删除成功',
            type: NOTIFY.TYPE.SUCCESS
          })
          let timer = setTimeout(_ => {
            this.$parent.$parent.childrenComponent = 'List'
          }, 1500)
          this.$once('hook:beforeDestroy', _ => clearTimeout(timer))
        }).catch(err => {
          this.$notify({
            title: NOTIFY.TITLE.ERROR,
            message: `删除${err === 'error' ? '失败' : err}`,
            type: NOTIFY.TYPE.ERROR
          })
        })
      }).catch(_ => {})
    }
  },
  beforeDestroy() {
    this.deviceId = ''
    this.devInfo = {}
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除定时器
    }
  }
}
</script>

<style lang="less" scoped>
.creat-box .content .main .form-box .form-content[data-v-c193f106] .el-form-item{
  margin-bottom:15px;
}
.creat-box {
  width: 100%;
  height: 100%;
  display: flex;
  .tree-content {
    width: 280px;
    height: 100%;
    overflow: hidden;
  }
  .content {
    width: calc(~'100% - 280px');
    height: 100%;
    padding-left: 22px;
    padding-bottom: 10px;
    box-shadow: 0 0 10px #ccc inset;
    .top {
      .header {
        margin: 23px 0;
        /deep/ .el-breadcrumb {
          font-size: 12px;
          .active {
            .el-breadcrumb__inner {
              color: #2D72D3;
            }
          }
        }
      }
    }
    .main {
      margin-top: 10px;
      height: calc(~'100% - 103px');
      overflow: auto;
      .title-box {
        text-align: center;
        width: 80%;height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #333;
      }
      .form-box {
        width: 80%;
        height: auto;
        // margin: 0 auto;
        .form-content {
          display: flex;
          font-size: 12px;
          padding: 15px 15px 10px 0px;background:rgba(245,245,245,1);
          border: 1px solid rgba(225, 225, 225, 1);
          .left-form {
            width: 50%;
            margin-right: 24px;
          }
          .right-form {
            width: 50%;
          }
          /deep/ .el-form-item {
            margin-bottom: 5px;
            .el-select {
              width: 100%;
            }
            .el-popper {
              width: 424px;
            }
          }
        }
        .form-content-bottom {
          display: flex;
          height: 36px;
          font-size: 12px;
          background:rgba(245,245,245,1);
          border: 1px solid rgba(225, 225, 225, 1);
          margin-top: 10px;
          .form-item {
            flex:1;
            display: flex;
            .form-item-label {
              width: 45%;
              line-height: 34px;
              text-align: center;
            }
            .form-item-value {
              width: 55%;
              line-height: 34px;
              text-align: center;background:white;
            }
          }
        }
        .form-footer {
          width: 100%;
          margin-top: 10px;
          text-align: center;
        }
        .title {
          text-align: center;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          color: #333;
        }
        .info-detail {
          width: 100%;
          border: 1px solid rgba(225, 225, 225, 1);
          background: #fff;
          box-sizing:border-box;
          display: flex;
          flex-wrap: wrap;
          .info-detail-item {
            width: 50%;
            height: 38px;
            line-height: 36px;border: 1px solid rgba(225, 225, 225, 1);
            display: flex;
            .info-item-label {
              flex: 1;
              height: 100%;
              text-align: center;
              background: rgba(245,245,245,1);
            }
            .info-item-value {
              flex: 2;
              text-indent: 32px;
              // border: 1px solid #f7f2f1;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
        .info-user  {
          width: 100%;
          border: 1px solid rgba(225, 225, 225, 1);
          background: #fff;
          display: flex;
          margin-top: 20px;
          .info-detail-item {
            flex: 1;
            height: 38px;
            line-height: 38px;
            display: flex;
            .info-item-label {
              width: 45%;
              line-height: 36px;
              background: rgba(245,245,245,1);
              text-align: center;
            }
            .info-item-value {
              width: 55%;
              line-height: 36px;
              text-align: center;background:white;
            }
          }
        }
      }
    }
  }
}

@media print {
  .main {
      min-width: 1083px;
      max-width: 1360px;
      padding: 20px;
      // overflow: auto;
      .title-box {
        text-align: center;
        width: 80%;height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #333;
      }
      .form-box {
        width: 80%;
        height: auto;
        // margin: 0 auto;
        .form-content {
          display: flex;
          font-size: 12px;
          padding: 15px 15px 10px 0px;background:rgb(156, 156, 156);
          box-sizing: border-box;
          border: 1px solid rgb(0, 0, 0);
          .left-form {
            width: 50%;
            margin-right: 24px;
          }
          .right-form {
            width: 50%;
          }
          /deep/ .el-form-item {
            margin-bottom: 5px;
            .el-select {
              width: 100%;
            }
            .el-popper {
              width: 424px;
            }
          }
        }
        .form-content-bottom {
          display: flex;
          height: 36px;
          font-size: 12px;
          background:rgb(160, 158, 158);
          box-sizing: border-box;
          border: 1px solid rgb(0, 0, 0);
          margin-top: 10px;
          .form-item {
            flex:1;
            display: flex;
            .form-item-label {
              width: 45%;
              line-height: 34px;
              text-align: center;
            }
            .form-item-value {
              width: 55%;
              line-height: 34px;
              text-align: center;background:white;
            }
          }
        }
        .form-footer {
          width: 100%;
          margin-top: 10px;
          text-align: center;
        }
        .title {
          text-align: center;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          color: #333;
        }
        .info-detail {
          width: 100%;
          border: 1px solid rgba(225, 225, 225, 1);
          background: #fff;
          box-sizing:border-box;
          display: flex;
          flex-wrap: wrap;
          .info-detail-item {
            width: 50%;
            height: 38px;
            line-height: 36px;
            display: flex;overflow: hidden;
            border: 1px solid rgb(0, 0, 0);
            .info-item-label {
              flex: 1;
              height: 100%;
              text-align: center;
              background: rgba(245,245,245,1);overflow: hidden;
              border-right: 1px solid black;
            }
            .info-item-value {
              flex: 2;
              text-indent: 32px;
              // border: 1px solid #f7f2f1;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
        .info-user  {
          width: 100%;
          border: 1px solid rgba(225, 225, 225, 1);
          background: #fff;
          display: flex;
          margin-top: 20px;overflow: hidden;
          box-sizing:border-box;
          .info-detail-item {
            flex: 1;
            height: 38px;
            line-height: 38px;
            display: flex;overflow: hidden;
          box-sizing:border-box;
            .info-item-label {
              width: 45%;
              line-height: 36px;overflow: hidden;
          box-sizing:border-box;
            border: 1px solid rgb(0, 0, 0);
              text-align: center;
            }
            .info-item-value {
              width: 55%;
              line-height: 36px;
              text-align: center;background:white;overflow: hidden;
          box-sizing:border-box;
            border: 1px solid rgb(0, 0, 0);
            }
          }
        }
      }
    }
  // .main {
  //   min-width: 1123px;
  //   margin: 0 auto;
  //   .title-box {
  //       text-align: center;
  //       width: 80%;
  //       height: 40px;
  //       line-height: 40px;
  //       font-size: 16px;
  //       color: #333;
  //   }
  //   .form-box {
  //       width: 80%;
  //       height: auto;
  //       // margin: 0 auto;
  //       .form-content {
  //         display: flex;
  //         font-size: 12px;
  //         padding: 10px;
  //         border: 1px solid #333;
  //         .left-form {
  //           width: 50%;
  //           margin-right: 24px;
  //         }
  //         .right-form {
  //           width: 50%;
  //         }
  //         /deep/ .el-form-item {
  //           margin-bottom: 5px;
  //           .el-select {
  //             width: 100%;
  //           }
  //           .el-popper {
  //             width: 424px;
  //           }
  //         }
  //       }
  //       .form-content-bottom {
  //         display: flex;
  //         font-size: 12px;
  //         padding: 10px;
  //         border: 1px solid #333;
  //         margin-top: 10px;
  //         .form-item {
  //           width: 33.3%;
  //           height: 30px;
  //           line-height: 30px;
  //           display: flex;
  //           .form-item-label {
  //             width: 135px;
  //             height: calc(~'100% + 2px');
  //             text-align: center;
  //             background: #F5F7FA;
  //             border: 1px solid #fff;
  //           }
  //           .form-item-value {
  //             flex: 1;
  //           }
  //         }
  //       }
  //       .form-footer {
  //         width: 100%;
  //         margin-top: 10px;
  //         text-align: center;
  //       }
  //       .title {
  //         text-align: center;
  //         height: 40px;
  //         line-height: 40px;
  //         font-size: 16px;
  //         color: #333;
  //       }
  //       .info-detail {
  //         width: 100%;
  //         border: 1px solid #333;
  //         background: #fff;
  //         padding: 5px;
  //         display: flex;
  //         flex-wrap: wrap;
  //         .info-detail-item {
  //           width: 50%;
  //           height: 30px;
  //           line-height: 30px;
  //           display: flex;
  //           .info-item-label {
  //             width: 135px;
  //             height: 100%;
  //             text-align: center;
  //             background: #f7f2f1;
  //             border: 1px solid #fff;
  //           }
  //           .info-item-value {
  //             flex: 1;
  //             text-indent: 10px;
  //             border: 1px solid #f7f2f1;
  //             text-overflow: ellipsis;
  //             white-space: nowrap;
  //             overflow: hidden;
  //           }
  //         }
  //       }
  //       .info-user  {
  //         width: 100%;
  //         border: 1px solid #333;
  //         background: #fff;
  //         padding: 5px;
  //         display: flex;
  //         flex-wrap: wrap;
  //         margin-top: 20px;
  //         .info-detail-item {
  //           width: 33%;
  //           height: 30px;
  //           line-height: 30px;
  //           display: flex;
  //           .info-item-label {
  //             width: 135px;
  //             height: 100%;
  //             text-align: center;
  //             background: #f7f2f1;
  //             border: 1px solid #fff;
  //           }
  //           .info-item-value {
  //             flex: 1;
  //             text-indent: 10px;
  //             border: 1px solid #f7f2f1;
  //           }
  //         }
  //       }
  //   }
  // }
}
</style>
