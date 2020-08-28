<!--
 * @Author: your name
 * @Date: 2020-06-15 10:55:30
 * @LastEditTime: 2020-06-20 16:44:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\systemParameters\pages\BasicConfiguration.vue
-->
<template>
<!-- 基本配置 -->
<div class="body">
  <div class="main">
    <div class="location">
      <div style="float:left;font-size:18px;">
        <span class="el-icon-location-outline"></span>
      </div>
      <div style="float:left;margin-top:4px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统维护</el-breadcrumb-item>
          <el-breadcrumb-item>系统运维管理</el-breadcrumb-item>
          <el-breadcrumb-item>系统参数配置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="header-btn">
      <el-button size="small" icon="el-icon-edit-outline" @click="editConfig">编辑</el-button>
      <el-button size="small" icon="el-icon-printer" v-print="'#contentinfo'">打印</el-button>
    </div>
    <div id="contentinfo">
      <p class="text">系统参数配置</p>
        <!-- 分类标题 -->
        <el-row>
          <el-col :span="4">
            <div class="title item">分类</div>
          </el-col>
          <el-col :span="4">
            <div class="title item">配置项</div>
          </el-col>
          <el-col :span="15">
            <div class="title">参数值</div>
          </el-col>
        </el-row>
        <!-- 系统标题 -->
        <el-row>
          <el-col :span="4">
            <div style="height:81px;line-height:81px;" class="content-title item">系统标题</div>
          </el-col>
          <el-col :span="4">
            <div class="content-title item">logo</div>
            <div class="content-title item">平台标题</div>
          </el-col>
          <el-col :span="15">
            <div style="display:flex;padding-left:18px;" class="content-title">
              <el-row>
                <el-col :span="23">
                  <el-upload class="upload-demo"
                    action="/api/systemOpsManager/v1/systemOpsManager/uploadLogo"
                    :limit="1"
                    :show-file-list="false"
                    :beforeUpload="beforeUpload"
                    accept=".jpg,.png"
                    :disabled="!isEdit">
                    <el-input size="small" v-model="form.logoPath" disabled></el-input>
                    <el-button class="upload" size="small" icon="el-icon-upload" plain :disabled="!isEdit">上传文件</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </div>
            <div class="content-title" style="padding-left:18px;">
              <el-row>
                <el-col :span="13">
                  <el-input  size="small" v-model="form.platformTitle" :disabled="!isEdit"></el-input>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- 系统登录 -->
        <el-row style="margin:42px 0 1px 0;">
          <el-col :span="4">
            <div class="title item">系统登陆</div>
          </el-col>
          <el-col :span="4">
            <div class="title item">用户冻结</div>
          </el-col>
          <el-col :span="15">
            <div style="display:flex;padding-left:20px;" class="title">
              <el-checkbox v-model="form.freezeEnable" :disabled="!isEdit"></el-checkbox>
              <span>&nbsp;启用</span>
              <el-row style="margin:0 20px;">
                <el-col :span="4">
                  <el-input size="small" v-model="form.freezeDays"  @blur="changeTime()"  oninput = "value=value.replace(/[^\d]/g,'')"  :disabled="!isEdit"></el-input>
                </el-col>
                <el-col :span="2"><i>&nbsp;天</i></el-col>
                <el-col :span="14"><i>(用户连续1-120天未登录自动冻结)</i></el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- 存储 -->
        <el-row>
          <el-col :span="4">
            <div style="height:286px;line-height:286px;" class="content-title item">存储</div>
          </el-col>
          <el-col :span="4">
            <div class="content-title item">报警录像</div>
            <div class="content-title item">手动录像</div>
            <div class="content-title item">手动截图</div>
            <div class="content-title item">对讲音视频合成录像</div>
            <div class="content-title item">下载录像</div>
            <div class="content-title item">手机APP视频文件</div>
            <div class="content-title item">手机APP拍摄照片</div>
          </el-col>
          <el-col :span="15">
            <!-- 报警录像 -->
            <div class="content-title item">
              <el-row>
                <el-col :span="16">
                  <el-col :span="6">
                    <span>录像存储</span>
                  </el-col>
                  <el-col :span="8">
                    <el-input size="small" v-model="form.alarmVedioMode" disabled></el-input>
                  </el-col>
                </el-col>
                <el-col :span="8">
                  <el-col :span="8">
                    <span>保存时长</span>
                  </el-col>
                  <el-col :span="12">
                    <el-input size="small" v-model="form.alarmDay" disabled></el-input>
                  </el-col>
                  <el-col :span="2">
                    <span>天</span>
                  </el-col>
                </el-col>
              </el-row>
            </div>
            <!-- 手动录像 -->
            <div class="content-title item">
              <el-row>
                <el-col :span="16">
                  <el-col :span="6">
                    <span>录像存储</span>
                  </el-col>
                  <el-col :span="8">
                    <el-input size="small" v-model="form.manualVedioMode" disabled></el-input>
                  </el-col>
                </el-col>
                <el-col :span="8">
                  <el-col :span="8">
                    <span>保存时长</span>
                  </el-col>
                  <el-col :span="12">
                    <el-input size="small" v-model="form.manualDay" disabled></el-input>
                  </el-col>
                  <el-col :span="2">
                    <span>天</span>
                  </el-col>
                </el-col>
              </el-row>
            </div>
            <!-- 手动截图 -->
            <div class="content-title item">
              <el-row>
                <el-col :span="16">
                  <el-col :span="6">
                    <span>共享存储</span>
                  </el-col>
                  <el-col :span="16">
                  <el-input size="small" v-model="form.screenshotsPath"  disabled></el-input>
                  </el-col>
                </el-col>
                <el-col :span="8">
                  <el-col :span="8">
                    <span>保存时长</span>
                  </el-col>
                  <el-col :span="12">
                    <el-input size="small" v-model="form.screenshotsDay" disabled></el-input>
                  </el-col>
                  <el-col :span="2">
                    <span>天</span>
                  </el-col>
                </el-col>
              </el-row>
            </div>
            <!-- 对讲音视频合成录像 -->
            <div class="content-title item">
              <el-row>
                <el-col :span="16">
                  <el-col :span="6">
                    <span>共享存储</span>
                  </el-col>
                  <el-col :span="16">
                  <el-input size="small" v-model="form.talkBackPath"  disabled></el-input>
                  </el-col>
                </el-col>
                <el-col :span="8">
                  <el-col :span="8">
                    <span>保存时长</span>
                  </el-col>
                  <el-col :span="12">
                    <!-- 待添加数据 -->
                    <el-input size="small" v-model="form.talkBackDay" disabled></el-input>
                  </el-col>
                  <el-col :span="2">
                    <span>天</span>
                  </el-col>
                </el-col>
              </el-row>
            </div>
            <!-- 录像下载 -->
            <div class="content-title item">
              <el-row>
                <div style="display:flex;padding-left:18px;" class="content-title">
                  <el-col :span="16" style="margin-right:5px;">
                    <el-input size="small" v-model="form.downLoadVideoPath" disabled></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-button size="small" icon="el-icon-folder-opened" plain :disabled="!isEdit" @click="getFirePath">选择文件夹</el-button>
                  </el-col>
                </div>
              </el-row>
            </div>
            <!-- 手机APP视频文件 -->
            <div class="content-title item">
              <el-row>
                <el-col :span="16">
                  <el-col :span="6">
                    <span>共享存储</span>
                  </el-col>
                  <el-col :span="16">
                  <el-input size="small" v-model="form.appVideoPath"  disabled></el-input>
                  </el-col>
                </el-col>
                <el-col :span="8">
                  <el-col :span="8">
                    <span>保存时长</span>
                  </el-col>
                  <el-col :span="12">
                    <el-input size="small" v-model="form.appVideoDay" disabled></el-input>
                  </el-col>
                  <el-col :span="2">
                    <span>天</span>
                  </el-col>
                </el-col>
              </el-row>
            </div>
            <!-- 手机APP拍摄照片 -->
            <div class="content-title item">
              <el-row>
                <el-col :span="16">
                  <el-col :span="6">
                    <span>共享存储</span>
                  </el-col>
                  <el-col :span="16">
                  <el-input size="small" v-model="form.appPhotosPath"  disabled></el-input>
                  </el-col>
                </el-col>
                <el-col :span="8">
                  <el-col :span="8">
                    <span>保存时长</span>
                  </el-col>
                  <el-col :span="12">
                    <!-- 待添加数据 -->
                    <el-input size="small" v-model="form.appPhotosDay" disabled></el-input>
                  </el-col>
                  <el-col :span="2">
                    <span>天</span>
                  </el-col>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- 日志保存策略 -->
        <el-row style="margin-top:247px;">
          <el-col :span="4">
            <div style="height:122px;line-height:122px;" class="title item">日志保存策略</div>
          </el-col>
          <el-col :span="4">
            <div class="title item">操作日志</div>
            <div class="title item">系统日志</div>
            <div class="title item">报警日志</div>
          </el-col>
          <el-col :span="15">
            <!-- 操作日志 -->
            <div class="title item">
              <el-row>
                <div style="display:flex;padding-left:20px;" class="title">
                  <el-checkbox v-model="form.opsLogEnable" :disabled="!isEdit"></el-checkbox>
                  <span>&nbsp;启用&nbsp;&nbsp;</span>
                  <el-col :span="4"><i>保存时长</i></el-col>
                  <el-col :span="4">
                    <el-input size="small" v-model="form.opsLogTime" disabled></el-input>
                  </el-col>
                  <el-col :span="2"><i>年</i></el-col>
                  <el-col :span="6">
                    <i>(有效值≥5年)</i>
                  </el-col>
                </div>
              </el-row>
            </div>
            <!-- 系统日志 -->
            <div class="title item">
              <el-row>
                <div style="display:flex;padding-left:20px;" class="title">
                  <el-checkbox v-model="form.sysLogEnable" :disabled="!isEdit"></el-checkbox>
                  <span>&nbsp;启用&nbsp;&nbsp;</span>
                  <el-col :span="4"><i>保存时长</i></el-col>
                  <el-col :span="4">
                    <el-input size="small" v-model="form.sysLogTime" disabled></el-input>
                  </el-col>
                  <el-col :span="2"><i>年</i></el-col>
                  <el-col :span="6">
                    <i>(有效值≥5年)</i>
                  </el-col>
                </div>
              </el-row>
            </div>
            <!-- 报警日志 -->
            <div class="title item">
              <el-row>
                <div style="display:flex;padding-left:20px;" class="title">
                  <el-checkbox v-model="form.alarmLogEnable" :disabled="!isEdit"></el-checkbox>
                  <span>&nbsp;启用&nbsp;&nbsp;</span>
                  <el-col :span="4"><i>保存时长</i></el-col>
                  <el-col :span="4">
                    <el-input size="small" v-model="form.alarmLogTime" disabled></el-input>
                  </el-col>
                  <el-col :span="2"><i>年</i></el-col>
                  <el-col :span="6">
                    <i>(有效值≥5年)</i>
                  </el-col>
                </div>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- 日志备份策略 -->
        <el-row style="margin-top:83px;">
          <el-col :span="4">
            <div style="height:122px;line-height:122px;" class="content-title item">日志备份策略</div>
          </el-col>
          <el-col :span="4">
            <div class="content-title item">操作日志</div>
            <div class="content-title item">系统日志</div>
            <div class="content-title item">报警日志</div>
          </el-col>
          <el-col :span="15">
            <!-- 操作日志 -->
            <div class="content-title item">
              <el-row>
                <el-col :span="4">
                  <span>自动备份</span>
                </el-col>
                <el-col :span="5">
                  <el-select size="small" v-model="form.opsLogAutoTime" :disabled="!isEdit">
                    <el-option v-for="(item,index) in operationLogCopyDate" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-input size="small" v-model="form.opsLogPath" disabled></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button size="small" plain :disabled="!isEdit">手动备份</el-button>
                </el-col>
              </el-row>
            </div>
            <!-- 系统日志 -->
            <div class="content-title item">
              <el-row>
                <el-col :span="4">
                  <span>自动备份</span>
                </el-col>
                <el-col :span="5">
                  <el-select size="small" v-model="form.sysLogAutoTime" :disabled="!isEdit">
                    <el-option v-for="(item,index) in systemLogCopyDate" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-input size="small" v-model="form.sysLogPath" disabled></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button size="small" plain :disabled="!isEdit">手动备份</el-button>
                </el-col>
              </el-row>
            </div>
            <!-- 报警日志 -->
            <div class="content-title item">
              <el-row>
                <el-col :span="4">
                  <span>自动备份</span>
                </el-col>
                <el-col :span="5">
                  <el-select  size="small" v-model="form.alarmLogAutoTime" :disabled="!isEdit">
                    <el-option v-for="(item,index) in alarmLogCopyDate" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-input size="small" v-model="form.alarmLogPath" disabled></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button size="small" plain :disabled="!isEdit">手动备份</el-button>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- 消防存储 -->
        <el-row style="margin-top:83px;">
          <el-col :span="4">
            <div style="height:204px;line-height:204px;" class="title item">消防存储</div>
          </el-col>
          <el-col :span="4">
            <div class="title item">消防下载录像</div>
            <div class="title item">消防档案</div>
            <div class="title item">维保公司资料</div>
            <div class="title item">巡检公司资料</div>
            <div class="title item">动火审批资料</div>
          </el-col>
          <el-col :span="15">
            <!-- 消防下载录像 -->
            <div class="title item">
              <el-row>
                <div style="display:flex;padding-left:18px;" class="title">
                  <el-col :span="17" style="margin-right:5px;">
                    <el-input size="small" v-model="form.downPath" disabled>
                    </el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-button size="small" icon="el-icon-folder-opened" plain :disabled="!isEdit" @click="getDownloadPath">选择文件夹</el-button>
                  </el-col>
                </div>
              </el-row>
            </div>
            <!-- 消防档案 -->
            <div class="title item">
              <el-row>
                <el-col :span="4">
                  <span>共享存储</span>
                </el-col>
                <el-col :span="12">
                  <el-input size="small" v-model="form.archivesPath" disabled></el-input>
                </el-col>
                <el-col :span="6">
                  <div>(长期保存)</div>
                </el-col>
              </el-row>
            </div>
            <!-- 维保公司资料 -->
            <div class="title item">
              <el-row>
                <el-col :span="4">
                  <span>共享存储</span>
                </el-col>
                <el-col :span="12">
                  <el-input size="small" v-model="form.maintenancePath" disabled></el-input>
                </el-col>
                <el-col :span="6">
                  <div>(长期保存)</div>
                </el-col>
              </el-row>
            </div>
            <!-- 巡检公司资料 -->
            <div class="title item">
              <el-row>
                <el-col :span="4">
                  <span>共享存储</span>
                </el-col>
                <el-col :span="12">
                  <el-input size="small" v-model="form.inspectionPath" disabled></el-input>
                </el-col>
                <el-col :span="6">
                  <div>(长期保存)</div>
                </el-col>
              </el-row>
            </div>
            <!-- 动火审批资料 -->
            <div class="title item">
              <el-row>
                <el-col :span="4">
                  <span>共享存储</span>
                </el-col>
                <el-col :span="12">
                  <el-input size="small" v-model="form.approvalHotPath" disabled></el-input>
                </el-col>
                <el-col :span="6">
                  <div>(长期保存)</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- 消防日志保存策略 -->
        <el-row style="margin-top:165px;">
          <el-col :span="4">
            <div style="height:81px;line-height:81px;" class="content-title item">消防日志保存策略</div>
          </el-col>
          <el-col :span="4">
            <div class="content-title item">消防操作日志</div>
            <div class="content-title item">消防报警日志</div>
          </el-col>
          <el-col :span="15">
            <!-- 消防操作日志 -->
            <div class="content-title item">
              <el-row>
                <div style="display:flex;padding-left:20px;" class="content-title">
                  <el-checkbox v-model="form.fireOpsLogEnable" :disabled="!isEdit"></el-checkbox>
                  <span>&nbsp;启用&nbsp;&nbsp;</span>
                  <el-col :span="4"><i>保存时长</i></el-col>
                  <el-col :span="4">
                    <el-input size="small" v-model="form.fireOpsLogTime" disabled></el-input>
                  </el-col>
                  <el-col :span="2"><i>年</i></el-col>
                  <el-col :span="6">
                    <i>(有效值≥5年)</i>
                  </el-col>
                </div>
              </el-row>
            </div>
            <!-- 消防报警日志 -->
            <div class="content-title item">
              <el-row>
                <div style="display:flex;padding-left:20px;" class="content-title">
                  <el-checkbox v-model="form.fireAlarmLogEnable" :disabled="!isEdit"></el-checkbox>
                  <span>&nbsp;启用&nbsp;&nbsp;</span>
                  <el-col :span="4"><i>保存时长</i></el-col>
                  <el-col :span="4">
                    <el-input size="small" v-model="form.fireAlarmLogTime" disabled></el-input>
                  </el-col>
                  <el-col :span="2"><i>年</i></el-col>
                  <el-col :span="6">
                    <i>(有效值≥5年)</i>
                  </el-col>
                </div>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- 消防日志备份策略 -->
        <el-row style="margin-top:42px;">
          <el-col :span="4">
            <div style="height:81px;line-height:81px;" class="title item">消防日志备份策略</div>
          </el-col>
          <el-col :span="4">
            <div class="title item">消防操作日志</div>
            <div class="title item">消防报警日志</div>
          </el-col>
          <el-col :span="15">
            <!-- 消防操作日志 -->
            <div class="title item">
              <el-row>
                <el-col :span="4">
                  <span>自动备份</span>
                </el-col>
                <el-col :span="5">
                  <el-select size="small" v-model="form.opsLogBackupTime" :disabled="!isEdit">
                    <el-option v-for="(item,index) in fireOperationLogCopyDate" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-input size="small" v-model="form.opsLogBackupPath" disabled></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button size="small" plain :disabled="!isEdit">手动备份</el-button>
                </el-col>
              </el-row>
            </div>
            <!-- 消防报警日志 -->
            <div class="title item">
              <el-row>
                <el-col :span="4">
                  <span>自动备份</span>
                </el-col>
                <el-col :span="5">
                  <el-select size="small" :disabled="!isEdit" v-model="form.alarmLogBackupTime">
                    <el-option v-for="(item,index) in firealarmLogCopyDate" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-input size="small" v-model="form.alarmLogBackupPath" disabled></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button size="small" plain :disabled="!isEdit">手动备份</el-button>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- 格式 -->
        <el-row style="margin-top:42px;">
          <el-col :span="4">
            <div style="height:81px;line-height:81px;" class="content-title item">格式</div>
          </el-col>
          <el-col :span="4">
            <div class="content-title item">截图格式</div>
            <div class="content-title item">下载格式</div>
          </el-col>
          <el-col :span="15">
            <!-- 截图格式 -->
            <div class="content-title item">
              <el-row>
                <div style="display:flex;padding-left:20px;" class="content-title">
                  <el-col :span="5">
                    <el-select v-model="form.screenshots" size="small" :disabled="!isEdit">
                      <el-option v-for="(item,index) in screenShotFormatArr" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-col>
                </div>
              </el-row>
            </div>
            <!-- 下载格式 -->
            <div class="content-title item">
              <el-row>
                <div style="display:flex;padding-left:20px;" class="content-title">
                  <el-col :span="5">
                    <el-select v-model="form.download" size="small" :disabled="!isEdit">
                      <el-option v-for="(item,index) in downloadVideoFormatArr" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-col>
                </div>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- 报警录像码流-->
        <el-row style="margin-top:42px;">
          <el-col :span="4">
            <div style="height:41px;line-height:41px;" class="title item">报警录像码流</div>
          </el-col>
          <el-col :span="4">
            <div class="title item">码流</div>
          </el-col>
          <el-col :span="15">
            <!-- 报警录像 -->
            <div class="title item">
              <el-row>
                <div style="display:flex;padding-left:20px;" class="title">
                  <el-col :span="5">
                    <el-select v-model="form.alarmVedioStream" size="small" :disabled="!isEdit">
                      <el-option v-for="(item,index) in alarmVedioStreamArr" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-col>
                </div>
              </el-row>
            </div>
          </el-col>
        </el-row>
          </el-col>
        </el-row>
        <div class="footer-btn" v-if="isEdit">
          <el-button size="small" @click="onSubmit" type="primary" style="margin-right:30px;">保存</el-button>
          <el-button size="small" @click="cancel">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import { getSysConfig, setSysConfig } from '@src/http/systemOperationManage/systemParameters.api.js'
