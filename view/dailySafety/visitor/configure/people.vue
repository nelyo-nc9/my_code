<template>
  <div class="people">
    <div>
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>访客管理</el-breadcrumb-item>
        <el-breadcrumb-item>人员分级管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="people-box">
      <div class="box" v-for="(item,index) in data" :key="index">
        <span class="box-center">
          <p class="first-p">{{item.title}}</p>
          <p class="last-p">风险说明：{{item.explain}}</p>
          <ul v-for="(items,indexs) in item.list" :key="indexs">
            <li>{{items}} &nbsp;&nbsp;&nbsp;X</li>
          </ul>
          <li class="addli" v-if="item.type==false">
            新增类别 &nbsp;&nbsp;&nbsp;
            <span @click="item.type=true">+</span>
          </li>
          <li class="addinput" v-if="item.type==true">
            <input type="text" v-model="addListFrom" />
            <span @click="addType(item,index)">V</span>
            <span @click="item.type=false">X</span>
          </li>
        </span>
      </div>
      <span class="box-addspan">
        <p class="addp">新增风险</p>
        <span class="addbutton" v-if="isAddData==false" @click="isAddData=true">+</span>
        <span class="addinput" v-if="isAddData==true">
          <div class="top">
            <p>风险说明:</p>
            <el-input type="textarea" v-model="addDataFrom"></el-input>
          </div>

          <div class="bottom">
            <el-button style="font-size:12px;" @click="isAddData=false">取消</el-button>
            <el-button style="font-size:12px;" @click="add">保存</el-button>
          </div>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addDataFrom: '', //新增风险说明
      addListFrom: '', //新增类型
      isAddData: false, //新增风险显隐
      data: [
        {
          title: '1级风险',
          explain: '这是1级风险，风险这是1级风险，风险这是1级风险，风险这是1级风险，风险',
          list: ['外来施工人员', '其他人员'],
          type: false
        },
        {
          title: '2级风险',
          explain: '这是2级风险，风险',
          list: ['客户', '新增类别'],
          type: false
        },
        {
          title: '3级风险',
          explain: '这是3级风险，风险',
          list: ['分行人员', '监管机制'],
          type: false
        },
        {
          title: '4级风险',
          explain: '这是4级风险，风险',
          list: ['住院人员'],
          type: false
        }
      ]
    }
  },
  methods: {
    //新增风险
    add() {
      let arr = {
        title: this.data.length + 1 + '级风险',
        explain: this.addDataFrom,
        list: [],
        type: false
      }
      this.addDataFrom = ''
      this.data.push(arr)
      this.isAddData = false
    },
    //新增类型
    addType(item,index){
      this.data[index].list.push(this.addListFrom)
      item.type=false
      this.addListFrom=''
    },
    //取消新增类型
  }
}
</script>

<style lang="less" scoped>
.people-box {
  margin-top: 30px;
}
.people {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  .box {
    float: left;
    margin-bottom: 30px;
    .box-center {
      margin-right: 40px;
      display: inline-block;
      width: 200px;
      height: 300px;
      border: 1px solid #ccc;
      display: flex;
      flex-direction: column;
      .first-p {
        width: 100%;
        height: 25px;
        text-align: center;
        line-height: 25px;
        border-bottom: 1px solid #ccc;
      }
      .last-p {
        display: inline-block;
        width: 100%;
        height: 90px;
        border-bottom: 1px solid #ccc;
        padding: 5px;
      }
      ul {
        padding-left: 5px;
        li {
          display: inline-block;
          padding: 5px;
          height: 25px;
          line-height: 15px;
          width: auto;
          border: 1px solid #ccc;
          margin-top: 10px;
        }
      }
      .addli {
        display: inline-block;
        margin-left: 5px;
        margin-top: 10px;
        padding-left: 5px;
        height: 25px;
        width: 100px;
        line-height: 25px;
        border: 1px solid #ccc;
        span {
          font-weight: 800;
          font-size: 16px;
        }
      }
      .addinput {
        display: flex;
        margin-left: 5px;
        margin-top: 10px;
        input {
          width: 120px;
          height: 25px;
        }
        span {
          line-height: 25px;
          margin-left: 10px;
          font-weight: 800;
        }
      }
    }
  }
  .box-addspan {
    margin-right: 40px;
    display: inline-block;
    width: 200px;
    height: 300px;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    .addp {
      width: 100%;
      height: 25px;
      text-align: center;
      line-height: 25px;
      border-bottom: 1px solid #ccc;
    }
    .addbutton {
      display: inline-block;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      margin-top: 105px;
      margin-left: 70px;
      border-radius: 50%;
      font-size: 24px;
      font-weight: 800;
      color: #fff;
      background: rgb(66, 100, 66);
    }
    .addinput {
      display: flex;
      flex-direction: column;
      .top {
        padding: 5px;
        border-bottom: 1px solid #ccc;
        p {
          margin-top: 8px;
          margin-bottom: 10px;
        }
      }
      .bottom {
        text-align: center;
        margin-top: 140px;
      }
    }
  }
}
</style>