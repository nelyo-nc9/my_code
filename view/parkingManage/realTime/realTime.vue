<template>
  <div class="real-container">
    <div class="real-main">
      <el-row style="height: 100%">
        <div class="left_nav">
          <div class="org"
               @click="post">
            机构
          </div>
          <div class="left_Orgtree"
               style="height: 100%">
            <treeBox :lazyTreeApi="getTreeApi"
                     searchType="filter"
                     :treeType="treeType"
                     @onceClick="onceClick"
                     treeLazyToggle
                     iconToggler
                     :customizeQuery="customizeQuery"></treeBox>
          </div>
        </div>
        <div class="content_video"
             style="height: 100%">
          <div class="real-middle">
            <div class="real-vidio">
              <preview-plugin :defaultPane="defaultPane"
                              :iconShow="iconShowParams"
                              ref="preview"></preview-plugin>
            </div>
            <div class="real-tab-bottom">
              <!-- <el-badge class="mark"
                        :value="3" /> -->
              <el-tabs type="border-card"
                       @tab-click="timeCarList"
                       v-model="activeShow"
                       :style="{height: '100%',border:'none'}">
                <el-tab-pane label="实时过车信息"
                             name="first">
                  <el-table :data="realTimeList"
                            height="200"
                            stripe
                            highlight-current-row
                            align="center"
                            v-show="carListShow"
                            style="width: 100%;padding:2px">
                    <el-table-column type="index"
                                     label="序号"></el-table-column>
                    <el-table-column v-for="item in realeTableColumn"
                                     :key="item.label"
                                     :prop="item.prop"
                                     :label="item.label"
                                     :width="item.width"
                                     align="center">
                    </el-table-column>
                    <!-- <el-table-column v-for="item in realeTableColumn"
                                     :key="item.label"
                                     :prop="item.prop"
                                     :label="item.label"
                                     :width="item.width"
                                     align="center">
                    </el-table-column> -->
                    <el-table-column prop="operation"
                                     label="操作"
                                     align="center"
                                     width="140">
                      <template slot-scope="scope">
                        <el-button type="text"
                                   @click="viewDetails(scope.$index, scope.row)">查看详情</el-button>
                      </template>

                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="重点车辆关注信息"
                             name="second">
                  <el-table ref="multipleTable"
                            :data="focusList"
                            height="200"
                            stripe
                            align="center"
                            v-show="carListShow"
                            style="width: 100%;padding:2px">
                    <el-table-column type="index"
                                     label="序号"></el-table-column>
                    <el-table-column v-for="item in realeTableColumn"
                                     :key="item.label"
                                     :prop="item.prop"
                                     :label="item.label"
                                     :width="item.width"
                                     align="center">
                    </el-table-column>
                    <el-table-column prop="operation"
                                     label="操作"
                                     align="center"
                                     width="140">
                      <template slot-scope="scope">
                        <el-button type="text"
                                   @click="viewDetails1(scope.$index, scope.row)">查看详情</el-button>
                      </template>

                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <!-- 实时过车图片展示区 -->
                <div class="time-car-pic"
                     v-show="carPicShow">
                  <ul>
                    <li v-for="(val,index) in picData"
                        :key=index>
                      <div class="img">
                        <img :src='val.imgUrl'>
                      </div>
                      <div class="text">
                        <span>{{val.data}}</span>
                        <span>{{val.field}}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </el-tabs>
              <!-- 查看详情弹窗 -->
              <el-dialog width="18%"
                         :visible.sync="dialogFormVisible">
                <div slot="title"
                     class="tips-title">
                  <p>车辆详情</p>
                </div>
                <div class="tips-body">
                  <div class="tips-img">
                    <img :src='imgUrl'
                         style="width:80%" />
                  </div>
                  <div class="tips-main">
                    <div class="tips-tab">
                      <ul style="color:#bbb">
                        <li>所属机构</li>
                        <li>所属重点部位</li>
                        <li>位置</li>
                        <li>时间</li>
                        <li>车牌号</li>
                        <li>过车类型</li>
                      </ul>
                      <div class="line"></div>
                      <ul>
                        <li v-for="(value,index) in carDetailList"
                            class="detailList"
                            :key=index>{{value}}</li>
                      </ul>
                    </div>

                  </div>

                  <el-form :model="form">
                    <textarea cols="40"
                              rows="10"
                              v-model="textarea"
                              placeholder="请输入通行意见">

                    </textarea>
                  </el-form>
                </div>
                <div slot="footer"
                     style="width:100%"
                     center
                     class="dialog-footer">
                  <el-button type="primary"
                             @click="confirmRefuseBtn('confirm')">确认通行</el-button>
                  <el-button @click="confirmRefuseBtn('refuse')">拒绝通行</el-button>

                </div>
              </el-dialog>
              <!-- 实时过车图片展示 -->
              <i :class="timeIcon ? 'el-icon-picture-outline':'el-icon-more'"
                 @click="picShow"></i>
            </div>
          </div>
        </div>
        <div class="right_info"
             style="height: 100%">
          <div class="real-tab-right">
            <el-tabs type="border-card"
                     :style="{height: '100%',border:'none'}">
              <el-tab-pane label="黑名单信息">
                <div class="blacklist">
                  <ul>
                    <li v-for="(item,index) in blackInfoList"
                        :key=index>
                      <div class="img">
                        <img :src='item.img'>
                      </div>
                      <div class="text">
                        <p>{{item.snapshotTime}}</p>
                        <p>{{item.licensePlate}}</p>
                        <p>{{item.yard}}</p>
                      </div>
                    </li>
                  </ul>

                </div>
                <div class="more_btn">
                  <el-button @click="moreBtn">查看更多</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="布控信息">
                <div class="blacklist">
                  <ul>
                    <li v-for="(item,index) in deployInfoList"
                        :key=index>
                      <div class="img">
                        <img :src='val.img'>
                      </div>
                      <div class="text">
                        <p>{{item.snapshotTime}}</p>
                        <p>{{item.licensePlate}}</p>
                        <p>{{item.yard}}</p>
                      </div>
                    </li>
                  </ul>

                </div>
                <div class="more_btn">
                  <el-button @click="moreBtn">查看更多</el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import previewPlugin from '@src/view/videoManage/preview/school/previewPlugin'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '@src/http/parkingManage/parkingRecord.api.js'