export default {
  name: 'BasicConfiguration',
  components: {
  },
  data() {
    return {
      operationLogCopyDate: [
        {value: 1, label: '每天'},
        {value: 2, label: '每周'},
        {value: 3, label: '每月'}
      ],
      systemLogCopyDate: [
        {value: 1, label: '每天'},
        {value: 2, label: '每周'},
        {value: 3, label: '每月'}
      ],
      alarmLogCopyDate: [
        {value: 1, label: '每天'},
        {value: 2, label: '每周'},
        {value: 3, label: '每月'}
      ],
      fireOperationLogCopyDate: [
        {value: 1, label: '每天'},
        {value: 2, label: '每周'},
        {value: 3, label: '每月'}
      ],
      firealarmLogCopyDate: [
        {value: 1, label: '每天'},
        {value: 2, label: '每周'},
        {value: 3, label: '每月'}
      ],
      screenShotFormatArr: [
        {value: 1, label: 'jpg'}
      ],
      downloadVideoFormatArr: [
        {value: 1, label: 'bsr'},
        {value: 2, label: 'avi'}
      ],
      alarmVedioStreamArr: [
        {value: 1, label: '主码流'},
        {value: 2, label: '子码流'}
      ],
      isEdit: false, // 是否是编辑状态
      form: {
        platformTitle: '', // 平台标题
        download: 1, // 下载格式
        screenshots: 1, // 截图格式
        freezeDays: 1, // 连续未登录天数
        freezeEnable: false, // 用户冻结
        logoPath: '', // LOGO路径
        alarmVedioStream: 2, // 报警录像码流
        alarmVedioMode: 'VM', // 报警录像模式
        alarmDay: 360, // 报警录像保存时长
        manualVedioMode: 'VM', // 手动录像模式
        manualDay: 360, // 手动录像存储时长
        screenshotsPath: '', // 手动截图路径
        screenshotsDay: 360, // 手动截图保存时长
        talkBackPath: '', // 对讲音视频合成录像地址
        appVideoPath: '', // 手机APP视频文件存储地址
        mobileAppVideoMode: 1, // App视频文件
        talkBackDay: 360, // 对讲音频合成录像保存时长
        appVideoDay: 360, // 手机APP视频文件保存时长
        appPhotosPath: '', // 手机APP拍摄照片存储地址
        appPhotosDay: 360, // 手机App拍摄照片保存时长
        opsLogEnable: false, // 操作日志启动/不启动
        opsLogTime: 5, // 操作日志保存时长
        sysLogEnable: false, // 系统日志启动/不启动
        sysLogTime: 5, // 系统日志保存时长
        alarmLogEnable: false, // 报警日志启动/不启动
        alarmLogTime: 5, // 报警日志保存时长
        opsLogAutoTime: 1, // 操作日志备份时间
        opsLogPath: '', // 操作日志备份地址
        sysLogAutoTime: 1, // 系统日志备份时间
        sysLogPath: '', // 系统日志备份地址
        alarmLogAutoTime: 1, // 报警日志备份时间
        alarmLogPath: '', // 报警日志备份地址
        downPath: 'C:\\Program Files (x86)', // 消防下载录像地址
        archivesPath: '', // 消防档案存储地址
        maintenancePath: '', // 维保公司资料存储地址
        inspectionPath: '', // 巡检公司资料存储地址
        approvalHotPath: '', // 动火审批资料存储地址
        fireOpsLogEnable: false, // 消防操作日志启动/不启动
        fireOpsLogTime: 5, // 消防操作日志保存时长
        fireAlarmLogTime: 5, // 消防报警日志保存时长
        fireAlarmLogEnable: false, // 消防报警日志启动/不启动
        opsLogBackupTime: 1, // 消防日志备份(消防操作日志备份时长)
        opsLogBackupPath: '', // 消防日志备份（消防操作日志备份地址）
        alarmLogBackupTime: 1, // 消防日志备份（消防报警日志备份时长）
        alarmLogBackupPath: '', // 消防日志备份（消防报警日志备份地址）
        downLoadVideoPath: 'C:\\Program Files (x86)', // 下载录像地址
        opsLogMode: 1, // 日志备份策略(操作日志 1=自动 2=手动)
        sysLogMode: 1, // 日志备份策略(系统日志 1=自动 2=手动)
        alarmLogMode: 1, // 日志备份策略(报警日志 1=自动 2=手动)
        opsLogBackupMode: 1, // 消防日志备份策略(消防操作日志 1=自动 2=手动)
        alarmLogBackupMode: 1 // 消防日志备份策略(报警操作日志 1=自动 2=手动)
      },
      formData: {}
    }
  },
  watch: {
  },
  computed: {
    plugin() {
      return document.querySelector('#global-plugin')
    }
  },
  methods: {
    ...mapMutations(['SET_CONFPARAM']),
    // 保存时长校验
    changeTime() {
      if (Number(this.form.freezeDays) < 1) {
        this.$messageError('选择日期不得小于1天')
        this.form.freezeDays = 1
      } else if (Number(this.form.freezeDays) > 120) {
        this.$messageError('选择日期不得大于120天')
        this.form.freezeDays = 120
      }
    },
    beforeUpload(file) {
      this.$set(this.form, 'logoPath', file.name)
    },
    getPath() {
      const state = JSON.parse(this.plugin.GetFileDirectory())
      if (state.success) {
        return state.DirName
      } else {
        console.log('选择文件失败')
      }
    },
    getDownloadPath() {
      const pathName = this.getPath()
      pathName && this.$set(this.form, 'downPath', pathName)
    },
    getFirePath() {
      const pathName = this.getPath()
      pathName && this.$set(this.form, 'downLoadVideoPath', pathName)
    },
    // 编辑
    editConfig() {
      this.isEdit = true
    },
    // 设置系统参数
    onSubmit() {
      let param = {
        title: {
          logoPath: this.form.logoPath,
          platformTitle: this.form.platformTitle
        },
        login: {
          freezeEnable: this.form.freezeEnable ? 1 : 2,
          freezeDays: this.formatData(this.form.freezeDays)
        },
        store: {
          alarmVedioMode: this.form.alarmVedioMode,
          alarmDay: this.formatData(this.form.alarmDay),
          manualVedioMode: this.form.manualVedioMode,
          manualDay: this.formatData(this.form.manualDay),
          screenshotsPath: this.form.screenshotsPath,
          screenshotsDay: this.formatData(this.form.screenshotsDay),
          talkBackPath: this.form.talkBackPath,
          talkBackDay: this.formatData(this.form.talkBackDay),
          downLoadVideoPath: this.form.downLoadVideoPath,
          appVideoPath: this.form.appVideoPath,
          appVideoDay: this.formatData(this.form.appVideoDay),
          appPhotosPath: this.form.appPhotosPath,
          appPhotosDay: this.formatData(this.form.appPhotosDay)
        },
        logStore: {
          opsLogEnable: this.form.opsLogEnable ? 1 : 2,
          opsLogTime: this.formatData(this.form.opsLogTime),
          sysLogEnable: this.form.sysLogEnable ? 1 : 2,
          sysLogTime: this.formatData(this.form.sysLogTime),
          alarmLogEnable: this.form.alarmLogEnable ? 1 : 2,
          alarmLogTime: this.formatData(this.form.alarmLogTime)
        },
        logBackup: {
          opsLogMode: this.form.opsLogMode,
          opsLogAutoTime: this.formatData(this.form.opsLogAutoTime),
          opsLogPath: this.form.opsLogPath,
          sysLogMode: this.form.sysLogMode,
          sysLogAutoTime: this.formatData(this.form.sysLogAutoTime),
          sysLogPath: this.form.sysLogPath,
          alarmLogMode: this.form.alarmLogMode,
          alarmLogAutoTime: this.formatData(this.form.alarmLogAutoTime),
          alarmLogPath: this.form.alarmLogPath
        },
        fireStore: {
          downPath: this.form.downPath,
          archivesPath: this.form.archivesPath,
          maintenancePath: this.form.maintenancePath,
          inspectionPath: this.form.inspectionPath,
          approvalHotPath: this.form.approvalHotPath
        },
        fireLogStore: {
          opsLogEnable: this.form.opsLogEnable ? 1 : 2,
          opsLogTime: this.formatData(this.form.opsLogTime),
          alarmLogEnable: this.form.alarmLogEnable ? 1 : 2,
          alarmLogTime: this.formatData(this.form.alarmLogTime)
        },
        fireBackupStore: {
          opsLogBackupMode: this.form.opsLogBackupMode,
          opsLogBackupTime: this.formatData(this.form.opsLogBackupTime),
          opsLogBackupPath: this.form.opsLogBackupPath,
          alarmLogBackupMode: this.form.alarmLogBackupMode,
          alarmLogBackupTime: this.formatData(this.form.alarmLogBackupTime),
          alarmLogBackupPath: this.form.alarmLogBackupPath
        },
        formats: {
          screenshots: this.form.screenshots,
          download: this.form.download
        },
        alarmVedioStream: this.form.alarmVedioStream
      }
      setSysConfig(param).then(res => {
        this.$messageSuccess(res.data.message)
        this.getSysConfigFuc()
      })
        .catch(err => {
          console.log(err)
        })
      this.isEdit = false
    },
    formatData(val) {
      val = Number(val)
      return val
    },
    cancel() {
      this.isEdit = false
      this.form = this.formData
    },
    getSysConfigFuc() {
      // 获取系统参数
      getSysConfig().then(res => {
        if (res.data.code === 0) {
          let config = JSON.parse(JSON.stringify(res.data.data))
          this.form = {
            ...config.formats,
            ...config.title,
            ...config.login,
            ...config.store,
            ...config.logStore,
            ...config.logBackup,
            ...config.fireStore,
            ...config.fireBackupStore,
            freezeEnable: config.login.freezeEnable === 1,
            opsLogEnable: config.logStore.opsLogEnable === 1,
            sysLogEnable: config.logStore.sysLogEnable === 1,
            alarmLogEnable: config.logStore.alarmLogEnable === 1,
            fireAlarmLogEnable: config.fireLogStore.alarmLogEnable === 1,
            fireOpsLogEnable: config.fireLogStore.opsLogEnable === 1,
            alarmVedioStream: config.alarmVedioStream,
            fireOpsLogTime: config.fireLogStore.opsLogTime,
            fireAlarmLogTime: config.fireLogStore.alarmLogTime
          }
          this.formData = JSON.parse(JSON.stringify(this.form))
          window.localStorage.setItem('confParam', JSON.stringify(this.form))
        } else {
          this.$messageError(res.data.message)
        }
      })
        .catch(err => {
          console.log(err)
          this.$messageError('获取系统参数失败')
        })
    }
  },
  created() {
    this.getSysConfigFuc()
  },
  mounted() {
  }
}
</script>

