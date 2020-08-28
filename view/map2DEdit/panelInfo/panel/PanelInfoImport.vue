<template>
  <div>
    <!-- <header class="header">
      <span>{{ formData.typeName }}</span>
      <span class="el-icon-delete-solid header-delete"  @click="deleteResource"></span>
    </header> -->
    <div class="right-panel-info" v-if="!isShowSpaceSettings">
      <!-- <div class="panel-info-title">
        <span>重点部位</span>
        <i class="el-icon-delete" style="float: right;line-height: 32px;"></i>
      </div>-->
      <div class="organization-info">
        <div class="organization-image" v-if="formData.topImage">
          <el-upload
            v-if="isEdit"
            class="avatar-uploader"
            action="/api/map/v1/upload"
            :on-success="handleImgSuccess"
            :before-upload="beforeAvatarUpload"
            :on-change="handleChange"
            :show-file-list="false"
          >
            <img v-if="curSelectResourcePoint && curSelectResourcePoint.image" :src="curSelectResourcePoint.image" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- <img v-else :src="curSelectResourcePointcurSelectResourcePoint.image" /> -->
        </div>
        <div class="organize-info-readonly">
          <!-- 部位 -->
          <table>
            <tr v-for="(item, index) in formData.showInfo" :key="index">
              <td class="tbName">{{ item.name }}</td>
              <td class="tbValue">
                {{ item.value}}
                <el-button type="primary" size="mini" style="float: right;" v-if="item.name == 'IP地址'" :disabled="!item.value" @click="checkPing(item.value)" >ping</el-button
                >
              </td>
            </tr>
            <tr>
              <td>可见层级</td>
              <td>{{ this.visibleLevel }}</td>
            </tr>
          </table>
        </div>
        <div class="smallImage_outFloor" v-if="formData.smallImage || curSelectResourcePoint && curSelectResourcePoint.place === 1 && formData.outFloor">
          <div class="organize-info-form" v-show="formData.smallImage === 1" style="height: 47px;">
          <tr>
            <td style="width: 90px;">缩微图形态</td>
            <td style="padding-left:0;width:210px;">
              <el-select v-model="importForm.shapeType" size="mini" :placeholder="miniImgName" style="width:180px;">
                <el-option v-for="item in miniImgOptions" :key="item.value" :label="item.label" :value="item.value">
                  <span @click.capture="selectMiniImg(item.value)" style="display:block;">{{ item.label }}</span>
                </el-option>
              </el-select>
              <div class="el-icon-edit-btn-div">
                <i
                  v-show="importForm.shapeType === 2 || importForm.shapeType === 3"
                  class="el-icon-edit-btn"
                  title="修改样式"
                  @click="handleClickUpdateStyle()"
                ></i>
              </div>
            </td>
          </tr>
        </div>

        <div style="height: 47px;" class="organize-info-form" v-show="formData.smallImage === 2">
          <tr>
            <td style="width: 90px;">缩微图形态</td>
            <td style="padding-left:0;width:210px;">
              <el-select v-model="importForm.shapeType" size="mini" :placeholder="miniImgName" style="width:170px;">
                <el-option v-for="item in miniImgOptions2" :key="item.value" :label="item.label" :value="item.value">
                  <span @click.capture="selectMiniImg(item.value)" style="display:block;">{{ item.label }}</span>
                </el-option>
              </el-select>
              <div class="el-icon-edit-btn-div">
                <i
                  v-show="importForm.shapeType === 2 || importForm.shapeType === 3"
                  class="el-icon-edit-btn"
                  title="点击自定义缩微图形态"
                  @click="handleClickUpdateStyle()"
                ></i>
              </div>
            </td>
          </tr>
        </div>

        <div class="organize-info-form" v-if="formData.outFloor">
          <tr>
            <td
              style="width: 90px;"
              v-if="curSelectResourcePoint  && curSelectResourcePoint.envImageData && curSelectResourcePoint.envImageData.image"
              @click="handEnvironmental(curSelectResourcePoint.id)"
              title="点击进入环境平面图"
            >
              环境平面图
            </td>
            <td style="width: 90px;" v-else>环境平面图</td>
            <td class="envImageDataClass"  style="width:206px;">
              <p>{{curSelectResourcePoint  && curSelectResourcePoint.envImageData && curSelectResourcePoint.envImageData.name}}</p>
              <div class="envImageDataClass_icon">
                <el-upload
                class="upload-btn"
                ref="fileUpload"
                action="/api/map/v1/upload"
                multiple
                :show-file-list="false"
                :on-success="uploadSuccess"
                :before-upload="beforeAvatarUpload"
                :file-list="fileListClear"
              >
                <i class="el-icon-folder-opened"></i>
              </el-upload>
              <i
                class="el-icon-delete imageClass_icon_delete"
                v-if="curSelectResourcePoint  && curSelectResourcePoint.envImageData && curSelectResourcePoint.envImageData.image"
                size="mini"
                type="primary"
                @click="deletemapFileName(curSelectResourcePoint.envImageData.id)"
              ></i>
              </div>
            </td>
          </tr>
        </div>
        </div>

        <div class="organize-info-add" v-if="formData.floorAdd">
          <div class="showAddFloorClass" @click="showAddFloor">
              <i class="el-icon-plus"></i>
              <span>楼层添加</span>
          </div>
          <ul
            v-if="!showFloorForm && curSelectResourcePoint && curSelectResourcePoint.floors"
            class="floorListClass"
          >
            <li v-for="(item, index) in curSelectResourcePoint.floors" :key="index">
              <span :title="item.floorIndex" @click="floorsBatCicki(index, item.id)" class="listFoorName">
                {{ item.floorIndex }}
              </span>
              <span class="listFoorImages">
                <span class="listFoorImagesName">{{item.name}}</span>
                <!-- 编辑楼层 -->
                <span class="listFoorImagesPut">
                  <i style="margin-right:5px;" class="el-icon-setting el-icon--right editElIcon" @click="elIconSettingEdit(item)"></i>
                <i title="删除楼层" class="el-icon-delete imageClass_icon_delete" size="mini" type="primary" @click="deleteFloor(item.id)"></i>
                </span>
              </span>
            </li>
          </ul>

          <div class="AddfileFoorFrom" v-if="showFloorForm">
                <el-input class="fileInput fileInputFrom" size="mini" v-model="idfooleidName" maxlength='9' placeholder="楼层名称"></el-input>
                <el-input class="fileInput fileInputFrom" size="mini" v-model="floorsImagesName" placeholder="图片名称"></el-input>
              <el-upload
                class="upload-btn"
                ref="uploadfoor"
                action="/api/map/v1/upload"
                multiple
                :show-file-list="false"
                :file-list="fileList"
                :on-success="uploadFoolsSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <el-button class="el-icon-folder-opened el-icon--right"></el-button>
              </el-upload>
              <el-button class="el-icon-check" @click="pushFloor"></el-button>
          </div>
        </div>
        <!-- 可视域绘制模块 -->
        <!-- <div v-if="formData.sectorInfo">12345</div> -->
        <div class="right-panel-info" v-show="formData.sectorInfo">
          <div class="camera-info">
            <div class="camera-info-readonly">
              <div class="panel-viewshed">
                <!-- <div class="panel-camera-box">
                  <span>缩微图调整</span>
                </div> -->
                <div class="panel-camera-box">
                  <el-checkbox label="可视域" name="type" @change="checkboxChange"></el-checkbox>
                </div>
                <!-- 提交的表单 -->
                <el-form ref="pointDataAn" :model="pointData" label-width="80px">
                  <el-form-item label="照射半径" prop="radiation">
                    <!-- <el-input
                      :max="150"
                      :disabled="disabled"
                      :min="0"
                      size="mini"
                      type="number"
                      v-model="pointData.radiation"
                      @input="radiusInput"
                      placeholder="0到150米"
                    ></el-input
                    > -->
                    <el-input-number
                      v-model="pointData.radiation"
                      controls-position="right"
                      @change="radiusInput"
                      :min="50"
                      :step="10"
                      :max="150"
                      :disabled="disabled"
                      size="mini"
                    ></el-input-number>
                    米
                  </el-form-item>
                  <el-form-item label="可视域角度" prop="viewshed">
                    <!-- <el-input
                      :max="150"
                      :disabled="disabled"
                      :min="0"
                      size="mini"
                      type="number"
                      v-model="pointData.viewshed"
                      @input="anglesInput"
                      placeholder="0到360度"
                    ></el-input
                    > -->
                    <el-input-number
                      v-model="pointData.viewshed"
                      controls-position="right"
                      @change="anglesInput"
                      :min="90"
                      :step="10"
                      :max="150"
                      :disabled="disabled"
                      size="mini"
                    ></el-input-number>
                    °
                  </el-form-item>
                  <!-- :disabled="disabled" -->
                  <el-form-item label="朝向" prop="viewshedAngle">
                    <!-- <el-input
                      :max="360"
                      :disabled="disabled"
                      :min="-360"
                      size="mini"
                      type="number"
                      v-model="pointData.viewshedAngle"
                      @input="rangeInput"
                      placeholder="0到360度"
                    ></el-input
                    > -->
                    <el-input-number
                      v-model="pointData.viewshedAngle"
                      controls-position="right"
                      @change="rangeInput"
                      :min="0"
                      :step="10"
                      :max="360"
                      :disabled="disabled"
                      size="mini"
                    ></el-input-number>
                    °
                  </el-form-item>
                </el-form>
                <div id="panel-svg">
                  <svg width="200px" height="200px" class="svgclass" version="1.1">
                    <text x="185" y="105" fill="#000">0°</text>
                    <text x="90" y="15" fill="#000">90°</text>
                    <text x="0" y="105" fill="#000">180°</text>
                    <text x="90" y="200" fill="#000">270°</text>
                    <line x1="30" y1="100" x2="180" y2="100" style="stroke:rgb(000,000,000);stroke-width:1" />
                    <line x1="100" y1="20" x2="100" y2="180" style="stroke:rgb(000,000,000);stroke-width:1" />
                    <g id="ringIdMax" ref="ringIdMax">
                      <g ref="ringId">
                        <path ref="ring" fill="#20a1ff" />
                        <circle cx="100" cy="100" r="10" stroke="black" stroke-width="1" fill="#FFF" />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--  -->
      </div>
      <div class="panel-info-btn" v-if="isEdit">
        <el-row>
          <el-button size="mini" @click="cancel">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitSave">保 存</el-button>
        </el-row>
      </div>
    </div>
    <SpaceSettings :isPolygon="isPolygon" v-else @closeSetting="closeSetting" />
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import SpaceSettings from '../../components/SpaceSettings'
import { getSetInfo } from './rightSetInfo'
import {
  RESOURCETYPE,
  SHAPETYPE,
  GEOMETRYTYPE,
  DRAWSTYLETYPE,
  KEYPARTTYPE,
  DEVICETYPE,
  KEYPARTTYPEORG,
  EnglishNamePrefix,
  MAPTYPENUMBER
} from 'assets/2DMap/meta/common'
import {
  checkPingAPI
} from 'http/map2D/index'
import layerConfig from 'assets/2DMap/meta/layer'
import videoTrans from 'assets/2DMap/feature/edit/video'
import { pointTypeData } from 'assets/2DMap/meta/pointType'
export default {
  components: {
    SpaceSettings
  },
  computed: {
    ...mapState({
      isMapOuter: ({ map2d }) => map2d.mapIndex.isMapOuter, // 1:动态地图，2：静态地图
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap, // 楼内地图对象
      indoorLayerConfig: ({ map2d }) => map2d.mapIndex.indoorLayerConfig,
      showFloorForm: ({ map2d }) => map2d.mapPanelSearch.showFloorForm, // 设置修改楼层弹框是否展示
      selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNode, // 当前选中的树节点
      importPartIcons: ({ map2d }) => map2d.mapPoint.importPartIconFeatures, // 重点部位 点位要素
      drawFeatureLoc: ({ map2d }) => map2d.mapPoint.drawFeatureLoc, // 修改的点位位置
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint,
      environmentalScienceInformation: ({ map2d }) => map2d.mapIndex.environmentalScienceInformation, // 最新的环境信息
      indoorInformation: ({ map2d }) => map2d.mapIndex.indoorInformation, // 最新的室内信息
      videoTree: ({ map2d }) => map2d.mapPanelSearch.resourceLists['1'], // 资源树
      // 摄像机相关可视域相关
      sectorChecked: ({ map2d }) => map2d.mapPoint.videoEditSectorChecked,
      isSector: ({ map2d }) => map2d.mapIndex.checkedEquipments.camera.sector.value, // 可视域显隐
      boltipcResource: ({ map2d }) => map2d.mapPoint.boltipcResourceArr, // 枪机 资源数组
      boltipcIcons: ({ map2d }) => map2d.mapPoint.boltipcIconFeatures, // 枪机 点位要素
      boltipcSectors: ({ map2d }) => map2d.mapPoint.boltipcSectorFeatures, // 枪机 可视域要素
      redBoltipcResource: ({ map2d }) => map2d.mapPoint.redBoltipcResourceArr, // 红外枪机 资源数组
      redBoltipcIcons: ({ map2d }) => map2d.mapPoint.redBoltipcIconFeatures, // 红外枪机 点位要素
      redBoltipcSectors: ({ map2d }) => map2d.mapPoint.redBoltipcSectorFeatures, // 红外枪机 可视域要素
      halfBallipcResource: ({ map2d }) => map2d.mapPoint.halfBallipcResourceArr, // 半球 资源数组
      halfBallipcIcons: ({ map2d }) => map2d.mapPoint.halfBallipcIconFeatures, // 半球 点位要素
      halfBallipcSectors: ({ map2d }) => map2d.mapPoint.halfBallipcSectorFeatures, // 半球 可视域要素
      fastBallipcResource: ({ map2d }) => map2d.mapPoint.fastBallipcResourceArr, // 球机 资源数组
      fastBallipcIcons: ({ map2d }) => map2d.mapPoint.fastBallipcIconFeatures, // 球机 点位要素
      fastBallipcSectors: ({ map2d }) => map2d.mapPoint.fastBallipcSectorFeatures, // 球机 可视域要素
      allViewipcResource: ({ map2d }) => map2d.mapPoint.allViewipcResourceArr, // 全景 资源数组
      allViewipcIcons: ({ map2d }) => map2d.mapPoint.allViewipcIconFeatures, // 全景 点位要素
      allViewipcSectors: ({ map2d }) => map2d.mapPoint.allViewipcSectorFeatures, // 全景 可视域要素
      pinholeipcResource: ({ map2d }) => map2d.mapPoint.pinholeipcResourceArr, // 针孔 资源数组
      pinholeipcIcons: ({ map2d }) => map2d.mapPoint.pinholeipcIconFeatures, // 针孔 点位要素
      pinholeipcSectors: ({ map2d }) => map2d.mapPoint.pinholeipcSectorFeatures, // 针孔 可视域要素
      smartIPCResource: ({ map2d }) => map2d.mapPoint.smartIPCResourceArr, // 智能IPC 资源数组
      smartIPCIcons: ({ map2d }) => map2d.mapPoint.smartIPCIconFeatures, // 智能IPC 点位要素
      smartIPCSectors: ({ map2d }) => map2d.mapPoint.smartIPCSectorFeatures, // 智能IPC 可视域要素
      // 录像机
      videoRecorderResource: ({ map2d }) => map2d.mapPoint.videoRecorderResourceArr, // 录像机 资源数组
      videoRecorderIcons: ({ map2d }) => map2d.mapPoint.videoRecorderIconFeatures, // 录像机 点位要素
      // 报警设备
      telAlarmHostResource: ({ map2d }) => map2d.mapPoint.telAlarmHostResourceArr, // 电话报警主机 资源数组
      telAlarmHostIcons: ({ map2d }) => map2d.mapPoint.telAlarmHostIconFeatures, // 电话报警主机 点位要素
      networkAlarmHostResource: ({ map2d }) => map2d.mapPoint.networkAlarmHostResourceArr, // 网络报警主机 资源数组
      networkAlarmHostIcons: ({ map2d }) => map2d.mapPoint.networkAlarmHostIconFeatures, // 网络报警主机 点位要素
      fenceAlarmHostResource: ({ map2d }) => map2d.mapPoint.fenceAlarmHostResourceArr, // 电子围栏总线报警主机 资源数组
      fenceAlarmHostIcons: ({ map2d }) => map2d.mapPoint.fenceAlarmHostIconFeatures, // 电子围栏总线报警主机 点位要素
      shakeAlarmHostResource: ({ map2d }) => map2d.mapPoint.shakeAlarmHostResourceArr, // 震动光纤报警主机 资源数组
      shakeAlarmHostIcons: ({ map2d }) => map2d.mapPoint.shakeAlarmHostIconFeatures, // 震动光纤报警主机 点位要素
      wallDetectorResource: ({ map2d }) => map2d.mapPoint.wallDetectorResourceArr, // 壁挂双鉴探测器 资源数组
      wallDetectorIcons: ({ map2d }) => map2d.mapPoint.wallDetectorIconFeatures, // 壁挂双鉴探测器 点位要素
      ceilingDetectorResource: ({ map2d }) => map2d.mapPoint.ceilingDetectorResourceArr, // 吸顶双鉴探测器 资源数组
      ceilingDetectorIcons: ({ map2d }) => map2d.mapPoint.ceilingDetectorIconFeatures, // 吸顶双鉴探测器 点位要素
      atmShakeDetectorResource: ({ map2d }) => map2d.mapPoint.atmShakeDetectorResourceArr, // atm震动探测器 资源数组
      atmShakeDetectorIcons: ({ map2d }) => map2d.mapPoint.atmShakeDetectorIconFeatures, // atm震动探测器 点位要素
      vaultShakeDetectorResource: ({ map2d }) => map2d.mapPoint.vaultShakeDetectorResourceArr, // 金库震动探测器 资源数组
      vaultShakeDetectorIcons: ({ map2d }) => map2d.mapPoint.vaultShakeDetectorIconFeatures, // 金库震动探测器 点位要素
      doorMagneticDetectorResource: ({ map2d }) => map2d.mapPoint.doorMagneticDetectorResourceArr, // 门磁探测器 资源数组
      doorMagneticDetectorIcons: ({ map2d }) => map2d.mapPoint.doorMagneticDetectorIconFeatures, // 门磁探测器 点位要素
      glassBrokenDetectorResource: ({ map2d }) => map2d.mapPoint.glassBrokenDetectorResourceArr, // 玻璃破碎探测器 资源数组
      glassBrokenDetectorIcons: ({ map2d }) => map2d.mapPoint.glassBrokenDetectorIconFeatures, // 玻璃破碎探测器 点位要素
      smokeDetectorResource: ({ map2d }) => map2d.mapPoint.smokeDetectorResourceArr, // 光电感烟探测器 资源数组
      smokeDetectorIcons: ({ map2d }) => map2d.mapPoint.smokeDetectorIconFeatures, // 光电感烟探测器 点位要素
      pirCurtainDetectorResource: ({ map2d }) => map2d.mapPoint.pirCurtainDetectorResourceArr, // 红外幕帘探测器(入侵) 资源数组
      pirCurtainDetectorIcons: ({ map2d }) => map2d.mapPoint.pirCurtainDetectorIconFeatures, // 红外幕帘探测器(入侵) 点位要素
      temperatureDetectorResource: ({ map2d }) => map2d.mapPoint.temperatureDetectorResourceArr, // 温度探测器 资源数组
      temperatureDetectorIcons: ({ map2d }) => map2d.mapPoint.temperatureDetectorIconFeatures, // 温度探测器 点位要素
      leakDetectorResource: ({ map2d }) => map2d.mapPoint.leakDetectorResourceArr, // 漏水探测器 资源数组
      leakDetectorIcons: ({ map2d }) => map2d.mapPoint.leakDetectorIconFeatures, // 漏水探测器 点位要素
      voicedDangerButtonResource: ({ map2d }) => map2d.mapPoint.voicedDangerButtonResourceArr, // 紧急按钮(有声) 资源数组
      voicedDangerButtonIcons: ({ map2d }) => map2d.mapPoint.voicedDangerButtonIconFeatures, // 紧急按钮(有声) 点位要素
      silentDangerButtonResource: ({ map2d }) => map2d.mapPoint.silentDangerButtonResourceArr, // 紧急按钮(无声) 资源数组
      silentDangerButtonIcons: ({ map2d }) => map2d.mapPoint.silentDangerButtonIconFeatures, // 紧急按钮(无声) 点位要素
      correlationDetectorResource: ({ map2d }) => map2d.mapPoint.correlationDetectorResourceArr, // 红外对射探测器 资源数组
      correlationDetectorIcons: ({ map2d }) => map2d.mapPoint.correlationDetectorIconFeatures, // 红外对射探测器 点位要素
      offsetDetectorResource: ({ map2d }) => map2d.mapPoint.offsetDetectorResourceArr, // 位移探测器 资源数组
      offsetDetectorIcons: ({ map2d }) => map2d.mapPoint.offsetDetectorIconFeatures, // 位移探测器 点位要素
      shakeOpticalResource: ({ map2d }) => map2d.mapPoint.shakeOpticalResourceArr, // 振动光纤 资源数组
      shakeOpticalIcons: ({ map2d }) => map2d.mapPoint.shakeOpticalIconFeatures, // 振动光纤 点位要素
      electronicFenceResource: ({ map2d }) => map2d.mapPoint.electronicFenceResourceArr, // 电子围栏 资源数组
      electronicFenceIcons: ({ map2d }) => map2d.mapPoint.electronicFenceIconFeatures, // 电子围栏 点位要素
      // 消防设备 11个
      userInfoTransmissionDeviceResource: ({ map2d }) => map2d.mapPoint.userInfoTransmissionDeviceResourceArr, //  消防设备 资源数组
      userInfoTransmissionDeviceIcons: ({ map2d }) => map2d.mapPoint.userInfoTransmissionDeviceIconFeatures, // 消防设备 点位要素
      firePumpMonitorResource: ({ map2d }) => map2d.mapPoint.firePumpMonitorResourceArr, //  消防设备 资源数组
      firePumpMonitorIcons: ({ map2d }) => map2d.mapPoint.firePumpMonitorIconFeatures, // 消防设备 点位要素
      hydraulicSensorResource: ({ map2d }) => map2d.mapPoint.hydraulicSensorResourceArr, //  消防设备 资源数组
      hydraulicSensorIcons: ({ map2d }) => map2d.mapPoint.hydraulicSensorIconFeatures, // 消防设备 点位要素
      liquidLevelSensorResource: ({ map2d }) => map2d.mapPoint.liquidLevelSensorResourceArr, //  消防设备 资源数组
      liquidLevelSensorIcons: ({ map2d }) => map2d.mapPoint.liquidLevelSensorIconFeatures, // 消防设备 点位要素
      smokePreventionMonitorResource: ({ map2d }) => map2d.mapPoint.smokePreventionMonitorResourceArr, //  消防设备 资源数组
      smokePreventionMonitorIcons: ({ map2d }) => map2d.mapPoint.smokePreventionMonitorIconFeatures, // 消防设备 点位要素
      gasMonitorResource: ({ map2d }) => map2d.mapPoint.gasMonitorResourceArr, //  消防设备 资源数组
      gasMonitorIcons: ({ map2d }) => map2d.mapPoint.gasMonitorIconFeatures, // 消防设备 点位要素
      fireSeparationMonitorResource: ({ map2d }) => map2d.mapPoint.fireSeparationMonitorResourceArr, //  消防设备 资源数组
      fireSeparationMonitorIcons: ({ map2d }) => map2d.mapPoint.fireSeparationMonitorIconFeatures, // 消防设备 点位要素
      electricalFireDetectorResource: ({ map2d }) => map2d.mapPoint.electricalFireDetectorResourceArr, //  消防设备 资源数组
      electricalFireDetectorIcons: ({ map2d }) => map2d.mapPoint.electricalFireDetectorIconFeatures, // 消防设备 点位要素
      independentSmokeDetectorResource: ({ map2d }) => map2d.mapPoint.independentSmokeDetectorResourceArr, //  消防设备 资源数组
      independentSmokeDetectorIcons: ({ map2d }) => map2d.mapPoint.independentSmokeDetectorIconFeatures, // 消防设备 点位要素
      independentTemperatureSensorResource: ({ map2d }) => map2d.mapPoint.independentTemperatureSensorResourceArr, //  消防设备 资源数组
      independentTemperatureSensorIcons: ({ map2d }) => map2d.mapPoint.independentTemperatureSensorIconFeatures, // 消防设备 点位要素
      independentCombustibleGasDetectorResource: ({ map2d }) =>
        map2d.mapPoint.independentCombustibleGasDetectorResourceArr, //  消防设备 资源数组
      independentCombustibleGasDetectorIcons: ({ map2d }) =>
        map2d.mapPoint.independentCombustibleGasDetectorIconFeatures // 消防设备 点位要素
    }),
    ...mapGetters('map2d/mapIndex', ['importFormData', 'drawActive']),
    visibleLevel() {
      return window.$context2D.map.getView().getZoom()
    },
    isPolygon() {
      // 当前操作点位几何形态是否是面
      return this.importForm.shapeType === SHAPETYPE.POLYGON
    },
    nowMapPlace() {
      // 当前地图类型
      let nowPlace = this.isMapOuter === 1 ? 1 : this.floorMap.isFloor ? 3 : 2
      // console.log('当前地图类型：', nowPlace)
      return nowPlace
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      required: true
    },
    valData: {
      type: Object
    },
    addFloorObj: {
      type: Object
    }
  },
  watch: {
    // 楼层名称自定义输入正则判断
    idfooleidName() {
      this.idfooleidName = this.idfooleidName.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, '')
    },
    valData: {
      // 监听选中点位数据的变化
      handler(newValue, oldValue) {
        if (newValue) {
          let data = getSetInfo(newValue)
          this.formData = data
          this.importForm.shapeType = newValue.shapeType
        }
      },
      deep: true
    },
    // 摄像机相关/可视域相关
    curSelectResourcePoint() {
      if (this.disabled) {
        if (this.curSelectResourcePoint != null) {
          this.setVideoEditSectorChecked(false)
          this.initCurrentResource()
        }
      } else {
        //
        this.setVideoEditSectorChecked(true)
        this.updateCurrentSector()
      }
    }
    //
  },
  mounted() {
    this.initCurrentResource()
  },
  data() {
    return {
      // headers: JSON.stringify({ 'x-bsr-service': 'RYtB1GqRCMnStqh1KhENSjMFNAivQ8ZCDMFFbEGdl/c=' }),
      fileListClear: [{ name: '', url: '' }],
      formList: null,
      formData: null,
      isSaveOver: false, // 保存过程是否完成
      mapFileName: this.valData.envImage, // 环境平面图名字
      floorsNameUrl: '', // 楼层平面图路径
      floorsImagesName: '', // 楼层平面图路径
      fileList: [],
      importForm: {
        name: this.name,
        code: '105134000015',
        address: '河北省保定市东风中路1860号',
        chargeLeader: '张XXX',
        leaderPhoneNum: '0315-******',
        phoneNum: '0315-******',
        level: '二级分行',
        higher: '河北省分行',
        status: '正常营业',
        businessHours: '1985-02-06',
        remark: '',
        image: '',
        shapeType: this.valData.shapeType, // 缩略图形态
        floors: []
      },
      miniImgName: '',
      idfooleidName: '',
      foorForm: {
        keyPartId: '',
        orgId: '',
        floorIndex: '',
        image: '',
        imageWidth: '',
        imageHeight: '',
        name: ''
      }, // 添加楼层对象
      miniImgOptions: [
        {
          value: SHAPETYPE.POINT, // 1
          label: '点位'
        },
        {
          value: SHAPETYPE.POLYGON, // 2
          label: '自定义区域'
        }
      ],
      miniImgOptions2: [
        {
          value: SHAPETYPE.POINT, // 1
          label: '点位'
        },
        {
          value: SHAPETYPE.POLYGON, // 2
          label: '自定义区域'
        },
        {
          value: SHAPETYPE.LINESTRING, // 3
          label: '自定义线'
        }
      ],
      isShowSpaceSettings: false,
      // 可视域相关
      disabled: true, // 输入框的禁用状态
      // 摄像机表单对象
      pointData: {
        radiation: 50,
        viewshed: 90,
        viewshedAngle: 0
      },
      boltipcLayer: layerConfig.boltipcIcon, // 枪机
      boltipcSectorLayer: layerConfig.boltipcSector, // 枪机可视域
      redBoltipcLayer: layerConfig.redBoltipcIcon, // 红外枪机
      redBoltipcSectorLayer: layerConfig.redBoltipcSector, // 红外枪机可视域
      halfBallipcLayer: layerConfig.halfBallipcIcon, // 半球
      halfBallipcSectorLayer: layerConfig.halfBallipcSector, // 半球可视域
      fastBallipcLayer: layerConfig.fastBallipcIcon, // 快球
      fastBallipcSectorLayer: layerConfig.fastBallipcSector, // 快球可视域
      allViewipcLayer: layerConfig.allViewipcIcon, // 全景
      allViewipcSectorLayer: layerConfig.allViewipcSector // 全景可视域
      // 可视域相关 结束
    }
  },
  created() {
    if (this.curSelectResourcePoint) {
      let data = getSetInfo(this.curSelectResourcePoint)
      // console.log(data)
      this.formData = data
      this.importForm.shapeType = this.curSelectResourcePoint.shapeType
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setPanelInfoStatus',
      'setPanelInfoFormData',
      'setDrawActive',
      'setIsMapOuter',
      'setIsFloorMap',
      'setindoorInformation', // 楼层平面图最新信息
      'setAreaDrawActive'
    ]),
    ...mapActions('map2d/mapPoint', [
      'addEnvironmental', // 创建环境平面图
      'getEnvironmental', // 根据id查询环境平面图
      'updateEnvironmental', // 修改环境平面图
      'deleteEnvironmental', // 批量删除环境平面图
      'addFloorAKey', // 添加楼层
      'updateFloorAKey', // 修改楼层
      'getAllFloorAKey', // 根据id查询楼层平面图
      'deleteFloorAKey', // 批量删除楼层平面图
      'setPointIconFeatures',
      'setAreaDrawActive',
      'setAreaDrawLoc',
      'updateMapCommonResourcePoint', // 修改地图设备点位
      'getCommonResourceById', // 获取地图设备点位详情
      'setCurrentSelectResource', // 当前点位信息
      // 可视域
      'setVideoEditSectorChecked',
      'setVideoSectorFeatures',
      // 'setPointIconFeatures',
      'setDrawFeatureLoc',
      'setEditSector'
      // 'setPointResourceByType'
      // 可视域结束
    ]), // 修改地图设备点位
    ...mapActions('map2d/mapPoint', ['setPointResourceByType', 'deleteMapCommonResourcePoint', 'setEditActive']),
    ...mapActions('map2d/mapIndex', [
      'setIsMapOuter',
      'setIsFloorMap',
      'setShowFloorInfo',
      'setRefreshTreeList',
      'setPanelInfoStatus',
      'setPanelInfoEditStatus',
      'setDrawActive',
      'setenvironmentalScienceInformation' // 最新的环境平面图信息
    ]),
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeCode', 'setFloorList', 'setShowFloorForm']),
    ...mapMutations('map2d/mapIndex', [
      'UPDATE_INDOOR_LAYER_CONFIG',
      'UPDATE_OUTDOOR_LAYER_CONFIG',
      'BUILDING_DIRECTORY'
    ]), // 楼内平面图 环境平面图  楼层索引现因控制 机构重点部位树下面的
    ...mapMutations('map2d/mapPoint', ['CLEAR_ALL_POINT_DATA']), // 清空所有点位相关数据
    // 获取点位详情方法
    GetPointDetails() {
      this.getCommonResourceById(this.curSelectResourcePoint.id)
        .then(res => {
          // 刷新楼层接口
          if (res && Number(res.code) === 0 && res.data) {
            this.setCurrentSelectResource(res.data)
          }
        })
        .catch(err => console.log(err))
    },
    // 获取环境平面图
    uploadSuccess(response, file, fileList) {
      // console.log(response, file, fileList)
      let curSelectResourcePoint = this.curSelectResourcePoint
      // 添加（修改）环境平面图需要传递的参数
      // console.log(file.name)
      // name string 非必须 名称
      // image string 非必须 图片路径
      // imageWidth number 非必须宽度
      // imageHeight number 非必须高度
      // orgId string 非必须机构id
      // keyPartId string 非必须重点部位id
      let resourceUrlType = {
        name: file.name,
        image: file.response.data.path,
        orgId: curSelectResourcePoint.orgId
      }
      if (curSelectResourcePoint.keyPartId) {
        resourceUrlType.keyPartId = curSelectResourcePoint.keyPartId
      }
      // console.log(resourceUrlType);
      // 已添加环境平面图
      if (curSelectResourcePoint.envImage) {
        // 获取主键id
        resourceUrlType.id = curSelectResourcePoint.envId
        // 修改环境平面图
        this.updateEnvironmental(resourceUrlType)
          .then(res => {
            if (!res.code) {
              this.setRefreshTreeList(true) // 刷新机构重点部位树
              const resource = curSelectResourcePoint
              // 1-GIS地图
              resource.envImageData.id = res.data.id
              resource.place = MAPTYPENUMBER.gis
              this.updateMapCommonResourcePoint(resource)
                .then(res => {
                  console.log(res)
                })
                .catch(err => console.log(err))
              this.GetPointDetails() // 获取点位详情方法
              this.$notify({
                message: '修改成功',
                type: 'success'
              })
              // 修改环境平面图名字
              // this.mapFileName = resourceUrlType.name
            } else {
              this.$notify({
                message: '修改失败',
                type: 'success'
              })
            }
            // 改变环境平面图
          })
          .catch(err => console.log(err))
      } else {
        // 未添加环境平面图
        // this.mapFileName = response.data.path
        // 环境平面图名字
        // 添加环境平面图
        this.addEnvironmental(resourceUrlType)
          .then(res => {
            if (!res.code) {
              this.setRefreshTreeList(true) // 刷新机构重点部位树
              const resource = curSelectResourcePoint
              // 1-GIS地图
              resource.envId = String(res.data.id)
              resource.place = MAPTYPENUMBER.gis
              this.updateMapCommonResourcePoint(resource)
                .then(res => {
                  if (Number(res.code) === 0) {
                    this.GetPointDetails() // 获取点位详情方法
                    this.$notify({
                      message: '添加成功',
                      type: 'success'
                    })
                  } else {
                    this.$notify({
                      message: '添加失败',
                      type: 'success'
                    })
                  }
                })
                .catch(err => console.log(err))
              // 修改环境平面图名字
              // this.mapFileName = resourceUrlType.name
            } else {
              this.$notify({
                message: '添加失败',
                type: 'success'
              })
            }
            // 改变环境平面图
          })
          .catch(err => console.log(err))
      }
    },
    // 批量删除环境平面图
    deletemapFileName(itemId) {
      this.$confirm('是否删除该环境平面图', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [itemId]
        this.deleteEnvironmental(ids)
          .then(res => {
            if (!res.code) {
              // 1-GIS地图
              const resource = cloneDeep(this.curSelectResourcePoint)
              resource.envId = '0'
              resource.place = MAPTYPENUMBER.gis
              // 修改点位接口
              this.updateMapCommonResourcePoint(resource)
                .then(res => {
                  if (Number(res.code) === 0) {
                    this.GetPointDetails() // 获取点位详情方法
                    this.setRefreshTreeList(true) // 刷新机构重点部位树
                    this.$notify({
                      message: '删除成功',
                      type: 'success'
                    })
                  }
                })
                .catch(err => console.log(err))
            } else {
              this.$notify({
                message: '删除失败',
                type: 'success'
              })
            }
          })
          .catch(err => console.log(err))
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 查看环境平面图 // 获取地图设备点位详情
    handEnvironmental(item) {
      let nowThis = this
      this.clearCurrentOperatePoint() // 清空当前操作的点位数据
      this.CLEAR_ALL_POINT_DATA() // 清空所有点位相关数据
      this.getCommonResourceById(item)
        .then(res => {
          if (res && Number(res.code) === 0 && res.data) {
            if (res.data.envImageData && res.data.envImageData.image) {
              this.setenvironmentalScienceInformation(res.data.envImageData)
              nowThis.UPDATE_OUTDOOR_LAYER_CONFIG({
                // 展示环境平面图
                key: 'url',
                value: res.data.envImageData.image
              })
              this.selectedFloor = item
              let data = {
                id: item,
                isFloor: false
              }
              this.setIsFloorMap(data)
              this.setIsMapOuter(2)
            }
          }
        })
        .catch(err => console.log(err))
    },
    // 添加楼层
    showAddFloor() {
      this.foorForm = {}
      this.floorsNameUrl = '' // 楼层图片url
      this.fileListClear = []
      this.fileListClear = [{ name: '', url: '' }]
      this.setShowFloorForm(true) // 楼层弹框展示
      this.idfooleidName = ''
      this.floorsImagesName = ''// 楼层图片名称
      // this.$refs.uploadfoor.clearFiles()
    },
    // 楼层图片上传成功公共接口
    uploadFoolsSuccess(response, file, fileList) {
      this.floorsNameUrl = response.data.path // 楼层图片url
      this.floorsImagesName = file.name // 楼层图片名称
    },
    // 楼层图片上传限制
    beforeAvatarUpload(file) {
      // console.log(file)
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$notify({
          message: '上传图片只能是 JPG 和 PNG 格式!',
          type: 'success'
        })
      }
      if (!isLt2M) {
        this.$notify({
          message: '上传图片大小不能超过 10MB!',
          type: 'success'
        })
      }
      // eslint-disable-next-line no-mixed-operators
      return isLt2M && isJPG || isPNG
    },
    //
    getImageWidthAndHeight(imageUrl, callback) {
      const img_url = imageUrl
      let img = new Image()
      img.src = img_url
      img.onload = function() {
        let img_width = img.width === 0 ? 0.00001 : img.width
        let img_height = img.height === 0 ? 0.00001 : img.height
        if (img_width / img_height > 2) {
          img_height = (img_height / img_width) * 180
          img_width = 180
        } else {
          img_width = (img_width / img_height) * 90
          img_height = 90
        }
        callback([-img_width, -img_height, img_width, img_height])
      }
    },
    // header 机构重点部位图片
    handleImgSuccess(response, file, fileList) {
      // 图片上传成功方法
      this.importForm.image = URL.createObjectURL(file.raw)
      this.importForm.image = response.data.path
      const resource = this.valData
      resource.image = response.data.path
      if (resource.envId) {
        resource.envId = String(resource.envId) // 环境id专字符串
      }
      this.updateMapCommonResourcePoint(resource)
        .then(res => {
          if (!res.code) {
            this.GetPointDetails() // 获取点位详情方法
            this.$notify({
              message: '上传成功',
              type: 'success'
            })
          }
        })
        .catch(err => console.log(err))
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    // 监听上传图片
    uploadFloorFile(data) {
      console.log(data)
      this.importForm.floors[data.Index].fileList = data.fileList
    },
    deleteFloor(Index) {
      // 删除楼层方法
      this.$confirm('是否删除该楼层', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [Index]
        this.deleteFloorAKey(ids)
          .then(res => {
            if (!res.code) {
              this.GetPointDetails() // 获取点位详情方法
              this.setRefreshTreeList(true) // 刷新机构重点部位树
              this.$notify({
                message: '删除成功',
                type: 'success'
              })
            }
          })
          .catch(err => console.log(err))
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加楼层
    pushFloor() {
      let curSelectResourcePoint = cloneDeep(this.curSelectResourcePoint)
      if (this.idfooleidName !== '' && this.floorsNameUrl !== '') {
        // 楼层名称不能为空
        if (curSelectResourcePoint.keyPartId) {
          this.foorForm.keyPartId = curSelectResourcePoint.keyPartId
        }
        this.foorForm.orgId = curSelectResourcePoint.orgId
        // 楼层名称索引
        this.foorForm.floorIndex = this.idfooleidName
        if (this.floorsNameUrl) {
          this.foorForm.image = this.floorsNameUrl // 楼层图片 url
          this.foorForm.name = this.floorsImagesName // 楼层图片名称
        }
        console.log(this.foorForm)
        if (this.foorForm.id) {
          // 修改楼层
          this.updateFloorAKey(this.foorForm)
            .then(suc => {
              if (suc.code === 0) {
                this.$notify({
                  message: '修改成功',
                  type: 'success'
                })
                this.GetPointDetails() // 获取点位详情方法
                this.setShowFloorForm(false) // 楼层弹框隐藏
                this.$forceUpdate()
              }
            })
            .catch(err => console.log(err))
        } else {
          // 添加楼层
          this.addFloorAKey(this.foorForm)
            .then(suc => {
              if (suc.code === 0) {
                this.$notify({
                  message: '添加成功',
                  type: 'success'
                })
                this.GetPointDetails() // 获取点位详情方法
                this.setShowFloorForm(false) // 楼层弹框隐藏
                this.$forceUpdate()
              }
            })
            .catch(err => console.log(err))
        }
      } else if (this.idfooleidName === '') {
        this.$notify({ title: '警告',
          message: '楼层名称不能为空',
          type: 'warning'})
      } else if (this.floorsNameUrl === '') {
        this.$notify({ title: '警告',
          message: '请上传图片后保存',
          type: 'warning'})
      }
    },
    // 编辑楼层
    elIconSettingEdit(item) {
      this.setShowFloorForm(true) // 楼层弹框隐藏
      this.foorForm = item
      this.idfooleidName = item.floorIndex
      this.floorsImagesName = item.name
      this.floorsNameUrl = this.image
    },
    // 展示楼层平面图
    floorsBatCicki(item, itmeId) {
      let nowThis = this
      this.clearCurrentOperatePoint() // 清空当前操作的点位数据
      this.getAllFloorAKey(itmeId)
        .then(suc => {
          if (!suc.code) {
            if (suc.data.image !== '') {
              // 查询点位详情加载楼层平面图
              this.getCommonResourceById(this.selectedTreeNode.point.id)
                .then(res => {
                  // 刷新楼层接口
                  if (res && Number(res.code) === 0 && res.data) {
                    this.setFloorList(res.data.floors) // 楼层列表
                  }
                })
                .catch(err => console.log(err))
              nowThis.UPDATE_INDOOR_LAYER_CONFIG({
                // 展示楼内平面图
                key: 'url',
                value: suc.data.image
              })
              this.BUILDING_DIRECTORY(true) // 楼层索引现因控制 机构重点部位树下面的
              this.selectedFloor = item
              let data = {
                id: item,
                isFloor: true
              }
              this.setIsFloorMap(data)
              this.setIsMapOuter(2)
              this.setindoorInformation({ id: itmeId }) // 存储楼层id
              this.setPanelInfoStatus(false) // 关闭点位信息面板
              this.setDrawActive({ active: false }) // 关闭绘制状态
            }
          }
        })
        .catch(err => console.log(err))
    },
    selectMiniImg(val) {
      if (this.importForm.shapeType !== val) {
        this.importForm.shapeType = val
        let curSelectResourcePoint = cloneDeep(this.curSelectResourcePoint)
        curSelectResourcePoint.shapeType = Number(val)
        curSelectResourcePoint.isPoint = true
        this.setCurrentSelectResource(curSelectResourcePoint)
        let pointDrawStyleType = DRAWSTYLETYPE.POINT // 点位绘制样式类型
        let geometryType = GEOMETRYTYPE.POINT // 点位几何形态
        if (val === SHAPETYPE.POINT) {
          // 点
          pointDrawStyleType = this.getPointDrawStyleType(
            this.curSelectResourcePoint.type,
            this.curSelectResourcePoint.subType
          )
          geometryType = GEOMETRYTYPE.POINT
        } else if (val === SHAPETYPE.LINESTRING) {
          // 线
          pointDrawStyleType = DRAWSTYLETYPE.LINESTRING
          geometryType = GEOMETRYTYPE.POLYLINE
        } else if (val === SHAPETYPE.POLYGON) {
          // 面
          pointDrawStyleType = DRAWSTYLETYPE.POLYGON
          geometryType = GEOMETRYTYPE.POLYGON
        }
        // 开启绘制
        this.setDrawActive({ active: true, type: geometryType, styleType: pointDrawStyleType })
      }
    },
    handleClickUpdateStyle() {
      // this.importForm.miniImgName = '自定义区域'
      this.isShowSpaceSettings = true
    },
    /**
     * 清除当前要素
     */
    clearCurrentFeature() {
      // RESOURCETYPE.importPart 重点部位
      if (this.valData.rType === RESOURCETYPE.importPart) {
        const featureArr = JSON.parse(JSON.stringify(this.importPartIcons))
        if (featureArr) {
          const id = this.valData.id || this.valData.id
          let importPartArr = featureArr.filter(item => item.attributes.id !== id)
          this.setPointIconFeatures({ type: 'importPart', features: importPartArr })
        }
      }
    },
    closeSetting() {
      this.isShowSpaceSettings = false
    },
    // 取消按钮
    cancel() {
      // 清空可视域结束
      this.clearCurrentOperatePoint() // 清空当前操作的点位数据
    },
    // 清空当前操作的点位数据
    clearCurrentOperatePoint() {
      // 清空可视域
      this.checkboxChange(false)
      this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
      this.setCurrentSelectResource(null) // 清空选中的点位资源数据
      this.setPanelInfoStatus(false) // 关闭点位信息面板
      this.setDrawActive({ active: false }) // 关闭点位绘制状态
      this.setEditActive(false) // 关闭点位编辑状态
    },
    updateResourceByDrawEnd(data) {
      let obj = cloneDeep(this.curSelectResourcePoint)
      obj.subType = Number(obj.subType)
      let {id, type, subType} = obj
      let pointTypeKey = type === DEVICETYPE.videoHost ? `${type}` : `${type}-${subType}`
      let pointTypeValue = pointTypeData[pointTypeKey]
      // console.log(`pointTypeKey: ${pointTypeKey}, pointTypeValue: ${pointTypeValue}`)
      if (pointTypeValue && this.$store.state.map2d.mapPoint[pointTypeValue + 'ResourceArr']) {
        let resourceArr = cloneDeep(this.$store.state.map2d.mapPoint[pointTypeValue + 'ResourceArr'])
        resourceArr = resourceArr.filter(item => { return item.id !== id }) // 资源数组过滤掉当前选中编辑数据id一致的数据（旧数据）
        resourceArr.push(data)
        this.setPointResourceByType({ type: pointTypeValue, arr: resourceArr })
      }
    },
    // 保存按钮
    submitSave(data, zoom) {
      this.setDrawActive({ actiove: false })
      let curSelectPoint = cloneDeep(this.valData)
      if (curSelectPoint.envId) {
        curSelectPoint.envId = String(curSelectPoint.envId) // 环境id专字符串
      }
      // 当前可见层级
      curSelectPoint.level = Math.ceil(this.visibleLevel)
      curSelectPoint.shapeType = Number(this.importForm.shapeType) // 缩略图形态
      // 保存摄像头可视域
      curSelectPoint.radiation = Number(this.pointData.radiation) // 半径
      curSelectPoint.viewshedAngle = Number(this.pointData.viewshedAngle) // 朝向
      curSelectPoint.viewshed = Number(this.pointData.viewshed) // 可视角度
      // if (curSelectPoint.type === DEVICETYPE.alarmDevice) {
      //   curSelectPoint = dataToMyDataObject_subTypeReverse(curSelectPoint, DEVICETYPE.alarmDevice)
      // }
      // gis区分 添加在什么类型的地图上 1-GIS地图 2-环境平面图 3-楼层平面图
      curSelectPoint.place = 1
      let endResult = { ...cloneDeep(this.curSelectResourcePoint), ...curSelectPoint }

      if (
        (curSelectPoint.coordinate.split(',').length === 2 && curSelectPoint.shapeType !== SHAPETYPE.POINT) ||
        (curSelectPoint.coordinate.split(',').length > 2 && curSelectPoint.shapeType === SHAPETYPE.POINT)
      ) {
        this.$notify({ title: '警告',
          message: '当前绘制未结束，请结束绘制再保存！',
          type: 'warning'})
        return
      }
      if (this.isSaveOver) {
        return
      }
      this.isSaveOver = true
      endResult.place = this.nowMapPlace
      endResult.place === MAPTYPENUMBER.lc && (endResult.floorId = this.indoorInformation.id) // 获取楼层id
      this.updateMapCommonResourcePoint(endResult) // 修改点位接口
        .then(res => {
          this.isSaveOver = false
          if (res.code === 0) {
            // 清空可视域
            this.checkboxChange(false)
            // 清空可视域结束
            // 更新资源数组
            this.updateResourceByDrawEnd(endResult)
            this.setRefreshTreeList(true) // 刷新机构重点部位树
            this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
            this.setCurrentSelectResource(null) // 清空选中的点位资源数据
            this.setPanelInfoStatus(false) // 关闭点位信息面板
            this.setDrawActive({ active: false }) // 关闭绘制状态
            this.$notify({
              message: '保存成功',
              type: 'success'
            })
          } else {
            this.$notify({
              message: '保存失败',
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log('保存点位失败：', err)
          this.$notify({ title: '警告',
            message: '当前绘制未结束，请结束绘制再保存！',
            type: 'warning'})
          this.isSaveOver = false
        })
    },
    /**
     * 点位对应的绘制样式类型数据
     * type 点位大类
     * subType 点位子类
     */
    getPointDrawStyleType(type, subType) {
      type = Number(type)
      subType = Number(subType)
      let iconType // 绘制图标类型
      if (type === DEVICETYPE.org) {
        // 机构
        // 机构* 1-总行、2-  一级分行、3- 二级分行、4- 直管行、5- 县级行
        if (subType === KEYPARTTYPE.headLevel) {
          iconType = 'headOfficeDraw'
        } else if (subType === KEYPARTTYPE.oneLevel) {
          iconType = 'tierOneBranchDraw'
        } else if (subType === KEYPARTTYPE.twoLevel) {
          iconType = 'secondLevelBranchDraw'
        } else if (subType === KEYPARTTYPE.countyLevel) {
          iconType = 'countyLevelDraw'
        } else if (subType === KEYPARTTYPE.directlyLevel) {
          iconType = 'directlyBranchDraw'
        }
      } else if (type === DEVICETYPE.keyPart) {
        // 重点部位类型
        if (subType === KEYPARTTYPEORG.businessOutlets) {
          // 营业网点
          iconType = 'businessOutletsDraw'
        } else if (subType === KEYPARTTYPEORG.vault) {
          // 金库
          iconType = 'vaultDraw'
        } else if (subType === KEYPARTTYPEORG.computerRoom) {
          // 计算机房
          iconType = 'computerRoomDraw'
        } else if (subType === KEYPARTTYPEORG.officeBuilding) {
          // 办公楼
          iconType = 'officeBuildingDraw'
        } else if (subType === KEYPARTTYPEORG.selfServiceBank) {
          // 自助银行
          iconType = 'selfServiceBankDraw'
        } else if (subType === KEYPARTTYPEORG.selfServiceEquipment) {
          // 自助设备
          iconType = 'selfServiceEquipmentDraw'
        } else if (subType === KEYPARTTYPEORG.selfServiceSilver) {
          // 自助银亭
          iconType = 'selfServiceSilverDraw'
        } else if (subType === KEYPARTTYPEORG.privateBank) {
          // 私人银行
          iconType = 'privateBankrDraw'
        } else if (subType === KEYPARTTYPEORG.safeDeposit) {
          // 保险箱库
          iconType = 'safeDepositDraw'
        } else if (subType === KEYPARTTYPEORG.archivesCenter) {
          // 档案室
          iconType = 'archivesCenterDraw'
        } else if (subType === KEYPARTTYPEORG.remoteControlCenter) {
          // 远程监控中心
          iconType = 'remoteControlCenterDraw'
        } else if (subType === KEYPARTTYPEORG.fiveGSmartBanking) {
          // 5G + 智能银行
          iconType = 'fiveGSmartBankingDraw'
        } else if (subType === KEYPARTTYPEORG.fortuneCenter) {
          // 财富中心
          iconType = 'fortuneCenterDraw'
        } else if (subType === KEYPARTTYPEORG.otherKeyParts) {
          // 其他重点部位
          iconType = 'otherKeyPartsDraw'
        } else if (subType === KEYPARTTYPEORG.xuni) {
          // 虚拟重点部位
          iconType = 'xuniDraw'
        }
      } else if (type === DEVICETYPE.alarmDevice) {
        // 报警设备
        let alarmType = EnglishNamePrefix[String(type)][String(subType)] // 获取报警类型
        iconType = alarmType + 'Draw'
      }
      return iconType
    },
    // 可视域复选框选中状态
    // 可视域复选框选中状态
    checkboxChange(val) {
      if (this.formData.sectorInfo) {
        this.disabled = !val
        this.setVideoEditSectorChecked(val)
        this.updateCurrentSector()
      }
    },
    /**
     * 初始化参数
     */
    initCurrentResource() {
      this.setDrawFeatureLoc(null) // 清除修改的位置信息
      this.setEditSector(null)
      if (this.curSelectResourcePoint) {
        const point = this.curSelectResourcePoint
        this.pointData.radiation = point['radiation'] === undefined ? 50 : point.radiation
        this.pointData.viewshed = point['viewshed'] === undefined ? 90 : point.viewshed
        this.pointData.viewshedAngle = point['viewshedAngle'] === undefined ? 0 : point.viewshedAngle
      }
      if (this.curSelectResourcePoint && this.curSelectResourcePoint.type === DEVICETYPE.video) {
        this.anglesInput(this.pointData.viewshed)
        this.rangeInput(this.pointData.viewshedAngle)
        this.radiusInput(this.pointData.radiation) // 放在第三位 --不然渲染半径不对，并且一跳一跳的
      }
    },
    /**
     * 保存当前修改的可视域参数
     */
    saveEditSector() {
      this.setEditSector({
        radiation: parseInt(this.pointData.radiation),
        viewshedAngle: parseInt(this.pointData.viewshedAngle),
        viewshed: parseInt(this.pointData.viewshed)
      })
    },
    /**
     * 编辑修改可视域
     * @param {*} radiation 可选,可视域半径
     * @param {*} viewshedAngle 可选,朝向角度
     * @param {*} viewshed 可选,可视域角度
     */
    updateCurrentSector(radiation, viewshedAngle, viewshed) {
      if (this.curSelectResourcePoint) {
        let video = JSON.parse(JSON.stringify(this.curSelectResourcePoint))
        // const type = this.matchVideoType(this.curSelectResourcePoint.monitype)
        const type = this.matchVideoType_self(Number(this.curSelectResourcePoint.subType))
        if (!this.sectorChecked && !this.isSector) {
          this.setVideoSectorFeatures({ type: type, features: [] })
          return
        }
        // let obj = this[type + 'Sectors']
        let sectorArr = this[type + 'Sectors'].filter(item => item.attributes.id !== video.id)
        // 修改可视域
        const loc = (this.drawFeatureLoc && this.drawFeatureLoc.join(',')) || (video.point && video.point.loc)

        const saveRadius = radiation === undefined ? this.pointData.radiation : radiation
        const saveAngle = viewshedAngle === undefined ? this.pointData.viewshedAngle : viewshedAngle
        const saveViewshed = viewshed === undefined ? this.pointData.viewshed : viewshed
        video.point = {
          ...video.point,
          loc: loc,
          radiation: parseInt(saveRadius),
          viewshedAngle: parseInt(saveAngle),
          viewshed: parseInt(saveViewshed)
        }

        let sectorFeature = videoTrans.transOneSectorFeature(video, this[type + 'SectorLayer'])
        // console.log('当前的坐标', sectorFeature.geom.points)
        sectorArr.push(sectorFeature)
        this.setVideoSectorFeatures({ type: type, features: sectorArr })
        // let that=this;
        // setTimeout(e=>{
        //    this.setVideoSectorFeatures({ type: type, features: [] })
        // },16000)
      }
    },
    matchVideoType_self(monitype) {
      const type = EnglishNamePrefix[String(DEVICETYPE.video)][String(monitype)] // 返回摄像机的对应 字符串
      return type
    },
    /**
     * 修改当前图标要素位置
     */
    updateIconLoc(loc) {
      if (this.curSelectResourcePoint && loc) {
        let video = JSON.parse(JSON.stringify(this.curSelectResourcePoint))
        const type = this.matchVideoType_self(Number(this.curSelectResourcePoint.subType))
        let icons = cloneDeep(this.$store.state.map2d.mapPoint[type + 'IconFeatures'])
        let IconArr = icons ? icons.filter(item => item.attributes.id !== video.id) : []
        // 修改地理坐标位置
        // video.point.loc = loc
        let iconFeature = videoTrans.transOneIconFeature(video, layerConfig[type + 'Layer'])
        IconArr.push(iconFeature)
        this.setPointIconFeatures({ type: type, features: IconArr })
      }
    },

    // 照射半径
    radiusInput(val) {
      this.setSvg(this.pointData.viewshed, val, 100)
      this.sectorChecked && this.updateCurrentSector()
      this.saveEditSector()
    },
    // 可视角度改变触发（执行在先）pointAngle
    anglesInput(val) {
      let svgMax = parseInt(val)
      let ringId = this.$refs.ringId

      this.setSvg(svgMax, this.pointData.radiation, 100)
      if (ringId === undefined) {
        return // 此处渲染的时候会报错
      }
      if (ringId.setAttribute) {
        ringId.setAttribute('transform', 'rotate(' + (135 - svgMax) + ', 100,100)')
      }
      this.pointAngle = -(parseInt(val) - 90) / 2
      ringId.setAttribute('transform', 'rotate(' + parseFloat(this.pointAngle) + ', 100,100)')

      this.sectorChecked && this.updateCurrentSector()
      this.saveEditSector()
    },
    // 朝向改变(点位)（执行在后）pointAngle pastPointAngle
    rangeInput(val) {
      let newVal = -val + this.pointAngle
      let ringIdMax = this.$refs.ringIdMax
      this.pastPointAngle = parseFloat(newVal) + parseFloat(this.pointData.viewshed) / 2
      // 获取g添加旋转属性
      if (ringIdMax === undefined) {
        return // 此处渲染的时候会报错
      }
      ringIdMax.setAttribute('transform', 'rotate(' + this.pastPointAngle + ', 100,100)')
      this.sectorChecked && this.updateCurrentSector()
      this.saveEditSector()
    },
    // 更新点位图标旋转角度
    updatePointIconRorateAngle(angle) {
      let point = cloneDeep(this.curSelectResourcePoint)
      point.viewshedAngle = Number(angle)
      let {type, subType} = point
      let pointTypeKey = type === DEVICETYPE.videoHost ? `${type}` : `${type}-${subType}`
      let pointTypeValue = pointTypeData[pointTypeKey]
      // console.log(`pointTypeKey: ${pointTypeKey}, pointTypeValue: ${pointTypeValue}`)
      if (pointTypeValue && this.$store.state.map2d.mapPoint[pointTypeValue + 'IconFeatures']) {
        let icons = cloneDeep(this.$store.state.map2d.mapPoint[pointTypeValue + 'IconFeatures'])
        icons = icons.filter(item => {
          return item.attributes.id !== point.id
        }) // 资源数组过滤掉当前选中编辑数据id一致的数据（旧数据）
        let feature = videoTrans.transOneIconFeature(point, layerConfig[pointTypeValue + 'Layer'])
        icons.push(feature)
        this.setPointIconFeatures({ type: pointTypeValue, features: icons })
      }
    },
    /**
     * @param {*} path 绘制扇形的div
     * @param {*} progress 可视域角度
     * @param {*} r 半径
     * @param {*} z 中心点坐标
     */
    setSvg(progress, r, z) {
      // path自定义属性 d
      let path = this.$refs.ring
      if (progress === 360) {
        console.log('渲染会有问题')
      }
      if (path === undefined) {
        return
      }
      path.setAttribute('transform', 'translate(' + z + ',' + z + ')')
      let degrees = progress
      let rad = degrees * (Math.PI / 180)
      let x = (Math.sin(rad) * r).toFixed(2)
      let y = -(Math.cos(rad) * r).toFixed(2)
      let lenghty = window.Number(degrees > 180)
      let descriptions = ['M', 0, 0, 'v', -r, 'A', r, r, 0, lenghty, 1, x, y, 'z']
      path.setAttribute('d', descriptions.join(' '))
    },
    checkPing(val) { // ping功能
      let data = {
        ipAddr: val
      }
      checkPingAPI(data).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          if (res.data.data.status === 1) {
            this.$notify({
              title: '成功',
              message: '连接成功',
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: '无法连接主机',
              type: 'error'
            })
          }
        } else {
          this.$notify({
            title: '失败',
            message: res.data.data.message,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.right-panel-info {
  height: 100%;
  padding-bottom: 132px;
  // padding-top: 6px;
  position: relative;
  // .panel-info-title,.organization-info,.panel-info-btn{
  //   padding: 0 6px;
  // }
  .panel-info-title {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    background-color: rgba(242, 242, 242, 0.6);
  }
  .organization-info {
    padding-bottom: 100px;
    .organization-image {
      height: 150px;
      width: 300px;
      border: 1px solid #f2f2f2;
      box-sizing: border-box;
      margin: 12px 0 13px 0;
      .avatar-uploader {
        width: 100%;
        height: 100%;
      }
      .avatar-uploader-icon {
        font-size: 30px;
        line-height: 150px;
        color: #8c939d;
      }
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  .organize-info-readonly,
  .organize-info-form,
  .organize-info-add {
    box-sizing: border-box;
    table {
      width: 300px;
      table-layout: fixed;
      td {
        &:first-child {
          background-color: #F5F5F5;
        }
        border: 1px solid #f2f2f2;
        background-color: #fff;
      }
    }
    td {
      &:first-child {
        width: 104px;
        text-align: left;
      }
      height: 33px;
      padding: 3px 4px 3px 12px;
      box-sizing: border-box;
      word-wrap: break-word;
    }
  }
  .panel-info-btn {
    width: 336px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    position: fixed;
    bottom: 0;
    right: 0;
    background-color: #FFF;
  }
  .upload-btn,
  .fileInput {
    display: table-cell;
  }
}
.AddfileFoorFrom {
    width: 100%;
    height: 44px;
    background: #F5F5F5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 0 10px;
    .fileInput {
      padding: 0 5px 0 5px;
    }
    .upload-btn {
      padding-right: 5px;
    }
}
</style>
<style scoped>
.avatar-uploader >>> .el-upload {
  width: 100%;
  height: 100%;
}
.organization-info {
  height: calc(100% - 46px);
}
.upload-btn >>> button {
  border-radius: 0 2px 2px 0;
}
.fileInput >>> input {
  border-radius: 2px 0 0 2px;
}
.el-icon-edit-btn {
  height: 16px;
  width: 16px;
  cursor: pointer;
  background: url('./../../../../../static/map2d/routePlan/button.png');
}
.header {
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  margin-bottom: 5px;
  position: relative;
}
.header-delete {
  position: absolute;
  right: 10px;
  top: 5px;
  cursor: pointer;
}
.header-close {
  position: absolute;
  right: 10px;
  top: 5px;
  cursor: pointer;
}
.header-delete:hover {
  color: #2d72d3;
}
</style>

<style lang="less" scoped>
.right-panel {
  height: 95%;
}
.panel-camera-box {
  width: 100%;
  padding-left: 12px;
  line-height: 30px;
}
.right-panel-info {
  position: relative;
  height: 100%;
  .el-icon-delete {
    float: right;
  }

  .camera-info-readonly,
  .camera-form-info {
    // border: 1px solid rgb(242,242,242);
    box-sizing: border-box;
    table {
      width: 100%;
    }
    td {
      &:first-child {
        width: 104px;
        text-align: left;
        background-color: #F5F5F5;
      }
      height: 33px;
      padding: 3px 4px 3px 12px;
      box-sizing: border-box;
      background-color: #fff;
      border: 1px solid #f2f2f2;
    }
  }
  .el-form-item {
    margin-bottom: 5px;
    border-bottom: 1px solid #f2f2f2;
  }
  // .panel-button {
  //   position: absolute;
  //   bottom: 0;
  // }
}
.panel-button {
  width: 300px;
  position: fixed;
  bottom: 0;
  right: 0;
  text-align: center;
  .el-button {
    margin-left: 30px;
  }
}
#panel-svg {
  margin-top: 10px;
  color: #000;
  text-align: center;
}
</style>
<style scoped>
.el-input >>> .el-input__inner {
  border: 1px solid transparent;
  box-sizing: border-box;
}
.el-input {
  width: 90%;
  outline: none;
}
.el-input-number {
  width: 90%;
  outline: none;
}
.el-checkbox >>> .el-checkbox__label {
  font-size: 12px;
  color: #000;
}
.el-form-item >>> .el-form-item__label {
  font-size: 12px;
  color: #000;
}
.tbName {
  max-width: 90px;
}
.tbValue {
  max-width: 200px;
}
.envImageDataClass {
  display:flex;
  background: #fff;
  border-radius: 2px;
  width: 181px;
  height: 35px;
}
.envImageDataClass p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
  line-height: 29px;
  width: 150px;
}
.envImageDataClass_icon {
  width: 34px;
  display: flex;
  align-items: center;
}
.imageClass_icon_delete {
  border-left: 1px solid rgb(225, 225, 225);
  margin-left: 7px;
  padding-left: 6px;
}
.showAddFloorClass{
  overflow:hidden;
  padding-left:10px;
  padding-right:10px;
  background:#2D71D3;
  color: #fff;
  cursor: pointer;
  width:89px;
  height:35px;
  display:flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
ul.floorListClass {
  width:299px;
  background:rgba(245,245,245,1);
  padding: 1px 0 1px;
}
ul.floorListClass li {
  margin: 10px 0 7px 0;
  height: 35px;
  display: flex;
}
.listFoorName {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  text-align: right;
  padding-right: 10px;
  width: 90px;
  padding: 0 14px 0 12px;
  line-height: 35px;
}
.listFoorImagesName{
  line-height: 35px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-items: center;
}
.listFoorImages {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 8px;
  border: 1px solid #E1E1E1;
  width: 199px;
  background: #fff;
  border-radius: 2px;
  padding-left: 10px;
}
 .listFoorImagesPut {
   display: flex;
   align-items: center;
 }
.smallImage_outFloor{
  background:rgba(245,245,245,1);
  padding: 8px 10px 5px 0px;
  width: 298px;
  margin: 10px 0;
}
</style>
