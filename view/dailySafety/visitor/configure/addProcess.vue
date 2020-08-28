<template>
  <div class="org-manage-create-modify-box">
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>访客管理</el-breadcrumb-item>
        <el-breadcrumb-item>审批流程管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="center">
      <p>所属机构/所属重点部位</p>
      <p>
        审批流程名称:
        <el-input v-model="formName" style="width:200px;height:30px"></el-input>
      </p>
      <p>审批流程设置:</p>
      <div class="center-box">
        <span class="radius">申请人</span>
        <div v-for="(item,index) in addData" :key="index" class="center-box-item-item">
          <div class="center-box-item">
            <p>
              审批节点
              <i class="el-icon-edit" @click="edit('修改审批人',index)" ></i>
              <i class="el-icon-delete" @click="rem(index)"></i>
            </p>
            <ul class="center-box-ul" v-for="(items,indexs) in item" :key="indexs">
              <span>{{items}}</span>
            </ul>
          </div>
          <i class="el-icon-right" id="i"></i>
        </div>
        <i
          class="el-icon-right"
          style="margin-left: 20px;line-height: 60px;font-weight: 800;font-size: 18px;"
        ></i>
        <ul class="add">
          <li class="add">添加审批节点</li>
          <span @click="add('添加审批人')">+</span>
        </ul>
        <ul class="name">
          <p>
            登记人
            <i class="el-icon-edit" @click="editName('修改抄送人')"></i>
          </p>
          <li v-for="(val,i) in addPeople" :key="i">{{val}}</li>
          <span @click="addName('添加抄送人')">+</span>
        </ul>
      </div>
    </div>
    <div class="top-button">
      <el-button style="font-size:12px;" @click="preservation">保存</el-button>
      <el-button style="font-size:12px;" @click="cancel">取消</el-button>
    </div>
    <el-dialog :title="titleName" :visible.sync="dialogTableVisible" width="1200px">
      <div class="center-display">
        <div class="display-left">
          <p>
            人员列表
            <span>人员姓名：</span>
            <el-input v-model="searchName" style="width:200px;height:30px"></el-input>
            <el-button style="font-size:12px;">搜索</el-button>
          </p>
          <el-table :data="gridData" height="300px">
            <el-table-column prop="index" label="序号" width="50"></el-table-column>
            <el-table-column property="name" label="姓名"></el-table-column>
            <el-table-column property="longname" label="员工识别登录"></el-table-column>
            <el-table-column property="nameId" label="员工编号"></el-table-column>
            <el-table-column property="otgName" label="所属机构"></el-table-column>
            <el-table-column property="jobType" label="工作单位"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button style="font-size:12px;" @click="nameAdd(scope.$index,scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="display-right">
          <p>审批人列表</p>
          <el-table :data="gridDataRem" height="300px">
            <el-table-column prop="index" label="序号" width="50"></el-table-column>
            <el-table-column property="name" label="姓名"></el-table-column>
            <el-table-column property="longname" label="员工识别登录"></el-table-column>
            <el-table-column property="nameId" label="员工编号"></el-table-column>
            <el-table-column property="otgName" label="所属机构"></el-table-column>
            <el-table-column property="jobType" label="工作单位"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button style="font-size:12px;" @click="nameRem(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="yes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    isAddProcess: {
      type: Boolean
    }
  },
  data() {
    return {
      dialogTableVisible: false, //弹框显隐
      titleName: '', //弹框标题
      formName: '',//审批流程名称
      searchName: '', //搜索
      editIndex:'',//确定修改审批人下标
      addData: [['李四', '王五', '建国'], ['李四', '王五'], ['李四']],
      addPeople: ['张三'],
      gridDataRem: [],
      gridData: [
        {
          name: '张翰',
          longname: 'zhanghan',
          nameId: '123456',
          otgName: '定州支行',
          jobType: ''
        },
        {
          name: '礼物',
          longname: 'liwu',
          nameId: '123456',
          otgName: '定州支行',
          jobType: ''
        },
        {
          name: '王艺',
          longname: 'wangyi',
          nameId: '123456',
          otgName: '定州支行',
          jobType: ''
        },
        {
          name: '刘群',
          longname: 'liuqun',
          nameId: '123456',
          otgName: '定州支行',
          jobType: ''
        },
        {
          name: '张三',
          longname: 'zhangsan',
          nameId: '123456',
          otgName: '定州支行',
          jobType: ''
        },
        {
          name: '周超',
          longname: 'zhouchao',
          nameId: '123456',
          otgName: '定州支行',
          jobType: ''
        }
      ]
    }
  },
  methods: {
    //删除节点
    rem(index) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.addData.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //修改审批人
    edit(title,index){
      this.dialogTableVisible = true
      this.titleName = title
      this.editIndex=index
    },
    //添加审批人
    add(title) {
      this.dialogTableVisible = true
      this.titleName = title
    },
    //添加登记人
    addName(title) {
      this.dialogTableVisible = true
      this.titleName = title
    },
    //修改登记人
    editName(title) {
      this.dialogTableVisible = true
      this.titleName = title
    },
    //保存
    preservation() {
      this.$emit('update:isAddProcess', false)
    },
    //取消
    cancel() {
      this.$emit('update:isAddProcess', false)
    },
    //添加等级人员
    nameAdd(index, val) {
      this.gridDataRem.push(val)
    },
    //删除等级人员
    nameRem(index, val) {
      this.gridDataRem.splice(index, 1)
    },
    //保存添加
    yes() {
      if (this.titleName == '修改审批人') {
        let arr = []
        this.gridDataRem.map((item, i) => {
          arr.push(item.name)
        })
        this.addData[this.editIndex]=arr
      }
      if (this.titleName == '添加审批人') {
        let arr = []
        this.gridDataRem.map((item, i) => {
          arr.push(item.name)
        })
        this.addData.push(arr)
      }
      if (this.titleName == '添加抄送人') {
        this.gridDataRem.map((item, i) => {
          this.addPeople.push(item.name)
        })
      }
      if (this.titleName == '修改抄送人') {
        let arr = []
        this.gridDataRem.map((item, i) => {
          arr.push(item.name)
        })
        this.addPeople = arr
      }
      this.dialogTableVisible = false
      this.gridDataRem = []
    }
  }
}
</script>

