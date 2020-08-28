<template>
  <div class="content">
    <div class="left-tree">
      <div class="tree-title">
        <span>机构</span>
        <i class="refresh icon iconfont-ccb ccbicon" @click="refresh" title="刷新"></i>
      </div>
      <!-- 中间树 -->
      <div class="tree-content">
        <treeBox
          ref="tree"
          :lazyTreeApi="getTreeApi"
          searchType="filter"
          :treeType="treeType"
          @onceClick="onceClick"
          treeLazyToggle
          iconToggle
          :customizeQuery="customizeQuery"
        ></treeBox>
      </div>
    </div>
    <div class="right-content">
      <div class="top-box" v-if="!moveShow && isShowDetail !== 'transfer'">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>消防系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ sidebarActive }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div v-if="!moveShow && isShowDetail !== 'transfer'">
        <!-- v-if="isShowFormDetail" -->
        <div class="button-box" style="margin-top:20px;" v-if="isShowFormDetail">
          <el-button size="mini" @click="skipTo('fireFightingSubsystemManagement')"
            ><i class="el-icon-plus"></i>新建</el-button
          >
          <el-button size="mini" @click="clickEdit"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button size="mini" @click="delList"> <i class="el-icon-delete"></i>删除</el-button>
          <el-button size="mini" @click="clickMrgrate"><i class="el-icon-position"></i>迁移</el-button>
          <el-button size="mini" @click="clickTransfer"><i class="el-icon-sort"></i>排序</el-button>
          <el-button size="mini" @click="clickCopy"><i class="el-icon-document-copy"></i>复制</el-button>
          <el-button size="mini" v-print="'prit-div'"><i class="el-icon-printer"></i>打印</el-button>
        </div>

        <div class="form-box" v-if="!isShowFormDetail">
          <!-- <div class="box-title">{{ title }}{{ sidebarActive }}</div> -->
          <div class="form-content">
            <div class="left-form">
              <el-form
                size="mini"
                :rules="rules"
                ref="formData"
                :model="formData"
                label-position="right"
                label-width="120px"
              >
                <div class="flex-div">
                  <el-form-item label="所属机构" prop="orgName">
                    <el-input disabled v-model="formData.orgName" class="w-input"></el-input>
                  </el-form-item>
                  <el-form-item label="所属重点部位" prop="keyPartName">
                    <el-input disabled v-model="formData.keyPartName" class="w-input"> </el-input>
                  </el-form-item>
                </div>
                <div class="flex-div">
                  <el-form-item label="设备分类" prop="inputDeviceType" v-if="sidebarActiveId === 12">
                    <el-select class="w-input" v-model="formData.inputDeviceType" @change="changeTransClass">
                      <el-option
                        v-for="(item, index) in transDevClassList"
                        :key="index"
                        :label="item.data"
                        :value="item.data"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="设备名称" prop="name">
                    <el-input v-model="formData.name" class="w-input"></el-input>
                  </el-form-item>
                  <el-form-item label="设备品牌" v-if="sidebarActiveId !== 12">
                    <el-select
                      class="w-input"
                      v-model="formData.brand"
                      @change="changeBrand"
                      v-if="sidebarActiveId !== 12"
                    >
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
                      <el-option
                        v-for="(item, index) in transDevBrandList"
                        :key="index"
                        :label="item.data"
                        :value="item.data"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="flex-div">
                  <el-form-item label="设备品牌" v-if="sidebarActiveId === 12">
                    <el-select
                      class="w-input"
                      v-model="formData.brand"
                      @change="changeBrand"
                      v-if="sidebarActiveId !== 12"
                    >
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
                      <el-option
                        v-for="(item, index) in transDevBrandList"
                        :key="index"
                        :label="item.data"
                        :value="item.data"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="设备型号">
                    <el-select class="w-input" v-model="formData.modelNum" v-if="sidebarActiveId !== 12">
                      <el-option
                        v-for="(item, index) in devModelList"
                        :key="index"
                        :label="item.data"
                        :value="item.data"
                      ></el-option>
                    </el-select>
                    <el-select class="w-input" v-model="formData.modelNum" v-if="sidebarActiveId === 12">
                      <el-option
                        v-for="(item, index) in transDevModelList"
                        :key="index"
                        :label="item.data"
                        :value="item.data"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="设备标签" prop="label" v-if="sidebarActiveId !== 12">
                    <el-select class="w-input" v-model="formData.label">
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
                  <el-form-item label="标签编码" prop="labelCode">
                    <el-input class="w-input" v-model="formData.labelCode"> </el-input>
                  </el-form-item>
                  <el-form-item label="设备有效期" prop="validity">
                    <!-- <el-input v-model="formData.validity" class="w-input"></el-input> -->
                    <el-date-picker
                      v-model="formData.validity"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      class="w-input"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div class="flex-div">
                  <el-form-item label="设备位置" prop="address">
                    <el-input v-model="formData.address" class="w-input"></el-input>
                  </el-form-item>
                  <el-form-item label="资产编码" prop="assetCode">
                    <el-input v-model="formData.assetCode" class="w-input"></el-input>
                  </el-form-item>
                </div>
                <div class="flex-div">
                  <el-form-item label="生产日期" prop="production">
                    <el-date-picker
                      v-model="formData.production"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      class="w-input"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="设备标签" prop="label" v-if="sidebarActiveId === 12">
                    <el-select class="w-input" v-model="formData.label">
                      <el-option
                        v-for="(item, index) in devLabelList"
                        :key="index"
                        :label="item.data"
                        :value="item.data"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="传输设备分类" prop="inputDeviceType" v-if="sidebarActiveId !== 12">
                    <el-select class="w-input" v-model="formData.inputDeviceType" @change="changeTransClass">
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
                  <el-form-item label="传输设备名称" prop="inputDeviceName">
                    <el-input v-model="formData.inputDeviceName" class="w-input"></el-input>
                  </el-form-item>
                  <el-form-item label="传输设备品牌" prop="inputDeviceBrand">
                    <el-select class="w-input" v-model="formData.inputDeviceBrand" @change="changeTransBrand">
                      <el-option
                        v-for="(item, index) in transDevBrandList"
                        :key="index"
                        :label="item.data"
                        :value="item.data"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="flex-div">
                  <el-form-item label="传输设备型号" prop="inputDeviceModel" v-if="sidebarActiveId !== 12">
                    <el-select class="w-input" v-model="formData.inputDeviceModel">
                      <el-option
                        v-for="(item, index) in transDevModelList"
                        :key="index"
                        :label="item.data"
                        :value="item.data"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="通讯类型" prop="inputCommunicationType" v-if="sidebarActiveId === 12">
                    <el-select class="w-input" v-model="formData.inputCommunicationType">
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
                  <el-form-item label="传输通讯类型" prop="inputCommunicationType" v-if="sidebarActiveId !== 12">
                    <el-select class="w-input" v-model="formData.inputCommunicationType">
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
                  <el-form-item label="所属服务" v-if="sidebarActiveId === 12">
                    <el-select class="w-input" v-model="formData.service">
                      <el-option v-for="item in serviceList" :key="item.index" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="flex-div">
                  <el-form-item label="设备IMEI/ID" prop="inputDeviceImei" v-if="sidebarActiveId === 12">
                    <el-input v-model="formData.inputDeviceImei" class="w-input"></el-input>
                  </el-form-item>
                  <el-form-item label="传输设备IMEI/ID" prop="inputDeviceImei" v-if="sidebarActiveId !== 12">
                    <el-input v-model="formData.inputDeviceImei" class="w-input"></el-input>
                  </el-form-item>
                  <el-form-item label="传输设备IP地址" prop="inputDeviceIp" v-if="sidebarActiveId !== 12">
                    <el-input v-model="formData.inputDeviceIp" class="w-input"></el-input>
                  </el-form-item>
                </div>
                <div class="flex-div" v-if="sidebarActiveId !== 12">
                  <el-form-item label="传输设备网络端口" prop="inputDevicePort">
                    <el-input v-model="formData.inputDevicePort" class="w-input"></el-input>
                  </el-form-item>
                  <el-form-item label="所属服务">
                    <el-select class="w-input" v-model="formData.service">
                      <el-option v-for="item in serviceList" :key="item.index" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="flex-div" v-if="sidebarActiveId !== 12">
                  <el-form-item label="传输设备设备标签">
                    <el-select class="w-input" v-model="formData.inputDeviceLabel">
                      <el-option
                        v-for="(item, index) in devLabelList"
                        :key="index"
                        :label="item.data"
                        :value="item.data"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="传输设备资产编码" prop="inputDeviceAssetsCode">
                    <el-input v-model="formData.inputDeviceAssetsCode" class="w-input"></el-input>
                  </el-form-item>
                </div>
                <div class="flex-div" v-if="sidebarActiveId !== 12">
                  <el-form-item label="传输设备生产日期">
                    <el-date-picker
                      v-model="formData.inputDeviceProduction"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      class="w-input"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="传输设备有效期" prop="inputDeviceValidity">
                    <!-- <el-input v-model="formData.inputDeviceValidity" class="w-input"></el-input> -->
                    <el-date-picker
                      v-model="formData.inputDeviceValidity"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      class="w-input"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div class="flex-div" v-if="sidebarActiveId !== 12">
                  <el-form-item label="传输设备位置" prop="inputDeviceAddress">
                    <el-input v-model="formData.inputDeviceAddress" class="w-input"></el-input>
                  </el-form-item>
                  <el-form-item label="传输设备标签编码" prop="inputDeviceCode">
                    <el-input v-model="formData.inputDeviceCode" class="w-input"></el-input>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <!-- <div class="right-form">
            <el-form size="mini" :model="formData" label-position="right" label-width="150px"> </el-form>
          </div> -->
          </div>
          <div class="tb-div">
            <table class="tb">
              <tr class="tb-tr" v-if="title === '新建'">
                <td class="tb-label">录入时间</td>
                <td class="tb-input"></td>
                <td class="tb-label">录入机构</td>
                <td class="tb-input"></td>
                <td class="tb-label">录入人</td>
                <td class="tb-input"></td>
              </tr>
              <tr class="tb-tr" v-if="title === '编辑'">
                <td class="tb-label">录入时间</td>
                <td class="tb-input">{{ formData.createdAt }}</td>
                <td class="tb-label">录入机构</td>
                <td class="tb-input">{{ formData.updatedDept }}</td>
                <td class="tb-label">录入人</td>
                <td class="tb-input">{{ formData.updatedBy }}</td>
              </tr>
            </table>
          </div>

          <div class="form-footer">
            <el-button type="primary" size="small" @click="saveAlarmHost('formData')">保存</el-button>
            <el-button size="small" @click="clickCancel">取消</el-button>
            <el-button size="small" @click="clickReset">重置</el-button>
          </div>
        </div>
        <div id="prit-div">
          <!--新建保存之后   -->
          <div class="form-detail" v-if="isShowFormDetail">
            <div class="form-content">
              <div class="left-form">
                <table size="mini" :model="formData" style="border:1px solid #e1e1e1;width:100%">
                  <tr class="detail-item" style="border-bottome:1px solid #e1e1e1">
                    <td class="detail-label">所属机构</td>
                    <td class="detail-span">{{ formData.orgName }}</td>
                    <td class="detail-label">所属重点部门</td>
                    <td class="detail-span">{{ formData.keyPartName }}</td>
                  </tr>

                  <tr class="detail-item" v-if="sidebarActiveId === 12">
                    <td class="detail-label">设备分类</td>
                    <td class="detail-span">{{ formData.inputDeviceType }}</td>
                    <td class="detail-label">设备名称</td>
                    <td class="detail-span">{{ formData.name }}</td>
                  </tr>
                  <tr class="detail-item" v-if="sidebarActiveId !== 12">
                    <td class="detail-label">设备名称</td>
                    <td class="detail-span">{{ formData.name }}</td>
                    <td class="detail-label">设备品牌</td>
                    <td class="detail-span">{{ formData.brand }}</td>
                  </tr>

                  <tr class="detail-item" v-if="sidebarActiveId === 12">
                    <td class="detail-label">设备品牌</td>
                    <td class="detail-span">{{ formData.brand }}</td>
                    <td class="detail-label">设备型号</td>
                    <td class="detail-span">{{ formData.modelNum }}</td>
                  </tr>
                  <tr class="detail-item" v-if="sidebarActiveId !== 12">
                    <td class="detail-label">设备型号</td>
                    <td class="detail-span">{{ formData.modelNum }}</td>
                    <td class="detail-label">设备标签</td>
                    <td class="detail-span">{{ formData.label }}</td>
                  </tr>

                  <tr class="detail-item" v-if="sidebarActiveId === 12">
                    <td class="detail-label">设备标签</td>
                    <td class="detail-span">{{ formData.label }}</td>
                    <td class="detail-label">标签编码</td>
                    <td class="detail-span">{{ formData.labelCode }}</td>
                  </tr>
                  <tr class="detail-item" v-if="sidebarActiveId !== 12">
                    <td class="detail-label">标签编码</td>
                    <td class="detail-span">{{ formData.labelCode }}</td>
                    <td class="detail-label">设备有效期</td>
                    <td class="detail-span">{{ formData.validity }}</td>
                  </tr>

                  <tr class="detail-item" v-if="sidebarActiveId === 12">
                    <td class="detail-label">设备有效期</td>
                    <td class="detail-span">{{ formData.validity }}</td>
                    <td class="detail-label">设备位置</td>
                    <td class="detail-span">{{ formData.address }}</td>
                  </tr>
                  <tr class="detail-item" v-if="sidebarActiveId !== 12">
                    <td class="detail-label">设备位置</td>
                    <td class="detail-span">{{ formData.address }}</td>
                    <td class="detail-label">资产编码</td>
                    <td class="detail-span">{{ formData.assetCode }}</td>
                  </tr>
                  <tr class="detail-item" v-if="sidebarActiveId === 12">
                    <td class="detail-label">资产编码</td>
                    <td class="detail-span">{{ formData.assetCode }}</td>
                    <td class="detail-label">生产日期</td>
                    <td class="detail-span">{{ formData.production }}</td>
                  </tr>
                  <tr class="detail-item" v-if="sidebarActiveId !== 12">
                    <td class="detail-label">生产日期</td>
                    <td class="detail-span">{{ formData.production }}</td>
                    <td class="detail-label">传输设备分类</td>
                    <td class="detail-span">{{ formData.inputDeviceType }}</td>
                  </tr>

                  <tr class="detail-item" v-if="sidebarActiveId === 12">
                    <td class="detail-label">通讯类型</td>
                    <td class="detail-span">{{ formData.inputCommunicationType }}</td>
                    <td class="detail-label">所属服务</td>
                    <td class="detail-span">{{ formData.service }}</td>
                  </tr>
                  <tr class="detail-item" v-if="sidebarActiveId === 12">
                    <td class="detail-label">设备IMEI/ID</td>
                    <td class="detail-span">{{ formData.inputDeviceImei }}</td>
                    <td class="detail-label"></td>
                    <td class="detail-span"></td>
                  </tr>

                  <tr class="detail-item" v-if="sidebarActiveId !== 12">
                    <td class="detail-label">传输设备名称</td>
                    <td class="detail-span">{{ formData.inputDeviceName }}</td>
                    <td class="detail-label">传输设备品牌</td>
                    <td class="detail-span">{{ formData.inputDeviceBrand }}</td>
                  </tr>
                  <div class="detail-item" v-if="sidebarActiveId !== 12">
                    <label class="detail-label">传输设备型号</label>
                    <span class="detail-span">{{ formData.inputDeviceModel }}</span>
                    <label class="detail-label">传输通讯类型</label>
                    <span class="detail-span">{{ formData.inputCommunicationType }}</span>
                  </div>
                  <tr class="detail-item" v-if="sidebarActiveId !== 12">
                    <td class="detail-label">传输设备IMEI/ID</td>
                    <td class="detail-span">{{ formData.inputDeviceImei }}</td>
                    <td class="detail-label">传输设备IP地址</td>
                    <td class="detail-span">{{ formData.inputDeviceIp }}</td>
                  </tr>
                  <tr class="detail-item" v-if="sidebarActiveId !== 12">
                    <td class="detail-label">传输设备网络端口</td>
                    <td class="detail-span">{{ formData.inputDevicePort }}</td>
                    <td class="detail-label">所属服务</td>
                    <td class="detail-span">{{ formData.service }}</td>
                  </tr>
                  <tr class="detail-item" v-if="sidebarActiveId !== 12">
                    <td class="detail-label">传输设备设备标签</td>
                    <td class="detail-span">{{ formData.inputDeviceLabel }}</td>
                    <td class="detail-label">传输设备标签编码</td>
                    <td class="detail-span">{{ formData.inputDeviceCode }}</td>
                  </tr>
                  <tr class="detail-item" v-if="sidebarActiveId !== 12">
                    <td class="detail-label">传输设备生产日期</td>
                    <td class="detail-span">{{ formData.inputDeviceProduction }}</td>
                    <td class="detail-label">传输设备有效期</td>
                    <td class="detail-span">{{ formData.inputDeviceValidity }}</td>
                  </tr>
                  <tr class="detail-item" v-if="sidebarActiveId !== 12">
                    <td class="detail-label">传输设备位置</td>
                    <td class="detail-span">{{ formData.inputDeviceAddress }}</td>
                    <td class="detail-label">传输设备资产编码</td>
                    <td class="detail-span">{{ formData.inputDeviceAssetsCode }}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="tb-div">
              <table style="width:100%;border:1px solid #e1e1e1">
                <tr class="tb-tr">
                  <td class="tb-label">录入时间</td>
                  <td class="tb-input">{{ formData.createdAt }}</td>
                  <td class="tb-label">录入机构</td>
                  <td class="tb-input">{{ formData.updatedDept }}</td>
                  <td class="tb-label">录入人</td>
                  <td class="tb-input">{{ formData.updatedBy }}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- 系统部件 v-if="isShowFormDetail && sidebarActiveId != 12" :videoTableData="videoTableData"-->
          <div class="list-box" v-if="(isShowFormDetail || this.title === '编辑') && isShowId">
            <relevance-list :showVideo="showVideo" :formFire="formFire" :title="title"></relevance-list>
          </div>
        </div>
      </div>

      <!-- 排序 -->
      <transfer @goBack="isShow" v-if="isShowDetail === 'transfer'" :sortData="transferData"></transfer>
      <!-- 迁移组件 -->
      <Move v-show="moveShow" :moveShow.sync="moveShow" :migrantData="moveData" @clickMoveShow="clickMoveShow"></Move>
    </div>
  </div>
