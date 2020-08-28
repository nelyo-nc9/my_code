
<template>
  <!-- 服务器运行详情 -->

    <div class="">
      <div class="btn-container">
        <el-button size="small"  @click="reload">刷新</el-button>
        <el-button size="small"  @click="back">返回</el-button>
      </div>

      <div class="server-info-con">
          <div class="server-info-item">
              <span>服务器名称：</span>
              <span>{{ serverDetail.serverName }}</span>
          </div>
          <div class="server-info-item">
              <span>IP地址：</span>
              <span>{{ serverDetail.serverIp || '' }}</span>
          </div>
          <div class="server-info-item">
              <span>操作系统：</span>
              <span v-if="serverDetail.serverType == 1">Linux</span>
              <span v-else-if="serverDetail.serverType == 2">Windows</span>
              <span v-else>未知</span>
          </div>
          <div class="server-info-item server-info-item2">
              <span>运行时间：</span>
              <span>{{ serverDetail.runTime }}</span>
          </div>
          <div class="server-info-item server-info-item2">
              <span>服务数：</span>
              <span>{{serverDetail.serInfo.length}}</span>
              <span style="margin-left:15px;">正常：</span>
              <span style="color:#67C23A">{{ serverDetail.serInfo.filter((item)=>{return item.servStatus==1 }).length }}</span>
              <span>异常：</span>
              <span style="color:#F56C6C">{{ serverDetail.serInfo.filter((item)=>{return item.servStatus==2 }).length }}</span>
              <span>未知：</span>
              <span>{{ serverDetail.serInfo.filter((item)=>{return item.servStatus==0 }).length }}</span>
          </div>
      </div>

      <!-- 服务器运行状况 -->
      <div class="single-server-state">
        <div class="single-server-state-container">
          <!-- cpu -->
          <div class="single-server-state-item">
            <div class="chart-container">
              <div class="chart-main" :style="{ height: serverDetail.cpuInfo.cpuUseRate + '%' }"></div>
              <div class="chart-desc">{{ serverDetail.cpuInfo.cpuUseRate || 0 }}%</div>
            </div>
            <div class="describe-container">
              <div class="describe-main-title">CPU</div>
              <div class="describe-main">
                <p>负载：{{ serverDetail.cpuInfo.cpuLoad?serverDetail.cpuInfo.cpuLoad.join(','):'' || 0}}</p>
              </div>
            </div>
          </div>

          <!-- 内存 -->
          <div class="single-server-state-item">
            <div class="chart-container">
              <div class="chart-main" :style="{ height: serverDetail.memInfo.memUseRate + '%' }"></div>
              <div class="chart-desc">{{ serverDetail.memInfo.memUseRate || 0 }}%</div>
            </div>
            <div class="describe-container">
              <div class="describe-main-title">内存</div>
              <div class="describe-main">
                <p>{{ serverDetail.memInfo.memFree || 0 }}/{{ serverDetail.memInfo.memSize || 0 }} GB</p>
              </div>
            </div>
          </div>

          <!-- 磁盘 -->
          <div class="single-server-state-item single-server-state-item2">
            <div class="chart-wrap">
              <div class="chart-container chart-container2">
                <div class="chart-main" :style="{ height: serverDetail.diskInfo[0].diskUsekRate + '%' }"></div>
                <div>{{ serverDetail.diskInfo[0].diskUsekRate || 0 }}%</div>
              </div>
              <div>/root</div>
            </div>
            <div class="chart-wrap">
              <div class="chart-container chart-container2">
                <div class="chart-main" :style="{ height: serverDetail.diskInfo[1].diskUsekRate + '%' }"></div>
                <div>{{ serverDetail.diskInfo[1].diskUsekRate || 0 }}%</div>
              </div>
              <div>/opt</div>
            </div>
            <div class="chart-wrap">
              <div class="chart-container chart-container2">
                <div class="chart-main"  :style="{ height: serverDetail.diskInfo[2].diskUsekRate + '%' }"></div>
                <div>{{ serverDetail.diskInfo[2].diskUsekRate || 0 }}%</div>
              </div>
              <div>/swap</div>
            </div>
            <div class="chart-wrap">
              <div class="chart-container chart-container2">
                <div class="chart-main" :style="{ height: serverDetail.diskInfo[3].diskUsekRate + '%' }"></div>
                <div>{{ serverDetail.diskInfo[3].diskUsekRate || 0 }}%</div>
              </div>
              <div>/var</div>
            </div>
            <div class="chart-wrap">
              <div class="chart-container chart-container2">
                <div class="chart-main"  :style="{ height: serverDetail.diskInfo[4].diskUsekRate + '%' }"></div>
                <div>{{ serverDetail.diskInfo[4].diskUsekRate || 0 }}%</div>
              </div>
              <div>/home</div>
            </div>

            <div class="describe-container">
              <div class="describe-main-title">磁盘</div>
              <div class="describe-main">
                <p>/root：{{ serverDetail.diskInfo[0].diskFree || 0 }}/{{ serverDetail.diskInfo[0].diskSize || 0 }} GB</p>
                <p>/opt：{{ serverDetail.diskInfo[1].diskFree || 0 }}/{{ serverDetail.diskInfo[1].diskSize || 0 }} GB</p>
                <p>/swap：{{ serverDetail.diskInfo[2].diskFree || 0 }}/{{ serverDetail.diskInfo[2].diskSize || 0 }} GB</p>
                <p>/var:    {{ serverDetail.diskInfo[3].diskFree || 0 }}/{{ serverDetail.diskInfo[3].diskSize || 0 }} GB</p>
                <p>/home：{{ serverDetail.diskInfo[4].diskFree || 0 }}/{{ serverDetail.diskInfo[4].diskSize || 0 }} GB</p>
              </div>
            </div>
          </div>

          <!-- 以太网 -->
          <div class="single-server-state-item">
            <div class="chart-container">
              <div class="chart-main" :style="{ height: serverDetail.netInfo.netUseRate + '%' }"></div>
              <div class="chart-desc">{{ serverDetail.netInfo.netUseRate || 0 }}%</div>
            </div>
            <div class="describe-container">
              <div class="describe-main-title">以太网</div>
              <div class="describe-main">
                <p>发送：{{ serverDetail.netInfo.netTxRate || 0 }} Kbps</p>
                <p>接收：{{ serverDetail.netInfo.netRxRate || 0 }} Kbps</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- <div class="btn-container">
        <el-button size="small">启用</el-button>
        <el-button size="small">停止</el-button>
        <el-button size="small">重启服务</el-button>
      </div> -->

      <!-- 服务器信息 -->
      <div class="">
        <div class="list-box-table">
          <el-table
            stripe
            border
            size="medium"
            :data="serverDetail.serInfo"
            highlight-current-row
            ref="Table"
            height="100%"
            style="width: 100%;height: 100%;"
          >
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
            <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
            <el-table-column label="服务名称" :sortable="false"  show-overflow-tooltip align="center" :resizable="true">
              <template slot-scope="scope">
                  <!-- UKNOW_SERV = 0;  //未知服务
                  S_DA = 1;    //设备接入服务
                  S_ES = 2;    //报警服务
                  S_PS = 3;    //定时服务
                  S_LG = 4;    //认证服务 -->
                  <span v-if="scope.row.servFlag == 0">未知服务</span>
                  <span v-else-if="scope.row.servStatus == 1">设备接入服务</span>
                  <span v-else-if="scope.row.servStatus == 2">报警服务</span>
                  <span v-else-if="scope.row.servStatus == 3">定时服务</span>
                  <span v-else-if="scope.row.servStatus == 4">认证服务</span>
                </template>
            </el-table-column>
            <el-table-column  label="状态" :sortable="false"  show-overflow-tooltip align="center" :resizable="true">
                <template slot-scope="scope">
                    <span v-if="scope.row.servStatus == 1" style="color:#67C23A">正常</span>
                    <span v-else-if="scope.row.servStatus == 2" style="color:#F56C6C">异常</span>
                    <span v-else>未知</span>
                </template>
            </el-table-column>
            <el-table-column  prop="servFlag" label="简称" :sortable="false"  show-overflow-tooltip align="center" :resizable="true"></el-table-column>
          </el-table>
        </div>
      </div>

    </div>

