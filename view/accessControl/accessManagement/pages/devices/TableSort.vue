<template>
  <div class="main">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
        <el-breadcrumb-item>门禁管理</el-breadcrumb-item>
        <el-breadcrumb-item>门禁设备配置</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
        <el-breadcrumb-item>排序</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div class="main-content">
      <div style="margin: 10px 0;">门禁主机信息</div>
      <div style="margin: 10px 0;">
        <el-button size="mini" @click="onUpItem">上移</el-button>
        <el-button size="mini" @click="down">下移</el-button>
        <el-button size="mini" @click="top">置顶</el-button>
        <el-button size="mini" @click="low">置尾</el-button>
      </div>
      <div class="list-table">
        <div class="header">
          <span class="cheack"></span>
          <span class="sequence">序号</span>
          <span class="host-name">门禁平台名称</span>
          <span class="host-ip">型号</span>
        </div>
        <div class="content" v-for="(item,index) in tableObj" :key="index">
          <span class="cheack">
            <el-checkbox
              :disabled="item.status"
              @change="changeCheack(item,index)"
              v-model="ststusArr[index]"
            ></el-checkbox>
          </span>
          <span class="sequence">{{index+1}}</span>
          <span class="host-name">{{item.name}}</span>
          <span class="host-ip">{{item.modelNum||''}}</span>
        </div>
      </div>
      <el-button size="mini" @click="save">保存</el-button>
      <el-button size="mini" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { platformSort, HostSort, getAccessList } from '@src/http/access/accessMan'

