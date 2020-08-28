<!--
 * @Author: your name
 * @Date: 2020-06-11 16:57:28
 * @LastEditTime: 2020-06-12 18:05:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\parkingManage\parkingConfig\pages\carConfig\ptint.vue
--> 
<template>
  <div class="main">
    <div class="content-btn">
      <el-button size="mini">打印</el-button>
      <el-button size="mini"
                 @click="close">关闭</el-button>
    </div>
    <div class="content-box">
      <div>停车主机信息</div>
      <div class="detail-box">
        <div class="detail-item">
          <div class="item-left">所属机构</div>
          <div class="item-right">{{activeData.oid}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">所属重点部位</div>
          <div class="item-right">{{activeData.keyPart}}</div>
        </div>

        <div class="detail-item">
          <div class="item-left">所属停车平台</div>
          <div class="item-right">{{activeData.platform}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">停车平台ID</div>
          <div class="item-right">{{activeData.id}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">主机名称</div>
          <div class="item-right">{{activeData.hostName}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">IP地址</div>
          <div class="item-right">{{activeData.ip}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">品牌</div>
          <div class="item-right">{{activeData.brand}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">型号</div>
          <div class="item-right">{{activeData.model}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">通道号</div>
          <div class="item-right">{{activeData.aisleNum}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">通道名称</div>
          <div class="item-right">{{activeData.aisleName}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">通道号</div>
          <div class="item-right">{{activeData.aisleNum}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">通道名称</div>
          <div class="item-right">{{activeData.aisleName}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">通道号</div>
          <div class="item-right">{{activeData.aisleNum}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">通道名称</div>
          <div class="item-right">{{activeData.aisleName}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">通道号</div>
          <div class="item-right">{{activeData.aisleNum}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">通道名称</div>
          <div class="item-right">{{activeData.aisleName}}</div>
        </div>
        <div class="detail-bottom">
          <div class="detail-item">
            <div class="item-left">录入时间</div>
            <div class="item-right">{{activeData.createdAt}}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入机构</div>
            <div class="item-right">{{activeData.createdDept}}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入人</div>
            <div class="item-right">{{activeData.createdBy}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      activeData: {
        oid: '保定分行',
        keyPart: 'xx重点部位',
        platform: '停车管理平台1q',
        id:'S12-KK',
        hostName: '主机A',
        brand: '海康威视',
        model: 'DS-YP300',
        ip: '192.168.0.1',
        aisleNum:'通道1',
        aisleName:'南车场入口',
        createdAt: '2020-02-03 13:23:09',
        createdDept: 'xxxx录入机构名称',
        createdBy: '张三'
      }
    }
  },
  methods: {
    create() {
      this.$emit('AddParkHost')
    },
    close() {
      this.$emit('closeEdit')
    }
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
