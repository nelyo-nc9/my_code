<template>

  <div class="BasicsCtrl">
    <div class="dome-box">
      <dome class="dome" @stop="ptzStop" @start="ptzCtrol">
      </dome>
      <div class="times-box">
        <times title="变倍" @startMinus="ptzCtrol('zoomIn')" @stopMinus="ptzStop('zoomIn')" @stopAdd="ptzStop('zoomOut')" @startAdd="ptzCtrol('zoomOut')">
        </times>
        <times title="光圈" @startMinus="ptzCtrol('irisClose')" @stopMinus="ptzCtrol('stopAll')" @stopAdd="ptzCtrol('stopAll')" @startAdd="ptzCtrol('irisOpen')">
        </times>
        <times title="焦距" @startMinus="ptzCtrol('focusFar')" @stopMinus="ptzCtrol('stopAll')" @stopAdd="ptzCtrol('stopAll')" @startAdd="ptzCtrol('focusNear')">
        </times>
        <div class="speed">
          <b>速度</b>
          <div class="slider-box">
            <slider color="#4699f8" :range="true" :size="5" :minValue='1' v-model="speed">
            </slider>
          </div>
        </div>
      </div>
    </div>

    <div class="ctrlBtn" v-if="showMore">
      <i class="iconfont icon-lighting" :class="{'active':openleLight}" title='灯光' @click="handleLight"></i>
      <i class="iconfont icon-wiper" title='雨刷' :class="{'active':openWiper}" @click="handleWiper"></i>
      <i class="iconfont icon-focusing" title='辅助对焦' :class="{'active':openFocus}" @click="handleFocus"></i>
      <!-- <i class="iconfont icon-d hide" title='3D控制' :class="{'active':open3Dctrl}" @click="handle3DCtrl"></i>
      <i class="iconfont icon-speed hide" title='激光变倍' :class="{'active':openLaserZoom}" @click="handleLaserZoom"></i> -->
      <i class="iconfont icon-chushihua" title='镜头初始化' @click="shotInit"></i>
      <!-- <i class="iconfont icon-patrol hide" title="一键守望"></i> -->
    </div>

    <!--高级控制-->
    <div class="advancedControl" v-if="showMore" ref="advancedControl">
      <div class="tit">
        <div class="jx l"></div>
        <div class="jx r"></div>
        <div class="title" @click='advancedOpen=!advancedOpen'>
          <i :class="!advancedOpen ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
          &nbsp;高级控制
        </div>
      </div>
      <div class="advanceSelected" v-if='advancedOpen'>
        <ul>
          <li :class="{'active': advanceSelected === 'yuzhiwei'}" @click="advanceSelected = 'yuzhiwei'">预置位</li>
          <li :class="{'active': advanceSelected === 'xunhang'}" @click="advanceSelected = 'xunhang'">巡航</li>
          <li :class="{'active': advanceSelected === 'guiji'}" @click="advanceSelected = 'guiji'">轨迹</li>
          <li :class="{'active': advanceSelected === 'saomiao'}" @click="advanceSelected = 'saomiao'">扫描</li>
        </ul>
        <!--预置位-->
        <div v-show="advanceSelected === 'yuzhiwei'" class="yuzhiwei advance-item">
          <div class="advance-box clearFloat">
            <el-select v-model="presetVal" size='mini' :disabled='presetSetOpen' style="width:140px;float:left; background: gray">
              <el-option v-for="item in presetAllList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <div class="advance-btn " :class="{'dis-btn': presetSetOpen}" @click="transPreset">调用</div>
            <div class="advance-icon" v-if="showMore" @click='presetSetOpen=!presetSetOpen'>
              <i class="iconfont icon-setting" :class="{'icon-recovery': presetSetOpen}"></i>
            </div>
          </div>

          <div class="advance-set" v-if='presetSetOpen'>
            <div class="setList clearFloat">
              <div class="title">设置预置位</div>
              <el-select v-model="presetAllVal" size='mini' style="width:120px;float:left;" transfer>
                <el-option v-for="item in presetAllList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <div class="advance-icon" @click="addPreset" :class="{'dis-icon': presetAllList.length === 0}">
                <i class="iconfont icon-save"></i>
              </div>
            </div>
            <div class="setList clearFloat">
              <div class="title">已设置预置位</div>
              <el-select v-model="presetDelVal" size='mini' style="width:120px;float:left;" transfer>
                <el-option v-for="item in presetDelList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <div class="advance-icon" @click="delPreset" :class="{'dis-icon': presetDelList.length === 0}">
                <i class="iconfont icon-delete"></i>
              </div>
            </div>
          </div>
        </div>
        <!--巡航-->
        <div v-show="advanceSelected === 'xunhang'" class="xunhang advance-item" :height="xunhangHeight" :class="{cruiseSetOff: !cruiseSetOpen}">
          <div class="advance-box clearFloat">
            <el-select v-model="cruiseVal" size='mini' :disabled='cruiseList.length === 0 || cruiseSetOpen' style="width:140px;float:left;" transfer>
              <el-option v-for="item in cruiseList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <div class="advance-btn " @click="transCuise" :class="{'dis-btn': cruiseList.length === 0 || cruiseSetOpen}">调用</div>
            <div class="advance-icon" v-if="showMore" @click='(cruiseSetOpen?xunhangHeight="25px":xunhangHeight="205px");cruiseSetOpen=!cruiseSetOpen'>
              <i class="iconfont icon-setting" :class="{'icon-recovery': cruiseSetOpen}"></i>
            </div>
          </div>

          <div class="advance-set" v-show='cruiseSetOpen'>
            <div class="setList clearFloat">
              <div class="title" style="width:60px">巡航路径</div>
              <el-select v-model="cruiseRouteVal" size='mini' @change="cruiseRouteValCheng" style="width:110px;float:left;" transfer>
                <el-option v-for="item in cruiseRouteList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <div class="advance-icon" @click="addPreseToCuise" :class="{'dis-icon': cruiseRouteList.length === 0}">
                <i class="iconfont icon-large"></i>
              </div>
              <div class="advance-icon" @click="saveCurisePreset" :class="{'dis-icon': cruiseRouteList.length === 0}">
                <i class="iconfont icon-save"></i>
              </div>
            </div>

            <div style="width:100%;max-height:320px;overflow-y:scroll;">
              <table class="table">
                <tr>
                  <th>
                    <div style="width:60px">预置点</div>
                  </th>
                  <th>
                    <div style="width:50px">速度</div>
                  </th>
                  <th>
                    <div style="width:65px">时间（秒）</div>
                  </th>
                  <th>
                    <div style="width:50px">操作</div>
                  </th>
                </tr>

                <tr v-for="(item,i) in cruiseSetData" :key="i">
                  <td>
                    <el-select v-model="item.preset" size='mini' style="width:60px;" transfer>
                      <el-option v-for="item in presetAllList" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-select v-model="item.speed" size='mini' style="width:60px;" transfer>
                      <el-option v-for="item in orbitSpeedList" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-input-number :max="3600" :min="5" v-model="item.time" size='small' controls-position="right" style="width:100px;"></el-input-number>
                  </td>
                  <td>
                    <i class="iconfont icon-delete" @click="delCruiseData(i,item)"></i>
                    <i class="iconfont icon-move-up" @click="upCruiseData(i)"></i>
                    <i class="iconfont icon-move-down" @click="downCruiseData(i)"></i>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <!--轨迹-->
        <div v-if="advanceSelected === 'guiji'" class="guiji advance-item">
          <div class="advance-box clearFloat">
            <el-select v-model="orbitVal" size='mini' :disabled='orbitList.length === 0 || orbitSetOpen' style="width:140px;float:left;">
              <el-option v-for="item in orbitList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <div class="advance-btn " @click="transTraj" :class="{'dis-btn': orbitList.length === 0 || orbitSetOpen}">调用</div>
            <div class="advance-icon" v-if="showMore" @click='orbitSetOpen=!orbitSetOpen'>
              <i class="iconfont icon-setting" :class="{'icon-recovery': orbitSetOpen}"></i>
            </div>
          </div>

          <div class="advance-set" v-if='orbitSetOpen'>
            <div class="setList clearFloat">
              <div class="title">轨迹路径</div>
              <el-select v-model="orbitRouteVal" size='mini' style="width:120px;float:left;">
                <el-option v-for="item in orbitRouteList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="setList clearFloat">
              <div class="title">轨迹速度</div>
              <el-select v-model="orbitSpeedVal" size='mini' style="width:120px;float:left;">
                <el-option v-for="item in orbitSpeedList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="setList guijiSet clearFloat">
              <div class="advance-btn-big " @click="recordTraj?stopRecordTraj():startRecordTraj()" :class="{'dis-btn': orbitRouteList.length === 0}">{{recordTraj?'停止录制':'录制轨迹'}}</div>
            </div>
          </div>
        </div>
        <!--扫描-->
        <div v-if="advanceSelected === 'saomiao'" class="saomiao advance-item">
          <div class="advance-box clearFloat">
            <div class="advance-btn-big " @click="linearScan" :class="{'dis-btn': scanSetOpen}">随机扫描</div>
            <div class="advance-btn-big " @click="scanAuto" :class="{'dis-btn': scanSetOpen}">自动扫描</div>
            <div class="advance-icon" @click='scanSetOpen=!scanSetOpen' v-if="showMore">
              <i class="iconfont icon-setting" :class="{'icon-recovery': scanSetOpen}"></i>
            </div>
          </div>
          <div class="advance-set" v-if='scanSetOpen'>
            <div class="setList clearFloat">
              <div class="title">扫描速度</div>
              <el-select v-model="scanSpeedVal" size='mini' style="width:120px;float:left;">
                <el-option v-for="item in scanSpeedList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="setList saomiaoSet clearFloat">
              <div class="advance-btn-big " @click="leftEdge" :class="{'dis-btn': scanSpeedList.length === 0}">设置左限位</div>
              <div class="advance-btn-big " @click="rightEdge" :class="{'dis-btn': scanSpeedList.length === 0}">设置右限位</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { YUNNAN_CTRL_SET, YUNNAN_CTRL_GET, recordUserLog } from '@src/http/video/videoPreview.api.js'