export default {
  props: {
    isShowSort: Boolean,
    aisleTableData: {
      type: Array,
    },
  },
  data() {
    return {
      tableData: this.aisleTableData,
      tableObj: [],
      nowtable: [],
      index: -1,
      ststusArr: [],
    }
  },
  watch: {},
  computed: {},
  created() {
    this.tableData.forEach((item) => {
      let obj = {
        ip: item.ip,
        name: item.name,
        status: false,
        serialCode: item.serialCode,
        id: item.id,
        modelNum: item.modelNum,
      }
      this.ststusArr.push(false)
      this.tableObj.push(obj)
    })
  },
  methods: {
    cancel() {
      this.$emit(
        'modelChange',
        {
          ParerntFlag: true,
          currtCom: '列表',
        },
        'Create'
      )
    },
    changeCheack(item, index) {
      if (this.nowtable.length === 0) {
        this.nowtable.push(item)
        this.index = index
      } else {
        if (this.nowtable[0] === item) {
          this.nowtable = []
          this.index = -1
        } else {
          this.nowtable[0] = item
          this.index = index
        }
      }
      if (this.nowtable.length === 0) {
        this.tableObj.forEach((element) => {
          element.status = false
        })
      } else {
        this.tableObj.forEach((el, i) => {
          if (i === index) {
            this.tableObj[index].status = false
          } else {
            this.tableObj[i].status = true
          }
        })
      }
    },
    //上移
    onUpItem() {
      if (this.nowtable.length === 0) {
        return
      } else {
        let obj = JSON.stringify(this.nowtable[0])
        let index = this.index
        if (index === 0) {
          return
        } else {
          this.index = this.index - 1
          this.ststusArr[index] = false
          this.tableObj[index].status = true
          this.tableObj[index].name = this.tableObj[index - 1].name
          this.tableObj[index].ip = this.tableObj[index - 1].ip
          this.tableObj[index].id = this.tableObj[index - 1].id
          this.tableObj[index].modelNum = this.tableObj[index - 1].modelNum
          this.tableObj[index - 1].status = false
          this.ststusArr[index - 1] = true
          this.tableObj[index - 1].name = JSON.parse(obj).name
          this.tableObj[index - 1].ip = JSON.parse(obj).ip
          this.tableObj[index - 1].id = JSON.parse(obj).id
          this.tableObj[index - 1].modelNum = JSON.parse(obj).modelNum
          this.nowtable[0] = this.tableObj[index - 1]
          console.log(this.tableObj)
        }
      }
    },
    //下移
    down() {
      if (this.nowtable.length === 0) {
        return
      } else {
        let obj = JSON.stringify(this.nowtable[0])
        let index = this.index
        if (index === this.tableObj.length - 1) {
          return
        } else {
          this.index = this.index + 1
          this.ststusArr[index] = false
          this.tableObj[index].status = true
          this.tableObj[index].name = this.tableObj[index + 1].name
          this.tableObj[index].ip = this.tableObj[index + 1].ip
          this.tableObj[index].id = this.tableObj[index + 1].id
          this.tableObj[index].modelNum = this.tableObj[index + 1].modelNum

          this.tableObj[index + 1].status = false
          this.ststusArr[index + 1] = true
          this.tableObj[index + 1].name = JSON.parse(obj).name
          this.tableObj[index + 1].ip = JSON.parse(obj).ip
          this.tableObj[index + 1].id = JSON.parse(obj).id
          this.tableObj[index + 1].modelNum = JSON.parse(obj).modelNum

          this.nowtable[0] = this.tableObj[index + 1]

          console.log(this.tableObj)
        }
      }
    },
    top() {
      if (this.nowtable.length === 0) {
        return
      } else {
        let obj = JSON.stringify(this.nowtable[0])
        let index = this.index
        if (index === 0) {
          return
        } else {
          this.index = 0
          this.ststusArr[index] = false
          this.tableObj[index].status = true
          this.tableObj[index].name = this.tableObj[0].name
          this.tableObj[index].ip = this.tableObj[0].ip
          this.tableObj[index].id = this.tableObj[0].id
          this.tableObj[index].modelNum = this.tableObj[0].modelNum

          this.tableObj[0].status = false
          this.ststusArr[0] = true
          this.tableObj[0].name = JSON.parse(obj).name
          this.tableObj[0].ip = JSON.parse(obj).ip
          this.tableObj[0].id = JSON.parse(obj).id
          this.tableObj[0].modelNum = JSON.parse(obj).modelNum

          this.nowtable[0] = this.tableObj[0]
          console.log(this.tableObj)
        }
      }
    },
    low() {
      if (this.nowtable.length === 0) {
        return
      } else {
        let obj = JSON.stringify(this.nowtable[0])
        let index = this.index
        if (index === this.tableObj.length - 1) {
          return
        } else {
          let num = this.tableObj.length - 1
          this.index = this.tableObj.length - 1
          this.ststusArr[index] = false
          this.tableObj[index].status = true
          this.tableObj[index].name = this.tableObj[num].name
          this.tableObj[index].ip = this.tableObj[num].ip
          this.tableObj[index].id = this.tableObj[num].id
          this.tableObj[index].modelNum = this.tableObj[num].modelNum

          this.tableObj[num].status = false
          this.ststusArr[num] = true
          this.tableObj[num].name = JSON.parse(obj).name
          this.tableObj[num].ip = JSON.parse(obj).ip
          this.tableObj[num].id = JSON.parse(obj).id
          this.tableObj[num].modelNum = JSON.parse(obj).modelNum

          this.nowtable[0] = this.tableObj[num]
          console.log(this.tableObj)
        }
      }
    },
    save() {
      let body = {
        sequences: [],
      }
      this.tableObj.forEach((item) => {
        let obj = { id: item.id, serialCode: item.serialCode }
        body.sequences.push(obj)
      })
      HostSort(body).then((res) => {
        if (res.data.code === 0) {
          this.$messageSuccess('排序成功')
          this.$parent.getList()
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  .main-content {
    width: 600px;
    text-align: center;
    .list-table {
      width: 600px;
      height: 450px;
      border: 1px solid #ebeef5;
      margin-bottom: 10px;
      .header {
        width: 100%;
        height: 39px;
        border-bottom: 1px solid #ebeef5;
        display: flex;
        line-height: 39px;
        background: #f5f7fa;
        font-size: 12px;
      }
      .content {
        width: 100%;
        height: 23px;
        border-bottom: 1px solid #ebeef5;
        display: flex;
        line-height: 23px;
      }
      .cheack {
        height: 100%;
        width: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .sequence {
        height: 100%;
        width: 48px;
        text-align: left;
      }
      .host-name {
        height: 100%;
        width: 252px;
        text-align: left;
      }
      .host-ip {
        height: 100%;
        flex: 1;
        text-align: left;
      }
    }
  }
}
</style>
