<!--
 * @Author: your name
 * @Date: 2020-06-11 16:57:28
 * @LastEditTime: 2020-06-17 10:44:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\parkingManage\parkingConfig\pages\carConfig\ptint.vue
-->
<template>
  <div class="main">
    <div class="content-btn">
      <el-button size="mini"
                 @click="create"
                 v-if="isCreateBtnShow">新建</el-button>
      <el-button size="mini"
                 v-if="isCreateBtnShow"
                 @click="editBtn">编辑</el-button>
      <el-button size="mini"
                 v-if="isCreateBtnShow"
                 @click="dialogVisibleBtn">删除</el-button>
      <el-button v-if="isCreateBtnShow"
                 size="mini"
                 @click="stampBtn">打印</el-button>
      <el-button v-if="!isCreateBtnShow"
                 size="mini"
                 v-print="'#stamps'">打印</el-button>
      <el-button size="mini"
                 v-if="!isCreateBtnShow"
                 @click="close">取消</el-button>
    </div>
    <div class="content-box">
      <div>{{titleTopShow}}</div>
      <div class="detail-box"
           id="stamps">
        <div class="detail-item">
          <div class="item-left">车牌号码</div>
          <div class="item-right">{{formData.licensePlate}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">车牌型号</div>
          <div class="item-right">{{formData.carModel}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">车辆品牌</div>
          <div class="item-right">{{formData.carBrand}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">车身颜色</div>
          <div class="item-right">{{formData.carColor}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">车辆类型</div>
          <div class="item-right">{{formData.carType}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">状态</div>
          <div class="item-right">{{formData.status}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">期限</div>
          <div class="item-right">{{formData.timeLimit}}</div>
        </div>
        <div class="detail-item">
        </div>
        <div class="detail-item">
          <div class="item-left">备注</div>
          <div class="item-right">{{formData.remark}}</div>
        </div>
        <div class="detail-bottom">
          <div class="detail-item">
            <div class="item-left">录入时间</div>
            <div class="item-right">{{formData.createdAt}}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入机构</div>
            <div class="item-right">{{formData.enterOrgan}}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入人</div>
            <div class="item-right">{{formData.enterPerson}}</div>
          </div>
        </div>
      </div>

      <!-- <div class="bottom-btn" v-if="btnShow">
        <el-button type="primary"
                   size="mini"
                   @click="printBtn">打印</el-button>
        <el-button size="mini"
                   @click="skipToList">关闭</el-button>
      </div> -->
    </div>
    <deldialog ref="dialogVisible"
               @deleteInfo="deleteInfo"></deldialog>
  </div>
</template>

<script>
import { deleteParkConfigApi } from '@src/http/parkingManage/parkingRecord.api.js'
import deldialog from '../../../components/deleteDialog'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'ptint',
  components: {
    deldialog,
  },
  props: {
    titleTopShow: {
      type: String,
      default: '',
    },
    a: {
      type: Number,
      default: Number,
    },
    selectInfo: {
      type: Array,
      default: () => {
        return []
      },
    },
    empViewInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      formData: {},
    }
  },
  mounted(){
 switch(this.formData.carType){
        case 1:this.formData.carType='全部';  break;
        case 2:this.formData.carType='轿车';  break;
        case 3:this.formData.carType='商务车';  break;
        case 4:this.formData.carType='越野车';  break;
        case 5:this.formData.carType='面包车';  break;
        case 6:this.formData.carType='巴士';  break;
        case 7:this.formData.carType='货车';  break;
        case 8:this.formData.carType='自行车';  break;
        case 9:this.formData.carType='摩托车'; break;
    }
      switch(this.formData.carColor){
        case 1:this.formData.carColor='全部';  break;
        case 2:this.formData.carColor='黑色';  break;
        case 3:this.formData.carColor='白色';  break;
        case 4:this.formData.carColor='红色';  break;
        case 5:this.formData.carColor='蓝色';  break;
        case 6:this.formData.carColor='其他';  break;
    }
       switch(this.formData.carBrand){
        case '1':this.formData.carBrand='全部';  break;
        case '2':this.formData.carBrand='奔驰';  break;
        case '3':this.formData.carBrand='宝马'; break;
    }
       switch(this.formData.status){
        case 1:this.formData.status='启用';  break;
        case 2:this.formData.status='停用';  break;
      
    }
  },
  created() {
      console.log(this.empViewInfo,'this.empViewInfo')
         this.formData=this.empViewInfo
     
    this.timer()
  },
  computed: {
    ...mapState({
      // handleSelectionChangeArr: ({ parkingManage }) => parkingManage.handleSelectionChangeArr,
      isCreateBtnShow: ({ parkingManage }) => parkingManage.isCreateBtnShow,
     //  activeData: ({ parkingManage }) => parkingManage.handleSelectionChangeArr,
      // activeData: ({ parkingManage }) => parkingManage.activeData
    }),
  },
  methods: {
    ...mapActions(['deleteParkConfig', 'getParkConfigList']),
    // printBtn() {
    //   this.titleTop = '平台打印清单'
    //   this.btnShow = true
    // },
    // skipToList() {
    //   this.$emit('closePrint')
    // },
    timer() {
      let newTime = new Date()
      // 以下代码依次是获取当前时间的年月日时分秒
      var year = newTime.getFullYear()
      var month = newTime.getMonth() + 1
      var strDate = newTime.getDate()
      var minute = newTime.getMinutes()
      var hour = newTime.getHours()
      var second = newTime.getSeconds() + 1
      // 固定时间格式
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      if (hour >= 0 && hour <= 9) {
        hour = '0' + hour
      }
      if (minute >= 0 && minute <= 9) {
        minute = '0' + minute
      }
      if (second >= 0 && second <= 9) {
        second = '0' + second
      }
      var timer = year + '-' + month + '-' + strDate + ' ' + hour + ':' + minute + ':' + second
      this.formData.createdAt = timer
      console.log(timer)
    },
    create() {
      this.$emit('AddParkHost', 'create')
    },
    close() {
      this.$emit('colseCreate')
      this.$emit('getAlarmHostList')
    },
    editBtn() {
      console.log(this.activeData, '~~~~~~~~')
      this.$emit('AddParkHost', 'edit')
    },
    stampBtn() {
      this.$emit('printShows')
    },
    // 删除
    deleteInfo() {
      console.log('删除车辆配置')
      // let ids = this.$emit.idsArr
      console.log(this.a)
      deleteParkConfigApi([this.a])
        .then((res) => {
          this.$notify.success({
            title: '成功',
            message: '删除成功',
          })
          this.$emit('colseCreate')
          this.$emit('getAlarmHostList')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    dialogVisibleBtn() {
      this.$refs.dialogVisible.dialogVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
@media print {
  #stamps {
    width: 1000px;
    text-align: center;
    .detail-bottom {
      .detail-item {
        .item-right {
          width: 800px;
        }
      }
    }
  }
}
.main {
  padding: 0 10px;
}
.content-btn {
  margin: 12px 0;
}
.content-box {
  width: 1200px;
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
      width: 200px;
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
