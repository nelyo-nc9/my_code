<template>
  <div class="protective-host">
    <!-- 防护舱主机 -->
    <div class="right-host-info">
      <div class="host-info">
        <div class="host-info-readonly">
          <table style="border-collapse:collapse;">
            <tr>
              <td>设备名称</td>
              <td>{{deviceChannelInfo.name}}</td>
            </tr>
            <tr>
              <td>IP地址</td>
              <td>
                <el-button type="primary" size="mini">{{deviceChannelInfo.ip}}</el-button>
              </td>
            </tr>
            <tr>
              <td>品牌</td>
              <td>{{deviceChannelInfo.brand}}</td>
            </tr>
            <tr>
              <td>型号</td>
              <td>{{deviceChannelInfo.model}}</td>
            </tr>
            <tr>
              <td>所属子系统</td>
              <td>{{deviceChannelInfo.system}}</td>
            </tr>
            <tr>
              <td>所属机构</td>
              <td>{{deviceChannelInfo.mechanism}}</td>
            </tr>
            <tr>
              <td>所属重点部位</td>
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
      <div class="panel-button">
        <el-button size="mini" @click="panelCancel">取消</el-button>
        <el-button size="mini" type="primary" @click="panelSave">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  data() {
    return {
      panelTitle: '摄像机',
      deviceChannelInfo: {
        name: '设备名称', // 设备名称
        ip: 'ping', // ip
        brand: '品牌', // 品牌
        model: '型号', // 型号
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
.panel-host-box {
  width: 100%;
  padding-left: 12px;
  line-height: 30px;
}
.right-host-info {
  height: 100%;
  .el-icon-delete {
    float: right;
    color: rgb(45, 114, 211);
  }

  .host-info-readonly {
    margin-top: 6px;
    // border: 1px solid rgb(242,242,242);
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
  width: 100%;
  position: absolute;
  bottom: 0;
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
