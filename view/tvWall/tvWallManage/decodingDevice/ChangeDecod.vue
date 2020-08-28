<template>
  <div class="content">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTvWallTreeApi"
               searchType="search"
               :lazyTreeSearchApi="getLazyTreeSearchApi"
               @onceClick="onceClick"
               treeLazyToggle
               iconToggle>
      </treeBox>
    </div>
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>电视墙管理</el-breadcrumb-item>
            <el-breadcrumb-item>解码设备管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="messageWrap">
        <div class="messagetitle">
          <span>编辑解码设备信息</span>
        </div>
        <div class="messageTable">
          <div class="form-content">
            <div class="left-form">
              <el-form ref="addForm"
                       :rules="rules"
                       size="mini"
                       :model="formDataCopy"
                       label-position="right"
                       label-width="110px">
                <el-form-item label="设备名称"
                              required
                              class="maBottom"
                              prop="name">
                  <el-input v-model="formDataCopy.name"></el-input>
                </el-form-item>
                <el-form-item label="所属机构"
                              required
                              class="maBottom"
                              prop="orgName">
                  <el-input disabled
                            v-model="formDataCopy.orgName"></el-input>
                </el-form-item>
                <el-form-item label="所属重点部位"
                              required
                              class="maBottom"
                              prop="keyPartName">
                  <el-input disabled
                            v-model="formDataCopy.keyPartName"
                            prop="keyPartName"></el-input>
                </el-form-item>
                <el-form-item label="接入服务器"
                              required
                              class="maBottom"
                              prop="accessService">
                  <el-select v-model="formDataCopy.accessService">
                    <el-option v-for="item in devModelList4"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="品牌"
                              class="maBottom"
                              required
                              prop="brandName">
                  <el-select v-model="formDataCopy.brandName"
                             @change="changeBrand">
                    <el-option v-for="item in devModelList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="IP地址"
                              required
                              class="maBottom"
                              prop="ip">
                  <el-input v-model="formDataCopy.ip"></el-input>
                </el-form-item>
                <el-form-item label="端口"
                              required
                              class="maBottom"
                              prop="port">
                  <el-input v-model.number="formDataCopy.port"></el-input>
                </el-form-item>
                <el-form-item label="解码窗口数量"
                              class="maBottom"
                              prop="decoderNumber">
                  <el-input v-model="formDataCopy.decoderNumber"></el-input>
                </el-form-item>
                <el-form-item label="输出通道数量"
                              class="maBottom"
                              v-if="formDataCopy.type === 2"
                              prop="outputNumber">
                  <el-input v-model="formDataCopy.outputNumber"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="right-form">
              <el-form size="mini"
                       ref="addForm2"
                       :rules="rules"
                       :model="formDataCopy"
                       label-position="right"
                       label-width="124px">
                <el-form-item label="设备序列号"
                              class="maBottom">
                  <el-input disabled
                            v-model="formDataCopy.serialCode"></el-input>
                </el-form-item>
                <el-form-item label="资源编码"
                              class="maBottom"
                              prop="assetCode">
                  <el-input v-model="formDataCopy.assetCode"></el-input>
                </el-form-item>
                <el-form-item label="所属电视墙"
                              class="maBottom">
                  <el-select v-model="formDataCopy.wallName"
                             @change="changeTv">
                    <el-option v-for="item in devModelList2"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备类型"
                              required
                              class="maBottom"
                              prop="typeName">
                  <el-select disabled
                             v-model="formDataCopy.typeName">
                    <el-option v-for="item in devBrandList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="型号"
                              class="maBottom"
                              required
                              prop="modelNum">
                  <el-select v-model="formDataCopy.modelNum"
                             @change="selectData2">
                    <el-option v-for="item in devModelList3"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="用户名"
                              required
                              class="maBottom"
                              prop="username">
                  <el-input v-model="formDataCopy.username"></el-input>
                </el-form-item>
                <el-form-item label="密码"
                              required
                              class="maBottom"
                              prop="password">
                  <el-input v-model="formDataCopy.password"
                            show-password></el-input>
                </el-form-item>
                <el-form-item label="本地终端输入数量"
                              class="maBottom"
                              v-if="formDataCopy.type === 2"
                              prop="inputNumber">
                  <el-input v-model="formDataCopy.inputNumber"></el-input>
                </el-form-item>
                <el-form-item label="输出通道数量"
                              class="maBottom"
                              v-if="formDataCopy.type !== 2"
                              prop="outputNumber">
                  <el-input v-model="formDataCopy.outputNumber"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="form-footer">
          <el-button type="primary"
                     size="small"
                     @click="succfulMethod">保存</el-button>
          <el-button size="small"
                     @click="skipToList">取消</el-button>
          <el-button size="small"
                     @click="resetMethod">重置</el-button>
        </div>
        <div class="from-contend-last">
          <div class="last-title">
            <ul>
              <li :class="{ 'active-tab': changPage === index }"
                  v-for="(label, index) in btnArr"
                  :key="label"
                  @click="changeWho(label, index)">
                {{ label }}
              </li>
            </ul>
          </div>
          <div class="tableWrap">
            <div class="decodingWrap"
                 v-if="pageFlag && formDataCopy.type === 2">
              <div class="box-title"
                   @click="toggleOpen('detector')">
                <span class="pointer">
                  本地终端输入列表
                  <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                     class="maLeft"></i>
                </span>
              </div>
              <div class="list"
                   v-if="dropdownStatus.detector">
                <div class="list-header">
                  <i class="el-icon-download"
                     title="获取通道信息"
                     @click="getCannalList_true"></i>
                  <i class="el-icon-circle-plus-outline"
                     title="新增"
                     @click="openAddModal"></i>
                  <i class="el-icon-edit"
                     title="编辑"
                     @click="openEditModal"></i>
                  <i class="el-icon-delete"
                     title="删除"
                     @click="delectMethod(1)"></i>
                  <i class="el-icon-refresh-right"
                     title="刷新"
                     @click="refreshMethod(1)"></i>
                </div>
                <el-table ref="multipleTable"
                          border
                          :data="tableData"
                          style="width: 100%;font-size:12px"
                          @selection-change="handleSelectionChange">
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column type="index"
                                   label="序号"
                                   width="50"></el-table-column>
                  <el-table-column v-for="(item, index) in tableColumn"
                                   :key="index"
                                   :prop="item.mark"
                                   :label="item.label"
                                   :width="item.width"
                                   show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </div>
            <div class="LedWap"
                 v-if="pageFlag">
              <div class="box-title"
                   @click="toggleOpen('output')">
                <span class="pointer">
                  输出通道列表
                  <i :class="dropdownStatus.output ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                     class="maLeft"></i>
                </span>
              </div>
              <div class="list"
                   v-if="dropdownStatus.output">
                <div class="list-header">
                  <i class="el-icon-download"
                     title="获取通道信息"
                     @click="getOutCannalList_true"></i>
                  <i class="el-icon-circle-plus-outline"
                     title="新增"
                     @click="openAddOutputModal"></i>
                  <i class="el-icon-edit"
                     title="编辑"
                     @click="openEditOutputModal"></i>
                  <i class="el-icon-delete"
                     title="删除"
                     @click="delectMethod(2)"></i>
                  <i class="el-icon-refresh-right"
                     title="刷新"
                     @click="refreshMethod(2)"></i>
                </div>
                <el-table ref="multipleTable"
                          border
                          :data="LedtableData"
                          @selection-change="handleSelectionChange"
                          style="width: 100%;font-size:12px">
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column type="index"
                                   label="序号"
                                   width="50"></el-table-column>
                  <el-table-column v-for="(item, index) in LedtableColumn"
                                   :key="index"
                                   :prop="item.mark"
                                   :label="item.label"
                                   :width="item.width"
                                   show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </div>
            <div class="channeWrap"
                 v-if="!pageFlag">
              <div class="channe-title">
                <span>设备异常</span>
              </div>
              <div class="channe-contend">
                <div class="channe-contend-title">
                  <span>异常类型</span>
                </div>
                <div class="channe-contend-const">
                  <el-select v-model="value">
                    <el-option v-for="item in devModelList1"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </div>
                <div class="channe-contend-checked">
                  <el-checkbox v-model="checked">启用</el-checkbox>
                </div>
              </div>
              <div class="channe-footer">
                <el-button type="primary"
                           size="small"
                           @click="abnormalSave">保存</el-button>
                <el-button size="small"
                           @click="abnormalDis">取消</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <ul>
            <li>
              <div class="title">
                <span>录入时间</span>
              </div>
              <div class="const">{{ formDataCopy.updatedAt }}</div>
            </li>
            <li>
              <div class="title">
                <span>录入机构</span>
              </div>
              <div class="const">{{ formDataCopy.updatedDept }}</div>
            </li>
            <li>
              <div class="title">
                <span>录入人</span>
              </div>
              <div class="const">{{ formDataCopy.updatedBy }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 弹框(本地终端输入的新增和修改) -->
    <div class="model-wrap"
         v-if="isEditDetector">
      <el-dialog :title="modalTitle"
                 :visible.sync="isEditDetector"
                 width="400px">
        <el-form ref="addLocalForm"
                 :rules="rulesLocal"
                 :model="bdChanneData"
                 size="mini"
                 label-position="right"
                 label-width="135px">
          <el-form-item label="本地终端输入名称"
                        required
                        prop="name">
            <el-input v-model="bdChanneData.name"></el-input>
          </el-form-item>
          <el-form-item label="本地终端输入号"
                        required
                        prop="serise">
            <el-select v-model="bdChanneData.serise"
                       style="width:225px;">
              <el-option v-for="(item, index) in formDataCopy.inputNumber"
                         :key="index + 1"
                         :label="index + 1"
                         :value="index + 1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口类型"
                        required
                        prop="inputTypeName">
            <el-select v-model="bdChanneData.inputTypeName"
                       style="width:225px;">
              <el-option label="HDMI"
                         value="HDMI"></el-option>
              <el-option label="DVI"
                         value="DVI"></el-option>
              <el-option label="VGA"
                         value="VGA"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分辨率"
                        required
                        prop="ratio">
            <el-select v-model="bdChanneData.ratio"
                       style="width:225px;">
              <el-option label="1080P"
                         value="1080P"></el-option>
              <el-option label="720P"
                         value="720P"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌"
                        required
                        prop="brandName">
            <el-select v-model="bdChanneData.brandName"
                       style="width:225px;"
                       @change="changeBrand1">
              <el-option v-for="item in devModelList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="型号"
                        required
                        prop="modelNum">
            <el-select v-model="bdChanneData.modelNum"
                       style="width:225px;">
              <el-option v-for="item in devModelList3"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资产编码"
                        prop="assetCode">
            <el-input v-model="bdChanneData.assetCode"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align:center;">
          <el-button size="small"
                     type="primary"
                     v-if="changeOrCreatBtn"
                     @click="saveDecodData(1)">保存</el-button>
          <el-button size="small"
                     type="primary"
                     v-if="!changeOrCreatBtn"
                     @click="saveDecodData(2)">保存</el-button>
          <el-button size="small"
                     @click="isEditDetector = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 弹框(输出通道的新增和修改) -->
    <div class="model-wrap"
         v-if="isEditOutput">
      <el-dialog :title="modalTitle"
                 :visible.sync="isEditOutput"
                 width="400px">
        <el-form ref="addInputForm"
                 :rules="rulesLocal"
                 size="mini"
                 :model="OutChanneData"
                 label-position="right"
                 label-width="120px">
          <el-form-item label="输出通道名称"
                        required
                        prop="name">
            <el-input v-model="OutChanneData.name"></el-input>
          </el-form-item>
          <el-form-item label="输出通道号"
                        required
                        prop="serise">
            <el-select v-model="OutChanneData.serise"
                       style="width:240px;">
              <el-option v-for="(item, index) in formDataCopy.outputNumber"
                         :key="index + 1"
                         :label="index + 1"
                         :value="index + 1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口类型"
                        required
                        prop="inputTypeName">
            <el-select v-model="OutChanneData.inputTypeName"
                       style="width:240px;">
              <el-option label="HDMI"
                         value="HDMI"></el-option>
              <el-option label="DVI"
                         value="DVI"></el-option>
              <el-option label="VGA"
                         value="VGA"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分辨率"
                        required
                        prop="ratio">
            <el-select v-model="OutChanneData.ratio"
                       style="width:240px;">
              <el-option label="1080P"
                         value="1080P"></el-option>
              <el-option label="720P"
                         value="720P"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌"
                        required
                        prop="brandName">
            <el-select v-model="OutChanneData.brandName"
                       style="width:240px;"
                       @change="changeBrand2">
              <el-option v-for="item in devModelList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="型号"
                        required
                        prop="modelNum">
            <el-select v-model="OutChanneData.modelNum"
                       style="width:240px;">
              <el-option v-for="item in devModelList3"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资产编码"
                        prop="assetCode">
            <el-input v-model="OutChanneData.assetCode"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align:center;">
          <el-button size="small"
                     type="primary"
                     v-if="changeOrCreatBtn"
                     @click="saveOutChannlData(1)">保存</el-button>
          <el-button size="small"
                     type="primary"
                     v-if="!changeOrCreatBtn"
                     @click="saveOutChannlData(2)">保存</el-button>
          <el-button size="small"
                     @click="isEditOutput = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import { getTvWallTreeApi, searchTreeToWallApi } from '../../../../http/tvWall/tvWallmanage.api'
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  components: {
    treeBox
  },
  computed: {
    ...mapState({
      formData: ({ tvWall }) => tvWall.tvWallData, // 接受详细信息页面传过来的数据
      formIndex: ({ tvWall }) => tvWall.whocomponentIndex
    })
  },
  data() {
    return {
      // 表单验证
      rules: {
        name: [
          { required: true, message: '解码设备名称不能为空' },
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        assetCode: [{ pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }],
        username: [
          { required: true, message: '用户名不能为空' },
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        accessService: [{ required: true, message: '接入服务器不能为空' }],
        password: [
          { required: true, message: '密码不能为空' },
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        port: [
          { required: true, message: '端口不能为空' },
          { type: 'number', min: 0, max: 65535, message: '请填写0~65535范围端口' }
        ],
        ip: [
          { required: true, message: 'ip不能为空' },
          {
            pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: '请输入合法的IP'
          }
        ],
        decoderNumber: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' },
          { pattern: /^[0-9]*$/, message: '请输入数字类型' }
        ],
        inputNumber: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' },
          { pattern: /^[0-9]*$/, message: '请输入数字类型' }
        ],
        outputNumber: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' },
          { pattern: /^[0-9]*$/, message: '请输入数字类型' }
        ],
        keyPartName: [{ required: true, message: '重点部位不能为空' }],
        brandName: [{ required: true, message: '品牌不能为空' }],
        modelNum: [{ required: true, message: '型号不能为空' }],
        orgName: [{ required: true, message: '所属机构不能为空' }],
        typeName: [{ required: true, message: '解码设备类型不能为空' }]
      },
      // 本地终端输入通道表单验证
      rulesLocal: {
        name: [
          { required: true, message: '名称不能为空' },
          { min: 1, max: 128, message: '长度在1到128个字符' }
        ],
        serise: [{ required: true, message: '本地终端输入号不能为空' }],
        inputTypeName: [{ required: true, message: '接口类型不能为空' }],
        ratio: [{ required: true, message: '分辨率不能为空' }],
        brandName: [{ required: true, message: '品牌不能为空' }],
        modelNum: [{ required: true, message: '型号不能为空' }],
        assetCode: [{ min: 1, max: 128, message: '长度在1到128个字符' }]
      },
      formDataCopy: {
        orgId: '',
        keyPartId: '',
        keyPartType: '',
        subSystem: '',
        assetCode: '',
        uniqueId: '',
        name: '',
        brand: '',
        brandName: '',
        modelNum: '',
        username: '',
        password: '',
        ip: '',
        port: '',
        sdk: '',
        accessProtocol: '',
        accessService: '',
        wallId: '',
        type: '',
        inputNumber: '',
        outputNumber: '',
        serialCode: '',
        decoderNumber: '',
        orgName: '', // 发送请求时，删除
        keyPartName: '', // 删除
        typeName: '',
        wallName: ''
      },
      changeTv_type: false, // 修改所属电视墙时，触发修改电视墙接口
      btnArr: ['通道管理', '事件管理'],
      modalTitle: '新增解码设备',
      changeOrCreatBtn: false,
      multipleSelection: [],
      isEditDetector: false, // 本地终端输入 新增or修改
      isEditOutput: false, // 控制输出通道新增or编辑弹框显隐
      bdChanneData: {
        // 本地终端输入修改数据
        name: '',
        serise: '',
        inputType: '',
        inputTypeName: '',
        ratio: '',
        brand: '',
        brandName: '',
        modelNum: '',
        assetCode: ''
      },
      OutChanneData: {
        // 输出通道列表
        name: '',
        serise: '',
        ratio: '',
        brand: '',
        brandName: '',
        inputType: '',
        inputTypeName: '',
        modelNum: '',
        assetCode: ''
      },
      changPage: 0,
      pageFlag: true, // 页面切换开关
      value: '',
      checked: false,
      tableData: [],
      LedtableData: [],
      tableColumn: [
        {
          mark: 'name',
          label: '本地终端输入名称',
          width: '120'
        },
        {
          mark: 'serise',
          label: '本地终端输入号',
          width: '120'
        },
        {
          mark: 'extend2',
          label: '位置',
          width: ''
        },
        {
          mark: 'inputTypeName',
          label: '接口类型',
          width: ''
        },
        {
          mark: 'ratio',
          label: '分辨率',
          width: ''
        },
        {
          mark: 'brand',
          label: '品牌',
          width: ''
        },
        {
          mark: 'modelNum',
          label: '型号',
          width: ''
        },
        {
          mark: 'assetCode',
          label: '资源编码',
          width: ''
        }
      ],
      LedtableColumn: [
        {
          mark: 'name',
          label: '输出通道名称',
          width: '120'
        },
        {
          mark: 'serise',
          label: '输出通道号',
          width: ''
        },
        {
          mark: 'inputTypeName',
          label: '接口类型',
          width: ''
        },
        {
          mark: 'ratio',
          label: '分辨率',
          width: ''
        },
        {
          mark: 'brand',
          label: '品牌',
          width: ''
        },
        {
          mark: 'modelNum',
          label: '型号',
          width: ''
        },
        {
          mark: 'assetCode',
          label: '资源编码',
          width: ''
        }
      ],
      /**
       * 字典数据:所属电视墙
       * */
      devModelList2: [],
      // 接入服务下拉选项
      devModelList4: [],
      // 设备品牌下拉选项
      devModelList: [],
      devBrandList: [
        // 解码设备类型下拉选项
        { label: '解码拼控一体机', value: '解码拼控一体机' },
        { label: '解码器', value: '解码器' }
      ],
      // 型号
      devModelList3: [],
      devModelList1: [
        // 异常下拉选项
        { label: '网络断开', value: '网络断开' },
        { label: '时间异常', value: '时间异常' }
      ],
      dropdownStatus: {
        detector: true,
        output: true
      }
    }
  },
  created() { },
  mounted() {
    if (this.formData.brand === 'Hikvision') {
      this.formData['brandName'] = '海康威视'
    } else if (this.formData.brand === 'Bstar') {
      this.formData['brandName'] = '蓝色星际'
    }
    this.formDataCopy = JSON.parse(JSON.stringify(this.formData)) // 克隆(避免直接修改vue里的数据)
    this.initializationMethod() // 调用页面初始化函数
  },
  beforeDestroy() { },
  methods: {
    ...mapMutations(['SET_COMPONENTID1', 'SET_TVWALL_MESSAGE', 'SET_COMPONENTID2']),
    ...mapActions([
      'changeDecodingDevice',
      'getDecodingLocalCannalList',
      'creatDecodingLocalCannal',
      'deleteDecodingLocalCannal',
      'changeDecodingLocalCannal',
      'getTvWallMenuList',
      'chanegeTvWallApi',
      'getdictionariesdata',
      'getservice',
      'getDecodingLocalCannal',
      'geOutCannalB20Api',
      'getOutCannalM3Api'
    ]),
    // 页面初始化函数
    initializationMethod() {
      this.getCannalList(1) // 根据设备id获取设备本地终端输入列表
      this.getCannalOutList(1) // 根据设备id获取输出列表
      this.Tvdictionaries() // 初始化获取字典数据
      this.getservicelist() // 获取接入服务器数据
      console.log(this.formDataCopy.type)
      // debugger
      let queryList
      if (this.formDataCopy.type === 1) {
        // 解码器
        queryList = [
          { type: '1', moduleId: '1', childModuleId: '8', dictId: '3' } // dictId:品牌是3  型号是4
        ]
      } else if (this.formDataCopy.type === 2) {
        // 解码拼控一体机
        queryList = [
          { type: '1', moduleId: '1', childModuleId: '8', dictId: '6' } // dictId:品牌是6  型号是7
        ]
      }

      this.getTypeMethod(queryList, 1)
    },
    getTvWallTreeApi(params) {
      return getTvWallTreeApi(params)
    },
    getLazyTreeSearchApi(params) {
      params = {
        key: params.search
      }
      return searchTreeToWallApi(params)
    },
    selectData2(val) {
      this.devModelList3.map(item => {
        if (item.value === val) {
          this.formDataCopy.sdk = item.sdk
        }
      })
    },
    // 点击机构树的节点
    onceClick(data, node) {
      if (data.tierType === 'org') {
        this.formDataCopy.orgName = data.name
        this.formDataCopy.orgId = data.id
      } else {
        let parentNode = node.parent
        if (!parentNode) {
          return
        }
        this.formDataCopy.orgId = (parentNode.data && node.parent.data.id) || ''
        this.formDataCopy.orgName = (parentNode.data && node.parent.data.name) || ''
        this.formDataCopy.keyPartId = data.id
        this.formDataCopy.keyPartName = data.name
      }
    },
    // 修改解码设备信息成功，将修改的信息传出去(在详细信息页面接收)
    succfulMethod() {
      this.$refs['addForm'].validate(valid => {
        this.$refs['addForm2'].validate(valid2 => {
          if (valid && valid2) {
            let changeTvWallData = JSON.parse(JSON.stringify(this.formDataCopy))
            delete this.formDataCopy.orgName
            delete this.formDataCopy.keyPartName
            delete this.formDataCopy.typeName
            this.changeDecodingDevice(this.formDataCopy)
              .then(res => {
                if (res.data.code === 0) {
                  this.succefullMethod('修改成功')
                  if (this.formIndex === 'list') {
                    this.SET_COMPONENTID1('decodingList') // 从列表中来，回到列表
                  } else {
                    this.SET_COMPONENTID2('add') // 从列表进入查看
                    this.SET_TVWALL_MESSAGE(changeTvWallData) // 将信息传递到详情页面
                    this.SET_COMPONENTID1('newDeconmessage')
                  }
                  /**
                   * 如果修改解码设备中的所属电视墙时，必须触发修改电视墙接口
                   * */
                  if (this.changeTv_type) {
                    let params = {
                      id: this.formDataCopy.wallId,
                      type: this.formDataCopy.type
                    }
                    this.chanegeTvWallApi(params)
                      .then(res => {
                        if (res.data.code === 0) {
                          this.changeTv_type = false // 修改成功，关闭
                        }
                      })
                      .catch(err => {
                        console.log(err)
                      })
                  }
                } else {
                  this.failureMethod('修改解码设备失败')
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
      })
    },
    // 跳转到列表页
    skipToList() {
      this.SET_COMPONENTID1('decodingList')
    },
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
      if (this.dropdownStatus[key]) {
        Object.keys(this.dropdownStatus).forEach(item => {
          if (item !== key) {
            this.dropdownStatus[item] = true
          }
        })
      }
    },
    // btn切换
    changeWho(label, index) {
      this.changPage = index
      if (label === '通道管理') {
        this.pageFlag = true
      } else {
        this.pageFlag = false
      }
    },
    // 事件管理(取消)
    abnormalDis() {
      this.changPage = 0
      this.pageFlag = true
    },
    // 事件管理(保存)
    abnormalSave() {
      // 点击保存，发送请求
      this.changPage = 0
      this.pageFlag = true
    },
    // 本地终端输入列表数据选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 新增本地终端输入通道
    openAddModal() {
      this.changeOrCreatBtn = true // 显示保存按钮
      this.modalTitle = '新增本地终端输入通道'
      this.isEditDetector = true
      this.bdChanneData = {
        name: '',
        serise: '',
        inputType: '',
        inputTypeName: '',
        ratio: '',
        brand: '',
        modelNum: '',
        assetCode: ''
      }
      let queryList = [
        // 本地终端输入品牌下拉列表
        { type: '1', moduleId: '1', childModuleId: '8', dictId: '13' } // dictId:品牌是13  型号是14
      ]
      this.getTypeMethod(queryList, 1)
    },
    // 编辑本地终端输入通道
    openEditModal() {
      if (this.multipleSelection.length === 1) {
        this.changeOrCreatBtn = false // 显示修改按钮
        this.bdChanneData = this.multipleSelection[0]
        this.modalTitle = '修改本地终端输入通道'
        this.isEditDetector = true
      } else {
        this.failureMethod('请正确选择要修改的数据')
      }
    },
    openAddOutputModal() {
      this.changeOrCreatBtn = true // 显示保存按钮
      this.modalTitle = '新增输出通道'
      this.isEditOutput = true
      this.OutChanneData = {
        // 输出通道列表
        name: '',
        serise: '',
        ratio: '',
        brand: '',
        modelNum: '',
        assetCode: ''
      }
      let queryList = [
        // 输出通道品牌下拉列表
        { type: '1', moduleId: '1', childModuleId: '8', dictId: '16' } // dictId:品牌是16  型号是17
      ]
      this.getTypeMethod(queryList, 1)
    },
    openEditOutputModal() {
      if (this.multipleSelection.length === 1) {
        this.changeOrCreatBtn = false // 显示修改按钮
        this.OutChanneData = this.multipleSelection[0]
        this.modalTitle = '编辑输出通道'
        this.isEditOutput = true
      } else {
        this.failureMethod('请正确选择要修改的数据')
      }
    },
    // 修改品牌
    changeBrand(val) {
      if (val === '海康威视') {
        this.formDataCopy.brandName = '海康威视'
        this.formDataCopy.brand = 'Hikvision'
      } else if (val === '蓝色星际') {
        this.formDataCopy.brandName = '蓝色星际'
        this.formDataCopy.brand = 'Bstar'
      }
      this.formDataCopy.modelNum = ''
      for (let i = 0; i < this.devModelList.length; i++) {
        if (this.devModelList[i].value === val) {
          let queryList
          if (this.formDataCopy.type === 1) {
            // 解码器所对应的品牌对应的型号
            queryList = [
              { type: '1', moduleId: '1', childModuleId: '8', dictId: '4', homeClass: this.devModelList[i].label } // dictId:品牌是3  型号是4
            ]
          } else if (this.formDataCopy.type === 2) {
            // 拼控一体机对应品牌所对应的型号
            queryList = [
              { type: '1', moduleId: '1', childModuleId: '8', dictId: '7', homeClass: this.devModelList[i].label } // dictId:品牌是6  型号是7
            ]
          }

          this.getTypeMethod(queryList, 2)
        }
      }
    },
    // 新增/修改本地终端输入修改品牌
    changeBrand1(val) {
      if (val === '海康') {
        this.bdChanneData.brandName = '海康'
        this.bdChanneData.brand = 'Hikvision'
      } else if (val === '蓝色星际') {
        this.bdChanneData.brandName = '蓝色星际'
        this.bdChanneData.brand = 'Bstar'
      }
      for (let i = 0; i < this.devModelList.length; i++) {
        if (this.devModelList[i].value === val) {
          let queryList = [
            { type: '1', moduleId: '1', childModuleId: '8', dictId: '14', homeClass: this.devModelList[i].label } // dictId:主机是2  探测器是7
          ]
          this.getTypeMethod(queryList, 2)
        }
      }
    },
    // 新增/修改输出修改品牌
    changeBrand2(val) {
      if (val === '海康') {
        this.OutChanneData.brandName = '海康'
        this.OutChanneData.brand = 'Hikvision'
      } else if (val === '蓝色星际') {
        this.OutChanneData.brandName = '蓝色星际'
        this.OutChanneData.brand = 'Bstar'
      }
      for (let i = 0; i < this.devModelList.length; i++) {
        if (this.devModelList[i].value === val) {
          let queryList = [
            { type: '1', moduleId: '1', childModuleId: '8', dictId: '17', homeClass: this.devModelList[i].label } // dictId:主机是2  探测器是7
          ]
          this.getTypeMethod(queryList, 2)
        }
      }
    },
    // 重置
    resetMethod() {
      this.formDataCopy = {
        orgId: '',
        keyPartId: '',
        keyPartType: '',
        subSystem: '',
        assetCode: '',
        uniqueId: '',
        name: '',
        brand: '',
        modelNum: '',
        username: '',
        password: '',
        ip: '',
        sdk: '',
        port: '',
        accessProtocol: '',
        accessService: '',
        wallId: '',
        type: '',
        inputNumber: '',
        outputNumber: '',
        serialCode: '',
        decoderNumber: '',
        orgName: '', // 发送请求时，删除
        keyPartName: '', // 删除
        typeName: ''
      }
    },
    // 确认删除弹框
    deviceModel(val, index) {
      console.log(index)
      // debugger
      let title = '确定删除' + val + '吗?' + ',是否继续?'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {}
          let delectArr = []
          this.multipleSelection.map(item => {
            delectArr.push(item.id)
          })
          params.ids = delectArr.join()
          this.deleteDecodingLocalCannal(params)
            .then(res => {
              if (res.data.code === 0) {
                this.succefullMethod('删除成功')
                this.multipleSelection = [] // 清空数据
                if (index === 1) {
                  this.getCannalList(1) // 刷新本地终端输入列表
                } else if (index === 2) {
                  this.getCannalOutList(1)
                }
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 刷新函数
    refreshMethod(index) {
      if (index === 1) {
        this.getCannalList(2)
      } else if (index === 2) {
        this.getCannalOutList(2)
      }
    },
    // 删除函数
    delectMethod(val) {
      if (val === 1) {
        if (this.multipleSelection.length === 0) {
          this.failureMethod('请选择要删除的本地终端输入数据')
        } else {
          this.deviceModel('该本地终端输入', val)
        }
      } else if (val === 2) {
        if (this.multipleSelection.length === 0) {
          this.failureMethod('请选择要删除的输出通道数据')
        } else {
          this.deviceModel('该输出通道', val)
        }
      }
    },
    // 根据设备id获取设备本地终端输入列表
    getCannalList(val) {
      let params = {
        page: 1,
        limit: 200,
        orgId: this.formDataCopy.orgId,
        keyPartId: this.formDataCopy.keyPartId,
        type: 2,
        deviceId: this.formDataCopy.id
      }
      this.getDecodingLocalCannalList(params)
        .then(res => {
          if (res.data.code === 0) {
            if (val === 2) {
              this.succefullMethod('刷新成功')
            }
            this.tableData = res.data.data.channels
            this.tableData.map(item => {
              item['inputTypeName'] =
                item.inputType === 1 ? 'HDMI' : item.inputType === 2 ? 'DVI' : item.inputType === 3 ? 'VGA' : ''
            })
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据设备id获取设备本地终端输入列表(获取设备真实数据)
    getCannalList_true() {
      let params = {
        id: this.formDataCopy.id
      }
      this.getDecodingLocalCannal(params)
        .then(res => {
          if (res.data.code === 0) {
            this.getCannalList(1)
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据设备id获取设备输出通道(b20/m3/解码器+拼控)列表(获取设备真实数据)
    getOutCannalList_true() {
      let params = {
        id: this.formDataCopy.id
      }
      if (this.formDataCopy.type === 1) {
        // m3真实输出通道
        this.getOutCannalM3Api(params)
          .then(res => {
            if (res.data.code === 0) {
              this.getCannalOutList(1)
            } else {
              this.failureMethod('请求失败')
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else if (this.formDataCopy.type === 2 || this.formDataCopy.type === 4) {
        // b20真实输出通道
        this.geOutCannalB20Api(params)
          .then(res => {
            if (res.data.code === 0) {
              this.getCannalOutList(1)
            } else {
              this.failureMethod('请求失败')
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    //  根据设备id获取输出通道列表
    getCannalOutList(val) {
      let params = {
        page: 1,
        limit: 200,
        orgId: this.formDataCopy.orgId,
        keyPartId: this.formDataCopy.keyPartId,
        type: 1,
        deviceId: this.formDataCopy.id
      }
      this.getDecodingLocalCannalList(params)
        .then(res => {
          if (res.data.code === 0) {
            if (val === 2) {
              this.succefullMethod('刷新成功')
            }
            if (res.data.data.channels) {
              this.LedtableData = res.data.data.channels
              this.LedtableData.map(item => {
                item['inputTypeName'] =
                  item.inputType === 1
                    ? 'HDMI'
                    : item.inputType === 2
                      ? 'DVI'
                      : item.inputType === 3
                        ? 'VGA'
                        : item.inputType === 4
                          ? 'BNC'
                          : ''
              })
            } else {
              this.LedtableData = []
            }
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 保存/修改本地终端输入
    saveDecodData(val) {
      this.$refs['addLocalForm'].validate(valid => {
        if (valid) {
          this.bdChanneData.inputType =
            this.bdChanneData.inputTypeName === 'HDMI'
              ? 1
              : this.bdChanneData.inputTypeName === 'DVI'
                ? 2
                : this.bdChanneData.inputTypeName === 'VGA'
                  ? 3
                  : ''
          this.bdChanneData.orgId = this.formDataCopy.orgId
          this.bdChanneData.keyPartId = this.formDataCopy.keyPartId
          this.bdChanneData.deviceId = this.formDataCopy.id
          this.bdChanneData.type = 2
          this.bdChanneData.updatedBy = ''
          this.bdChanneData.updatedDept = ''
          if (val === 1) {
            // 新建保存
            if (this.tableData.length < this.formDataCopy.inputNumber) {
              this.creatDecodingLocalCannal(this.bdChanneData)
                .then(res => {
                  if (res.data.code === 0) {
                    this.succefullMethod('本地终端输入通道新建成功')
                    this.getCannalList(1) // 刷新本地终端输入列表
                    this.isEditDetector = false
                  } else {
                    this.failureMethod('请求失败')
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            } else {
              this.failureMethod('通道已达上限')
            }
          } else if (val === 2) {
            // 修改保存
            this.changeDecodingLocalCannal(this.bdChanneData)
              .then(res => {
                if (res.data.code === 0) {
                  this.succefullMethod('本地终端输入通道修改成功')
                  this.getCannalList(1) // 刷新本地终端输入列表
                  this.isEditDetector = false
                } else {
                  this.failureMethod('请求失败')
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      })
    },
    // 保存/修改输出通道
    saveOutChannlData(val) {
      this.$refs['addInputForm'].validate(valid => {
        if (valid) {
          this.OutChanneData.inputType =
            this.OutChanneData.inputTypeName === 'HDMI'
              ? 1
              : this.OutChanneData.inputTypeName === 'DVI'
                ? 2
                : this.OutChanneData.inputTypeName === 'VGA'
                  ? 3
                  : this.OutChanneData.inputTypeName === 'BNC'
                    ? 4
                    : ''
          this.OutChanneData.orgId = this.formDataCopy.orgId
          this.OutChanneData.keyPartId = this.formDataCopy.keyPartId
          this.OutChanneData.deviceId = this.formDataCopy.id
          this.OutChanneData.type = 1
          this.OutChanneData.updatedBy = ''
          this.OutChanneData.updatedDept = ''
          if (val === 1) {
            // 新建保存
            if (this.LedtableData.length < this.formDataCopy.outputNumber) {
              this.creatDecodingLocalCannal(this.OutChanneData)
                .then(res => {
                  if (res.data.code === 0) {
                    this.succefullMethod('输出通道新建成功')
                    this.getCannalOutList(1) // 刷新输出通道列表
                    this.isEditOutput = false
                  } else {
                    this.failureMethod('请求失败')
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            } else {
              this.failureMethod('通道已达上限')
            }
          } else if (val === 2) {
            // 修改保存
            this.changeDecodingLocalCannal(this.OutChanneData)
              .then(res => {
                if (res.data.code === 0) {
                  this.succefullMethod('输出通道修改成功')
                  this.getCannalOutList(1) // 刷新输出通道列表
                  this.isEditOutput = false
                } else {
                  this.failureMethod('请求失败')
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      })
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
    },
    /**
     * select框选中时触发
     * */
    changeTv(val) {
      this.changeTv_type = true // 激活修改电视墙
      this.formDataCopy.wallId = val
    },
    /*********************************************
     * 字典数据
     * 所有字典数据以dictionaries结尾
     */
    Tvdictionaries() {
      // 所属电视墙字典
      this.getTvWallMenuList()
        .then(res => {
          res.data.data.results.map(item => {
            let obj = { label: '', value: '' }
            obj.label = item.name
            obj.value = item.id
            this.devModelList2.push(obj)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    getservicelist() {
      // 接入服务器
      this.getservice()
        .then(res => {
          this.devModelList4 = []
          for (let i = 0; i < res.data.length; i++) {
            let tempData = {
              label: res.data[i],
              value: res.data[i]
            }
            this.devModelList4.push(tempData)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getTypeMethod(args, num) {
      this.getdictionariesdata({ queryList: args })
        .then(res => {
          console.log(res, 'res============================')
          console.log(res.data.data[0].attr, '数据字典接口返回=========')
          if (num === 1) {
            this.devModelList = []
            for (let i = 0; i < res.data.data[0].attr.length; i++) {
              let tempData = {
                label: res.data.data[0].attr[i].data,
                value: res.data.data[0].attr[i].data
              }
              this.devModelList.push(tempData)
            }
            console.log(this.devModelList, 'this.devModelList=====')
          }
          if (num === 2) {
            this.devModelList3 = []
            for (let i = 0; i < res.data.data[0].attr.length; i++) {
              let tempData = {
                label: res.data.data[0].attr[i].data,
                value: res.data.data[0].attr[i].data,
                sdk: res.data.data[0].attr[i].sdkName
              }
              this.devModelList3.push(tempData)
            }
            console.log(this.devModelList3, 'this.devModelList3=====')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  .left-tree {
    width: 240px;
    height: 100%;
    position: absolute;
    border-right: 1px solid #e1e1e1;
  }
  .right-content {
    height: 100%;
    width: calc(~'100% - 240px');
    position: absolute;
    left: 240px;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    .table-box {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
}
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
.messageWrap {
  width: 860px;
}
.messagetitle {
  margin: 10px 0;
  font-weight: 600;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.right-form /deep/ .el-input--mini .el-input__inner {
  width: 250px;
}
.left-form /deep/ .el-input--mini .el-input__inner {
  width: 270px;
}
.form-content {
  display: flex;
  width: 100%;
  padding: 15px 15px 0 15px;
  font-size: 12px;
  justify-content: center;
  border: 1px solid #f2f2f2;
  .left-form {
    width: 380px;
    margin-right: 24px;
  }
  .right-form {
    width: 380px;
  }
}
.tableWrap {
  margin-top: 15px;
}
.tableWrap .title {
  cursor: pointer;
  font-size: 12px;
  padding: 15px 5px;
  display: inline-block;
  width: 156px;
}
.tableWrap .title i {
  font-size: 14px;
  margin-left: 15px;
}
.maLeft {
  margin-left: 10px !important;
}
.footer {
  margin-top: 30px;
  width: 100%;
  border: 1px solid #f2f2f2;
  height: 40px;
}
.footer ul {
  font-size: 12px;
  display: flex;
}
.footer ul li {
  display: flex;
  justify-content: space-between;
}
.footer .title {
  text-align: center;
  width: 110px;
  height: 40px;
  background: #f5f5f5;
  line-height: 40px;
}
.footer .const {
  width: 176px;
  height: 100%;
  text-align: center;
  line-height: 40px;
}
.maBottom {
  margin-bottom: 14px !important;
}
.list-header {
  text-align: right;
  i {
    cursor: pointer;
    margin-right: 6px;
  }
}
.form-footer {
  margin-top: 12px;
  width: 830px;
  text-align: center;
}
.box-title {
  position: relative;
  height: 24px;
  line-height: 24px;
  color: #606266;
  i {
    position: absolute;
    top: 50%;
    left: 100px;
    transform: translateY(-50%);
  }
  &::after {
    display: block;
    content: '';
    border-top: 1px solid #e1e1e1;
    width: calc(~'100% - 120px');
    margin-left: 130px;
    margin-top: -12px;
  }
}
.pointer {
  cursor: pointer;
  display: inline-block;
  width: 130px;
  font-size: 12px;
}
// 新建底部样式
.last-title .active-tab {
  color: #fff;
  background: #2d72d3;
}
.last-title {
  margin-bottom: 10px;
}
.last-title ul {
  display: flex;
}
.last-title ul li {
  font-size: 12px;
  width: 80px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid gainsboro;
}
.channeWrap {
  width: 500px;
}
.channe-title {
  width: 80px;
  border-radius: 3px;
  margin-left: 15px;
  height: 35px;
  font-size: 12px;
  text-align: center;
  border: 1px solid gainsboro;
  line-height: 35px;
}
.channe-contend {
  display: flex;
  align-items: center;
  margin-top: 20px;
  font-size: 12px;
  margin: 20px 0 20px 40px;
}
.channe-contend-title {
  margin-right: 10px;
}
.channe-contend-const {
  margin-right: 10px;
}
.channe-contend-const /deep/ .el-input--suffix .el-input__inner {
  height: 30px;
}
.channe-contend-const /deep/ .el-input__icon {
  line-height: 26px;
}
.channe-footer {
  text-align: right;
}
.model-wrap /deep/ .el-dialog__header {
  padding: 10px 20px 10px;
  border-bottom: 1px solid gainsboro;
}
.model-wrap /deep/ .el-dialog__title {
  font-size: 14px;
  font-weight: bolder;
}
.model-wrap /deep/ .el-dialog__headerbtn {
  top: 15px;
}
.model-wrap /deep/ .el-dialog__body {
  padding: 24px 20px;
}
.model-wrap /deep/ .el-dialog__header {
  padding: 10px 20px 10px;
  border-bottom: 1px solid gainsboro;
}
.model-wrap /deep/ .el-dialog__title {
  font-size: 14px;
  font-weight: bolder;
}
.model-wrap /deep/ .el-dialog__headerbtn {
  top: 15px;
}
.model-wrap /deep/ .el-dialog__body {
  padding: 24px 20px;
}
</style>
