<template>
  <div class="table-result-box">
    <div class="collapses">
      <div class="collapse-item">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('videoChan')">视频通道管理<i :class="dropdownStatus.videoChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropdownStatus.videoChan" class="box-wrap" style="width:100%;">
          <div class="list-header" v-if="showOptIcon">
            <el-button size="mini" type="text" icon="el-icon-download" title="获取通道信息" @click="getResourceInfo(1)"></el-button>
            <el-button size="mini" type="text" icon="el-icon-circle-plus-outline" title="新增" @click="addOrEdit(1, 'add')"></el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" title="编辑" @click="addOrEdit(1, 'edit')"></el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" title="删除" @click="deleteResource(1)"></el-button>
            <el-button size="mini" type="text" icon="el-icon-refresh-right" title="刷新" @click="refresh(1)"></el-button>
          </div>
          <video-table :loading="loading1" type="video" :selection="showOptIcon" :columns="videoChanColumns" :tableData="videoChanTableData || []" @selectChange="selectChange"></video-table>
        </div>
      </div>
      <div class="collapse-item">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('audioChan')">音频通道管理<i :class="dropdownStatus.audioChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropdownStatus.audioChan" class="box-wrap" style="width:100%;">
          <div class="list-header" v-if="showOptIcon">
            <el-button size="mini" type="text" icon="el-icon-download" title="获取通道信息" @click="getResourceInfo(2)"></el-button>
            <el-button size="mini" type="text" icon="el-icon-circle-plus-outline" title="新增" @click="addOrEdit(2, 'add')"></el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" title="编辑" @click="addOrEdit(2, 'edit')"></el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" title="删除" @click="deleteResource(2)"></el-button>
            <el-button size="mini" type="text" icon="el-icon-refresh-right" title="刷新" @click="refresh(2)"></el-button>
          </div>
          <video-table :loading="loading2" type="audio" :selection="showOptIcon" :columns="audioChanColumns" :tableData="audioChanTableData || []" @selectChange="selectChange"></video-table>
        </div>
      </div>
      <div class="collapse-item">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('inputChan')">输入通道管理<i :class="dropdownStatus.inputChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropdownStatus.inputChan" class="box-wrap" style="width:100%;">
          <div class="list-header" v-if="showOptIcon">
            <el-button size="mini" type="text" icon="el-icon-download" title="获取通道信息" @click="getResourceInfo(3)"></el-button>
            <el-button size="mini" type="text" icon="el-icon-circle-plus-outline" title="新增" @click="addOrEdit(3, 'add')"></el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" title="编辑" @click="addOrEdit(3, 'edit')"></el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" title="删除" @click="deleteResource(3)"></el-button>
            <el-button size="mini" type="text" icon="el-icon-refresh-right" title="刷新" @click="refresh(3)"></el-button>
          </div>
          <video-table :loading="loading3" type="input" :selection="showOptIcon" :columns="inputChanColumns" :tableData="inputChanTableData || []" @selectChange="selectChange"></video-table>
        </div>
      </div>
      <div class="collapse-item">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('outputChan')">输出通道管理<i :class="dropdownStatus.outputChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropdownStatus.outputChan" class="box-wrap" style="width:100%;">
          <div class="list-header" v-if="showOptIcon">
            <el-button size="mini" type="text" icon="el-icon-download" title="获取通道信息" @click="getResourceInfo(4)"></el-button>
            <el-button size="mini" type="text" icon="el-icon-circle-plus-outline" title="新增" @click="addOrEdit(4, 'add')"></el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" title="编辑" @click="addOrEdit(4, 'edit')"></el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" title="删除" @click="deleteResource(4)"></el-button>
            <el-button size="mini" type="text" icon="el-icon-refresh-right" title="刷新" @click="refresh(4)"></el-button>
          </div>
          <video-table :loading="loading4" type="output" :selection="showOptIcon" :columns="outputChanColumns" :tableData="outputChanTableData || []" @selectChange="selectChange"></video-table>
        </div>
      </div>
    </div>
    <el-dialog title="视频通道配置" :visible.sync="dialogStatus.videoChanModal" :width="vnvr ? '800px' : '400px'" :close-on-click-modal="false" @closed="closeDialog(1)">
      <div :class="['content', vnvr ? 'vnvr' : '']">
        <el-form size="mini" label-width="120px" ref="videoChanModel" :model="videoChanModel" :rules="rulesVideoChannel">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="videoChanModel.name" placeholder="输入资源名称"></el-input>
          </el-form-item>
          <el-form-item label="资源类型" prop="class">
            <el-select style="width:100%" v-model="videoChanModel.class">
              <el-option v-for="item in resourceType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <template v-if="!vnvr">
            <el-form-item label="通道号" prop="serise">
              <el-input v-model="videoChanModel.serise" placeholder="输入通道号"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="品牌" prop="brand">
            <el-select style="width:100%" v-model="videoChanModel.brand" @change="changea(1)">
              <el-option v-for="item in resourceBrands" :key="item.value" :label="item.label" :value="item.value ? item.value : item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="型号" prop="modelNum">
            <el-select style="width:100%" v-model="videoChanModel.modelNum">
              <el-option v-for="item in resourceModels" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <template v-if="vnvr">
            <el-form-item label="接入服务器" prop="accessService">
              <el-select v-model="videoChanModel.accessService" :popper-append-to-body="false">
                <el-option
                  v-for="item in serverSelectData"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接入协议" prop="accessProtocol">
              <el-select v-model="videoChanModel.accessProtocol">
                <el-option v-for="item in protocols" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="传输协议" prop="protocol">
              <el-select v-model="videoChanModel.protocol">
                <el-option
                  v-for="item in transportProtocols"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="IP地址" prop="ip">
              <el-input v-model="videoChanModel.ip"></el-input>
            </el-form-item>
            <el-form-item label="控制端口" prop="cport">
              <el-input type="number" min="0" max="65535" v-model="videoChanModel.cport"></el-input>
            </el-form-item>
            <el-form-item label="数据端口" prop="dport">
              <el-input type="number" min="0" max="65535" v-model="videoChanModel.dport"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="videoChanModel.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="videoChanModel.password" type="password"></el-input>
            </el-form-item>
          </template>

          <el-form-item label="码流" prop="stream">
            <el-select style="width:100%" v-model="videoChanModel.stream">
              <el-option v-for="item in streams" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <template v-if="vnvr">
            <el-form-item label="通道号" :disabled="true" prop="serise">
              <el-input v-model="videoChanModel.serise" placeholder="输入通道号"></el-input>
            </el-form-item>
          </template>

          <el-form-item label="资产编码" prop="assetCode">
            <el-input v-model="videoChanModel.assetCode" placeholder="按行内编码规则输入"></el-input>
          </el-form-item>

          <template v-if="vnvr">
            <el-form-item label="序列号" prop="uniqueId">
              <el-input v-model="videoChanModel.uniqueId"></el-input>
            </el-form-item>
          </template>

        </el-form>
      </div>
      <div class="form-footer" slot="footer">
        <el-button type="primary" size="mini" style="margin-right:24px;" @click="optResorce(1, 'videoChanModel')">保存</el-button>
        <el-button size="mini" @click="dialogStatus.videoChanModal = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="音频通道配置" :visible.sync="dialogStatus.audioChanModal" width="400px" :close-on-click-modal="false" @closed="closeDialog(2)">
      <el-form size="mini" label-width="120px" :model="audioChanModel" ref="audioChanModel" :rules="rulesAudioChannel">
        <el-form-item label="所属设备" required>
          <el-input disabled v-model="deviceName"></el-input>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input placeholder="输入资源名称" v-model="audioChanModel.name"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="class">
          <el-select style="width:100%" v-model="audioChanModel.class">
            <el-option v-for="item in resourceAudioType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道号" prop="serise">
          <el-input placeholder="输入通道号" v-model="audioChanModel.serise"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-select style="width:100%" v-model="audioChanModel.brand" @change="changea(2)">
            <el-option v-for="item in resourceAudioBrands" :key="item.value" :label="item.label" :value="item.value ? item.value : item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="modelNum">
          <el-select style="width:100%" v-model="audioChanModel.modelNum">
            <el-option v-for="item in resourceAudioModels" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产编码" prop="assetCode">
          <el-input placeholder="按行内编码规则输入" v-model="audioChanModel.assetCode"></el-input>
        </el-form-item>
      </el-form>
      <div class="form-footer" slot="footer">
        <el-button type="primary" size="mini" style="margin-right:24px;" @click="optResorce(2, 'audioChanModel')">保存</el-button>
        <el-button size="mini" @click="dialogStatus.audioChanModal = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="输入通道配置" :visible.sync="dialogStatus.inputChanModal" width="400px" :close-on-click-modal="false" @closed="closeDialog(3)">
      <el-form size="mini" label-width="120px" ref="inputChanModel" :model="inputChanModel" :rules="rulesAlarmInputChannel">
        <el-form-item label="所属设备" required>
          <el-input disabled v-model="deviceName"></el-input>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input placeholder="输入资源名称" v-model="inputChanModel.name"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="class">
          <el-select style="width:100%" v-model="inputChanModel.class">
            <el-option v-for="item in resourceInputType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道号" prop="serise">
          <el-input placeholder="输入通道号" v-model="inputChanModel.serise"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-select style="width:100%" v-model="inputChanModel.brand" @change="changea(3)">
            <el-option v-for="item in resourceInputBrands" :key="item.value" :label="item.label" :value="item.value ? item.value : item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="modelNum">
          <el-select style="width:100%" v-model="inputChanModel.modelNum">
            <el-option v-for="item in resourceInputModels" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产编码" prop="assetCode">
          <el-input placeholder="按行内编码规则输入" v-model="inputChanModel.assetCode"></el-input>
        </el-form-item>
      </el-form>
      <div class="form-footer" slot="footer">
        <el-button type="primary" size="mini" style="margin-right:24px;" @click="optResorce(3, 'inputChanModel')">保存</el-button>
        <el-button size="mini" @click="dialogStatus.inputChanModal = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="输出通道配置" :visible.sync="dialogStatus.outputChanModal" width="400px" :close-on-click-modal="false" @closed="closeDialog(4)">
      <el-form size="mini" label-width="120px" ref="outputChanModel" :model="outputChanModel" :rules="rulesAlarmOutputChannel">
        <el-form-item label="所属设备" required>
          <el-input disabled v-model="deviceName"></el-input>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input placeholder="输入资源名称" v-model="outputChanModel.name"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="class">
          <el-select style="width:100%" v-model="outputChanModel.class">
            <el-option v-for="item in resourceOutputType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道号" prop="serise">
          <el-input placeholder="输入通道号" v-model="outputChanModel.serise"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-select style="width:100%" v-model="outputChanModel.brand" @change="changea(4)">
            <el-option v-for="item in resourceOutputBrands" :key="item.value" :label="item.label" :value="item.value ? item.value : item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="modelNum">
          <el-select style="width:100%" v-model="outputChanModel.modelNum">
            <el-option v-for="item in resourceOutputModels" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产编码" prop="assetCode">
          <el-input placeholder="按行内编码规则输入" v-model="outputChanModel.assetCode"></el-input>
        </el-form-item>
      </el-form>
      <div class="form-footer" slot="footer">
        <el-button type="primary" size="mini" style="margin-right:24px;" @click="optResorce(4, 'outputChanModel')">保存</el-button>
        <el-button size="mini" @click="dialogStatus.outputChanModal = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VideoTable from '../../../components/VideoTable'
