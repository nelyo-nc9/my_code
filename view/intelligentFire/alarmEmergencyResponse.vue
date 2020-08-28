<template>
  <div class="containerfire">
    <div class="left-contain">
      <!-- :defaultPane="defaultPane" :iconShow="iconShowParams" -->
      <preview-plugin ref="preview"
                      v-if='!isBackVideo'
                      :iconShow="iconShowParams"
                      :isDbClickEmit='true'
                      @openBack='openBack'
                      :moduleType='2'
                      @alarmData='alarmDataFuc'
                      :isButton="true"
                      :defaultPane='9'>
      </preview-plugin>

      <playBackPlugin v-if='isBackVideo'
                      ref="pluginP"
                      :iconShow="iconShowParams1"
                      :previewData="previewData"
                      :defaultPane="6"
                      :isCenterP="isDbClickEmit"
                      :channelName="currentSelectObj.name">
        <template v-slot:backBtn>
          <el-button type="primary"
                     @click="alarmPushDialogVisible=true">报警推送</el-button>
          <el-button type="primary"
                     @click="print_schedule">查看重点部位</el-button>
          <el-button type="primary"
                     style='margin-right: 10px;'
                     @click="backOrderVideo()">返回接警模式</el-button>

        </template>
      </playBackPlugin>
    </div>
    <div class="right-contain">
      <div class="right-header">
        <div style="display: flex;justify-content: flex-start;flex:1; background:rgba(246,250,255,1);border-left:1px solid #E1E1E1">
          <div class="right-header-btn"
               style="width: 120px"
               v-for="item in headerArray"
               :key="item.title"
               @click="item.clickFuc"
               :class="{active:item.level===actHeaderBtn}">
            <div class="statistics">
              <span style="color:#F21E1E">{{item.count}}</span>
              <span>/</span>
              <span>{{item.totalCount}}</span>
            </div>
            <div class="title">{{item.title}}</div>
          </div>
        </div>
        <div class="right-header-btn-stop"
             @click="stopResiveAlarm">
          <div class="statistics">
            <span class="iconfont"
                  v-show="stopResiveStatas">&#xe666;</span>
            <span class="iconfont"
                  v-show="!stopResiveStatas">&#xe64d;</span>
          </div>
          <div class="title"
               v-show="!stopResiveStatas">暂停处理</div>
          <div class="title"
               v-show="stopResiveStatas">恢复处理</div>
        </div>
      </div>
      <div class="right-btn-box">
        <div class="btn-group">
          <el-button size="mini"
                     type="primary"
                     @click="bulkDealFuc"
                     :disabled="selectionTableData.length===0">批量处理</el-button>
          <el-button size="mini"
                     @click="removeDealList"
                     :disabled="selectionTableData.length===0">移除</el-button>

          <el-button size="mini"
                     :disabled="selectionTableData.length===0"
                     @click="alarmPushDialogVisible=true">报警推送</el-button>

          <el-button size="mini"
                     @click="getAlarmReceiveListFuc('total')"
                     type="danger">报警总数:{{Statistics.total}}</el-button>
          <el-button size="mini"
                     type="primary"
                     plain
                     @click="getAlarmReceiveListFuc('已处理')">已处理：{{Statistics.deal}}</el-button>
          <el-button size="mini"
                     type="primary"
                     plain
                     @click="getAlarmReceiveListFuc('未处理')">未处理：{{Statistics.nodeal}}</el-button>
        </div>
      </div>
      <div class="right-table-box"
           ref="tableDom">
        <div v-show='acceptancebtnsActive===2'>
          <el-table ref="singleTable"
                    v-loading="loading"
                    v-if="tableHeight!==0"
                    :data="tableData"
                    style="width: 100%"
                    :height="tableHeight"
                    border
                    stripe
                    resizable="false"
                    lazy
                    :load="loadFuc"
                    @row-dblclick='preview'
                    @selection-change="selectionChange"
                    highlight-current-row
                    @current-change="rowClick">
            <el-table-column type="selection"
                             center
                             width="45">
            </el-table-column>
            <el-table-column prop="order"
                             label="序号"
                             width="45"
                             center></el-table-column>
            <el-table-column prop="mergeNo"
                             label="合并"
                             width="50"></el-table-column>
            <el-table-column label="报警等级"
                             width="70">
              <template slot-scope="scope">
                <div>
                  <span :style="{background: colorBox[scope.row.level-1]}"
                        style="display: inline-block;width: 10px;height: 10px;"></span>
                  <span>{{levelName[scope.row.level-1]}}</span>
                </div>

              </template>
            </el-table-column>
            <el-table-column prop="orgName"
                             label="所属机构"
                             width="120"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="locationName"
                             show-overflow-tooltip
                             label="所属部位"
                             width="120"></el-table-column>
            <el-table-column prop="deviceName"
                             show-overflow-tooltip
                             label="所属设备"
                             width="190"></el-table-column>
            <el-table-column prop="dealStateName"
                             label="处理状态"
                             width="70"></el-table-column>

            <el-table-column prop="alarmName"
                             show-overflow-tooltip
                             label="报警名称"
                             width="200"></el-table-column>
            <el-table-column prop="startTime"
                             label="发生时间"
                             show-overflow-tooltip
                             width="130"></el-table-column>

            <!-- <el-table-column prop="alarmStateName"
                             label="报警状态"
                             width="70"></el-table-column> -->
            <el-table-column prop="alarmTypeName"
                             show-overflow-tooltip
                             label="报警分类"
                             width="80"></el-table-column>
            <!--                    <el-table-column prop="zip" label="对讲等级" width="120"></el-table-column>-->
            <el-table-column prop="alarmSource"
                             label="报警来源"
                             show-overflow-tooltip
                             width="80"></el-table-column>
            <el-table-column prop="talkRequestName"
                             label="对讲请求"
                             width="70"></el-table-column>

          </el-table>
        </div>
        <div v-show='acceptancebtnsActive===1'>
          <el-table ref="singleTableRealTime"
                    v-if="tableHeight!==0"
                    :data="tableDataRealtime"
                    style="width: 100%"
                    :height="tableHeight"
                    border
                    stripe
                    resizable="false"
                    lazy
                    @row-dblclick='preview'
                    @selection-change="selectionChange"
                    highlight-current-row
                    @current-change="rowClick">
            <el-table-column type="selection"
                             center
                             width="45">
            </el-table-column>
            <el-table-column prop="order"
                             label="序号"
                             width="45"
                             center></el-table-column>
            <el-table-column prop="mergeNo"
                             label="合并"
                             width="50"></el-table-column>
            <el-table-column label="报警等级"
                             width="70">
              <template slot-scope="scope">
                <div>
                  <span :style="{background: colorBox[scope.row.level-1]}"
                        style="display: inline-block;width: 10px;height: 10px;"></span>
                  <span>{{levelName[scope.row.level-1]}}</span>
                </div>

              </template>
            </el-table-column>
            <el-table-column prop="orgName"
                             label="所属机构"
                             width="120"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="locationName"
                             show-overflow-tooltip
                             label="所属部位"
                             width="120"></el-table-column>
            <el-table-column prop="deviceName"
                             show-overflow-tooltip
                             label="所属设备"
                             width="190"></el-table-column>
            <el-table-column prop="dealStateName"
                             label="处理状态"
                             width="70"></el-table-column>

            <el-table-column prop="alarmName"
                             show-overflow-tooltip
                             label="报警名称"
                             width="200"></el-table-column>
            <el-table-column prop="startTime"
                             label="发生时间"
                             show-overflow-tooltip
                             width="130"></el-table-column>

            <!-- <el-table-column prop="alarmStateName"
                             label="报警状态"
                             width="70"></el-table-column> -->
            <el-table-column prop="alarmTypeName"
                             show-overflow-tooltip
                             label="报警分类"
                             width="80"></el-table-column>
            <!--                    <el-table-column prop="zip" label="对讲等级" width="120"></el-table-column>-->
            <el-table-column prop="alarmSource"
                             label="报警来源"
                             show-overflow-tooltip
                             width="80"></el-table-column>
            <el-table-column prop="talkRequestName"
                             label="对讲请求"
                             width="70"></el-table-column>

          </el-table>
        </div>
        <div class='acceptanceModel'>
          <div class='btn '
               v-for='item in acceptancebtns'
               :key='item.index'
               :class='{active:acceptancebtnsActive===item.index}'
               @click='acceptancebtnsFuc(item)'>{{item.name}}</div>

        </div>
      </div>

      <div class="right-foot-box"
           ref="reghtFootBox"
           :style="{height:rightFootBoxHeight}">
        <div class="drag-box"
             @mousedown="bottomMouseDown">
          <div class="icon"></div>
        </div>
        <el-tabs type="border-card">
          <el-tab-pane label="接警处置">
            <div class="tabs-body">
              <div class="info">
                <div class="title">处理流程</div>
                <div class="content dealFlow">
                  <el-input type="textarea"
                            style="min-height: 150px"
                            v-model="processingFlow"></el-input>
                </div>
              </div>
              <div class="detail">
                <div class="detail-row">
                  <div class="detail-label">
                    <span>机构名称</span>
                  </div>
                  <div class="detail-value">
                    <span>{{rowClickParam&&rowClickParam.orgName}}</span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">
                    <span>重点部位</span>
                  </div>
                  <div class="detail-value">
                    <span>{{rowClickParam&&rowClickParam.locationName}}</span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">
                    <span>报警设备</span>
                  </div>
                  <div class="detail-value">
                    <span>{{rowClickParam&&rowClickParam.deviceName}}</span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">
                    <span>报警类型</span>
                  </div>
                  <div class="detail-value">
                    <span>{{rowClickParam&&rowClickParam.alarmTypeName}}</span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">
                    <span>报警等级</span>
                  </div>
                  <div class="detail-value">
                    <span>{{rowClickParam&&rowClickParam.level}}</span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">
                    <span>报警时间</span>
                  </div>
                  <div class="detail-value">
                    <span>{{rowClickParam&&rowClickParam.startTime}}</span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">
                    <span>当前状态</span>
                  </div>
                  <div class="detail-value">
                    <span>{{rowClickParam&&rowClickParam.dealStateName}}</span>
                  </div>
                </div>
              </div>
              <div class="form-box">
                <div class="form">
                  <form action>
                    <div class="from-group">
                      <div class="label">接收人</div>
                      <div class="input">
                        <el-select size="mini"
                                   v-model="dealSubmit.receivePerson">
                          <el-option :label="item.type"
                                     :value="item.type"
                                     v-for="(item ,index) in tableDataMes"
                                     :key="index"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="from-group">
                      <div class="label">处理类型</div>
                      <div class="input">
                        <el-select size="mini"
                                   v-model="dealSubmit.dealType">
                          <el-option :label="item.dealTypeValue"
                                     :value="item.dealTypeValue"
                                     v-for="(item ,index) in dealList"
                                     :key="index"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="from-group">
                      <div class="label">工单类型</div>
                      <div class="input">
                        <el-select size="mini"
                                   v-model="dealSubmit.workOrderType">
                          <el-option :label="item.dealTypeValue"
                                     :value="item.dealTypeValue"
                                     v-for="(item ,index) in workOrder"
                                     :key="index"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="from-group">
                      <div class="label">处理意见</div>
                      <div class="input">
                        <el-input type="textarea"
                                  style="min-height: 60px"
                                  v-model="dealSubmit.dealOpinion"></el-input>
                      </div>
                    </div>
                    <div class="from-group">
                      <div class="btns">
                        <el-button size="mini"
                                   type="primary"
                                   @click="dealAlarmSubmit('')">提交</el-button>
                        <el-button size="mini">取消</el-button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="部位详情">
            <div class="tabs-body">
              <div class="part-detail">
                <div class="row-label">
                  <div class="label">所属机构</div>
                  <div class="label">重点部位地址</div>
                  <div class="label">重点部位负责人</div>
                  <div class="label">所属机构安保联系人</div>
                  <div class="label">属地派出所名称</div>
                  <div class="label">辖区民警姓名</div>
                </div>
                <div class="row-value">
                  <div class="label">{{importantPart&&importantPart.orgName}}</div>
                  <div class="label">{{importantPart&&importantPart.address}}</div>
                  <div class="label">{{importantPart&&importantPart.principal1}}</div>
                  <div class="label">{{importantPart&&importantPart.principal5}}</div>
                  <div class="label">{{importantPart&&importantPart.policeStation}}</div>
                  <div class="label">{{importantPart&&importantPart.police}}</div>
                </div>
              </div>
              <div class="part-detail">
                <div class="row-label">
                  <div class="label">重点部位名称</div>
                  <div class="label">重点部位电话</div>
                  <div class="label">移动电话</div>
                  <div class="label">移动电话</div>
                  <div class="label">属地派出所电话</div>
                  <div class="label">移动电话</div>
                </div>
                <div class="row-value">
                  <div class="label">{{importantPart&&importantPart.name}}</div>
                  <div class="label">{{importantPart&&importantPart.telephone}}</div>
                  <div class="label">{{importantPart&&importantPart.principalPhone1}}</div>
                  <div class="label">{{importantPart&&importantPart.principalPhone5}}</div>
                  <div class="label">{{importantPart&&importantPart.policeTelephone}}</div>
                  <div class="label">{{importantPart&&importantPart.policeMobilePhone}}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="联动控制">
            <div class="tabs-body tabs-body-link"
                 v-if="linkData.length">
              <div class="link-modal"
                   v-for="(item,index) in linkData"
                   :key="index">
                <div class="left-icon">
                  <span class="iconfont"
                        :class="item&&item.icon"></span>
                </div>
                <div class="right-btns">
                  <div class="title">{{item.name}}</div>
                  <div class="btns">
                    <el-button size="mini"
                               v-for="(btn, btnIndex) in item.btns"
                               :key="btnIndex"
                               :type="btn.type"
                               :disabled="!btn.show"
                               @click="btn.callback(btn.params,index,btnIndex)">{{btn.tit}}</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="短信联动">
            <div class="tabs-body">
              <div class="send-mes-box">
                <div class="send-btn">
                  <el-button size="mini"
                             type="primary"
                             @click="sendMsgFuc">发送短信</el-button>
                </div>
                <div class="table-box">
                  <el-table :data="tableDataMes"
                            style="width: 100%"
                            border
                            stripe
                            @selection-change="messageSelectionChange"
                            resizable="false"
                            height="150">
                    <el-table-column type="selection"
                                     width="55"></el-table-column>
                    <el-table-column prop="order"
                                     label="序号"
                                     width="120"></el-table-column>
                    <el-table-column prop="type"
                                     label="人员类型"
                                     width="120"></el-table-column>
                    <el-table-column prop="principal"
                                     label="姓名"
                                     width="120"></el-table-column>
                    <el-table-column prop="phone"
                                     label="电话"
                                     width="220"></el-table-column>
                    <el-table-column prop="zip"
                                     label="操作"
                                     width></el-table-column>
                  </el-table>
                </div>

              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="trouble-shooting">
          <!-- <div class='repairiconfont'>
            <span class="iconfont ">&#xe732;</span>
            <div class='repair'>
              <div>故障报修</div>
            </div>
          </div>-->
        </div>
        <div class='audioPlay'>
          <audio id="audio"
                 ref='audioDom'
                 autoplay="autoplay">
            <source :src="audioPlayUrl" />
          </audio>
        </div>
      </div>
    </div>
    <!--      批量处理弹窗-->
    <div>
      <el-dialog title="处理类型"
                 :visible.sync="bulkDealdialogVisible"
                 width="20%"
                 :before-close="bulkDealHandleClose">
        <div class="form">
          <form action>
            <div class="from-group">
              <div class="label">接收人</div>
              <div class="input">
                <el-select size="mini"
                           v-model="dealSubmit.receivePerson">
                  <el-option :label="item.type"
                             :value="item.type"
                             v-for="(item ,index) in tableDataMes"
                             :key="index"></el-option>
                </el-select>
              </div>
            </div>
            <div class="from-group">
              <div class="label">处理类型</div>
              <div class="input">
                <el-select size="mini"
                           v-model="dealSubmit.dealType">
                  <el-option :label="item.dealTypeValue"
                             :value="item.dealTypeValue"
                             v-for="(item ,index) in dealList"
                             :key="index"></el-option>
                </el-select>
              </div>
            </div>
            <div class="from-group">
              <div class="label">工单类型</div>
              <div class="input">
                <el-select size="mini"
                           v-model="dealSubmit.workOrderType">
                  <el-option :label="item.dealTypeValue"
                             :value="item.dealTypeValue"
                             v-for="(item ,index) in workOrder"
                             :key="index"></el-option>
                </el-select>
              </div>
            </div>
            <div class="from-group">
              <div class="label">处理意见</div>
              <div class="input">
                <el-input type="textarea"
                          v-model="dealSubmit.dealOpinion"></el-input>
              </div>
            </div>
            <div class="from-group">
              <div class="btns">
                <el-button size="mini"
                           type="primary"
                           @click="dealAlarmSubmit('batch')">提交</el-button>
                <el-button size="mini"
                           @click="bulkDealHandleClose">取消</el-button>
              </div>
            </div>
          </form>
        </div>
      </el-dialog>
    </div>
    <!--        删除报警-->
    <div>
      <el-dialog title="删除报警"
                 :visible.sync="deletedialogVisible"
                 width="20%"
                 center
                 :before-close="deleteHandleClose">
        <span>是否确认.移除所选报警信息？</span>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="deleteHandleClose"
                     style="height: 40px">取 消</el-button>
          <el-button type="primary"
                     @click="deleteHandleFuc">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title
                 :visible.sync="deletedialogVisibleSecend"
                 width="20%"
                 center
                 :before-close="deleteHandleCloseSecend">
        <span>请确认是否放弃.移除？</span>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="deleteHandleCloseSecend"
                     style="height: 40px">取 消</el-button>
          <el-button type="primary"
                     @click="deleteHandleFucSecend">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!--        重点关注资源-->
    <div>
      <el-dialog title="重点关注资源"
                 :visible.sync="focusResourcesdialogVisible"
                 width="40%">
        <div class="focus-resources-dialog">
          <div class="focus-resources-left">
            <!-- <treeLazy :getApi='()=>{return "alarm-manage/v1/alarm-host/orgHostTree"}'></treeLazy> -->
            <treeBox :options="orgOptions"
                     :lazyTreeApi="getApi"
                     treeType="0"
                     @onceClick="onceClick"
                     :customizeQuery="customizeQuery"
                     treeLazyToggle
                     iconToggle></treeBox>
          </div>
          <div class="focus-resources-center">
            <div @click="toRightFuc">
              <i class="el-icon-arrow-right"></i>
            </div>
            <div @click="toLeftFuc">
              <i class="el-icon-arrow-left"></i>
            </div>
          </div>
          <div class="focus-resources-right">
            <el-table v-if="tableHeight!==0"
                      :data="resources"
                      style="width: 100%"
                      @selection-change="selectionFocus"
                      height="400">
              <el-table-column type="selection"
                               width="55"></el-table-column>
              <el-table-column prop="content"
                               label="资源内容"
                               width="330"></el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="focusResourcesdialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="focusResourcesHandleFuc">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!--        报警推送-->
    <div>
      <el-dialog title="报警升级推送"
                 :visible.sync="alarmPushDialogVisible"
                 width="20%"
                 center
                 :before-close="alarmPushHandleClose">
        <span>请确定发送所选报警到带班长处理吗？</span>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="alarmPushDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="alarmPushHandleFuc">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!--      发送短信弹窗-->
    <div>
      <el-dialog title="发送短信"
                 :visible.sync="sendMsgdialogVisible"
                 width="20%"
                 :before-close="sendMsgHandleClose">
        <div class="form">
          <form action="">
            <div class="from-group">
              <div class="label">目标手机</div>
              <div class="input">
                <el-input placeholder=""
                          size="mini"
                          v-model="sendSMSParam.MSG_SMS_MBLPH_NO"></el-input>
              </div>
            </div>
            <div class="from-group">
              <div class="label">短信内容</div>
              <div class="input">
                <el-input type="textarea"
                          v-model="sendSMSParam.MSG_SMS_CNTNT"></el-input>
              </div>
            </div>
            <div class="from-group">
              <div class="btns">
                <el-button size="mini"
                           type="primary"
                           @click="postSendSMSFuc">发送短信</el-button>
                <el-button size="mini"
                           @click="sendMsgHandleClose">取消</el-button>
              </div>
            </div>
          </form>

        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import linkageConfig from './linkage_config'
