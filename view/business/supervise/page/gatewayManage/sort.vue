<template>
  <div class="main">
    <div class="main-content">
      <div style="margin: 10px 0;">
        <el-button size="mini">上移</el-button>
        <el-button size="mini">下移</el-button>
        <el-button size="mini">置顶</el-button>
        <el-button size="mini">置尾</el-button>
      </div>
      <el-table :data="tableData" border height="450" size="mini" stripe>
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="deviceName" label="对讲主机名称"></el-table-column>
        <el-table-column prop="code" label="设备编码"></el-table-column>
      </el-table>
      <div style="margin-top: 24px;">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button size="mini" @click="cancel">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    sortHostShow: Boolean
  },
  data() {
    return {
      tableData: [
        
      ],
      arrIndex: 0
    }
  },
  methods: {
    cancel() {
       this.$confirm('请确认是否放弃操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         this.$parent.close()
      }).catch(() => {})  
    },
    ...mapActions(['getAlarmHost', 'sortAlarmHost']),
    getAlarmHostList() {
      this.getAlarmHost().then(res => {
        const result = res.results
        Array.isArray(result) && result.forEach(item => {
          if (item.updatedAt !== undefined) {
            item.updatedAt = this.$moment(item.updatedAt).format('YYYY-MM-DD hh:mm:ss')
          }
        })
        this.tableData = result
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * arr是要操作的数组
     * index1 是准备移动的元素
     * index2 是准备移动到的位置 往下移就是 index2=index+1
     * 往上移动就是 index2=index+1
     */
    swapItems(arr, index1, index2, direction) {
      if (direction === 'up') { // 置顶
        arr.unshift(arr[index1])
        arr.splice(index1 + 1, 1)
        return arr
      }
      if (direction === 'down') { // 置底
        arr.push(arr[index1])
        arr.splice(index1, 1)
        return arr
      }
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      console.log(arr, '排序后要返回的数组')
      return arr
    },
    upIndex(index) {
      if (index === 0) {
        return
      }
      this.swapItems(this.tableData, index, 0, 'up')
      this.arrIndex = 0
    },
    up(index) {
      if (index === 0) {
        return
      }
      this.swapItems(this.tableData, index, index - 1)
      this.arrIndex--
    },
    down(index) {
      console.log(index, 'index down')
      if (index === this.tableData.length - 1) {
        return
      }
      this.swapItems(this.tableData, index, index + 1)
      this.arrIndex++
    },
    downIndex(index) {
      if (index === this.tableData.length - 1) {
        return
      }
      this.swapItems(this.tableData, index, 0, 'down')
      this.arrIndex = this.tableData.length - 1
    },
    selectionChange(selection, row) {
      console.log(row, '================')
      console.log((this.tableData || []).findIndex((profile) => profile.id === row.id))
      this.arrIndex = (this.tableData || []).findIndex((profile) => profile.id === row.id)
      console.log(this.arrIndex, 'this.arrIndex================')
    },
    save() {
     this.$parent.close()
      this.$notify.success({
          title: '成功',
          message: '保存成功'
      })
      // let tempData = []
      // for (let i = 0; i < this.tableData.length; i++) {
      //   this.tableData[i].orderId = i + 1
      //   let tempObj = {
      //     id: this.tableData[i].id,
      //     orderId: this.tableData[i].orderId
      //   }
      //   tempData.push(tempObj)
      // }
      // console.log(tempData, 'tempData=====')
      // this.sortAlarmHost(tempData).then(res => {
      //   this.$notify.success({
      //     title: '成功',
      //     message: '保存成功'
      //   })
      // }).catch(err => {
      //   console.log(err)
      // })
    }
  },
  created() {
    this.getAlarmHostList()
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 83%;
  height: 100%;
  .main-content {
    width: 600px;
    text-align: center;
    margin-left: 200px;
  }
}
</style>