import {
  addResourceApi,
  putResourceApi,
  getServersApi,
  deleteResourceApi,
  getResourceListApi,
  getDeviceInfoApi,
  getNvrChannelInfoApi
} from '@src/http/video/videoConfig.api.js'
import {
  RESOURCETYPEVIDEO,
  RESOURCEBRANDSVIDEO,
  RESOURCEMODELSVIDEO,
  STREAMVIDEO,
  TRANSPORTPROTOCOLS,
  TRANSPORTPROTOCOLSVIDEO,
  PROTOCOL,
  RESOURCETYPEAUDIO,
  RESOURCEBRANDSAUDIO,
  RESOURCEMODELSAUDIO,
  RESOURCETYPEVINPUT,
  RESOURCEBRANDSINPUT,
  RESOURCEMODELSINPUT,
  RESOURCETYPEOUTPUT,
  RESOURCEBRANDSOUTPUT,
  RESOURCEMODELSOUTPUT
} from '../../../components/selectConf'
import create from '@src/assets/rules/validation/security/video_channelmanage.js'
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
  name: 'TableResult',
  components: {
    VideoTable
  },
  props: {
    showOptIcon: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      required: true
    },
    devInfo: {
      type: Object
    },
    deviceName: {
      type: String,
      required: true
    },
    source: {
      type: String,
      default: 'other'
    },
    jumpType: {
      type: String
    },
    deviceData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      //
      // 校验
      rulesVideoChannel: create.videoChannel, // 表单校验
      rulesAudioChannel: create.audioChannel, // 表单校验
      rulesAlarmInputChannel: create.alarmInputChannel, // 表单校验
      rulesAlarmOutputChannel: create.alarmOutputChannel, // 表单校验
      //
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      idCopy: this.id,
      // video
      resourceType: RESOURCETYPEVIDEO, // 资源类型
      resourceBrands: RESOURCEBRANDSVIDEO, // 资源品牌
      streams: STREAMVIDEO, // 码流信息
      transportProtocols: TRANSPORTPROTOCOLS,
      protocols: PROTOCOL,
      // audio
      resourceAudioType: RESOURCETYPEAUDIO, // 资源类型
      resourceAudioBrands: RESOURCEBRANDSAUDIO, // 资源品牌
      // input
      resourceInputType: RESOURCETYPEVINPUT, // 资源类型
      resourceInputBrands: RESOURCEBRANDSINPUT, // 资源品牌
      // output
      resourceOutputType: RESOURCETYPEOUTPUT, // 资源类型
      resourceOutputBrands: RESOURCEBRANDSOUTPUT, // 资源品牌
      dropdownStatus: {
        videoChan: true,
        audioChan: true,
        inputChan: true,
        outputChan: true
      },
      dialogStatus: {
        videoChanModal: false,
        audioChanModal: false,
        inputChanModal: false,
        outputChanModal: false
      },
      videoChanColumns: [
        // { prop: 'deviceName', label: '所属设备', width: '' },
        { prop: 'name', label: '资源名称', width: '' },
        { prop: 'class', label: '资源类型', width: '' },
        { prop: 'serise', label: '通道号', width: '' },
        { prop: 'ip', label: 'IP', width: '' },
        { prop: 'cport', label: '控制端口', width: '' },
        { prop: 'dport', label: '数据端口', width: '' },
        { prop: 'stream', label: '码流', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' }
        // { prop: 'uniqueId', label: '序列号', width: '' },
        // { prop: 'status', label: '状态', width: '' }
      ],
      videoChanTableData: [],
      videoTotal: 0,
      paginationConfig: {
        limit: 200,
        page: 1
      },
      videoOpt: '',
      videoChanSelectData: [],
      audioChanColumns: [
        { prop: 'name', label: '资源名称', width: '' },
        { prop: 'class', label: '资源类型', width: '' },
        { prop: 'serise', label: '通道号', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' }
      ],
      audioChanTableData: [],
      audioTotal: 0,
      audioOpt: '',
      audioChanSelectData: [],
      inputChanColumns: [
        { prop: 'name', label: '资源名称', width: '' },
        { prop: 'class', label: '资源类型', width: '' },
        { prop: 'serise', label: '通道号', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' }
      ],
      inputChanTableData: [],
      inputTotal: 0,
      inputOpt: '',
      inputChanSelectData: [],
      outputChanColumns: [
        { prop: 'name', label: '资源名称', width: '' },
        { prop: 'class', label: '资源类型', width: '' },
        { prop: 'serise', label: '通道号', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' }
      ],
      outputChanTableData: [],
      outputTotal: 0,
      outputOpt: '',
      outputChanSelectData: [],
      videoDiagnoseColumns: [
        { prop: '', label: '', width: '' },
        { prop: '', label: '镜头移位', width: '' },
        { prop: '', label: '视频遮挡', width: '' },
        { prop: '', label: '清晰度异常', width: '' },
        { prop: '', label: '亮度异常', width: '' },
        { prop: '', label: '信号缺失', width: '' },
        { prop: '', label: '画面冻结', width: '' },
        { prop: '', label: '噪声检测', width: '' },
        { prop: '', label: '偏色检测', width: '' }
      ],
      videoDiagnoseTableData: [],
      videoChanModel: {
        type: 1,
        subSystem: 1,
        deviceId: this.idCopy || this.id,
        orgId: this.devInfo.orgId,
        keyPartId: this.devInfo.keyPartId,
        keyPartType: this.devInfo.keyPartType,
        name: '',
        class: '',
        serise: '',
        brand: '',
        modelNum: '',
        stream: '',
        assetCode: ''
      },
      audioChanModel: {
        type: 2,
        subSystem: 1,
        deviceId: this.idCopy || this.id,
        orgId: this.devInfo.orgId,
        keyPartId: this.devInfo.keyPartId,
        keyPartType: this.devInfo.keyPartType,
        name: '',
        class: '',
        serise: '',
        brand: '',
        modelNum: '',
        assetCode: ''
      },
      inputChanModel: {
        type: 3,
        subSystem: 1,
        deviceId: this.idCopy || this.id,
        orgId: this.devInfo.orgId,
        keyPartId: this.devInfo.keyPartId,
        keyPartType: this.devInfo.keyPartType,
        name: '',
        class: 1,
        serise: '',
        brand: '',
        modelNum: '',
        assetCode: ''
      },
      outputChanModel: {
        type: 4,
        subSystem: 1,
        deviceId: this.idCopy || this.id,
        orgId: this.devInfo.orgId,
        keyPartId: this.devInfo.keyPartId,
        keyPartType: this.devInfo.keyPartType,
        name: '',
        class: 1,
        serise: '',
        brand: '',
        modelNum: '',
        assetCode: ''
      },
      changeChannels: {
        analogNumber: '',
        digitalNumber: '',
        audioNumber: '',
        inputNumber: '',
        outputNumber: ''
      },
      // accessProtocol: TRANSPORTPROTOCOLS,
      serverSelectData: [],
      flagVideo: {}
    }
  },
  created() {
    this.flagVideo = {...this.videoChanModal}
    this.setFalgVideo()
    console.log('tabelresult', this.showOptIcon, this.id, this.devInfo, this.deviceName, this.source, this.jumpType, this.deviceData)
    let { analogNumber, digitalNumber, audioNumber, inputNumber, outputNumber } = this.deviceData
    this.changeChannels = { analogNumber, digitalNumber, audioNumber, inputNumber, outputNumber }
    if (this.idCopy) {
      getDeviceInfoApi(this.idCopy).then(res => {
        if (res.data.code === 0) {
          this.videoChanTableData = res.data.data.cameras ? this.doubleMeaning(res.data.data.cameras, 'video') : []
          this.audioChanTableData = res.data.data.audios ? this.doubleMeaning(res.data.data.audios, 'audio') : []
          this.inputChanTableData = res.data.data.inputs ? this.doubleMeaning(res.data.data.inputs, 'input') : []
          this.outputChanTableData = res.data.data.outputs ? this.doubleMeaning(res.data.data.outputs, 'output') : []
        }
      })
    }
    this.getServerData()
  },
  watch: {
    id(nv) {
      this.idCopy = nv
      this.videoChanModel.deviceId = nv
      this.inputChanModel.deviceId = nv
      this.audioChanModel.deviceId = nv
      this.outputChanModel.deviceId = nv
      getDeviceInfoApi(this.idCopy).then(res => {
        if (res.data.code === 0) {
          this.videoChanTableData = res.data.data.cameras ? this.doubleMeaning(res.data.data.cameras, 'video') : []
          this.audioChanTableData = res.data.data.audios ? this.doubleMeaning(res.data.data.audios, 'audio') : []
          this.inputChanTableData = res.data.data.inputs ? this.doubleMeaning(res.data.data.inputs, 'input') : []
          this.outputChanTableData = res.data.data.outputs ? this.doubleMeaning(res.data.data.outputs, 'output') : []
        }
      })
    },
    devInfo: {
      handler(nv) {
        if (!nv) {
          return
        }
        this.videoChanModel.orgId = nv.orgId
        this.videoChanModel.keyPartId = nv.keyPartId
        this.videoChanModel.keyPartType = nv.keyPartType
        this.inputChanModel.orgId = nv.orgId
        this.inputChanModel.keyPartId = nv.keyPartId
        this.inputChanModel.keyPartType = nv.keyPartType
        this.audioChanModel.orgId = nv.orgId
        this.audioChanModel.keyPartId = nv.keyPartId
        this.audioChanModel.keyPartType = nv.keyPartType
        this.outputChanModel.orgId = nv.orgId
        this.outputChanModel.keyPartId = nv.keyPartId
        this.outputChanModel.keyPartType = nv.keyPartType
      },
      immediate: true
    },
    vnvr() {
      this.setFalgVideo()
    }
  },
  computed: {
    vnvr() {
      if (typeof (this.deviceData.type) === 'number') {
        if ([5].some(i => i === this.deviceData.type)) {
          return true
        } else {
          return false
        }
      } else {
        if (['Vnvr'].some(i => i === this.deviceData.type)) {
          return true
        } else {
          return false
        }
      }
    },
    resourceModels() {
      let curType = this.resourceBrands.find(i => (i.value || i.label) === this.videoChanModel.brand)
      let type = curType && curType.label
      return RESOURCEMODELSVIDEO[type] || []
    },
    resourceAudioModels() {
      console.log(this.resourceAudioBrands)
      console.log(RESOURCEMODELSAUDIO)
      let curType = this.resourceAudioBrands.find(i => (i.value || i.label) === this.audioChanModel.brand)
      let type = curType && curType.label
      return RESOURCEMODELSAUDIO[type] || []
    },
    resourceInputModels() {
      let curType = this.resourceInputBrands.find(i => (i.value || i.label) === this.inputChanModel.brand)
      let type = curType && curType.label
      return RESOURCEMODELSINPUT[type] || []
    },
    resourceOutputModels() {
      let curType = this.resourceOutputBrands.find(i => (i.value || i.label) === this.outputChanModel.brand)
      let type = curType && curType.label
      return RESOURCEMODELSOUTPUT[type] || []
    }
  },
  methods: {
    setFalgVideo() {
      if (this.vnvr) {
        let obj = {accessService: '', accessProtocol: 'SDK', protocol: 1, ip: '', cport: '', dport: '', username: '', password: '', uniqueId: ''}
        obj['serise'] = 1
        this.videoChanModal = Object.assign(this.flagVideo, obj)
      } else {
        this.videoChanModal = {...this.flagVideo}
      }
    },
    doubleMeaning(datas = {}, type) {
      let data = JSON.parse(JSON.stringify(datas))
        console.log(data, type)
      if(Object.prototype.toString.call(data) === '[object Array]') {
        return data.length ? data.map(item => {
          return this.doubleMeaning(item, type)
        }) : []
      } else if(Object.prototype.toString.call(data) === '[object Object]') {
        let obj = {}
        console.log(data, type)
        if (type === 'video') {
          for (let i in data) {
            if (i === 'class') {
              // console.log(i, data[i], DEVICETYPE)
              if (RESOURCETYPEVIDEO.some(j => j.value === data[i])) {
                obj[i] = RESOURCETYPEVIDEO.filter(j => j.value === data[i])[0].label
              }
            } else if (i === 'brand') {
              // console.log(i, data[i], BRANDS)
              if (RESOURCEBRANDSVIDEO.some(j => j.value === data[i])) {
                obj[i] = RESOURCEBRANDSVIDEO.filter(j => j.value === data[i])[0].label
              }
            } else if (i === 'stream') {
              // console.log(i, data[i], TRANSPORTPROTOCOLS)
              if (STREAMVIDEO.some(j => j.value === data[i])) {
                obj[i] = STREAMVIDEO.filter(j => j.value === data[i])[0].label
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
        if (type === 'audio') {
          for (let i in data) {
            if (i === 'class') {
              // console.log(i, data[i], DEVICETYPE)
              if (RESOURCETYPEAUDIO.some(j => j.value === data[i])) {
                obj[i] = RESOURCETYPEAUDIO.filter(j => j.value === data[i])[0].label
              }
            } else if (i === 'brand') {
              // console.log(i, data[i], BRANDS)
              if (RESOURCEBRANDSAUDIO.some(j => j.value === data[i])) {
                obj[i] = RESOURCEBRANDSAUDIO.filter(j => j.value === data[i])[0].label
              }
            }
          }
        }
        if (type === 'input') {
          for (let i in data) {
            if (i === 'class') {
              // console.log(i, data[i], DEVICETYPE)
              if (RESOURCETYPEVINPUT.some(j => j.value === data[i])) {
                obj[i] = RESOURCETYPEVINPUT.filter(j => j.value === data[i])[0].label
              }
            } else if (i === 'brand') {
              // console.log(i, data[i], BRANDS)
              if (RESOURCEBRANDSINPUT.some(j => j.value === data[i])) {
                obj[i] = RESOURCEBRANDSINPUT.filter(j => j.value === data[i])[0].label
              }
            }
          }
        }
        if (type === 'output') {
          for (let i in data) {
            if (i === 'class') {
              // console.log(i, data[i], DEVICETYPE)
              if (RESOURCETYPEOUTPUT.some(j => j.value === data[i])) {
                obj[i] = RESOURCETYPEOUTPUT.filter(j => j.value === data[i])[0].label
              }
            } else if (i === 'brand') {
              // console.log(i, data[i], BRANDS)
              if (RESOURCEBRANDSOUTPUT.some(j => j.value === data[i])) {
                obj[i] = RESOURCEBRANDSOUTPUT.filter(j => j.value === data[i])[0].label
              }
            }
          }
        }
        return Object.assign(data, obj)
      }
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
    getResourceInfo(num) {
      this['loading' + num] = true
      getNvrChannelInfoApi({
        hostId: this.idCopy,
        type: 2
      })
        .then(res => {
          if (res.data.code === 0) {
            if (res.data.data) {
              getDeviceInfoApi(this.idCopy).then(res => {
                if (res.data.code === 0) {
                  if (num === 1) {
                    this.videoChanTableData = res.data.data.cameras ? this.doubleMeaning(res.data.data.cameras, 'video') : []
                    this.videoChanTableData = this.doubleMeaning(res.data.data.cameras, 'video') || []
                    // this.videoChanTableData = res.data.data.cameras || []
                  } else if (num === 2) {
                    this.audioChanTableData = res.data.data.audios ? this.doubleMeaning(res.data.data.audios, 'audio') : []
                    this.audioChanTableData = this.doubleMeaning(res.data.data.audios, 'audio') || []
                    // this.audioChanTableData = res.data.data.audios || []
                  } else if (num === 3) {
                    this.inputChanTableData = res.data.data.inputs ? this.doubleMeaning(res.data.data.inputs, 'input') : []
                    this.inputChanTableData = this.doubleMeaning(res.data.data.inputs, 'input') || []
                    // this.inputChanTableData = res.data.data.inputs || []
                  } else if (num === 4) {
                    this.outputChanTableData = res.data.data.outputs ? this.doubleMeaning(res.data.data.outputs, 'output') : []
                    this.outputChanTableData = this.doubleMeaning(res.data.data.outputs, 'output') || []
                    // this.outputChanTableData = res.data.data.outputs || []
                  }
                }
              })
            }
          } else {
            throw res.data.message
          }
        }).then(_ => {
          let timer = setTimeout(() => {
            this['loading' + num] = false
          }, 1000)
          this.$once('hook:beforeDestroy', _ => clearTimeout(timer))
        })
        .catch(err => {
          let timer = setTimeout(() => {
            this['loading' + num] = false
          }, 1000)
          this.$once('hook:beforeDestroy', _ => clearTimeout(timer))
          this.$notify({
            title: NOTIFY.TITLE.ERROR,
            message: err || '通道获取失败',
            type: NOTIFY.TYPE.ERROR
          })
        })
    },
    changea(val) {
      if (val == 1) {
        this.videoChanModel.modelNum = ''
      } else if (val == 2) {
        this.audioChanModel.modelNum = ''
      } else if (val == 3) {
        this.inputChanModel.modelNum = ''
      } else if (val == 4) {
        this.outputChanModel.modelNum = ''
      }
    },
    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },
    optResorce(index, ref) {
      this.$refs[ref].validate(valid => {
        if (valid) {
          if (index === 1) {
            this.videoOpt === 'add' ? this.addResource(index) : this.editResouce(index)
          } else if (index === 2) {
            this.audioOpt === 'add' ? this.addResource(index) : this.editResouce(index)
          } else if (index === 3) {
            this.inputOpt === 'add' ? this.addResource(index) : this.editResouce(index)
          } else if (index === 4) {
            this.outputOpt === 'add' ? this.addResource(index) : this.editResouce(index)
          }
        } else {
          return false
        }
      })
    },
    addResource(index) {
      let sendData =
        index === 1
          ? this.videoChanModel
          : index === 2
            ? this.audioChanModel
            : index === 3
              ? this.inputChanModel
              : index === 4
                ? this.outputChanModel
                : ''
      sendData.serise = Number(sendData.serise)
      if (index === 1) {
        sendData.cport = Number(sendData.cport)
        sendData.dport = Number(sendData.dport)
      }
      addResourceApi(sendData)
        .then(res => {
          if (res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '添加资源信息成功!',
              type: 'success'
            })
            this.closeDialog(index)

            // this.refresh(index)
          } else {
            this.$notify({
              title: NOTIFY.TITLE.ERROR,
              message: res.data.message,
              type: NOTIFY.TYPE.ERROR
            })
          }
        })
        .then(_ => {
          setTimeout(_ => {
            this.refresh(index)
          }, 2000)
        })
        .catch(err => {
          this.$notify({
            title: NOTIFY.TITLE.ERROR,
            message: err,
            type: NOTIFY.TYPE.ERROR
          })
        })
    },
    editResouce(index) {
      let sendData =
        index === 1
          ? this.videoChanModel
          : index === 2
            ? this.audioChanModel
            : index === 3
              ? this.inputChanModel
              : index === 4
                ? this.outputChanModel
                : ''
      let id = sendData.id
      delete sendData.id
      putResourceApi(id, sendData)
        .then(res => {
          if (res.data.code === 0) {
            this.$notify({
              title: NOTIFY.TITLE.SUCCESS,
              message: '编辑资源信息成功',
              type: NOTIFY.TYPE.SUCCESS
            })
            this.closeDialog(index)
            // this.refresh(index)
          } else {
            this.$notify({
              title: NOTIFY.TITLE.ERROR,
              message: res.data.message,
              type: NOTIFY.TYPE.ERROR
            })
          }
        })
        .then(_ => {
          setTimeout(_ => {
            this.refresh(index)
          }, 2000)
        })
        .catch(err => {
          this.$notify({
            title: NOTIFY.TITLE.ERROR,
            message: err,
            type: NOTIFY.TYPE.ERROR
          })
        })
    },
    deleteResource(index) {
      let sendData =
        index === 1
          ? this.videoChanSelectData
          : index === 2
            ? this.audioChanSelectData
            : index === 3
              ? this.inputChanSelectData
              : index === 4
                ? this.outputChanSelectData
                : ''
      let idsData = sendData.map(item => {
        return item.id
      })
      if (!sendData.length) {
        this.$notify({
          title: '',
          message: '请勾选删除项!',
          type: 'warning'
        })
        return false
      }
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          deleteResourceApi({
            ids: idsData
          })
            .then(res => {
              if (res.data.code === 0) {
                this.$notify({
                  title: NOTIFY.TITLE.SUCCESS,
                  message: '删除资源成功',
                  type: NOTIFY.TYPE.SUCCESS
                })
              } else {
                this.$notify({
                  title: NOTIFY.TITLE.ERROR,
                  message: res.data.message,
                  type: NOTIFY.TYPE.ERROR
                })
              }
            })
            .catch(err => {
              this.$notify({
                title: NOTIFY.TITLE.ERROR,
                message: err,
                type: NOTIFY.TYPE.ERROR
              })
            })
        })
        .then(() => {})
        .then(_ => {
          setTimeout(_ => {
            this.refresh(index)
          }, 2000)
        })
        .catch(() => {
          this.$notify({
            title: NOTIFY.TITLE.WARNING,
            message: '已取消删除',
            type: NOTIFY.TYPE.WARNING
          })
        })
    },
    refresh(index) {
      let params = {
        type: index,
        page: this.paginationConfig.page,
        limit: this.paginationConfig.limit,
        deviceId: this.idCopy
      }
      this.resourceList(params, index)
    },
    resourceList(params, index) {
      // 请求通道列表
      getResourceListApi(params)
        .then(res => {
          if (res.data.code === 0) {
            this.$notify({
              title: NOTIFY.TITLE.SUCCESS,
              message: '获取资源列表成功',
              type: NOTIFY.TYPE.SUCCESS
            })
            this.setTableData(res.data.data, index)
          } else {
            this.$notify({
              title: NOTIFY.TITLE.ERROR,
              message: res.data.message,
              type: NOTIFY.TYPE.ERROR
            })
          }
        })
        .catch(err => {
          this.$notify({
            title: NOTIFY.TITLE.ERROR,
            message: err,
            type: NOTIFY.TYPE.ERROR
          })
        })
    },
    setTableData(data, index) {
      data.channels &&
        data.channels.forEach(item => {
          item.deviceName = this.deviceName
        })
      if (index === 1) {
        this.videoChanTableData = data.channels ? this.doubleMeaning(data.channels, 'video') : []
        // this.videoChanTableData = data.channels || []/////
        this.videoTotal = data.count.total
      } else if (index === 2) {
        this.audioChanTableData = data.channels ? this.doubleMeaning(data.channels, 'audio') : []
        // this.audioChanTableData = data.channels || []
        this.audioTotal = data.count.total
      } else if (index === 3) {
        this.inputChanTableData = data.channels ? this.doubleMeaning(data.channels, 'input') : []
        // this.inputChanTableData = data.channels || []/
        this.inputTotal = data.count.total
      } else if (index === 4) {
        this.outputChanTableData = data.channels ? this.doubleMeaning(data.channels, 'output') : []
        // this.outputChanTableData = data.channels || []
        this.outputTotal = data.count.total
      }
    },
    addOrEdit(index, type) {
      let {analogNumber, digitalNumber, audioNumber, inputNumber, outputNumber} = this.changeChannels
      let {videoChanTableData, audioChanTableData, inputChanTableData, outputChanTableData} = this
      if (type === 'add') {
        console.log(this.vnvr)
        if (this.vnvr) {
          if (index === 1) {
            this.dialogStatus.videoChanModal = true
            this.videoOpt = type
          } else if (index === 2) {
            this.dialogStatus.audioChanModal = true
            this.audioOpt = type
          } else if (index === 3) {
            this.dialogStatus.inputChanModal = true
            this.inputOpt = type
          } else if (index === 4) {
            this.dialogStatus.outputChanModal = true
            this.outputOpt = type
          }
        } else {
          if (index === 1) {
            let length = (analogNumber * 1) + (digitalNumber * 1)
            if (videoChanTableData.length < length) {
              this.dialogStatus.videoChanModal = true
              this.videoOpt = type
            } else {
              this.$notify({
                title: '',
                message: '视频通道新增已达上限',
                type: NOTIFY.TYPE.WARNING
              })
            }
          } else if (index === 2) {
            let length = (audioNumber * 1)
            if (audioChanTableData.length < length) {
              this.dialogStatus.audioChanModal = true
              this.audioOpt = type
            } else {
              this.$notify({
                title: '',
                message: '音频通道新增已达上限',
                type: NOTIFY.TYPE.WARNING
              })
            }
          } else if (index === 3) {
            let length = (inputNumber * 1)
            if (inputChanTableData.length < length) {
              this.dialogStatus.inputChanModal = true
              this.inputOpt = type
            } else {
              this.$notify({
                title: '',
                message: '输入通道新增已达上限',
                type: NOTIFY.TYPE.WARNING
              })
            }
          } else if (index === 4) {
            let length = (outputNumber * 1)
            if (outputChanTableData.length < length) {
              this.dialogStatus.outputChanModal = true
              this.outputOpt = type
            } else {
              this.$notify({
                title: '',
                message: '输出通道新增已达上限',
                type: NOTIFY.TYPE.WARNING
              })
            }
          }
        }
      } else if (type === 'edit') {
        if (index === 1) {
          if (this.videoChanSelectData.length !== 1) {
            this.$notify({
              title: '',
              message: '请选择一条视频通道编辑',
              type: NOTIFY.TYPE.WARNING
            })
            return false
          }
          this.dialogStatus.videoChanModal = true
          this.videoChanModel = this.$lodash.cloneDeep(this.videoChanSelectData[0])
          this.videoOpt = type
        } else if (index === 2) {
          if (this.audioChanSelectData.length !== 1) {
            this.$notify({
              title: '',
              message: '请选择一条音频通道编辑',
              type: NOTIFY.TYPE.WARNING
            })
            return false
          }
          this.dialogStatus.audioChanModal = true
          this.audioChanModel = this.$lodash.cloneDeep(this.audioChanSelectData[0])
          this.audioOpt = type
        } else if (index === 3) {
          if (this.inputChanSelectData.length !== 1) {
            this.$notify({
              title: '',
              message: '请选择一条输入通道编辑',
              type: NOTIFY.TYPE.WARNING
            })
            return false
          }
          this.dialogStatus.inputChanModal = true
          this.inputChanModel = this.$lodash.cloneDeep(this.inputChanSelectData[0])
          this.inputOpt = type
        } else if (index === 4) {
          if (this.outputChanSelectData.length !== 1) {
            this.$notify({
              title: '',
              message: '请选择一条输出通道编辑',
              type: NOTIFY.TYPE.WARNING
            })
            return false
          }
          this.dialogStatus.outputChanModal = true
          this.outputChanModel = this.$lodash.cloneDeep(this.outputChanSelectData[0])
          this.outputOpt = type
        }
      }
      // if (index === 1) {
      //   if (type === 'add') {
      //     this.dialogStatus.videoChanModal = true
      //     this.videoOpt = type
      //   } else {
      //     if (this.videoChanSelectData.length === 1) {
      //       this.dialogStatus.videoChanModal = true
      //       this.videoChanModel = this.$lodash.cloneDeep(this.videoChanSelectData[0])
      //       this.videoOpt = type
      //     }
      //   }
      // } else if (index === 2) {
      //   if (type === 'add') {
      //     this.dialogStatus.audioChanModal = true
      //     this.audioOpt = type
      //   } else {
      //     if (this.audioChanSelectData.length === 1) {
      //       this.dialogStatus.audioChanModal = true
      //       this.audioChanModel = this.$lodash.cloneDeep(this.audioChanSelectData[0])
      //       this.audioOpt = type
      //     }
      //   }
      // } else if (index === 3) {
      //   if (type === 'add') {
      //     this.dialogStatus.inputChanModal = true
      //     this.inputOpt = type
      //   } else {
      //     if (this.inputChanSelectData.length === 1) {
      //       this.dialogStatus.inputChanModal = true
      //       this.inputChanModel = this.$lodash.cloneDeep(this.inputChanSelectData[0])
      //       this.inputOpt = type
      //     }
      //   }
      // } else if (index === 4) {
      //   if (type === 'add') {
      //     this.dialogStatus.outputChanModal = true
      //     this.outputOpt = type
      //   } else {
      //     if (this.outputChanSelectData.length === 1) {
      //       this.dialogStatus.outputChanModal = true
      //       this.outputChanModel = this.$lodash.cloneDeep(this.outputChanSelectData[0])
      //       this.outputOpt = type
      //     }
      //   }
      // }
    },
    closeDialog(index) {
      if (index === 1) {
        // 重置对应的面板
        this.$refs['videoChanModel'].resetFields()
        //
        this.dialogStatus.videoChanModal = false
        this.videoChanModel = {
          type: 1,
          subSystem: 1,
          deviceId: this.idCopy,
          orgId: this.devInfo.orgId,
          keyPartId: this.devInfo.keyPartId,
          keyPartType: this.devInfo.keyPartType,
          name: '',
          class: '',
          serise: '',
          brand: '',
          modelNum: '',
          stream: '',
          assetCode: ''
          // accessProtocol: '',
          // protocol: '',
          // ip: '',
          // cport: '',
          // dport: '',
          // username: '',
          // password: '',
        }
        this.setFalgVideo()
      } else if (index === 2) {
        // 重置对应的面板
        this.$refs['audioChanModel'].resetFields()
        //
        this.dialogStatus.audioChanModal = false
        this.audioChanModel = {
          type: 2,
          subSystem: 1,
          deviceId: this.idCopy,
          orgId: this.devInfo.orgId,
          keyPartId: this.devInfo.keyPartId,
          keyPartType: this.devInfo.keyPartType,
          name: '',
          calss: '',
          serise: '',
          brand: '',
          modelNum: '',
          assetCode: ''
        }
      } else if (index === 3) {
        // 重置对应的面板
        this.$refs['inputChanModel'].resetFields()
        //
        this.dialogStatus.inputChanModal = false
        this.inputChanModel = {
          type: 3,
          subSystem: 1,
          deviceId: this.idCopy,
          orgId: this.devInfo.orgId,
          keyPartId: this.devInfo.keyPartId,
          keyPartType: this.devInfo.keyPartType,
          name: '',
          class: 1,
          serise: 1,
          brand: '',
          modelNum: '',
          assetCode: ''
        }
      } else if (index === 4) {
        // 重置对应的面板
        this.$refs['outputChanModel'].resetFields()
        //
        this.dialogStatus.outputChanModal = false
        this.outputChanModel = {
          type: 4,
          subSystem: 1,
          deviceId: this.idCopy,
          orgId: this.devInfo.orgId,
          keyPartId: this.devInfo.keyPartId,
          keyPartType: this.devInfo.keyPartType,
          name: '',
          class: 1,
          serise: 1,
          brand: '',
          modelNum: '',
          assetCode: ''
        }
      }
    },
    selectChange(data, type) {
      if (type === 'video') {
        this.videoChanSelectData = data
      } else if (type === 'audio') {
        this.audioChanSelectData = data
      } else if (type === 'input') {
        this.inputChanSelectData = data
      } else if (type === 'output') {
        this.outputChanSelectData = data
      }
    }
  },
  beforeDestroy() {
    this.idCopy = ''
  }
}
</script>

<style lang="less" scoped>
.table-result-box {
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
        .el-button--mini {
          min-width: 30px;
          font-size: 16px;
          margin: 0;
        }
        .el-button--text {
          color: #000;
        }
        .is-disabled {
          color: #ccc;
        }
      }
    }
  }
}
.content {
  display: flex;
  justify-content: center;
   .el-form-item--mini{
      width: 90%;
      .el-form-item__content{
        width: 100%;
        .el-select--mini{
        width: 100%;
        }
      }
    }
}
.vnvr {
  display: flex;
  justify-content: center;
  .el-form{
    width: 100%;display: flex;flex-wrap: wrap;
    .el-form-item--mini{
      width: 48%;
      .el-form-item__content{
        width: 100%;
        .el-select--mini{
        width: 100%;
        }
      }
    }
    // .left {
    //   width: 50%;
    // }
    // .right {
    //   width: 50%;
    // }
  }
}
@media print {
  .table-result-box {
    width: 100%;
    margin: 10px auto;
    padding: 0 10px;
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
          .el-button--mini {
            min-width: 30px;
            font-size: 16px;
            margin: 0;
          }
          .el-button--text {
            color: #000;
          }
          .is-disabled {
            color: #ccc;
          }
        }
        .box-wrap {
          /deep/ .table-box {
            /deep/ .el-table--border {
              border: 1px solid #ccc;
              padding: 1px;
              /deep/ .el-table td,
              /deep/ .el-table th.is-leaf,
              /deep/ .el-table--border,
              /deep/ .el-table--group {
                border-color: black;
              }
              /deep/ .el-table--border::after,
              /deep/ .el-table--group::after,
              /deep/ .el-table::before {
                background-color: black;
              }
            }
          }
        }
      }
    }
  }
}
</style>
