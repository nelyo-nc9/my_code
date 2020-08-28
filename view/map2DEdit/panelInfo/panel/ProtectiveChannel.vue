<template>
  <div class="protective-channel">
    <!-- 防护舱通道 -->
    <div class="right-channel-info">
      <div class="channel-info">
        <div class="channel-info-readonly">
          <table style="border-collapse:collapse;">
            <tr>
              <td>通道名称</td>
              <td>{{deviceChannelInfo.name}}</td>
            </tr>
            <tr>
              <td>通道号</td>
              <td>{{deviceChannelInfo.number}}</td>
            </tr>
            <tr>
              <td>通道ID</td>
              <td>{{deviceChannelInfo.id}}</td>
            </tr>
            <tr>
              <td>所属主机</td>
              <td>{{deviceChannelInfo.host}}</td>
            </tr>
            <tr>
              <td>所属子系统</td>
              <td>{{deviceChannelInfo.system}}</td>
            </tr>
            <tr>
              <td>所属重点部位</td>
              <td>{{deviceChannelInfo.mechanism}}</td>
            </tr>
            <tr>
              <td>所属机构</td>
              <td>{{deviceChannelInfo.part}}</td>
            </tr>
            <tr>
              <td>状态</td>
              <td>{{deviceChannelInfo.status}}</td>
            </tr>
            <tr v-if="isEdit">
              <td>可见层级</td>
              <td>{{deviceChannelInfo.level}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="panel-button">
      <el-button size="mini" @click="panelCancel">取消</el-button>
      <el-button size="mini" type="primary" @click="panelSave">保存</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      panelTitle: '摄像机',
      deviceChannelInfo: {
        name: '通道名称', // 通道名称
        number: '通道号', // 通道号
        id: '通道id', // 通道id
        host: '型号', // 主机
        system: '子系统', // 子系统
        mechanism: '机构', // 机构
        part: '所属重点部位', // 部位
        status: '状态', // 状态
        level: '层级' // 层级
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /*
     * 面板右侧删除
     */
    deleteCamera() {
      console.log(111)
    },
    /*
     * 面板右侧取消
     */
    panelCancel() {},
    /*
     * 面板右侧保存
     */
    panelSave() {}
  }
}
</script>
<style lang="less" scoped>
.protective-channel {
  height: 95%;
}
.panel-camera-box {
  width: 100%;
  padding-left: 12px;
  line-height: 30px;
}
.right-channel-info {
  height: 100%;
  .el-icon-delete {
    float: right;
    color: rgb(45, 114, 211);
  }

  .channel-info-readonly {
    margin-top: 6px;
    box-sizing: border-box;
    table {
      width: 100%;
    }
    td {
      &:first-child {
        width: 90px;
        text-align: center;
        background-color: #f8f8f8;
      }
      height: 33px;
      padding: 0 6px;
      line-height: 32px;
      box-sizing: border-box;
      background-color: #fff;
      border: 1px solid #f2f2f2;
    }
  }
  .el-form-item {
    margin-bottom: 5px;
    border-bottom: 1px solid #f2f2f2;
  }
}
.panel-button {
  // width: 100%;
  position: fixed;
  bottom: 0;
  // text-align: center;
  margin-top: 20px;
  .el-button {
    margin-left: 30px;
  }
}
</style>
<style scoped>
.el-input >>> .el-input__inner {
  border: 1px solid transparent;
  box-sizing: border-box;
}
.el-input {
  width: 90%;
  outline: none;
}
.el-checkbox >>> .el-checkbox__label {
  font-size: 12px;
  color: #000;
}
.el-form-item >>> .el-form-item__label {
  font-size: 12px;
  color: #000;
}
</style>
