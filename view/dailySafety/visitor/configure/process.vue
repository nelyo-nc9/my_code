<template>
  <div class="org-manage-create-modify-box">
    <div class="header" v-show="isAddProcess==false">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>访客管理</el-breadcrumb-item>
        <el-breadcrumb-item>审批流程管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="center" v-show="isAddProcess==false">
      <div class="center-tree">
          <treeBox 
               searchType="filter"
               :treeType="treeType"
               treeLazyToggle
               iconToggle
              ></treeBox>
      </div>
      <div class="center-right">
        <div class="top-button">
          <el-button style="font-size:12px;" @click="add('新建')">新建</el-button>
          <el-button style="font-size:12px;">上移</el-button>
          <el-button style="font-size:12px;">下移</el-button>
        </div>
        <div class="center-right-box">
          <ul v-for="(item,index) in processData" :key="index">
            <li class="item-li">
              <div class="item-li-left">
                <p>
                  <span>{{item.name}}</span>
                  <i class="el-icon-edit" @click="edit('编辑')" style='font-weight:800'></i>
                  <i class="el-icon-delete" @click="rem(index)" style='font-weight:800'></i>
                  <span>{{item.org}}</span>
                </p>
                <p>
                  <span class="radius">{{item.people}}</span>
                  <i class="el-icon-right"></i>
                  <span class="radius">{{item.onePeople}}</span>
                  <i class="el-icon-right"></i>
                  <span v-for="(items,indexs) in item.twoPeople" :key="indexs">
                    <span class="radius">{{items}}</span>
                  </span>
                  <i class="el-icon-right"></i>
                  <span class="radius">{{item.threePeople}}</span>
                </p>
              </div>
              <div class="item-li-right">
                <span class="radius">{{item.threePeople}}</span>
                <p>登记</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 增加、编辑组件 -->
    <AddProcess v-show="isAddProcess==true" :isAddProcess.sync='isAddProcess'></AddProcess>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import AddProcess from './addProcess'
export default {
  components: {
    treeBox,
    AddProcess,
  },
  data() {
    return {
       treeType: 2,//机构树
       
      isAddProcess: false,
      processData: [
        {
          name: '物业公司审批流程',
          org: '所属机构/所属重点部位',
          people: '申请人',
          onePeople: '张三',
          twoPeople: ['李四', '王五', '建国'],
          threePeople: '富贵'
        },
        {
          name: '物业公司审批流程2',
          org: '所属机构/所属重点部位2',
          people: '申请人2',
          onePeople: '张三2',
          twoPeople: ['李四2', '王五2', '建国2'],
          threePeople: '富贵2'
        },
        {
          name: '物业公司审批流程3',
          org: '所属机构/所属重点部位3',
          people: '申请人3',
          onePeople: '张三3',
          twoPeople: ['建国3'],
          threePeople: '富贵3'
        }
      ]
    }
  },
  methods: {
    //新建
    add(title) {
      this.isAddProcess = true
    },
    //修改
    edit(title) {
      this.isAddProcess = true
    },
    //删除
    rem(index) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.processData.splice(index, 1)
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
    }
  }
}
</script>

<style lang="less" scoped>
.org-manage-create-modify-box {
  width: 100%;
  height: 100%;
  .header {
    width: 100%;
    padding: 10px 20px;
  }
  .center {
    display: flex;
    width: 100%;
    height: 100%;
    .center-tree {
      width: 260px;
      height: 100%;
      border: 1px solid #ccc;
    }
    .center-right {
      flex: 1;
      margin-left: 30px;
      .center-right-box {
        ul {
          .item-li {
            width: 700px;
            height: 120px;
            border: 1px solid #ccc;
            margin: 20px 0;
            display: flex;
            .item-li-left {
              width: 580px;
              height: 100%;
              p:first-child {
                margin-top: 8px;
                margin-left: 10px;
                i {
                  margin-left: 10px;
                }
                span:last-child {
                  float: right;
                  margin-right: 10px;
                }
              }
              p:last-child {
                margin-top: 15px;
                i {
                  font-size: 18px;
                  font-weight: 800;
                  margin-left: 10px;
                }
                .radius {
                  display: inline-block;
                  width: 60px;
                  height: 60px;
                  text-align: center;
                  line-height: 60px;
                  border: 1px solid #ccc;
                  border-radius: 50%;
                  margin-left: 10px;
                }
              }
            }
            .item-li-right {
              display: flex;
              border-left: 1px solid #ccc;
              height: 100%;
              position: relative;
              padding: 25px;
              display: flex;
              flex-direction: column;
              p {
                text-align: center;
              }
              .radius {
                display: inline-block;
                width: 60px;
                height: 60px;
                text-align: center;
                line-height: 60px;
                border: 1px solid #ccc;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
  }
}
</style>