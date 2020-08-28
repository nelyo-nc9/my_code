<template>
  <div>
    <div class="box">
      <div class="groupChat">
        <div class="right-box">
          <h3>本机话筒</h3>
        </div>
        <div v-for="item in list" :key="item.id">
          <div class="right-box">
               <div class="facilityName">
                 <span>T1对讲话筒-应急指挥</span>
               </div>
               <div class="btn">
                 <el-button>移除</el-button>
               </div>
               <div class="spanName">
                 <span>丰收路支行>远程监控中心>对讲主机2-办公区域</span>
               </div>
          </div>
        </div>

        <div class="right-box">
          <span class="spanText">添加左侧设备至对讲组</span>
        </div>
      </div>

      <div class="function-btn">
        <el-row>
          <el-button size="mini" @click="speak">开始对讲</el-button>
          <el-button size="mini" @click="allRemove">全部移除</el-button>
          <el-button size="mini" @click="dialogFormVisibleS()">保存分组</el-button>
        </el-row>
        <config v-show="flag" class="grouping" @btn="cbtn" :arrlist="arrlist"></config>
        <div class="audio-tape"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import config from './config'
export default {
  props: ['arr'],
  components: {
    config
  },
  data() {
    return {
      arrlist: [],
      list: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      flag: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      myMike: {
        name: '话筒1',
        serverId: '111',
        serverPort: 2048,
        serverIp: '192.168.14.208',
        ip: '192.168.14.203',
        port: '2046',
        id: '002',
        panelId: '',
        type: 1 //1话筒，2面板
      },
      panelArr: [
        {
          name: '面板1',
          serverId: '111',
          serverPort: 2048,
          serverIp: '192.168.14.208',
          ip: '192.168.14.202',
          port: '2046',
          id: '003',
          panelId: '1',

          type: 2 //1话筒，2面板
        },
        {
          name: '面板2',
          serverId: '111',
          serverPort: 2048,
          serverIp: '192.168.14.208',
          ip: '192.168.14.202',
          port: '2046',
          id: '003',
          panelId: '2',
          type: 2 //1话筒，2面板
        },
        {
          name: '面板3',
          serverId: '111',
          serverPort: 2048,
          serverIp: '192.168.14.208',
          ip: '192.168.14.204',
          port: '2046',
          id: '004',
          panelId: '1',
          type: 2 //1话筒，2面板
        }
      ]
    }
  },
  created() {
    console.log(this.arr)
  },
  methods: {
    cbtn() {
      this.flag = !this.flag
    },
    // 开始对讲
    speak() {
      let panelArr = this.panelArr
      let mik = this.myMike

      let callerInfo = {
        id: mik.id,
        ip: mik.ip,
        port: parseInt(mik.port)
      }
      let obj = {
        serverId: mik.serverId,
        serverIp: mik.serverIp,
        serverPort: parseInt(mik.serverPort),
        callerInfo: JSON.stringify(callerInfo)
      }
      let duijiang1 = panelArr[0]
      /*if(duijiang1.type=="1"){
            mikeInfo={

            }
      }*/
      let calledInfo = []
      if (duijiang1.type == '2') {
        let info = {
          hostIp: duijiang1.ip,
          hostPort: parseInt(duijiang1.port),
          hostId: duijiang1.id,
          id: parseInt(duijiang1.panelId)
        }
        calledInfo.push(info)
      }
      if (calledInfo.length == 0) {
        alert('被叫的信息不能为空')
        return false
      }
      obj.calledInfo = JSON.stringify(calledInfo)
      this.postMicrophone(obj).then(
        res => {
          if (res.code == 0) {
            obj.seqId = res.data.seqId
            let inof = localStorage.setItem('duijiang', JSON.stringify(obj))
          }
          let info = res.data
          console.log(res, '开始对讲')
        },
        rej => {
          console.log(res, '开始对讲')
        }
      )
    },

    // 移除单个对讲组成员
    undock(val) {
      var called = []
      var panel = this.panelArr
      let calledObj = {
        hostIp: panel[2].ip,
        hostPort: parseInt(panel[2].port),
        hostId: panel[2].id,
        id: parseInt(panel[2].panelId)
      }
      called.push(calledObj)
      // console.log(called)

      let inof = localStorage.getItem('duijiang')
      let result = JSON.parse(inof)

      let mikeInfo = {
        ip: calledObj.hostIp,
        id: calledObj.hostId,
        port: calledObj.hostPort
      }
      let obj = {
        seqId: result.seqId,
        serverIp: result.serverIp,
        serverPort: result.serverPort
        //boardInfo:called,
        //mikeInfo :[mikeInfo]
      }
      //console.log(mikeInfo);

      if (called) {
        obj.boardInfo = JSON.stringify(called)
      }
      console.log(obj)

      this.postDeleteMember(obj).then(
        res => {
          console.log(res, '移除单个对讲组成员')
        },
        rej => {
          console.log(res, '保存分组')
        }
      )
    },
    // 全部删除对讲组成员
    allRemove() {
      let delObj = []
      this.panelArr.map(item => {
        let { id, ip, port } = item
        delObj.push({
          id,
          ip,
          port
        })
      })
      console.log(' 查看删除的数据', delObj)

      let panel = this.panelArr

      let called = []
      panel.forEach(item => {
        called.push({ hostIp: item.ip, hostPort: item.port, hostId: item.id })
      })
      console.log(called)

      let inof = localStorage.getItem('duijiang')
      let result = JSON.parse(inof)

      let obj = {
        seqId: result.seqId,
        serverIp: result.serverIp,
        serverPort: result.serverPort,
        mikeInfo: JSON.stringify(delObj),
        boardInfo: JSON.stringify(called)
      }

      this.postDeleteMember(obj).then(
        res => {
          console.log(res, '添加对讲组成员')
        },
        rej => {
          console.log(res, '保存分组')
        }
      )
    },

    // 保存分组
    dialogFormVisibleS() {
      this.flag = !this.flag
      this.arrlist = this.arr
      console.log(this.arrlist)
    },
    confirm() {
      // this.postSaveGrouping().then(
      //   res => {
      //     console.log(res, '保存分组')
      //   },
      //   rej => {
      //     console.log(res, '保存分组')
      //   }
      // )
    },
    ...mapActions('manyIntercom', {
      postMicrophone: 'postMicrophone',
      postDeleteMember: 'postDeleteMember',
      postSaveGrouping: 'postSaveGrouping',
      postAddMember: 'postAddMember'
    })
  }
}
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 550px;
  z-index: -1;
  //   flex-wrap: wrap;
  //   align-content: flex-start;
  .groupChat {
    width: 1400px;

    display: flex;
    flex: 1 1 360px;
    flex-wrap: wrap;
    overflow-y: auto;
    .right-box {
      position: relative;
      margin: 2px 10px;
      width: 280px;
      height: 149px;
      border: 1px solid #bcbcbc;
      display: flex;
      // justify-content: space-around;
      flex-direction:column;
      .facilityName{
        width: 200px;
        margin: 35px 8px 13px 36px;
        text-align: center;
       }
       .btn{
         width: 200px;
        margin: 0 auto;
        text-align: center;
       }
       .spanName{
         width: 260px;
        margin: 15px 0 0 7px;
       }
      .spanText {
        text-align: center;
        line-height: 88px;
        margin-left: -21px;
      }
      
      /deep/ h3 {
        position: absolute;
        text-align: center;
        top: 65px;
        left: 100px;
        //margin: 65px -9px 0px 32px;
      }
    }
  }

  .function-btn {
    position: absolute;
    top: 750px;
    display: flex;
    margin-top: 20px;
    /deep/ .el-button--default {
      margin-right: 13px;
    }
    /deep/ .el-dialog {
      height: 450px !important;
    }
     .grouping {
      position: absolute;
      top: -672px;
      left: 300px;
      background-color: white;
    }
    .audio-tape {
      flex: 1;
      margin: 13px 0 0 35px;
    }
  }
}
</style>