</template>

<script>
import {
  getSysServerinfoApi,
} from '@src/http/systemstate/anomaly.api.js'

export default {
  data(){
    return {
      serverDetail:{
        cpuInfo:{},
        diskInfo:[
          {
            diskUsekRate:''
          },
          {
            diskUsekRate:''
          },
          {
            diskUsekRate:''
          },
          {
            diskUsekRate:''
          },
          {
            diskUsekRate:''
          }
        ],
        memInfo:{},
        netInfo:{},
        runTime:'',
        serInfo:[]
      },  //服务器运行状态详情
      serverInfoList: [
        // {
        //   id:15,
        //   name:'设备接入服务',
        //   state:'1',
        //   sub_name:'DA',
        // },
        // {
        //   id:15,
        //   name:'报警服务',
        //   state:'1',
        //   sub_name:'ES',
        // },
        // {
        //   id:15,
        //   name:'定时服务',
        //   state:'2',
        //   sub_name:'PS',
        // },
        // {
        //   id:15,
        //   name:'认证服务',
        //   state:'1',
        //   sub_name:'LG',
        // }
      ],

      resizable:true,
    }
  },
  props:{
    componentTitle: {
      type: String,
      default: ''
    },
    ipAddr:{
      type:String,
      default:""
    }
  },
  computed:{
  },
  methods:{

    // 刷新
    reload(){
      this.getsysServerinfo();
    },

    // 返回
    back(){
        this.$emit('changeComponent', 'Index', '服务器监控');
    },

    // 获取服务器状态详情
    getsysServerinfo(){
      var params = {
        // ip:'192.168.22.33'
        // orgId:'340000000',
        orgId:JSON.parse(window.sessionStorage.getItem("user")).org,
        ip:this.ipAddr
      };
      getSysServerinfoApi(params).then(res => {
        if(res.data.code == 0 ){
          var serverDetail = res.data.data;
          this.serverDetail = serverDetail;

          this.$notify({
            title: '成功',
            message: '数据加载成功',
            type: 'success',
            position: 'bottom-right'
          });
          
        }
      }).catch(err => {
          this.Error(err)
        });
    }

  },
  created(){
    console.log(this.ipAddr)
    this.getsysServerinfo();
  },
  mounted(){
    
  },
  destroyed(){},
}
</script>

