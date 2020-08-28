<template>
  <div class="contain">
    <el-dialog title="多方对讲"
               :visible.sync="intercomVisible"
               width="40%"
               :before-close="bulkDealHandleClose">
      <div class="intercom-body"
           v-show="model==='intercom'">
        <div v-for="(val,valIndex) in netObj"
             :key="valIndex"
             class="col">
          <div v-if="!val.addIcon&&val.show">
            <p style="text-align:center;margin-top: 15%;">{{val.title}}</p>
            <p style="text-align:center;margin-top: 10px;"
               v-show='!val.isSignOut'>{{val.time}}</p>
            <p style="text-align:center;margin-top: 10px;"
               v-show='val.isSignOut'>已退出</p>
            <div v-if="val.btn"
                 style="text-align:center;margin-top: 10px;">
              <el-button type=""
                         size='mini'
                         @click="val.btn.callBack(val)">{{val.btn.tit}}</el-button>
            </div>
            <div v-if="val.interComPerson"
                 style="text-align:center;margin-top: 10px;">
              {{val.interComPerson}}
            </div>
          </div>
          <div v-if="val.addIcon&&val.show"
               style="cursor:pointer"
               @click="val.addCallBack">
            <p style="font-size: 64px;text-align:center;margin-top: 5%;font-weight: bold;">＋</p>
            <p style="margin-top: 3px;text-align: center;">添加新成员</p>
          </div>
        </div>
      </div>
      <div v-show="model==='addintercom'">
        <div class="focus-resources-dialog">
          <div class="focus-resources-left">
            <!-- <treeLazy :getApi='()=>{return "alarm-manage/v1/alarm-host/orgHostTree"}'></treeLazy> -->
            <treeBox :lazyTreeApi="getApi"
                     @onceClick="onceClick"
                     treeType="0"
                     :customizeQuery="customizeQuery"
                     treeLazyToggle
                     iconToggle>
            </treeBox>
          </div>
          <div class="focus-resources-center">
            <div @click='toRightFuc'>
              <i class="el-icon-arrow-right"></i>
            </div>
            <div @click='toLeftFuc'>
              <i class="el-icon-arrow-left"></i>
            </div>
          </div>
          <div class="focus-resources-right">
            <el-table v-if="tableHeight!==0"
                      :data="resources"
                      style="width: 100%"
                      highlight-current-row
                      @current-change="selectionFocus"
                      height="400">
              <el-table-column prop="content"
                               label="资源内容"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="bottom-btns">
        <div class="voice"></div>
        <div class="btn">
          <el-button v-show="model!=='addintercom'"
                     @click='postCloseTalkFuc'>挂断</el-button>
          <el-button v-show="model==='addintercom'"
                     @click="beginTalk">开始对讲</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { _ } from 'lodash'
import treeBox from '../../../../components/tree/treeBox'

