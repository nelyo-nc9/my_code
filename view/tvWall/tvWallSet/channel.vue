<template>
  <div class="channelWrap">
    <div class="channelTable">
      <div class="tableTop">
        <ul>
          <li class="titleWidth">
            <span>窗口编号</span>
          </li>
          <li class="constWidth">
            <span>关联解码通道</span>
          </li>
        </ul>
      </div>
      <div class="autoStyle"
           v-if="mewDataArr.length != 0">
        <div class="tableCondtend"
             v-for="(item, index) in mewDataArr"
             :key="index">
          <ul class="ulStyle">
            <li class="titleWidth">
              <span>{{ index + 1 }}</span>
            </li>
            <li class="constWidth">
              <el-select v-model="item.associatedChannelName"
                         placeholder="请选择"
                         @change="selectedChannel">
                <el-option v-for="item in options"
                           :key="item.label"
                           :label="item.label"
                           :value="item.deviceId +'-' +item.value +'-'+item.label">
                </el-option>
              </el-select>
            </li>
          </ul>
        </div>
      </div>
      <div class="tableNodata"
           v-if="mewDataArr.length === 0">
        <div>
          <span>暂无数据</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  components: {},
  data() {
    return {
      filterText: '',
      options: [],
      mewDataArr: [],
      // send_deviceId: '', // 设备id
      deleteArr: [],
      macAderss: '' // 本机mac地址
    }
  },
  computed: {
    ...mapState({
      tvWallMessage: ({ tvWall }) => tvWall.allTvWallList, // 接受传出来的电视墙信息
      tvWallChangeData: ({ tvWall }) => tvWall.tvWallchangeData // 接受电视墙主页面(内容页面)发送的改变好数据格式的电视墙信息
    })
  },
  watch: {
    tvWallChangeData: {
      // 监听对象时要deep:true
      handler(newVal, oldVal) {
        if (this.tvWallMessage.type === 1) {
          this.getChannlList() // 获取通道(M3)
        } else if (this.tvWallMessage.type === 4) {
          this.getChannlListM3AndB20()
        }
        this.giveValue()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapMutations(['SET_CREATED_FLOOR', 'SET_CHANNL_ID_STATE']),
    ...mapActions(['getTvWallChannlList', 'channlAndwindow', 'getPartmanagerelationMethod', 'getChannlListM3AndB20Api', 'channlAndwindowM3AndB20Api']),
    // 页面初始化调用函数
    // InitializeFunction() {
    //   this.giveValue()
    //   this.getChannlList() // 获取通道
    // },
    // 页面初始化，为mewDataArr赋值
    giveValue() {
      this.mewDataArr = [] // 清空数组
      let obj = JSON.parse(JSON.stringify(this.tvWallChangeData)) // 复制一份vuex里传下来的数据，不可以直接更改它
      obj.map(item => {
        item.children &&
          item.children.map(val => {
            this.mewDataArr.push(val)
          })
      })
    },
    selectedChannel(val) {
      console.log(val)
      console.log(this.mewDataArr)
      // debugger
      this.mewDataArr.map(item => {
        if (item.associatedChannelName && item.associatedChannelName.indexOf('-') !== -1) {
          let str = item.associatedChannelName
          let arr = str.split('-')
          if (arr[0] !== undefined) {
            item.associateddeviceId = arr[0]
          } else {
            item.associateddeviceId = ''
          }
          if (arr[1] !== undefined) {
            item.associatedChannel = arr[1]
          } else {
            item.associatedChannel = ''
          }
          if (arr[2] !== undefined) {
            item.associatedChannelName = arr[2]
          } else {
            item.associatedChannelName = ''
          }
          console.log(arr)
          console.log(item)
          this.window_binding(item)
        }
      })
    },
    // 获取电视墙下的所有解码器通道(M3)
    getChannlList() {
      this.options = []
      let params = {
        wallId: this.tvWallMessage.id
      }
      this.getTvWallChannlList(params)
        .then(res => {
          if (res.data.code === 0) {
            res.data.data.map(item => {
              let obj = { label: '', value: '', deviceId: '' }
              obj.label = item.name
              obj.value = item.channel
              obj.deviceId = item.deviceId
              this.options.push(obj)
            })
            let arr = this.$lodash.cloneDeep(this.options)
            arr = arr.filter(item => !this.mewDataArr.some(i => (`${i.associatedChannel}` === item.value) && ((`${i.associateddeviceId}` === item.deviceId))))
            this.options = arr
            console.log(this.options)
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取电视墙下的所有解码器通道(解码器+拼控)
    getChannlListM3AndB20() {
      this.options = []
      let params = {
        wallId: this.tvWallMessage.id
      }
      this.getChannlListM3AndB20Api(params)
        .then(res => {
          if (res.data.code === 0) {
            res.data.data.map(item => {
              let obj = { label: '', value: '', deviceId: '' }
              obj.label = item.name
              obj.value = item.channel
              obj.deviceId = item.deviceId
              this.options.push(obj)
            })
            let arr = this.$lodash.cloneDeep(this.options)
            arr = arr.filter(item => !this.mewDataArr.some(i => (`${i.associatedChannel}` === item.value) && ((`${i.associateddeviceId}` === item.deviceId))))
            this.options = arr
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 通道和窗口的绑定关系
    async window_binding(val) {
      console.log(val)
      let relationData = await this.getpartManageRelation() // 获取分区管理的窗口权限配置
      let relationArr
      let windowCodeArr = [] // 权限中的窗格号
      if (relationData.data.code === 0 && relationData.data.data.length !== 0) {
        relationArr = relationData.data.data
        relationArr.map(item => {
          if (item.mac === this.macAderss) {
            windowCodeArr.push(item.code)
          }
        })
      }
      if (this.macAderss !== '' && windowCodeArr.length !== 0) { // 拥有部分屏幕权限
        if (windowCodeArr.includes(val.windowIndex)) {
          if (this.tvWallMessage.type === 1) { // M3
            let params = {
              wallId: val.wallId,
              channel: val.associatedChannel,
              name: '',
              monitor: val.windowIndex,
              deviceId: val.associateddeviceId
            }
            if (val.associatedChannelName === '无') {
              params.deviceId = ''
              params.channel = ''
              params.name = ''
            } else {
              params.name = val.associatedChannelName
            }
            this.channlAndwindow(params).then(res => {
              if (res.data.code === 0) { // 发送请求成功(相当于拼控一体电视墙的开窗)，给电视墙menu发送消息，重新拉去数据
                let sendObj = {
                  state: true,
                  id: val.wallId
                }
                this.SET_CREATED_FLOOR(sendObj) // 发送开窗成功信号，重新拉去menu列表
                let sendObj2 = { // 窗口和通道绑定后，将设备id和状态发送出去
                  deviceId: val.associateddeviceId,
                  state: true
                }
                this.deleteArr.push(params.channel)
                this.SET_CHANNL_ID_STATE(sendObj2)
                this.options.map((item, index) => { // 当绑定成功后，删除已经绑定了的通道(每个通道能绑定一个窗口)
                  if (params.name !== '无' && item.value === params.channel) {
                    this.options.splice(index, 1)
                  }
                })
              } else {
                this.failureMethod('请求失败')
              }
            }).catch(err => {
              console.log(err)
            })
          } else if (this.tvWallMessage.type === 4) { // 解码器 + 拼控
            console.log(this.tvWallMessage)
            // debugger
            let params = {
              wallId: val.wallId,
              channel: val.associatedChannel,
              name: '',
              code: val.windowIndex,
              deviceId: val.associateddeviceId,
              left: val.windowsRect[0].left,
              right: val.windowsRect[0].right,
              bottom: val.windowsRect[0].bottom,
              top: val.windowsRect[0].top
            }
            if (val.associatedChannelName === '无') {
              params.deviceId = ''
              params.channel = ''
              params.name = ''
            } else {
              params.name = val.associatedChannelName
            }
            this.channlAndwindowM3AndB20Api(params).then(res => {
              if (res.data.code === 0) { // 发送请求成功(相当于拼控一体电视墙的开窗)，给电视墙menu发送消息，重新拉去数据
                let sendObj = {
                  state: true,
                  id: val.wallId
                }
                this.SET_CREATED_FLOOR(sendObj) // 发送开窗成功信号，重新拉去menu列表
                let sendObj2 = { // 窗口和通道绑定后，将设备id和状态发送出去
                  deviceId: val.associateddeviceId,
                  state: true
                }
                this.deleteArr.push(params.channel)
                this.SET_CHANNL_ID_STATE(sendObj2)
                this.options.map((item, index) => { // 当绑定成功后，删除已经绑定了的通道(每个通道能绑定一个窗口)
                  if (params.name !== '无' && item.value === params.channel) {
                    this.options.splice(index, 1)
                  }
                })
              } else {
                this.failureMethod('请求失败')
              }
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          this.failureMethod('不在权限之内')
        }
      } else { // 拥有全部屏幕权限
        if (this.tvWallMessage.type === 1) { // M3
          let params = {
            wallId: val.wallId,
            channel: val.associatedChannel,
            name: '',
            monitor: val.windowIndex,
            deviceId: val.associateddeviceId
          }
          if (val.associatedChannelName === '无') {
            params.deviceId = ''
            params.channel = ''
            params.name = ''
          } else {
            params.name = val.associatedChannelName
          }
          this.channlAndwindow(params).then(res => {
            if (res.data.code === 0) { // 发送请求成功(相当于拼控一体电视墙的开窗)，给电视墙menu发送消息，重新拉去数据
              let sendObj = {
                state: true,
                id: val.wallId
              }
              this.SET_CREATED_FLOOR(sendObj) // 发送开窗成功信号，重新拉去menu列表
              let sendObj2 = { // 窗口和通道绑定后，将设备id和状态发送出去
                deviceId: val.associateddeviceId,
                state: true
              }
              this.deleteArr.push(params.channel)
              this.SET_CHANNL_ID_STATE(sendObj2)
              this.options.map((item, index) => { // 当绑定成功后，删除已经绑定了的通道(每个通道能绑定一个窗口)
                if (params.name !== '无' && item.value === params.channel) {
                  this.options.splice(index, 1)
                }
              })
            } else {
              this.failureMethod('请求失败')
            }
          }).catch(err => {
            console.log(err)
          })
        } else if (this.tvWallMessage.type === 4) { // 解码器 + 拼控
          console.log(this.tvWallMessage)
          // debugger
          let params = {
            wallId: val.wallId,
            channel: val.associatedChannel,
            name: '',
            code: val.windowIndex,
            deviceId: val.associateddeviceId,
            left: val.windowsRect[0].left,
            right: val.windowsRect[0].right,
            bottom: val.windowsRect[0].bottom,
            top: val.windowsRect[0].top
          }
          if (val.associatedChannelName === '无') {
            params.deviceId = ''
            params.channel = ''
            params.name = ''
          } else {
            params.name = val.associatedChannelName
          }
          this.channlAndwindowM3AndB20Api(params).then(res => {
            if (res.data.code === 0) { // 发送请求成功(相当于拼控一体电视墙的开窗)，给电视墙menu发送消息，重新拉去数据
              let sendObj = {
                state: true,
                id: val.wallId
              }
              this.SET_CREATED_FLOOR(sendObj) // 发送开窗成功信号，重新拉去menu列表
              let sendObj2 = { // 窗口和通道绑定后，将设备id和状态发送出去
                deviceId: val.associateddeviceId,
                state: true
              }
              this.deleteArr.push(params.channel)
              this.SET_CHANNL_ID_STATE(sendObj2)
              this.options.map((item, index) => { // 当绑定成功后，删除已经绑定了的通道(每个通道能绑定一个窗口)
                if (params.name !== '无' && item.value === params.channel) {
                  this.options.splice(index, 1)
                }
              })
            } else {
              this.failureMethod('请求失败')
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }
    },
    // 获取分区管理的窗口权限配置
    getpartManageRelation() {
      let params = {
        wallId: this.tvWallMessage.id
      }
      return this.getPartmanagerelationMethod(params)
    },
    // 成功提示
    succefullMethod(val) {
      this.$notify({
        title: '成功',
        message: val,
        type: 'success',
        duration: 2500
      })
    },
    // 失败提示
    failureMethod(val) {
      this.$notify.error({
        title: '错误',
        message: val,
        duration: 2500
      })
    }
  },
  created() { },
  mounted() {
    // 获取本机mac地址
    let macAndipData = JSON.parse(sessionStorage.getItem('macAddress'))
    if (macAndipData) {
      this.macAderss = macAndipData.adaptors[0].mac
    }
    // this.InitializeFunction() // 页面创建完成，调用初始化函数
  }
}
</script>
<style scoped lang="less">
.channelWrap {
  width: 100%;
  height: 100%;
  padding: 20px 5px;
  background: #f2f2f2;
}
.channelTable {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.tableTop {
  width: 100%;
  height: 35px;
  border: 1px solid gainsboro;
  line-height: 35px;
}
.tableTop ul {
  display: flex;
}
.tableCondtend ul {
  display: flex;
}
.titleWidth {
  width: 73px;
  text-align: center;
  border-right: 1px solid gainsboro;
}
.constWidth {
  text-align: center;
  flex: 1;
}
.ulStyle {
  height: 45px;
  line-height: 45px;
  border-right: 1px solid gainsboro;
  border-left: 1px solid gainsboro;
  border-bottom: 1px solid gainsboro;
}
.constWidth /deep/.el-input--suffix .el-input__inner {
  height: 30px;
}
.constWidth /deep/.el-select-dropdown .el-popper {
  margin-top: 0 !important;
}
.constWidth /deep/ .el-input__icon {
  line-height: 45px;
}
.tableNodata {
  width: 100%;
  height: 40px;
  border-right: 1px solid gainsboro;
  border-bottom: 1px solid gainsboro;
  border-left: 1px solid gainsboro;
  text-align: center;
  line-height: 40px;
  color: #808080;
}
.autoStyle {
  flex: 1;
  overflow: auto;
}
</style>
