<template>
  <div id="treeSearch">
    <!-- table -->
    <div class="tabRight" ref="getHeight">
      <!-- table -->
      <div class="typeSearch" v-show="!isType">
        <el-form label-width="100px" label-position="right" size="mini">
          <el-button size="mini" class="btn" @click="exportFile">下载 </el-button>
        </el-form>

        <!-- 设备列表 （前端分页）-->
        <div class="tables">
          <el-table
            :border="true"
            :stripe="true"
            :data="equipment_list.slice(start,stop)"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            
            <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
            <el-table-column prop="orgName" label="机构" width="180" align="center"></el-table-column>
            <el-table-column prop="name" label="重点部位" width="180" align="center"></el-table-column>
            <el-table-column prop="type"  label="类型" align="center"> 
              <template slot-scope="scope">
                <span v-if="scope.row.type ==1">面板</span>
                <span v-else >通道</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
            <el-table-column prop="platformIp" label="设备IP" align="center"></el-table-column>
 
            <el-table-column  prop="status" label="设备状态" align="center">
              <!-- status  1在线 2离线 3未知 -->
              <!-- <template slot-scope="scope">
                <span v-if="scope.row.status ==1">在线</span>
                <span v-else-if="scope.row.status ==2" >离线</span>
                <span v-else>未知</span>
              </template> -->
            </el-table-column>

            <el-table-column prop="runStatus" label="通话状态" align="center">
              <!-- runStatus  1离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中 -->
              <!-- <template slot-scope="scope">
                <span v-if="scope.row.runStatus == 1">离线</span>
                <span v-else-if="scope.row.runStatus == 2" >空闲</span>
                <span v-else-if="scope.row.runStatus == 3" >呼出</span>
                <span v-else-if="scope.row.runStatus == 4" >响铃</span>
                <span v-else-if="scope.row.runStatus == 5" >对讲中</span>
                <span v-else-if="scope.row.runStatus == 6" >广播中</span>
                <span v-else >未知状态</span>
              </template> -->
            </el-table-column>
           
          </el-table>
          <div class="block">
            <span class="demonstration"></span>
            <audio-Paination ref="listPagination" class="pagination" :total="pageListArr.length" @paginationConfChange="paginationConfChange"></audio-Paination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import AudioPaination from "../components/AudioPagination"
import { mapActions, mapState, mapMutations } from 'vuex'
import { download } from '@src/common/download.js'
 
