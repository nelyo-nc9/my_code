<template>
  <div class="center-table">
    <!-- query查询 -->
    <div class="query">
      <el-button size="small">下载</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="dataTable"
              style="width: 100%"
              height="435">
      <el-table-column type="index"
                       label="序号"></el-table-column>
      <el-table-column prop="ChannelA"
                       label="门禁通道A"
                       width="400"
                       align="center"></el-table-column>
      <el-table-column prop="stateA"
                       label="状态"
                       align="center"
                       width="50"></el-table-column>
      <el-table-column prop="ChannelB"
                       label="门禁通道B"
                       width="400"
                       align="center"></el-table-column>
      <el-table-column prop="stateB"
                       label="状态"
                       width="50"
                       align="center"></el-table-column>
      <el-table-column prop="deviceName"
                       label="所属门禁主机"
                       width="200"
                       align="center"></el-table-column>
      <el-table-column prop="keyPartName"
                       label="所属重点部位"
                       width="190"
                       align="center"></el-table-column>
      <el-table-column prop="orgName"
                       label="所属机构"
                       width="160"
                       align="center"></el-table-column>
      <el-table-column prop="tags"
                       label="门禁通道状态"
                       width="180"
                       align="center"></el-table-column>
      <el-table-column prop="isGuardLink"
                       label="门禁通道连接状态"
                       width="180"
                       align="center"></el-table-column>
    </el-table>
    <video-pagination ref="listPagination"
                      :total="total"
                      @paginationConfChange="paginationConfChange"></video-pagination>
  </div>
</template>
<script>
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import { getChannelList } from '@src/http/InterlockingDoor/linkedAirlockLog.api'
export default {
  name: 'QueryDataTable',
  components: { VideoPagination },
  props: {
    objData: {
      type: Object
    }
  },
  data() {
    return {
      total: 0,
      dataTable: []
    }
  },
  mounted() {
    this.getTableList()
  },
  computed: {},
  created() {},
  methods: {
    getTableList() {
      let obj = {
        page: 1,
        limit: 10,
        category: 3,
        type: '1'
      }
      if (this.objData.tierType === 'loc') {
        obj.keyPartId = this.objData.id
      } else if (this.objData.tierType === 'org') {
        obj.orgId = this.objData.id
      }
      getChannelList(obj).then(res => {
        if (res.status === 200) {
          let arr = res.data.data.channels
          let tempArr = []
          let newArr = []
          for (let i = 0; i < arr.length; i++) {
            if (tempArr.indexOf(arr[i].deviceId) === -1) {
              newArr.push({
                deviceId: arr[i].deviceId,
                list: [arr[i]]
              })
              tempArr.push(arr[i].deviceId)
            } else {
              for (let j = 0; j < newArr.length; j++) {
                if (newArr[j].deviceId === arr[i].deviceId) {
                  newArr[j].list.push(arr[i])
                }
              }
            }
          }
          newArr.forEach(item => {
            let obj = {
              ChannelA: item.list[0].name,
              stateA: item.list[0].status === 1 ? '在线' : '离线',
              ChannelB: item.list[1].name,
              stateB: item.list[0].status === 1 ? '在线' : '离线',
              deviceName: item.list[0].deviceName,
              keyPartName: item.list[0].keyPartName,
              orgName: item.list[0].orgName,
              tags: '',
              isGuardLink: item.list[0].isGuardLink === 1 ? '在线' : '离线'
            }
            this.dataTable.push(obj)
          })
          console.log(this.aisleTableData)
        }
      })
    },
    paginationConfChange(data) {
      this.limit = data.limit
      this.page = data.page
    }
  }
}
</script>
<style lang="less" scoped>
.center-table {
  .query {
    margin-bottom: 10px;
  }
  /deep/ .el-table {
    .el-table__header-wrapper {
      font-size: 12px;
    }
    .el-table__body-wrapper {
      font-size: 12px;
      .el-link--inner {
        font-size: 12px;
      }
    }
  }
  .block {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
