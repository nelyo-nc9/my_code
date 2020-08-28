<!--
 * @Author: yanglei
 * @Date: 2020-06-10 09:10:15
 * @LastEditTime: 2020-08-24 22:31:17
 * @LastEditors: your name
 * @Description: 金库门禁状态页面
 * @FilePath: \ccb-client\client\src\view\coffersManage\doorStatus\doorStatus.vue
-->

<template>
  <div class="door-status-container">
    <div class="sidebar-container">
      <treeBox :lazyTreeApi="getTreeApi" searchType="filter" :treeType="treeType" @onceClick="organizeTreeClickHandle" @rootId="setRootId" treeLazyToggle iconToggle></treeBox>
    </div>
    <div class="main-container">
      <div class="breadcrumb-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>金库远程管理</el-breadcrumb-item>
          <el-breadcrumb-item class="active">金库门状态</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="button-container">
        <!-- <span v-loading.fullscreen.lock="fullscreenLoading" @click="refreshHandler"><i class="iconfont icon-refresh"></i> 刷新</span> -->
        <span class="cursor" @click="refreshHandler"><i class="iconfont icon-refresh"></i> 刷新</span>
        <span class="cursor" @click="imgListToggle"><i :class="showImageList ? 'iconfont icon-fenlei' : 'iconfont icon-more'"></i> {{showImageList ? '列表视图' : '图形视图'}}</span>
        <!-- <el-button type="primary" size="medium" icon="iconfont icon-refresh" @click="refreshHandler" v-loading.fullscreen.lock="fullscreenLoading"> 刷新 </el-button>
        <el-button size="medium" :icon="showImageList ? 'iconfont icon-fenlei' : 'iconfont icon-more'" @click="imgListToggle"> {{showImageList ? '列表视图' : '图形视图'}}</el-button> -->
        <span>状态筛选 </span>
        <el-select v-model="filterSelectOption" placeholder="请选择" @change="filterSelectChange">
          <el-option
            v-for="item in filterSelectData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- 图形视图容器 -->
      <div class="image-list-container" ref="imgListContainer" v-if="showImageList">
        <div class="image-list-item" v-for="item in imageListData" :key="item.Id">
          <el-card shadow="hover">
            <div class="info">
              <p><span class="info-key">机构名称</span> <span :title="item.mechanismName" class="info-value">{{ item.mechanismName }}</span></p>
              <p><span class="info-key">重点部位名称</span> <span :title="item.keyPartName" class="info-value">{{ item.keyPartName }}</span></p>
              <!-- <p><span class="info-key">门禁设备名称</span> <span :title="item.equipmentName" class="info-value">{{ item.equipmentName }}</span><i class="iconfont icon-info" @click="deviceInfoHandler(index)"></i></p> -->
            </div>
            <!-- <div class="first-door-div">
              <p><span class="info-key">门禁设备</span> <span :title="item.firstEquipmentName" class="info-value">{{ item.firstEquipmentName }}</span><i class="iconfont icon-info" @click="deviceInfoHandler(item.firstEquipmentId)"></i></p>
              <div class="first">
                <div :class="[item.firstDoorStatus === '已开启' ? 'open-door' : item.firstDoorStatus === '关闭' ? 'close-door' : 'open-door']">
                  <span class="handle"></span>
                  <span v-if="item.firstDoorStatus === '异常'" class="unusual-door">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#ccbjinggao"></use>
                    </svg>
                  </span>
                </div>
                <div>
                  <p class="first-door-name" :title="item.firstDoorName">{{ item.firstDoorName }}</p>
                  <p>门状态: <span :class="[item.firstDoorStatus === '已开启' || item.firstDoorStatus === '异常' ? 'state-text-red' : item.firstDoorStatus === '未知' ? 'state-text-blue' : '']">{{ item.firstDoorStatus }}</span></p>
                </div>
              </div>
            </div> -->

            <!-- <div class="second-door-div">
              <p><span class="info-key">门禁设备</span> <span :title="item.secondEquipmentName" class="info-value">{{ item.secondEquipmentName }}</span><i class="iconfont icon-info" @click="deviceInfoHandler(item.secondEquipmentId)"></i></p>
              <div class="second">
                <div :class="[item.secondDoorStatus === '已开启' ? 'open-door' : item.secondDoorStatus === '关闭' ? 'close-door' : 'open-door']">
                  <span class="handle"></span>
                  <span v-if="item.secondDoorStatus === '异常'" class="unusual-door">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#ccbjinggao"></use>
                    </svg>
                  </span>
                </div>
                <div>
                  <p class="second-door-name" :title="item.secondDoorName">{{ item.secondDoorName }}</p>
                  <p>门状态: <span :class="[item.secondDoorStatus === '已开启' || item.secondDoorStatus === '异常' ? 'state-text-red' : item.secondDoorStatus === '未知' ? 'state-text-blue' : '']">{{ item.secondDoorStatus }}</span></p>
                </div>
              </div>
            </div> -->

            <div class="door-channel-div" v-for="(cItem, cIndex) in item.channels" :key="cIndex">
              <p><span class="info-key">门禁设备</span> <span :title="cItem.equipmentName" class="info-value">{{ cItem.equipmentName }}</span><i class="iconfont-ccb ccbtishi" style="color: #D3A62D;" @click="deviceInfoHandler(cItem.doorId)"></i></p>
              <div class="first">
                <!-- <div :class="[cItem.doorStatus === '已开启' ? 'open-door' : cItem.doorStatus === '关闭' ? 'close-door' : 'open-door']">
                  <span class="handle"></span>
                  <span v-if="cItem.doorStatus === '异常'" class="unusual-door">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#ccbjinggao"></use>
                    </svg>
                  </span>
                </div> -->
                <div class="status-img-div">
                  <img :src="'/static/image/doorstatus/' + ['open', 'close', 'unusual', 'unknown'][['已开启', '关闭', '异常', '未知'].findIndex(item => item === cItem.doorStatus)] + '.png'" alt="" style="width: 100%; height: 100%;">
                </div>
                <div>
                  <p class="first-door-name" :title="cItem.doorName">{{ cItem.doorName }}</p>
                  <p>门状态: <span :class="[cItem.doorStatus === '已开启' || cItem.doorStatus === '异常' ? 'state-text-red' : cItem.doorStatus === '未知' ? 'state-text-blue' : '']">{{ cItem.doorStatus }}</span></p>
                </div>
              </div>
            </div>
            <div class="door-channel-div" v-if="item.channels.length === 1"></div>
          </el-card>
        </div>

        <div v-if="imageListData.length === 0" class="no-data-text">
          <p>暂无数据</p>
        </div>
      </div>

      <!-- 表格视图容器 -->
      <div class="table-container" v-else>
        <!-- 金库门状态表格展示 -->
        <el-table
          :data="doorStatusTable"
          stripe
          height="100%"
          style="width: 100%"
          :cell-style="doorStatusTableCellStyle">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column prop="organization" label="机构" show-overflow-tooltip></el-table-column>
          <el-table-column prop="keySite" label="重点部位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="entranceGuard" label="门禁设备名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="channel" label="通道"></el-table-column>
          <el-table-column prop="status" label="门状态"></el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <span title="预览画面" @click="showPreviewHandler(scope.$index, scope.row.equipmentId)"><i class="iconfont icon-preview"></i></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 显示金库门禁设备详细信息对话框 -->
    <DeviceInfoModal v-if="showDeviceInfoModal" :showDeviceInfo="showDeviceInfoModal" :deviceInfo="deviceInfoProp" @close="closeModal"></DeviceInfoModal>
    <!-- 点击表格操作预览画面图标，显示实时预览对话框 -->
    <PreviewVideoModal v-if="showPreviewModal" :showPreviewVideo="showPreviewModal" :previewParam="previewParam" :previewTitle="previewTitle" @closePreview="closeModal"></PreviewVideoModal>
  </div>
