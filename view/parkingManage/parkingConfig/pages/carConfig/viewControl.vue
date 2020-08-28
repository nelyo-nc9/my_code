<!--
 * @Author: your name
 * @Date: 2020-06-11 16:57:28
 * @LastEditTime: 2020-06-17 10:00:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\parkingManage\parkingConfig\pages\carConfig\ptint.vue
-->
<template>
  <div class="main">
    <!-- {{handleSelectionChangeArr}} -->
    <div class="content-btn">
      <el-button size="mini"
                 v-if="!isCreateBtnShow"
                  @click="create">新建</el-button>
      <el-button size="mini"
                 v-if="!isCreateBtnShow" @click="editBtn">编辑</el-button>
      <el-button size="mini"
                 v-if="!isCreateBtnShow" @click="dialogVisibleBtn">删除</el-button>
      <el-button size="mini">打印</el-button>
      <el-button size="mini"
                 v-if="isCreateBtnShow"
                 @click="close">关闭</el-button>
    </div>
    <div class="content-box">
      <div>布控车辆信息</div>
      <div class="detail-box">
        <div class="detail-item">
          <div class="item-left">布控名称</div>
          <div class="item-right">{{activeData.controlName}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">车牌号码</div>
          <div class="item-right">{{activeData.carNum}}</div>
        </div>

        <div class="detail-item">
          <div class="item-left">车辆品牌</div>
          <div class="item-right">{{activeData.brand}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">车牌型号</div>
          <div class="item-right">{{activeData.model}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">车身颜色</div>
          <div class="item-right">{{activeData.carColor}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">车辆类型</div>
          <div class="item-right">{{activeData.carType}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">状态</div>
          <div class="item-right">{{activeData.status}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">布控方式</div>
          <div class="item-right">{{activeData.controlWay}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">备注</div>
          <div class="item-right">{{activeData.remark}}</div>
        </div>
        <div class="detail-bottom">
          <div class="detail-item">
            <div class="item-left">录入时间</div>
            <div class="item-right">{{activeData.enterTime}}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入机构</div>
            <div class="item-right">{{activeData.enterOrgan}}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入人</div>
            <div class="item-right">{{activeData.createdBy}}</div>
          </div>
        </div>
      </div>
    </div>
    <del-dialog ref="dialogVisible"></del-dialog>
    <Create></Create>
  </div>
</template>

<script>
import Create from './Create'
import delDialog from '../../../components/deleteDialog'
import { mapState } from 'vuex'
export default {
  components: {
    delDialog,
    Create
  },
  // activeData: [],
  data() {
    return {
        isCreateBtnShow:false,
    //   activeData: {
    //     controlName: '可疑车辆',
    //     carNum: '本机监控中心',
    //     model: 'xx营业网点大楼',
    //     parkName: '主楼智慧停车管理平台',
    //     brand: 'S-21209DXS',
    //     carColor: '192.168.0.02',
    //     carType: '2300',
    //     status: '无',
    //     controlWay: '20202-03-03 32:32:31',
    //     remark: '没有',
    //     createdAt: '2020-02-03 13:23:09',
    //     createdDept: 'xxxx录入机构名称',
    //     createdBy: '张三'
    //   }
    }
  },
  computed: {
    ...mapState({
      isCreateBtnShow: ({ parkingManage }) => parkingManage.isCreateBtnShow,
      activeData: ({ parkingManage }) => parkingManage.activeData,
      handleSelectionChangeArr: ({ parkingManage }) => parkingManage.handleSelectionChangeArr,
    })
  },
  // created() {
  //   this.activeDatalist()
  // },
  methods: { 
    create() {
      this.$emit('AddParkHost', 'create')
    },
    close() {
      this.$emit('colseCreate')
      this.isCreateBtnShow=false
    },
    editBtn() {
      this.$emit('AddParkHost', 'create')
    },
    dialogVisibleBtn() {
      this.$refs.dialogVisible.dialogVisible = true
    },
    stamp(){
      this.isCreateBtnShow=true
    },
    // activeDatalist(){
    //   this.activeData=handleSelectionChangeArr
    // }
  }
}
</script>

<style lang="less" scoped>
.main {
  padding: 0 10px;
}
.content-btn {
  margin: 12px 0;
}
.content-box {
  width: 1000px;
  margin-top: 20px;
  text-align: center;
}
.table-box {
  width: 100%;
  text-align: left;
  margin-top: 24px;
}
.pointer {
  cursor: pointer;
  display: inline-block;
  width: 150px;
}
.detail-box,
.detail-bottom {
  color: #666;
  width: 100%;
  padding: 8px;
  border: 1px solid #f2f2f2;
  display: flex;
  flex-wrap: wrap;
  margin: 48px;
  .detail-item {
    display: flex;
    width: 50%;
    height: 32px;
    line-height: 32px;
    .item-left {
      width: 150px;
      background: #f8f8f8;
      border: 1px solid #fff;
    }
    .item-right {
      flex: 1;
      border: 1px solid #f8f8f8;
      border-left: none;
    }
  }
}
.detail-bottom {
  .detail-item {
    width: 33.33%;
  }
}
</style>
