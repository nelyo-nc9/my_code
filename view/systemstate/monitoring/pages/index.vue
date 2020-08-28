
<template>
  <!-- 服务器监控首页 -->

    <div class="">
      <div class="btn-container">
        <el-button size="small"  @click="reload">刷新</el-button>
      </div>

      <!-- 单个服务器运行状况 -->
      <div class="single-server-state">
        <div class="single-server-state-title">服务器名称：{{ serverDetail[0].serverName }}</div>
        <div class="single-server-state-container">
          <!-- cpu -->
          <div class="single-server-state-item">
            <div class="chart-container">
              <div class="chart-main" :style="{ height: serverDetail[0].cpuInfo.cpuUseRate + '%' }"></div>
              <div class="chart-desc">{{ serverDetail[0].cpuInfo.cpuUseRate || 0 }}%</div>
            </div>
            <div class="describe-container">
              <div class="describe-main-title">CPU</div>
              <div class="describe-main">
                <p>负载：{{ serverDetail[0].cpuInfo.cpuLoad?serverDetail[0].cpuInfo.cpuLoad.join(','):''  || 0}}</p>
              </div>
            </div>
          </div>

          <!-- 内存 -->
          <div class="single-server-state-item">
            <div class="chart-container">
              <div class="chart-main" :style="{ height: serverDetail[0].memInfo.memUseRate + '%' }"></div>
              <div class="chart-desc">{{ serverDetail[0].memInfo.memUseRate  || 0}}%</div>
            </div>
            <div class="describe-container">
              <div class="describe-main-title">内存</div>
              <div class="describe-main">
                <p>{{ serverDetail[0].memInfo.memFree  || 0}}/{{ serverDetail[0].memInfo.memSize || 0 }} GB</p>
              </div>
            </div>
          </div>

          <!-- 磁盘 -->
          <div class="single-server-state-item single-server-state-item2">
            <div class="chart-wrap">
              <div class="chart-container chart-container2">
                <div class="chart-main" :style="{ height: serverDetail[0].diskInfo[0].diskUsekRate + '%' }"></div>
                <div>{{ serverDetail[0].diskInfo[0].diskUsekRate  || 0}}%</div>
              </div>
              <div>/root</div>
            </div>
            <div class="chart-wrap">
              <div class="chart-container chart-container2">
                <div class="chart-main" :style="{ height: serverDetail[0].diskInfo[1].diskUsekRate + '%' }"></div>
                <div>{{ serverDetail[0].diskInfo[1].diskUsekRate || 0 }}%</div>
              </div>
              <div>/opt</div>
            </div>
            <div class="chart-wrap">
              <div class="chart-container chart-container2">
                <div class="chart-main"  :style="{ height: serverDetail[0].diskInfo[2].diskUsekRate + '%' }"></div>
                <div>{{ serverDetail[0].diskInfo[2].diskUsekRate || 0 }}%</div>
              </div>
              <div>/swap</div>
            </div>
            <div class="chart-wrap">
              <div class="chart-container chart-container2">
                <div class="chart-main" :style="{ height: serverDetail[0].diskInfo[3].diskUsekRate + '%' }"></div>
                <div>{{ serverDetail[0].diskInfo[3].diskUsekRate || 0 }}%</div>
              </div>
              <div>/var</div>
            </div>
            <div class="chart-wrap">
              <div class="chart-container chart-container2">
                <div class="chart-main"  :style="{ height: serverDetail[0].diskInfo[4].diskUsekRate + '%' }"></div>
                <div>{{ serverDetail[0].diskInfo[4].diskUsekRate || 0 }}%</div>
              </div>
              <div>/home</div>
            </div>

            <div class="describe-container">
              <div class="describe-main-title">磁盘</div>
              <div class="describe-main">
                <p>/root：{{ serverDetail[0].diskInfo[0].diskFree || 0 }}/{{ serverDetail[0].diskInfo[0].diskSize || 0 }} GB</p>
                <p>/opt：{{ serverDetail[0].diskInfo[1].diskFree || 0 }}/{{ serverDetail[0].diskInfo[1].diskSize || 0 }} GB</p>
                <p>/swap：{{ serverDetail[0].diskInfo[2].diskFree || 0 }}/{{ serverDetail[0].diskInfo[2].diskSize || 0 }} GB</p>
                <p>/var:    {{ serverDetail[0].diskInfo[3].diskFree || 0 }}/{{ serverDetail[0].diskInfo[3].diskSize || 0 }} GB</p>
                <p>/home：{{ serverDetail[0].diskInfo[4].diskFree || 0 }}/{{ serverDetail[0].diskInfo[4].diskSize || 0 }} GB</p>
              </div>
            </div>
          </div>

          <!-- 以太网 -->
          <div class="single-server-state-item">
            <div class="chart-container">
              <div class="chart-main" :style="{ height: serverDetail[0].netInfo.netUseRate + '%' }"></div>
              <div class="chart-desc">{{ serverDetail[0].netInfo.netUseRate || 0 }}%</div>
            </div>
            <div class="describe-container">
              <div class="describe-main-title">以太网</div>
              <div class="describe-main">
                <p>发送：{{ serverDetail[0].netInfo.netTxRate }} Kbps</p>
                <p>接收：{{ serverDetail[0].netInfo.netRxRate }} Kbps</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="btn-container">
        <el-button size="small"  @click="thresholdConfig">异常阈值配置</el-button>
      </div>

      <!-- 服务器列表 -->
      <div class="server-list">
        <div class="list-box-table">
          <el-table
            stripe
            border
            size="medium"
            :data="serverList"
            highlight-current-row
            ref="Table"
            height="100%"
            style="width: 100%;height: 100%;"
          >
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
            <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
            <el-table-column  prop="serverName" label="服务器名称" :sortable="false"  show-overflow-tooltip align="center" :resizable="true"></el-table-column>
            <el-table-column  prop="orgName" label="所属机构" :sortable="false"  show-overflow-tooltip align="center" :resizable="true"></el-table-column>
            <el-table-column  label="状态" :sortable="false"  show-overflow-tooltip align="center" :resizable="true">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 1" style="color:#67C23A">正常</span>
                    <span v-else-if="scope.row.status == 2" style="color:#F56C6C">异常</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column  prop="detail.cpuInfo.cpuUseRate" label="CPU使用率" :sortable="false"  show-overflow-tooltip align="center" :resizable="true"></el-table-column>
            <el-table-column  prop="detail.memInfo.memUseRate" label="内存使用率" :sortable="false"  show-overflow-tooltip align="center" :resizable="true"></el-table-column>
            <el-table-column label="磁盘状态" :sortable="false"  show-overflow-tooltip align="center" :resizable="true">
                <template slot-scope="scope">
                    <span v-if="scope.row.dist_status == 1" style="color:#67C23A">正常</span>
                    <span v-else-if="scope.row.dist_status == 2" style="color:#F56C6C">异常</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column  prop="detail.netInfo.netUseRate" label="以太网使用率" :sortable="false"  show-overflow-tooltip align="center" :resizable="true"></el-table-column>
            <el-table-column  prop="ipAddr" label="IP地址"  :sortable="false"  show-overflow-tooltip align="center" :resizable="true"></el-table-column>
            <el-table-column  prop="system" label="操作系统" :sortable="false"  show-overflow-tooltip align="center" :resizable="true">
              <template slot-scope="scope">
                    <span v-if="scope.row.system == 1">Linux</span>
                    <span v-else-if="scope.row.system == 2">Windows</span>
                    <span v-else>未知</span>
                </template>
            </el-table-column>
            <el-table-column  prop="detail.serInfo.length" label="服务数"  :sortable="false"  show-overflow-tooltip align="center" :resizable="true"></el-table-column>
            <el-table-column label="服务器详情" :sortable="false"  show-overflow-tooltip align="center" :resizable="true">
              <template slot-scope="scope">
                <el-button @click="linkServerInfo(scope.row.ipAddr)" type="text" size="small">查看详情</el-button>
              </template>
            </el-table-column>

            <!-- <el-table-column
              v-for="(column, index) in columns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable"
            ></el-table-column> -->
          </el-table>
        </div>
      </div>

    </div>