import videoRelevant from './videoRelevant'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import moment from 'moment'
import socket from '../../socket/alarm'
import treeBox from '../../components/tree/treeBox'
import previewPlugin from '../videoManage/preview/school/previewPlugin'
import playBackPlugin from '../../components/alarmPlay/playBackPlugin/playBackPlugin'
export default {
  name: 'alarmEmergencyResponse',
  components: {
    previewPlugin,
    treeBox,
    playBackPlugin
  },
  data() {
    return {
      audioPlayUrl: '',
      audioPlayUrlArray: [],
      audioPlayUrlArrayCheck: [],
      tableDataRealtime: [],
      acceptancebtns: [
        {
          name: '实时报警',
          index: 1
        },
        {
          name: '历史报警',
          index: 2
        }
      ],
      acceptancebtnsActive: 2,
      policyConfiguration: [],
      locationIdObj: {
        locationId: '',
        deviceId: '',
        channelId: ''
      },
      previewData: [],
      isDbClickEmit: false,
      currentSelectObj: {
        name: 'sfsfs'
      },
      isBackVideo: false,
      iconShowParams: [
        {
          type: 'left',
          index: 0,
          name: 'ScreenShot'
        },
        {
          type: 'left',
          index: 1,
          name: 'Videotape'
        },
        {
          type: 'left',
          index: 2,
          name: 'Speech'
        },
        {
          type: 'left',
          name: 'NiaoKan',
          index: 3
        },
        {
          type: 'left',
          index: 4,
          name: 'Lunxun'
        },
        {
          type: 'left',
          name: 'Attention',
          index: 5
        },
        {
          type: 'left',
          name: 'checkRecode',
          index: 6
        },
        {
          type: 'left',
          index: 7,
          name: 'Collect'
        },
        {
          type: 'left',
          name: 'Volume',
          index: 8
        },
        {
          type: 'right',
          name: 'FullScreen',
          index: 0
        },
        {
          type: 'right',
          name: 'MultiScreen',
          index: 1
        },
        {
          type: 'right',
          name: 'ViewPattern',
          index: 2
        },
        {
          type: 'right',
          name: 'Stream',
          index: 3
        },
        {
          type: 'right',
          name: 'StopAll',
          index: 4
        },
        {
          type: 'right',
          name: 'Stop',
          index: 5
        },
        {
          type: 'right',
          name: 'Page',
          index: 6
        }
      ],
      iconShowParams1: [
        {
          type: 'left',
          name: 'ScreenShot',
          index: 0
        },
        {
          type: 'left',
          index: 1,
          name: 'Stop'
        },
        {
          type: 'left',
          index: 2,
          name: 'StopAll'
        },
        {
          type: 'left',
          index: 4,
          name: 'NiaoKan'
        },
        {
          type: 'left',
          index: 5,
          name: 'PlayBack'
        },
        {
          type: 'left',
          index: 6,
          name: 'ScreenMode'
        },
        {
          type: 'left',
          index: 7,
          name: 'MultiScreen'
        },
        {
          type: 'left',
          index: 8,
          name: 'FullScreen'
        },
        {
          type: 'left',
          index: 9,
          name: 'Volume'
        },
        {
          type: 'right',
          // name: 'FullScreen',
          slotName: 'backBtn',
          index: 0
        }
      ],

      rightFootBoxHeight: '270px',
      reghtFootBoxDom: null,
      orgOptions: {
        showNoneData: false,
        isMapDate: false,
        search: {
          onlyLeaf: true
        }
      },
      // 请求树接口入参
      customizeQuery: {
        params: {
          subSystem: '2',
          isRecursion: '0' // 显示子机构  选中传1 不选中传0
        }
      },
      Statistics: {
        deal: 0,
        nodeal: 0,
        focus: 0,
        total: 0
      },
      processingFlow: '', // 出來流程
      colorBox: [], // 报警等级颜色
      sendSMSParam: {
        MSG_SMS_MBLPH_NO: '',
        MSG_SMS_CNTNT: ''
      },
      // stopResiveStatas: false,
      filterVisible: false, // 过滤取消
      headerArray: [
        {
          title: '本级报警',
          totalCount: 0,
          count: 1,
          clickFuc: () => {
            return this.getAlarmReceiveListFuc(null, 0)
          },
          level: 0
        },
        {
          title: '一级报警',
          totalCount: 0,
          count: 0,
          clickFuc: () => {
            return this.getAlarmReceiveListFuc(null, 1)
          },
          level: 1
        },
        {
          title: '二级报警',
          totalCount: 0,
          count: 0,
          clickFuc: () => {
            return this.getAlarmReceiveListFuc(null, 2)
          },
          level: 2
        },

        {
          title: '上级报警',
          totalCount: 0,
          count: 0,
          level: 6,
          clickFuc: () => {
            return this.getAlarmReceiveListFuc(null, 6)
          }
        }
      ],
      actHeaderBtn: null,
      tableData: [],
      tableCopyData: [], // 用于过滤保存元数据
      selectionTableData: [], // 选中的表格数据
      tableDataMes: [],
      tableHeight: 0,
      scrollTableHeight: 0,
      linkData: [],
      bulkDealdialogVisible: false, // 批量操作弹窗
      deletedialogVisible: false, // 删除弹窗
      deletedialogVisibleSecend: false, // 删除弹窗
      focusResourcesdialogVisible: false, // 重点关注资源
      sendMsgdialogVisible: false, // 发送短信
      alarmPushDialogVisible: false, // 报警推送升级
      loading: false,
      filterForm: {
        type: ['入侵报警', '门禁报警', '对讲报警', '智能报警', '出入口报警', '停车场报警', '视频报警']
      },
      dealSubmit: {
        // 处置接口
        dealType: null,
        receivePerson: null,
        alarmType: '',
        alarmTypeName: '',
        workOrderType: '',
        dealOpinion: ''
      },
      dealList: [],
      rowClickParam: {},
      setIntervalObj: null,
      setTimeoutObj: null,
      ids: [], // 报警推送时，保存时间内相同通道id
      importantPart: {
        orgId: '', // 机构
        name: '', // 属地派出所名称
        address: '', // 重点部位地址
        telephone: '', // 重点部位电话
        principal1: '', // 重点部位负责人
        principalPhone1: '', // 移动电话
        principal5: '', // 所属机构安保联系人
        principalPhone5: '', // 移动电话
        policeStation: '', // 属地派出所名称
        policeTelephone: '', // 属地派出所电话
        police: '', // 辖区民警姓名
        policeMobilePhone: '' // 移动电话
      },
      scrollParam: {}, // 滚动的参数
      countParam: {}, // 统计参数
      scrollStatus: true, // 滚动状态
      resources: [], // 重点关注资源容器
      resourceSave: {}, // 点击资源树暂时保存数据
      rightFocusIdBox: [], // 重点资源存放选择id
      focusRightObj: [], // 重点关注资源右侧
      focusLeftObj: [], // 重点关注资源左侧
      ReceiveListParam: {
        pageSize: 200,
        pageNum: 1,
        startTime: moment()
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      levelName: ['一级', '二级', '三级', '四级', '五级'],
      messageSelect: [],
      workOrder: [],
      audioDom: null
    }
  },
  mixins: [linkageConfig, videoRelevant],
  watch: {
    alarmDealTableData: (newValue, oldVlaue) => {
      console.log(newValue)
    }
  },
  computed: {
    ...mapState('alarmEmergencyResponse', {
      alarmDealTableData: 'alarmDealTableData'
    }),
    ...mapGetters('alarmEmergencyResponse', ['stopResiveStatas'])
  },
  created() {
    // console.log(sessionStorage.getItem('markAddress'))
    this.findCountFuc() // 统计
    this.getAlarmReceiveListFuc()
    this.getPolicyConfigurationFuc() // 获取处置类型
    this.getSmsIpFuc()
    this.getAlarmlinkFuc()
  },
  mounted() {
    this.calculationHeight()
    this.getFocusFuc()
    this.audioDom = this.$refs.audioDom

    // this.linkTransParams()
    //    this.getAlarmReceiveListFuc()
    // 页面初始化成功后，接听socket
    let timeInterval = 1000 * 60 * 5 // 合并数量的报警接受时间区间
    this.setIntervalObj = setInterval(() => {
      let newTime = new Date().getTime()
      for (let i = 0; i < this.ids.length; i++) {
        let item = this.ids[i]
        if (newTime - item.currentTime > timeInterval) {
          for (let j = 0; j < this.tableDataRealtime.length; j++) {
            let val = this.tableDataRealtime[j]
            if (val.isMerge && String(val.deviceId) + String(val.channel) + val.eventTypeName === item.id) {
              // console.log(value.channelId)
              val.isMerge = false
              break
            }
          }
          this.ids.splice(i, 1)
          i--
        }
      }
    }, 10000)
    this.setTimeoutObj = setTimeout(() => {
      socket.on('fireAlarm', data => {
        console.log(data)

        if (this.isDealCheckFuc(data.alarmInfo)) {
          this.socketFuc(data)
        }
        //this.socketFuc(data)
      })
      let scrollDom = document.getElementsByClassName('el-table__body-wrapper')[0]
      console.log(scrollDom)
      this.scrollTableHeight = scrollDom.clientHeight
      scrollDom.addEventListener('scroll', () => {
        let scrollDistance = scrollDom.scrollHeight - scrollDom.scrollTop - this.scrollTableHeight
        if (scrollDistance <= 0) {
          if (!this.scrollStatus) {
            return
          }
          this.scrollParam.pageNum++
          this.scrollStatus = false
          console.log(this.scrollParam)
          this.loading = true
          this.getAlarmReceiveList(this.scrollParam).then(res => {
            let length = this.tableData.length
            if (res.code === 0 && res.data && res.data.results) {
              this.scrollStatus = true
              res.data.results.map((item, index) => {
                item.order = index + 1 + length
                item.mergeNo = item.mergeNo ? item.mergeNo : 1
                item.startTime = moment(new Date(item.startTime)).format('YYYY-MM-DD HH:mm:ss')
                item.dealStateName = this.transName(item.dealState, { 1: '未处理', 2: '已处理', 3: '已升级' })
                item.alarmStateName = this.transName(item.alarmState, { '1': '未结束', '2': '已结束' })
                item.talkRequestName = this.transName(item.talkRequest, { T: '是', F: '否' })
              })
              this.tableData = this.tableData.concat(res.data.results)
              this.tableCopyData = _.assign([], this.tableData)
            }

            this.loading = false
          })
        }
      })
    }, 1000)
  },
  methods: {
    ...mapMutations('alarmEmergencyResponse', {
      PUSH_ALARM_DEAL_TABLE_DATA: 'PUSH_ALARM_DEAL_TABLE_DATA',
      STOP_RESIVE_STATAS: 'STOP_RESIVE_STATAS'
    }),
    ...mapActions('alarmReceive', {
      getSmsIp: 'getSmsIp',
      postStartinTalk: 'postStartinTalk',
      postCloseTalk: 'postCloseTalk'
    }),
    ...mapActions('alarmEmergencyResponse', {
      getAlarmReceiveList: 'getAlarmReceiveList',
      alarmDealSubmit: 'alarmDealSubmit', // 批量处理
      alarmDealRemove: 'alarmDealRemove', // 批量处理
      getShortMessage: 'getShortMessage', // 短信列表
      postSendSMS: 'postSendSMS', // 发送短信
      postOpenDoor: 'postOpenDoor', // 开门
      postCloseDoor: 'postCloseDoor', // 关门
      postTalkDeviceLogin: 'postTalkDeviceLogin', // 登录对讲服务器
      postBeginTalk: 'postBeginTalk', // 开始对讲
      postEndTalk: 'postEndTalk', // 结束对讲
      postSetDevAlarmOutPuOpen: 'postSetDevAlarmOutPuOpen', // 警铃打开
      postSetDevAlarmOutPuClose: 'postSetDevAlarmOutPuClose', // 警铃打开
      postAlarmArmLogin: 'postAlarmArmLogin', // 布防登录
      postAlarmArm: 'postAlarmArm', // 布防
      postAlarmdisarm: 'postAlarmdisarm', // 撤防
      postAlarmclean: 'postAlarmclean', // 消警
      superiorPush: 'superiorPush', // 向上級推送
      findLocationDetail: 'findLocationDetail', // 获取重点部位
      findCount: 'findCount', // 获取统计
      findHostBind: 'findHostBind', // 获取关联关系
      findorgHostTree: 'findorgHostTree', // 重点关注资源
      getstatus: 'getstatus', // 获取布撤防状态
      getMacMessage: 'getMacMessage',
      getFocus: 'getFocus',
      postFocus: 'postFocus',
      putFocus: 'putFocus',
      getGuardLink: 'getGuardLink',
      findHostBindDetector: 'findHostBindDetector',
      getCabinLink: 'getCabinLink',
      findVideoLink: 'findVideoLink'
    }),

    ...mapActions('equipmentConfigManagement', {
      getPolicyConfiguration: 'getPolicyConfiguration',
      getAlarmlink: 'getAlarmlink'
    }),
    acceptancebtnsFuc(data) {
      this.acceptancebtnsActive = data.index
      if (data.index === 2) {
        this.getAlarmReceiveListFuc('refresh')
      }
    },
    // 获取重点资源
    getApi(param) {
      return this.findorgHostTree(param)
    },
    // socket消息处理函数
    socketFuc(data) {
      // 判断是否是过滤报警类型中的报警
      // let isAlarmType = this.filterForm.type.includes(data.alarmTypeCn)
      // if (!isAlarmType) {
      //   return
      // }
      data.alarmInfo.mergeNo = 1
      data.alarmInfo.alarmStateName = '未结束'
      data.alarmInfo.dealStateName = '未处理'
      data.alarmInfo.talkRequestName = '否'
      data.alarmInfo.isMerge = true
      data.alarmInfo.superior = 1
      data.alarmInfo.startTime = moment(Number(data.alarmInfo.startTime) * 1000).format('YYYY-MM-DD HH:mm:ss')

      // 判断此条socket 是否接受
      // let isConbine = _.filter(this.filterForm.type, data.alarmInfo.alarmType)
      this.statisticsTotalFuc(data.alarmInfo) // 统计数据

      if (this.actHeaderBtn && this.actHeaderBtn === parseInt(data.alarmInfo.level)) {
        this.homologousMerging(
          String(data.alarmInfo.deviceId) + String(data.alarmInfo.channel) + data.alarmInfo.eventTypeName,
          this.ids,
          data.alarmInfo
        )
      } else if (!this.actHeaderBtn) {
        if (data.alarmInfo.level > 2 || data.alarmInfo.level < 1) {
          return
        }
        console.log(this.actHeaderBtn)
        console.log(data.alarmInfo.level)
        this.homologousMerging(
          String(data.alarmInfo.deviceId) + String(data.alarmInfo.channel) + data.alarmInfo.eventTypeName,
          this.ids,
          data.alarmInfo
        )
      }
    },
    // socket 推送过来的数据在统计数量总数
    statisticsTotalFuc(data) {
      console.log(data.superior)
      console.log(data.level)
      this.Statistics.total++ // 报警总数相加
      if (data.superior === 1) {
        // 本级
        this.headerArray[0].totalCount++
        this.headerArray[data.level].totalCount++
        this.Statistics.nodeal++
      } else if (data.superior === 2) {
        // 上级
        this.headerArray[6].totalCount++
      }
    },
    isTTS(data) {
      if (this.policyConfiguration && data.level && this.policyConfiguration[data.level - 1].tts === 'T') {
        return true
      } else {
        return false
      }
    },
    // 判断是不是要弹出视频
    isVideoFuc(data) {
      if (this.policyConfiguration[data.level - 1].videoCheck === 'T') {
        return true
      } else {
        return false
      }
    },
    // 判断是不是要复核弹出视频
    isVideoCheckFuc(data) {
      if (this.policyConfiguration.length > 0 && this.policyConfiguration[data.level - 1].videoCheckPopup === 'T') {
        return true
      } else {
        return false
      }
    },
    // 判断是不是要不要到接警处置页面
    isDealCheckFuc(data) {
      if (this.policyConfiguration.length > 0 && this.policyConfiguration[data.level - 1].dealAction === 'T') {
        return true
      } else {
        return false
      }
    },
    findCountFuc(level) {
      let param = {
        startTime: moment()
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        type: '1'
      }
      this.findCount(param).then(res => {
        this.countParam = JSON.parse(res.data.count)
        console.log(this.countParam)
        this.Statistics.total = this.countParam.total
        this.headerArray[0].totalCount = this.countParam.levelLocal
        this.headerArray[0].count = this.countParam.levelLocalDone
        this.headerArray[1].totalCount = this.countParam.level1
        this.headerArray[1].count = this.countParam.level1Done

        this.headerArray[2].totalCount = this.countParam.level2
        this.headerArray[2].count = this.countParam.level2Done
        this.headerArray[3].totalCount = this.countParam.levelUp
        this.headerArray[3].count = this.countParam.levelUpDone
        // this.headerArray[4].totalCount = this.countParam.level4
        // this.headerArray[4].count = this.countParam.level4Done
        // this.headerArray[5].totalCount = this.countParam.level5
        // this.headerArray[5].count = this.countParam.level5Done
        // this.headerArray[6].totalCount = this.countParam.levelUp
        // this.headerArray[6].count = this.countParam.levelUpDone
        this.Statistics.focus = this.countParam.isFocus // 重点关注

        // if (this.actHeaderBtn === 0) {
        //   this.Statistics.deal = this.countParam.levelLocalDone
        //   this.Statistics.nodeal = this.countParam.levelLocalToDo
        // } else if (this.actHeaderBtn === 6) {
        //   this.Statistics.deal = this.countParam.done
        //   this.Statistics.nodeal = this.countParam.toDo
        // } else if (this.actHeaderBtn) {
        //   this.Statistics.deal = this.countParam['level' + this.actHeaderBtn + 'Done']
        //   this.Statistics.nodeal = this.countParam['level' + this.actHeaderBtn + 'ToDo']
        // } else {
        //   this.Statistics.deal = this.countParam.done
        //   this.Statistics.nodeal = this.countParam.toDo
        // }
        this.Statistics.deal = this.countParam.done
        this.Statistics.nodeal = this.countParam.toDo
      })
    },
    // 推送的报警同源数量合并
    homologousMerging(id, ids, data) {
      // 记录探测器id
      // 如果1min内收到的是一个探测器发出的报警，那么只显示一条
      let length = ids.filter(item => {
        return item.id === id
      }).length
      console.log(length)
      if (length) {
        this.tableDataRealtime.map(item => {
          let str = String(item.deviceId) + String(item.channel) + item.eventTypeName
          if (item.isMerge && str === id) {
            console.log('合并')
            let count = item.mergeNo
            // _.assign(item, _.pickBy(data, _.identity))

            item.dealId && item.dealId.length > 0 && item.dealId.push(data.id) // 合并完数量，保存id,处理时批量处理
            item.startTime = data.startTime

            item.mergeNo = count
            item.mergeNo && item.mergeNo++
          }
        })
      } else {
        // 视频弹出,数量合并后默认开一个视频
        if (data.action_dict.cameraInfo) {
          // tts 播报
          if (this.isTTS(data)) {
            this.tts(data.alarmName)
          }
          // 播放报警铃声
          if (this.audioPlayUrlArrayCheck[data.level - 1] === 'T') {
            this.audioPlayUrl = this.audioPlayUrlArray[data.level - 1]
            //this.audioPlayUrl = 'http://10.1.1.70:8010' + this.audioPlayUrlArray[0]

            this.audioDom.src = this.audioPlayUrl
            this.audioDom.play()
            console.log(this.audioPlayUrl)
          }

          console.log(data)
          if (data.action_dict && data.action_dict.cameraInfo && data.action_dict.cameraInfo[0]) {
            if (this.isVideoFuc(data)) {
              this.socketPreview(data.action_dict.cameraInfo[0], data)
            }
          }
        }

        this.ids.push({
          id: String(data.deviceId) + String(data.channel) + data.eventTypeName,
          currentTime: new Date().getTime() // 获取当前时间
        })
        data['order'] = this.tableData.length + 1
        data.dealId = [data.id]
        this.tableDataRealtime.unshift(data)
        this.tableDataRealtime = this.tableDataRealtime.slice(0, 50)
        this.tableDataRealtime.map((item, index) => {
          item.alarmSource =
            parseInt(item.superior) === 1 ? '本级报警' : parseInt(item.superior) === 2 ? '上级报警' : ''
          item.order = index + 1
        })
        // this.tableData = _.assign([], this.this.tableData)
        console.log(this.tableData)
      }
    },
    bottomMouseDown() {
      this.reghtFootBoxDom = this.$refs.reghtFootBox
      console.log(this.reghtFootBoxDom)

      document.addEventListener('mousemove', this.caluFUC)
      document.addEventListener('mouseup', tar => {
        document.removeEventListener('mousemove', this.caluFUC)
      })
    },
    caluFUC(tar) {
      if (this.reghtFootBoxDom) {
        let height = this.reghtFootBoxDom.clientHeight - tar.movementY
        console.log(height)
        if (height < 270) {
          return
        }
        if (height > 430) {
          return
        }
        this.rightFootBoxHeight = height + 'px'
        this.tableHeight = this.tableHeight + tar.movementY
      }
    },
    calculationHeight() {
      let tableDom = this.$refs.tableDom
      //  减去tableDom padding的宽度
      setTimeout(() => {
        this.tableHeight = tableDom.clientHeight - 10
      }, 30)
    },
    // 联动控制中转换参数
    linkTransParams(host) {
      this.linkData.map(item => {
        _.merge(item, this.linkage[item.typeName])
        // 门禁参数赋值
        if (item.typeName === 'guard') {
          // item.btns[0].params.hostId = item.hostUniq
          // item.btns[0].params.devIp = item.platformIp
          // item.btns[0].params.devPort = item.platformPort
          // item.btns[0].params.channelId = item.uniqueId
          // item.btns[1].params.hostId = item.hostUniq
          // item.btns[1].params.devIp = item.platformIp
          // item.btns[1].params.devPort = item.platformPort
          // item.btns[1].params.channelId = item.uniqueId
          item.btns[0].params.guardId = item.id
          item.btns[1].params.guardId = item.id
        } else if (item.typeName === 'audio') {
          // 对讲
          if (item && item.type === 1) {
            item.btns[0].params.calld.calledpanelIds = item.id
            delete item.btns[0].params.calld.calledMikeIds
          } else if (item.type === 2) {
            item.btns[0].params.calld.calledMikeIds = item.id
            delete item.btns[0].params.calld.calledpanelIds
          }
          // item.btns[0].params.talk.serverId = item.host && item.host.platform && item.host.platform.id
          // item.btns[0].params.talk.serverIp = item.host && item.host.platform && item.host.platform.ip
          // item.btns[0].params.talk.serverPort = item.host && item.host.platform && item.host.platform.port
          // item.btns[0].params.talk.callerPanelInfo.hostIp = item.host && item.host.ip
          // item.btns[0].params.talk.callerPanelInfo.hostPort = item.host && item.host.port
          // item.btns[0].params.talk.callerPanelInfo.hostId = (item.host && item.host.id) || item.deviceId // 这两个应该是同一个id
          // item.btns[0].params.talk.callerPanelInfo.id = item.id
        } else if (item.typeName === 'output') {
          item.btns[0].params.devIp = (host && host.ip) || item.deviceIp
          item.btns[0].params.devPort = (host && host.port) || item.devicePort
          item.btns[0].params.outputNo = parseInt(item.serialNumber) || parseInt(item.serise)
          item.btns[1].params.devIp = (host && host.ip) || item.deviceIp
          item.btns[1].params.devPort = (host && host.port) || item.devicePort
          item.btns[1].params.outputNo = parseInt(item.serialNumber) || parseInt(item.serise)
          // item.btns[0].params.hostId = item.alarmHostId || item.deviceId
          // item.btns[1].params.hostId = item.alarmHostId || item.deviceId
        }
      })
      console.log(this.linkData)
      // 获取布撤防状态
      if (host) {
        this.getstatusFuc(host)
      }
    },
    combineFuc(data) {
      data.audio &&
        data.audio.map(item => {
          return (item['typeName'] = 'audio')
        })
      data.guard &&
        data.guard.map(item => {
          return (item['typeName'] = 'guard')
        })
      data.outChannel &&
        data.outChannel.map(item => {
          return (item['typeName'] = 'output')
        })
      data.output &&
        data.output.map(item => {
          return (item['typeName'] = 'output')
        })
      if (data.alarmHostInfo) {
        data.alarmHostInfo['typeName'] = 'alarm'
      }

      this.linkData = this.linkData
        .concat(data.audio)
        .concat(data.guard)
        .concat(data.outChannel)
        .concat(data.output)
      this.linkData = _.compact(this.linkData)
      // if (data.alarmHostInfo) {
      //   data.alarmHostInfo['typeName'] = 'alarm'
      //   this.linkData = this.linkData.concat([data.alarmHostInfo])
      // }
      // if(data.subSystemList&&data.subSystemList.length>0){
      //   data['typeName'] = 'alarm'
      //   this.linkData = this.linkData.concat([data])
      // }
      if (data.subSystemList && data.subSystemList.length > 0) {
        if (data.alarmHostInfo) {
          data.alarmHostInfo['typeName'] = 'alarm'
          data.alarmHostInfo['subSystemList'] = data.subSystemList
          this.linkData = this.linkData.concat([data.alarmHostInfo])
          this.linkTransParams(data.alarmHostInfo)
        } else {
          data['typeName'] = 'alarm'
          this.linkData = this.linkData.concat([data])
          this.linkTransParams(data)
        }
      } else {
        this.linkTransParams()
      }

      return new Promise((resolve, reject) => {
        resolve(data.video)
      })
    },
    findHostBindFuc(payload) {
      this.linkData = []
      return this.findHostBind(payload).then(res => {
        if (res.code === 0 && res.data) {
          return this.combineFuc(res.data)
        }
      })
    },
    // 获取布撤防状态
    getstatusFuc(host) {
      let param = {
        devIp: host.ip,
        devPort: host.port,
        subSystems: []
        //  subSystems:_.map(host.subSystem,_.pick())
      }
      let cleanParam = {
        devIp: host.ip,
        devPort: host.port
        // subSystems: []
      }
      let paramArm = {
        devIp: host.ip,
        devPort: host.port,
        subSystem: []
      }
      let paramLogin = {
        devIp: host.ip,
        devPort: host.port,
        username: host.userName,
        passwd: String(host.password),
        vendor: 'HIKVISION',
        devType: host.deviceType,
        devBaseType: host.deviceType,
        connMode: 'active',
        version: '1',
        daServerId: host.service
      }

      host.subsystem.map(item => {
        let zoneList = []
        let obj = {
          subSystem: item.serialNumber,
          zoneList
        }
        paramArm.subSystem.push(item.serialNumber)
        item.detector &&
          item.detector.map(res => {
            zoneList.push(res.serialNumber)
          })
        param.subSystems.push(obj)
      })
      this.getstatus(param).then(res => {
        if (res) {
          let subStatus = res.data && res.data.results && res.data.results.subSystemList[0].subStatus
          this.linkData.map(item => {
            if (item.typeName === 'alarm') {
              if (subStatus === 'disarm') {
                item.btns[1].show = false
              } else if (subStatus === 'arm') {
                item.btns[0].show = false
              }

              item.btns[0].params.operation = paramArm
              item.btns[0].params.login = paramLogin
              item.btns[1].params.login = paramLogin
              item.btns[1].params.operation = paramArm
              item.btns[2].params.login = paramLogin
              item.btns[2].params.operation = cleanParam
            }
          })
          this.linkData = _.assign([], this.linkData)
        }
      })
    },
    // 批量处理
    bulkDealFuc() {
      if (this.selectionTableData.length < 1) {
        this.$message({
          message: '请先选择数据',
          type: 'success'
        })
      } else {
        this.bulkDealdialogVisible = true
      }
    },
    // 批量处理回调
    bulkDealHandleClose() {
      this.bulkDealdialogVisible = false
    },
    // 获取参数配置
    getAlarmlinkFuc() {
      let that = this
      Promise.all([this.getAlarmlink({ level: '1' }), this.getAlarmlink({ level: '2' })]).then(res => {
        if (res) {
          res.map(item => {
            if (item.data && item.data.results && item.data.results.length > 0) {
              that.policyConfiguration.push(item.data.results[0])
            }
          })
        }
      })
    },
    // 获取策略配置列表
    getPolicyConfigurationFuc() {
      this.getPolicyConfiguration().then(res => {
        if (res) {
          let data = res.data.results && res.data.results[0]
          this.dealList = JSON.parse(data.alarmType)
          this.workOrder = JSON.parse(data.workOrderType)
          this.colorBox.push(data.color1)
          this.colorBox.push(data.color2)
          this.audioPlayUrlArray = [data.soundFile1, data.soundFile2]
          this.audioPlayUrlArrayCheck = [data.sound1, data.sound2]
        }
      })
    },
    tts(msgs) {
      const msg = new SpeechSynthesisUtterance(msgs)
      msg.volume = 100
      msg.rate = 1
      msg.pitch = 1.5

      window.speechSynthesis.speak(msg)
    },
    // 批量报警处置，报警处置提交
    dealAlarmSubmit(type) {
      let ids = []
      if (type === 'batch') {
        if (this.selectionTableData.length === 0) {
          this.$message({
            message: '请先选择数据',
            type: 'success'
          })
          return
        }
        if (!this.dealSubmit.dealType) {
          this.$message({
            message: '请先选择处置类型',
            type: 'info'
          })
          return
        }
        // console.log(this.selectionTableData)
        this.selectionTableData.map(item => {
          if (item.dealId) {
            ids.push.apply(ids, item.dealId)
            // console.log(ids)
          } else {
            if (item.id) {
              ids.push(item.id)
            }
          }
        })
      } else {
        if (!this.rowClickParam.id) {
          this.$message({
            message: '请先选择数据',
            type: 'info'
          })
          return
        }
        if (!this.dealSubmit.dealType) {
          this.$message({
            message: '请先选择处置类型',
            type: 'info'
          })
          return
        }
        if (this.rowClickParam && this.rowClickParam.dealId) {
          ids = _.assign(ids, this.rowClickParam.dealId) // 有合并数据一次处理
        } else {
          ids = [this.rowClickParam.id]
        }
      }
      let param = {
        ids,
        dealType: this.dealSubmit.dealType,
        receivePerson: this.dealSubmit.receivePerson,
        workOrderType: this.dealSubmit.workOrderType,
        dealOpinion: this.dealSubmit.dealOpinion,
        dealState: 2
      }
      this.alarmDealSubmit(param).then(res => {
        // 处理后页面会清除此数据，需要合并的数据也要清空
        console.log(this.selectionTableData)
        console.log(this.ids)
        if (this.selectionTableData.length > 0) {
          for (let j = 0; j < this.selectionTableData.length; j++) {
            for (let i = 0; i < this.ids.length; i++) {
              if (
                this.ids[i].id ===
                String(this.selectionTableData[j].deviceId) +
                  String(this.selectionTableData[j].channel) +
                  this.selectionTableData[j].eventTypeName
              ) {
                this.ids.splice(i, 1)
              }
            }
          }
        } else {
          let index = this.ids.findIndex(item => {
            return (
              item.id ===
              String(this.rowClickParam.deviceId) +
                String(this.rowClickParam.channel) +
                this.rowClickParam.eventTypeName
            )
          })
          this.ids.splice(index, 1)
        }
        console.log('this.ids2')
        console.log(this.ids)
        if (res && res.code === 0) {
          this.bulkDealdialogVisible = false
          this.dealSubmit = {
            // 处置接口
            dealType: null,
            receivePerson: '',
            workOrderType: '',
            dealOpinion: ''
          }
          this.dealSuccessFuc(ids)
          if (type === 'batch') {
            this.$refs.preview.alarmStopPreview(this.selectionTableData) // 关流
          } else {
            this.$refs.preview.alarmStopPreview([this.rowClickParam]) // 关流
          }

          this.$message({
            message: '提交成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '提交失败',
            type: 'error'
          })
        }
      })
    },
    // 处置后改变状态
    dealSuccessFuc(ids) {
      if (this.acceptancebtnsActive === 1) {
        for (let i = 0; i < this.tableDataRealtime.length; i++) {
          let item = this.tableDataRealtime[i]
          if (ids.includes(item.id)) {
            this.tableDataRealtime.splice(i, 1)
            i--
          }
        }
      } else {
        this.getAlarmReceiveListFuc('refresh')
        // this.tableData.map(item => {
        //   if (ids.includes(item.id)) {
        //     item.dealStateName = '已处理'
        //     item.dealState = 2
        //   }
        // })
        // this.selectionTableData = []
        // this.tableData = _.assign(
        //   [],
        //   this.tableData.sort((a, b) => {
        //     return parseInt(a.dealState) - parseInt(b.dealState)
        //   })
        // )
        // this.tableCopyData = _.assign([], this.tableData)
      }
    },

    messageSelectionChange(data) {
      console.log(data)
      this.messageSelect = data
    },
    // 移除
    removeDealList() {
      if (this.selectionTableData.length < 1) {
        this.$message({
          message: '请先选择数据',
          type: 'success'
        })
      } else {
        this.deletedialogVisible = true
      }
    },
    // 删除回调
    deleteHandleClose() {
      this.deletedialogVisibleSecend = true
      this.deletedialogVisible = false
    },
    // 删除回调
    deleteHandleCloseSecend() {
      this.deletedialogVisibleSecend = false
      this.deletedialogVisible = true
    },
    // 二次确认移除放弃
    deleteHandleFucSecend() {
      this.deletedialogVisibleSecend = false
      this.deletedialogVisible = false
    },
    // // 确认删除
    // deleteHandleFuc() {
    //   let ids = []
    //   this.selectionTableData.map(item => {
    //     if (item.id) {
    //       ids.push(item.id)
    //     }
    //   })
    //   var param = {
    //     ids
    //   }
    //   this.alarmDealRemove(param).then(res => {
    //     if (res) {
    //       this.deletedialogVisible = false
    //       this.deletedialogVisibleSecend = false
    //       this.getAlarmReceiveListFuc('refresh')
    //       this.closeVideo(this.selectionTableData)

    //       this.$message({
    //         message: '删除成功',
    //         type: 'success'
    //       })
    //     }
    //   })
    // },

    deleteHandleFuc() {
      let ids = []
      this.selectionTableData.map(item => {
        if (item.dealId) {
          ids.push.apply(ids, item.dealId)
          console.log(ids)
        } else {
          if (item.id) {
            ids.push(item.id)
          }
        }
      })
      var param = {
        ids
      }
      this.alarmDealRemove(param).then(res => {
        if (res) {
          if (this.selectionTableData.length > 0) {
            console.log(this.selectionTableData)
            console.log(this.ids)
            for (let j = 0; j < this.selectionTableData.length; j++) {
              for (let i = 0; i < this.ids.length; i++) {
                if (
                  this.ids[i].id ===
                  String(this.selectionTableData[j].deviceId) +
                    String(this.selectionTableData[j].channel) +
                    this.selectionTableData[j].eventTypeName
                ) {
                  this.ids.splice(i, 1)
                }
              }
            }
          } else {
            let index = this.ids.findIndex(item => {
              return (
                item.id ===
                String(this.rowClickParam.deviceId) +
                  String(this.rowClickParam.channel) +
                  this.rowClickParam.eventTypeName
              )
            })
            this.ids.splice(index, 1)
          }

          this.deletedialogVisible = false
          this.deletedialogVisibleSecend = false
          this.dealSuccessFuc(ids)
          this.$refs.preview.alarmStopPreview(this.selectionTableData) // 关流
          this.closeVideo(this.selectionTableData)
          this.$message({
            message: '删除成功',

            type: 'success'
          })
        }
      })
    },
    focusResourcesdialogVisibleFuc() {
      this.focusResourcesdialogVisible = true
      this.focusRightObj = []
      this.focusLeftObj = []
    },
    // 重点关注资源
    focusResourcesHandleClose() {},
    // 重点关注资源点击确认
    focusResourcesHandleFuc() {
      console.log(this.focusRightObj)
      console.log(this.focusLeftObj)

      this.postFocus(this.focusRightObj).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
      this.putFocus(this.focusLeftObj).then(res => {
        if (res.code === 0) {
          this.focusResourcesdialogVisible = false
        }
      })
    },
    // 报警升级推送关闭之前回调
    alarmPushHandleClose(done) {
      done()
      this.alarmPushDialogVisible = false
    },
    // 报警升级确认框
    alarmPushHandleFuc() {
      let ids = _.map(this.selectionTableData, 'id')
      let param = {
        alarmId: JSON.stringify(ids), // 报警信息的唯一标识
        userName: 'requestwebsocket' // 上级的名字  ，先写死，后期权限做完在加此功能
      }
      this.superiorPush(param).then(value => {
        if (value) {
          this.alarmPushDialogVisible = false
        }
      })
    },
    getSmsIpFuc() {
      let param = {
        type: '1',
        org: ''
      }
      this.getSmsIp(param).then(res => {
        if (res) {
          this.SmsIp = res.data
        }
      })
    },
    // 发送短信
    sendMsgFuc() {
      if (this.messageSelect.length < 1) {
        this.$message({
          message: '请选择要发送的手机',
          type: 'info'
        })
        return
      }
      this.sendMsgdialogVisible = true
      let phone = []
      phone = this.messageSelect.map(item => {
        return item.phone
      })
      this.sendSMSParam.MSG_SMS_MBLPH_NO = phone.join(',')
      this.sendSMSParam.MSG_SMS_CNTNT = this.rowClickParam.alarmName
    },
    // 发送短信确认
    postSendSMSFuc() {
      let param = {
        MSG_SMS_MBLPH_NO: this.sendSMSParam.MSG_SMS_MBLPH_NO, // 短消息的手机号
        MSG_SMS_CNTNT_LEN: this.sendSMSParam.MSG_SMS_CNTNT.length, // 短信内容长度
        MSG_SMS_CNTNT: this.sendSMSParam.MSG_SMS_CNTNT, // 短信内容
        MSG_SMS_REALTM_IND: 'ZHBD1', // 通知标志  ZHBD1：需实时发送给客户；ZHBD0：不能在禁发时段发送
        MSG_SMS_SNDR: '' // 短信归属信息 本条短信所属机构，9位一级行行号
      }
      this.postSendSMS({ param: param, url: this.SmsIp }).then(res => {
        if (res && res.code === 0) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })
        }
      })
    },
    // 关闭发送短信弹窗
    sendMsgHandleClose() {
      this.sendMsgdialogVisible = false
    },
    loadFuc(tree, treeNode, resolve) {},
    // 获取报警处置列表
    getAlarmReceiveListFuc(type, lev) {
      console.log(lev)
      this.ReceiveListParam.pageNum = 1
      this.findCountFuc(lev) // 先获取统计
      this.ids = [] // 清空列表中已有id，和ｓｏｃｋｅｔ有關
      if (type) {
        if (type === 'focus') {
          this.actHeaderBtn = null
          delete this.ReceiveListParam.level
          this.ReceiveListParam.isFocus = 'T'
          delete this.ReceiveListParam.dealState
          delete this.ReceiveListParam.superior
        } else if (type === '已处理') {
          this.actHeaderBtn = null
          delete this.ReceiveListParam.level
          delete this.ReceiveListParam.isFocus
          delete this.ReceiveListParam.superior
          this.ReceiveListParam.dealState = 2
        } else if (type === '未处理') {
          delete this.ReceiveListParam.level
          this.actHeaderBtn = null
          delete this.ReceiveListParam.isFocus
          delete this.ReceiveListParam.superior
          this.ReceiveListParam.dealState = 1
        } else if (type === 'refresh') {
          this.actHeaderBtn = null
          delete this.ReceiveListParam.isFocus
          this.ReceiveListParam.pageNum = 1
          this.ReceiveListParam.level = '1,2'
          delete this.ReceiveListParam.superior
          delete this.ReceiveListParam.dealState
        } else if (type === 'total') {
          delete this.ReceiveListParam.isFocus
          this.actHeaderBtn = null

          this.ReceiveListParam.pageNum = 1
          this.ReceiveListParam.level = null
          delete this.ReceiveListParam.dealState

          // this.tableData = []
          // this.tableCopyData = _.assign([], this.tableData)
        }
      } else {
        delete this.ReceiveListParam.isFocus
        this.actHeaderBtn = lev
        delete this.ReceiveListParam.dealState
        delete this.ReceiveListParam.superior
        if (lev === 0) {
          this.ReceiveListParam.level = null
          this.ReceiveListParam.superior = 1
        } else if (lev === 6) {
          this.ReceiveListParam.level = null
          this.ReceiveListParam.superior = 2
        } else if (lev === undefined) {
          this.ReceiveListParam.level = '1,2'
        } else {
          this.ReceiveListParam.level = lev
        }
      }
      this.loading = true
      this.scrollStatus = true // 可滚动
      this.scrollParam = this.ReceiveListParam
      this.getAlarmReceiveList(this.ReceiveListParam).then(res => {
        console.log(res)
        if (res.code === 0 && res.data.results) {
          res.data.results.map((item, index) => {
            item.order = index + 1
            item.mergeNo = item.mergeNo ? item.mergeNo : 1

            item.startTime = moment(item.startTime).format('YYYY-MM-DD HH:mm')
            item.dealStateName = this.transName(item.dealState, { 1: '未处理', 2: '已处理', 3: '已升级' })
            item.alarmStateName = this.transName(item.alarmState, { '1': '未结束', '2': '已结束' })
            item.talkRequestName = this.transName(item.talkRequest, { T: '是', F: '否' })
          })
          this.tableData = res.data.results
          this.rowClickParam = res.data.results[0]
          this.$refs.singleTable.setCurrentRow(this.rowClickParam) // 默認选择第一行
          this.tableCopyData = _.assign([], this.tableData)
          this.loading = false
        } else {
          this.tableData = []
          this.loading = false
        }
      })
    },
    transName(key, obj) {
      return obj[key]
    },
    // 获取部位详情
    findLocationDetailFuc(id) {
      this.findLocationDetail({ locationId: id }).then(res => {
        if (res) {
          if (res.data && res.data.orgData) {
            res.data.orgName = res.data.orgData.name
            this.tableDataMes = [
              { type: '负责人一', principal: res.data.principal1, phone: res.data.principalPhone1, order: 1 },
              { type: '负责人二', principal: res.data.principal2, phone: res.data.principalPhone2, order: 2 },
              { type: '负责人三', principal: res.data.principal3, phone: res.data.principalPhone3, order: 3 },
              { type: '负责人四', principal: res.data.principal4, phone: res.data.principalPhone4, order: 4 },
              { type: '负责人五', principal: res.data.principal5, phone: res.data.principalPhone5, order: 5 }
            ]
          }
          this.importantPart = res.data
        }
      })
    },
    // 过滤确认按钮
    filteronSubmit() {
      console.log(this.filterForm.type)
      if (this.filterForm.type.length === 0) {
        this.tableData = this.tableCopyData
        return
      }
      let data = _.assign([], this.tableCopyData)
      data.map((item, i) => {
        if (this.filterForm.type.indexOf(item.alarmTypeName) === -1) {
          delete data[i]
        }
      })
      this.tableData = data
      this.filterVisible = false
    },

    // 选中项变化
    selectionChange(row) {
      console.log(row)
      this.selectionTableData = row
    },
    // 点击莫一行
    rowClick(row) {
      console.log(row)
      this.locationIdObj.locationId = row.locationId
      this.locationIdObj.deviceId = row.deviceId
      this.locationIdObj.channelId = row.id
      this.$refs.preview.syncChangeCheckedPane(row)
      if (row) {
        this.rowClickParam = row
        this.getLevelDealProcess(row.level)
        this.findLocationDetailFuc(row.locationId)

        if (row.alarmTypeName === '设备报警') {
          if (row.partId && row.partId !== '0') {
            this.getGuardLinkFuc({ id: row.partId, ref: 2 })
          } else {
            this.getGuardLinkFuc({ id: row.deviceId, ref: 1 })
          }
        } else if (row.alarmTypeName === '入侵报警') {
          if (row.resourceId) {
            this.findHostBindDetectorFuc({ id: row.resourceId, ref: 2 })
          } else {
            this.findHostBindFuc({ id: row.deviceId, ref: 1 })
          }
        } else if (row.alarmTypeName === '防护舱报警') {
          if (row.resources) {
            this.getCabinLinkFuc(row.resourceId, { ref: 2 })
          } else {
            this.getCabinLinkFuc(row.deviceId, { ref: 1 })
          }
        } else if (row.alarmTypeName === '视频报警') {
          if (row.resources) {
            this.findVideoLinkFuc(row.resourceId, { ref: 2 })
          } else {
            this.findVideoLinkFuc(row.deviceId, { ref: 1 })
          }
        }
      }
      this.linkData = []
    },

    // 暂停接警
    stopResiveAlarm() {
      this.STOP_RESIVE_STATAS(!this.stopResiveStatas)
      if (this.stopResiveStatas) {
        socket.remove('fireAlarm', data => {
          console.log(data)
        })
      } else {
        socket.on('fireAlarm', data => {
          this.socketFuc(data)
        })
      }
    },
    // // 获取短信列表
    // getShortMessageFuc() {
    //   this.getShortMessage({}).then(res => {
    //     if (res.code === 0) {
    //       res.data.results.map((item, index) => {
    //         item.order = index + 1
    //         item.occuringTime = moment(item.occuringTime).format('yyyy-MM-DD HH:mm')
    //       })
    //       this.tableData1 = res.data.results
    //     }
    //   })
    // },
    // 获取对应等级的处理流程
    getLevelDealProcess(lev) {
      if (!lev) {
        return
      }
      let LevelDealProcess =
        sessionStorage.getItem('LevelDealProcess') && JSON.parse(sessionStorage.getItem('LevelDealProcess'))[lev - 1]
      if (!LevelDealProcess) {
        let param = {
          level: lev
        }
        this.getAlarmlink(param).then(res => {
          if (res) {
            this.processingFlow = res.data.results && res.data.results[0] && res.data.results[0].process
            LevelDealProcess = {}
            LevelDealProcess[lev - 1] = this.processingFlow
            sessionStorage.setItem('LevelDealProcess', JSON.stringify(LevelDealProcess))
          }
        })
      } else {
        this.processingFlow = LevelDealProcess
      }
    },
    // 重点机构树点击
    onceClick(data, node) {
      if (data.tierType === 'res') {
        let orgName = node.parent.parent.data.name
        let locName = node.parent.data.name
        let obj = {
          content: data.name + ' ' + orgName + '>' + locName,
          channelId: data.id,
          deviceId: data.alarmHostId,
          locationId: data.locationId,
          orgId: data.orgId,
          channelName: data.name
        }

        this.resourceSave = obj
      }
    },
    toRightFuc() {
      if (!this.resourceSave) {
        return
      }

      let length = this.resources.filter(item => {
        return parseInt(item.channelId) === parseInt(this.resourceSave.channelId)
      }).length
      console.log(length)
      if (length !== 0) {
      } else {
        this.resources.push(this.resourceSave)
        this.focusRightObj.push(this.resourceSave)
      }
    },
    toLeftFuc() {
      if (this.rightFocusIdBox.length) {
        for (let i = 0; i < this.resources.length; i++) {
          if (this.rightFocusIdBox.includes(this.resources[i].channelId)) {
            this.focusLeftObj.push(JSON.parse(JSON.stringify(this.resources[i])))
            this.resources.splice(i, 1)
            i--
          }
        }
      } else {
        this.$message({
          message: '请先选择要移除的数据',
          type: 'info'
        })
      }
    },

    selectionFocus(row) {
      this.rightFocusIdBox = _.map(row, 'channelId')
    },
    // 获取重点关注资源
    getFocusFuc() {
      this.getFocus().then(res => {
        if (res.code === 0) {
          this.resources = (res.data && res.data.results) || []
        }
      })
    }
  },
  destroyed() {
    console.log('销毁')
    clearInterval(this.setIntervalObj) // 清除定时器
    clearTimeout(this.setTimeoutObj) // 清除定时器
    socket.remove('fireAlarm', data => {
      console.log(data)
    })
  }
}
</script>

