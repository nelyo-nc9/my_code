<template>
  <div id="devHost">
    <div class="meus">
      <!-- <tabMenu :tabList="tabList" /> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
        <el-breadcrumb-item>门禁管理</el-breadcrumb-item>
        <el-breadcrumb-item>门禁主机配置</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="createView">
      <div id="device">
        <div class="deviceCon" style="overflow-y:auto">
          <div class="deviceHeader">
            <el-collapse v-model="activeNames" @change="collClick">
              <el-collapse-item title name="1">
                <p style="text-align:center;padding:10px 0">修改门禁主机</p>
                <div class="form-box">
                  <div class="form-content">
                    <div class="left-form">
                      <el-form
                        :model="host"
                        size="mini"
                        label-position="right"
                        ref="deviceModelHost"
                        label-width="120px"
                      >
                        <el-form-item
                          label="门禁主机名称"
                          prop="name"
                          :rules="[
                            { required: true, message: '必填', trigger: 'change' },
                            { min: 1, max: 64, message: '名称在 1 到 64 个字符', trigger: 'change' }
                          ]"
                        >
                          <el-input v-model="host.name"></el-input>
                        </el-form-item>
                        <el-form-item
                          prop="orgName"
                          label="所属机构"
                          :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                        >
                          <el-input v-model="host.orgName" disabled></el-input>
                        </el-form-item>

                        <el-form-item
                          label="品牌"
                          prop="brand"
                          :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                        >
                          <el-select v-model="host.brand">
                            <el-option
                              v-for="(item, index) in hostBrands"
                              :key="index"
                              :label="item.data"
                              :value="item.englishName || item.data"
                              @click.native="changeBrans(index)"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          label="门禁主机类型"
                          prop="type"
                          :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                        >
                          <el-select v-model="host.type" size="mini">
                            <el-option
                              v-for="(item, index) in CreatehostType"
                              :key="index"
                              :label="item.data"
                              :value="item.data"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          label="门禁通道数量"
                          prop="guardNumber"
                          :rules="[
                             { type: 'number', message: '数量必须为整数', trigger: 'blur' },
                              { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' },

                          ]"
                        >
                          <el-input  v-model.number="host.guardNumber" size="mini"></el-input>
                        </el-form-item>
                        <el-form-item
                          label="报警输入数量"
                          prop="inputNumber"
                          :rules="[
                            { type: 'number', message: '数量必须为整数', trigger: 'blur' },
                            { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' },
                          ]"
                        >
                          <el-input  v-model.number="host.inputNumber" size="mini"></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                    <div class="right-form">
                      <el-form
                        :model="host"
                        size="mini"
                        label-position="right"
                        ref="deviceModel2Host"
                        label-width="120px"
                      >
                        <el-form-item label="门禁主机ID" prop="uniqueId"
                        :rules="[
                        { pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, message: 'ID不能大于65535' }
                        ]"
                        >
                          <el-input  v-model="host.uniqueId" size="mini"></el-input>
                        </el-form-item>

                        <el-form-item label="所属重点部位" prop="keyPartName">
                          <el-input disabled v-model="host.keyPartName" size="mini"></el-input>
                        </el-form-item>
                        <el-form-item label="所属门禁平台">
                          <el-input disabled v-model="host.platformName" size="mini"></el-input>
                        </el-form-item>

                        <el-form-item
                          label="型号"
                          :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                          prop="modelNum"
                        >
                          <el-select v-model="host.modelNum">
                            <el-option
                              v-for="(item, index) in hostModelNums"
                              :key="index"
                              :label="item.data"
                              :value="item.data"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          label="读头通道数量"
                          prop="readerNumber"
                          :rules="[
                            { type: 'number', message: '数量必须为整数', trigger: 'blur' },
                            { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' },
                          ]"
                        >
                          <el-input type="number" v-model.number="host.readerNumber" size="mini"></el-input>
                        </el-form-item>

                        <el-form-item
                          label="资产编码"
                          prop="assetCode"
                          :rules="[
                            { required: true, message: '必填', trigger: 'change' },
                            { min: 1, max: 64, message: '不可超过64位', trigger: 'blur' }
                          ]"
                        >
                          <el-input placeholder v-model="host.assetCode"></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                  <userInfo :Info="Info" style="margin:10px 0" />
                </div>
              </el-collapse-item>

              <div class="bottomInfo">
                <div class="alarm-log-btn">
                  <el-button @click="change('view')" size="mini">保存</el-button>
                  <el-button @click="change('list')" size="mini">取消</el-button>
                  <el-button @click="reset" size="mini">重置</el-button>
                </div>
              </div>
            </el-collapse>
          </div>
          <div class="eventTab" style="margin:10px 0">
            <el-button size="mini" @click="eventTypes = 1">通道管理</el-button>
            <el-button style="margin-left:0" size="mini" @click="eventTypes = 2">事件管理</el-button>
          </div>

          <div class="colls">
            <div class="collapses" v-if="eventTypes == 1">
              <div class="collapse-item">
                <div class="box-title">
                  <span class="pointer" @click="toggleOpen('videoChan')">
                    门禁通道列表
                    <i :class="dropdownStatus.videoChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                  </span>
                </div>
                <div v-if="dropdownStatus.videoChan" style="width:100%;">
                  <div class="list-header" @click="Multifunction($event, 1)">
                    <i class="el-icon-download" title="获取通道信息" @click="getPassesList"></i>
                    <i class="el-icon-circle-plus-outline" title="新增" @click="addPassessTd"></i>
                    <i class="el-icon-edit" title="编辑"></i>
                    <i class="el-icon-delete" title="删除" @click="delPasses"></i>
                    <i class="el-icon-refresh-right" @click="Refresh(1)" title="刷新"></i>
                  </div>
                  <!-- <video-table :columns="videoChanColumns" :tableData="videoChanTableData"></video-table> -->

                  <el-table
                    ref="passesTable"
                    :data="passes"
                    tooltip-effect="dark"
                    style="width: 100%"
                    v-loading="Passesloading"
                    @select="selectPasses"
                  
                    @select-all="passesselectAll"
                  >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" prop="index" label="序号" width="55"></el-table-column>
                    <el-table-column show-overflow-tooltip label="门禁通道名称" width="120">
                      <template slot-scope="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="uniqueId"
                      label="门禁通道ID"
                      width="120"
                    ></el-table-column>
                    <el-table-column label="门禁通道类型" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <!-- 金库门禁,2|普通门禁,3|互锁门门禁 -->
                        <span v-show="scope.row.class == 1">金库门禁</span>
                        <span v-show="scope.row.class == 2">普通门禁</span>
                        <span v-show="scope.row.class == 3">互锁门门禁</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="brand" label="品牌" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="modelNum" label="型号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="assetCode" label="资产编码" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="collapse-item">
                <div class="box-title">
                  <span class="pointer" @click="toggleOpen('audioChan')">
                    读头通道列表
                    <i :class="dropdownStatus.audioChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                  </span>
                </div>
                <div v-if="dropdownStatus.audioChan" style="width:100%;">
                  <div class="list-header" @click="Multifunction($event, 2)">
                    <i class="el-icon-download" title="获取通道信息" @click="getReadersList"></i>
                    <i class="el-icon-circle-plus-outline" title="新增" @click="addreadesTd"></i>
                    <i class="el-icon-edit" title="编辑"></i>
                    <i class="el-icon-delete" title="删除" @click="delReaders"></i>
                    <i class="el-icon-refresh-right" @click="Refresh(2)" title="刷新"></i>
                  </div>
                  <el-table
                    ref="ReadersTable"
                    :data="readers"
                    tooltip-effect="dark"
                    style="width: 100%"
                    v-loading="readerLoading"
                   
                    @select="selectReaders"
                    @select-all="readersselectAll"
                  >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" prop="index" label="序号" width="55"></el-table-column>
                    <el-table-column show-overflow-tooltip label="读头通道名称" width="120">
                      <template slot-scope="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="serise" label="读头ID" width="120"></el-table-column>
                    <el-table-column prop="uniqueId" label="门禁通道ID" show-overflow-tooltip></el-table-column>
                    <el-table-column label="进出入标识" show-overflow-tooltip>
                      <template slot-scope="scope">{{
                        scope.row.accessSign == 1 ? '出' : scope.row.accessSign == 3 ? '出入' : '入'
                      }}</template>
                    </el-table-column>
                    <el-table-column label="读头类型" show-overflow-tooltip>
                      <template slot-scope="scope">{{ scope.row.kind == 1 ? '指纹' : '人脸' }}</template>
                    </el-table-column>
                    <el-table-column prop="brand" label="品牌" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="modelNum" label="型号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="assetCode" label="资产编码" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="collapse-item">
                <div class="box-title">
                  <span class="pointer" @click="toggleOpen('inputChan')">
                    报警输入列表
                    <i :class="dropdownStatus.inputChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                  </span>
                </div>
                <div v-if="dropdownStatus.inputChan" style="width:100%;">
                  <div class="list-header" @click="Multifunction($event, 3)">
                    <i class="el-icon-download" title="获取通道信息" @click="getInputsList"></i>
                    <i class="el-icon-circle-plus-outline" title="新增" @click="addAlarmTd"></i>
                    <i class="el-icon-edit" title="编辑"></i>
                    <i class="el-icon-delete" title="删除" @click="delInputs"></i>
                    <i class="el-icon-refresh-right" @click="Refresh(3)" title="刷新"></i>
                  </div>
                  <el-table
                    ref="alarmTable"
                    :data="inputs"
                    tooltip-effect="dark"
                    style="width: 100%"
                    v-loading="alarmLoading"
                    height="300"
                    @select="selectInputs"
                    @select-all="inputsselectAll"
                  >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" prop="index" label="序号" width="55"></el-table-column>
                    <el-table-column show-overflow-tooltip label="报警输入名称" width="120">
                      <template slot-scope="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="uniqueId"
                      label="报警输入ID"
                      width="120"
                    ></el-table-column>
                    <el-table-column prop label="资源类型" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="scope.row.resourceType == 1">开门按钮</span>
                        <span v-if="scope.row.resourceType == 2">关门按钮</span>
                        <span v-if="scope.row.resourceType == 3">紧急按钮</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="brand" label="品牌" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="modelNum" label="型号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="assetCode" label="资产编码" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
              <!-- <div v-if="isEditDetector"> -->
              <el-dialog
                :title="clickHostType"
                :visible.sync="isEditDetector"
                width="400px"
                :showClose="false"
                :close-on-click-modal="false"
                v-if="isEditDetector"
              >
                <el-form
                  v-if="clickHostType == '新增'"
                  :model="createAisle"
                  size="mini"
                  label-position="right"
                  label-width="120px"
                  ref="deviceModel"
                >
                  <!-- 普通门禁通道 -->
                  <div v-if="aisleType.addPassessTd">
                    <el-form-item
                      label="门禁通道名称"
                      prop="name"
                      :rules="[
                        { required: true, message: '必填', trigger: 'change' },
                        { min: 1, max: 64, message: '名称在 1 到 64 个字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="createAisle.name"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="门禁通道ID号"
                      prop="uniqueId"
                      :rules="[
                        { required: true, message: '必填', trigger: 'change' },
                        { min: 1, max: 64, message: 'ID最大为64字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="createAisle.uniqueId"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="门禁通道类型"
                      prop="class"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <el-select v-model="createAisle.class">
                        <el-option
                          v-for="(item, index) in ChannelType"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="品牌"
                      prop="brand"
                      :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                      <el-select v-model="createAisle.brand">
                        <el-option
                          v-for="(item, index) in ChannelBrands"
                          :key="index"
                          :label="item.data"
                          :value="item.englishName || item.data"
                          @click.native="changeChannel(index)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="型号"
                      prop="modelNum"
                      :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                      <el-select v-model="createAisle.modelNum">
                        <el-option
                          v-for="(item, index) in ChannelModelNums"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="资产编码"
                      prop="assetCode"
                      :rules="[
                        { required: true, message: '必填', trigger: 'change' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="createAisle.assetCode"></el-input>
                    </el-form-item>
                  </div>
                  <!-- 读头增加 -->
                  <div v-if="aisleType.readersTd">
                    <el-form-item
                      label="读头通道名称"
                      prop="readrname"
                      :rules="[
                        { required: true, message: '必填', trigger: 'change' },
                        { min: 1, max: 64, message: '名称在 1 到 64 个字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="createAisle.readrname"></el-input>
                    </el-form-item>
                    <!-- { min: 1, max: 64, message: '读头通道ID号最大为64位', trigger: 'change' } -->
                    <el-form-item
                      label="读头通道ID号"
                      prop="serise"
                      :rules="[
                        { required: true, message: '必填', trigger: 'change' },
                        { min: 1, max: 64, message: '最大64位', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="createAisle.serise"></el-input>
                    </el-form-item>
                    <!-- {pattern: /^(0|[1-9]\d?|65535)$/,message: '范围在0-65535',trigger: 'change'} -->
                    <el-form-item
                      label="门禁通道ID"
                      prop="readruniqueId"
                      :rules="[
                        { required: true, message: '必填', trigger: 'change' },
                        { min: 1, max: 64, message: '最大64位', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="createAisle.readruniqueId"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="进出入标识"
                      prop="readrkind"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <el-select v-model="createAisle.readrkind">
                        <el-option
                          v-for="(item, index) in Inandout"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <!--  -->
                    <el-form-item
                      label="读头类型"
                      prop="readraccessSign"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <!-- ResourcesTypeArr -->
                      <el-select v-model="createAisle.readraccessSign">
                        <el-option
                          v-for="(item, index) in ResourcesTypeArr"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="品牌"
                      prop="readrbrand"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <el-select v-model="createAisle.readrbrand">
                        <!-- ReadersBrands -->
                        <el-option
                          v-for="(item, index) in ReadersBrands"
                          :key="index"
                          :label="item.data"
                          :value="item.englishName || item.data"
                          @click.native="changeReadrs(index)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="型号"
                      prop="readrmodelNum"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <el-select v-model="createAisle.readrmodelNum">
                        <!-- ReadrsModelNums -->
                        <el-option
                          v-for="(item, index) in ReadrsModelNums"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="资产编码"
                      prop="readrassetCode"
                      :rules="[
                        { required: true, message: '必填', trigger: 'change' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="createAisle.readrassetCode"></el-input>
                    </el-form-item>
                  </div>
                  <!-- 报警输入 -->
                  <div v-if="aisleType.alarmTd">
                    <el-form-item
                      label="报警输入名称"
                      prop="alarmname"
                      :rules="[
                        { required: true, message: '必填', trigger: 'blur' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="createAisle.alarmname"></el-input>
                    </el-form-item>
                    <el-form-item
                      prop="alarmuniqueId"
                      :rules="[
                        { required: true, message: '必填', trigger: 'blur' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'change' }
                      ]"
                      label="报警输入ID号"
                    >
                      <el-input v-model="createAisle.alarmuniqueId"></el-input>
                    </el-form-item>
                    <el-form-item
                      prop="alarmuniqueId"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                      label="资源类型"
                    >
                      <el-select v-model="createAisle.alarmResources">
                        <!-- alarmResources -->
                        <el-option
                          v-for="(item, index) in alarmResources"
                          :key="index"
                          :label="item.data"
                          :value="item.serialNum"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      prop="alarmbrand"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                      label="品牌"
                    >
                      <el-select v-model="createAisle.alarmbrand">
                        <el-option
                          v-for="(item, index) in alarmBrands"
                          :key="index"
                          :label="item.data"
                          :value="item.englishName || item.data"
                          @click.native="changeAlarm(index)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      prop="alarmmodelNum"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                      label="型号"
                    >
                      <!--alarmModelNums  -->
                      <el-select v-model="createAisle.alarmmodelNum">
                        <el-option
                          v-for="(item, index) in alarmModelNums"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      prop="alarmassetCode"
                      :rules="[
                        { required: true, message: '必填', trigger: 'blur' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'change' }
                      ]"
                      label="资产编码"
                    >
                      <el-input v-model="createAisle.alarmassetCode"></el-input>
                    </el-form-item>
                  </div>
                </el-form>
                <!-- 编辑门禁通道 
                  ref="deviceModel2"
                -->
                <el-form
                  v-if="clickHostType == '编辑'"
                  :model="removeTd"
                  size="mini"
                  label-position="right"
                  label-width="120px"
                  ref="hostRmRules"
                >
                  <div v-if="aisleType.addPassessTd">
                    <el-form-item
                      label="门禁通道名称"
                      prop="name"
                      :rules="[
                        { required: true, message: '必填', trigger: 'blur' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="removeTd.name"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="门禁通道ID号"
                      prop="uniqueId"
                      :rules="[
                        { required: true, message: '必填', trigger: 'change' },
                        { min: 1, max: 64, message: 'ID最大为64字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="removeTd.uniqueId"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="门禁通道类型"
                      prop="class"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <el-select v-model="removeTd.class">
                        <el-option
                          v-for="(item, index) in ChannelType"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="品牌"
                      prop="brand"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <el-select v-model="removeTd.brand">
                        <el-option
                          v-for="(item, index) in ChannelBrands"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                          @click.native="changeChannel(index)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="型号"
                      prop="modelNum"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <el-select v-model="removeTd.modelNum">
                        <el-option
                          v-for="(item, index) in ChannelModelNums"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="资产编码"
                      prop="assetCode"
                      :rules="[
                        { required: true, message: '必填', trigger: 'blur' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'blur' }
                      ]"
                    >
                      <el-input v-model="removeTd.assetCode"></el-input>
                    </el-form-item>
                  </div>
                  <!-- 编辑读头通道 -->
                  <div v-if="aisleType.readersTd">
                    <el-form-item
                      label="门禁通道名称"
                      prop="name"
                      :rules="[
                        { required: true, message: '必填', trigger: 'change' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="removeTd.name"></el-input>
                    </el-form-item>
                    <!--   { min: 1, max: 64, message: '读头通道ID号最大为64位', trigger: 'change' } -->
                    <el-form-item
                      label="读头通道ID号"
                      prop="serise"
                      :rules="[
                        { required: true, message: '必填', trigger: 'change' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="removeTd.serise"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="门禁通道ID"
                      prop="uniqueId"
                      :rules="[
                        { required: true, message: '必填', trigger: 'change' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="removeTd.uniqueId"></el-input>
                    </el-form-item>
                    <!-- prop="Inandout"
                    :rules="[{ required: true, message: '必填', trigger: 'change' }]"-->
                    <el-form-item label="进出入标识">
                      <el-select v-model="removeTd.accessSign">
                        <el-option
                          v-for="(item, index) in Inandout"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="读头类型"
                      prop="kind"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <el-select v-model="removeTd.kind">
                        <el-option
                          v-for="(item, index) in ResourcesTypeArr"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="品牌"
                      prop="brand"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <el-select v-model="removeTd.brand">
                        <el-option
                          v-for="(item, index) in ReadersBrands"
                          :key="index"
                          :label="item.data"
                          :value="item.englishName || item.data"
                          @click.native="changeReadrs(index)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="型号"
                      prop="modelNum"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <el-select v-model="removeTd.modelNum">
                        <el-option
                          v-for="(item, index) in ReadrsModelNums"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="资产编码"
                      prop="assetCode"
                      :rules="[
                        { required: true, message: '必填', trigger: 'blur' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="removeTd.assetCode"></el-input>
                    </el-form-item>
                  </div>
                  <!-- 编辑报警输入通道 -->
                  <div v-if="aisleType.alarmTd">
                    <el-form-item
                      label="报警输入名称"
                      prop="name"
                      :rules="[
                        { required: true, message: '必填', trigger: 'blur' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="removeTd.name"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="报警输入ID号"
                      prop="uniqueId"
                      :rules="[
                        { required: true, message: '必填', trigger: 'blur' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="removeTd.uniqueId"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="资源类型"
                      prop="resourceType"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <el-select v-model="removeTd.resourceType">
                        <el-option
                          v-for="(item, index) in alarmResources"
                          :key="index"
                          :label="item.data"
                          :value="item.serialNum"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      prop="brand"
                      label="品牌"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <el-select v-model="removeTd.brand">
                        <el-option
                          v-for="(item, index) in alarmBrands"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                          @click.native="changeAlarm(index)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="型号"
                      prop="modelNum"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]"
                    >
                      <el-select v-model="removeTd.modelNum">
                        <el-option
                          v-for="(item, index) in alarmModelNums"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="资产编码"
                      prop="assetCode"
                      :rules="[
                        { required: true, message: '必填', trigger: 'blur' },
                        { min: 1, max: 64, message: '资产编码最大为64字符', trigger: 'change' }
                      ]"
                    >
                      <el-input v-model="removeTd.assetCode"></el-input>
                    </el-form-item>
                  </div>
                </el-form>
                <div style="text-align:center;">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="saveDetector(clickHostType, createAisle.type, removeTd.type)"
                    >保存</el-button
                  >
                  <el-button size="mini" @click="cance(removeTd.type)">取消</el-button>
                </div>
              </el-dialog>
              <!-- </div> -->
            </div>
            <div v-else>
              <el-button style="margin:10px 0" size="mini">设备异常</el-button>
              <div>
                <span>设备异常</span>
                <el-select v-model="SelectType" placeholder="请选择活动区域">
                  <el-option label="网络断开" value="shanghai"></el-option>
                  <el-option label="防拆报警" value="beijing"></el-option>
                </el-select>
                <el-checkbox v-model="alarmChecked">启动</el-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  // CreateControlList,
  CreateControlList,
  getHostControlList,
  removeControl,
  delControl,
  getHostControlAllTypeList,
  getHostAllControl,
} from '@src/http/access/control'
import { getServeId, brandOrModelNum } from '@src/http/access/getId'
import { getDetal, getHosts } from '@src/http/access/accessMan'
import {
  creatHost,
  removeHost,
  delHostList,
  getRmOrDelHostsList,
  getDesignated,
  getHostList,
} from '@src/http/access/host'
export default {
  components: {
    ListView: () => import('@src/view/accessControl/accessManagement/pages/devices/ListView'),
    tabMenu: () => import('@src/view/accessControl/accessManagement/components/tabMenu'),
    userInfo: () => import('@src/view/accessControl/components/userInfo.vue'),
  },
  props: ['listRow', 'createHost'],
  data() {
    return {
      HostmodelNum:'',
      Passesloading:false,
      readerLoading:false,
      alarmLoading:false,
      copyHostInfo:{},  //重置用
      alarmChecked: false, // 事件管理复选框
      flag: false,
      hostBrands: [], //主机品牌
      hostModelNums: [], //主机型号
      CreatehostType: [],
      ChannelType: [], // 通道类型
      ChannelBrands: [], // 通道品牌
      ChannelModelNums: [], //通道型号
      ReadersBrands: [], //读头品牌
      ReadrsModelNums: [], //读头型号
      ResourcesTypeArr: [], //资源类型
      Inandout: [], // 出入标识
      alarmResources: [], //报警资源类型
      alarmBrands: [], //报警输入品牌\
      alarmModelNums: [],
      aisleType: {
        addPassessTd: false,
        readersTd: false,
        alarmTd: false,
      },
      passesId: '',
      readersId: {},
      aralmId: {},
      selectReadersArr: [],
      selectInputsArr: [],
      viewItem: this.listRow,
      inputs: [],
      passes: [],
      readers: [],
      alarmData: [],
      dutou: [],
      clooeDep: {},
      delControlArr: [],
      loading: false,
      removeTd: {},
      clickHostType: '',
      // 创建普通通道
      createAisle: {
        deviceId: this.listRow.id, //主机 主键id   //创建三种类型都需要该id
        assetCode: '', // 资产编码
        uniqueId: '', //唯一id
        name: '', //平台名称
        type: '', //通道类型 1 门禁通道 2 读头通道 3 报警输入
        class: '', // 类型 1 金库门禁 2 普通门禁 3 互锁们门禁
        brand: '', // 品牌
        modelNum: '', // 型号

        /* 创建读头需要的obj */
        readrdeviceId: this.listRow.id, //主机 主键id
        readrassetCode: '', // 资产编码
        readrname: '', //读头名称
        readruniqueId: '',
        readrid: '', //门禁通道id
        serise: '',
        // readrtype: '', //通道类型 1 门禁通道 2 读头通道 3 报警输入   number
        readrbrand: '', // 品牌
        readrmodelNum: '', // 型号
        readraccessSign: '', // 进出入标识  1 出 2 入
        readrkind: '', // 指纹1 人脸2

        /* 创建报警需要的obj */
        alarmdeviceId: this.listRow.id,
        alarmassetCode: '', // 资产编码
        alarmname: '', //平台名称
        alarmuniqueId: '', //唯一id
        // alarmtype: '', //通道类型 1 门禁通道 2 读头通道 3 报警输入
        alarmmodelNum: '', // 型号
        alarmbrand: '', // 品牌
        alarmResources: '', // 报警资源类型
      },

      isEditDetector: false,
      Info: {
        updatedAt: '',
        updatedDept: '',
        updatedBy: '',
      },
      // 修改主机
      host: {
      },
      createNeedID: '',
      SelectType: '网络断开',
      eventTypes: 1,
      tableData: [],
      dropdownStatus: {
        videoChan: true,
        audioChan: true,
        inputChan: true,
      },
      tabList: ['基础信息', '门禁平台管理', '列表', '修改'],
      formInline: {
        card: 1231231321321313,
        name: 'key',
        nums: '140221',
        orgName: '',
        keyPart: '123',
        devName: '',
        resourceName: '',
        alarmSort: '',
        eventType: '',
        subsystemName: '',
        level: 'all',
        occurTime: [],
        endTime: [],
        receiveTime: [],
        dealTime: [],
        dealType: '',
        opinion: '',
        upgrade: 'all', // 是否升级
      },
      activeNames: ['1', '2', '3'],
      levelList: [],
    }
  },
  methods: {
     /**
    * @description: 处理全选
    * @param {type}:
    * @type:
    * @return:
    */
    inputsselectAll(selection){
      this.selectInputsArr = selection

     console.log('xxxxxxxaaa',this.delControlArr.length);
    },
    readersselectAll(selection){
      this.selectReadersArr = selection
    },
    passesselectAll(selection){
     this.delControlArr = selection

    },
    Refresh(canlType) {
       /**
      * @description: 刷新主机下三类通道
      * @param {type}: Object
      * @type: get
      * @return: data
      */
    if(this.getAslieTimer){
      clearTimeout(this.getAslieTimer)
    }

    if(canlType == 1) this.Passesloading = true
    if(canlType == 2) this.readerLoading = true
    if(canlType == 3) this.alarmLoading = true
     this.getAslieTimer = setTimeout(() => {
          getHostControlList(`/resource/v1/guard/host/${this.listRow.id}/channel`, {
            type: canlType,
          }).then((res) => {
            if(res.data.code == 0){
              if (canlType == 1) {
              this.Passesloading= false
              this.$notify({
                title: '成功',
                message: '刷新完毕',
                type: 'success',
              })
              this.passes = res.data.data
            } else if (canlType == 2) {
              this.readerLoading = false
              this.$notify({
                title: '成功',
                message:  '刷新完毕',
                type: 'success',
              })
              this.readers = res.data.data
            } else if (canlType == 3) {
              this.alarmLoading = false
              this.$notify({
                title: '成功',
                message: '刷新完毕',
                type: 'success',
              })
              this.inputs = res.data.data
            }
            }else{
              this.Passesloading = false
              this.readerLoading = false
              this.alarmLoading = false
              this.$messageError(res.data.message)
            }
          }).catch(err => {
              this.$messageError(err)
          })
     },200)

    },
     /**
    * @description: 增加通道 三类通道 点击时 type已经确认
    * @param {type}:
    * @type:
    * @return:
    */
    addPassessTd() {
      this.aisleType.addPassessTd = true
      this.aisleType.readersTd = false
      this.aisleType.alarmTd = false
      this.createAisle.type = 1
    },
    addreadesTd() {
      this.aisleType.addPassessTd = false
      this.aisleType.readersTd = true
      this.aisleType.alarmTd = false
      this.createAisle.type = 2
    },
    addAlarmTd() {
      this.aisleType.addPassessTd = false
      this.aisleType.readersTd = false
      this.aisleType.alarmTd = true
      this.createAisle.type = 3
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
    cance(type) {
      if(type == 1){
      this.$refs.passesTable.clearSelection()
      this.delControlArr = []
      }else if(type == 2){
      this.$refs.ReadersTable.clearSelection()
      this.selectReadersArr = []

      }else if(type == 3){
      this.$refs.alarmTable.clearSelection()
      this.selectInputsArr = []
      }


      this.isEditDetector = false
      this.createAisle = {
        modelNum: '',
        readrmodelNum: '',
        alarmmodelNum: '',
      }
      this.ChannelModelNums = []
      this.ReadrsModelNums = []
      this.createAisle.modelNum = ''
      this.createAisle.readrmodelNum = ''
    },
    /*
    获取指定主机的远程通道信息  只能获取真实设备
    */
    getHostsTypeConrolList(ConrolType, isRefresh) {
      if(this.timer){
        clearTimeout(this.timer)
      }
      if(ConrolType.type == 1){
        this.Passesloading = true
      }else if(ConrolType.type == 2){
        this.readerLoading = true
      }else if(ConrolType.type == 3){
        this.alarmLoading = true
      }
      //async 接口接入服务器读取数据
      this.timer = setTimeout(() => {
        getHostAllControl(ConrolType).then((res) => {
        if (res.data.code != 0) {
            this.Passesloading = false
            this.readerLoading = false
            this.alarmLoading = false
            this.$notify({
            title: '错误',
            message: '门禁主机不在线',
            type: 'error',
          })
        }else{
              this.$notify({
              title: '成功',
              message: '获取完毕',
              type: 'success',
            })
            this.Passesloading = false
            this.readerLoading = false
            this.alarmLoading = false
        }
        // 获取指定主机下特定类型通道列表
          getHostControlList(`/resource/v1/guard/host/${this.listRow.id}/channel`, {
            type: ConrolType.type,
          }).then((res) => {
            if(res.data.code == 0){
              if (ConrolType.type == 1) {
                this.passes = res.data.data
              } else if (ConrolType.type == 2) {
                this.readers = res.data.data
              } else if (ConrolType.type == 3) {
                this.inputs = res.data.data
              }
            }else{
            }
        })
      })
      },300)

    },
    /*
    获取门禁主机远程通道
    获取真实设备数据 新增的如果不符合真是设备参数 该接口返回新增的通道
    */
    getPassesList() {
      /* 门禁通道 */
      let params = {
        id: this.listRow.id,
        type: 1,
      }
      this.getHostsTypeConrolList(params)
    },
    // 获取读头通道信息
    getReadersList() {
      /* 读头通道参数 */
      let params = {
        id: this.listRow.id,
        type: 2,
      }
      this.getHostsTypeConrolList(params)
    },
    // 获取报警输出通道信息 //
    getInputsList() {
      /* 报警输出参数  */
      let params = {
        id: this.listRow.id,
        type: 3,
      }
      this.getHostsTypeConrolList(params)
    },

    /* 删除门禁通道列表
      AisleTypeArr : 通道类型数据源
      isDelArr :  需要删除的通道arr
      paramsType :  通道类型参数
    */
    deleteAisle(AisleTypeArr, isDelArr, paramsType) {
      if (AisleTypeArr.length < 1) {
        this.$notify({
          title: '警告',
          message: '暂无通道数据,请添加',
          type: 'warning',
        })
        return
      } else if (isDelArr.length < 1) {
           this.$notify({
            title: '警告',
            message: '请选择门禁通道',
            type: 'warning',
        })
        return
      } else {
      setTimeout(() => {
        this.$confirm('此操作将删除指定通道, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
             if(paramsType == 1) this.Passesloading = true
              if(paramsType == 2) this.readerLoading = true
              if(paramsType == 3) this.alarmLoading = true
            let idsArr = isDelArr
              .map((item) => item.id)
              .join()
              .split(',')
            let ids = idsArr
            /*  删除主机下的通道*/
            delControl({ ids: idsArr }).then((res) => {
              // console.log('Log 是否删除通道成功', res)
              // 删除后重新调用获取通道接口
              if(res.data.code == 0 ){
                  this.$notify({
                    title: '成功',
                    message: paramsType == 1? '删除门禁通道成功' : paramsType == 2 ? '删除读头通道成功' : '删除报警通道成功',
                    type: 'success',
                  })
              }
              // loading err 处理
              if(paramsType == 1) this.Passesloading = true
              if(paramsType == 2) this.readerLoading = true
              if(paramsType == 3) this.alarmLoading = true
              this.isEditDetector = false
              // 获取指定主机下 特定类型通道列表
              getHostControlList(`/resource/v1/guard/host/${this.listRow.id}/channel`, {
                // type: 1
                type: paramsType,
              }).then((res) => {
                if(res.data.code == 0){
                    if (paramsType == 1) {
                       this.Passesloading = false
                      this.readerLoading = false
                      this.alarmLoading = false

                      this.passes = res.data.data
                      this.delControlArr = []
                    } else if (paramsType == 2) {
                      this.readerLoading = false
                      this.readers = res.data.data
                      this.selectReadersArr = []
                    } else {
                      this.alarmLoading = false
                      this.inputs = res.data.data
                      this.selectInputsArr = []
                    }
                  }else{
              // loading err 处理
                      if(paramsType == 1) this.Passesloading = true
                      if(paramsType == 2) this.readerLoading = true
                      if(paramsType == 3) this.alarmLoading = true
                  }
              })
            })
          })
          .catch(() => {
              if(paramsType == 1){
              this.$refs.passesTable.clearSelection()
              this.delControlArr = []
              }else if(paramsType == 2){
              this.$refs.ReadersTable.clearSelection()
              this.selectReadersArr = []
              }else if(paramsType == 3){
              this.$refs.alarmTable.clearSelection()
              this.selectInputsArr = []
              }
            this.$notify({
              title: '成功',
              message: '取消删除成功',
              type: 'success',
            })
          })
        },300)

      }
    },
    /* 删除门禁通道 */
    delPasses() {
      this.deleteAisle(this.passes, this.delControlArr, 1)
      return
      if (this.passes.length < 1) {
        this.$notify({
            title: '警告',
            message: '暂无门禁通道,请添加',
            type: 'warning',
        })
        return
      } else if (this.delControlArr.length < 1) {
            this.$notify({
            title: '警告',
            message: '请选择门禁通道',
            type: 'warning',
        })
        return
      } else {
        this.$confirm('此操作将删除指定通道, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            let idsArr = this.delControlArr
              .map((item) => item.id)
              .join()
              .split(',')
            let ids = idsArr
            /*  删除主机下的通道*/
            delControl({ ids: idsArr }).then((res) => {
              // console.log('Log 是否删除通道成功', res)
              // 删除后重新调用获取通道接口
              if(res.data.code == 0){
                  this.$notify({
                    title: '成功',
                    message: '删除通道成功',
                    type: 'success',
                  })
              }
              // this.$refs.multipleTable.clearSelection()
              this.isEditDetector = false
              // 获取指定主机下 特定类型通道列表
              getHostControlList(`/resource/v1/guard/host/${this.listRow.id}/channel`, {
                type: 1,
              }).then((res) => {
                if(res.data.code == 0){
                  this.passes = res.data.data.passes
                  this.readers = res.data.data.readers
                  this.inputs = res.data.data.inputs
                }
              })
            })
          })
          .catch(() => {
            this.delControlArr = []
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      }
    },
    /* 删除读头通道列表 */
    delReaders() {
      this.deleteAisle(this.readers, this.selectReadersArr, 2)
    },
    /* 删除报警通道列表 */
    delInputs() {
      this.deleteAisle(this.inputs, this.selectInputsArr, 3)
    },
    selectPasses(s, row) {
      let deepObj = this.$lodash.cloneDeep(row)

      if (deepObj.class == 1) {
        deepObj.class = '金库门禁'
      } else if (deepObj.class == 2) {
        deepObj.class = '普通门禁'
      } else {
        deepObj.class = '互锁门门禁'
      }

      this.removeTd = deepObj

      this.passesId = row.id
      this.delControlArr = s
      this.clooeDep = JSON.parse(JSON.stringify(this.removeTd))
    },
    // 读头del arr
    selectReaders(s, row) {
      let deepObj = this.$lodash.cloneDeep(row)
      switch (deepObj.accessSign) {
        case 3:
          deepObj.accessSign = '出入'
          break
        case 2:
          deepObj.accessSign = '入'
          break
        case 1:
          deepObj.accessSign = '出'
          break
        default:
          break
      }
      switch (deepObj.kind) {
        case 1:
          deepObj.kind = '指纹'
          break
        case 2:
          deepObj.kind = '人脸'
          break
        default:
          break
      }
      this.removeTd = deepObj
      this.selectReadersArr = s
      this.readersId = row
      // console.log('Log -----------------------', this.selectReadersArr)
    },
    //报警输出del arr
    selectInputs(s, row) {
      let deepObj = this.$lodash.cloneDeep(row)
      switch (deepObj.resourceType) {
        case 1:
          deepObj.resourceType = '开门按钮'
          break
        case 2:
          deepObj.resourceType = '关门按钮'
          break
        case 3:
          deepObj.resourceType = '紧急按钮'
          break
        default:
          break
      }

      this.removeTd = deepObj
      this.selectInputsArr = s
      this.aralmId = row
    },
    // 弹出框保存按钮
    saveDetector(hostType, TdType, rmType) {
      // console.log('Log --------------', hostType)
      if (hostType == '新增') {
        // this.CreateTd()
        if (TdType == 1) {
          let addPt = {
            deviceId: this.listRow.id,
            assetCode: this.createAisle.assetCode,
            uniqueId: this.createAisle.uniqueId,
            name: this.createAisle.name,
            type: this.createAisle.type,
            class: '',
            brand: this.createAisle.brand,
            modelNum: this.createAisle.modelNum,
          }
          if (this.createAisle.class == '金库门禁') {
            addPt.class = 1
          } else if (this.createAisle.class == '普通门禁') {
            addPt.class = 2
          } else if (this.createAisle.class == '联动互锁门') {
            addPt.class = 3
          }
          /*  */
          this.addTongdao(TdType, addPt)
        } else if (TdType == 2) {
          let readreObj = {
            deviceId: this.listRow.id, //主机 主键id
            assetCode: this.createAisle.readrassetCode, // 资产编码
            name: this.createAisle.readrname, //读头名称\
            serise: this.createAisle.serise, //读头通道号
            uniqueId: this.createAisle.readruniqueId, //读头id
            id: this.createAisle.readrid, //门禁通道id
            type: this.createAisle.type, //通道类型 1 门禁通道 2 读头通道 3 报警输入   number
            brand: this.createAisle.readrbrand, // 品牌
            modelNum: this.createAisle.readrmodelNum, // 型号
            accessSign: this.createAisle.readrkind,
            kind: this.createAisle.readraccessSign == '指纹' ? 1 : 2,
          }
          if (readreObj.accessSign == '出') {
            readreObj.accessSign = 1
          } else if (readreObj.accessSign == '入') {
            readreObj.accessSign = 2
          } else {
            readreObj.accessSign = 3
          }
          this.duTouTongdao(TdType, readreObj)
        } else if (TdType == 3) {
          let alarmObj = {
            /* 创建报警需要的obj */
            deviceId: this.listRow.id,
            assetCode: this.createAisle.alarmassetCode, // 资产编码
            name: this.createAisle.alarmname, //平台名称
            uniqueId: this.createAisle.alarmuniqueId, //唯一id
            type: this.createAisle.type, //通道类型 1 门禁通道 2 读头通道 3 报警输入
            modelNum: this.createAisle.alarmmodelNum, // 型号
            brand: this.createAisle.alarmbrand, // 品牌
            resourceType: this.createAisle.alarmResources,
          }

          alarmObj.resourceType = alarmObj.resourceType * 1
          this.alarmTd(TdType, alarmObj)
        }

        this.delControlArr = []
        this.selectReadersArr = []
        this.selectInputsArr = []
        // this.$refs['deviceModel'].resetFields()
      } else if (hostType == '编辑' && rmType) {
        this.$refs['hostRmRules'].validate((valid) => {
          if (valid) {
            if (rmType == 1) {
              this.grundEdit()
            } else if (rmType == 2) {
              this.readersEdit()
            } else if (rmType == 3) {
              this.alarmEdit()
            }
            this.delControlArr = []
            this.selectReadersArr = []
            this.selectInputsArr = []
            this.isEditDetector = false
            let { keyPartType, keyPartId, id, orgId } = this.listRow
          } else {
            return false
          }
        })
      }
    },
    CreateTd(type, parameterBody) {
      // debugger
      this.$refs['deviceModel'].validate((valid) => {
        if (valid) {
          CreateControlList(parameterBody).then((res) => {
            // 保留创建通道必修的主机id
            if (res.data.code != 0) {
                   this.$notify({
                    title: '失败',
                    message: res.data.message,
                    type: 'error',
                  })
              this.isEditDetector = false
              return
            } else {
              this.isEditDetector = false
              // this.$messageSuccess('创建成功')
              if(type == 1){
                this.$notify({
                  title: '成功',
                  message: '创建门禁通道成功',
                  type: 'success',
                })
              }
                if(type == 2){
                this.$notify({
                  title: '成功',
                  message: '创建读头通道成功',
                  type: 'success',
                })
              }
                if(type == 3){
                this.$notify({
                  title: '成功',
                  message: '创建报警通道成功',
                  type: 'success',
                })
              }

            }
            this.$refs['deviceModel'].resetFields()
            for (let index in this.createAisle) {
              if (index != 'deviceId' && index != 'readrdeviceId' && index != 'alarmdeviceId') {
                this.createAisle[index] = ''
              }
            }
            getHostControlList(`/resource/v1/guard/host/${this.listRow.id}/channel`, {
              type: type,
            }).then((res) => {
              // res.data.data.forEach((item, index) => {
                if (type == 1) {
                  this.passes = res.data.data
                }
                if (type == 2) {
                  this.readers = res.data.data
                }
                if (type == 3) {
                  this.inputs = res.data.data
                }
              // })
              // if (res.data.data.type) this.passes = res.data.data
              // 新建通道之后将校验和结构移除
              // this.$refs['deviceModel'].resetFields()
              // this.isEditDetector = false
            })
          })
        } else {
          return false
        }
      })
    },
     /**
    * @description: 主机增删改 提示处理fn 待优化
    * @param {type}:
    * @type:
    * @return:
    */
    Multifunction(v, type) {
      // 获取指定平台下的主机列表
      switch (v.target.title) {
        case '获取通道信息':
          this.clickHostType = '获取通道信息'
          return
          this.loading = true
          break
        case '新增':
          /* fn... */
          this.clickHostType = '新增'
          this.isEditDetector = true
          break
        case '编辑':
          this.clickHostType = '编辑'
          if (type == 1) {
            // if(this.delControlArr.length < 1)
            console.log('xxxx',this.delControlArr.length);
            if (this.delControlArr.length < 1) {
                this.$notify({
                  title: '警告',
                  message: '请选择要编辑的门禁通道',
                  type: 'warning',
                })
              return

            }
                if(this.delControlArr.length > 1){
                this.$notify({
                  title: '警告',
                  message: '不支持多选编辑',
                  type: 'warning',
                })
                  return
              }
              this.aisleType.addPassessTd = true
              this.aisleType.readersTd = false
              this.aisleType.alarmTd = false
              this.isEditDetector = true

          } else if (type == 2) {
            if (this.selectReadersArr.length < 1) {
              this.$notify({
                title: '警告',
                message: '请选择要编辑的读头通道',
                type: 'warning',
              })
              return
            }

                  if(this.selectReadersArr.length > 1){
                this.$notify({
                  title: '警告',
                  message: '不支持多选编辑',
                  type: 'warning',
                })
                  return
              }
              this.aisleType.addPassessTd = false
              this.aisleType.readersTd = true
              this.aisleType.alarmTd = false
              this.isEditDetector = true

          } else if (type == 3) {
            if (this.selectInputsArr.length < 1) {
              this.$notify({
                title: '警告',
                message: '请选择要编辑的报警输出通道',
                type: 'warning',
              })
              return
            }
                    if(this.selectInputsArr.length > 1){
                this.$notify({
                  title: '警告',
                  message: '不支持多选编辑',
                  type: 'warning',
                })
                  return
              }
            // else {
              this.aisleType.addPassessTd = false
              this.aisleType.readersTd = false
              this.aisleType.alarmTd = true
              this.isEditDetector = true
            // }
          }
          break
        case '删除':
          return
          this.clickHostType = '删除'
          break
        case '刷新':
          /* fn... */
          // this.loading = true
          // setTimeout(() => {
            // this.loading = false
          // }, 1000)
          break
        default:
          break
      }
    },
    // 获取主机通道 函数 type (1:门禁通道 2:读头通道 3:报警通道 )
    getTdTypeList(TDtype) {
      getHostControlList(`/resource/v1/guard/host/${this.listRow.id}/channel`, {
        type: TDtype,
      }).then((res) => {
        res.data.data.forEach((item, index) => {
          if (item.type == 1) {
            this.passes.push(item)
          }
          if (item.type == 2) {
            this.dutou.push(item)
          }
          if (item.type == 3) {
            this.alarmData.push(item)
          }
        })

        if (res.data.data.type) this.passes = res.data.data
      })
    },

    //创建门禁通道
    addTongdao(type, body) {
      this.isEditDetector = true
      // 创建门禁通道
      this.CreateTd(type, body)
    },
    // 创建读头通道
    duTouTongdao(type, body) {
      // alert('xxxxxxxxxxxxxx')
      this.isEditDetector = true
      this.CreateTd(type, body)
    },
    // 创建报警通道
    alarmTd(type, body) {
      // alert('xxxxxxxxxxxxxx')e
      this.isEditDetector = true
      this.CreateTd(type, body)
    },
    // 重置
    reset() {
      let res = this.$lodash.cloneDeep(this.copyHostInfo)

      this.host = res
    },
    collClick() {},
    //点击保存去查看页面
    change(type) {
      if (type == 'view') {
        this.$refs['deviceModelHost'].validate((valid) => {
          if (valid) {
            this.$refs['deviceModel2Host'].validate((valid2) => {
              if (valid2) {
                /* 修改主机*/
                let body = {
                  platformId: this.host.platformId, // 所属门禁平台id
                  assetCode: this.host.assetCode || '',
                  uniqueId: this.host.uniqueId || '',
                  name: this.host.name || '',
                  id: this.host.id || '',
                  type: this.host.type || '',
                  brand: this.host.brand || '',
                  modelNum: this.host.modelNum || '',
                  readerNumber: this.host.readerNumber || '',
                  guardNumber: this.host.guardNumber || '',
                  inputNumber: this.host.inputNumber || '',
                  status: this.host.status || '',
                }

                if (this.host.type == '金库门禁') {
                  body.type = 1
                } else if (this.host.type == '普通门禁') {
                  body.type = 2
                } else {
                  body.type = 3
                }
                // 修改主机
                removeHost(`/resource/v1/guard/host/${this.host.id}`, body).then((res) => {
                  getDesignated(this.host)
                    .then((res) => {
                      this.host = res.data.data.host
                      this.inputs = res.data.data.inputs
                      this.passes = res.data.data.passes
                      this.readers = res.data.data.readers
                      this.host.readerNumber = Number(this.host.readerNumber)
                      this.host.guardNumber = Number(this.host.guardNumber)
                      this.host.inputNumber = Number(this.host.inputNumber)
                      /* Refresh */
                      this.$parent.getList()
                      this.$emit('modelChange', {
                        status: 'ListView',
                        flag: true,
                        currtCom: '查看',
                        user: this.Info,
                        id: this.host,
                      })
                         this.$notify({
                          title: '成功',
                          message: '保存成功',
                          type: 'success',
                          })
                    })
                    .catch((err) => console.log('Log error', err))
                })
              } else {
                return false
              }
            })
          } else {
            return false
          }
        })
      } else {
        this.$emit('modelChange', {
          status: true,
          currtCom: '列表',
        })
      }
    },
    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },
    //获取指定门禁主机及所属通道信息
    getAppointedInfo() {
      let { id } = this.listRow
      getDesignated({ id })
        .then((res) => {
          let hosts = this.$lodash.cloneDeep(res.data.data.host)
          if (hosts.type == 1) {
            hosts.type = '金库门禁'
          } else if (hosts.type == 2) {
            hosts.type = '普通门禁'
          } else {
            hosts.type = '联动互锁门'
          }
          hosts.readerNumber = Number(hosts.readerNumber)
          hosts.guardNumber = Number(hosts.guardNumber)
          hosts.inputNumber = Number(hosts.inputNumber)
          if(!hosts.modelNum){
            hosts.modelNum = ''
          }
          this.host = this.$lodash.cloneDeep(hosts)
                // 修改主机
          // this.host =  {
          //   platformId:hosts.platformId || '',
          //   assetCode: hosts.assetCode || '',
          //   uniqueId: hosts.uniqueId || '',
          //   name: hosts.name || '',
          //   id: hosts.id || '',
          //   type: hosts.type || '',
          //   brand: hosts.brand || '',
          //   modelNum:  hosts.modelNum || '',
          //   readerNumber: hosts.readerNumber || '',
          //   guardNumber: hosts.guardNumber || '',
          //   inputNumber:hosts.inputNumber || '',
          //   status: hosts.status || '',
          //   orgName: hosts.orgName || '',
          //   keyPartName: hosts.keyPartName || '',
          //   status: hosts.status || '',
          // },
          // 重置用
          this.copyHostInfo = this.$lodash.cloneDeep(hosts)
          this.inputs = res.data.data.inputs
          this.passes = res.data.data.passes
          this.readers = res.data.data.readers
          this.Info = {
            updatedAt: this.host.updatedAt,
            updatedDept: this.host.orgName,
            updatedBy: this.host.updatedBy,
          }
        })
        .catch((err) => console.log('Log error', err))
    },
    // 编辑门禁通道
    grundEdit() {
      let _this = this
      let id = _this.passesId
      let body = {
        deviceId: this.listRow.id,
        assetCode: this.removeTd.assetCode || '',
        id: id,
        uniqueId: this.removeTd.uniqueId || '',
        name: this.removeTd.name || '', // 平台名称
        class: this.removeTd.class || '',
        brand: this.removeTd.brand || '',
        modelNum: this.removeTd.modelNum || '',
        type: 1,
      }
      if (body.class == '金库门禁') {
        body.class = 1
      } else if (body.class == '普通门禁') {
        body.class = 2
      } else {
        body.class = 3
      }
      if(this.grundTimer){
        clearTimeout(this.grundTimer)
      }
      this.Passesloading = true
      this.grundTimer = setTimeout(() => {
        removeControl(id, body).then((res) => {
        if (res.data.code != 0) {
          this.$messageError('门禁通道ID重复,修改失败!')
          this.Passesloading = false
          return
        }
        /**
         * @description: 获取指定主机下门禁通道列表
         * @param {type}: 主机id , type
         * @return: data
         */
        getHostControlList(`/resource/v1/guard/host/${this.listRow.id}/channel`, {
          type: 1,
        }).then((res) => {
          this.passes = res.data.data
        })
        this.Passesloading = false
        this.$notify({
            title: '成功',
            message: '门禁通道修改成功',
            position: 'top-right',
            type: 'success',
          })
      })
      },300)
    },
    //编辑读头通道
    readersEdit() {
      let _this = this
      let body = {
        deviceId: this.listRow.id,
        assetCode: this.removeTd.assetCode, // 资产编码
        name: this.removeTd.name, //读头名称
        serise: this.removeTd.serise,
        uniqueId: this.removeTd.uniqueId, //读头id
        id: this.removeTd.id, //门禁通道id
        brand: this.removeTd.brand, // 品牌
        modelNum: this.removeTd.modelNum, // 型号
        accessSign: this.removeTd.accessSign == '出' ? 1 : this.removeTd.accessSign == '入' ? 2 : 3,
        kind: this.removeTd.kind == '指纹' ? 1 : 2,
        type: 2,
      }

      this.readerLoading = true
      if(this.redaerTimer){
        clearTimeout(this.redaerTimer)
      }
      this.redaerTimer = setTimeout(() => {
          removeControl(this.readersId.id, body).then((res) => {
        if (res.data.code != 0) {
          this.$messageError('门禁通道ID重复,修改失败!')
          this.readerLoading = false
          return
        }
        getHostControlList(`/resource/v1/guard/host/${this.listRow.id}/channel`, {
          type: 2,
        }).then((res) => {
           this.readerLoading = false
               this.$notify({
              title: '成功',
              message: '读头通道修改成功',
              position: 'top-right',
              type: 'success',
            })
          this.readers = res.data.data
        })
        // res 数据为判断code 防止laoding不消失
        // this.readerLoading = false
      })
      },300)
    },
    //编辑报警输出通道
    alarmEdit() {
      let body = {
        deviceId: this.listRow.id,
        assetCode: this.removeTd.assetCode, // 资产编码
        name: this.removeTd.name, //平台名称
        uniqueId: this.removeTd.uniqueId, //唯一id
        id: this.removeTd.id, //门禁通道id
        // type: this.removeTd.type, //通道类型 1 门禁通道 2 读头通道 3 报警输入
        modelNum: this.removeTd.modelNum, // 型号
        brand: this.removeTd.brand, // 品牌
        resourceType: this.removeTd.resourceType, // 资源类型
        type: 3,
      }
      body.resourceType = body.resourceType * 1

      if(this.alarmTimer){
        clearTimeout(this.alarmTimer)
      }
      this.alarmLoading = true
      this.alarmTimer = setTimeout(() => {
        removeControl(this.aralmId.id, body).then((res) => {
        if (res.data.code != 0) {
          this.$messageError('门禁通道ID重复,修改失败!')
          this.alarmLoading = false
          return
        }
        getHostControlList(`/resource/v1/guard/host/${this.listRow.id}/channel`, {
          type: 3,
        }).then((res) => {
          this.inputs = res.data.data
          this.alarmLoading = false
            this.$notify({
              title: '成功',
              message: '报警通道修改成功',
              position: 'top-right',
              type: 'success',
            })
        })
      })
      },300)
    },
    //主机型号
    changeBrans(index) {
      this.host.modelNum = ''
      let hostModelNumsType = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '5' }]
      let HostModelNumsType = hostModelNumsType
      brandOrModelNum({ queryList: HostModelNumsType }).then((res) => {
        this.hostModelNums = res.data.data[0].attr
        let brand = this.hostBrands
        this.AllmodelList = this.hostModelNums
        let modelList = this.hostModelNums
        let data1 = brand[index].data
        let arr = []
        modelList.filter((v) => {
          if (v.homeClass == data1) {
            arr.push(v)
          }
          this.hostModelNums = arr
        })
      })
    },
    //门禁通道品牌
    changeChannel(index) {
      this.createAisle.modelNum = ''
      this.removeTd.modelNum = ''
      // 新建门禁通道型号
      /* ChannelModelNums */
      let ChannelModelNumsa = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '15' }]
      let HostModelNumsType = ChannelModelNumsa
      brandOrModelNum({ queryList: HostModelNumsType }).then((res) => {
        this.ChannelModelNums = res.data.data[0].attr
        let brand = this.ChannelBrands // 通道品牌
        let modelList = this.ChannelModelNums
        let data1 = brand[index].data
        let arr = []
        modelList.filter((v) => {
          if (v.homeClass == data1) {
            arr.push(v)
          }
          this.ChannelModelNums = arr
        })
      })
    },
    //门禁读头品牌
    changeReadrs(index) {
      this.createAisle.readrmodelNum = ''
      this.removeTd.modelNum = ''
      // 新建门禁读头型号
      let ReadrsModelNums = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '20' }]
      let ReadrsModelNumsType = ReadrsModelNums
      brandOrModelNum({ queryList: ReadrsModelNumsType }).then((res) => {
        this.ReadrsModelNums = res.data.data[0].attr
        let brand = this.ReadersBrands // 通道品牌
        let modelList = this.ReadrsModelNums
        let data1 = brand[index].data
        let arr = []
        modelList.filter((v) => {
          if (v.homeClass == data1) {
            arr.push(v)
          }
          this.ReadrsModelNums = arr
        })
      })
    },
    //读头品牌
    changeAlarm(index) {
      this.createAisle.alarmmodelNum = ''
      this.removeTd.modelNum = ''

      let ReadrsModelNums = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '17' }]
      let ReadrsModelNumsType = ReadrsModelNums
      brandOrModelNum({ queryList: ReadrsModelNumsType }).then((res) => {
        this.alarmModelNums = res.data.data[0].attr
        let brand = this.alarmBrands // 通道品牌
        let modelList = this.alarmModelNums
        let data1 = brand[index].data
        let arr = []
        modelList.filter((v) => {
          if (v.homeClass == data1) {
            arr.push(v)
          }
          this.alarmModelNums = arr
        })
      })
    },
  },
  created() {
    this.getAppointedInfo()
  },
  mounted() {
    // 门禁主机类型
    let brands = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '6' }]
    let queryList = brands
    // let modelNums =
    brandOrModelNum({ queryList }).then((res) => {
      this.CreatehostType = res.data.data[0].attr
    })

    //修改门禁主机品牌
    let hostBrands = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '4' }]
    let HostBrandsType = hostBrands
    brandOrModelNum({ queryList: HostBrandsType }).then((res) => {
      this.hostBrands = res.data.data[0].attr
    })

    //门禁通道类型
    let Channel = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '13' }]
    let ChannelS = Channel
    brandOrModelNum({ queryList: ChannelS }).then((res) => {
      this.ChannelType = res.data.data[0].attr
    })

    //门禁通道品牌
    let ChannelBrands = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '14' }]
    let ChannelType = ChannelBrands
    brandOrModelNum({ queryList: ChannelType }).then((res) => {
      this.ChannelBrands = res.data.data[0].attr
    })

    // //读头通道品牌
    let readrsBrans = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '19' }]
    let readrs = readrsBrans
    brandOrModelNum({ queryList: readrs }).then((res) => {
      // debugger
      console.log('Log view 读头品牌 ? ', res)
      this.ReadersBrands = res.data.data[0].attr
      console.log('Log view 读头品牌 ? ', this.ReadersBrands)
    })

    //读头资源类型
    let Resources = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '12' }]
    let ResourcesType = Resources
    brandOrModelNum({ queryList: ResourcesType }).then((res) => {
      this.ResourcesTypeArr = res.data.data[0].attr
    })

    //读头出入标识
    let InOrOut = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '7' }]
    let InOrOutS = InOrOut
    brandOrModelNum({ queryList: InOrOutS }).then((res) => {
      this.Inandout = res.data.data[0].attr
    })

    //报警输入资源类型
    let alarmResources = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '18' }]
    let alarms = alarmResources
    brandOrModelNum({ queryList: alarms }).then((res) => {
      this.alarmResources = res.data.data[0].attr
    })

    // 报警输入品牌
    let alarmBrands = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '16' }]
    let alarmsA = alarmBrands
    brandOrModelNum({ queryList: alarmsA }).then((res) => {
      this.alarmBrands = res.data.data[0].attr
    })
  },
  beforeDestroy() {
    // clearTimeout(this.timer)
  },
}
</script>
<style lang="less" scoped>
.deviceHeader {
  margin-bottom: 10px;
  .form-box {
    width: 80%;
    height: auto;
    margin: 0 auto;
    .form-content {
      display: flex;
      font-size: 12px;
      padding: 10px;
      border: 1px solid rgba(225, 225, 225, 1);
      background: rgba(245, 245, 245, 1);

      .left-form {
        width: 50%;
        margin-right: 24px;
      }
      .right-form {
        width: 50%;
      }
      /deep/ .el-form-item {
        margin-bottom: 5px;
        .el-select {
          width: 100%;
        }
      }
      /deep/ .el-form-item {
        margin-bottom: 15px;
      }

      /deep/ .el-input__inner {
        height: 35px;
        border-radius: 0px;
        line-height: 35px;
      }
      /deep/ .el-form-item__label {
        line-height: 35px;
      }
    }
    .form-footer {
      width: 100%;
      margin: 10px 0;
      text-align: center;
    }
  }
}
.colls {
  height: 285px;
  // overflow-x: hidden;
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
        .pointer {
          position: relative;
          margin-left: 5px;
          color: #2d71d3;
          padding-left: 5px;
          &::after {
            position: absolute;
            content: '';
            display: block;
            width: 2px;
            height: 12px;
            background: #2d71d3;
            left: -5px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      .list-header {
        text-align: right;
        margin-bottom: 10px;
        i {
          cursor: pointer;
          width: 35px;
          margin-right: 10px;
          font-size: 16px;
          height: 28px;
          line-height: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 3px;
          line-height: 28px;
          text-align: center;
        }
      }
    }
  }
  /deep/ .el-input__inner {
    width: 240px;
  }
}

.bottomInfo {
  margin-top: 20px 0;
  .alarm-log-btn {
    width: 1438px;
    text-align: center;
    margin-top: 10px;
  }
}
#devHost {
  .meus {
    padding: 10px 0;
  }
  width: 100%;
  height: 100%;

  .eventTab {
  }
}
/deep/ .el-collapse {
  border: none;
}
/deep/ .el-collapse-item__header {
  display: none;
}
/deep/ .el-table--scrollable-y .el-table__body-wrapper {
  overflow: hidden;
}
.deviceCon {
  // overflow: auto;
}
</style>