<style lang="less" scoped>
  
  
  .btn-container{
    padding:15px 0;
  }

  .single-server-state{
    // width: 1200px;
  }
  .single-server-state-title{
    font-size: 16px;
    padding-left:15px;
    line-height: 35px;
  }
  .single-server-state-container{
    overflow: hidden;
    // border-top:1px solid #efefef;
    border-bottom:1px solid #efefef;
    padding: 15px 0;
  }
  .single-server-state-container .single-server-state-item{
    width: 20%;
    height: 165px;
    float: left;
    margin-right: 2%;
    border:1px solid #ddd;
    display: flex;
    justify-content: center;
    padding-top: 15px;
  }
    .single-server-state-container .single-server-state-item2{
      width: 34%;
    }
  .single-server-state-container .single-server-state-item:last-child{
    margin-right: 0;
  }
  .chart-wrap{
    text-align: center;
    margin-right:15px;
    color: #888;
  }
  .chart-container{
    width: 70px;
    height: 80px;
    display: flex;
    flex-direction:column-reverse;
    background-color: #efefef;
    text-align: center;
  }
  .chart-container2{
    width: 40px;
  }
  .chart-main{
    width: 100%;
    background-color:aqua;
  }
  .describe-container{
    padding-left:10px;
  }
  .describe-main-title{
    font-size: 16px;
    color: #222;
    font-weight:bold;
    line-height: 35px;
  }
  .describe-main{
    font-size: 14px;
    color: #606266;
  }

  .server-info-con{
      display: flex;
      flex-wrap:wrap;
      border-top:1px solid #efefef;
    border-bottom:1px solid #efefef;
    padding: 15px 15px;
  }
  .server-info-item{
    width: 20%;
    font-size: 14px;
    color: #333;
    line-height: 30px;
  }
  .server-info-item2{
      width: 20%;
  }

</style>
