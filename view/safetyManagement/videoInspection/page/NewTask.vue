<template>
  <div>
    <div v-if="isView">
      <div>
        <!-- 进度条 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="margin:10px;">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
          <el-breadcrumb-item>设备巡检</el-breadcrumb-item>
          <el-breadcrumb-item>巡检任务管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{titleDa?titleDa:'创建'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 按钮组1 -->
        <div class="top-button">
          <el-button size="mini" @click="handleSave">保 存</el-button>
          <el-button size="mini" @click="handleReset">重 置</el-button>
          <el-button size="mini" v-print="'#printContent'">打 印</el-button>
        </div>
        <!-- 表单组 -->
        <div id="printContent" class="formTit">
          <div class="title-name">巡检任务{{titleDa?titleDa:'创建'}}</div>
          <div>
            <el-form ref="form" :model="form" size="mini" label-width="100px" border>
              <!-- 头 -->
              <div class="form-content">
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检计划名称</div>
                    <el-input size="mini" v-model="form.inspectName" placeholder="请输入内容"></el-input>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">子系统</div>
                    <span>
                      <el-select size="mini" v-model="form.subsystemId" placeholder="请选择">
                        <el-option label="视频子系统" value="1"></el-option>
                        <el-option label="报警子系统" value="2"></el-option>
                        <el-option label="对讲子系统" value="3"></el-option>
                        <el-option label="门禁子系统" value="4"></el-option>
                        <el-option label="停车场子系统" value="5"></el-option>
                        <el-option label="防护舱子系统" value="6"></el-option>
                        <el-option label="电视墙子系统" value="7"></el-option>
                        <el-option label="服务器" value="8"></el-option>
                      </el-select>
                    </span>
                  </span>
                </div>

                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检周期</div>
                    <span>
                      <el-select size="mini" v-model="form.inspectPeriod" placeholder="请选择">
                        <el-option label="每一天" value=1></el-option>
                        <el-option label="每二天" value=2></el-option>
                        <el-option label="每三天" value=3></el-option>
                        <el-option label="每四天" value=4></el-option>
                        <el-option label="每五天" value=5></el-option>
                        <el-option label="每六天" value=6></el-option>
                        <el-option label="每七天" value=7></el-option>
                      </el-select>
                    </span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">巡检项</div>
                    <div class="xiang">
                      <el-checkbox label="分辨率" v-model="form.isInspectResolutionRatio"></el-checkbox>
                      <el-checkbox label="码率" v-model="form.isInspectCodeRatio"></el-checkbox>
                      <el-checkbox label="帧率" v-model="form.isInspectFPs"></el-checkbox>
                      <el-checkbox label="录像计划" v-model="form.isInspectVideotape"></el-checkbox>
                    </div>

                    <!-- <el-checkbox-group class="xiang" size="mini" v-model="form.type">
                      <el-checkbox label="分辨率" name="分辨率"></el-checkbox>
                      <el-checkbox label="码率" name="码率"></el-checkbox>
                      <el-checkbox label="帧率" name="type"></el-checkbox>
                      <el-checkbox label="录像计划" name="type"></el-checkbox>
                    </el-checkbox-group> -->
                  </span>
                </div>

                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检时间</div>
                    <el-time-picker value-format="HH-mm-ss" size="mini" v-model="form.inspectAt" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" placeholder="请选择">
                    </el-time-picker>
                    <!-- <el-time-picker value-format="HH-mm-ss" size="mini" is-range v-model="form.inspectAt" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"> -->
                    <!-- </el-time-picker> -->
                    <!-- <el-input size="mini" v-model="form.inspectAt" placeholder="请输入内容"></el-input> -->
                  </span>
                </div>

              </div>
              <!-- 双树 -->
              <div class="box-title">
                <span class="pointer" @click="changeShow">
                  巡检对象
                  <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
              </div>
              <div class="tree-two" v-if="isShow">
                <tree-transfer class="tree-content" :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}" @addBtn='add' @removeBtn='remove' :mode='mode' filter openAll>
                </tree-transfer>
                <!-- <treeBox :lazyTreeApi="getTreeApi" searchType="filter" :treeType="treeType" @clickData="clickData" @onceClick="onceClick" treeLazyToggle iconToggle></treeBox> -->
              </div>
            </el-form>

            <div class="people-infor">
              <div>
                <span class="title">录入时间</span>
                <span class="num">2020-02-20 15:00:00</span>
              </div>
              <div>
                <span class="title">录入机构</span>
                <span class="num">xxxxxxxx机构名称</span>
              </div>
              <div>
                <span class="title">录入人</span>
                <span class="num">张三</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isView">
      <!-- 进度条 -->
      <el-breadcrumb separator-class="el-icon-arrow-right" class="margin:10px;">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
        <el-breadcrumb-item>设备巡检</el-breadcrumb-item>
        <el-breadcrumb-item>巡检任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
      <div>
        <!-- 按钮组1 -->
        <div class="top-button">
          <el-button size="mini" @click="switchPage">新 建</el-button>
          <el-button size="mini" @click="handleEditor">编 辑</el-button>
          <el-button size="mini" @click="handleDel">删 除</el-button>
          <el-button size="mini" v-print="'#printContent2'">打印</el-button>
        </div>
        <!-- 表单组 -->
        <div class="formTit" id="printContent2">
          <div class="title-name">巡检任务查看</div>
          <div>
            <el-form ref="form" :model="form" size="mini" label-width="100px" border>
              <!-- 头 -->
              <div class="form-content">
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检计划名称</div>
                    <span>{{form.inspectName}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">子系统</div>
                    <span>{{form.subsystemId}}</span>
                  </span>
                </div>

                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检周期</div>
                    <span>{{form.inspectPeriod}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">巡检项</div>
                    <div class="xiang">
                      <el-checkbox disabled label="分辨率" v-model="form.isInspectResolutionRatio"></el-checkbox>
                      <el-checkbox disabled label="码率" v-model="form.isInspectCodeRatio"></el-checkbox>
                      <el-checkbox disabled label="帧率" v-model="form.isInspectFPs"></el-checkbox>
                      <el-checkbox disabled label="录像计划" v-model="form.isInspectVideotape"></el-checkbox>
                    </div>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检时间</div>
                    <el-time-picker disabled value-format="HH-mm-ss" size="mini" v-model="form.inspectAt" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" placeholder="请选择">
                    </el-time-picker>
                    <!-- <el-time-picker disabled value-format="HH-mm-ss" size="mini" is-range v-model="form.inspectAt" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
                    </el-time-picker> -->
                  </span>
                </div>
              </div>
              <!-- 显示隐藏 -->
              <div class="box-title">
                <span class="pointer" @click="changeShow">
                  巡检对象
                  <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
              </div>
            </el-form>
            <!-- 表格  -->
            <div class="table-sty" v-if="isShow">
              <el-table :data="tableData" border size="mini" stripe :height="'37vh'">
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column v-for="item in tableColumn" :key="item.label" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip align="center"></el-table-column>
              </el-table>
            </div>

            <div class="people-infor">
              <div>
                <span class="title">录入时间</span>
                <span class="num">2020-02-20 15:00:00</span>
              </div>
              <div>
                <span class="title">录入机构</span>
                <span class="num">xxxxxxxx机构名称</span>
              </div>
              <div>
                <span class="title">录入人</span>
                <span class="num">张三</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import { getTreeApi } from '../../../../http/audio/manyIntercom'
import treeBox from '@src/components/tree/treeBox'

import { addVideoTask, putVideoTask } from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'
import treeTransfer from 'el-tree-transfer'
// import taskView from './taskView'
export default {
  components: { treeTransfer },
  props: {
    titleDa: {
      type: String,
      default: '新建'
    },
    isViews: {
      type: Boolean,
      default: false
    },
    isData: {
      type: Object,
    },
  },
  created() {
    this.form = this.isData
    this.isView = this.isViews
  },
  data() {
    return {
      // 树的数据 
      mode: "transfer",
      fromData: [
        {
          id: "1",
          pid: 0,
          label: "河北省分行",
          children: [
            {
              id: "1-1",
              pid: "1",
              label: "石家庄分行",
              children: []
            },
            {
              id: "1-2",
              pid: "1",
              label: "保定分行",
              children: [
                {
                  id: "1-2-1",
                  pid: "1-2",
                  children: [],
                  label: "xxx重点部位"
                },
                {
                  id: "1-2-2",
                  pid: "1-2",
                  children: [],
                  label: "创业路支行"
                }
              ]
            }
          ],
        },
      ],
      toData: [],
      // defaultProps: {
      //   children: 'children',
      //   label: 'label'
      // },
      // 表头数据
      tableColumn: [
        { prop: 'orgId', label: '所属机构', width: 'auto', sortable: true },
        { prop: 'keySite', label: '所属重点部位', width: 'auto', sortable: true },
        { prop: 'Device', label: '设备名称', width: 'auto', sortable: true },
        { prop: 'code', label: '品牌', width: 'auto', sortable: true },
        { prop: 'address', label: '型号', width: 'auto', sortable: true },
        { prop: 'state', label: '资产编码', width: 'auto', sortable: true },
      ],
      // 表格数据
      tableData: [
        {
          orgId: '保定分行',
          keySite: 'xx营业网点',
          Device: '硬盘录像机',
          code: '硬盘录像机1-高柜区',
          address: '192.168.1.2',
          state: 1,
          brand: 'xxxxxxx',
          equipmentModel: 'xxxxxx'
        },
        {
          orgId: '保定分行',
          keySite: 'xx营业网点',
          Device: '硬盘录像机',
          code: '硬盘录像机1-高柜区',
          address: '192.168.1.2',
          state: 1,
          brand: 'xxxxxxx',
          equipmentModel: 'xxxxxx'
        }
      ],
      // 控制显示于隐藏 
      isShow: true,
      isView: false,
      form: {
        inspectName: '',
        subsystemId: '',
        inspectPeriod: '',
        inspectAt: '',
        isInspectResolutionRatio: false,
        isInspectCodeRatio: false,
        isInspectFPs: false,
        isInspectVideotape: false,
        status: '7'
      },
    }
  },
  methods: {
    getTreeApi(params) {
      return getTreeApi(params)
    },
    changeShow() {
      this.isShow = !this.isShow
    },
    //保存
    handleSave() {
      console.log(this.form.inspectName);
      console.log(this.form.subsystemId);
      console.log(this.form.inspectPeriod);
      console.log(this.form.inspectAt);
      console.log(this.form.isInspectResolutionRatio);
      console.log(this.form.isInspectCodeRatio);
      console.log(this.form.isInspectFPs);
      console.log(this.form.isInspectVideotape);
      let params = {
        inspectName: this.form.inspectName,
        subsystemId: this.form.subsystemId,
        inspectPeriod: this.form.inspectPeriod,
        inspectAt: this.form.inspectAt,
        isInspectResolutionRatio: this.form.isInspectResolutionRatio,
        isInspectCodeRatio: this.form.isInspectCodeRatio,
        isInspectFPs: this.form.isInspectFPs,
        isInspectVideotape: this.form.isInspectVideotape,
        status: '0'
      }
      if (this.titleDa == '修改') {
        let params = {
          inspectName: this.form.inspectName,
          subsystemId: this.form.subsystemId,
          inspectPeriod: this.form.inspectPeriod,
          inspectAt: this.form.inspectAt,
          isInspectResolutionRatio: this.form.isInspectResolutionRatio,
          isInspectCodeRatio: this.form.isInspectCodeRatio,
          isInspectFPs: this.form.isInspectFPs,
          isInspectVideotape: this.form.isInspectVideotape,
          status: '0'
        }
        putVideoTask(params).then(res => {
          let result = res.data
          if (result.message) {
            this.$messageSuccess('修改成功')
          } else {
            this.$messageError('修改失败')
          }
          console.log(res)
        })
        this.isView = !this.isView
      } else {
        let params = {
          inspectName: this.form.inspectName,
          subsystemId: this.form.subsystemId,
          inspectPeriod: this.form.inspectPeriod,
          inspectAt: this.form.inspectAt,
          isInspectResolutionRatio: this.form.isInspectResolutionRatio,
          isInspectCodeRatio: this.form.isInspectCodeRatio,
          isInspectFPs: this.form.isInspectFPs,
          isInspectVideotape: this.form.isInspectVideotape,
          status: '0'
        }
        addVideoTask(params).then(res => {
          let result = res.data
          if (result.message) {
            this.$messageSuccess('新建成功')
          } else {
            this.$messageError('新建失败')
          }
        })
        this.isView = !this.isView
      }
    },
    // 重置 
    handleReset() {
      this.form = {
        name: '',
        system: '',
        genre: '',
        cycle: '',
        times: '',
        isInspectResolutionRatio: false,
        isInspectCodeRatio: false,
        isInspectFPs: false,
        isInspectVideotape: false,
        status: ''
      }
    },
    //新建
    switchPage() {
      this.handleReset()
      this.isView = !this.isView
      this.titleDa = '新建'
    },
    //编辑 
    handleEditor() {
      this.titleDa = '修改'
      this.isView = !this.isView
    },
    // 删除 
    handleDel() {

    },
    //树的事件 
    changeMode() {
      if (this.mode == "transfer") {
        this.mode = "addressList";
      } else {
        this.mode = "transfer";
      }
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的        {keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log("fromData:", fromData);
      console.log("toData:", toData);
      console.log("obj:", obj);
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log("fromData:", fromData);
      console.log("toData:", toData);
      console.log("obj:", obj);
    },
  }

}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin: 10px;
}
.top-button {
  margin: 10px 0 10px 10px;
}
.title-name {
  margin: 0 0 10px 560px;
  font-size: 14px;
  font-weight: 600;
}
.form-content {
  border: 1px solid #e1e1e1;
  width: 800px;
  height: 140px;
  margin-left: 200px;
  box-sizing: border-box;
  padding: 2px;
  .form-inner {
    width: 100%;
    height: 25%;
    .form-item {
      width: 50%;
      height: 100%;

      // span {
      //   box-sizing: border-box;
      //   height: 26px;
      //   line-height: 26px;
      // }
      .bg-c {
        display: inline-block;
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #e1e1e1;
      }
      span {
        display: inline-block;
        width: 270px;
        text-align: center;
        font-size: 12px;
      }
      .el-input {
        width: 270px;
        height: 30px;
      }
      .el-select {
        width: 270px;
        height: 30px;
      }
      .el-checkbox-group {
        display: inline-block;
        width: 260px;
        height: 30px;
      }
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
.tree-two {
  width: 800px;
  height: 350px;
  .tree-content {
    margin: 10px 0 0 200px;
    /deep/.transfer-center {
      .transfer-center-item {
        .el-button {
          width: 100px;
          border-radius: 20px;
          background-color: #2d71d3;
          i {
            font-style: 14px;
          }
        }
      }
    }
  }
}
.el-tree-node__label {
  font-size: 12px;
}
.people-infor {
  width: 800px;
  height: 30px;
  margin: 0px 0 10px 200px;
  font-size: 12px;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  div {
    float: left;
    width: 33.33%;
    height: 100%;
    display: flex;
    .title {
      flex: 3;
      background-color: #e1e1e1;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ffffff;
    }
    .num {
      flex: 7;
      display: flex;
      align-items: center;
      margin-left: 10px;
    }
  }
}
.table-sty {
  margin: 0 0 12px 200px;
  width: 800px;
}
@media print {
  .formTit {
    width: 1040px;
    height: 1000px;
    margin-top: 400px;
    .title-name {
      margin: 0 0 10px 560px;
      font-size: 14px;
      font-weight: 600;
    }
    .form-content {
      border: 1px solid #e1e1e1;
      width: 800px;
      height: 140px;
      margin-left: 200px;
      box-sizing: border-box;
      padding: 2px;
      .form-inner {
        width: 100%;
        height: 25%;
        .form-item {
          width: 50%;
          height: 100%;
          .bg-c {
            display: inline-block;
            width: 120px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background-color: #e1e1e1;
          }
          span {
            display: inline-block;
            width: 270px;
            text-align: center;
            font-size: 12px;
          }
          .el-input {
            width: 270px;
            height: 30px;
          }
          .el-select {
            width: 270px;
            height: 30px;
          }
          .el-checkbox-group {
            display: inline-block;
            width: 270px;
            height: 30px;
          }
        }
      }
    }

    .box-title {
      position: relative;
      height: 24px;
      line-height: 24px;
      color: #606266;
      margin-left: 150px;

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
    .tree-two {
      width: 800px;
      height: 350px;
      .tree-content {
        margin: 10px 0 0 200px;
      }
    }
    .el-tree-node__label {
      font-size: 12px;
    }
    .people-infor {
      width: 800px;
      height: 30px;
      margin: 0px 0 10px 200px;
      font-size: 12px;
      border: 1px solid #e1e1e1;
      box-sizing: border-box;
      div {
        float: left;
        width: 33.33%;
        height: 100%;
        display: flex;
        .title {
          flex: 3;
          background-color: #e1e1e1;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #ffffff;
        }
        .num {
          flex: 7;
          display: flex;
          align-items: center;
          margin-left: 10px;
        }
      }
    }
  }
}
.xiang {
  width: 265px;
  display: inline-block;
  /deep/.el-checkbox {
    margin-right: 10px;
    .el-checkbox__label {
      padding: 0;
    }
  }
}
</style>