</template>

<script>
import RelevanceList from './relevanceList' // 系统部件
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import treeBox from '@src/components/tree/treeBox'
import { fireInterface, selectQuety } from '@src/http/intelligentFire/equipmentManagement.js'
import Move from './move' // 迁移
import transfer from './transfer' // 排序
import { mapActions, mapMutations, mapState } from 'vuex'
import systemManagement from '@src/assets/rules/validation/fire/systemManagement.js'
export default {
  name: 'fireFightingSubsystemManagement',
  components: { treeBox, RelevanceList, transfer, Move },
  props: {
    deviceData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    optType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      sdk: '',
      isShowId: true, // 是否显示系统部件
      isShowDetail: '', // 排序页面
      transferData: '', // 排序数据
      moveShow: false, // 迁移\
      moveData: [], // 迁移数据
      formFire: {}, // 添加部件时需要的主机字段
      title: '', // 新建/编辑
      isShowFormDetail: false, // 新建保存之后的详情
      showVideo: true, // 系统部件
      videoTableData: '', // 系统部件数据
      treeType: 2, // 树
      customizeQuery: {
        // 树
        params: {
          subSystem: '1',
          isRecursion: '0'
        }
      },
      downloadDialog: false,
      addDialog: false,
      voiceValue: '',
      partsSelection: [],
      total: 0, // 数据总条数
      pageSize: 25, // 每页数据条数
      pageCurrent: 1, // 当前页数
      formData: {
        // 表单数据
        type: '', // 页面类型
        orgId: '', // 所属机构ID
        orgName: '', // 所属机构名字
        keyPartId: '', // 所属重点部位Id
        keyPartType: '', // 所属重点部位类型
        keyPartName: '', // 所属重点部位名字
        name: '', // 设备名称
        brand: '', // 设备品牌
        modelNum: '', // 设备型号
        label: '', // 设备标签
        labelCode: '', // 标签编码
        code: '', // 设备编码
        validity: '', // 设备有效期
        address: '', // 设备位置
        assetCode: '', // 资产编码
        production: '', // 生产日期,如2020-01-01
        inputDeviceType: '', // 传输设备分类
        inputDeviceName: '', // 传输设备名称
        inputDeviceBrand: '', // 传输设备品牌
        inputDeviceModel: '', // 传输设备型号
        inputCommunicationType: '', // 传输通讯类型
        inputDeviceImei: '', // 传输设备IMEI/ID
        inputDeviceIp: '', // 传输设备IP地址
        inputDevicePort: '', // 传输设备端口
        service: '', // 所属服务
        inputDeviceLabel: '', // 传输设备标签
        inputDeviceCode: '', // 传输设备编码
        inputDeviceProduction: '', // 传输设备生产日期,如2020-01-01
        inputDeviceValidity: '', // 传输设备有效期
        inputDeviceAddress: '', // 传输设备位置
        inputDeviceAssetsCode: '', // 传输设备资产编码
        updatedBy: '', // 录入人
        updatedDept: '', // 录入机构
        createdAt: '' // 录入时间
      },
      // rules: {
      //   orgName: [{ required: true, message: '所属机构不能为空' }],
      //   keyPartName: [{ required: true, message: '所属重点部位不能为空' }],
      //   name: [{ required: true, message: '设备名称不能为空' }],
      //   validity: [{ required: true, message: '设备有效期不能为空' }],
      //   address: [{ required: true, message: '设备位置不能为空' }],
      //   inputDeviceType: [{ required: true, message: '传输设备分类不能为空' }],
      //   inputDeviceName: [{ required: true, message: '传输设备名称不能为空 ' }],
      //   inputDeviceBrand: [{ required: true, message: '传输设备品牌不能为空' }],
      //   inputDeviceModel: [{ required: true, message: '传输设备型号不能为空' }],
      //   inputCommunicationType: [{ required: true, message: '传输通讯类型不能为空' }],
      //   inputDeviceImei: [{ required: true, message: '传输设备IMEI/ID不能为空' }],
      //   inputDeviceAddress: [{ required: true, message: '传输设备位置不能为空' }],
      //   labelCode: [{ required: true, message: '标签编码不能为空' }],
      //   production: [{ required: true, message: '生产日期不能为空' }],
      //   assetCode: [{ required: true, message: '资产编码不能为空' }]
      // },
      rules: systemManagement.CombustibleGasAlarmRules,
      devBrandList: [], // 设备品牌下拉
      devModelList: [], // 设备型号下拉选项
      devLabelList: [], // 设备标签下拉
      transDevClassList: [], // 传输设备分类
      transDevBrandList: [], // 传输设备品牌
      transDevModelList: [], // 传输设备类型
      serviceList: [], // 所属服务下拉
      dropdownStatus: {
        detector: true,
        output: false,
        subsystem: false
      }
    }
  },
  created() {
    // 获取数据字典
    this.SET_DATA_DIC_CHILD(this.dataDic[this.sidebarActiveField])
    // 根据页面类型判断是否显示系统部件
    let id = [7, 8, 9, 10, 12]
    this.isShowId = !id.includes(this.sidebarActiveId)

    if (this.optType === 'upDate') {
      this.deepCopyData()
      this.formFire.hostId = this.deviceData.id
      this.formFire.type = this.sidebarActiveId
      this.formFire.orgId = this.deviceData.orgId
      this.formFire.keyPartId = this.deviceData.keyPartId
      this.formFire.keyPartType = this.deviceData.keyPartType
      this.title = '编辑'
      // 设备品牌下拉
      this.changeBrand(this.deviceData.brand, 1)
      // 传输设备分类
      this.changeTransClass(this.deviceData.inputDeviceType, 1)
      // 传输设备品牌
      this.changeTransBrand(this.deviceData.inputDeviceBrand, 1)
    } else {
      // this.clickReset()
      this.title = '新建'
      this.formData.type = this.sidebarActiveId // 主机类型
    }

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
  mounted() {
    this.$refs.formData.clearValidate() // 清除整个表单的校验
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
    title: function() {
      if (this.title === '新建') {
        for (var key in this.formData) {
          if (key !== 'type') {
            this.formData[key] = ''
          }
        }
      }
    }
  },
  methods: {
    ...mapMutations('equipmentManagement', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE',
      SET_DATA_DIC_CHILD: 'SET_DATA_DIC_CHILD',
      SET_SIDEBAR_ACTIVE_FIELD: 'SET_SIDEBAR_ACTIVE_FIELD'
    }),
    ...mapActions(['addAlarmHost']),
    // 深复制
    deepCopyData() {
      for (var key in this.formData) {
        this.formData[key] = ''
      }
      for (var key in this.deviceData) {
        this.formData[key] = this.deviceData[key]
      }
    },
    // 树
    getTreeApi(params) {
      return getTreeApi(params)
    },
    onceClick(data, node) {
      // 点击机构返回重点部位的下拉，记录当前节点的信息
      if (data.tierType === 'org') {
        if (this.title === '新建') {
          this.formData.orgId = data.id
          this.formData.orgName = data.name

          this.formData.keyPartType = ''
          this.formData.keyPartId = ''
          this.formData.keyPartName = ''
        }
        // this.getKeyPartSelect(data.serial) // 请求机构的关系，现在需要换成serial字段，todo，不清楚修改后对配置的影响
      } else {
        let parentNode = node.parent
        if (!parentNode) {
          return
        }
        if (this.title === '新建') {
          this.formData.orgId = (parentNode.data && node.parent.data.id) || ''
          this.formData.orgName = (parentNode.data && node.parent.data.name) || ''

          this.formData.keyPartType = data.keyPartType
          this.formData.keyPartId = data.id
          this.formData.keyPartName = data.name
        }
      }
    },
    // 刷新  机构树
    refresh() {
      this.$refs.tree.$refs.lazyTree.refresh()
    },
    // 部件列表显示隐藏
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
    changeBrand(val, id) {
      let params = {
        dictId: this.dataDicChild.modelNumber,
        homeClass: val
      }
      if (!id) {
        this.formData.modelNum = '' // 清空设备型号
        this.devModelList = []
      }

      this.getDataDic(params).then(res => {
        // console.log(res.data.data[0], 'res.data.data[0]=====')
        this.devModelList = res.data.data[0].attr
        for (let i = 0; i < res.data.data[0].attr.length; i++) {
          if (res.data.data[0].attr[i].sdkName) {
            this.sdk = res.data.data[0].attr[i].sdkName
          } else {
            this.sdk = ''
          }
        }
      })
    },
    // 传输设备分类
    changeTransClass(val, id) {
      let params = {
        dictId: this.dataDicChild.transDev[`${val}`].id
      }

      if (!id) {
        this.formData.inputDeviceBrand = '' // 清空传输设备品牌
        this.transDevBrandList = []
        this.formData.inputDeviceModel = '' // 清空传输设备型号
        this.transDevModelList = []
      }
      this.getDataDic(params, '3').then(res => {
        this.transDevBrandList = res.data.data[0].attr
      })
    },
    // 传输设备品牌
    changeTransBrand(val, id) {
      let params = {
        dictId: this.dataDicChild.transDev[`${this.formData.inputDeviceType}`].modelNumber,
        homeClass: val
      }
      if (!id) {
        this.formData.inputDeviceModel = '' // 清空传输设备型号
        this.transDevModelList = []
      }
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

    // 关闭排序页面
    isShow(data) {
      this.isShowDetail = data
    },
    // 跳转到列表页
    skipToList() {
      this.SET_IS_NEW_FILE('FireAlarm')
    },
    // 取消
    clickCancel() {
      this.$confirm('确定取消吗？').then(_ => {
        this.skipToList()
      })
    },
    // 重置
    clickReset() {
      this.$confirm('确定重置吗？').then(_ => {
        if (this.title === '新建') {
          for (var key in this.formData) {
            if (key !== 'type') {
              this.formData[key] = ''
            }
          }
        } else {
          this.deepCopyData()
        }
        this.$refs.formData.clearValidate()
      })
    },
    // 添加报警主机
    saveAlarmHost(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {}
          for (var key in this.formData) {
            if (this.formData[key]) {
              if (key === 'inputDevicePort') {
                this.formData[key] = Number(this.formData[key])
              }
              params[key] = this.formData[key]
            }
          }
          if (this.sidebarActiveId === 12) {
            params.inputDeviceBrand = this.formData.brand
          }
          params.sdk = this.sdk
          if (this.optType === 'upDate') {
            // 编辑
            fireInterface
              .comBustibleUpDateHost(params)
              .then(res => {
                this.$notify.success({
                  title: '成功',
                  message: '修改成功'
                })
                this.isShowFormDetail = true
              })
              .catch(_ => {
                this.$notify.error({
                  title: '失败',
                  message: '修改失败'
                })
              })
          } else {
            // 新建
            fireInterface
              .comBustibleHost(params)
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify.success({
                    message: '添加成功',
                    title: '成功'
                  })

                  this.formData.id = res.data.data.ids[0]
                  this.formFire.hostId = res.data.data.ids
                  this.formFire.type = this.formData.type
                  this.formFire.orgId = this.formData.orgId
                  this.formFire.keyPartId = this.formData.keyPartId
                  this.formFire.keyPartType = this.formData.keyPartType
                  this.isShowFormDetail = true
                }
                return Promise.resolve(res.data.data.ids)
              })
              .then(res => {
                let params = {
                  ids: res
                }
                // console.log(res)
                fireInterface.comBustibleGetDetailsHost(params).then(res => {
                  if (res.data.code === 0) {
                    this.formData.createdAt = res.data.data.alarmHostInfo[0].createdAt
                    this.formData.updatedBy = res.data.data.alarmHostInfo[0].updatedBy
                    this.formData.updatedDept = res.data.data.alarmHostInfo[0].updatedDept
                  }
                })
              })
              .catch(_ => {
                this.$notify.error({
                  message: '添加失败',
                  title: '失败'
                })
              })
          }
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    // 新建
    skipTo(data) {
      this.isShowFormDetail = false
      this.optType = 'creat'
      for (var key in this.formData) {
        if (key !== 'type') {
          this.formData[key] = ''
        }
      }
    },
    // 编辑
    clickEdit() {
      this.optType = 'upDate'
      this.isShowFormDetail = false
    },
    // 删除列表
    delList(done) {
      this.$confirm('确认删除信息？')
        .then(_ => {
          let params = []
          params.push(this.formData.id)
          fireInterface
            .comBustibleDeleteHost(params)
            .then(res => {
              if (res.data.code === 0) {
                this.$notify.success({
                  message: '删除成功!',
                  title: '成功'
                })
                this.skipToList()
              }
            })
            .catch(_ => {
              this.$notify.error({
                message: '删除失败!',
                title: '失败'
              })
            })
        })
        .catch(_ => {})
    },
    // 迁移
    clickMrgrate() {
      this.moveShow = true
      this.moveData = []
      this.moveData.push(this.formData)
    },
    // 顶部排序
    clickTransfer() {
      this.isShowDetail = 'transfer'
      this.transferData = []
      this.transferData.push(this.formData)
    },

    // 迁移页面关闭
    clickMoveShow(val) {
      this.moveShow = val
      // this.getAlarmHostList()
      // this.fireSelection = []
      // this.$refs.tabList.clearSelection()
    },
    // 复制
    clickCopy() {
      this.isShowFormDetail = false
      this.optType = 'creat'
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
  .left-tree {
    width: 240px;
    border-right: 1px solid #e1e1e1;
    .tree-title {
      display: inline-block;
      width: 100%;
      height: 38px;
      line-height: 38px;
      text-align: center;
      background: #f5f5f5;
      color: #333;
      font-size: 14px;
      // margin-bottom: 14px;
      font-weight: 400;
      position: relative;
    }
    .refresh {
      position: absolute;
      top: 0px;
      right: 7px;
      z-index: 2;
      cursor: pointer;
    }
  }
  .right-content {
    font-size: 14px;
    padding: 0 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    /deep/.list-box {
      /deep/.table-box {
        height: 300px;
      }
    }
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    .form-box {
      margin-top: 20px;
      padding-top: 20px;
      // border: 1px solid #f2f2f2;

      .form-content {
        display: flex;
        justify-content: center;
        width: 75%;
        padding: 24px 10px 10px 10px;
        font-size: 12px;
        background-color: #f5f5f5 !important;
        .el-select {
          width: 100%;
          max-width: 356px !important;
        }
        .el-input {
          width: 100%;
          max-width: 356px !important;
        }
        .left-form {
          margin-right: 24px;
          width: 100%;
        }
        .right-form {
          width: 442px;
        }
        .left-form,
        .right-form {
          .el-form-item--mini.el-form-item {
            margin-bottom: 14px;
          }
          /deep/ .el-form-item__label {
            border: 1px solid #f5f5f5 !important;
            height: 35px;
            line-height: 35px;
          }
          .el-input--mini .el-input__inner {
            height: 35px;
          }
        }
        .detile-item {
          display: flex;
          line-height: 35px;
          border-bottom: 1px solid #f8f8f8;
        }
        .item-left {
          display: block;
          width: 120px;
          background: #f8f8f8;
          border-right: 1px solid #f8f8f8;
        }
        .item-right {
          flex: 1;
          border-right: 1px solid #f8f8f8;
          border-bottom: none;
          border-left: none;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .form-footer {
        width: 1060px;
        margin-top: 30px;
        margin-bottom: 50px;
        text-align: center;
      }
      .tb-div {
        width: 1060px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 20px;
        color: #222222;
        .tb {
          width: 100%;
          border: 1px solid #e1e1e1;
        }
        .tb-label {
          width: 142px;
          height: 35px;
          text-align: center;
          background: #f5f5f5;
        }
        .tb-input {
          width: 177px;
          height: 35px;
          text-align: left;
          padding: 0 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
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
  }

  .flex-div {
    display: flex;
    flex-direction: row;
    justify-content: left;
    width: 100%;
    height: 35px;
    margin-bottom: 14px;
    .el-form-item--mini.el-form-item {
      margin-bottom: 14px;
      width: 50%;

      .el-form-item__label {
        border: 1px solid #f5f5f5 !important;
        height: 35px !important;
        line-height: 35px !important;
      }
      .el-form-item__content {
        .el-input--mini .el-input__inner {
          height: 35px !important;
          line-height: 35px !important;
        }
      }
    }

    .w-input {
      width: 100%;
      max-width: 356px;
      height: 35px;
      line-height: 35px !important;
    }
  }

  .form-detail {
    width: 75%;
    margin-top: 50px;
    .detail-item:nth-child(1) {
      border-top: 1px solid #e1e1e1;
    }
    .detail-item {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 35px;
      line-height: 35px;
      border-bottom: 1px solid #e1e1e1;
      border-left: 1px solid #e1e1e1;
      .detail-label {
        display: inline-block;
        width: 160px;
        color: #606266;
        text-align: right;
        padding-right: 10px;
        border-right: 1px solid #e1e1e1;
        background-color: #f5f5f5 !important;
      }
      .detail-span {
        display: inline-block;
        border-right: 1px solid #e1e1e1;
        padding-left: 10px;
        width: 50%;
        // max-width: 356px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .tb-div {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 20px;
      margin-bottom: 30px;
      color: #222222;
      .tb {
        width: 100%;
        border: 1px solid #e1e1e1;
      }
      .tb-label {
        width: 142px;
        height: 35px;
        // border-right: 1px solid #e1e1e1;
        text-align: center;
        background: #f5f5f5;
      }
      .tb-input {
        width: 20%;
        max-width: 177px;
        height: 35px;
        text-align: left;
        padding: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // border-right: 1px solid #e1e1e1;
      }
    }
  }

  .el-dialog--center .el-dialog__body {
    padding-bottom: 0 !important;
  }
  .el-button--text {
    color: #606266;
    &:hover {
      color: #66b1ff;
    }
  }
}
</style>
