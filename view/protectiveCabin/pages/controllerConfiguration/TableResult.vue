<template>
  <div class="table-result-box">
    <div class="collapses">
      <div class="collapse-item">
        <div class="left-title">
          <span class="active"></span>
          <span class="pointer"
                @click="toggleOpen('cabinChan')">
            防护舱通道列表
            <i :class="dropdownStatus.cabinChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div class="button-num"
             v-if="dropdownStatus.cabinChan && showOptIcon">
          <el-button type="primary"
                     @click="getChannelList">
            <span class="iconfont-ccb ccbhuoqu"></span>
          </el-button>
          <el-button type="primary"
                     @click="addOrEdit(1, 'add')">
            <span class="iconfont-ccb ccbxinjian1"></span>
          </el-button>
          <el-button type="primary"
                     @click="addOrEdit(1,'edit')"
                     :disabled="cabinChanSelectData.length !== 1">
            <span class="iconfont-ccb ccbbianji"></span>
          </el-button>
          <el-button type="primary"
                     @click="deleteResource(1)"
                     :disabled="cabinChanSelectData.length === 0">
            <span class="iconfont-ccb ccbshanchu"></span>
          </el-button>
          <el-button type="primary"
                     @click="refresh(1)">
            <span class="iconfont-ccb ccbshuaxin"></span>
          </el-button>
        </div>
      </div>
      <div v-if="dropdownStatus.cabinChan"
           class="table-num">
        <video-table type="cabin"
                     :selection="showOptIcon"
                     :columns='cabinChanColumns'
                     :tableData='cabinChanTableData'
                     @selectChange="selectChange">
        </video-table>
      </div>
      <div class="collapse-item">
        <div class="left-title">
          <span class="active"></span>
          <span class="pointer"
                @click="toggleOpen('inputChan')">
            报警输入列表
            <i :class="dropdownStatus.inputChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div class="button-num"
             v-if="dropdownStatus.inputChan && showOptIcon">
          <el-button type="primary"
                     @click="getInputList">
            <span class="iconfont-ccb ccbhuoqu"></span>
          </el-button>
          <el-button type="primary"
                     @click="addOrEdit(2, 'add')">
            <span class="iconfont-ccb ccbxinjian1"></span>
          </el-button>
          <el-button type="primary"
                     @click="addOrEdit(2,'edit')"
                     :disabled="inputChanSelectData.length !== 1">
            <span class="iconfont-ccb ccbbianji"></span>
          </el-button>
          <el-button type="primary"
                     @click="deleteResource(2)"
                     :disabled="inputChanSelectData.length === 0">
            <span class="iconfont-ccb ccbshanchu"></span>
          </el-button>
          <el-button type="primary"
                     @click="refresh(2)">
            <span class="iconfont-ccb ccbshuaxin"></span>
          </el-button>
        </div>
      </div>
      <div v-if="dropdownStatus.inputChan"
           class="table-num">
        <video-table type="input"
                     :selection="showOptIcon"
                     :columns='inputChanColumns'
                     :tableData='inputChanTableData'
                     @selectChange="selectChange">
        </video-table>
      </div>
      <div class="collapse-item">
        <div class="left-title">
          <span class="active"></span>
          <span class="pointer"
                @click="toggleOpen('outputChan')">
            报警输出列表
            <i :class="dropdownStatus.outputChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div class="button-num"
             v-if="dropdownStatus.outputChan  && showOptIcon">
          <el-button type="primary"
                     @click="getOutputList">
            <span class="iconfont-ccb ccbhuoqu"></span>
          </el-button>
          <el-button type="primary"
                     @click="addOrEdit(3, 'add')">
            <span class="iconfont-ccb ccbxinjian1"></span>
          </el-button>
          <el-button type="primary"
                     @click="addOrEdit(3,'edit')"
                     :disabled="outputChanSelectData.length !== 1">
            <span class="iconfont-ccb ccbbianji"></span>
          </el-button>
          <el-button type="primary"
                     @click="deleteResource(3)"
                     :disabled="outputChanSelectData.length === 0">
            <span class="iconfont-ccb ccbshanchu"></span>
          </el-button>
          <el-button type="primary"
                     @click="refresh(3)">
            <span class="iconfont-ccb ccbshuaxin"></span>
          </el-button>
        </div>
      </div>
      <div v-if="dropdownStatus.outputChan"
           class="table-num">
        <video-table type="output"
                     :selection="showOptIcon"
                     :columns='outputChanColumns'
                     :tableData='outputChanTableData'
                     @selectChange="selectChange">
        </video-table>
      </div>
    </div>
    <el-dialog title="防护舱通道配置"
               :visible.sync="dialogStatus.cabinChanModal"
               width="430px"
               :close-on-click-modal="false"
               @closed="closeDialog(1)"
               v-if="dialogStatus.cabinChanModal">
      <div class="content">
        <el-form size="mini"
                 label-width="110px"
                 ref="cabinChanModel"
                 :model="cabinChanModel">
          <el-form-item label="防护舱通道名称"
                        prop="name"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' },{ min: 1, max: 64, message: '长度小于64个字符', trigger: 'blur' }]">
            <el-input v-model="cabinChanModel.name"></el-input>
          </el-form-item>
          <el-form-item label="防护舱通道号"
                        prop="serise"
                        :rules="[{ required: true, message: '必填', trigger: 'change' },
          { type: 'number', message: '通道号必须为整数', trigger: 'blur' },
          { type: 'number', max: 65535, message: '通道号不能大于65535', trigger: 'blur' }]">
            <el-input v-model.number="cabinChanModel.serise"></el-input>
          </el-form-item>
          <el-form-item label="品牌"
                        prop="brand"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
            <el-select style="width:100%"
                       v-model="cabinChanModel.brand"
                       @change="changea($event,1)">
              <el-option v-for="item in cabinBrands"
                         :key="item.data"
                         :label="item.data"
                         :value="item.data?item.data:item.data">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="型号"
                        prop="modelNum"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
            <el-select style="width:100%"
                       v-model="cabinChanModel.modelNum">
              <el-option v-for="item in cabinModelNum"
                         :key="item.data"
                         :label="item.data"
                         :value="item.data">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资产编码"
                        prop="assetCode"
                        :rules="[{ min: 0, max: 64, message: '长度小于64个字符', trigger: 'blur' }]">
            <el-input v-model="cabinChanModel.assetCode"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-footer"
           slot="footer">
        <el-button type="primary"
                   size="mini"
                   @click="optResorce(1,'cabinChanModel')"
                   :loading="loadingSave">{{loadingSave?'保存中':'保存'}}</el-button>
        <el-button size="mini"
                   @click="closeDialog(1)">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="报警输入列表"
               :visible.sync="dialogStatus.inputChanModal"
               width="430px"
               @closed="closeDialog(2)"
               :close-on-click-modal="false"
               v-if="dialogStatus.inputChanModal">
      <div class="content">
        <el-form size="mini"
                 label-width="110px"
                 :model="inputChanModel"
                 ref="inputChanModel">
          <el-form-item label="报警输入名称"
                        prop="name"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' },{ min: 1, max: 64, message: '长度小于64个字符', trigger: 'blur' }]">
            <el-input v-model="inputChanModel.name"></el-input>
          </el-form-item>
          <el-form-item label="报警输入通道号"
                        prop="serise"
                        :rules="[{ required: true, message: '必填', trigger: 'change' },
          { type: 'number', message: '通道号必须为整数', trigger: 'blur' },
          { type: 'number', max: 65535, message: '通道号不能大于65535', trigger: 'blur' }]">
            <el-input v-model.number="inputChanModel.serise"></el-input>
          </el-form-item>
          <el-form-item label="资源类型"
                        prop="class"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
            <el-select style="width:100%"
                       v-model="inputChanModel.class">
              <el-option v-for="item in inputClass"
                         :key="item.key"
                         :label="item.data"
                         :value="item.key?item.key:item.data">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌"
                        prop="brand"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
            <el-select style="width:100%"
                       v-model="inputChanModel.brand"
                       @change="changea($event,2)">
              <el-option v-for="item in inputBrands"
                         :key="item.data"
                         :label="item.data"
                         :value="item.data?item.data:item.data">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="型号"
                        prop="modelNum"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
            <el-select style="width:100%"
                       v-model="inputChanModel.modelNum">
              <el-option v-for="item in inputModelNum"
                         :key="item.data"
                         :label="item.data"
                         :value="item.data?item.data:item.data">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资产编码"
                        placeholder="输入资产编码"
                        prop='assetCode'
                        :rules="[{ min: 0, max: 64, message: '长度小于64个字符', trigger: 'blur' }]">
            <el-input v-model="inputChanModel.assetCode"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-footer"
           slot="footer">
        <el-button type="primary"
                   size="mini"
                   @click="optResorce(2,'inputChanModel')"
                   :loading="loadingSave">{{loadingSave?'保存中':'保存'}}</el-button>
        <el-button size="mini"
                   @click="closeDialog(2)">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="报警输出列表"
               :visible.sync="dialogStatus.outputChanModal"
               width="430px"
               @closed="closeDialog(3)"
               :close-on-click-modal="false">
      <div class="content">
        <el-form size="mini"
                 label-width="110px"
                 :model="outputChanModal"
                 ref="outputChanModal">
          <el-form-item label="报警输出通道名"
                        prop="name"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' },{ min: 1, max: 64, message: '长度小于64个字符', trigger: 'blur' }]">
            <el-input v-model="outputChanModal.name"></el-input>
          </el-form-item>
          <el-form-item label="报警输出通道号"
                        prop="serise"
                        :rules="[{ required: true, message: '必填', trigger: 'change' },
          { type: 'number', message: '通道号为整数', trigger: 'blur' },
          { type: 'number', max: 65535, message: '通道号不能大于65535', trigger: 'blur' }]">
            <el-input v-model.number="outputChanModal.serise"></el-input>
          </el-form-item>
          <el-form-item label="资源类型"
                        prop="class"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
            <el-select style="width:100%"
                       v-model="outputChanModal.class">
              <el-option v-for="item in outputClass"
                         :key="item.key"
                         :label="item.data"
                         :value="item.key?item.key:item.data">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌"
                        prop="brand"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
            <el-select style="width:100%"
                       v-model="outputChanModal.brand"
                       @change="changea($event,3)">
              <el-option v-for="item in outputBrands"
                         :key="item.data"
                         :label="item.data"
                         :value="item.data?item.data:item.data">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="型号"
                        prop="modelNum"
                        :rules="[{ required: true, message: '必填', trigger: 'change' }]">
            <el-select style="width:100%"
                       v-model="outputChanModal.modelNum">
              <el-option v-for="item in outputModelNum"
                         :key="item.data"
                         :label="item.data"
                         :value="item.data?item.data:item.data">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资产编码"
                        placeholder="输入资产编码"
                        prop='assetCode'
                        :rules="[{ min: 0, max: 64, message: '长度小于64个字符', trigger: 'blur' }]">
            <el-input v-model="outputChanModal.assetCode"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-footer"
           slot="footer">
        <el-button type="primary"
                   size="mini"
                   @click="optResorce(3,'outputChanModal')"
                   :loading="loadingSave">{{loadingSave?'保存中':'保存'}}</el-button>
        <el-button size="mini"
                   @click="closeDialog(3)">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VideoTable from './VideoTable'