export default {
  name: 'index',
  components: {
    treeBox
  },
  data: function() {
    return {
      resources: [
        // {
        //   content: 'data.name',
        //   hostIp: 'data.platformIp', // 面板所属主机
        //   hostPort: 'data.platformPort', // 面板所属主机端口,
        //   hostId: 'data.platformUniq', // 面板所属主机
        //   id: 'data.uniqueId', // 面板本身id
        //   type: 'data.type' //  1 主机  2，台麦
        // }
      ],
      tableHeight: [],
      orgOptions: {
        showNoneData: false,
        isMapDate: false,
        search: {
          onlyLeaf: true
        }
      },
      // 请求树接口入参
      customizeQuery: {
        params: {
          subSystem: '4',
          channelType: '1',
          isRecursion: '0' // 显示子机构  选中传1 不选中传0
        }
      },
      model: 'intercom', // intercom   addintercom
      netObj: [
        {
          title: '本机话筒',
          time: null,
          btn: {
            tit: '静音',
            callBack: parma => {}
          },
          deviceId: '', // 设备id
          show: true,
          interVal: null
        },
        {
          title: '呼叫面板',
          time: null,
          interComPerson: '对讲发起人',
          deviceId: '', // 设备id
          show: true,
          interVal: null
        },
        {
          title: '',
          time: null,
          addIcon: true,
          addCallBack: () => {
            this.model = 'addintercom'
          },
          deviceId: '', // 设备id
          show: true,
          interVal: null,
          isSignOut: false
        },
        {
          title: '',
          time: null,
          addIcon: false,
          deviceId: '', // 设备id
          addCallBack: () => {
            this.model = 'addintercom'
          },
          show: false,
          interVal: null,
          isSignOut: false
        },
        {
          title: '',
          time: null,
          addIcon: false,
          deviceId: '', // 设备id
          addCallBack: () => {
            this.model = 'addintercom'
          },
          show: false,
          interVal: null,
          isSignOut: false
        },
        {
          title: '',
          time: null,
          addIcon: false,
          deviceId: '', // 设备id
          addCallBack: () => {
            this.model = 'addintercom'
          },

          show: false,
          interVal: null,
          isSignOut: false
        },
        {
          title: '',
          time: null,
          addIcon: false,
          deviceId: '', // 设备id
          addCallBack: () => {
            this.model = 'addintercom'
          },

          show: false,
          interVal: null,
          isSignOut: false
        },
        {
          title: '',
          time: null,
          addIcon: false,
          deviceId: '', // 设备id
          addCallBack: () => {
            this.model = 'addintercom'
          },

          show: false,
          interVal: null,
          isSignOut: false
        },
        {
          title: '',
          time: null,
          addIcon: false,
          deviceId: '', // 设备id
          addCallBack: () => {
            this.model = 'addintercom'
          },
          show: false,
          interVal: null,
          isSignOut: false
        },
        {
          title: '',
          time: null,
          addIcon: false,
          deviceId: '', // 设备id
          addCallBack: () => {
            this.model = 'addintercom'
          },

          show: false,
          interVal: null,
          isSignOut: false
        },
        {
          title: '',
          time: null,
          addIcon: false,
          deviceId: '', // 设备id
          addCallBack: () => {
            this.model = 'addintercom'
          },

          show: false,
          interVal: null,
          isSignOut: false
        },
        {
          title: '',
          time: null,
          addIcon: false,
          deviceId: '', // 设备id
          addCallBack: () => {
            this.model = 'addintercom'
          },

          show: false,
          interVal: null,
          isSignOut: false
        }
      ],
      resourceSave: null,
      rightFocusIdBox: {},
      voliceGroup: {
        serverIp: '192.168.14.208',
        serverPort: 2048,
        serverId: '111',
        callerPanelInfo: {
          hostIp: '192.168.14.204',
          hostPort: 2046,
          hostId: '004',
          id: 1
        },
        calledMikeInfo: [
          {
            ip: '192.168.14.25',
            port: 2046,
            id: '222003'
          }
        ]
      },
      macPlatform: {
        serverIp: '',
        serverPort: 2048,
        serverId: '',
        id: '' // 面板本身id
      },
      seqId: '',
      CloseTalkParam: {
        seqId: '',
        serverIp: '',
        serverPort: ''
      },
      addGrouopPromiseIDS: [],
      setIntervalSearchStatusInterval: null
    }
  },
  props: {
    intercomVisible: {
      type: Boolean,
      default: true
    },
    callerPanelInfoProp: {
      type: Object
    }
  },

  methods: {
    ...mapActions('alarmReceive', {
      findorgTolkTree: 'findorgTolkTree', // 重点关注资源
      getMacMessage: 'getMacMessage',
      findAssigncenteranswer: 'findAssigncenteranswer'
    }),
    ...mapActions('eventDeal', {
      postAddtogroup: 'postAddtogroup',
      postCloseTalk: 'postCloseTalk',
      postDelgroup: 'postDelgroup',
      checkAudioStatus: 'checkAudioStatus'
    }),
    bulkDealHandleClose() {
      this.$emit('close', false)
    },
    beginTalk() {
      this.model = 'intercom'
      this.postAddtogroupFuc()
    },
    // 获取重点资源
    getApi(param) {
      return this.findorgTolkTree(param)
    },
    // 重点机构树点击
    onceClick(data, node) {
      let obj = {
        content: data.name,
        hostIp: data.platformIp, // 面板所属主机
        hostPort: data.platformPort, // 面板所属主机端口,
        hostId: data.platformUniq, // 面板所属主机
        id: data.id, // 面板本身id
        type: data.type //  1 主机  2，台麦
      }
      if (data.type === 1) {
        if (data.tierType === 'res') {
          this.resourceSave = obj
        }
      } else if (data.type === 2) {
        if (data.tierType === 'equ') {
          this.resourceSave = obj
        }
      }
    },
    toRightFuc() {
      if (!this.resourceSave) {
        return
      }

      let length = this.resources.filter(item => {
        return parseInt(item.id) === parseInt(this.resourceSave.id)
      }).length
      if (length !== 0) {
      } else {
        this.resources.push(JSON.parse(JSON.stringify(this.resourceSave)))
        // this.focusRightObj.push(JSON.parse(JSON.stringify(this.resourceSave)))
      }
    },
    toLeftFuc() {
      if (this.rightFocusIdBox) {
        let index = this.resources.findIndex(item => {
          console.log(item.id)
          return item.id === this.rightFocusIdBox.id
        })
        this.resources.splice(index, 1)
      } else {
        this.$message({
          message: '请先选择要移除的数据',
          type: 'info'
        })
      }
    },

    selectionFocus(row) {
      this.rightFocusIdBox = row
    },
    findAssigncenteranswerFuc() {
      this.voliceGroup.callerPanelInfo = {
        hostIp: this.callerPanelInfoProp.source.detail.talk_host_ip,
        hostPort: this.callerPanelInfoProp.source.detail.talk_host_port,
        hostId: this.callerPanelInfoProp.source.detail.talkHostId,
        id: this.callerPanelInfoProp.source.detail.faceplateId
      }
      // serverIp: '192.168.14.208',
      //   serverPort: 2048,
      //   serverId: '111',
      this.voliceGroup.serverIp = this.callerPanelInfoProp.source.detail.ip
      this.voliceGroup.serverPort = this.callerPanelInfoProp.source.detail.port
      this.voliceGroup.serverId = this.callerPanelInfoProp.source.detail.platformId
      if (this.callerPanelInfoProp.source.detail.ip !== this.macPlatform.serverIp) {
        // mack 所属平台和面板所属平台不属于同一个平台
        let mp =
          this.macPlatform.serverId.length === 1
            ? '00' + this.macPlatform.serverId
            : this.macPlatform.serverId.length === 2
            ? '0' + this.macPlatform.serverId
            : this.macPlatform.serverId
        let id = mp + this.voliceGroup.calledMikeInfo[0].id
        this.voliceGroup.calledMikeInfo[0].id = id
      }
      console.log('this.voliceGroup')
      console.log(this.voliceGroup)
      this.findAssigncenteranswer(this.voliceGroup).then(res => {
        if (res && res.code === 0) {
          this.seqId = res.data.seqId
        }
      })
    },
    getMacMessageFuc() {
      let macData = JSON.parse(sessionStorage.getItem('macAddress'))
      const macStr = macData && macData.adaptors && macData.adaptors[0].mac
      console.log(macData)
      if (!macStr) {
        return
      }
      let param = {
        mac: macStr.toString()
      }
      this.getMacMessage(param).then(res => {
        if (res && JSON.stringify(res.data) !== '{}') {
          this.macPlatform.serverIp = res.data.platformIp
          this.macPlatform.serverPort = res.data.platformPort
          this.macPlatform.serverId = res.data.platformUniqueId
          this.macPlatform.id = res.data.id
          this.voliceGroup.calledMikeInfo[0].ip = res.data.hostIp
          this.voliceGroup.calledMikeInfo[0].port = res.data.hostPort
          this.voliceGroup.calledMikeInfo[0].id = res.data.hostUniqueId
          this.findAssigncenteranswerFuc()
        } else {
          this.$message({
            type: 'error',
            message: '您的终端未绑定台麦'
          })
        }
      })
    },
    // 增加对讲组成员
    postAddtogroupFuc() {
      // let param = {
      //   myMikeId: this.macPlatform.id,
      //   seqId: this.seqId,
      //   calledMikId: [],
      //   calledPaneId: []
      // }
      let addGrouopPromise = []
      // 返回已经去除加入成功的对讲组
      let resources_ = this.resources.filter(item => {
        return !this.addGrouopPromiseIDS.some(val => {
          return val.id === item.id
        })
      })
      console.log('resources_')
      console.log(resources_)
      if (resources_) {
        resources_.map(item => {
          let param = {
            myMikeId: this.macPlatform.id,
            seqId: this.seqId
          }
          if (item.type === 1) {
            param.calledPaneId = item.id
            addGrouopPromise.push(this.postAddtogroup(param))
            this.addGrouopPromiseIDS.push({ type: 1, id: item.id })
          } else if (item.type === 2) {
            param.calledMikId = item.id
            addGrouopPromise.push(this.postAddtogroup(param))
            this.addGrouopPromiseIDS.push({ type: 2, id: item.id })
          }
        })
        Promise.all(addGrouopPromise).then(res => {
          if (res && res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              let item = res[i]

              if (item.code !== 0) {
                this.$message({
                  type: 'err',
                  message: item.message
                })
                // this.resources.splice(i, 1)
                this.addGrouopPromiseIDS.splice(i, 1)
              }
            }
            console.log(this.resources)
            for (let i = 0; i < this.resources.length; i++) {
              let item = this.resources[i]
              console.log(this.addGrouopPromiseIDS)
              let index = this.addGrouopPromiseIDS.some(val => {
                return val.id === item.id
              })
              console.log(this.resources)
              if (!index) {
                this.resources.splice(i, 1)
              }
            }
            console.log(this.resources)
            if (this.resources.length > 0) {
              this.afterAddGrouop()

              this.setIntervalSearchStatusInterval = setInterval(() => {
                this.setIntervalSearchStatus()
              }, 2000)
            }
          }
        })
      }
    },
    // 增加对讲组人员后，页面样式显示改变
    afterAddGrouop() {
      let net = this.netObj.findIndex(item => {
        return item.addIcon
      })
      console.log(this.addGrouopPromiseIDS)
      console.log(this.resources)
      let resources_ = JSON.parse(JSON.stringify(this.resources))
      this.netObj.map(item => {
        resources_.map((val, j) => {
          if (val.id === item.deviceId) {
            resources_.splice(j, 1)
          }
        })
      })
      console.log('mmmmmmmmmmmm')
      console.log(resources_)
      resources_.map((item, index) => {
        this.netObj[index + net].title = item.content
        this.timer(this.netObj[index + net])
        this.netObj[index + net].addIcon = false
        this.netObj[index + net + 1].addIcon = true
        this.netObj[index + net].show = true
        this.netObj[index + net + 1].show = true
        this.netObj[index + net].deviceId = item.id
      })
    },

    timer(obj) {
      let n_sec = 0
      let n_min = 0
      let n_hour = 0
      obj.interVal = setInterval(function() {
        var str_sec = n_sec
        var str_min = n_min
        var str_hour = n_hour
        if (n_sec < 10) {
          str_sec = '0' + n_sec
        }
        if (n_min < 10) {
          str_min = '0' + n_min
        }

        if (n_hour < 10) {
          str_hour = '0' + n_hour
        }

        obj.time = str_hour + ':' + str_min + ':' + str_sec
        n_sec++
        if (n_sec > 59) {
          n_sec = 0
          n_min++
        }
        if (n_min > 59) {
          n_sec = 0
          n_hour++
        }
      }, 1000)
    },
    // 如果有多个人在对讲，循环不停查询状态，如果发现其中有哪个设备处于空闲状态，则在此次对讲中剔除这个人
    setIntervalSearchStatus() {
      let calleds = []
      this.addGrouopPromiseIDS.map(res => {
        if (res.type === 1) {
          calleds.push(this.checkAudioStatus({ panelId: res.id }))
        } else if (res.type === 2) {
          calleds.push(this.checkAudioStatus({ mikId: res.id }))
        }
      })
      Promise.all(calleds).then(res => {
        console.log(res)
        if (res && res.length > 0) {
          res.map((item, index) => {
            if (item.data.status !== 5 && item.data.status !== 4) {
              // console.log('this.netObj')
              // console.log(this.netObj)
              // console.log('addGrouopPromiseIDS')
              // console.log(this.addGrouopPromiseIDS)
              this.netObj.map(val => {
                if (val.deviceId === this.addGrouopPromiseIDS[index].id) {
                  val.isSignOut = true

                  // 在清除报警组id 时，先清除树
                  for (let i = 0; i < this.resources.length; i++) {
                    let val = this.resources[i]
                    if (val.id === this.addGrouopPromiseIDS[index].id) {
                      this.resources.splice(i, 1)
                      i--
                    }
                  }

                  calleds.splice(index, 1)
                  this.addGrouopPromiseIDS.splice(index, 1)
                }
              })
            }
          })
        }
      })
    },
    // 挂断
    postDelgroupFuc() {
      ;(this.CloseTalkParam.seqId = this.seqId),
        (this.CloseTalkParam.serverIp = this.macPlatform.serverIp),
        (this.CloseTalkParam.serverPort = this.macPlatform.serverPort),
        this.postDelgroup(this.CloseTalkParam).then(res => {})
    },
    postCloseTalkFuc() {
      let param = {
        myMikeId: this.macPlatform.id,
        seqId: this.seqId
      }
      if (!this.seqId) {
        this.$emit('closeOver', false)
      }
      this.postCloseTalk(param).then(res => {
        if (res && res.code == 0) {
          this.$message({
            type: 'success',
            message: '挂断成功'
          })
          this.$emit('closeOver', false)
        }
      })
      // 清除轮询的状态查询
      clearInterval(this.setIntervalSearchStatusInterval)
    }
  },
  created() {},
  mounted() {
    this.getMacMessageFuc()
    this.timer(this.netObj[0])
    this.timer(this.netObj[1])
  },
  beforeDestroy() {
    // 跳出页面时执行挂断操作
    this.postCloseTalkFuc()
    this.netObj.map(val => {
      if (val.interVal) {
        clearInterval(val.interVal)
      }
    })
  },
  destroyed() {}
}
</script>

<style scoped lang='less'>
.intercom-body {
  width: 100%;
  height: 600px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .col {
    width: 33%;
    height: 24%;
    border: 1px solid #ddd;
  }
}
.bottom-btns {
  display: flex;
  justify-content: space-between;
  height: 40px;
  padding: 15px;
}
.focus-resources-dialog {
  width: 100%;
  height: 400px;
  display: flex;
  .focus-resources-left {
    width: 300px;
    height: 100%;
    border: 1px solid #ddd;
  }
  .focus-resources-center {
    width: 40px;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-size: 36px;
    cursor: pointer;
    div {
      height: 40px;
    }
    i:hover {
      color: rgba(45, 114, 211, 1);
    }
  }
  .focus-resources-right {
    flex: 1;
    border: 1px solid #ddd;
    height: 400px;
  }
}
</style>
