<!--
 * @Author: your name
 * @Date: 2020-06-23 16:53:02
 * @LastEditTime: 2020-07-18 15:24:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\alarmManage\alarmConfig\pages\alarmHost\SortHost.vue
-->
<template>
  <div class="main">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>报警管理</el-breadcrumb-item>
        <el-breadcrumb-item>报警主机配置</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
        <el-breadcrumb-item>排序</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div class="main-content">
      <div style="margin: 10px 0;">报警主机信息</div>
      <div style="margin: 10px 0;">
        <el-button size="mini" @click="up(arrIndex)">上移</el-button>
        <el-button size="mini" @click="down(arrIndex)">下移</el-button>
        <el-button size="mini" @click="upIndex(arrIndex)">置顶</el-button>
        <el-button size="mini" @click="downIndex(arrIndex)">置尾</el-button>
      </div>
      <el-table :data="tableData" border height="450" size="mini" stripe @select="selectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="name" label="报警主机名称"></el-table-column>
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
    sortHostShow: Boolean,
    locationIdSort: {}
  },
  data() {
    return {
      tableData: [],
      arrIndex: 0
    }
  },
  methods: {
    cancel() {
      this.$emit('update:sortHostShow', false)
    },
    ...mapActions(['getAlarmHostOrder', 'sortAlarmHost']),
    getAlarmHostList() {
      this.getAlarmHostOrder({locationId: this.locationIdSort.locationId}).then(res => {
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
      let tempData = []
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].orderId = i + 1
        let tempObj = {
          id: this.tableData[i].id,
          orderId: this.tableData[i].orderId
        }
        tempData.push(tempObj)
      }
      console.log(tempData, 'tempData=====')
      this.sortAlarmHost(tempData).then(res => {
        this.$notify.success({
          title: '成功',
          message: '保存成功'
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    // this.getAlarmHostList()
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  .main-content {
    width: 600px;
    text-align: center;
  }
}
</style>
