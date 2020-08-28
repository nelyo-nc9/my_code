<template>
  <div>
    <div class="host-panel-mode">
      <div class="panel-content"
           v-for="(item, index) in arryData"
           :key="index">
        <div class="panel-content-bck">
          <p class="panel-content-check">
            <template>
              <el-checkbox v-model="item.checked"
                           @change="changeCheck(item)"></el-checkbox>
            </template>
            <span>{{item.locName}}</span>
          </p>
          <div class="panel-top">
            <div class="panel-left"
                 :style="{background:(item.defenseState=='布防'?'#FFEDED':'#F2F2F2')}">
              <div class="panel-armed-info">
                <i class="iconfont-ccb"
                   v-if="item.defenseState!=='布防'">&#xe687;</i>
                <i class="iconfont-ccb"
                   style="color:red;background:#FFEDED"
                   v-if="item.defenseState=='布防'">&#xe687;</i>
                <p v-if="!item.subSystemList||item.subSystemList&&item.subSystemList.length===1"
                   class="atmed-status-info"
                   :style="{'color':((item.defenseState=='布防' ? 'red' : '#2D72D3'))}">{{item.defenseState}}</p>
                <div v-if="item.subSystemList&&item.subSystemList.length>1"
                     class="subsystem-No">
                  <ul>
                    <li v-for="(i,ind) in item.subSystemList.length"
                        :key="ind"
                        :style="{'color':(item.subStatusColor==='arm'?'red':'#2D72D3')}">{{i}}</li>
                  </ul>
                </div>
              </div>
              <p>
                <el-button size="mini"
                           @click="backControlClick(item)"><span class="iconfont-ccb">&#xe684;</span>回控</el-button>
              </p>

            </div>
            <div class="panel-right">
              <p class="panel-ip-info">
                <i class="iconfont-ccb">&#xe683;</i>
                <span :title="item.ip">{{item.ip}}</span>
              </p>
              <p class="p">
                <el-button size="mini"
                           @click="hostLinkControlBtn(item)"><span class="iconfont-ccb">&#xe659;</span>关联</el-button>
              </p>
            </div>
          </div>
        </div>
        <div class="panel-foot"
             :style="{'background':item.status ==='离线'?'#d7d7d7':'#80AFF0'}">
          <p><i>{{item.name}}</i></p>
        </div>
      </div>
    </div>
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :page-sizes="[10, 25, 50, 100]"
                   :page-size="pageSize"
                   :current-page="page"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    alarmHostList: {
      // 报警主机列表
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      panelChecked: false,
      pageSize: 25,
      page: 1,
      total: 0,
      hostNo: 0,
      arryData: [],
      zoneStatusColor: '',
      zoneStatusColorArr: [],
      checkArr: [],
    }
  },
  watch: {
    alarmHostList: {
      deep: true,
      handler(newValue) {
        // console.log(this.alarmHostList, '~~~~~~')
      },
    },
  },
  computed: {},
  created() {
    console.log('面板模式', this.alarmHostList)
    this.getAlarmHostManageList({
      deviceType: '电话报警主机,网络报警主机',
      pageSize: this.pageSize,
      pageNum: this.page,
    })
    this.stateNum()
  },
  methods: {
    ...mapActions(['getAlarmHostManage', 'login', 'getStatus', 'getalrmHostListQuery', 'getalrmHostListState']),
    // ------定时更新面板模式的状态-------暂时用定时器,这是定时器用到的函数------start
    realTimeDel(obj) {
      this.getAlarmHostManage(obj).then((res) => {
        let results = res.data.data.results
        results.map((item, index) => {
          this.arryData[index].status = item.status === 2 ? '在线' : '离线'
          this.arryData[index].defenseState =
            item.defenseState === 1 ? '撤防' : item.defenseState === 3 ? '布防' : '未知'
        })
      })
    },
    // -------end--------------------------------------------
    // 统计状态
    stateNum() {
      this.getalrmHostListState().then((res) => {
        // this.armed = res.data.states.defense
        // this.disarm = res.data.states.unDefense
        this.armed = res.data.states.unDefense
        this.disarm = res.data.states.defense
        this.offline = res.data.states.offline
        this.total = res.data.states.total
        this.hostNo = res.data.states.total
      })
    },
    // 报警主机列表获取
    getAlarmHostManageList(obj) {
      this.getAlarmHostManage(obj)
        .then((res) => {
          this.arryData = res.data.data.results
          this.arryData.map((item, index) => {
            item.status = item.status === 2 ? '在线' : '离线'
            item.defenseState = item.defenseState === 1 ? '撤防' : item.defenseState === 3 ? '布防' : '未知'
            item.electricState = item.electricState === 1 ? '异常' : item.electricState === 3 ? '正常' : '未知'
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    backControlClick(data) {
      console.log(data, '面板模式的data')
      this.$emit('backControlStatus', true, data)
    },
    hostLinkControlBtn(data) {
      console.log(data, '当前点击的报警主机')
      this.$emit('handleLinkBtn', true, data)
    },
    // 报警主机列表每页显示条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.handleCurrentChange(1)
    },
    // 报警主机列表分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.getAlarmHostManageList({ deviceType: '电话报警主机,网络报警主机', pageSize: this.pageSize, pageNum: val })
    },
    changeCheck(val) {
      if (val.checked) {
        this.checkArr.push(val)
      } else {
        this.checkArr.map((item, index) => {
          if (!val.checked) {
            this.checkArr.splice(index, 1)
          }
        })
        // this.checkArr.splice(this.checkArr.length-1,1)
      }
      console.log(this.checkArr, 'checkArr')
      this.$emit('hostSelectionChange', this.checkArr)
    },
    // 清楚选框
    clearCheck() {
      this.checkArr = []
      this.query()
    },
    // 条件查询
    query(obj) {
      console.log(this.checkArr, ' this.checkArr')
      this.arryData = []
      this.getalrmHostListQuery(obj).then((res) => {
        if (JSON.stringify(res.data) !== '{}') {
          this.total = res.data.page.length
          this.arryData = res.data && res.data.results
          res.data.results &&
            res.data.results.map((item, index) => {
              item.status = item.status === 2 ? '在线' : '离线'
              item.defenseState = item.defenseState === 1 ? '撤防' : item.defenseState === 3 ? '布防' : '未知'
              item.electricState = item.electricState === 1 ? '异常' : item.electricState === 3 ? '正常' : '未知'
            })
        } else {
          this.tableData = []
          this.total = 0
        }
      })
    },
  },
}
</script>

<style scoped lang='less'>
.el-pagination {
  float: right;
  margin-right: 20px;
}
.host-panel-mode {
  height: 610px;
  // border: 1px solid red;
  overflow: auto;
  margin-bottom: 10px;

  .panel-content {
    width: 250px;
    height: 189px;
    border: 1px solid #e8e8e8;
    float: left;
    margin: 0 20px 10px 0;
    box-sizing: border-box;
    .panel-content-bck {
      background: #fff;
      padding: 10px;
      //position: relative;
      .panel-content-check {
        width: 100%;
        height: 20px;
        line-height: 9px;
        el-checkbox {
          float: left;
          width: 10%;
        }
        span {
          float: right;
          width: 90%;
          text-align: center;
        }
      }
      .panel-top {
        height: 106px;
        overflow: hidden;
        // padding: 2px 10px 0 10px;
        box-sizing: border-box;
        margin-bottom: 6px;
        .panel-left {
          width: 100%;
          height: 50px;
          display: flex;
          .panel-armed-info {
            flex: 3;
            overflow: hidden;
            // height: 62px;
            line-height: 50px;
            i {
              font-size: 36px;
              float: left;
              padding-right: 10px;
              color: rgba(45, 114, 211, 1);
            }
            .atmed-status-info {
              width: 60px;
              margin: 0 auto;
              font-size: 16px;
            }
          }
          p {
            flex: 1;
            line-height: 50px;
            span {
              font-size: 14px;
              margin-right: 6px;
            }
          }
          .subsystem-No {
            width: 90px;
            height: 58px;
            margin-left: 36px;
            li {
              float: left;
              margin-left: 2px;
              margin-bottom: 4px;
              border: 1px solid #333;
              width: 20px;
              height: 20px;
              text-align: center;
              font-weight: bold;
              line-height: 20px;
              margin-top: 15px;
            }
          }
          .panel-ip-info {
            overflow: hidden;
            height: 34px;
            line-height: 34px;
            i {
              font-size: 22px;
            }
          }
        }
        .panel-right {
          display: flex;
          width: 100%;
          height: 50px;
          //background: aquamarine;
          margin-top: 10;
          .panel-ip-info {
            flex: 3;
            line-height: 50px;
            i {
              font-size: 36px;
              color: #00a8ff;
            }
            span {
              font-size: 14px;
              margin-left: 12px;
              display: inline-block;
              width: 100px;
              overflow: hidden;
            }
          }
          .p {
            flex: 1;
            line-height: 50px;
            span {
              font-size: 14px;
              margin-right: 6px;
            }
          }
        }
      }
    }
    .panel-foot {
      height: 35px;
      background: #80aff0;
      line-height: 35px;
      text-align: center;
      padding: 0;
    }
  }
}
</style>