import {
  listInfoApi,
  addHostChannelAddApi,
  getChannel,
  addHostChannelUpdateApi,
  addHostChannelDeleteApi,
  addHostChannelGetApi,
  getBasicInfo,
  getSystemOpsManagerApi,
} from '../../../../http/protectiveCabin/channe.api'
export default {
  name: 'TableResult',
  components: {
    VideoTable,
  },
  props: {
    showOptIcon: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      required: true,
    },
    devInfo: {
      type: Object,
    },
    deviceName: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: 'other',
    },
  },
  data() {
    return {
      dropdownStatus: {
        cabinChan: true,
        inputChan: true,
        outputChan: true,
      },
      dialogStatus: {
        cabinChanModal: false,
        inputChanModal: false,
        outputChanModal: false,
      },
      idCopy: this.id,
      loadingSave: false,
      cabinChanColumns: [
        { prop: 'name', label: '防护舱通道名称', width: '' },
        { prop: 'serise', label: '防护舱通道号', width: '' },
        { prop: 'cabinStatus', label: '防护舱门状态', width: '' },
        { prop: 'lockStatus', label: '门锁状态', width: '' },
        { prop: 'status', label: '在线状态', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
      ],
      cabinChanTableData: [], //防护舱通道表格数据
      cabinChanSelectData: [], //防护舱选择数据
      cabinBrands: [], //防护舱品牌
      cabinModelNum: [], //防护舱型号
      cabinOpt: '', //防护舱添加或新增
      cabinChanModel: {
        name: '',
        serise: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        type: 1,
        deviceId: this.idCopy || this.id,
      }, //新增防护舱通道数据
      inputChanColumns: [
        { prop: 'name', label: '报警输入名称', width: '' },
        { prop: 'serise', label: '报警输入通道号', width: '' },
        { prop: 'class', label: '资源类型', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
      ],
      inputChanTableData: [],
      inputChanSelectData: [],
      inputClass: [], //输入类型
      inputBrands: [], //输入品牌
      inputModelNum: [], //输入型号
      inputOpt: '', //输入通道添加或新增
      inputChanModel: {
        name: '',
        serise: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        type: 2,
        class: '',
        deviceId: this.idCopy || this.id,
      }, //新增防护舱通道数据
      outputChanColumns: [
        { prop: 'name', label: '报警输出名称', width: '' },
        { prop: 'serise', label: '报警输出通道号', width: '' },
        { prop: 'class', label: '资源类型', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
      ],
      outputChanTableData: [],
      outputChanSelectData: [],
      outputClass: [], //输入类型
      outputBrands: [], //输入品牌
      outputModelNum: [], //输入型号
      outputOpt: '', //输入通道添加或新增
      outputChanModal: {
        type: 3,
        deviceId: this.idCopy || this.id,
        name: '',
        class: '',
        serise: '',
        brand: '',
        modelNum: '',
        assetCode: '',
      },
    }
  },
  created() {
    if (this.idCopy) {
      listInfoApi(this.idCopy).then((res) => {
        if (res.data.code === 0) {
          res.data.data.cabinChannels.forEach((item) => {
            item.lockStatus = item.lockStatus === 3 ? '未知' : item.lockStatus === 2 ? '开启' : '关闭'
            item.cabinStatus = item.cabinStatus === 3 ? '未知' : item.cabinStatus === 2 ? '开启' : '关闭'
            item.status = item.status === 3 ? '未知' : item.status === 2 ? '无人' : '有人'
          })
          this.cabinChanTableData = res.data.data.cabinChannels || []
          this.inputChanTableData = res.data.data.inputChannels || []
          this.outputChanTableData = res.data.data.outputChannels || []
        }
      })
    }
  },
  methods: {
    //远程防护舱通道获取
    getChannelList() {
      addHostChannelGetApi({ id: this.idCopy || this.id, type: 1 }).then((res) => {
        if (res.data.code === 0) {
          this.$messageSuccess('获取成功!')
          getChannel({ id: this.idCopy, type: { type: 1 } }).then((res) => {
            res.data.data.forEach((item) => {
              item.lockStatus = item.lockStatus === 3 ? '未知' : item.lockStatus === 2 ? '开启' : '关闭'
              item.cabinStatus = item.cabinStatus === 3 ? '未知' : item.cabinStatus === 2 ? '开启' : '关闭'
              item.status = item.status === 3 ? '未知' : item.status === 2 ? '无人' : '有人'
            })
            this.cabinChanTableData = res.data.data
          })
        } else {
          this.$messageError('获取失败!')
        }
      })
    },

    selectChange(data, type) {
      if (type === 'cabin') {
        this.cabinChanSelectData = data
      } else if (type === 'audio') {
        this.audioChanSelectData = data
      } else if (type === 'input') {
        this.inputChanSelectData = data
      } else if (type === 'output') {
        this.outputChanSelectData = data
      }
    },

    //远程输入通道获取
    getInputList() {
      addHostChannelGetApi({ id: this.idCopy, type: 2 }).then((res) => {
        if (res.data.code === 0) {
          this.$messageSuccess('获取成功!')
          getChannel({ id: this.idCopy, type: { type: 2 } }).then((res) => {
            this.inputChanTableData = res.data.data
          })
        } else {
          this.$messageError('获取失败!')
        }
      })
    },

    //远程输出通道获取
    getOutputList() {
      addHostChannelGetApi({ id: this.idCopy, type: 3 }).then((res) => {
        if (res.data.code === 0) {
          this.$messageSuccess('获取成功!')
          getChannel({ id: this.idCopy, type: { type: 3 } }).then((res) => {
            this.outputChanTableData = res.data.data
          })
        } else {
          this.$messageError('获取失败!')
        }
      })
    },

    closeDialog(index) {
      if (index === 1) {
        this.dialogStatus.cabinChanModal = false
        this.cabinChanModel = {
          name: '',
          serise: '',
          brand: '',
          modelNum: '',
          assetCode: '',
          type: 1,
          deviceId: this.idCopy || this.id,
        }
      } else if (index === 2) {
        this.dialogStatus.inputChanModal = false
        this.inputChanModel = {
          type: 2,
          deviceId: this.idCopy || this.id,
          name: '',
          class: '',
          serise: '',
          brand: '',
          modelNum: '',
          assetCode: '',
        }
      } else if (index === 3) {
        this.dialogStatus.outputChanModal = false
        this.outputChanModal = {
          type: 3,
          deviceId: this.idCopy || this.id,
          name: '',
          class: '',
          serise: '',
          brand: '',
          modelNum: '',
          assetCode: '',
        }
      }
    },

    channelList(index) {
      getChannel({ id: this.idCopy, type: { type: index } }).then((res) => {
        if (res.data.code === 0) {
          if (index === 1) {
            this.cabinChanTableData = res.data.data || []
          } else if (index === 2) {
            this.inputChanTableData = res.data.data || []
          } else {
            this.outputChanTableData = res.data.data || []
          }
        }
      })
    },

    changea(item, val) {
      if (val === 1) {
        this.cabinModelNum = []
        this.cabinChanModel.modelNum = ''
        let modelNums = [{ moduleId: '1', childModuleId: '6', dictId: '7' }]
        getBasicInfo({ queryList: modelNums }).then((res) => {
          res.data.data[0].attr.forEach((i) => {
            if (i.homeClass === item) {
              this.cabinModelNum.push(i)
            }
          })
        })
      } else if (val === 2) {
        this.inputModelNum = []
        let modelNums = [{ moduleId: '1', childModuleId: '6', dictId: '9' }]
        getBasicInfo({ queryList: modelNums }).then((res) => {
          res.data.data[0].attr.forEach((i) => {
            if (i.homeClass === item) {
              this.inputModelNum.push(i)
            }
          })
        })
      } else if (val === 3) {
        this.outputModelNum = []
        let modelNums = [{ moduleId: '1', childModuleId: '6', dictId: '12' }]
        getBasicInfo({ queryList: modelNums }).then((res) => {
          res.data.data[0].attr.forEach((i) => {
            if (i.homeClass === item) {
              this.outputModelNum.push(i)
            }
          })
        })
      }
    },

    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },

    optResorce(index, ref) {
      this.$refs[ref].validate((valid) => {
        if (valid) {
          if (index === 1) {
            this.cabinOpt === 'add' ? this.addResource(index) : this.editResouce(index)
          } else if (index === 2) {
            this.inputOpt === 'add' ? this.addResource(index) : this.editResouce(index)
          } else if (index === 3) {
            this.outputOpt === 'add' ? this.addResource(index) : this.editResouce(index)
          }
        } else {
          return false
        }
      })
    },

    addResource(index) {
      this.loadingSave = true
      let sendData =
        index === 1 ? this.cabinChanModel : index === 2 ? this.inputChanModel : index === 3 ? this.outputChanModal : ''
      addHostChannelAddApi(sendData)
        .then((res) => {
          this.loadingSave = false
          if (res.data.code === 0) {
            this.$messageSuccess('添加资源成功')
            this.closeDialog(index)
            this.channelList(index)
          } else {
            this.$messageError(res.data.message)
          }
        })
        .catch((err) => {
          this.$messageError(err)
        })
    },

    editResouce(index) {
      this.loadingSave = true
      let sendData =
        index === 1 ? this.cabinChanModel : index === 2 ? this.inputChanModel : index === 3 ? this.outputChanModal : ''
      let id = sendData.id
      addHostChannelUpdateApi({ id: sendData.id, message: sendData }).then((res) => {
        this.loadingSave = false
        if (res.data.code === 0) {
          this.$messageSuccess('更新资源成功')
          this.closeDialog(index)
          this.channelList(index)
        } else {
          this.$messageError(res.data.message)
        }
      })
    },

    deleteResource(index) {
      this.$confirm('确认删除该通道?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let sendData =
            index === 1
              ? this.cabinChanSelectData
              : index === 2
              ? this.inputChanSelectData
              : index === 3
              ? this.outputChanSelectData
              : ''
          let idsData = sendData.map((item) => {
            return item.id
          })
          addHostChannelDeleteApi({
            ids: idsData,
          })
            .then((res) => {
              if (res.data.code === 0) {
                this.$messageSuccess('删除资源成功')
                this.channelList(index)
              } else {
                this.$messageError(res.data.message)
              }
            })
            .catch((err) => {
              this.$messageError(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },

    refresh(index) {
      this.channelList(index)
      this.$messageSuccess('刷新成功')
    },

    addOrEdit(index, type) {
      if (index === 1) {
        let brands = [{ moduleId: '1', childModuleId: '6', dictId: '6' }]
        getBasicInfo({ queryList: brands }).then((res) => {
          this.cabinBrands = res.data.data[0].attr
        })
        if (type === 'add') {
          this.dialogStatus.cabinChanModal = true
          this.cabinOpt = type
        } else {
          if (this.cabinChanSelectData.length === 1) {
            this.dialogStatus.cabinChanModal = true
            this.cabinChanSelectData[0].serise = Number(this.cabinChanSelectData[0].serise)
            this.cabinChanModel = this.$lodash.cloneDeep(this.cabinChanSelectData[0])
            this.cabinOpt = type
          }
        }
      } else if (index === 2) {
        let brands = [{ moduleId: '1', childModuleId: '6', dictId: '8' }]
        getBasicInfo({ queryList: brands }).then((res) => {
          this.inputBrands = res.data.data[0].attr
        })
        getSystemOpsManagerApi({ queryList: [{ moduleId: '1', childModuleId: '6', dictId: '10' }] }).then((res) => {
          if (res.data.data) {
            this.inputClass = res.data.data[0].attr
          }
        })
        if (type === 'add') {
          this.dialogStatus.inputChanModal = true
          this.inputOpt = type
        } else {
          if (this.inputChanSelectData.length === 1) {
            this.dialogStatus.inputChanModal = true
            this.inputChanSelectData[0].serise = Number(this.inputChanSelectData[0].serise)
            this.inputChanModel = this.$lodash.cloneDeep(this.inputChanSelectData[0])
            this.inputOpt = type
          }
        }
      } else if (index === 3) {
        let brands = [{ moduleId: '1', childModuleId: '6', dictId: '11' }]
        getBasicInfo({ queryList: brands }).then((res) => {
          this.outputBrands = res.data.data[0].attr
        })
        getSystemOpsManagerApi({ queryList: [{ moduleId: '1', childModuleId: '6', dictId: '13' }] }).then((res) => {
          if (res.data.data) {
            this.outputClass = res.data.data[0].attr
          }
        })
        if (type === 'add') {
          this.dialogStatus.outputChanModal = true
          this.outputOpt = type
        } else {
          if (this.outputChanSelectData.length === 1) {
            this.dialogStatus.outputChanModal = true
            this.outputChanSelectData[0].serise = Number(this.outputChanSelectData[0].serise)
            this.outputChanModal = this.$lodash.cloneDeep(this.outputChanSelectData[0])
            this.outputOpt = type
          }
        }
      }
    },
  },
  beforeDestroy() {
    this.idCopy = ''
  },
}
</script>

<style lang="less" scoped>
.table-result-box {
  .collapses {
    .collapse-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      height: 28px;
      .left-title {
        display: flex;
        align-items: center;
        .active {
          display: inline-block;
          width: 2px;
          height: 14px;
          background: #2d72d3;
        }
        .pointer {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          margin-left: 5px;
          position: relative;
          cursor: pointer;
        }
      }
      .button-num {
        /deep/ .is-disabled {
          color: #c0c4cc;
          cursor: not-allowed;
          background-image: none;
          background-color: #fff;
          border-color: #ebeef5;
        }
        /deep/ .el-button {
          background: #fff;
          width: 35px;
          height: 28px;
          padding: 0;
          border: 1px solid #e1e1e1;
          .iconfont-ccb {
            color: #333;
            font-size: 16px;
          }
        }
      }
      // margin-bottom: 10px;
      // .box-title {
      //   position: relative;
      //   height: 24px;
      //   line-height: 24px;
      //   color: #606266;
      //   i {
      //     position: absolute;
      //     top: 50%;
      //     left: 85px;
      //     transform: translateY(-50%);
      //   }
      //   &::after {
      //     display: block;
      //     content: '';
      //     border-top: 1px solid #e1e1e1;
      //     width: calc(~'100% - 120px');
      //     margin-left: 100px;
      //     margin-top: -12px;
      //   }
      // }
      // .list-header {
      //   text-align: right;
      //   i {
      //     cursor: pointer;
      //     margin-right: 10px;
      //     font-size: 16px;
      //     height: 20px;
      //     line-height: 20px;
      //   }
      //   .disable {
      //     color: #878282;
      //     cursor: not-allowed;
      //   }
      // }
    }
    .table-num {
      margin-bottom: 30px;
    }
  }
}
.content {
  display: flex;
  justify-content: center;
  .left {
    width: 50%;
  }
  .right {
    width: 50%;
  }
}
/deep/ .el-dialog {
  .el-dialog__header {
    .el-dialog__title {
      font-size: 14px;
    }
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
  .el-dialog__footer {
    .form-footer {
      text-align: center;
    }
  }
}
</style>