import Dome from './ImgDom'
import Times from './RightItem'
import Slider from './Slider'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'BasicsCtrl',
  components: {
    Dome,
    Times,
    Slider
  },
  props: {
    showMore: {
      default: false
    }
  },
  data() {
    return {
      yuntaiParams:{},
      xunhangHeight: '25px',
      speed: 3,
      advanceSelected: 'yuzhiwei', // 当前选中的标签
      advancedOpen: false, // 控制高级设置的显示隐藏
      presetList: [], // 预置位
      presetVal: 1, // 绑定的预设位置
      presetAllList: [], // 预设位置的下拉填充 255
      presetAllVal: '', // 绑定设置预置位
      presetDelList: [
        {
          value: 'all',
          label: '全部'
        }
      ], // 已预设位置的下拉填充
      presetDelVal: 1, // 绑定的已预设位置
      isaddPreset: false, // 控制多次点击添加预设位置的变量
      isdelPreset: false, // 控制多次点击删除预设位置的变量
      cruiseList: [], // 巡航下拉填充
      cruiseVal: 1, // 绑定的巡航
      cruiseSetList: [],
      cruiseRouteList: [], // 巡航路径下拉填充 8
      cruiseRouteVal: 1, // 绑定巡航路径
      cruiseSetData: [], // 巡航路径表格数据
      orbitList: [], // 轨迹下拉填充
      orbitVal: 1, // 绑定的轨迹
      orbitRouteList: [], // 轨迹路径的下拉填充
      orbitRouteVal: 1, // 绑定的轨迹路径
      orbitSpeedList: [], // 轨迹速度下拉填充
      orbitSpeedVal: 1, // 绑定的轨迹速度
      recordTraj: false, // 控制停止录制和开始录制
      scanSpeedList: [], // 扫描速度下拉填充
      scanSpeedVal: 1, // 扫描速度
      presetSetOpen: false,
      cruiseSetOpen: false,
      orbitSetOpen: false,
      scanSetOpen: false,
      openleLight: false,
      openWiper: false,
      openFocus: false,
      open3Dctrl: false,
      openLaserZoom: false
    }
  },
  created() {
    this.getshishi()
    this.cruiseRouteList = this.getNumberArr(8)
    this.presetAllList = this.getNumberArr(255)
    this.orbitRouteList = this.getNumberArr(5)
    this.orbitList = this.getNumberArr(5)
    this.orbitSpeedList = this.getNumberArr(7)
    this.scanSpeedList = this.getNumberArr(5)
    this.cruiseList = this.getNumberArr(8)
    this.cruiseSetList = new Array(8).fill([])
  },
  computed: {
    plugin() {
      return this.$parent.plugin
    },
    pluginStatus() {
      return this.$parent.pluginStatus
    },
    ...mapState({
      playParams: ({ tvWall }) => tvWall.playParams // 判断拖拽的什么东西上墙:资源还是轮巡等
    })
  },
  watch: {
    playParams: function (newmess, oldmess) {
      this.yuntaiParams =newmess
    },
    'plugin.checkedPane'() {
      if (!this.pluginStatus.isPlay) {
        return
      }
      this.getYuntai()
    },
    'pluginStatus.isPlay'(b) {
      if (!this.pluginStatus.isPlay) {
        return
      }
      this.getYuntai()
    },
    cruiseRouteVal() {
      this.cruiseSetData = this.$lodash.cloneDeep(this.cruiseSetList[this.cruiseRouteVal - 1])
    },
    advanceSelected() {
      this.cruiseSetData = []
      if (this.advanceSelected === 'xunhang') {
        this.cruiseSetData = this.$lodash.cloneDeep(this.cruiseSetList[this.cruiseRouteVal - 1])
      }
    }
  },
  methods: {
    ...mapActions(['getCameraPower']),
    getshishi() {
      console.log(this.playParams);
      let devInfo = {}
      devInfo = {
        // devIp: '10.1.3.20',
        // devPort: 8000,playParams
        devIp: this.playParams.ip,
        devPort: Number(this.playParams.cport)
      }
      const param = {
        devInfo: devInfo
      }
      this.getPresets(param)
    },
    getYuntai() {
      const res = this.plugin.videoPageData[this.plugin.checkedPane]
      let devInfo = {}
      if (res && !res.gbDevId) {
        if (res.gbDevId) {
          const id = window.serverId[res.shareServer]
          devInfo = {
            gbPlaDevIp: id.ip,
            gbPlaDevPort: id.port,
            gbDevId: res.gbDevId,
            gbPlaNvrId: id.serverId
          }
        } else {
          devInfo = {
            devIp: res.devIp,
            devPort: res.devCport
          }
        }
        const param = {
          devInfo: devInfo
        }
        this.getPresets(param)
        // this.getCuise(param)
        // this.getTrial(param)
        // this.getScan(param)
      }
    },
    ptzCtrol(cmd) {
      this.controlDome(cmd)
    },
    ptzStop(cmd) {
      this.controlDome(cmd, 0, 1, 1, 5, 1, 1, 'noNotice') // 不提示没有权限
    },
    // 灯光
    handleLight() {
      if (this.openleLight) {
        this.controlDome('lightPwrOn', 0).then(res => {
          if (res.status === 200) {
            this.openleLight = false
          }
        })
      } else {
        this.controlDome('lightPwrOn').then(res => {
          if (res.status === 200) {
            this.openleLight = true
          }
        })
      }
    },
    // 雨刷
    handleWiper() {
      if (this.openWiper) {
        this.controlDome('wiperPwrOn', 0).then(res => {
          if (res.status === 200) {
            this.openWiper = false
            console.log('雨刷');
          }
        })
      } else {
        this.controlDome('wiperPwrOn').then(res => {
          if (res.status === 200) {
            this.openWiper = true
          }
        })
      }
    },
    // 对焦
    handleFocus() {
      if (this.openFocus) {
        this.controlDome('auxPwrOn1', -1).then(res => {
          if (res.status === 200) {
            this.openFocus = false
          }
        })
      } else {
        this.controlDome('auxPwrOn1').then(res => {
          if (res.status === 200) {
            this.openFocus = true
          }
        })
      }
    },
    // 激光变倍
    handleLaserZoom() {
      if (this.openLaserZoom) {
        // this.controlDome('auxPwron1', -1)
      } else {
        // this.controlDome('auxPwron1')
      }
      // this.openLaserZoom = !this.openLaserZoom
    },
    // 3D控制
    handle3DCtrl() {
      if (this.open3Dctrl) {
        // this.controlDome('auxPwron1', -1)
      } else {
        // this.controlDome('auxPwron1')
      }
      // this.open3Dctrl = !this.open3Dctrl
    },
    // 镜头初始化
    shotInit() {
      this.controlDome('initCamera')
        .then(res => {
          this.$Notice.success({ title: '提示', desc: '镜头初始化成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '镜头初始化失败！' })
          console.log(err)
        })
    },
    // 调用预置位
    transPreset() {
      if (this.presetSetOpen) {
        return
      }
      this.controlDome('gotoPreset', this.speed, this.presetVal)
        .then(res => {
          this.$Notice.success({ title: '提示', desc: '调用预置位成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '调用预置位失败！' })
          console.log(err)
        })
    },
    getPresets(param) {
      // 获取预置位
      YUNNAN_CTRL_GET.getpreset(param)
        .then(suc => {
          console.log(suc);
          const arr = JSON.parse(JSON.stringify(suc.data.presetArr))
          this.presetList = []
          this.presetDelList = [
            {
              value: 'all',
              label: '全部'
            }
          ]
          arr.forEach(item => {
            this.presetList.push({ value: item, label: item })
            this.presetDelList.push({ value: item, label: item })
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    addPreset() { // todo 目前支持支获取，不支持设置
      // 添加预置位
      if (this.isaddPreset) {
        return
      }
      for (var i = 0; i < this.presetList.length; i++) {
        if (this.presetList[i].value === this.presetAllVal) {
          return
        }
      }
      this.isaddPreset = true
      this.controlDome('setPreset', this.speed, this.presetAllVal)
        .then(res => {
          if (res.status === 200) {
            this.presetDelList.push({ value: this.presetAllVal, label: this.presetAllVal })
            this.presetList.push({ value: this.presetAllVal, label: this.presetAllVal })
            this.$Notice.success({ title: '提示', desc: '预置位添加成功！' })
            console.log(this.presetDelList, this.presetList)
          }
          this.isaddPreset = false
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '预置位添加失败！' })
          this.isaddPreset = false
          console.log(err)
        })
    },
    delPreset() {
      // 删除预置位
      if (this.isdelPreset) {
        return
      }
      this.isdelPreset = true
      if (this.presetDelVal === 'all') {
        this.presetDelList.forEach(item => {
          if (item.value !== 'all') {
            this.controlDome('clrPreset', this.speed, item.label)
          }
        })
        this.presetList = []
        this.presetDelList = [{ value: 'all', label: '全部' }]
        this.isdelPreset = false
        return
      }
      this.controlDome('clrPreset', this.speed, this.presetDelVal)
        .then(() => {
          for (var i = 0; i < this.presetList.length; i++) {
            if (this.presetList[i].value === this.presetDelVal) {
              this.presetList.splice(i, 1)
            }
          }
          for (var j = 0; j < this.presetDelList.length; j++) {
            console.log(this.presetDelList[j].value, this.presetDelVal)
            if (this.presetDelList[j].value === this.presetDelVal) {
              this.presetDelList.splice(j, 1)
            }
          }
          // 更新下拉框的当前值
          this.presetDelVal = this.presetDelList[this.presetDelList.length - 1].value
          this.isdelPreset = false
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '预置位删除失败！' })
          this.isdelPreset = false
          console.log(err)
        })
    },
    // 巡航
    transCuise() {
      if (this.cruiseList.length === 0 && this.cruiseSetOpen) {
        return
      }
      this.controlDome('runSeq', this.speed, 1, this.cruiseVal)
        .then(itme => {
          this.$Notice.success({ title: '成功', desc: '巡航调用成功！' })
        })
        .catch(() => {
          this.$Notice.error({ title: '失败', desc: '巡航调用失败！' })
        })
    },
    StopCuise() {
      this.controlDome('stopSeq', this.speed, 1, this.cruiseVal)
    },
    getCuise(param) {
      YUNNAN_CTRL_GET.getcruisepath(param)
        .then(suc => {
          this.cruiseList = [].concat(this.cruiseRouteList)
        })
        .catch(err => err)
    },
    addPreseToCuise() {
      this.cruiseSetData.push({
        preset: 1,
        speed: 1,
        time: 5
      })
    },
    async saveCurisePreset() {
      this.cruiseSetList[this.cruiseRouteVal - 1] = this.cruiseSetData

      let result = true
      for (let i = this.cruiseSetData.length - 1; i >= 0; i--) {
        const item = this.cruiseSetData[i]
        await this.controlDome('fillPreSeq', item.speed, item.preset, this.cruiseRouteVal, item.time).catch(err => {
          if (err) {
            result = false
          }
        })
        await this.controlDome('setSeqDwell', item.speed, item.preset, this.cruiseRouteVal, item.time).catch(err => {
          if (err) {
            result = false
          }
        })
        await this.controlDome('setSeqSpeed', item.speed, item.preset, this.cruiseRouteVal, item.time).catch(err => {
          if (err) {
            result = false
          }
        })
      }
      if (result) {
        this.$Notice.success({ title: '成功', desc: '保存成功！' })
      } else {
        this.$Notice.error({ title: '失败', desc: '保存失败！' })
      }
    },
    delCruiseData(i, item) {
      this.cruiseSetData.splice(i, 1)
      this.controlDome('clrPreSeq', item.speed, item.preset, this.cruiseRouteVal, item.time)
        .then(() => {
          this.$Notice.success({ title: '成功', desc: '删除成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '删除失败！' })
          console.log(err)
        })
    },
    upCruiseData(i) {
      i = parseInt(i)
      if (i === 0) {
        return
      }
      const item = this.cruiseSetData[i - 1]
      this.cruiseSetData.splice(i - 1, 1)
      this.cruiseSetData.splice(i, 0, item)
    },
    downCruiseData(i) {
      i = parseInt(i)
      if (i === this.cruiseSetData.length - 1) {
        return
      }
      const item = this.cruiseSetData[i]
      this.cruiseSetData.splice(i, 1)
      this.cruiseSetData.splice(i + 1, 0, item)
    },
    cruiseRouteValCheng() {
      this.cruiseSetData.length = 0
    },
    // 轨迹
    getTrial(param) {
      YUNNAN_CTRL_GET.getcruiselocus(param)
        .then(suc => {
          this.orbitList = [].concat(this.orbitRouteList)
        })
        .catch(err => err)
    },
    transTraj() {
      if (this.orbitList.length === 0 && this.orbitSetOpen) {
        return
      }
      this.controlDome('runCruise', this.speed, 1, this.orbitVal)
    },
    StopTraj() {
      this.controlDome('stopCruise', this.speed, 1, this.orbitVal)
    },
    startRecordTraj() {
      this.controlDome('staMemCruise', this.orbitSpeedVal, 1, this.orbitRouteVal)
        .then(() => {
          this.recordTraj = true
          this.$Notice.success({ title: '提示', desc: '开始录制轨迹成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '开始录制轨迹失败！' })
          console.log(err)
        })
    },
    stopRecordTraj() {
      this.controlDome('stoMemCruise', this.orbitSpeedVal, 1, this.orbitRouteVal)
        .then(() => {
          this.recordTraj = false
          this.$Notice.success({ title: '提示', desc: '停止录制轨迹成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '停止录制轨迹失败！' })
          console.log(err)
        })
    },
    // 扫描
    getScan(param) {
      YUNNAN_CTRL_GET.getscan(param)
    },
    scanAuto() {
      if (this.scanSetOpen) {
        return
      }
      this.controlDome('scanAuto')
    },
    linearScan() {
      console.log('随机扫描', this.scanSetOpen)
      if (this.scanSetOpen) {
        return
      }
      this.controlDome('linearScan')
        .then(res => {
          this.$Notice.success({ title: '提示', desc: '随机扫描成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '随机扫描失败！' })
          console.log(err)
        })
    },
    leftEdge() {
      this.controlDome('setLeftBorder', this.scanSpeedVal)
        .then(res => {
          this.$Notice.success({ title: '提示', desc: '设置左限位成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '设置左限位失败！' })
          console.log(err)
        })
    },
    rightEdge() {
      this.controlDome('setRightBorder', this.scanSpeedVal)
        .then(res => {
          this.$Notice.success({ title: '提示', desc: '设置右限位成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '设置右限位失败！' })
          console.log(err)
        })
    },
    async controlDome(
      ctrlCmdEnum,
      speed = this.speed,
      presetIndex = 1,
      route = 1,
      stopTime = 5,
      opt = 1,
      channel = 1,
      v
    ) {
      console.log('11111111')
      console.log(this.playParams);
      // if (!this.$store.getters.plugin.valid) {
      //   this.$Notice.warning({ title: '警告', desc: '请先下载插件，或当前浏览器不支持插件！' })
      //   return Promise.reject(new Error(false))
      // }
      // if (!this.pluginStatus.isPlay) { return this.$Notice.error({ title: '失败', desc: '请选择设备！' }) }
      // const item = this.plugin.videoPageData[this.plugin.checkedPane]
      // console.log(item, '21111111')
      // if (!item) {
      //   return Promise.reject(new Error(false))
      // }
      // if (!this.power) {
      //   this.power = await this.getCameraPower(item.id)
      // }
      // if (!this.power || !this.power.includes('cloudControl')) {
      //   if (v !== 'noNotice') {
      //     this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
      //   }
      //   return
      // }
      let devInfo = {
        // devIp: '10.1.3.20',
        // devPort: 8000
        devIp: this.playParams.ip,
        devPort: Number(this.playParams.cport)
      }
      // if (item.gbDevId) {
      //   const id = window.serverId[item.shareServer]
      //   devInfo = {
      //     gbPlaDevIp: id.ip,
      //     gbPlaDevPort: id.port,
      //     gbDevId: item.gbDevId,
      //     gbPlaNvrId: id.serverId
      //   }
      // } else {
      //   devInfo = {
      //     devIp: item.devIp,
      //     devPort: item.devCport

      //   }
      // }
      const param = {
        devCtl: {
          ctrlCmdEnum: ctrlCmdEnum,
          speed: speed,
          presetIndex: presetIndex,
          route: route,
          stopTime: stopTime,
          opt: opt,
          // channel: Number(item.channel) || channel
          // channel: 1 || '1'
          channel: Number(this.playParams.serise)
        },
        devInfo: devInfo
      }
      // todo 记录日志接口
      // recordUserLog({
      //   logType: '操作日志',
      //   module: '现场视频',
      //   operateName: '云台控制',
      //   operateContent: '云台控制',
      //   target: item.name,
      //   deviceIp: item.gbDevId ? window.serverId[item.shareServer].ip : item.ip // 设备ip String
      // })
      return new Promise((resolve, reject) => {
        // YUNNAN_CTRL_SET(param, item.id, item.type)
        YUNNAN_CTRL_SET(param)
          .then(suc => {
            console.log('返回参数', suc)
            resolve(suc)
          })
          .catch(error => {
            this.$messageError('错误')
            console.log(`云台控制${ctrlCmdEnum}接口错误码===？：`, speed)
            reject(error)
            // if (speed !== 0) {
            // return this.$Notice.error({ title: '失败', desc: '云台操作错误或无设备！' })
            // }
          })
      })
    },
    getNumberArr(number) {
      const arr = []
      for (let i = 1; i <= number; i++) {
        arr.push({
          value: i,
          label: i
        })
      }
      return arr
    }
  }
}
</script>

<style lang="less" scoped>
.dome-box .times-box::after,
.clearFloat::after {
  display: block;
  content: '';
  clear: both;
}
.dome-box .times-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}

.speed {
  width: 40%;
  height: 33px;
  line-height: 33px;
  margin: 2px 0;
}
.speed b,
.slider b {
  float: left;
  height: 36px;
  line-height: 36px;
  width: 40px;
  text-align: center;
  font-weight: normal;
  user-select: none;
}

.speed .slider-box {
  float: right;
  width: 76px;
}

.slider .slider-box {
  float: left;
  width: 240px;
}

.slider input[type='text'] {
  margin: 0 !important;
}

.ctrlBtn {
  width: 100%;
  padding: 10px 14px;
  line-height: 24px;
}

.ctrlBtn *,
.iconfont {
  display: inline-block;
  font-size: 14px;
  text-align: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2d71d3;
  cursor: pointer;
  margin: 0 3px;
  color: #fff;
}
.ctrlBtn .iconfont.active,
.ctrlBtn .iconfont:hover,
.iconfont:hover {
  background: #fa8938;
  color: #fff;
}
.ctrlBtn .iconfont.active,
.ctrlBtn .iconfont:active,
.iconfont:active {
  background: #d66c23;
  color: #fff;
}
.ctrlBtn .iconfont.hide {
  background: #9298a4;
  color: #4a5363;
  cursor: not-allowed;
}
.advancedControl {
  width: 100%;
  padding-right: 2px;
}

.advancedControl .tit {
  width: 100%;
  font-size: 14px;
  height: 20px;
  position: relative;
}
.advancedControl .tit .title {
  text-align: center;
  width: 100%;
  cursor: pointer;
  position: absolute;
}
.advancedControl .tit div.jx {
  width: 50px;
  height: 0;
  top: 10px;
  position: absolute;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
}
.advancedControl .tit div.jx.l {
  left: 20px;
}
.advancedControl .tit div.jx.r {
  right: 20px;
}

.advanceSelected {
  width: 100%;
  height: calc(100% - 40px);
}

.xunhang {
  height: calc(100% - 50px);
}

.advanceSelected > ul {
  width: 100%;
  height: 30px;
  margin: 10px 0;
}
.advanceSelected > ul li {
  width: 24%;
  float: left;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-bottom: 1px solid #e1e1e1;
  cursor: pointer;
  color: #333333;
  list-style-type: none;
}
.advanceSelected > ul li:nth-child(1) {
  border-radius: 3px 0 0 3px;
}
.advanceSelected > ul li:nth-child(4) {
  border-radius: 0px 3px 3px 0;
}
.advanceSelected > ul li.active {
  border-width: 2px 1px 0;
  border-style: solid;
  border-color: #2d71d3 #e1e1e1 transparent;
}
.advanceSelected > ul li:hover {
  color: #2d71d3;
}

.advance-item {
  width: 100%;
  height: auto;
  padding: 0 0px;
}
.advance-item .iconfont {
  background: #4699f8;
  color: #fff;
}
.advance-item .iconfont:hover {
  background: #fa8a3b;
}
.advance-item .iconfont:active {
  background: #d66c23;
}
.advance-btn,
.advance-btn-big,
.advance-icon {
  float: left;
  cursor: pointer;
  background: #4699f8;
  color: #fff;
  line-height: 27px;
  width: 60px;
  text-align: center;
}

.advance-btn:hover,
.advance-btn-big:hover {
  background: #4699f8;
}

.advance-btn:active,
.advance-btn-big:active {
  background: #287fe0;
}

.advance-btn-big {
  width: 70px;
  margin: 0 10px;
  line-height: 26px;
}

.advance-icon {
  width: 30px;
  padding: 0 0 0 10px;
  background: none;
  font-size: 16px;
}

.advance-icon:hover {
  color: #fa8a3b;
}
.advance-icon:active {
  color: #d66c23;
}

.dis-btn,
.dis-btn:hover,
.dis-btn:active {
  background: #535f77;
  color: #cacaca;
}

.advance-set {
  width: 100%;
  padding-top: 10px;
}

.advance-set .setList {
  padding: 10px 0;
  color: #444;
  line-height: 22px;
}
.advance-set .setList .title {
  width: 80px;
  float: left;
  color: #333;
  line-height: 32px;
}

.advance-set .saomiaoSet {
  padding-left: 40px;
}

.advance-set .guijiSet {
  padding-left: 130px;
}

.table tr,
.table td,
.table th {
  border: 1px solid #e4e4e4;
  text-align: center;
}
.table tr {
  height: 24px;
}
.table,
tr,
td {
  border-collapse: collapse;
  cursor: pointer;
}
.table td i.iconfont {
  width: 10px;
  display: inline-block;
  background: none;
  color: #333;
  margin: 0;
}
.table td i.iconfont:hover,
.table td i.iconfont:active {
  background: none;
}
</style>
