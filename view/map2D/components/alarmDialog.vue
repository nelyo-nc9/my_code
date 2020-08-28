<!--
 * @Author: fengbeibei
 * @Date: 2020-05-20 15:41:20
 * @LastEditTime: 2020-05-20 20:28:17
 * @LastEditors: fengbeibei
 * @Description: 电子地图右上角工具栏
-->
<template>
  <div>
    <el-dialog title="报警处理" width="380px" :modal="false" :visible.sync="dialogVisible" @close="cancelBtn()" :close-on-click-modal="false">
      <div class="tabs-body">
        <div class="form-box">
          <div class="form">
            <form action>
              <div class="from-group">
                <div class="label">接收人</div>
                <div class="input">
                  <el-select size="mini" v-model="dealSubmit.receivePerson">
                    <el-option
                      :label="item.receiveTypeValue"
                      :value="item.receiveTypeValue"
                      v-for="(item, index) in tableDataMes"
                      :key="index"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="from-group">
                <div class="label">处理类型</div>
                <div class="input">
                  <el-select size="mini" v-model="dealSubmit.dealType">
                    <el-option
                      :label="item.dealTypeValue"
                      :value="item.dealTypeValue"
                      v-for="(item, index) in dealList"
                      :key="index"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="from-group">
                <div class="label">工单类型</div>
                <div class="input">
                  <el-select size="mini" v-model="dealSubmit.workOrderType">
                    <el-option
                      :label="item.dealTypeValue"
                      :value="item.dealTypeValue"
                      v-for="(item, index) in workOrder"
                      :key="index"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="from-group">
                <div class="label">处理意见</div>
                <div class="input">
                  <el-input type="textarea" style="min-height: 60px" v-model="dealSubmit.dealOpinion"></el-input>
                </div>
              </div>
              <div class="from-group">
                <div class="btns">
                  <el-button size="mini" type="primary" @click="dealAlarmSubmit('')">提交</el-button>
                  <el-button size="mini" @click="cancelBtn" style="float:right">取消</el-button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      //   centerDialogVisible: true,
      //   activeKey: null,
      dialogVisible: true,
      dealSubmit: {
        // 处置接口
        dealType: null,
        receivePerson: null,
        // alarmType:'',
        // alarmTypeName:'',
        workOrderType: '',
        dealOpinion: '',
        ids: ''
      },
      tableDataMes: [
        { name: '王伟', receiveTypeValue: '王伟', dealStatus: '是' },
        { name: '李兴国', receiveTypeValue: '李兴国', dealStatus: '是' }
      ],
      dealList: [],
      workOrder: []
      // 这个是模拟数据
    }
  },

  mounted() {
    this.initSelect()
    // this.centerDialogVisible = this.isShow
  },
  computed: {
    ...mapGetters('map2d/mapIndex', ['videoPlayInfo', 'showAlarmVideoInfo'])
  },
  methods: {
    ...mapActions('alarmEmergencyResponse', {
      alarmDealSubmit: 'alarmDealSubmit' // 批量处理
    }),
    ...mapActions('equipmentConfigManagement', {
      getPolicyConfiguration: 'getPolicyConfiguration'
    }),
    dealAlarmSubmit(type) {
      let ids = []
      //   if (type === 'batch') {
      //     if (this.selectionTableData.length === 0) {
      //       this.$notify({
      //         message: '请先选择数据',
      //         type: 'success'
      //       })
      //       return
      //     }
      //     this.selectionTableData.map(item => {
      //       if (item.id) {
      //         ids.push(item.id)
      //       }
      //     })
      //   } else {
      if (!this.dealSubmit.receivePerson) {
        this.$notify({
          message: '请先选择接收人',
          title: '警告',
          type: 'warning'
        })
        return
      }
      if (!this.dealSubmit.dealType) {
        this.$notify({
          title: '警告',
          message: '请先选择处置类型',
          type: 'warning'
        })
        return
      }
      if (!this.dealSubmit.workOrderType) {
        this.$notify({
          title: '警告',
          message: '请先选择工单类型',
          type: 'warning'
        })
        return
      }
      if (!this.dealSubmit.dealOpinion) {
        this.$notify({
          title: '警告',
          message: '请先填写处理意见',
          type: 'warning'
        })
        return
      }
      // ids = [this.rowClickParam.id]
      //   }
      ids.push(this.showAlarmVideoInfo.nowShowAlarmDetailInfo.id)
      let param = {
        ids: ids,
        dealType: this.dealSubmit.dealType,
        receivePerson: this.dealSubmit.receivePerson,
        workOrderType: this.dealSubmit.workOrderType,
        dealOpinion: this.dealSubmit.dealOpinion,
        dealState: 2
      }
      this.alarmDealSubmit(param).then(res => {
        // this.bulkDealdialogVisible = false
        this.dealSubmit = {
          // 处置接口
          ids: [],
          dealType: '',
          receivePerson: '',
          workOrderType: '',
          dealOpinion: ''
        }
        // this.getAlarmReceiveListFuc('refresh')
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success'
        })
        //
      })
    },

    cancelBtn() {
      this.dealSubmit = {
        // 处置接口
        ids: [],
        dealType: '',
        receivePerson: '',
        workOrderType: '',
        dealOpinion: ''
      }
      this.$emit('toSon', false)
    },
    initSelect() {
      this.getPolicyConfiguration().then(res => {
        if (res) {
          console.log('获取报警字典数据', res)
          // debugger
          let data = res.data.results && res.data.results[0]
          this.dealList = JSON.parse(data.alarmType)
          this.workOrder = JSON.parse(data.workOrderType)
          this.dealSubmit.ids = [data.id]
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  width: 100%;
  height: 100%;
  padding-top: 3px;
  .from-group {
    width: 100%;
    padding: 0 15px;
    display: flex;
    .label {
      width: 100px;
      height: 30px;
      line-height: 30px;
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
      margin: 2px 0;
    }

    .btns {
      margin-top: 8px;
      width:100%;
    }
  }
}
.tabs-body {
  height: 220px;
  width: 280px;
  display: flex;
  justify-content: space-between;
  align-content: start;
  /*padding: 5px 9px;*/
  //   box-sizing: border-box;
  overflow-y: auto;
  flex-wrap: wrap;
  /*.el-button--default{*/
  /*  height: 27px;*/
  /*}*/
  margin: 0 30px;
  //   .dealFlow {
  //     font-size: 12px;
  //     /deep/.el-textarea__inner {
  //       min-height: 150px !important;
  //       font-size: 12px;
  //       color: rgb(0, 0, 0);
  //       font-family: 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Tahoma, 'PingFang SC', 'Hiragino Sans GB', 'Heiti SC',
  //         '\5FAE\8F6F\96C5\9ED1', 'WenQuanYi Micro Hei', Arial, sans-serif;
  //     }
  //   }
  //   .info {
  //     width: 35%;
  //     height: 197px;
  //     // border: 1px solid #ddd;
  //     // box-sizing: border-box;
  //     padding: 0 5px;

  //     .title {
  //       font-size: 12px;
  //       height: 32px;
  //       line-height: 32px;
  //     }

  //     .content {
  //       height: 160px;
  //       overflow-y: auto;
  //       /*border: 1px solid #dddddd;*/
  //     }
  //   }

  //   .detail {
  //     width: 30%;
  //     height: 197px;
  //     // border: 1px solid #ddd;

  //     .detail-row {
  //       height: 28px;
  //       display: flex;
  //       width: 100%;
  //       font-size: 12px;
  //       .detail-label {
  //         width: 80px;
  //         height: 28px;
  //         line-height: 28px;
  //         padding: 0 15px;
  //         box-sizing: border-box;
  //         background: rgba(245, 245, 245, 1);
  //         border-bottom: 1px solid #d5d5d5;
  //       }

  //       .detail-value {
  //         flex: 1;
  //         padding: 0 15px 0 20px;
  //         height: 28px;
  //         line-height: 28px;
  //         box-sizing: border-box;
  //         overflow: hidden;
  //         text-overflow: ellipsis;
  //         white-space: nowrap;
  //         border-bottom: 1px solid #d5d5d5;
  //       }
  //     }
  //   }

  //   .part-detail {
  //     flex: 1;
  //     height: 100%;

  //     display: flex;
  //     border-right: 1px solid #fff;
  //     .row-label {
  //       width: 130px;
  //       height: 100%;
  //       border-right: 1px solid #fff;
  //       background: #f5f7fa;
  //       .label {
  //         width: 100%;
  //         height: 32px;
  //         line-height: 32px;
  //         padding: 0 6px 0 6px;
  //       }
  //     }
  //     .row-value {
  //       flex: 1;
  //       .label {
  //         width: 100%;
  //         height: 32px;
  //         line-height: 32px;
  //         padding: 0 6px 0 6px;
  //       }
  //     }
  //   }
  /deep/.form-box {
    width: 100%;
    height: 197px;
    // border: 1px solid #ddd;
    .el-textarea__inner {
      min-height: 60px !important;
      height: 60px !important;
    }
    /deep/ .el-button--mini,
    .el-button--small {
      height: 28px;
    }
  }
  //   .send-mes-box {
  //     flex: 1;
  //     width: 100%;

  //     .send-btn {
  //       height: 40px;
  //       /deep/.el-button--mini {
  //         height: 28px;
  //       }
  //     }

  //     .table-box {
  //       //height: 300px;

  //       .el-table {
  //         font-size: 12px;
  //       }
  //     }
  //   }

  //   .link-modal {
  //     width: 270px;
  //     min-width: 250px;
  //     height: 80px;
  //     display: flex;
  //     margin: 5px;
  //     border: 1px solid #ddd;
  //     font-size: 12px;

  //     .left-icon {
  //       width: 50px;
  //       height: 60px;
  //       margin-top: 8px;
  //       line-height: 60px;
  //       text-align: center;
  //       .iconfont {
  //         font-size: 46px;
  //       }
  //     }

  //     .right-btns {
  //       width: 200px;
  //       margin-left: 10px;

  //       .title {
  //         height: 30px;
  //         line-height: 30px;
  //       }

  //       .btns {
  //         margin-top: 5px;
  //       }
  //     }
  //   }
}
</style>