</template>

<script>
import DeviceInfoModal from './DeviceInfoModal'
import PreviewVideoModal from '../components/PreviewVideoModal'
import treeBox from '@src/components/tree/treeBox'
import '@src/assets/ccb_iconfonts/iconfont.js'
import { queryDoorStatusApi, getTreeApi, getRelevCameraApi, getCameraInfoApi } from '../../../http/coffersManage/doorStatus.api.js'

export default {
  name: 'doorStatus',
  components: {
    DeviceInfoModal,
    PreviewVideoModal,
    treeBox
  },
  data() {
    return {
      // fullscreenLoading: false,
      interval: '',
      treeType: 2, // 0: 机构-重点部位-设备-资源树、1: 机构-重点部位-设备树、2: 机构-重点部位树、3: 机构树
      currentCheckedTreeNode: '', // 当前选中的机构树节点
      rootId: '', // 机构根节点

      showImageList: true, // 默认展示图形列表界面
      filterSelectData: [ // 状态筛选下拉框选项值
        { value: 'all', label: '全部' },
        { value: 2, label: '已开启' },
        { value: 1, label: '关闭' },
        { value: 4, label: '异常' },
        { value: 3, label: '未知' }
      ],
      filterSelectOption: 'all', // 状态筛选下拉框选中值
      imageListData: [], // 门状态图形列表数据
      deviceInfoProp: {}, // 设备详细信息子组件传值数据
      doorStatusTable: [], // 门状态表格数据
      showDeviceInfoModal: false, // 显示查看设备详细信息对话框
      showPreviewModal: false, // 显示实时预览对话框
      currentOrgNode: '',
      currentLocNode: '',
      previewParam: {},
      previewTitle: ''
    }
  },
  mounted() {
    this.setImglistContainerHeight()
    window.addEventListener('resize', this.setImglistContainerHeight)
    this.interval = window.setInterval(() => {
      // this.filterSelectOption = 'all'
      // this.queryDoorStatus(true)
      this.queryDoorStatus()
    }, 10000)
  },
  methods: {
    // 机构树懒加载数据接口
    getTreeApi(params) {
      return getTreeApi(params)
    },
    /**
     * @description: 机构树点击事件 获取当前点击节点数据
     * @param {type} 当前点击节点数据
     * @return: 无
     */
    organizeTreeClickHandle(data) {
      this.currentCheckedTreeNode = data.id // 机构ID
      this.currentOrgNode = data.tierType === 'org' ? data.id : ''
      this.currentLocNode = data.tierType === 'loc' ? data.id : ''
      this.queryDoorStatus()
    },
    /**
     * @description: 机构树根节点ID
     * @param {type} 无
     * @return: 无
     */
    setRootId(data) {
      this.rootId = data
    },
    /**
     * @description: 刷新按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    refreshHandler() {
      // this.fullscreenLoading = true
      this.queryDoorStatus()
      let loadingInstance = this.$loading({
        text: '请稍等',
        target: document.querySelector(this.showImageList ? '.image-list-container' : '.table-container')
      })
      setTimeout(() => {
        loadingInstance.close()
      }, 300)
    },
    /**
     * @description: 状态筛选下拉框值变化事件
     * @param {type} 无
     * @return: 无
     */
    filterSelectChange() {
      this.queryDoorStatus()
    },
    /**
     * @description: 按条件查询金库门状态
     * @param {type} 无
     * @return: 无
     */
    queryDoorStatus(mode) {
      let params = {}
      if (this.currentOrgNode !== '') {
        params.orgId = this.currentOrgNode
      }
      if (this.filterSelectOption !== 'all') {
        params.status = this.filterSelectOption
      }
      if (this.currentLocNode !== '') {
        params.keyPartId = this.currentLocNode
      }

      // if (mode) {
      //   params = {
      //     orgId: this.rootId || this.currentOrgNode
      //   }
      // }
      queryDoorStatusApi(params)
        .then(res => {
          // if (this.fullscreenLoading) {
          //   setTimeout(() => {
          //     this.fullscreenLoading = false
          //   }, 300)
          // }

          let doorStatusList = res.data.data
          if (doorStatusList.length === 0) {
            this.imageListData = []
            this.doorStatusTable = []
            this.$messageWarn('查询无数据！')
            return
          }
          this.imageListData = doorStatusList.map((item, index) => {
            return {
              id: index,
              mechanismName: item.orgName,
              keyPartName: item.keyPartName,
              channels: item.channels.map(cItem => {
                return {
                  doorId: cItem.deviceId,
                  equipmentId: cItem.id,
                  equipmentName: cItem.deviceName,
                  doorName: cItem.name,
                  doorStatus: ['', '关闭', '已开启', '未知', '异常'][cItem.status]
                }
              })
            }
          })
          this.doorStatusTable = []
          if (this.imageListData.length !== 0) {
            this.imageListData.forEach(item => {
              if (item.channels && item.channels.length !== 0) {
                item.channels.forEach(cItem => {
                  this.doorStatusTable.push({
                    organization: item.mechanismName,
                    keySite: item.keyPartName,
                    id: cItem.doorId,
                    equipmentId: cItem.equipmentId,
                    entranceGuard: cItem.equipmentName,
                    channel: cItem.doorName,
                    status: cItem.doorStatus
                  })
                })
              }
            })
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 图形视图和列表视图切换
     * @param {type} 无
     * @return: 无
     */
    imgListToggle() {
      this.showImageList = !this.showImageList
    },
    /**
     * @description: 金库门状态表格-们状态单元格样式
     * @param {type} 无
     * @return: 无
     */
    doorStatusTableCellStyle({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 5) {
        return row.status === '打开' ? 'color: #2D72D3;' : row.status === '异常' ? 'color: #FF0000;' : ''
      }
    },
    /**
     * @description: 设备详情图标点击事件，打开金库门禁设备详细信息对话框
     * @param {type} (index) 点击图片列表的索引
     * @return: 无
     */
    deviceInfoHandler(id) {
      this.showDeviceInfoModal = true
      this.deviceInfoProp.id = id
    },
    /**
     * @description: 表格操作列预览画面图标点击事件 显示实时预览画面
     * @param {type} 点击索引  点击行数据
     * @return: 无
     */
    async showPreviewHandler(ind, data) {
      try {
        let param = await getRelevCameraApi({queryParam: data + '?ref=2', mode: 2})
        param = param.data.data
        if (param && param.video && param.video.length !== 0) {
          let cameraInfo = await getCameraInfoApi(param.video[0].rcId)
          cameraInfo = cameraInfo.data.data
          this.previewParam = {
            channel: cameraInfo.serise,
            devIp: cameraInfo.hostIp,
            devCport: cameraInfo.hostPort,
            // devDport: cameraInfo.hostPort,
            streamType: 'main',
            dId: cameraInfo.deviceId
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.previewTitle = this.doorStatusTable[ind].channel
        this.showPreviewModal = true
      }
    },
    /**
     * @description: 关闭金库门禁设备详细信息对话框
     * @param {type} 无
     * @return: 无
     */
    closeModal() {
      this.showDeviceInfoModal = false
      this.showPreviewModal = false
    },
    /**
     * @description: 设置图片列表容器高度
     * @param {type} 无
     * @return: 无
     */
    setImglistContainerHeight() {
      if (!this.showImageList) {
        return
      }
      // 获取类名为.body的元素的高度
      let bodyClassHeight = window.getComputedStyle(document.querySelector('.body')).height
      bodyClassHeight = Number(bodyClassHeight.slice(0, -2))
      this.$refs.imgListContainer.style.height = Math.floor(bodyClassHeight - 135) + 'px'
    }
  },
  watch: {
    rootId(val) {
      this.currentOrgNode = val
      this.queryDoorStatus()
      // 请求数据
    },
    interval(newVal, oldVal) {
      if (oldVal) {
        window.clearInterval(oldVal)
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setImglistContainerHeight)
    window.clearInterval(this.interval)
    this.interval = null
  }
}
</script>

<style lang="less" scoped>
.door-status-container {
  width: 100%;
  height: 100%;
  padding-top: 10px;
  background: #EAEEF3;

  .sidebar-container {
    width: 350px;
    height: calc(~"100% - 5px");
    float: left;
    padding: 0 10px;
    border-right: 1px solid #cccccc;
    background: #ffffff;
  }
  .main-container {
    width: 100%;
    height: 100%;
    padding-left: 350px;

    // 面包屑导航样式
    .breadcrumb-container {
      height: 34px;
      margin-left: 10px;
      padding: 10px 0 10px 20px;
      background: #ffffff;
    }

    .button-container {
      font-size: 14px;
      line-height: 40px;
      margin-left: 10px;
      padding: 5px 0 0 20px;
      background: #ffffff;
      button {
        margin-right: 20px;
      }
      span {
        margin: 0 5px 0 20px;
      }
      .cursor {
        cursor: pointer;
      }
    }

    /* 图形视图容器 */
    .image-list-container {
      width: calc(~"100% -10px");
      height: calc(~"100% - 89px");
      padding: 10px 0;
      margin-left: 10px;
      overflow: auto;
      background: #ffffff;
      .image-list-item {
        min-width: 850px;
        max-width: 1400px;
        height: 160px;
        margin: 10px 20px;
        /deep/ .el-card__body {
          height: 160px;
          font-size: 14px;
          padding: 0;
          display: flex;
          .info {
            // flex: 3;
            width: 270px;
            line-height: 30px;
            padding: 50px 0 0 10px;
            .info-key {
              width: 90px;
              display: inline-block;
            }
            .info-value {
              width: calc(~"100% - 150px");
              display: inline-block;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              vertical-align: bottom;
            }
          }

          .door-channel-div {
            width: 270px;
            margin-right: 20px;
            p {
              .info-value {
                width: 170px;
                overflow: hidden;
                display: inline-block;
                white-space: nowrap;
                text-overflow: ellipsis;
                vertical-align: bottom;
                margin-top: 20px;
              }
            }
            .first {
              display: flex;
              // padding-left: 15px;
              div {
                margin: 15px 0 0 5px;
                .first-door-name {
                  width: 140px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  vertical-align: bottom;
                }
                p {
                  line-height: 40px;
                }
              }
            }
          }

          &:hover {
            border: 1px solid #2D72D3;
          }
        }
      }

      .no-data-text {
        width: 1000px;
        text-align: center;
        padding-top: 300px;
      }
    }

    /* 表格视图容器 */
    .table-container {
      padding: 20px 20px 0 10px;
      margin-left: 10px;
      background: #ffffff;
      overflow: auto;
    }
  }

  .status-img-div {
    width: 50px;
    height: 57px;
    margin-top: 25px !important;
    // margin: 40px 0 0 10px;
    // border: 5px solid #666666;
    // background: skyblue;
    position: relative;
  }
  /* 门禁开启状态 */
  // .open-door {
  //   width: 70px;
  //   height: 80px;
  //   margin: 40px 0 0 10px;
  //   border: 5px solid #666666;
  //   position: relative;
  //   .handle {
  //     width: 16px;
  //     border: 3px solid red;
  //     position: absolute;
  //     top: 50%;
  //     left: 44px;
  //     transform: translateY(-3px);
  //   }
  // }
  /* 门禁关闭状态 */
  // .close-door {
  //   width: 70px;
  //   height: 80px;
  //   margin: 40px 0 0 10px;
  //   border: 5px solid #666666;
  //   position: relative;
  //   .handle {
  //     height: 20px;
  //     border: 3px solid #666666;
  //     position: absolute;
  //     top: 50%;
  //     left: 44px;
  //     transform: translateY(-10px);
  //   }
  // }
  /* 门禁异常状态 */
  // .unusual-door {
  //   width: 30px;
  //   height: 30px;
  //   position: absolute;
  //   left: 0;
  //   bottom: 0;
  //   .icon {
  //     width: 30px;
  //     height: 30px;
  //     fill: currentColor;
  //     overflow: hidden;
  //   }
  // }
  /* 门状态文字颜色 */
  .state-text-red {
    color: red;
  }
  .state-text-blue {
    color: #2D72D3;
  }
}
</style>