</template>

<script>

import {
  getSysServerListinfoApi,getThresholdcfgApi
} from '@src/http/systemstate/anomaly.api.js'

export default {
  data(){
    return {
      // columns: [
      //   { prop: 'userName', sortable: true, label: '服务器名称', width: '120' },
      //   { prop: 'name', sortable: true, label: '所属机构', width: '100' },
      //   { prop: 'orgName', sortable: true, label: '状态', width: '120' },
      //   { prop: 'roleName', sortable: true, label: 'CPU使用率', width: '180' },
      //   { prop: 'startTime', sortable: true, label: '内存使用率', width: '120' },
      //   { prop: 'endTime', sortable: true, label: '磁盘状态', width: '120' },
      //   { prop: 'ip', sortable: true, label: '以太网使用率', width: '160' },
      //   { prop: 'mac', sortable: true, label: 'IP地址', width: '180' },
      //   { prop: 'description', sortable: true, label: '操作系统', width: '150' },
      //   { prop: 'createUid', sortable: true, label: '服务数', width: '180' },
      //   { prop: 'createOrgId', sortable: true, label: '服务器详情', width: '180' },
      // ],
      // 服务器运行状态
      serverDetail:[
        {
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
        }
      ],
      serverList: [
        // {
        //   id:15,
        //   name:'服务器1',
        //   belong:'保定分行',
        //   state:'1',
        //   usage_cpu:'30%',
        //   usage_memory:'15%',
        //   disk_state:'1',
        //   usage_ethernet:'50%',
        //   ip_address:'192.168.1.10',
        //   system:'linux',
        //   server_count:0,
        // },
        // {
        //   id:15,
        //   name:'服务器1',
        //   belong:'保定分行',
        //   state:'2',
        //   usage_cpu:'30%',
        //   usage_memory:'15%',
        //   disk_state:'1',
        //   usage_ethernet:'50%',
        //   ip_address:'192.168.1.10',
        //   system:'linux',
        //   server_count:0,
        // }
      ],  // 服务器列表

      thresholdConfigData:{
          cpu:'',  // CPU阈值
          mem:'',  // 内存阈值
          diskRoot:'',  // 磁盘/root异常阈值
          diskOpt:'',  // 磁盘/opt异常阈值
          diskSwap:'',  // 磁盘/swap异常阈值
          diskVar:'',  // 磁盘/var异常阈值
          diskHome:'',  // 磁盘/home异常阈值
          network:'',  // 网络异常阈值
          frequency:'',  // 数据刷新频率
          intervals:'10',  // 异常持续间隔时间
          // file:'',
      },  //  阈值配置信息

      timer : null,  // 设一个定时器 用来根据 异常阈值配置中的刷新频率 来对服务器监控页面进行刷新

    }
  },
  computed:{
  },
  methods:{

    // 获取阈值配置信息
    getThresholdcfg(){
        var params = {

        };
        getThresholdcfgApi(params).then( res => {
            if( res.data.code == 0){
                this.thresholdConfigData = res.data.data;
                var frequency = parseInt(res.data.data.frequency);
                
                if(frequency){
                  this.timer = setInterval( () => {
                    console.log(frequency)
                    this.getSysServerListinfo();
                  },frequency*1000)
                }
                
            }
        }).catch( error => {

        });
    },

    // 获取服务器列表和 第一个服务器运行状态
    getSysServerListinfo(){
      var params = {
        // orgId:'340000000'
        orgId:JSON.parse(window.sessionStorage.getItem("user")).org,
      }
      getSysServerListinfoApi(params).then( res => {
        var res = res.data;
        if(res.code == 0){
          var serverList = res.data.server.list;
          var serverDetail = res.data.detail.serverDetail;
          for(var i=0; i<serverDetail.length; i++){
            var ipAddr = serverDetail[i].serverIp;
            for(var j=0;j<serverList.length;j++ ){
              // 将有服务器状态的信息跟对应的服务器进行匹配（通过id地址）
              if( ipAddr == serverList[j].ipAddr){
                serverList[j].detail = serverDetail[i];
                serverDetail[i].serverName =  serverList[j].serverName;
              }
            }
          }

          // 通过对比阈值配置来判断服务器状态和磁盘状态
          var thresholdConfigData = this.thresholdConfigData;  // 阈值配置信息
          for(var k=0;k<serverList.length;k++){
            if(serverList[k].detail){
              // 如果当前数据有相匹配的服务器状态信息
              // 判断磁盘状态
              var diskInfo = serverList[k].detail.diskInfo;
              if(diskInfo[0]>=thresholdConfigData.diskRoot || diskInfo[1]>=thresholdConfigData.diskOpt || diskInfo[2]>=thresholdConfigData.diskSwap || diskInfo[3]>=thresholdConfigData.diskVar || diskInfo[4]>=thresholdConfigData.diskHome){
                // 磁盘状态 异常
                serverList[k].dist_status = "2";
                serverList[k].status = "2";
              }else{
                // 磁盘状态 正常
                serverList[k].dist_status = "1";
                // 判断服务器状态  根据 内存状态 cpu状态 以太网状态判定
                if(serverList[k].detail.cpuInfo.cpuUseRate>=thresholdConfigData.cpu || serverList[k].detail.memInfo.memUseRate>=thresholdConfigData.mem || serverList[k].detail.netInfo.netUseRate>=thresholdConfigData.network){
                  serverList[k].status = "2";
                }else{
                  serverList[k].status = "1";
                }
              }

            }else{
              serverList[k].status = "";
              serverList[k].dist_status = "";
            }
          }


          this.serverList = serverList
          this.serverDetail = serverDetail;

          this.$notify({
            title: '成功',
            message: '数据加载成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
      }).catch( error => {

      });
    },

    // 刷新
    reload(){
      this.getSysServerListinfo();
    },

    // 异常阈值配置
    thresholdConfig(){
        this.$emit('changeComponent', 'ThresholdConfig', '异常阈值配置')
    },
    
    // 服务器查看详情
    linkServerInfo(ipAddr){
      console.log(ipAddr)
      this.$emit('changeComponent', 'ServerInfo', '服务状态监控', ipAddr);
    },

  },

  beforeCreate(){
    
  },
  created(){
    this.getSysServerListinfo();
  },
  mounted(){},
  destroyed(){
    clearInterval(this.timer);
  },
}
</script>

<style lang="less" scoped>
  
  
  .btn-container{
    padding:15px 0;
  }
  .list-box-table{
    height: 500px;
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
    border-top:1px solid #efefef;
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
  .chart-desc{
    font-size: 12px;
    color: #606266;
    line-height: 20px;
  }

</style>
