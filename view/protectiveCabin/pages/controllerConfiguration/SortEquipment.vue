<template>
  <div class="main">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>防护舱管理</el-breadcrumb-item>
        <el-breadcrumb-item>防护舱设备配置</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
        <el-breadcrumb-item class="active">排序</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="button-box">
      <el-button size="mini"
                 @click="onUpItem">
        <span class="iconfont-ccb ccbshangyi"></span>上移</el-button>
      <el-button size="mini"
                 @click="down">
        <span class="iconfont-ccb ccbxiayi"></span>下移</el-button>
      <el-button size="mini"
                 @click="top">
        <span class="iconfont-ccb ccbzhiding"></span>置顶</el-button>
      <el-button size="mini"
                 @click="low">
        <span class="iconfont-ccb ccbxiazai"></span>置尾</el-button>
    </div>
    <div class="list-table">
      <div class="header-title">
        <span class="cheack"></span>
        <span class="sequence">序号</span>
        <span class="host-name">防护舱主机名称</span>
        <span class="host-ip">防护舱设备IP</span>
      </div>
      <div class="content"
           v-for="(item,index) in tableObj">
        <span class="cheack">
          <el-checkbox :disabled="item.status"
                       @change="changeCheack(item,index)"
                       v-model="ststusArr[index]"></el-checkbox>
        </span>
        <span class="sequence">{{index+1}}</span>
        <span class="host-name">{{item.name}}</span>
        <span class="host-ip">{{item.ip||''}}</span>
      </div>
    </div>
    <div class="form-footer"
         slot="footer">
      <el-button size="mini"
                 @click="save">保存</el-button>
      <el-button size="mini"
                 @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { sortHostApi } from '@src/http/protectiveCabin/channe.api'
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
      }
      this.ststusArr.push(false)
      this.tableObj.push(obj)
    })
  },
  methods: {
    cancel() {
      this.$emit('update:isShowSort', false)
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
          this.tableObj[index - 1].status = false
          this.ststusArr[index - 1] = true
          this.tableObj[index - 1].name = JSON.parse(obj).name
          this.tableObj[index - 1].ip = JSON.parse(obj).ip
          this.tableObj[index - 1].id = JSON.parse(obj).id
          this.nowtable[0] = this.tableObj[index - 1]
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
          this.tableObj[index + 1].status = false
          this.ststusArr[index + 1] = true
          this.tableObj[index + 1].name = JSON.parse(obj).name
          this.tableObj[index + 1].ip = JSON.parse(obj).ip
          this.tableObj[index + 1].id = JSON.parse(obj).id
          this.nowtable[0] = this.tableObj[index + 1]
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
          this.tableObj[0].status = false
          this.ststusArr[0] = true
          this.tableObj[0].name = JSON.parse(obj).name
          this.tableObj[0].ip = JSON.parse(obj).ip
          this.tableObj[0].id = JSON.parse(obj).id
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
          this.tableObj[num].status = false
          this.ststusArr[num] = true
          this.tableObj[num].name = JSON.parse(obj).name
          this.tableObj[num].ip = JSON.parse(obj).ip
          this.tableObj[num].id = JSON.parse(obj).id
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
      sortHostApi(body).then((res) => {
        if (res.data.code === 0) {
          this.$messageSuccess('排序成功')
          this.$emit('update:isShowSort', false)
          this.$parent.getHosts()
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
  .header {
    padding: 17px 0 21px;
    /deep/ .el-breadcrumb {
      font-size: 12px;
      .active {
        .el-breadcrumb__inner {
          color: #2d72d3;
        }
      }
    }
  }
  .button-box {
    /deep/ .el-button {
      width: 80px;
      height: 35px;
      margin-bottom: 21px;
    }
    .iconfont-ccb {
      font-size: 12px;
      margin-right: 7px;
    }
  }
  .list-table {
    height: 395px;
    overflow: auto;
    .cheack {
      width: 80px;
      padding-left: 18px;
      box-sizing: border-box;
    }
    .sequence {
      width: 100px;
    }
    .host-name {
      width: 250px;
    }
    .header-title {
      height: 40px;
      width: 610px;
      background: #f5f7f9;
      display: flex;
      span {
        height: 100%;
        line-height: 40px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(33, 33, 33, 1);
      }
    }
    .content {
      height: 35px;
      width: 610px;
      display: flex;
      border-bottom: 1px solid #e1e1e1;
      span {
        height: 35px;
        line-height: 35px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
  .form-footer {
    width: 610px;
    text-align: center;
    /deep/ .el-button {
      width: 93px;
      height: 35px;
    }
  }
}
</style>