<style scoped lang='less'>
@import '../../../../assets/elementModify.less';
.body {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  box-sizing: border-box;
  .main {
    width: 835px;
    height: 100%;
    margin-left:30px;
    .location {
      overflow: hidden;
    }
    .header-btn {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 230px;
      margin: 10px 0 0 60px;
    }
    #contentinfo {
      width: 100%;
      min-height: 1500px;
      .text {
        text-align: center;
        font-size: 18px;
        font-weight: 700;
      }
      div {
        height: 40px;
        line-height: 40px;
      }
      .item {
        margin-right:1px;
      }
      .title {
        text-align: center;
        margin-bottom: 1px;
        padding-left:3px;
        background: rgba(242, 242, 242, 1);
      }
      .content-title {
        margin-bottom: 1px;
        padding-left:3px;
        text-align: center;
        background: rgba(215, 215, 215, 1);
      }
      .upload {
        position: relative;
        top: -40px;
        right: -220px;
      }
      .footer-btn {
        width: 230px;
        height: 200px;
        margin: 80px auto;
      }
    }
  }
  /deep/.el-upload-list {
    display: none!important;
  }
}
@media print {
  #contentinfo {
     width: 70%;
     min-height: 1500px;
     .text {
       text-align: center;
       font-size: 18px;
       font-weight: 700;
     }
     div {
       height: 40px;
       line-height: 40px;
     }
     .item {
       margin-right:1px;
     }
     .title {
       text-align: center;
       margin-bottom: 1px;
       background: rgba(242, 242, 242, 1);
     }
     .content-title {
       margin-bottom: 1px;
       padding-left:3px;
       text-align: center;
       background: rgba(215, 215, 215, 1);
     }
     .upload {
       position: relative;
       top: -40px;
       right: -220px;
     }
     .footer-btn {
       width: 230px;
       height: 200px;
       margin: 80px auto;
     }
   }
}
</style>
