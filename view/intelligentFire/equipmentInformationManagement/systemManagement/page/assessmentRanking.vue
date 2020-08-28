<template>
  <div class="content">
    <!-- <div class="left-tree">
      <treeBox
        :lazyTreeApi="getTreeApi"
        searchType="filter"
        :treeType="treeType"
        @onceClick="onceClick"
        treeLazyToggle
        iconToggle
        :customizeQuery="customizeQuery"
      ></treeBox>
    </div> -->
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>消防系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ sidebarActive }}</el-breadcrumb-item>
            <el-breadcrumb-item>查询</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="form-box" v-if="isShowDetail === 'list'">
        <div class="box-title" @click="toggleOpen('detector')">
          查询条件
          <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </div>
        <div class="form-content" v-if="dropdownStatus.detector">
          <div class="left-form">
            <el-form
              ref="addForm"
              size="mini"
              :model="formData"
              label-position="right"
              :inline="true"
              label-width="120px"
              :rules="rules"
            >
              <div class="flex-div">
                <el-form-item label="所属机构">
                  <el-autocomplete
                    class="w-input"
                    v-model="formData.orgName"
                    value-key="name"
                    :fetch-suggestions="
                      (val, callback) => {
                        querySearch('org', val, callback)
                      }
                    "
                    placeholder="请输入机构"
                    :trigger-on-focus="false"
                    @select="
                      val => {
                        selectItem('org', val)
                      }
                    "
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="所属重点部位">
                  <el-autocomplete
                    class="w-input"
                    :disabled="!formData.orgId"
                    v-model="formData.keyPartName"
                    value-key="name"
                    :fetch-suggestions="
                      (val, callback) => {
                        querySearch('kp', val, callback)
                      }
                    "
                    placeholder="请输入重点部位"
                    :trigger-on-focus="false"
                    @select="
                      val => {
                        selectItem('kp', val)
                      }
                    "
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="设备分类" v-if="sidebarActiveId === 12">
                  <el-select class="w-input" v-model="formData.inputDeviceType" @change="changeTransClass">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in transDevClassList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备名称" v-if="sidebarActiveId !== 12">
                  <el-input v-model="formData.name" class="w-input"> </el-input>
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="设备名称" v-if="sidebarActiveId === 12">
                  <el-input v-model="formData.name" class="w-input"> </el-input>
                </el-form-item>
                <el-form-item label="设备品牌">
                  <el-select
                    v-model="formData.brand"
                    class="w-input"
                    @change="changeBrand"
                    v-if="sidebarActiveId !== 12"
                  >
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in devBrandList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                  <el-select
                    class="w-input"
                    v-model="formData.brand"
                    @change="changeTransBrand"
                    v-if="sidebarActiveId === 12"
                  >
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in transDevBrandList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备型号">
                  <el-select v-model="formData.modelNum" class="w-input" v-if="sidebarActiveId !== 12">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in devModelList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                  <el-select class="w-input" v-model="formData.modelNum" v-if="sidebarActiveId === 12">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in transDevModelList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备标签" v-if="sidebarActiveId !== 12">
                  <el-select v-model="formData.label" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in devLabelList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="标签编码">
                  <el-input v-model="formData.labelCode" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="设备有效期">
                  <!-- <el-input v-model="formData.validity" class="w-input"></el-input> -->
                  <el-date-picker
                    v-model="formData.startValidity"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="起始时间"
                    class="w-time"
                  >
                  </el-date-picker>
                  -
                  <el-date-picker
                    v-model="formData.endValidity"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="结束时间"
                    class="w-time"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="设备位置">
                  <el-input v-model="formData.address" class="w-input"></el-input>
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="资产编码">
                  <el-input v-model="formData.assetCode" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="生产日期">
                  <el-date-picker
                    v-model="formData.startProduction"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="起始时间"
                    class="w-time"
                  >
                  </el-date-picker>
                  -
                  <el-date-picker
                    v-model="formData.endProduction"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="结束时间"
                    class="w-time"
                  ></el-date-picker>
                  <!-- <el-input v-model="formData.userName" class="w-input"></el-input> -->
                </el-form-item>
                <el-form-item label="设备标签" v-if="sidebarActiveId === 12">
                  <el-select v-model="formData.label" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in devLabelList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="传输设备分类" v-if="sidebarActiveId !== 12">
                  <el-select v-model="formData.inputDeviceType" class="w-input" @change="changeTransClass">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in transDevClassList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex-div" v-if="sidebarActiveId !== 12">
                <el-form-item label="传输设备名称">
                  <el-input v-model="formData.inputDeviceName" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="传输设备品牌">
                  <el-select v-model="formData.inputDeviceBrand" class="w-input" @change="changeTransBrand">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in transDevBrandList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="传输设备型号">
                  <el-select v-model="formData.inputDeviceModel" class="w-input">
                    <el-option label="全部" value=" "></el-option>
                    <el-option
                      v-for="(item, index) in transDevModelList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="通讯类型" v-if="sidebarActiveId === 12">
                  <el-select v-model="formData.inputCommunicationType" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      label="内网"
                      value="内网"
                      v-if="formData.inputDeviceType === '用户信息传输装置' || formData.inputDeviceType === ''"
                    ></el-option>
                    <el-option
                      label="NB"
                      value="NB"
                      v-if="formData.inputDeviceType !== '用户信息传输装置' || formData.inputDeviceType === ''"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="传输通讯类型" v-if="sidebarActiveId !== 12">
                  <el-select v-model="formData.inputCommunicationType" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      label="内网"
                      value="内网"
                      v-if="formData.inputDeviceType === '用户信息传输装置' || formData.inputDeviceType === ''"
                    ></el-option>
                    <el-option
                      label="NB"
                      value="NB"
                      v-if="formData.inputDeviceType !== '用户信息传输装置' || formData.inputDeviceType === ''"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备IMEI/ID" v-if="sidebarActiveId === 12">
                  <el-input v-model="formData.inputDeviceImei" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="传输设备IMEI/ID" v-if="sidebarActiveId !== 12">
                  <el-input v-model="formData.inputDeviceImei" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="传输设备IP地址" v-if="sidebarActiveId !== 12">
                  <el-input v-model="formData.inputDeviceIp" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="所属服务" v-if="sidebarActiveId === 12">
                  <el-select v-model="formData.service" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in serviceList" :key="item.index" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex-div" v-if="sidebarActiveId !== 12">
                <el-form-item label="传输设备网络端口">
                  <el-input v-model="formData.inputDevicePort" type="number" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="所属服务">
                  <el-select v-model="formData.service" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in serviceList" :key="item.index" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="传输设备标签">
                  <el-select v-model="formData.code" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in devLabelList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex-div" v-if="sidebarActiveId !== 12">
                <el-form-item label="传输设备标签编码">
                  <el-input v-model="formData.inputDeviceLabel" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="传输设备生产日期">
                  <el-date-picker
                    v-model="formData.startInputDeviceProduction"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="起始时间"
                    class="w-time"
                  >
                  </el-date-picker>
                  -
                  <el-date-picker
                    v-model="formData.endInputDeviceProduction"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="结束时间"
                    class="w-time"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="传输设备有效期">
                  <!-- <el-input v-model="formData.inputDeviceValidity" class="w-input"></el-input> -->
                  <el-date-picker
                    v-model="formData.startInputDeviceValidity"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="起始时间"
                    class="w-time"
                  >
                  </el-date-picker>
                  -
                  <el-date-picker
                    v-model="formData.endInputDeviceValidity"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="结束时间"
                    class="w-time"
                  ></el-date-picker>
                </el-form-item>
              </div>
              <div class="flex-div" v-if="sidebarActiveId !== 12">
                <el-form-item label="传输设备位置">
                  <el-input v-model="formData.inputDeviceAddress" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="传输设备资产编码">
                  <el-input v-model="formData.inputDeviceAssetsCode" class="w-input"></el-input>
                </el-form-item>
                <el-form-item>
                  <!-- <el-input class="w-input"></el-input> -->
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="录入机构">
                  <el-input v-model="formData.updatedDept" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="录入人">
                  <el-input v-model="formData.updatedBy" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="录入时间">
                  <el-date-picker
                    v-model="formData.startCreateTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="起始时间"
                    class="w-time"
                  >
                  </el-date-picker>
                  -
                  <el-date-picker
                    v-model="formData.endCreateTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="结束时间"
                    class="w-time"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <div class="form-footer">
          <el-button type="primary" size="small" @click="clickSave(1)">查询</el-button>
          <el-button size="small" @click="clickReset">重置</el-button>
          <el-button size="small" @click="exportExcel">导出</el-button>
          <el-button size="small" @click="goBack">返回</el-button>
        </div>
      </div>
      <div class="bottom-box">
        <div style="width:100%;" v-if="isShowDetail === 'list'">
          <div class="box-title">
            <span class="pointer">
              查询结果
            </span>
          </div>
          <div>
            <el-table
              :data="detectorList"
              border
              style="width: 100%;"
              height="420"
              size="mini"
              stripe
              @row-dblclick="showDetail"
              @selection-change="handleSelectionChange"
              v-if="sidebarActiveId !== 12"
            >
              <el-table-column type="selection" align="center"></el-table-column>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column
                v-for="item in detectorTableColumn"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                align="center"
                sortable
                :width="item.width"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row[item.prop] === 2 && item.prop === 'status'">在线</span>
                  <span v-if="scope.row[item.prop] === 1 && item.prop === 'status'">离线</span>
                  <span v-if="scope.row[item.prop] === 3 && item.prop === 'status'">异常</span>
                  <span v-if="item.prop !== 'status'">{{ scope.row[item.prop] }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="detectorList"
              border
              style="width: 100%"
              height="600"
              size="mini"
              stripe
              @row-dblclick="showDetail"
              @selection-change="handleSelectionChange"
              v-if="sidebarActiveId === 12"
            >
              <el-table-column type="selection" align="center"></el-table-column>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column
                v-for="item in detectorTableColumns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                align="center"
                sortable
                :width="item.width"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row[item.prop] === 2 && item.prop === 'status'">在线</span>
                  <span v-if="scope.row[item.prop] === 1 && item.prop === 'status'">离线</span>
                  <span v-if="scope.row[item.prop] === 3 && item.prop === 'status'">异常</span>
                  <span v-if="item.prop !== 'status'">{{ scope.row[item.prop] }}</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="text-align:right;margin:30px 30px 30px 0;">
              <el-pagination
                style="text-align:right;display:inline-block;"
                :page-sizes="[10, 25, 50, 100, 200]"
                :page-size="pageSize"
                :current-page="pageCurrents"
                layout="total, sizes,slot, prev"
                :total="total"
                @size-change="pageSizeChange"
                @current-change="pageSizeCurrent"
              >
                <el-button type="text" :disabled="pageCurrent === 1" @click="pagePrev">首页</el-button>
              </el-pagination>
              <el-pagination
                style="text-align:right;display:inline-block;"
                :page-sizes="[10, 25, 50, 100, 200]"
                :page-size="pageSize"
                :page-count="1"
                :current-page="pageCurrents"
                @size-change="pageSizeChange"
                @current-change="pageSizeCurrent"
                layout="slot"
              >
                <span>{{ pageCurrents }}/{{ pageCounts }}</span>
              </el-pagination>
              <el-pagination
                style="text-align:right;display:inline-block;"
                :page-sizes="[10, 25, 50, 100, 200]"
                :page-size="pageSize"
                :current-page="pageCurrents"
                :total="total"
                @size-change="pageSizeChange"
                @current-change="pageSizeCurrent"
                layout="next,slot, jumper"
                ><el-button type="text" :disabled="pageCurrent === pageCounts" @click="pageNext"
                  >末页</el-button
                ></el-pagination
              >
            </div>
          </div>
        </div>
        <!-- 详情 -->
        <div v-if="isShowDetail === 'detail'" style="flex:1;width: 100%;text-align:center;">
          <div class="detail-footer">
            <el-button type="primary" size="mini" v-print="'print-detail'"
              ><i class="el-icon-printer"></i>打印</el-button
            >
            <el-button size="mini" @click="closeDetail">关闭</el-button>
          </div>
          <div id="print-detail">
            <div style="width: 70%;">
              <div style="margin-bottom:20px;color:#333;font-size:12px">{{ sidebarActive }}主机详情</div>
              <el-form
                :model="activeData"
                label-width="140px"
                style="width:995px;border:1px solid #e1e1e1;border-bottom:none;"
              >
                <div class="detail-item">
                  <span class="item-left">所属机构</span>
                  <span class="item-right">{{ activeData.orgName }}</span>
                  <span class="item-left">所属重点部位</span>
                  <span class="item-right">{{ activeData.orgName }}</span>
                </div>
                <div class="detail-item">
                  <span class="item-left" v-if="sidebarActiveId === 12">设备分类</span>
                  <span class="item-right" v-if="sidebarActiveId === 12">{{ activeData.inputDeviceType }}</span>
                  <span class="item-left">设备名称</span>
                  <span class="item-right">{{ activeData.name }}</span>
                  <span class="item-left" v-if="sidebarActiveId !== 12">设备品牌</span>
                  <span class="item-right" v-if="sidebarActiveId !== 12">{{ activeData.brand }}</span>
                </div>
                <div class="detail-item">
                  <span class="item-left" v-if="sidebarActiveId === 12">设备品牌</span>
                  <span class="item-right" v-if="sidebarActiveId === 12">{{ activeData.brand }}</span>
                  <span class="item-left">设备型号</span>
                  <span class="item-right">{{ activeData.modelNum }}</span>
                  <span class="item-left" v-if="sidebarActiveId !== 12">设备标签</span>
                  <span class="item-right" v-if="sidebarActiveId !== 12">{{ activeData.label }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId === 12">
                  <span class="item-left">通讯类型</span>
                  <span class="item-right">{{ activeData.inputCommunicationType }}</span>
                  <span class="item-left">设备IMEI/ID</span>
                  <span class="item-right">{{ activeData.inputDeviceImei }}</span>
                </div>
                <div class="detail-item">
                  <span class="item-left">标签编码</span>
                  <span class="item-right">{{ activeData.labelCode }}</span>
                  <span class="item-left">设备有效期</span>
                  <span class="item-right">{{ activeData.validity }}</span>
                </div>
                <div class="detail-item">
                  <span class="item-left">设备位置</span>
                  <span class="item-right">{{ activeData.address }}</span>
                  <span class="item-left">资产编码</span>
                  <span class="item-right">{{ activeData.assetCode }}</span>
                </div>
                <div class="detail-item">
                  <span class="item-left">生产日期</span>
                  <span class="item-right">{{ activeData.production }}</span>
                  <span class="item-left" v-if="sidebarActiveId !== 12">传输设备分类</span>
                  <span class="item-right" v-if="sidebarActiveId !== 12">{{ activeData.inputDeviceType }}</span>
                  <span class="item-left" v-if="sidebarActiveId === 12">所属服务</span>
                  <span class="item-right" v-if="sidebarActiveId === 12">{{ activeData.service }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId === 12">
                  <span class="item-left">设备标签</span>
                  <span class="item-right">{{ activeData.label }}</span>
                  <span class="item-left"></span>
                  <span class="item-right"></span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备名称</span>
                  <span class="item-right">{{ activeData.inputDeviceName }}</span>
                  <span class="item-left">传输设备品牌</span>
                  <span class="item-right">{{ activeData.inputDeviceBrand }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备型号</span>
                  <span class="item-right">{{ activeData.inputDeviceModel }}</span>
                  <span class="item-left">传输设备通讯类型</span>
                  <span class="item-right">{{ activeData.inputCommunicationType }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备IMEI/ID</span>
                  <span class="item-right">{{ activeData.inputDeviceImei }}</span>
                  <span class="item-left">传输设备IP地址</span>
                  <span class="item-right">{{ activeData.inputDeviceIp }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备网络端口</span>
                  <span class="item-right">{{ activeData.inputDevicePort }}</span>
                  <span class="item-left">所属服务</span>
                  <span class="item-right">{{ activeData.service }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备标签</span>
                  <span class="item-right">{{ activeData.inputDeviceLabel }}</span>
                  <span class="item-left">传输设备标签编码</span>
                  <span class="item-right">{{ activeData.inputDeviceCode }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备生产日期</span>
                  <span class="item-right">{{ activeData.inputDeviceProduction }}</span>
                  <span class="item-left">传输设备有效期</span>
                  <span class="item-right">{{ activeData.inputDeviceValidity }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备位置</span>
                  <span class="item-right">{{ activeData.inputDeviceAddress }}</span>
                  <span class="item-left">传输设备资产编码</span>
                  <span class="item-right">{{ activeData.inputDeviceAssetsCode }}</span>
                </div>
              </el-form>
              <div class="detail-bottom">
                <el-form label-width="100px" style="width:100%">
                  <div class="detail-item">
                    <span class="item-left" style="width:142px;">录入时间</span>
                    <span class="item-right" style="width:190px;">录入时间</span>
                    <span class="item-left" style="width:142px;">录入机构</span>
                    <span class="item-right" style="width:190px;">录入机构</span>
                    <span class="item-left" style="width:142px;">录入人</span>
                    <span class="item-right" style="width:190px;">录入人</span>
                  </div>
                </el-form>
              </div>
            </div>
            <!-- 系统部件 -->
            <div class="list-box" v-if="isShowDetail === 'detail' && isShowId">
              <relevance-list
                :showVideo="isShowDetail === 'detail'"
                :videoTableData="videoTableData"
                :formFire="formFire"
                :title="title"
              ></relevance-list>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import { handleExport } from '@src/common/excel'
import { download } from '@src/common/download.js'
import { fireInterface, selectQuety } from '@src/http/intelligentFire/equipmentManagement.js'
import systemManagement from '@src/assets/rules/validation/fire/systemManagement.js'
import RelevanceList from './relevanceList'
export default {
  name: 'fireFightingSubsystemManagement',
  components: {
    RelevanceList
  },
  data() {
    return {
      isShowDetail: 'list',
      formFire: {}, // 部件详情数据
      videoTableData: [], // 详情页系统部件数据
      title: '详情', // 部件页面类型
      activeData: null,
      isShowId: false,
      treeType: 3, // 树
      customizeQuery: {
        // 树
        params: {
          subSystem: '1',
          isRecursion: '0'
        }
      },
      total: 1, // 数据总条数
      pageSize: 25, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      formData: {
        // 表单数据
        type: '', // 主机类型
        orgId: '', // 所属机构ID
        orgName: '', // 所属机构name
        keyPartId: '', // 所属重点部位Id
        keyPartType: '', // 所属重点部位类型
        keyPartName: '', // 所属重点部位name
        name: '', // 设备名称
        brand: '', // 设备品牌
        modelNum: '', // 设备型号
        label: '', // 设备标签
        labelCode: '', // 标签编码
        code: '', // 设备编码
        startValidity: '', // 开始-设备有效期
        endValidity: '', // 结束-设备有效期
        address: '', // 设备位置
        assetCode: '', // 资产编码
        production: '', // 开始-生产日期
        endProduction: '', // 结束-生产日期
        inputDeviceType: '', // 传输设备分类
        inputDeviceName: '', // 传输设备名称
        inputDeviceBrand: '', // 传输设备品牌
        inputDeviceModel: '', // 传输设备型号
        inputCommunicationType: '', // 传输通讯类型
        inputDeviceImei: '', // 传输设备IMEI/ID
        inputDeviceIp: '', // 传输设备IP地址
        inputDevicePort: '', // 传输设备网络端口
        service: '', // 所属服务
        inputDeviceLabel: '', // 传输设备设备标签
        inputDeviceCode: '', // 传输设备编码
        startInputDeviceProduction: '', // 开始-传输设备生产日期，如2020-01-01
        endInputDeviceProduction: '', // 结束-传输设备生产日期，如2020-01-01
        startInputDeviceValidity: '', // 开始-传输设备有效期 如2020-01-01
        endInputDeviceValidity: '', // 结束-传输设备有效期 如2020-01-01
        // inputDeviceValidity: '', // 传输设备有效期
        inputDeviceAddress: '', // 传输设备位置
        inputDeviceAssetsCode: '', // 传输设备资产编码
        startCreateTime: '', // 开始-录入时间
        endCreateTime: '', // 结束-录入时间
        updatedBy: '', // 录入人
        updatedDept: '' // 录入机构
      },
      devBrandList: [], // 设备品牌下拉
      devModelList: [], // 设备型号下拉选项
      devLabelList: [], // 设备标签下拉
      transDevClassList: [], // 传输设备分类
      transDevBrandList: [], // 传输设备品牌
      transDevModelList: [], // 传输设备类型
      serviceList: [], // 所属服务下拉
      positionList: [], // 重点部位下拉
      dropdownStatus: {
        detector: true
      },
      detectorTableColumn: [
        // 表格标题行内容
        {
          prop: 'orgName',
          label: '所属机构',
          width: '180'
        },
        {
          prop: 'keyPartName',
          label: '所属部位',
          width: '180'
        },
        {
          prop: 'name',
          label: '设备名称',
          width: '180'
        },
        {
          prop: 'brand',
          label: '设备品牌',
          width: '180'
        },
        {
          prop: 'modelNum',
          label: '设备型号',
          width: '180'
        },
        {
          prop: 'label',
          label: '设备标签',
          width: '100'
        },
        {
          prop: 'labelCode',
          label: '标签编码',
          width: '150'
        },
        {
          prop: 'validity',
          label: '设备有效期',
          width: '120'
        },
        {
          prop: 'address',
          label: '设备位置',
          width: '130'
        },
        {
          prop: 'assetCode',
          label: '资产编码',
          width: '150'
        },
        {
          prop: 'production',
          label: '生产日期',
          width: '100'
        },
        {
          prop: 'status',
          label: '状态',
          width: '100'
        },
        {
          prop: 'inputDeviceType',
          label: '传输设备分类',
          width: '150'
        },
        {
          prop: 'inputDeviceName',
          label: '传输设备名称',
          width: '180'
        },
        {
          prop: 'inputDeviceBrand',
          label: '传输设备品牌',
          width: '180'
        },
        {
          prop: 'inputDeviceModel',
          label: '传输设备型号',
          width: '180'
        },
        {
          prop: 'inputCommunicationType',
          label: '传输通讯类型',
          width: '150'
        },
        {
          prop: 'inputDeviceImei',
          label: '传输设备IMEI',
          width: '150'
        },
        {
          prop: 'inputDeviceIp',
          label: '传输设备IP地址',
          width: '150'
        },
        {
          prop: 'inputDevicePort',
          label: '传输设备网络端口',
          width: '150'
        },
        {
          prop: 'service',
          label: '所属服务',
          width: '180'
        },
        {
          prop: 'inputDeviceLabel',
          label: '传输设备设备标签',
          width: '150'
        },
        {
          prop: 'inputDeviceCode',
          label: '传输设备标签编码',
          width: '150'
        },
        {
          prop: 'inputDeviceProduction',
          label: '传输设备生产日期',
          width: '150'
        },
        {
          prop: 'inputDeviceValidity',
          label: '传输设备有效期',
          width: '150'
        },
        {
          prop: 'inputDeviceAddress',
          label: '传输设备位置',
          width: '150'
        },
        {
          prop: 'inputDeviceAssetsCode',
          label: '传输设备资产编码',
          width: '150'
        },
        {
          prop: 'updatedBy',
          label: '录入人',
          width: '100'
        },
        {
          prop: 'updatedDept',
          label: '录入机构',
          width: '180'
        },
        {
          prop: 'createdAt',
          label: '录入时间',
          width: '180'
        }
      ],
      detectorTableColumns: [
        // 表格标题行内容
        {
          prop: 'orgName',
          label: '所属机构',
          width: '180'
        },
        {
          prop: 'keyPartName',
          label: '所属部位',
          width: '180'
        },
        {
          prop: 'name',
          label: '设备名称',
          width: '180'
        },
        {
          prop: 'brand',
          label: '设备品牌',
          width: '180'
        },
        {
          prop: 'modelNum',
          label: '设备型号',
          width: '180'
        },
        {
          prop: 'label',
          label: '设备标签',
          width: '100'
        },
        {
          prop: 'labelCode',
          label: '标签编码',
          width: '150'
        },
        {
          prop: 'validity',
          label: '设备有效期',
          width: '120'
        },
        {
          prop: 'address',
          label: '设备位置',
          width: '120'
        },
        {
          prop: 'assetCode',
          label: '资产编码',
          width: '150'
        },
        {
          prop: 'production',
          label: '生产日期',
          width: '100'
        },
        {
          prop: 'inputDeviceType',
          label: '设备分类',
          width: '130'
        },
        // {
        //   prop: 'status',
        //   label: '状态',
        //   width: '100'
        // },
        {
          prop: 'inputCommunicationType',
          label: '通讯类型',
          width: '100'
        },
        {
          prop: 'inputDeviceImei',
          label: '设备ID',
          width: '130'
        },
        {
          prop: 'service',
          label: '所属服务',
          width: '180'
        },
        {
          prop: 'updatedBy',
          label: '录入人',
          width: '100'
        },
        {
          prop: 'updatedDept',
          label: '录入机构',
          width: '180'
        },
        {
          prop: 'createdAt',
          label: '录入时间',
          width: '180'
        }
      ],
      detectorList: [
        // 列表数据
      ],
      fireSelection: '', // 选中数据
      defaultParams: {
        pageSize: 25, // 一页多少条数据
        page: 1, // 第几页
        isChildren: 2, // 默认不显示子机构
        type: [1] // 主机类型(页面类型--sidebarActiveId)
      },
      rules: systemManagement.assessmentRankingRules
    }
  },
  created() {
    this.defaultParams.type = [this.sidebarActiveId] // 主机类型
    this.pageCount = Math.ceil(this.total / this.pageSize)
    this.SET_DATA_DIC_CHILD(this.dataDic[this.sidebarActiveField])

    // 设备品牌下拉
    if (this.sidebarActiveId !== 12) {
      this.getSelectData(this.dataDicChild.brand).then(res => {
        this.devBrandList = res.data.data[0].attr
      })
    }

    // 设备标签下拉
    this.getSelectData(this.dataDicChild.label).then(res => {
      this.devLabelList = res.data.data[0].attr
    })

    // 所属服务下拉
    this.getServiceData()

    // 传输设备分类
    let params = {
      dictId: this.dataDicChild.transDev.id // 字典参数
    }
    this.getDataDic(params, '3').then(res => {
      this.transDevClassList = res.data.data[0].attr
    })
  },
  computed: {
    ...mapState('equipmentManagement', {
      sidebarActive: 'sidebarActive',
      sidebarActiveId: 'sidebarActiveId',
      dataDic: 'dataDic',
      dataDicChild: 'dataDicChild',
      sidebarActiveField: 'sidebarActiveField'
    }),
    pageCounts: function() {
      return Math.ceil(this.total / this.pageSize)
    },
    pageCurrents: function() {
      return this.pageCurrent
    }
  },
  watch: {
    // 页面数据条数
    pageSize: function() {
      this.defaultParams.pageSize = this.pageSize
      this.clickSave()
    },
    // 监听分页
    pageCurrent: function() {
      this.defaultParams.page = this.pageCurrents
      this.clickSave()
    }
  },
  methods: {
    ...mapMutations('equipmentManagement', {
      SET_COMPONENT_ID: 'SET_COMPONENT_ID',
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE',
      SET_DATA_DIC_CHILD: 'SET_DATA_DIC_CHILD'
    }),
    ...mapActions(['addAlarmHost']),
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
    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.formData.orgId : undefined
      }
      getSearchOrgApi(params)
        .then(res => {
          if (!res.data.data.code) {
            callback(res.data.data.orgList || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch(err => {
          // console.log(err)
          callback([])
        })
    },
    // 选中 机构/重点部位 下拉选
    selectItem(type, val) {
      if (type === 'org') {
        this.formData.orgId = val.id
        this.orgName = val.name
      } else if (type === 'kp') {
        this.formData.keyPartId = val.id
        this.keyPartName = val.name
      }
    },
    // 下拉请求
    getSelectData(val) {
      if (val) {
        let params = {
          dictId: val // 字典参数
        }
        return this.getDataDic(params)
      }
    },
    // 数据字典请求
    getDataDic(params, id) {
      return selectQuety.queryDataDictBasicInfo(params, id)
    },
    // 设备品牌选择
    changeBrand(val) {
      this.formData.modelNum = '' // 清空设备型号
      this.devModelList = [] // 清空设备型号数据(NB系统除外)
      if (val) {
        let params = {
          dictId: this.dataDicChild.modelNumber,
          homeClass: val
        }
        this.getDataDic(params).then(res => {
          this.devModelList = res.data.data[0].attr
        })
      }
    },
    // 传输设备分类
    changeTransClass(val) {
      this.formData.inputDeviceBrand = '' // 清空传输设备品牌
      this.transDevBrandList = [] // 清空传输设备品牌数据
      this.formData.modelNum = '' // 清空设备型号(NB系统)
      this.formData.inputDeviceModel = '' // 清空传输设备型号
      this.inputDeviceModel = [] // 清空传输设备型号数据
      if (val) {
        let params = {
          dictId: this.dataDicChild.transDev[`${val}`].id
        }
        this.getDataDic(params, '3').then(res => {
          this.transDevBrandList = res.data.data[0].attr
        })
      }
    },
    // 传输设备品牌
    changeTransBrand(val) {
      let params = {
        dictId: this.dataDicChild.transDev[`${this.formData.inputDeviceType}`].modelNumber,
        homeClass: val
      }
      this.formData.modelNum = '' // 清空设备型号(NB系统)
      this.formData.inputDeviceModel = '' // 清空传输设备型号
      this.inputDeviceModel = [] // 清空传输设备型号数据
      this.getDataDic(params, '3').then(res => {
        this.transDevModelList = res.data.data[0].attr
      })
    },
    // 所属服务下拉
    getServiceData() {
      selectQuety.serviceList().then(res => {
        this.serviceList = res.data.data
      })
    },
    // 选中数据
    handleSelectionChange(val) {
      this.fireSelection = val
    },
    // 双击详情
    showDetail(row) {
      this.formFire = {}
      this.activeData = row
      this.formFire.hostId = row.id
      // 根据页面类型判断是否显示系统部件
      let id = [7, 8, 9, 10, 12]
      this.isShowId = !id.includes(this.sidebarActiveId)
      this.isShowDetail = 'detail'
    },
    // 关闭详情页
    closeDetail() {
      this.isShowDetail = 'list'
      this.clickSave()
    },
    // 查询
    clickSave(val) {
      if (val) {
        this.defaultParams.page = 1
      }
      let params = this.$lodash.cloneDeep(this.defaultParams)
      for (var key in this.formData) {
        if (this.formData[key]) {
          params[key] = this.formData[key]
        }
      }
      if (params.updatedDept) {
        params.updatedDept = [`${params.updatedDept}`]
      }

      fireInterface.comBustibleQueryHost(params).then(res => {
        if (res.data.code === 0) {
          if (val) {
            this.$notify.success({
              message: '查询成功',
              title: '成功'
            })
          }

          this.detectorList = res.data.data.alarmHostInfo
          this.total = res.data.data.page.totalNumber || 1
          this.pageSize = res.data.data.page.pageSize
          this.pageCurrent = res.data.data.page.page
        } else {
          this.$notify.error({
            message: '查询失败',
            title: '失败'
          })
        }
      })
      // .catch(_ => {
      //   this.$notify.error({
      //     title: '失败',
      //     message: '查询失败'
      //   })
      // })
    },
    // 重置
    clickReset() {
      for (var key in this.formData) {
        // if (key !== 'type') {
        this.formData[key] = ''
        // }
      }
      this.defaultParams = {
        pageSize: this.pageSize, // 一页多少条数据
        page: this.pageCurrent, // 第几页
        isChildren: 2, // 默认不显示子机构
        type: [this.sidebarActiveId] // 主机类型(页面类型--sidebarActiveId)
      }
      this.$refs.addForm.clearValidate()
    },
    // 导出excel
    exportExcel() {
      // 有数据走前端导出
      let tHeader = ['序号']
      let filterVal = ['index']
      let fireSelection = this.$lodash.cloneDeep(this.fireSelection)
      fireSelection.map((item, index) => {
        item.index = index + 1
        switch (item.status) {
          case 1:
            item.status = '离线'
            break
          case 2:
            item.status = '在线'
            break
          case 3:
            item.status = '异常'
            break
        }
      })
      if (this.sidebarActiveId !== 12) {
        this.detectorTableColumn.map(n => {
          tHeader.push(n.label)
          filterVal.push(n.prop)
        })
      } else {
        this.detectorTableColumns.map(n => {
          tHeader.push(n.label)
          filterVal.push(n.prop)
        })
      }

      let filename = this.sidebarActive
      if (this.fireSelection.length) {
        handleExport(
          tHeader,
          filterVal,
          `${filename}${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`,
          fireSelection
        )
      } else if (this.detectorList.length > 0 && this.fireSelection.length === 0) {
        // handleExport(tHeader, filterVal, filename, this.detectorList)
        fireInterface.createHostExcel(this.defaultParams).then(res => {
          if (res.data.code === 0) {
            // zp去掉url中间的/host
            let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/fire/v1/system-manage/downFile?fileName=${res.data.data.fileName}`
            let name = `${filename}${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
            download(
              url,
              name,
              () => {},
              () => {
                this.$message({ type: 'info', message: '导出文件下载失败！' })
              },
              () => {},
              'get'
            )
          }
        })
        // 无数据走接口
      } else {
        this.$notify.warning({
          message: '列表暂无数据',
          title: '警告'
        })
      }
    },
    // 返回
    goBack() {
      this.SET_IS_NEW_FILE('FireAlarm')
    },
    // 改变pageSize
    pageSizeChange(val) {
      this.pageSize = val
    },
    // 改变当前页
    pageSizeCurrent(val) {
      this.pageCurrent = val
    },
    // 上一页
    pagePrev() {
      this.pageCurrent = 1
    },
    // 下一页
    pageNext() {
      this.pageCurrent = this.pageCounts
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  .right-content {
    width: 100%;
    font-size: 14px;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    .form-box {
      .form-content {
        display: flex;
        /* width: 644px; */
        padding: 10px;
        font-size: 12px;
        background: #f5f5f5;
        border: 1px solid #f2f2f2;
        .left-form {
          width: 100%;
          padding-top: 14px;
        }
        // .right-form {
        //   /* width: 300px; */
        // }
      }
      .form-footer {
        margin-top: 12px;
        width: 100%;
        text-align: center;
      }
    }
    .bottom-box {
      width: 100%;
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
}
// .el-input,
// .el-input--suffix .el-input__inner {
//   // padding-right: 15px !important;
// }
</style>
<style lang="less" scoped>
.content {
  /deep/.right-content {
    .form-box {
      .left-form,
      .right-form {
        .el-form-item--mini.el-form-item {
          margin-bottom: 0;
        }
        .el-form-item__label {
          text-align: center;
        }
      }
    }
    /deep/.detail-box,
    /deep/.detail-bottom {
      color: #666;
      width: 995px;
      border: 1px solid #f2f2f2;
      display: flex;
      flex-wrap: wrap;
      margin: 30px 0;
    }
    /deep/.detail-footer {
      text-align: left;
      padding-left: 20px;
      margin-top: 24px;
    }
    /deep/.box-title {
      text-align: left;
    }
  }

  .el-button--text {
    color: #606266;
    &:hover {
      color: #66b1ff;
    }
  }
  .flex-div {
    display: flex;
    flex-direction: row;
    justify-content: left;
    width: 100%;
    margin-bottom: 14px;
    .el-form-item--mini,
    .el-form-item {
      width: 33%;
      display: flex;
      justify-content: center;
      /deep/.el-form-item__label {
        background: #f5f5f5 !important;
        height: 35px !important;
        line-height: 35px !important;
      }
      /deep/.el-form-item__content {
        flex: 1;
        max-width: 356px;
      }
    }
    .w-input {
      width: 100%;
      max-width: 356px;
      height: 35px;
    }
    .w-time {
      width: 48%;
      max-width: 172px;
      height: 35px;
    }
  }
  .detail-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    // height: 40px;
    // line-height: 40px;
    .el-form-item {
      margin: 0;
    }
    .item-left {
      display: inline-block;
      width: 140px;
      height: 35px;
      padding: 0 10px;
      line-height: 35px;
      color: #606266;
      text-align: right;
      border: 1px solid #e1e1e1;
      // border-bottom: 1px solid #e1e1e1;
      background-color: #f5f5f5;
    }

    .item-right {
      display: inline-block;
      width: 356px;
      height: 35px;
      padding: 0 10px;
      line-height: 35px;
      color: #606266;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: #fff;
      border: 1px solid #e1e1e1;
      // border-bottom: 1px solid #e1e1e1;
    }
  }
  .cla-input {
    .el-input__inner {
      padding-right: 30px;
    }
  }
}
.form-box {
  margin-top: 20px;
}
.detail-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  // height: 40px;
  // line-height: 40px;
  .el-form-item {
    margin: 0;
  }
  .item-left {
    display: inline-block;
    width: 140px;
    height: 35px;
    padding: 0 10px;
    line-height: 35px;
    color: #606266;
    text-align: right;
    border: 1px solid #e1e1e1;
    // border-bottom: 1px solid #e1e1e1;
    background-color: #f5f5f5;
  }

  .item-right {
    display: inline-block;
    width: 356px;
    height: 35px;
    padding: 0 10px;
    line-height: 35px;
    color: #606266;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: #fff;
    border: 1px solid #e1e1e1;
    // border-bottom: 1px solid #e1e1e1;
  }
}
/deep/.detail-bottom {
  color: #666;
  width: 995px;
  border: 1px solid #f2f2f2;
  display: flex;
  flex-wrap: wrap;
  margin: 30px 0;
}
</style>
