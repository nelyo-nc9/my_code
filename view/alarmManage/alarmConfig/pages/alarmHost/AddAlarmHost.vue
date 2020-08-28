<template>
  <div class="content">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTreeApi"
        searchType="search"
        :treeType="treeType"
        @clickData = 'clickData'
        @onceClick="onceClick"
        treeLazyToggle iconToggle
        :lazyTreeSearchApi="getLazyTreeSearchApi"
        :customizeQuery="customizeQuery"></treeBox>
    </div>
    <div class="right-content">
      <div class="top-box" v-show="!moveShow && !sortHostShow">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>报警管理</el-breadcrumb-item>
            <el-breadcrumb-item>报警主机配置</el-breadcrumb-item>
            <el-breadcrumb-item>新建</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box" v-show="saveDetails && !printStatus">
          <el-button size="mini" icon="el-icon-plus" @click="newAlarmHost(1)">新建</el-button>
          <el-button size="mini" icon="el-icon-edit-outline" @click="newAlarmHost(2)">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" @click="isDelete(4)">删除</el-button>
          <el-button size="mini" class="el-icon-document-copy" @click="newAlarmHost(3)">复制</el-button>
          <el-button size="mini" class="icon el-icon-sort" @click="sort">排序</el-button>
          <el-button size="mini" icon="icon iconfont-ccb ccbqianyi el-icon-" @click="move">迁移</el-button>
          <el-button size="mini" icon="el-icon-printer" @click="print">打印</el-button>
        </div>
        <div class="button-box" v-show="printStatus">
          <el-button type="primary" size="mini" @click="Toprint">打印</el-button>
          <el-button size="mini" @click="closeDetail">取消</el-button>
        </div>
      </div>
      <div class="form-box" v-show="!moveShow && !sortHostShow" id="print-gplot">
        <div class="form-title">报警主机设备</div>
        <div class="form-content up-style" v-show="!saveDetails">
          <div class="left-form">
            <el-form :rules="rules" ref="addForm1" size="mini" :model="formData" label-position="right" label-width="110px">
              <el-form-item label="所属机构" required prop="orgId">
                <el-input disabled v-model="orgObj.name"></el-input>
              </el-form-item>
              <el-form-item label="设备类型" required prop="deviceType">
                <el-select v-model="formData.deviceType" @change="changeType">
                  <el-option
                    v-for="item in devTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备品牌" required prop="brand">
                <el-select v-model="formData.brand" @change="changeBrand">
                  <el-option
                    v-for="item in devBrandList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="网络模块品牌" required prop="netModuleBrand">
                <el-select v-model="formData.netModuleBrand" @change="changenetBrandList" :disabled="disabledNet">
                  <el-option
                    v-for="item in netBrandList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="所属子系统">
                <el-input disabled v-model="formData.subsystem"></el-input>
              </el-form-item> -->
              <el-form-item label="网络模块ID" prop="netModuleID">
                <el-input v-model="formData.netModuleID" :disabled="disabledNet"></el-input>
              </el-form-item>
              <el-form-item label="IP地址" required prop="ip">
                <el-input v-model="formData.ip"></el-input>
              </el-form-item>
              <el-form-item label="用户名" required prop="userName">
                <el-input v-model="formData.userName"></el-input>
              </el-form-item>
              <el-form-item label="所属服务" required prop="service">
                <el-select v-model="formData.service">
                  <el-option
                    v-for="item in serverList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="输出通道数量" required prop="outputNo">
                <el-input v-model="formData.outputNo"></el-input>
              </el-form-item>
              <el-form-item label="资产编码" required prop="code">
                <el-input v-model="formData.code"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="right-form">
            <el-form :rules="rules" ref="addForm2" size="mini" :model="formData" label-position="right" label-width="110px">
              <el-form-item label="所属重点部位" required prop="locName">
                <el-input v-model="formData.locName" disabled></el-input>
                <!-- <el-select v-model="formData.locationId">
                  <el-option
                    v-for="item in positionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select> -->
              </el-form-item>
              <el-form-item label="设备名称" required prop="name">
                <el-input placeholder="输入设备名称" v-model="formData.name"></el-input>
              </el-form-item>
              <el-form-item label="设备型号" required prop="deviceModel">
                <el-select v-model="formData.deviceModel">
                  <el-option
                    v-for="item in devModelList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="网络模块型号" required prop="netModuleModel">
                <el-select v-model="formData.netModuleModel" :disabled="disabledNet">
                  <el-option
                    v-for="item in netTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="键盘密码" required prop="keyboardPassword">
                <el-input v-model="formData.keyboardPassword" show-password></el-input>
              </el-form-item>
              <el-form-item label="网络端口" required prop="port">
                <el-input v-model.number="formData.port"></el-input>
              </el-form-item>
              <el-form-item label="密码" required prop="password">
                <el-input v-model="formData.password" show-password></el-input>
              </el-form-item>
              <!-- <el-form-item label="网域" required>
                <el-input v-model="formData.domain"></el-input>
              </el-form-item> -->
              <el-form-item label="报警防区数量" required prop="detectorNo">
                <el-input v-model="formData.detectorNo"></el-input>
              </el-form-item>
              <el-form-item label="子系统数量" required prop="subsystemNo">
                <el-input v-model="formData.subsystemNo"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="form-content center-style" v-show="saveDetails">
          <div class="left-form">
            <div class="detile-item">
              <span class="item-left">所属机构</span>
              <span class="item-right">{{formData.orgId}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">设备类型</span>
              <span class="item-right">{{getDeviceType(formData.deviceType)}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">设备品牌</span>
              <span class="item-right">{{getDeviceBand(formData.brand)}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">网络模块品牌</span>
              <span class="item-right">{{formData.netModuleBrand}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">网络模块ID</span>
              <span class="item-right">{{formData.netModuleID}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">IP地址</span>
              <span class="item-right">{{formData.ip}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">所属服务</span>
              <span class="item-right" :title="formData.service">{{formData.service}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">输出通道数量</span>
              <span class="item-right">{{formData.outputNo}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">资产编码</span>
              <span class="item-right">{{formData.code}}</span>
            </div>
          </div>
          <div class="right-form">
            <div class="detile-item">
              <span class="item-left">所属重点部位</span>
              <span class="item-right">{{singleHostData.locName}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">设备名称</span>
              <span class="item-right">{{formData.name}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">设备型号</span>
              <span class="item-right">{{getDeviceModel(formData.deviceModel)}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">网络模块类型</span>
              <span class="item-right">{{formData.netModuleModel}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">键盘密码</span>
              <span class="item-right">{{formData.keyboardPassword}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">网络端口</span>
              <span class="item-right">{{formData.port}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">报警防区数量</span>
              <span class="item-right">{{formData.detectorNo}}</span>
            </div>
            <div class="detile-item">
              <span class="item-left">子系统数量</span>
              <span class="item-right">{{formData.subsystemNo}}</span>
            </div>
          </div>
        </div>
        <div class="form-content bottom-style">
          <div class="detile-item">
            <span class="item-left">录入时间</span>
            <span class="item-right">{{singleHostData.updatedAt}}</span>
          </div>
          <div class="detile-item">
            <span class="item-left">录入机构</span>
            <span class="item-right">{{singleHostData.createdDept}}</span>
          </div>
          <div class="detile-item">
            <span class="item-left">录入人</span>
            <span class="item-right">{{singleHostData.createdBy}}</span>
          </div>
        </div>
        <div class="form-footer">
          <el-button type="primary" size="mini" @click="saveAlarmHost" v-show="!saveDetails">保存</el-button>
          <el-button size="mini" @click="skipToList" v-show="!saveDetails">取消</el-button>
          <el-button type="primary" size="mini" v-show="!saveDetails" @click="reSetForm">重置</el-button>
        </div>
        <div class="bottom-box" v-show="(saveDetails  || editorShowList) && (!moveShow && !sortHostShow)">
          <div style="width:100%;">
            <div class="box-title">
              <span class="pointer" @click="toggleOpen('detector')">
                报警防区列表
                <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
            <div v-if="dropdownStatus.detector" style="width:80%;">
              <div class="list-header" v-show="!printStatus">
                <!-- <i class="el-icon-download" title="导入" @click="detectorImportModal"></i> -->
                <i class="el-icon-circle-plus-outline" title="新增" @click="openAddModal(1)"></i>
                <i class="el-icon-edit" title="编辑" @click="openEditModal(1)"></i>
                <i class="el-icon-delete" title="删除" @click="isDelete(1)"></i>
                <i class="el-icon-refresh-right" title="刷新"></i>
              </div>
              <el-table :data="detectorList" border style="width: 100%" height="201" size="mini" stripe @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column
                  v-for="item in detectorTableColumn"
                  :key="item.label"
                  :prop="item.prop"
                  :width="item.width"
                  :label="item.label"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="编辑">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div style="width:100%;">
            <div class="box-title">
              <span class="pointer" @click="toggleOpen('output')">
                输出通道列表
                <i :class="dropdownStatus.output ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
            <div v-if="dropdownStatus.output" style="width:80%;">
              <div class="list-header" v-show="!printStatus">
                <!-- <i class="el-icon-download" title="导入" @click="outputChannelImportModal"></i> -->
                <i class="el-icon-circle-plus-outline" title="新增" @click="openAddOutputModal"></i>
                <i class="el-icon-edit" title="编辑" @click="openEditOutputModal"></i>
                <i class="el-icon-delete" title="删除" @click="isDelete(2)"></i>
                <i class="el-icon-refresh-right" title="刷新"></i>
              </div>
              <el-table :data="outputList" border style="width: 100%" height="201" size="mini" stripe @selection-change="OutputChanSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column
                  v-for="item in outputTableColumn"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </div>
          <div style="width:100%;">
            <div class="box-title">
              <span class="pointer" @click="toggleOpen('subsystem')">
                子系统列表
                <i :class="dropdownStatus.subsystem ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
            <div v-if="dropdownStatus.subsystem" style="width:80%;">
              <div class="list-header" v-show="!printStatus">
                <!-- <i class="el-icon-download" title="导入" @click="subsystemImportModal"></i> -->
                <i class="el-icon-circle-plus-outline" title="新增" @click="openAddSystemModal"></i>
                <i class="el-icon-edit" title="编辑" @click="openEditSystemModal"></i>
                <i class="el-icon-delete" title="删除" @click="isDelete(3)"></i>
                <i class="el-icon-refresh-right" title="刷新"></i>
              </div>
              <el-table :data="subSystemList" border style="width: 100%" height="201" size="mini" stripe @selection-change="subsystemSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column
                  v-for="item in subSystemColumn"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <Move v-show="moveShow" :moveShow.sync="moveShow" :migrantData="migrantData" @aginGetSingleHost="aginGetSingleHost"></Move>
      <SortHost v-show="sortHostShow" ref="srotRef" :sortHostShow.sync="sortHostShow" :locationIdSort="singleHostData"></SortHost>
    </div>
    <!--探测器列表中的编辑弹框-->
    <el-dialog title="探测器编辑" :visible.sync="isOpenDetectorModal" :close-on-click-modal="false">
      <div class="list-header">
        <i class="el-icon-circle-plus-outline" title="新增" @click="openAddModal(2)"></i>
        <i class="el-icon-edit" title="编辑" @click="openEditModal(2)"></i>
        <i class="el-icon-delete" title="删除" @click="isDelete(5)"></i>
        <i class="el-icon-refresh-right" title="刷新"></i>
      </div>
      <el-table :data="noMaindetectorList" size="mini" border :height="205" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column
            v-for="item in noMainDetectorColumn"
            :key="item.label"
            :prop="item.prop"
            :label="item.label"
            show-overflow-tooltip
          ></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 探测器 新增or编辑 -->
    <el-dialog :title="modalTitle" :visible.sync="isEditDetector" width="400px" class="detecor-style" :close-on-click-modal="false">
      <el-form :rules="detectRules" ref="detectAddForm" :model="detectorData" size="mini" label-position="right" label-width="120px">
        <el-form-item label="探测器名称" required prop="name">
          <el-input v-model="detectorData.name"></el-input>
        </el-form-item>
        <el-form-item label="防区序号" required prop="serialNumber">
          <el-input v-model="detectorData.serialNumber" :disabled="isOpenDetectorModal"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" required prop="deviceType">
          <el-select v-model="detectorData.deviceType">
            <el-option
              v-for="item in detectorTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" required prop="count">
          <el-input v-model="detectorData.count"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="detectorData.brand" @change="changeDectorBrand">
            <el-option
              v-for="item in detectorBrandList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号">
          <el-select v-model="detectorData.model">
            <el-option
              v-for="item in detectorModelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产编码" required prop="code">
          <el-input v-model="detectorData.code"></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否关联" required>
          <el-select v-model="detectorData.associated" style="width:240px;">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="detectorData.remark"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center;">
        <el-button size="mini" type="primary" @click="saveDetector">保存</el-button>
        <el-button size="mini" @click="isEditDetector = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 输出通道 新增or编辑 -->
    <el-dialog :title="modalTitle" :visible.sync="isEditOutput" width="400px" class="output-style" :close-on-click-modal="false">
      <el-form :rules="outputRules" ref="outputAddForm" :model="outputChanData" size="mini" label-position="right" label-width="120px">
        <el-form-item label="输出通道名称" required prop="name">
          <el-input v-model="outputChanData.name"></el-input>
        </el-form-item>
        <el-form-item label="通道序号" required prop="serialNumber">
          <el-input v-model.number="outputChanData.serialNumber"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" required prop="deviceType">
          <el-select v-model="outputChanData.deviceType">
            <el-option
              v-for="item in outputChanTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="outputChanData.brand" @change="changeOutputBrand">
            <el-option
              v-for="item in outputChanBrandList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号">
          <el-select v-model="outputChanData.model">
            <el-option
              v-for="item in outputChanModelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产编码" required prop="code">
          <el-input v-model="outputChanData.code"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="outputChanData.remark"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center;">
        <el-button size="mini" type="primary" @click="saveOutputChan">保存</el-button>
        <el-button size="mini" @click="isEditOutput=false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 子系统 新增or编辑 -->
    <el-dialog :title="modalTitle" :visible.sync="isEditSystem" width="400px" class="subsystem-style" :close-on-click-modal="false">
      <el-form :rules="subsystemRules" ref="subsystemAddForm" :model="subsystemData" size="mini" label-position="right" label-width="120px">
        <el-form-item label="子系统名称" required prop="name">
          <el-input v-model="subsystemData.name"></el-input>
        </el-form-item>
        <el-form-item label="子系统序号" required prop="serialNumber">
          <el-input v-model.number="subsystemData.serialNumber"></el-input>
        </el-form-item>
        <el-form-item label="包含探测器" required prop="detectorCheckList">
          <div class="checkbox-style">
            <el-checkbox-group v-model="subsystemData.detectorCheckList">
              <el-checkbox v-for="item in detectorList" :key="item.id" :label="item.id" :disabled="item.isDisabled ? item.isDisabled : false">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="包含输出通道">
          <div class="checkbox-style">
            <el-checkbox-group v-model="checkList">
              <el-checkbox v-for="item in outputList" :key="item.id" :label="item.id" :disabled="item.isDisabled ? item.isDisabled : false">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <div style="text-align:center;">
        <el-button size="mini" type="primary" @click="saveSubsystem">保存</el-button>
        <el-button size="mini" @click="isEditSystem = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 探测器列表/输出通道列表/子系统列表导入公共弹框 -->
    <el-dialog :title="impotModalTitle" :visible.sync="isShowImport" width="450px" :close-on-click-modal="false">
      <el-input size="mini" style="width: 400px;float:left;margin-right:10px;">
        <template slot="prepend">选择导入文件</template>
        <el-upload slot="append" action="">
          <el-button size="mini" type="primary">浏览...</el-button>
        </el-upload>
      </el-input>
      <div slot="footer">
        <el-button size="mini" type="primary">导入</el-button>
        <el-button size="mini">重置</el-button>
        <el-button size="mini">覆盖</el-button>
        <el-button size="mini" type="primary">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="删除确认"
      :visible.sync="dialogVisible" :close-on-click-modal="false"
      width="30%">
      <span>{{promptText}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confDeleteDetector">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import { alarmGetTreeApi, alarmSearchTree } from '@src/http/alarm/alarmHostConfig.api.js' // alarmHostGetTreeApi
import Move from './Move'
import SortHost from './SortHost'
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  components: {
    treeBox,
    Move,
    SortHost
  },
  data() {
    return {
      outputChanModelList: [],
      outputChanBrandList: [],
      sortHostShow: false,
      migrantData: [], // 迁移弹窗的源数据
      moveShow: false,
      printStatus: false,
      detectorTypeList: [],
      detectorBrandList: [],
      detectorModelList: [],
      outputChanTypeList: [
      ],
      editorShowList: false,
      checkList: [],
      // detectorCheckList: [],
      treeType: 2,
      orgObj: {
        id: '',
        name: '' // 确认后端是否返回此字段？目前没有此字段
      },
      customizeQuery: {
        params: {
          subSystem: '2',
          isRecursion: '0'
        }
      },
      isMainDetector: true, // 是否是主探测器添加的保存，true：主探测器添加，false:从探测器添加
      isAddAlarmHost: true, // 是否是添加报警主机的保存，true：报警主机添加，false:报警主机修改
      saveDetails: false,
      formData: { // 新增or修改报警主机表单
        // 表单数据
        // subsystem: '报警子系统',
        locationId: '',
        locName: '',
        name: '',
        brand: '',
        netModuleBrand: '',
        netModuleID: '',
        ip: '',
        userName: '',
        service: '',
        detectorNo: '',
        subsystemNo: '',
        orgId: '',
        orgName: '',
        deviceType: '',
        code: '',
        deviceModel: '',
        netModuleModel: '',
        keyboardPassword: '',
        port: '',
        password: '',
        // domain: '',
        outputNo: ''
      },
      rules: {
        orgId: [ { required: true, message: ' ' } ],
        locName: [ { required: true, message: '重点部位不能为空' } ],
        netModuleID: [
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ],
        name: [
          { required: true, message: '设备名称不能为空' },
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ],
        brand: [ { required: true, message: '设备品牌不能为空' } ],
        netModuleBrand: [ { required: true, message: '网络模块品牌不能为空' } ],
        ip: [
              { required: true, message: 'IP地址不能为空' },
              {pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/, message: '请输入合法的IP'}
            ],
        userName: [
          { required: true, message: '用户名不能为空' },
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ],
        service: [ { required: true, message: '所属服务不能为空' } ],
        detectorNo: [
          { required: true, message: '探测器数量不能为空'},
          { required: true, pattern: '^[0-9]*$', message: '请填写正确探测器数量'}
        ],
        subsystemNo: [
          { required: true, message: '子系统数量不能为空'},
          { required: true, pattern: '^[0-9]*$', message: '请填写正确子系统数量'}
        ],
        outputNo: [
          { required: true, message: '输出通道数量不能为空' },
          { required: true, pattern: '^[0-9]*$', message: '请填写正确输出通道数量'}
        ],
        deviceType: [ { required: true, message: '设备类型不能为空' } ],
        code: [
          { required: true, message: '资产编码不能为空' },
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ],
        deviceModel: [ { required: true, message: '设备型号不能为空' } ],
        netModuleModel: [ { required: true, message: '网络模块型号不能为空' } ],
        keyboardPassword: [
          { required: true, message: '键盘密码不能为空' },
          { min: 0, max: 64, message: '最多可输入64个字符' }
        ],
        port: [
          { required: true, message: '网络端口不能为空' },
          { type: 'number', min: 0, max: 65535, message: '请填写0~65535范围端口' } ],
        password: [
          { required: true, message: '密码不能为空' },
          { min: 0, max: 64, message: '最多可输入64个字符' }
        ]
      },
      detectRules: {
        name: [ { required: true, message: '探测器名称不能为空' }, { min: 0, max: 128, message: '最多可输入128个字符' } ],
        serialNumber: [
          { required: true, message: '防区序号不能为空' },
          { required: true, pattern: '^[0-9]*$', message: '请输入正确的防区序号'}
        ],
        deviceType: [ { required: true, message: '设备类型不能为空' } ],
        count: [
          { required: true, message: '数量不能为空' },
          { required: true, pattern: '^[0-9]*$', message: '请输入正确的数量'}
        ],
        code: [ { required: true, message: '资产编码不能为空' }, { min: 0, max: 128, message: '最多可输入128个字符' } ],
        remark: [{ min: 0, max: 128, message: '最多可输入128个字符' }]
      },
      outputRules: {
        name: [ { required: true, message: '通道名称不能为空' } ],
        serialNumber: [
          { required: true, message: '通道序号不能为空' },
          { type: 'number', message: '请填写正确通道序号'}
        ],
        deviceType: [ { required: true, message: '设备类型不能为空' } ],
        code: [ { required: true, message: '资产编码不能为空' } ]
      },
      subsystemRules: {
        name: [ { required: true, message: '子系统名称不能为空' } ],
        serialNumber: [
          { required: true, message: '子系统序号不能为空'},
          { type: 'number', message: '请填写正确子系统序号'}
        ],
        detectorCheckList: [{ type: 'array', required: true, message: '包含探测器不能为空', trigger: 'change' }]
      },
      positionList: [],
      devBrandList: [
        // 设备品牌下拉选项
      ],
      phoneHostBrand: [
        { label: '枫叶', value: '枫叶' },
        { label: '博世', value: '博世' },
        { label: '霍尼韦尔', value: '霍尼韦尔' },
        { label: 'DSC', value: 'DSC' },
        { label: '时刻', value: '时刻' },
        { label: '声迅', value: '声迅' }
      ],
      netHostBrand: [
        { label: '海康威视', value: '海康威视' },
        { label: '英安特', value: '英安特' },
        { label: '大华', value: '大华' }
      ],
      elecfenceHostBrand: [
        { label: '上海广拓', value: '上海广拓' },
        { label: '上海长城', value: '上海长城' }
      ],
      vibratingFiberHostBrand: [
        { label: '上海广拓', value: '上海广拓' },
        { label: '润光泰力', value: '润光泰力' }
      ],
      netBrandList: [
        // 网络模块品牌下拉选项
        // { label: '霍尼韦尔', value: '霍尼韦尔' },
        // { label: '博世', value: '博世' },
        // { label: '海康威视', value: '海康威视' },
        // { label: '蓝色星际', value: '蓝色星际' },
        // { label: '时刻', value: '时刻' },
        // { label: '汇防', value: '汇防' }
      ],
      serverList: [
        // 所属服务下拉选项
      ],
      devTypeList: [
        // 设备类型下拉选项
        // { label: '电话报警主机', value: '电话报警主机' },
        // { label: '网络报警主机', value: '网络报警主机' },
        // { label: '电子围栏总线报警主机', value: '电子围栏总线报警主机' },
        // { label: '振动光纤报警主机', value: '振动光纤报警主机' }
      ],
      devModelList: [
        // 设备型号下拉选项
      ],
      mapleLeafModel: [
        { label: 'PA-728', value: 'PA-728' },
        { label: 'PA-738', value: 'PA-738' },
        { label: 'PA-748', value: 'PA-748' },
        { label: 'SP4000', value: 'SP4000' },
        { label: 'SP5500', value: 'SP5500' },
        { label: 'SP6000', value: 'SP6000' }
      ],
      boschModel: [
        { label: 'CC408', value: 'CC408' },
        { label: 'CC880', value: 'CC880' },
        { label: 'CMS40', value: 'CMS40' },
        { label: 'CMS8', value: 'CMS8' },
        { label: 'DS7240', value: 'DS7240' },
        { label: 'DS7400', value: 'DS7400' }
      ],
      HoneywellModel: [
        { label: 'CK-236', value: 'CK-236' },
        { label: 'CK-238', value: 'CK-238' },
        { label: 'CK-2316', value: 'CK-2316' },
        { label: '236PLUS', value: '236PLUS' },
        { label: '238PLUS', value: '238PLUS' },
        { label: '2316PLUS', value: '2316PLUS' },
        { label: '236SUPER', value: '236SUPER' },
        { label: '238SUPER', value: '238SUPER' },
        { label: '2316SUPER', value: '2316SUPER' },
        { label: 'Vista-20P', value: 'Vista-20P' },
        { label: 'Vista-120', value: 'Vista-120' },
        { label: 'Vista-128', value: 'Vista-128' }
      ],
      DSCModel: [
        { label: 'PC-585', value: 'PC-585' },
        { label: 'PC-1832', value: 'PC-1832' },
        { label: 'PC-1864', value: 'PC-1864' }
      ],
      timeModel: [
        { label: 'SK-216G', value: 'SK-216G' },
        { label: 'SK-239C', value: 'SK-239C' },
        { label: 'SK-239G', value: 'SK-239G' },
        { label: 'SK-3110G', value: 'SK-3110G' }
      ],
      shengXunModel: [
        { label: 'TS1106', value: 'TS1106' },
        { label: 'TS2313', value: 'TS2313' }
      ],
      hikvisionModel: [
        { label: 'DS-19A08-BN', value: 'DS-19A08-BN' },
        { label: 'DS-19A16-BN', value: 'DS-19A16-BN' }
      ],
      inantModel: [
        { label: 'AW-BM1600-16AJD', value: 'AW-BM1600-16AJD' },
        { label: 'AW-BM16008A-V36', value: 'AW-BM16008A-V36' },
        { label: 'NT316PLUS-TJK-XD', value: 'NT316PLUS-TJK-XD' }
      ],
      netTypeList: [
        // 网络模块类型下拉选项
      ],
      HoneywellNetType: [
        { label: 'IPM-23', value: 'IPM-23' },
        { label: 'IPM-VISTA', value: 'IPM-VISTA' }
      ],
      boschNetType: [
        { label: 'B426-CN', value: 'B426-CN' }
      ],
      hikvisionNetType: [
        { label: 'DS-19M00-MN/K（2300）', value: 'DS-19M00-MN/K（2300）' },
        { label: 'DS-19M00-MN/K（120）', value: 'DS-19M00-MN/K（120）' },
        { label: 'DS-19M00-MN/K（7400）', value: 'DS-19M00-MN/K（7400）' }
      ],
      bstarNetType: [
        { label: 'BSR-ALT0816N Plus', value: 'BSR-ALT0816N Plus' }
      ],
      timeNetType: [
        { label: 'SK-811', value: 'SK-811' }
      ],
      dropdownStatus: {
        detector: true,
        output: true,
        subsystem: true
      },
      detectorTableColumn: [
        // 主探测器列表项
        { prop: 'name', label: '探测器名称', width: '200' },
        { prop: 'serialNumber', label: '防区序号', width: '100' },
        { prop: 'deviceType', label: '设备类型', width: '120' },
        { prop: 'count', label: '数量', width: '100' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'model', label: '型号', width: '' },
        { prop: 'code', label: '资产编码', width: '' },
        { prop: 'remark', label: '备注', width: '' }
        // { prop: 'associated', label: '是否关联', width: '' }
      ],
      noMainDetectorColumn: [
        // 从探测器列表项
        { prop: 'name', label: '探测器名称', width: '' },
        { prop: 'serialNumber', label: '防区序号', width: '' },
        { prop: 'deviceType', label: '设备类型', width: '' },
        // { prop: 'count', label: '数量', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'model', label: '型号', width: '' },
        { prop: 'code', label: '资产编码', width: '' }
        // { prop: 'associated', label: '是否关联', width: '' }
      ],
      detectorList: [], // 探测器列表数据
      noMaindetectorList: [], // 从探测器列表数据
      outputTableColumn: [
        // 输出通道表格项
        { prop: 'name', label: '输出通道名称', width: '' },
        { prop: 'serialNumber', label: '通道序号', width: '' },
        { prop: 'deviceType', label: '设备类型', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'model', label: '型号', width: '' },
        { prop: 'code', label: '资产编码', width: '' },
        { prop: 'remark', label: '备注', width: '' }
      ],
      outputList: [], // 输出通道表格数据
      subSystemColumn: [
        // 子系统表格项
        { prop: 'name', label: '子系统名称', width: '' },
        { prop: 'serialNumber', label: '子系统序号', width: '' },
        { prop: 'hasDetector', label: '包含探测器', width: '' },
        { prop: 'hasOutput', label: '包含输出通道', width: '' }
      ],
      subSystemList: [], // 子系统列表数据
      hasAllDetectorString: '',
      hasAllDetectorArr: [],
      hasAllOutputString: '',
      hasAllOutputArr: [],
      modalTitle: '新增探测器',
      impotModalTitle: '导入探测器',
      isEditDetector: false, // 新增or修改
      isOpenDetectorModal: false, // 控制探测器添加弹框显隐
      isEditOutput: false, // 控制输出通道新增or编辑弹框显隐
      isEditSystem: false, // 控制子系统新增or编辑弹框显隐
      isShowImport: false, // 控制各种列表的导入弹框显隐
      dialogVisible: false, // 是否删除确认提示框
      detectorData: { // 新增or编辑探测器表单
        alarmHostId: '',
        isMain: 'T',
        name: '',
        serialNumber: '',
        deviceType: '',
        count: '',
        brand: '',
        model: '',
        code: '',
        associated: '',
        remark: ''
      },
      outputChanData: {
        alarmHostId: '',
        name: '',
        serialNumber: '',
        deviceType: '',
        brand: '',
        model: '',
        code: '',
        remark: ''
      },
      subsystemData: {
        alarmHostId: '',
        name: '',
        serialNumber: '',
        detectorCheckList: []
      },
      promptText: '确认要删除所选探测器吗?',
      selectionIds: [],
      detectorDetail: {},
      selectItemDtector: [],
      selectItemOutput: [],
      selectItemsubsystem: [],
      getDetectorMainId: {},
      editorNoMainDetectorID: '',
      serialNo: '',
      singleHostData: {},
      disabledNet: false,
      keyPartType: 1
    }
  },
  methods: {
    ...mapMutations(['SET_COMPONENTID', 'SET_SKIP_NUM']),
    ...mapActions(['getDataDictBasicInfo', 'getHostServerList', 'addAlarmHost', 'getSingleAlarmHost', 'updateAlarmHost', 'addDetector', 'updateDetector', 'deleteDetector', 'getDetector', 'addOutputChan', 'updateOutputChan', 'deleteOutputChan', 'getOutputChan', 'addSubsystem', 'updateSubsystem', 'deleteSubsystem', 'getSubsystem']),
    // ...mapActions('serverManagement', ['getServerList']),
    clickData(data) {
      if (data.isRoot) {
        this.orgObj.id = data.id
        this.orgObj.name = data.name
      }
    },
    // 机构数 后台搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem: 2,
        key: params.search
      }
      return alarmSearchTree(params)
    },
    sort() {
      this.sortHostShow = true
      this.$refs.srotRef.getAlarmHostList()
    },
    aginGetSingleHost(id) {
      this.getSingleAlarmHost({id: id}).then(res => {
        const result = res.results
        this.singleHostData = result[0]
      }).catch(err => {
        console.log(err)
      })
    },
    print() {
      this.printStatus = true
      this.saveDetails = true
    },
    Toprint() {
      printJS('print-gplot', 'html')
    },
    closeDetail() {
      this.printStatus = false
      // this.saveDetails = false
    },
    move() {
      this.moveShow = true
      this.migrantData = []
      this.migrantData.push({
        id: this.singleHostData.id,
        name: this.singleHostData.name
      })
    },
    changeType(val) {
      if (val !== '电话报警主机') {
        this.disabledNet = true
      } else {
        this.disabledNet = false
      }
      this.formData.brand = ''
      for (let i = 0; i < this.devTypeList.length; i++) {
        if (this.devTypeList[i].value === val) {
          let queryList = [
            { type: '1', moduleId: '1', childModuleId: '1', dictId: '3', homeClass: this.devTypeList[i].label } // dictId:主机是2  探测器是7
          ]
          this.getTypeMethod(queryList, 2)
        }
      }
    },
    changeBrand(val) {
      this.formData.deviceModel = ''
      for (let i = 0; i < this.devBrandList.length; i++) {
        if (this.devBrandList[i].value === val) {
          let queryList = [
            { type: '1', moduleId: '1', childModuleId: '1', dictId: '4', homeClass: this.devBrandList[i].label } // dictId:主机是2  探测器是7
          ]
          this.getTypeMethod(queryList, 3)
        }
      }
    },
    changenetBrandList(val) {
      this.formData.netModuleModel = ''
      for (let i = 0; i < this.netBrandList.length; i++) {
        if (this.netBrandList[i].value === val) {
          let queryList = [
            { type: '1', moduleId: '1', childModuleId: '1', dictId: '6', homeClass: this.netBrandList[i].label } // dictId:主机是2  探测器是7
          ]
          this.getTypeMethod(queryList, 11)
        }
      }
    },
    changeDectorBrand(val) {
      this.detectorData.deviceModel = ''
      for (let i = 0; i < this.detectorBrandList.length; i++) {
        if (this.detectorBrandList[i].value === val) {
          let queryList = [
            { type: '2', moduleId: '1', childModuleId: '1', dictId: '9', homeClass: this.detectorBrandList[i].label } // dictId:主机是2  探测器是7
          ]
          this.getTypeMethod(queryList, 6)
        }
      }
    },
    changeOutputBrand(val) {
      this.outputChanData.model = ''
      for (let i = 0; i < this.outputChanBrandList.length; i++) {
        if (this.outputChanBrandList[i].value === val) {
          let queryList = [
            { type: '2', moduleId: '1', childModuleId: '1', dictId: '32', homeClass: this.outputChanBrandList[i].label } // dictId:主机是2  探测器是7
          ]
          this.getTypeMethod(queryList, 9)
        }
      }
    },
    getTreeApi(params) {
      return alarmGetTreeApi(params)
    },
    getKeyPartSelect(id, kId) { // 获取机构下的重点部位
      this.positionList = []
      let params = {
        type: 2,
        oId: id,
        subSystem: '2',
        isRecursion: '0'
      }
      this.getTreeApi(params).then((res) => {
        if (res.data.code === 0) {
          if (kId) {
            this.formData.locationId = kId
          }
          let data = res.data.data.nodes
          data.forEach((item) => {
            if (item.tierType === 'loc') {
              this.positionList.push({
                label: item.name,
                value: item.id
              })
            }
          })
        }
      })
    },
    getKeyPartName(id) { // 通过重点部位id，得到重点部位的名称
      let name = ''
      this.positionList.forEach((item) => {
        if (item.value === id) {
          name = item.label
        }
      })
      return name
    },
    getDeviceType(id) { // 通过重点部位id，得到设备类型的名称
      let name = ''
      this.devTypeList.forEach((item) => {
        if (item.value === id) {
          name = item.label
        }
      })
      return name
    },
    getDeviceBand(id) { // 通过重点部位id，得到设备品牌的名称
      let name = ''
      this.devBrandList.forEach((item) => {
        if (item.value === id) {
          name = item.label
        }
      })
      return name
    },
    getDeviceModel(id) { // 通过重点部位id，得到设备型号的名称
      let name = ''
      this.devModelList.forEach((item) => {
        if (item.value === id) {
          name = item.label
        }
      })
      return name
    },
    onceClick(data, node) {
      console.log(data, node, 'node==========')
      if (data.tierType === 'org') {
        this.orgObj = {
          id: data.id,
          name: data.name
        }
        this.formData.locationId = ''
        this.formData.locName = ''
        this.getKeyPartSelect(this.orgObj.id)
      } else {
        let parentNode = node.parent
        if (!parentNode) { return }
        this.orgObj = {
          id: (parentNode.data && node.parent.data.id) || '',
          name: (parentNode.data && node.parent.data.name) || ''
        }
        this.keyPartType = data.keyPartType
        this.formData.locName = data.name
        // this.formData.locationId = '' // data.id
        this.getKeyPartSelect(this.orgObj.id, data.id)
      }
    },
    /**
     * 重置报警主机设备表单
     */
    reSetForm() {
      this.$refs.addForm1.resetFields()
      this.$refs.addForm2.resetFields()
      // this.formData.locationId = ''
      // this.formData.name = ''
      // this.formData.brand = ''
      // this.formData.netModuleBrand = ''
      // this.formData.netModuleID = ''
      // this.formData.ip = ''
      // this.formData.userName = ''
      // this.formData.service = ''
      // this.formData.detectorNo = ''
      // this.formData.subsystemNo = ''
      // this.formData.orgId = ''
      // this.formData.deviceType = ''
      // this.formData.code = ''
      // this.formData.deviceModel = ''
      // this.formData.netModuleModel = ''
      // this.formData.keyboardPassword = ''
      // this.formData.port = ''
      // this.formData.password = ''
      // this.formData.outputNo = ''
    },
    newAlarmHost(num) {
      if (num === 1) {
        this.reSetForm()
      }
      if (num === 2) {
        this.isAddAlarmHost = false
      }
      this.saveDetails = false
    },
    delAlarmHost() {

    },
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
      if (this.dropdownStatus[key]) {
        Object.keys(this.dropdownStatus).forEach(item => {
          if (item !== key) {
            this.dropdownStatus[item] = false
          }
        })
      }
    },
    handleEdit(index, row) {
      this.isOpenDetectorModal = true
      this.serialNo = row.serialNumber
      this.getDetectorList(3, row.serialNumber)
      this.detectorData.serialNumber = row.serialNumber
    },
    // 跳转到列表页
    skipToList() {
      this.SET_SKIP_NUM(1)
      this.SET_COMPONENTID('AlarmList')
    },
    // 添加报警主机
    saveAlarmHost() {
      if (this.disabledNet) {
        this.formData.netModuleBrand = ' '
        this.formData.netModuleModel = ' '
      }
      this.formData.orgId = this.orgObj.id
      if (this.formData.port !== '') {
        this.formData.port =  Number(this.formData.port)
      }
      this.formData.keyPartType = this.keyPartType
      this.$refs.addForm1.validate(valid1 => {
        this.$refs.addForm2.validate(valid2 => {
          if (valid1 && valid2) {
            if (this.isAddAlarmHost) {
              this.addAlarmHost(this.formData).then(res => {
                this.formData.id = res.data.alarmHostId
                this.detectorData.alarmHostId = res.data.alarmHostId
                this.outputChanData.alarmHostId = res.data.alarmHostId
                this.subsystemData.alarmHostId = res.data.alarmHostId
                this.$notify.success({
                  title: '成功',
                  message: '添加成功'
                })
                this.getDetectorList(2)
                this.getSingleAlarmHost({id: res.data.alarmHostId}).then(res => {
                  const result = res.results
                  this.singleHostData = result[0]
                }).catch(err => {
                  console.log(err)
                })
                this.saveDetails = true
              }).catch(err => {
                console.log(err)
              })
            } else {
              delete this.formData.locName
              this.updateAlarmHost(this.formData).then(res => {
                this.$notify.success({
                  title: '成功',
                  message: '修改成功'
                })
                this.saveDetails = true
              }).catch(err => {
                console.log(err)
              })
            }
          }
        })
      })
    },
    // 添加主探测器
    saveDetector() {
      this.$refs.detectAddForm.validate(valid => {
        if (this.detectorData.serialNumber !== '') {
          this.detectorData.serialNumber = Number(this.detectorData.serialNumber)
        }
        this.detectorData.orgId = this.orgObj.id
        this.detectorData.locationId = this.formData.locationId
        this.detectorData.keyPartType = this.keyPartType
        if (valid) {
          if (this.modalTitle === '新增探测器' && this.isMainDetector) {
            this.detectorData.isMain = 'T'
            this.addDetector(this.detectorData).then(res => {
              this.$notify.success({
                title: '成功',
                message: '添加成功'
              })
              this.getDetectorList(1)
              this.getDetectorList(4)
            }).catch(err => {
              console.log(err)
            })
          }
          if (this.modalTitle === '新增探测器' && !this.isMainDetector) {
            this.detectorData.isMain = 'F'
            this.addDetector(this.detectorData).then(res => {
              this.editorNoMainDetectorID = res.data.alarmDetectorID
              this.$notify.success({
                title: '成功',
                message: '添加成功'
              })
              this.getDetectorList(2)
            }).catch(err => {
              console.log(err)
            })
          }
          if (this.modalTitle === '修改探测器' && this.isMainDetector) {
            // this.detectorData.id = this.editorMainDetectorID
            this.updateDetector(this.detectorData).then(res => {
              this.$notify.success({
                title: '成功',
                message: '修改成功'
              })
              this.getDetectorList(1)
            }).catch(err => {
              console.log(err)
            })
          }
          if (this.modalTitle === '修改探测器' && !this.isMainDetector) {
            // this.detectorData.id = this.editorMainDetectorID
            this.updateDetector(this.detectorData).then(res => {
              this.$notify.success({
                title: '成功',
                message: '修改成功'
              })
              this.getDetectorList(2)
            }).catch(err => {
              console.log(err)
            })
          }
          this.isEditDetector = false
        }
      })
    },
    saveOutputChan() {
      this.$refs.outputAddForm.validate(valid => {
        if (this.outputChanData.serialNumber !== '') {
          this.outputChanData.serialNumber = Number(this.outputChanData.serialNumber)
        }
        this.outputChanData.orgId = this.orgObj.id
        this.outputChanData.locationId = this.formData.locationId
        this.outputChanData.keyPartType = this.keyPartType
        if (valid) {
          if (this.modalTitle === '新增输出通道') {
            this.addOutputChan(this.outputChanData).then(res => {
              this.$notify.success({
                title: '成功',
                message: '添加成功'
              })
              this.outputChanData.id = res.data.outPutChannelID
              this.isEditOutput = false
              this.getOutputChanList()
            }).catch(err => {
              console.log(err)
            })
          }
          if (this.modalTitle === '编辑输出通道') {
            this.updateOutputChan(this.outputChanData).then(res => {
              this.$notify.success({
                title: '成功',
                message: '修改成功'
              })
              this.isEditOutput = false
              this.getOutputChanList()
            }).catch(err => {
              console.log(err)
            })
          }
        }
      })
    },
    // 探测器列表复选框
    handleSelectionChange(selection) {
      this.selectItemDtector = []
      this.selectItemDtector = selection
      this.detectorDetail = selection[0]
      this.selectionIds = []
      for (let i = 0; i < selection.length; i++) {
        this.selectionIds.push(selection[i].id)
      }
    },
    // 输出通道列表复选框
    OutputChanSelectionChange(selection) {
      this.selectItemOutput = []
      this.selectItemOutput = selection
      this.selectionIds = []
      for (let i = 0; i < selection.length; i++) {
        this.selectionIds.push(selection[i].id)
      }
    },
    subsystemSelectionChange(selection) {
      this.selectItemsubsystem = []
      this.selectItemsubsystem = selection
      this.selectionIds = []
      for (let i = 0; i < selection.length; i++) {
        this.selectionIds.push(selection[i].id)
      }
    },
    confDeleteDetector() {
      if (this.promptText === '确认要删除所选探测器吗？') {
        this.deleteDetector(this.selectionIds).then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          this.dialogVisible = false
          if (this.isMainDetector) {
            this.getDetectorList(1)
          } else {
            this.getDetectorList(3, this.serialNo)
          }
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.promptText === '确认要删除所选输出通道吗？') {
        this.deleteOutputChan(this.selectionIds).then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          this.dialogVisible = false
          this.getOutputChanList()
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.promptText === '确认要删除所选子系统吗？') {
        this.deleteSubsystem(this.selectionIds).then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          this.dialogVisible = false
          this.getSubsystemList()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    saveSubsystem() {
      this.$refs.subsystemAddForm.validate(valid => {
        if (this.subsystemData.serialNumber !== '') {
          this.subsystemData.serialNumber = Number(this.subsystemData.serialNumber)
        }
        this.subsystemData.orgId = this.orgObj.id
        this.subsystemData.locationId = this.formData.locationId
        this.subsystemData.keyPartType = this.keyPartType
        if (valid) {
          if (this.modalTitle === '新增子系统') {
            let tempObj = {
              subSystem: {
                name: this.subsystemData.name,
                serialNumber: this.subsystemData.serialNumber,
                alarmHostId: this.subsystemData.alarmHostId
              },
              detectorIds: this.subsystemData.detectorCheckList,
              outChannelIds: this.checkList
            }
            this.addSubsystem(tempObj).then(res => {
              this.$notify.success({
                title: '成功',
                message: '添加成功'
              })
              this.isEditSystem = false
              this.getSubsystemList()
            }).catch(err => {
              console.log(err)
            })
          }
          if (this.modalTitle === '编辑子系统') {
            let tempObj = {
              subSystem: {
                id: this.selectItemsubsystem[0].id,
                name: this.subsystemData.name,
                serialNumber: this.subsystemData.serialNumber,
                alarmHostId: this.subsystemData.alarmHostId
              },
              detectorIds: this.subsystemData.detectorCheckList,
              outChannelIds: this.checkList
            }
            this.updateSubsystem(tempObj).then(res => {
              this.$notify.success({
                title: '成功',
                message: '修改成功'
              })
              this.isEditSystem = false
              this.getSubsystemList()
            }).catch(err => {
              console.log(err)
            })
          }
        }
      })
    },
    clearDectorForm() {
      this.detectorData.name = ''
      if (!this.isOpenDetectorModal) {
        this.detectorData.serialNumber = ''
      }
      this.detectorData.deviceType = ''
      this.detectorData.count = ''
      this.detectorData.brand = ''
      this.detectorData.model = ''
      this.detectorData.code = ''
      this.detectorData.associated = ''
      this.detectorData.remark = ''
    },
    clearOutputChanForm() {
      this.outputChanData.name = ''
      this.outputChanData.serialNumber = ''
      this.outputChanData.deviceType = ''
      this.outputChanData.brand = ''
      this.outputChanData.model = ''
      this.outputChanData.code = ''
      this.outputChanData.remark = ''
    },
    fullOutputChanForm() {
      this.outputChanData.id = this.selectItemOutput[0].id
      this.outputChanData.name = this.selectItemOutput[0].name
      this.outputChanData.serialNumber = this.selectItemOutput[0].serialNumber
      this.outputChanData.deviceType = this.selectItemOutput[0].deviceType
      this.outputChanData.brand = this.selectItemOutput[0].brand
      this.outputChanData.model = this.selectItemOutput[0].model
      this.outputChanData.code = this.selectItemOutput[0].code
      this.outputChanData.remark = this.selectItemOutput[0].remark
    },
    commonDisableMethod() {
      this.hasAllDetectorArr.forEach((element, index) => {
        let indexHas = this.detectorList.findIndex(item => item.name === element)
        if (indexHas !== -1) {
          this.detectorList[indexHas].isDisabled = true
        }
      })
      this.hasAllOutputArr.forEach((element, index) => {
        let indexHas = this.outputList.findIndex(item => item.name === element)
        if (indexHas !== -1) {
          this.outputList[indexHas].isDisabled = true
        }
      })
    },
    fullSubsystemForm() {
      this.commonDisableMethod()
      this.subsystemData.detectorCheckList = []
      this.checkList = []
      this.subsystemData.name = this.selectItemsubsystem[0].name
      this.subsystemData.serialNumber = this.selectItemsubsystem[0].serialNumber
      let tempArrOne = this.selectItemsubsystem[0].hasDetector ? this.selectItemsubsystem[0].hasDetector.split(',') : []
      let tempArrTwo = this.selectItemsubsystem[0].hasOutput ? this.selectItemsubsystem[0].hasOutput.split(',') : []
      tempArrOne.forEach((element, index) => {
        let indexHas = this.detectorList.findIndex(item => item.name === element)
        if (indexHas !== -1) {
          this.detectorList[indexHas].isDisabled = false
          this.subsystemData.detectorCheckList.push(this.detectorList[indexHas].id)
        }
      })
      tempArrTwo.forEach((element, index) => {
        let indexHas = this.outputList.findIndex(item => item.name === element)
        if (indexHas !== -1) {
          this.outputList[indexHas].isDisabled = false
          this.checkList.push(this.outputList[indexHas].id)
        }
      })
    },
    clearSubsystemForm() {
      this.subsystemData.name = ''
      this.subsystemData.serialNumber = ''
      this.checkList = []
      this.subsystemData.detectorCheckList = []
    },
    openAddModal(num) {
      console.log(this.noMaindetectorList.length, '=============')
      if (this.noMaindetectorList.length >= Number(this.formData.detectorNo)) {
        this.$notify.warning({
          title: '警告',
          message: '最多只能添加' + this.formData.detectorNo + '个探测器'
        })
        return
      }
      if (num === 1) {
        this.isMainDetector = true
      } else {
        this.isMainDetector = false
      }
      this.modalTitle = '新增探测器'
      this.clearDectorForm()
      this.isEditDetector = true
      this.$nextTick(() => {
        this.$refs.detectAddForm.clearValidate()
      })
    },
    openEditModal(num) {
      if (this.selectItemDtector.length < 1) {
        this.$notify.warning({
          title: '警告',
          message: '请选择要编辑的探测器'
        })
        return
      }
      if (this.selectItemDtector.length > 1) {
        this.$notify.warning({
          title: '警告',
          message: '最多只能选择一个探测器'
        })
        return
      }
      if (num === 1) {
        this.isMainDetector = true
      } else {
        this.isMainDetector = false
      }
      this.modalTitle = '修改探测器'
      this.detectorData.id = this.detectorDetail.id
      this.detectorData.alarmHostId = this.detectorDetail.alarmHostId ? this.detectorDetail.alarmHostId : ''
      this.detectorData.isMain = this.detectorDetail.isMain ? this.detectorDetail.isMain : ''
      this.detectorData.name = this.detectorDetail.name ? this.detectorDetail.name : ''
      this.detectorData.serialNumber = this.detectorDetail.serialNumber ? String(this.detectorDetail.serialNumber) : ''
      this.detectorData.deviceType = this.detectorDetail.deviceType ? this.detectorDetail.deviceType : ''
      this.detectorData.count = this.detectorDetail.count ? String(this.detectorDetail.count) : ''
      this.detectorData.brand = this.detectorDetail.brand ? this.detectorDetail.brand : ''
      this.detectorData.model = this.detectorDetail.model ? this.detectorDetail.model : ''
      this.detectorData.code = this.detectorDetail.code ? this.detectorDetail.code : ''
      this.detectorData.associated = this.detectorDetail.associated ? this.detectorDetail.associated : ''
      this.detectorData.remark = this.detectorDetail.remark ? this.detectorDetail.remark : ''
      this.isEditDetector = true
    },
    openAddOutputModal() {
      if (this.outputList.length >= Number(this.formData.outputNo)) {
        this.$notify.warning({
          title: '警告',
          message: '最多只能添加' + this.formData.outputNo + '个输出通道'
        })
        return
      }
      this.modalTitle = '新增输出通道'
      this.clearOutputChanForm()
      this.isEditOutput = true
      this.$nextTick(() => {
        this.$refs.outputAddForm.clearValidate()
      })
    },
    openEditOutputModal() {
      if (this.selectItemOutput.length < 1) {
        this.$notify.warning({
          title: '警告',
          message: '请选择要编辑的输出通道'
        })
        return
      }
      if (this.selectItemOutput.length > 1) {
        this.$notify.warning({
          title: '警告',
          message: '最多只能修改一个输出通道'
        })
        return
      }
      this.fullOutputChanForm()
      this.modalTitle = '编辑输出通道'
      this.isEditOutput = true
    },
    openAddSystemModal() {
      if (this.subSystemList.length >= Number(this.formData.subsystemNo)) {
        this.$notify.warning({
          title: '警告',
          message: '最多只能添加' + this.formData.subsystemNo + '个子系统'
        })
        return
      }
      this.commonDisableMethod()
      this.modalTitle = '新增子系统'
      this.clearSubsystemForm()
      this.isEditSystem = true
      this.$nextTick(() => {
        this.$refs.subsystemAddForm.clearValidate()
      })
    },
    openEditSystemModal() {
      if (this.selectItemsubsystem.length < 1) {
        this.$notify.warning({
          title: '警告',
          message: '请选择要编辑的子系统'
        })
        return
      }
      if (this.selectItemsubsystem.length > 1) {
        this.$notify.warning({
          title: '警告',
          message: '最多只能选择一个子系统'
        })
        return
      }
      this.fullSubsystemForm()
      this.modalTitle = '编辑子系统'
      this.isEditSystem = true
    },
    detectorImportModal() {
      this.isShowImport = true
    },
    outputChannelImportModal() {
      this.isShowImport = true
      this.impotModalTitle = '导入输出通道'
    },
    subsystemImportModal() {
      this.isShowImport = true
      this.impotModalTitle = '导入子系统'
    },
    isDelete(num) {
      if ((num === 1 || num === 5) && this.selectItemDtector.length < 1) {
        this.$notify.warning({
          title: '警告',
          message: '请选择要删除的探测器'
        })
        return
      }
      if (num === 2 && this.selectItemOutput.length < 1) {
        this.$notify.warning({
          title: '警告',
          message: '请选择要删除的输出通道'
        })
        return
      }
      if (num === 3 && this.selectItemsubsystem.length < 1) {
        this.$notify.warning({
          title: '警告',
          message: '请选择要删除的子系统'
        })
        return
      }
      this.dialogVisible = true
      if (num === 1 || num === 5) {
        if (num === 1) {
          this.isMainDetector = true
        } else {
          this.isMainDetector = false
        }
        this.promptText = '确认要删除所选探测器吗？'
      } else if (num === 2) {
        this.promptText = '确认要删除所选输出通道吗？'
      } else if (num === 3) {
        this.promptText = '确认要删除所选子系统吗？'
      } else {
        this.promptText = '请确认是否删除所选主机？'
      }
    },
    getDetectorList(num, serialNum) {
      if (num === 1) {
        this.getDetectorMainId = {hostId: this.detectorData.alarmHostId, isMain: 'T'}
      } else if (num === 2) {
        this.getDetectorMainId = {hostId: this.detectorData.alarmHostId, serialNumber: this.detectorData.serialNumber}
      } else if (num === 3) {
        this.getDetectorMainId = {hostId: this.detectorData.alarmHostId, serialNumber: serialNum}
      } else {
        this.getDetectorMainId = {hostId: this.detectorData.alarmHostId, serialNumber: ''}
      }
      this.getDetector(this.getDetectorMainId).then(res => {
        const result = res.results ? res.results : []
        Array.isArray(result) && result.forEach(item => {
          item.updatedAt = this.$moment(item.updatedAt).format('YYYY-MM-DD hh:mm:ss')
        })
        if (num === 1) {
          this.detectorList = result
        } else {
          this.noMaindetectorList = result
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getOutputChanList() {
      this.getOutputChan({hostId: this.outputChanData.alarmHostId}).then(res => {
        const result = res.results ? res.results : []
        Array.isArray(result) && result.forEach(item => {
          item.updatedAt = this.$moment(item.updatedAt).format('YYYY-MM-DD hh:mm:ss')
        })
        this.outputList = result
      }).catch(err => {
        console.log(err)
      })
    },
    getSubsystemList() {
      this.getSubsystem({hostId: this.subsystemData.alarmHostId}).then(res => {
        this.hasAllDetectorArr = []
        this.hasAllOutputArr = []
        this.hasAllDetectorString = ''
        this.hasAllOutputString = ''
        const result = res.results ? res.results : []
        Array.isArray(result) && result.forEach(item => {
          item.updatedAt = this.$moment(item.updatedAt).format('YYYY-MM-DD hh:mm:ss')
          this.hasAllDetectorString += ',' + item.hasDetector
          this.hasAllOutputString += ',' + item.hasOutput
        })
        this.subSystemList = result
        this.hasAllDetectorArr = this.hasAllDetectorString.split(',')
        this.hasAllOutputArr = this.hasAllOutputString.split(',')
      }).catch(err => {
        console.log(err)
      })
    },
    hostFormUpdata() {
      this.editorShowList = true
      this.singleHostData = this.updataHostInfo
      this.formData.locName = this.updataHostInfo.locName ? this.updataHostInfo.locName : ''
      this.formData.locationId = this.updataHostInfo.locationId ? this.updataHostInfo.locationId : ''
      this.formData.name = this.updataHostInfo.name ? this.updataHostInfo.name : ''
      this.formData.brand = this.updataHostInfo.brand ? this.updataHostInfo.brand : ''
      let queryList1 = [
        { type: '1', moduleId: '1', childModuleId: '1', dictId: '4', homeClass: this.formData.brand } // dictId:主机是2  探测器是7
      ]
      this.getTypeMethod(queryList1, 3)
      this.formData.netModuleBrand = (this.updataHostInfo.netModuleBrand && this.updataHostInfo.netModuleBrand !== ' ') ? this.updataHostInfo.netModuleBrand : ''
      this.formData.netModuleID = this.updataHostInfo.netModuleID ? this.updataHostInfo.netModuleID : ''
      this.formData.ip = this.updataHostInfo.ip ? this.updataHostInfo.ip : ''
      this.formData.userName = this.updataHostInfo.userName ? this.updataHostInfo.userName : ''
      this.formData.service = this.updataHostInfo.service ? this.updataHostInfo.service : ''
      this.formData.detectorNo = this.updataHostInfo.detectorNo ? String(this.updataHostInfo.detectorNo) : ''
      this.formData.subsystemNo = this.updataHostInfo.subsystemNo ? String(this.updataHostInfo.subsystemNo) : ''
      this.formData.orgId = this.updataHostInfo.orgId ? this.updataHostInfo.orgId : ''
      this.orgObj.id = this.updataHostInfo.orgId ? this.updataHostInfo.orgId : ''
      this.orgObj.name = this.updataHostInfo.orgName ? this.updataHostInfo.orgName : ''
      this.formData.deviceType = this.updataHostInfo.deviceType ? this.updataHostInfo.deviceType : ''
      if (this.formData.deviceType !== '电话报警主机') {
        this.disabledNet = true
      } else {
        this.disabledNet = false
      }
      let queryList = [
        { type: '1', moduleId: '1', childModuleId: '1', dictId: '3', homeClass: this.formData.deviceType }
      ]
      this.getTypeMethod(queryList, 2)
      this.formData.code = this.updataHostInfo.code ? this.updataHostInfo.code : ''
      this.formData.deviceModel = this.updataHostInfo.deviceModel ? this.updataHostInfo.deviceModel : ''
      this.formData.netModuleModel = (this.updataHostInfo.netModuleModel && this.updataHostInfo.netModuleModel !== ' ') ? this.updataHostInfo.netModuleModel : ''
      this.formData.keyboardPassword = this.updataHostInfo.keyboardPassword ? this.updataHostInfo.keyboardPassword : ''
      this.formData.port = this.updataHostInfo.port ? this.updataHostInfo.port : ''
      this.formData.password = this.updataHostInfo.password ? this.updataHostInfo.password : ''
      this.formData.outputNo = this.updataHostInfo.outputNo ? String(this.updataHostInfo.outputNo) : ''
      this.formData.id = this.updataHostInfo.id
      this.detectorData.alarmHostId = this.updataHostInfo.id
      this.outputChanData.alarmHostId = this.updataHostInfo.id
      this.subsystemData.alarmHostId = this.updataHostInfo.id
      this.isAddAlarmHost = false
      this.getDetectorList(1)
      this.getOutputChanList()
      this.getSubsystemList()
    },
    getTypeMethod(args, num) {
      this.getDataDictBasicInfo({queryList: args}).then(res => {
        if (num === 1) {
          this.devTypeList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.devTypeList.push(tempData)
          }
        }
        if (num === 2) {
          this.devBrandList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.devBrandList.push(tempData)
          }
        }
        if (num === 3) {
          this.devModelList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.devModelList.push(tempData)
            if (res.data[0].attr[i].sdkName) {
              this.formData.sdk = res.data[0].attr[i].sdkName
            } else {
              this.formData.sdk = ''
            }
          }
        }
        if (num === 4) {
          this.detectorTypeList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.detectorTypeList.push(tempData)
          }
        }
        if (num === 5) {
          this.detectorBrandList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.detectorBrandList.push(tempData)
          }
        }
        if (num === 6) {
          this.detectorModelList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.detectorModelList.push(tempData)
          }
        }
        if (num === 7) { // 获取输出通道-设备类型列表
          this.outputChanTypeList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.outputChanTypeList.push(tempData)
          }
        }
        if (num === 8) { // 获取输出通道-设备品牌列表
          this.outputChanBrandList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.outputChanBrandList.push(tempData)
          }
        }
        if (num === 9) { // 获取输出通道-设备型号列表
          this.outputChanModelList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.outputChanModelList.push(tempData)
          }
        }
        if (num === 10) { // 获取网络模块品牌列表
          this.netBrandList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.netBrandList.push(tempData)
          }
        }
        if (num === 11) { // 获取网络模块型号列表
          this.netTypeList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.netTypeList.push(tempData)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  computed: {
    ...mapState({
      skipToNum: ({ alarm }) => alarm.skipToNum,
      updataHostInfo: ({ alarm }) => alarm.updataHostInfo
    })
  },
  created() {
    if (this.skipToNum === 2) {
      this.hostFormUpdata()
    }
    this.getDetectorList(2)
    this.getKeyPartSelect(this.orgObj.id)
    this.getHostServerList().then(res => {
      this.serverList = []
      for (let i = 0; i < res.length; i++) {
        let temp = {
          label: res[i], value: res[i]
        }
        this.serverList.push(temp)
      }
    }).catch(err => {
      console.log(err)
    })
    let queryList = [
      { type: '1', moduleId: '1', childModuleId: '1', dictId: '2' } // dictId:主机是2  探测器是7
    ]
    this.getTypeMethod(queryList, 1)
    this.getTypeMethod([
      { type: '2', moduleId: '1', childModuleId: '1', dictId: '7' } // dictId:主机是2  探测器是7
    ], 4)
    this.getTypeMethod([
      { type: '2', moduleId: '1', childModuleId: '1', dictId: '8' } // dictId:主机是2  探测器是7
    ], 5)
    // this.getTypeMethod([
    //   { type: '2', moduleId: '1', childModuleId: '1', dictId: '9' } // dictId:主机是2  探测器是7
    // ], 6)
    // 获取输出通道-设备类型列表
    this.getTypeMethod([
      { type: '2', moduleId: '1', childModuleId: '1', dictId: '10' } // dictId:主机是2  探测器是7
    ], 7)
    // 获取输出通道-设备品牌列表
    this.getTypeMethod([
      { type: '2', moduleId: '1', childModuleId: '1', dictId: '31' } // dictId:主机是2  探测器是7
    ], 8)
    // 获取网络模块品牌列表
    this.getTypeMethod([
      { type: '1', moduleId: '1', childModuleId: '1', dictId: '5' } // dictId:主机是2  探测器是7
    ], 10)
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  .detecor-style {
    .el-select {
      width: 240px !important;
    }
  }
  .output-style {
    .el-select {
      width: 240px !important;
    }
  }
  .left-tree {
    width: 240px;
    border-right: 1px solid #e1e1e1;
  }
  .right-content {
    font-size: 14px;
    padding: 0 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    .form-box {
      .form-title{
        width: 952px;
        text-align: center;
        padding: 20px 0;
        color: #606266;
      }
      .up-style {
        width:952px;
        height:506px;
        background:rgba(245,245,245,1);
      }
      .center-style {
        width:955px;
        height:352px;
        background:rgba(245,245,245,0);
        border:1px solid rgba(225, 225, 225, 1);
        padding: 0px !important;
        .detile-item {
          line-height: 38px  !important;
          border-bottom: 1px solid rgba(225, 225, 225, 1);;
          .item-left {
            background:rgba(245,245,245,1);
            padding-left: 14px;
          }
          .item-right {
            padding-left: 14px;
          }
        }
        .left-form {
          width: 475px !important;
          margin-right: 0px !important;
        }
        .right-form {
          width: 475px !important;
        }
      }
      .bottom-style {
        border:1px solid rgba(225, 225, 225, 1);
        height: 35px;
        padding: 0 !important;
        margin: 22px 0 22px 0;
        .item-left {
          width:142px !important;
          line-height:35px !important;
          background:rgba(245,245,245,1) !important;
          border: none !important;
          text-align: center;
        }
        .item-right {
          width: 150px;
          border: none !important;
        }
      }
      .form-content {
        display: flex;
        width: 952px;
        padding: 14px 10px 10px 10px;
        font-size: 12px;
        // border: 1px solid #f2f2f2;
        .el-select {
          width: 356px !important;
        }
        .el-input {
          width: 356px !important;
        }
        .left-form {
          width: 442px;
          margin-right: 24px;
        }
        .right-form {
          width: 442px;
        }
        .detile-item {
          display: flex;
          line-height: 28px;
        }
        .item-left {
          display: block;
          width: 120px;
          // background: #F8F8F8;
          // border: 1px solid #fff;
        }
        .item-right {
          flex: 1;
          // border: 1px solid #F8F8F8;
          border-left: none;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .form-footer {
        margin-top: 12px;
        width: 952px;
        text-align: center;
      }
    }
    .bottom-box {
      flex: 1;
      overflow-y: auto;
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
        margin-left: 120px;
        margin-top: -12px;
      }
    }
    .pointer {
      cursor: pointer;
      display: inline-block;
      width: 120px;
    }
  }
  .list-header {
    text-align: right;
    i {
      cursor: pointer;
      margin-right: 6px;
    }
  }
  .subsystem-style {
    .el-checkbox {
      display: block;
    }
    .checkbox-style {
      height:200px;
      border:1px solid #DCDFE6;
      overflow-y: auto;
    }
  }
}
</style>
<style lang="less">
  .content {
    .right-content {
      .form-box {
        .left-form,
        .right-form {
          .el-form-item--mini.el-form-item {
            margin-bottom: 14px;
          }
          .el-form-item__label {
            // border: 1px solid #fff;
            // background: #f2f2f2;
            height: 35px;
            line-height: 35px;
          }
          .el-input--mini .el-input__inner {
            height: 35px;
            border-radius: 0px;
          }
        }
      }
    }
  }
</style>