import socket from '../../../socket/alarm'
import { mapActions } from 'vuex'
export default {
  components: {
    treeBox,
    previewPlugin,
  },
  data() {
    return {
      treeType: 1,
      customizeQuery: {
        params: {
          subSystem: '6',
          isRecursion: '0',
          //   parkId: 1
        },
        keywords: ['tierType'],
      },
      // 实时过车信息列表
      defaultPane: 4, // 默认显示4窗格
      iconShowParams: [
        { type: 'left', index: 0, name: 'Stop' }, // 关闭预览
        { type: 'left', index: 1, name: 'ScreenShot' }, // 截图
        { type: 'left', index: 2, name: 'Recoding' }, // 录像
        { type: 'left', index: 3, name: 'Speech' }, // 对讲
        { type: 'left', index: 4, name: 'NiaoKan' }, // 鸟瞰
        { type: 'left', index: 5, name: 'Volume' }, // 声音

        { type: 'right', index: 0, name: 'FullScreen' }, // 全屏
        { type: 'right', index: 1, name: 'ViewPattern' }, // 画面模式
        { type: 'right', index: 2, name: 'Stream' }, // 码流切换
        { type: 'right', index: 3, name: 'checkRecode' }, // 检查记录
      ],
      realTimeList: [],
      // 表格标题行内容
      realeTableColumn: [
        { prop: 'yard', label: '车场', width: '140' },
        { prop: 'channelName', label: '通道名称', width: '140' },
        { prop: 'snapshotTime', label: '时间', width: '240' },
        { prop: 'licensePlate', label: '车牌号', width: '140' },
        { prop: 'direction', label: '行车方向', width: '140' },
        { prop: 'carType', label: '车辆类型', width: '140' },
      ],
      // 点击详情弹框
      dialogFormVisible: false,
      // 文本域
      textarea: '',
      form: {},
      // 车辆详情
      carDetailList: {
        // imgUrl: './u412430.png',
        organ: '',
        part: '',
        location: '',
        time: ' ',
        carNum: '',
        type: '',
      },
      // 图片展示列表
      picData: [],
      // 实时过车信息列表与图片的切换
      carListShow: true, // 列表显示隐藏
      carPicShow: false, // 图片显示隐藏
      activeShow: 'first',
      timeIcon: true,
      // 黑名单信息列表
      blackInfoList: [],
      focusList: [],
      // 布控信息列表
      deployInfoList: [],
      detailVeiw: {},
      treeNode: {}, // 机构树节点node
      carId: [],
      imgUrl: '',
      sureObj: {},
      alarmInfo: {},
    }
  },
  watch: {},
  computed: {},
  created() {
    this.getRealTimeBlack()
    this.getTableColumn()
    this.getParkingRecord()
  },
  mounted() {},
  methods: {
    ...mapActions(['getDetailList', 'setControl', 'getControlInfo', 'getRealTimeBlackList', 'getParkingRecordList']),
    post() {
      this.getControlInfo({
        devIp: '10.1.1.98',
        devPort: 8090,
        parkId: 'e2a2a7a2c66d11ea8504000c293defbe',
        hostId: '9bb8cae1-aee4-40be-bc6d-f05449a45667',
        ctrl: 'open',
      })
    },
    // 查询今日布控车辆
    getRealTimeBlack() {
      this.getRealTimeBlackList().then((res) => {
        if (res.data && res.data.blackList && res.data.blackList.length > 0) {
          this.blackInfoList = res.data.blackList
        }
        if (res.data && res.data.defenseList && res.data.defenseList.length > 0) {
          this.deployInfoList = res.data.defenseList
        }
      })
    },
    // 实时过车初始
    getParkingRecord() {
      this.getParkingRecordList().then((res) => {
        let reslut = res.data.data.parkRecords
        reslut.map((item) => {
          item.direction === 1 ? '驶入' : '驶出'
          let imageObj = {
            imgUrl: item.image,
            data: item.snapshotTime,
            field: item.yard,
          }
          this.picData.push(imageObj)
        })
        this.realTimeList = reslut
      })
    },
    // 获取实时过车  websocked
    getTableColumn() {
      socket.on('alarmParking', (data) => {
        this.getRealTime(data.alarmInfo.id)
        this.carId.push(data.alarmInfo.id)
        this.sureData = data.parkInfo
        this.alarmInfo = data.alarmInfo
      })
    },
    // 销毁
    stopSocket() {
      socket.remove('alarmParking', (data) => {
        console.log(data)
      })
    },
    // 获取实时过车信息
    getRealTime(ids) {
      this.getDetailList({ id: ids }).then((res) => {
        let data = res.data.data.parkRecord
        let imageObj = {
          imgUrl: data.image,
          data: data.createdAt,
          field: data.yard,
        }
        this.picData.unshift(imageObj)
        // 列表区
        let realTimeObj = {
          id: ids,
          yard: data.yard,
          channelName: data.channelName,
          snapshotTime: data.snapshotTime,
          licensePlate: data.licensePlate,
          direction: data.direction === 1 ? '驶入' : '驶出',
          carType: data.carType,
        }
        this.realTimeList.unshift(realTimeObj)
        if (data.recordType === 4) {
          let blackInfoListObj = {
            snapshotTime: data.snapshotTime,
            licensePlate: data.licensePlate,
            yard: data.yard,
            img: data.image,
          }
          console.log(this.blackInfoList, 'this.blackInfoList')
          this.blackInfoList.unshift(blackInfoListObj)
        } else if (data.recordType === 2) {
          let focusListObj = {
            id: ids,
            yard: data.yard,
            channelName: data.channelName,
            createdAt: data.createdAt,
            licensePlate: data.licensePlate,
            direction: data.direction === 1 ? '驶入' : '驶出',
            carType: data.carType,
          }
          this.focusList.unshift(focusListObj)
        } else if (data.recordType === 3) {
          let deployInfoObj = {
            snapshotTime: data.snapshotTime,
            licensePlate: data.licensePlate,
            yard: data.yard,
            img: data.image,
          }
          this.deployInfoList.unshift(deployInfoObj)
        }
      })
    },
    // 查看详情
    viewDetails(row, val) {
      console.log(val, '00000')
      this.dialogFormVisible = true
      //   let obj = {
      //     id: this.carId[row] ? this.carId[row] : val.id,
      //   }

      this.getDetailList({ id: val.id }).then((res) => {
        this.detailVeiw = res.data.data.parkRecord
        let data = res.data.data.parkRecord
        this.carDetailList.organ = data.orgName
        this.carDetailList.part = data.keyPartName
        this.carDetailList.location = data.yard
        this.carDetailList.time = data.snapshotTime
        this.carDetailList.carNum = data.licensePlate
        this.carDetailList.type = data.recordType
        this.imgUrl = data.image
        switch (this.carDetailList.type) {
          case 2:
            this.carDetailList.type = '重点关注车辆'
            break
          case 3:
            this.carDetailList.type = '布控车辆'
            break
          case 4:
            this.carDetailList.type = '黑名单车辆'
            break
        }
      })
    },
    viewDetails1(row) {
      this.dialogFormVisible = true
      this.getDetailList({ id: this.carId[row] }).then((res) => {
        this.detailVeiw = res.data.data.parkRecord
        let data = res.data.data.parkRecord
        this.carDetailList.organ = data.orgName
        this.carDetailList.part = data.keyPartName
        this.carDetailList.location = data.yard
        this.carDetailList.time = data.snapshotTime
        this.carDetailList.carNum = data.licensePlate
        this.carDetailList.type = data.recordType
        this.imgUrl = data.image
      })
    },
    // 确认/拒绝通行
    confirmRefuseBtn(val) {
      console.log(val)
      this.dialogFormVisible = false
      let obj = {
        devIp: this.alarmInfo.platformIp,
        devPort: this.alarmInfo.platformPort,
        parkId: this.sureData.parkId?this.sureData.parkId:'',
        hostId: this.sureData.hostId?this.sureData.hostId:'',
        ctrl: val === 'confirm' ? 'open' : 'close',
        //ctrl:  'open' ,
        opinion: this.textarea,
      }
      //   this.setControl({
      //     devIp: '10.1.1.98',
      //     devPort: 8090,
      //     parkId: 'e2a2a7a2c66d11ea8504000c293defbe',
      //     hostId: '9bb8cae1-aee4-40be-bc6d-f05449a45667',
      //     ctrl: 'open',
      //     opinion: this.textarea,
      //   }).then((res) => {
      //     console.log(res)
      //   })
      this.setControl(obj).then((res) => {
        console.log(res)
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    tipsShowBtnTwo() {
      this.tipsShowTwo = !this.tipsShowTwo
    },
    // 查看更多按钮跳转
    moreBtn() {
      this.$router.replace('/intelligentSecurity/parkingManage/parkingRecord')
    },
    // 图片图标点击事件
    picShow() {
      this.timeIcon = !this.timeIcon
      if (this.timeIcon) {
        this.carPicShow = false
        this.carListShow = true
      } else {
        this.carListShow = false
        this.carPicShow = true
      }
    },
    // 实时过车列表
    timeCarList() {
      this.timeIcon = true
      this.carPicShow = false
      this.carListShow = true
    },
    // 机构数
    getTreeApi(params) {
      if (params.hasOwnProperty('tierType')) {
        console.log(params, 'params')
        if (params.tierType === 'park') {
          params['parkId'] = 1
          params['kpId'] = this.treeNode.data.keyPartId
        }
        delete params.tierType
      }
      return getTreeApi(params)
    },
    onceClick(data, node) {
      this.treeNode = node
      if (JSON.stringify(data) !== '{}') {
        this.messageEd = data
        console.log(this.messageEd)
      }
    },
  },
}
</script>

<style scoped lang='less'>
.real-container {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  .real-menu {
    padding-right: 10px;
    display: inline-block;
    box-sizing: border-box;
    font-size: 14px;
  }
  .real-main {
    height: 100%;
    overflow: hidden;
    .left_nav {
      width: 300px;
      float: left;
      height: 100%;
      box-shadow: 0px 0px 14px 6px rgba(84, 84, 84, 0.13);
      .org {
        width: 300px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        background: rgba(245, 245, 245, 1);
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      .left_Orgtree {
        float: left;
        height: 100%;
        width: 300px;
        .treeBox {
          padding: 12px;
        }
        .tree-content {
          width: 280px;
          width: 300px;
          border: 1px solid #e1e1e1;
        }
      }
    }
    /deep/.is-active {
      border-top: 2px solid rgba(45, 114, 211, 1);
    }
    .content_video {
      float: left;
      width: 1200px;
      height: 100%;
      box-shadow: 0 0 10px #ccc inset;

      .real-middle {
        height: 100%;
        border: 1px solid #ccc;
        .real-vidio {
          height: 70%;
          background-color: #ccc;
        }
        .real-tab-bottom {
          height: 30%;
          position: relative;

          .tips-body {
            height: 80%;
            margin: 0 auto;
            .tips-img {
              width: 100%;
              text-align: center;
            }
            .tips-main {
              position: relative;
              margin-top: 6px;
              height: 200px;
              margin: 0 auto;
              .detailList {
                width: 150px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .tips-tab {
                height: 100%;
                padding: 6px 0;
                display: flex;
                ul {
                  // float: left;
                  flex: 1;
                  li {
                    padding: 6px 20px;
                    font-size: 13px;
                  }
                }
                .line {
                  // float: left;
                  width: 1px;
                  height: 100%;
                  background-color: #ccc;
                }
              }
            }
          }

          /deep/.el-form {
            margin-top: 8px;
            textarea {
              width: 100%;
              height: 80px;
              max-width: 400px;
              max-height: 200px;
            }
          }
        }
        .tips-title {
          background-color: #eee;
          padding: 10px 10px 10px;
        }
        /deep/.el-dialog__header {
          padding: 0;
        }
        /deep/.el-dialog__body {
          padding: 10px 20px;
        }
        /deep/.el-dialog__close {
          position: absolute;
          top: -10px;
          left: -6px;
          color: #000;
        }
        /deep/.el-tabs--border-card > .el-tabs__content {
          padding: 0 10px;
        }
        .el-icon-picture-outline {
          position: absolute;
          top: 8px;
          right: 24px;
          z-index: 99;
          font-size: 22px;
          color: #3c3c3c;
        }
        .el-icon-more {
          position: absolute;
          top: 8px;
          right: 24px;
          z-index: 99;
          font-size: 22px;
          color: #3c3c3c;
        }
        // 实时过车图片展示
        .time-car-pic {
          width: 100%;
          height: 200px;
          overflow: hidden;
          li {
            float: left;
            width: 224px;
            height: 188px;
            margin: 10px 6px 0 0;
            border: 1px solid #333333;
            .img {
              width: 226px;
              height: 150px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .text {
              font-size: 14px;
              text-align: center;
              line-height: 38px;
            }
          }
        }
        .mark {
          position: absolute;
          z-index: 99;
          top: -2px;
          left: 260px;
        }
      }
    }
    .right_info {
      float: left;
      width: 416px;
      height: 100%;
      .real-tab-right {
        position: relative;
        height: 100%;
        margin-left: 10px;
        border: 1px solid #ccc;
        width: 90%;
      }
    }
    .more_btn {
      width: 93px;
      height: 35px;
      margin-left: 130px;
      margin-top: 30px;
      font-size: 12px;
      background: rgba(45, 114, 211, 1);
      border-radius: 2px;
    }
    .blacklist {
      height: 737px;
      width: 100%;
      margin-top: -20px;
      overflow: auto;
      overflow-x: hidden;
      li {
        position: relative;
        height: 151px;
        width: 340px;
        border-bottom: 1px solid #bbb;
        margin-top: 8px;
        .img {
          float: left;
          width: 200px;
          height: 139px;
          margin-top: 0;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .text {
          float: left;
          width: 40%;
          margin: 28px 0;
          font-size: 12px;
          p {
            margin-bottom: 16px;
          }
        }
        .iconfont {
          position: absolute;
          top: 110px;
          left: 290px;
          color: #909399;
          font-size: 20px;
        }
        .el-icon-tickets {
          position: absolute;
          top: 100px;
          left: 300px;
          color: blue;
          font-size: 16px;
        }
      }
    }
  }

}

</style>