export default {
  props:["pageListArr"],
  components: {
    AudioPaination
  },
  data() {
    return {
      activeData:[],
      isType: false,
      filterText: '',
      start:0, 
      stop:10,
      menuLists: ['智慧安防'],
      statusInfo:['离线', '空闲', '呼出', '响铃', '对讲中', '广播中'],
      tableData: [],
      total: 0,
      showSubOrg:false,
      activeCreate: true,
      activePrint: false,
      pageSize: 25,
      page: 1,
    }
  },


  filters: {
    getType: function (value) {
      console.log('this.statusInfo[value-1]',this.statusInfo[value - 1])
      return  this.statusInfo[value - 1]
    }
  },
  computed:{
    // getActiveDData(){
    //   var _this = this
    //   console.log('_this.pageListArr',_this.pageListArr)
    //   return  _this.pageListArr.slice(0,10)
    // },
    // 设备列表
    equipment_list(){
      var list = JSON.parse(JSON.stringify(this.pageListArr));
      console.log(list)
      list.forEach( (item) => {
        // 在线离线 状态
        if(item.status == 1){
          item.status = '在线';
        }else if(item.status == 2){
          item.status = '离线';
        }else{
          item.status = '未知';
        }

        // 运行状态
        // runStatus  1 离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
        if(item.runStatus == 1){
          item.runStatus = '离线';
        }else if(item.runStatus == 2){
          item.runStatus = '空闲';
        }else if(item.runStatus == 3){
          item.runStatus = '呼出';
        }else if(item.runStatus == 4){
          item.runStatus = '响铃';
        }else if(item.runStatus == 5){
          item.runStatus = '对讲中';
        }else if(item.runStatus == 6){
          item.runStatus = '广播中';
        }else{
          item.runStatus = '未知';
        }
      })

      return list;
    },

  },
  watch: {
    filterText(searchVal) {
      this.$refs.tree.filter(searchVal)
    },
    // pageListArr:{
    //   handler(newD){
    //     var page = this.page;
    //     var pageSize = this.pageSize;
    //     this.activeData =  newD.splice(page,pageSize)
    //   },
      
    // }
  },
  methods: {
    // 翻页触发事件
    paginationConfChange(obj) {
      console.log(obj);
      this.start = (obj.page-1) * obj.limit;
      this.stop = obj.page * obj.limit;
    },
    //门禁管理显示Type切换
    isShowAisleTable() {
      this.isType = !this.isType
    },
    tableRowClassName({ row, rowIndex }) {
      // console.log(row, rowIndex)
      if (rowIndex % 2 == 1) {
        return 'warning-row'
      }
    },
    //   筛选
    fit(val) {},
    onSubmit() {
      // console.log('submit!')
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    //门禁通道类型筛选
    typeFilter() {},
    handleCurrentItem(val) {
      this.selectData = [val]
      console.log(val, this.selectData, '列表当前项')
    },
    clearSelectData() {
      this.selectData = []
    },
    ...mapActions('resource', {
      getPaging: 'getPaging'
    }),

    // 导出
    exportFile() {
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      const tHeader = ['序号','机构', '重点部位', '设备类型','资源名称', '设备IP','设备状态','通话状态']
      const filterVal = ['index','orgName', 'name', 'type', 'name','platformIp','status','runStatus']
      // if (this.selectData && this.selectData.length > 0) {
      // let list = this.selectData
      let list = this.$lodash.cloneDeep(this.equipment_list);
      // const data = list.map((v, index) => filterVal.map(j => v[j]))
      list.forEach((item, index) => {
        item.index = index + 1
        if (item.type ==1) {
          item.type = '面板'
        } else {
          item.type = '通道'
        }
      })
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '对讲资源')
      // } else {
        // let params = {
        //   pattern: 'list',
        //   status: this.status,
        //   orgId: this.currentOrgId,
        //   keyPartId: this.currentKeyPartId || '',
        //   rescusive: this.showSubOrg,
        //   key: this.keyword
        // }
        // // zp去掉url中间的/host
        // let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/video/download/host`
        // let name = `视频主机导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        // download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) }, () => {}, 'post', params)
      // }
    },
     // 导出第二步
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    ...mapActions('resource',{
      getDownload:'getDownload'
    })
  },
  
  mounted() {
    this.menuLists.push(this.$route.meta.menu)
    let res = document.querySelectorAll('.menuList span')
    console.log(this.getActiveData,'pageListArr000000000')
    this.$refs.listPagination.limit = this.pageSize
  },
  created() {
    // this.activeData =JSON.parse(this.getActiveData).splice(0,pageSize)
    // let obj = {
    //   page: 1,
    //   limit: 100,
    //   type: 4
    // }
    // this.getPaging(obj).then(
    //   res => {
    //     console.log(res)
    //     let { data } = res.data
    //     // this.tableData = data.data
    //     //this.total = data.count.total
    //   },
    //   rej => {
    //     console.log(res, 2)
    //   }
    // )
  }
}
</script>

<style lang="less" scope>
// @import '/ccb-client/client/src/common/iconfonts.css';
#treeSearch {
  background: #fff;
  padding: 20px 0;
  display: flex;
  height: 100vh;
  .treeLeft {
    width: 250px;
    height: 100vh;
  }
  .tabRight {
    height: 100vh;
    // border-left: 1px solid #e6e6e6;
    // height: 100vh
    width: calc(100vh - 250px);
    flex: 1;
    .meunHost {
      margin-left: 20px;
    }
    .typeSearch {
      // border-bottom: 1px solid #ebebeb;
      // margin-top: -41px;
      .btn {
        
      }
      /deep/ .el-form-item {
        display: inline-block !important;
        margin: 0 15px !important;
      }
      .tables {
        margin: 10px 0;
        .block {
          text-align: center;
          margin: 20px 0;
          margin-left: -190px;
        }
      }
    }
    // .a {
    //   display: flex;
    // }
  }
}
</style>