<style scoped lang="less">
.containerfire {
  width: 100%;
  height: 100%;
  display: flex;

  .left-contain {
    flex: 1;
  }

  .right-contain {
    width: 1000px;
    border-left: 1px solid #ddd;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .right-header {
      width: 100%;
      height: 74px;
      /*border-bottom: 1px solid #ddd;*/
      display: flex;
      justify-content: space-between;
      padding: 8px 0 0 8px;
      align-items: center;

      .right-header-btn-stop {
        text-align: center;
        width: 120px;
        height: 66px;
        /*background: #f0f0f0;*/
        font-size: 12px;
        cursor: pointer;
        color: #2d72d3;
        .statistics {
          margin-top: 6px;
          .iconfont {
            font-size: 28px !important;
          }
        }

        .title {
        }
      }
      .right-header-btn {
        text-align: center;
        width: 100px;
        height: 66px;
        /*background: #f0f0f0;*/
        font-size: 12px;

        cursor: pointer;

        .statistics {
          margin-top: 12px;
        }

        .title {
        }
      }

      .right-header-btn:hover {
        .statistics {
          color: rgba(45, 114, 211, 1);
        }

        .title {
          color: rgba(45, 114, 211, 1);
        }
      }
      .active {
        color: rgba(45, 114, 211, 1);
        background: #fff;
        border-top: 2px solid #2d72d3;
      }
    }

    .right-btn-box {
      width: 100%;
      height: 50px;
      /*border-bottom: 1px solid #ddd;*/
      display: flex;
      /* .el-button--default{*/
      /*   height: 27px;*/
      /*}*/
      /deep/.el-button + .el-button {
        margin-left: 3px;
        height: 30px;
      }
      /deep/.el-button--mini {
        height: 30px;
      }
      .btn-group {
        height: 40px;
        padding: 12px 5px;
      }
      a {
        color: #409eff;
        background: #ecf5ff;
        border-color: #b3d8ff;
      }
    }

    .right-table-box {
      flex: 1;
      /*border-bottom: 1px solid #ddd;*/
      padding: 5px 9px;
      position: relative;
      .acceptanceModel {
        width: 129;
        height: 38px;
        background: #ffffff;
        position: absolute;
        bottom: -32px;
        right: 9px;
        z-index: 999;
        display: flex;
        .btn {
          width: 60px;
          height: 38px;
          border: 1px solid #dddddd;
          cursor: pointer;

          text-align: center;
          line-height: 38px;
        }
        .btn:first-child {
          border-right: 0;
        }
        .active {
          border-top: 1px solid transparent;
          border-bottom: 2px solid #2d72d3;
          color: #2d72d3;
        }
      }
      .el-table {
        font-size: 12px;
      }
    }

    .right-foot-box {
      width: 100%;
      height: 270px;
      margin-top: 2px;
      overflow: auto;
      position: relative;
      .el-tabs--border-card {
        height: 100%;
      }
      .drag-box {
        position: absolute;
        width: 59px;
        height: 5px;
        background: #cbcbcb;
        left: 426px;
        z-index: 1;
        cursor: pointer;
        display: flex;
        justify-content: center;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        .icon {
          width: 0;
          height: 0;
          border-bottom: 4px solid #333;
          border-top: 1px solid transparent;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
        }
      }
      .trouble-shooting {
        position: absolute;
        top: 12px;
        right: 30px;
        cursor: pointer;
        height: 40px;
        div {
          text-align: center;
        }
        div:first-child {
          height: 24px;
          color: #2d72d3;
        }
        .repair {
          display: none;
          position: absolute;
          left: -26px;
          top: 23px;
          div {
            width: 68px;
            height: 26px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 0px 5px 0px rgba(69, 69, 69, 0.3);
            line-height: 26px;
          }
        }
        .repairiconfont:hover .repair {
          display: block;
        }
      }
      /deep/.el-tabs--border-card {
        border: none;
      }
      /deep/ .el-tabs--border-card > .el-tabs__header {
        background: #ffffff;
        border-top: 0;
      }
      /deep/.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
        border-top: 2px solid #2d72d3;
        position: relative;
        bottom: -2px;
        box-sizing: border-box;
      }
      /*/deep/.el-tabs__nav-wrap{*/
      /*    margin-bottom: -3px;*/
      /*}*/

      .tabs-body {
        height: 200px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-content: start;
        /*padding: 5px 9px;*/
        box-sizing: border-box;
        overflow-y: auto;
        flex-wrap: wrap;
        /*.el-button--default{*/
        /*  height: 27px;*/
        /*}*/
        .dealFlow {
          font-size: 12px;
          /deep/.el-textarea__inner {
            min-height: 150px !important;
            font-size: 12px;
            color: rgb(0, 0, 0);
            font-family: 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Tahoma, 'PingFang SC', 'Hiragino Sans GB',
              'Heiti SC', '\5FAE\8F6F\96C5\9ED1', 'WenQuanYi Micro Hei', Arial, sans-serif;
          }
        }
        .info {
          width: 35%;
          height: 197px;
          border: 1px solid #ddd;
          box-sizing: border-box;
          padding: 0 5px;

          .title {
            font-size: 12px;
            height: 32px;
            line-height: 32px;
          }

          .content {
            height: 160px;
            overflow-y: auto;
            /*border: 1px solid #dddddd;*/
          }
        }

        .detail {
          width: 30%;
          height: 197px;
          border: 1px solid #ddd;

          .detail-row {
            height: 28px;
            display: flex;
            width: 100%;
            font-size: 12px;
            .detail-label {
              width: 80px;
              height: 28px;
              line-height: 28px;
              padding: 0 15px;
              box-sizing: border-box;
              background: rgba(245, 245, 245, 1);
              border-bottom: 1px solid #d5d5d5;
            }

            .detail-value {
              flex: 1;
              padding: 0 15px 0 20px;
              height: 28px;
              line-height: 28px;
              box-sizing: border-box;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              border-bottom: 1px solid #d5d5d5;
            }
          }
        }

        .part-detail {
          flex: 1;
          height: 100%;

          display: flex;
          border-right: 1px solid #fff;
          .row-label {
            width: 130px;
            height: 100%;
            border-right: 1px solid #fff;
            background: #f5f7fa;
            .label {
              width: 100%;
              height: 32px;
              line-height: 32px;
              padding: 0 6px 0 6px;
            }
          }
          .row-value {
            flex: 1;
            .label {
              width: 100%;
              height: 32px;
              line-height: 32px;
              padding: 0 6px 0 6px;
            }
          }
        }
        /deep/.form-box {
          width: 30%;
          height: 197px;
          border: 1px solid #ddd;
          .el-textarea__inner {
            min-height: 60px !important;
            height: 60px !important;
          }
          /deep/ .el-button--mini,
          .el-button--small {
            height: 28px;
          }
        }
        .send-mes-box {
          flex: 1;
          width: 100%;

          .send-btn {
            height: 40px;
            /deep/.el-button--mini {
              height: 28px;
            }
          }

          .table-box {
            //height: 300px;

            .el-table {
              font-size: 12px;
            }
          }
        }

        .link-modal {
          width: 270px;
          min-width: 250px;
          height: 80px;
          display: flex;
          margin: 5px;
          border: 1px solid #ddd;
          font-size: 12px;

          .left-icon {
            width: 50px;
            height: 60px;
            margin-top: 8px;
            line-height: 60px;
            text-align: center;
            .iconfont {
              font-size: 46px;
            }
          }

          .right-btns {
            width: 200px;
            margin-left: 10px;

            .title {
              height: 30px;
              line-height: 30px;
            }

            .btns {
              margin-top: 5px;
            }
          }
        }
      }
      .tabs-body-link {
        justify-content: flex-start;
      }
    }
  }

  .form {
    width: 100%;
    height: 100%;
    padding-top: 3px;
    overflow: auto;
    .from-group {
      width: 100%;
      padding: 0 15px;
      margin-top: 5px;
      display: flex;
      .label {
        width: 70px;
        height: 28px;
        line-height: 28px;
      }

      .input {
        width: 100%;

        .el-select {
          width: 100%;
        }

        .el-input {
          width: 100%;
        }
        .el-textarea__inner {
          height: 150px;
        }
        /deep/.el-input--mini .el-input__inner {
          height: 28px !important;
        }
      }

      .btns {
        margin-top: 8px;
      }
    }
  }
  .focus-resources-dialog {
    width: 100%;
    height: 400px;
    display: flex;
    .focus-resources-left {
      width: 300px;
      height: 100%;
      border: 1px solid #ddd;
    }
    .focus-resources-center {
      width: 40px;
      height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      font-size: 36px;
      cursor: pointer;
      div {
        height: 40px;
      }
      i:hover {
        color: rgba(45, 114, 211, 1);
      }
    }
    .focus-resources-right {
      flex: 1;
      border: 1px solid #ddd;
      height: 400px;
    }
  }
}
.filter-box {
  .el-checkbox {
    line-height: 30px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