<style lang="less" scoped>
.org-manage-create-modify-box {
  width: 100%;
  height: 100%;
  margin-left: 20px;
  .header {
    width: 100%;
    margin-bottom: 20px;
  }
  .center {
    p {
      margin-bottom: 25px;
    }
    .center-box {
      margin-top: 30px;
      display: flex;
      .radius {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid #ccc;
        border-radius: 50%;
        margin-left: 20px;
        margin-right: 20px;
      }
      .center-box-item-item {
        position: relative;
        .center-box-item {
          display: inline-block;
          width: 90px;
          height: auto;
          border: 1px solid #ccc;
          margin-left: 40px;
          margin-right: 20px;
          p {
            display: inline-block;
            width: 90px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-bottom: 1px solid #ccc;
          }
          ul {
            width: 90px;
            height: auto;
            display: flex;
            flex-direction: column;
            span {
              display: inline-block;
              width: 60px;
              height: 60px;
              text-align: center;
              line-height: 60px;
              border: 1px solid #ccc;
              border-radius: 50%;
              margin-left: 14px;
              margin-bottom: 10px;
            }
          }
        }
        #i {
          position: absolute;
          top: 20px;
          left: -20px;
          margin-left: 20px;
          font-weight: 800;
          font-size: 18px;
        }
      }
      .add {
        margin-left: 20px;
        width: 90px;
        height: auto;
        span {
          display: inline-block;
          width: 60px;
          height: 60px;
          text-align: center;
          line-height: 60px;
          border: 1px solid #ccc;
          border-radius: 50%;
          margin-left: 20px;
          margin-top: 10px;
          background: rgb(0, 119, 255);
          font-size: 20px;
          font-weight: 800;
          color: #fff;
        }
      }
      .name {
        display: inline-block;
        width: 90px;
        height: auto;
        border: 1px solid #ccc;
        margin-left: 50px;
        p {
          display: inline-block;
          width: 90px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          border-bottom: 1px solid #ccc;
        }
        li {
          display: inline-block;
          width: 60px;
          height: 60px;
          text-align: center;
          line-height: 60px;
          border: 1px solid #ccc;
          border-radius: 50%;
          margin-left: 14px;
          margin-bottom: 10px;
        }
        span {
          display: inline-block;
          width: 60px;
          height: 60px;
          text-align: center;
          line-height: 60px;
          border: 1px solid #ccc;
          border-radius: 50%;
          margin-left: 14px;
          background: rgb(161, 92, 67);
          font-size: 20px;
          font-weight: 800;
          color: #fff;
        }
      }
    }
  }
  .top-button {
    margin-top: 150px;
  }
}
.center-display {
  padding: 20px;
  display: flex;
  .display-left {
    p {
      margin-bottom: 20px;
      span {
        margin-left: 120px;
      }
    }
  }
  .display-right {
    margin-left: 50px;
    p {
      margin-top: 10px;
      margin-bottom: 30px;
    }
  }
}
</style>