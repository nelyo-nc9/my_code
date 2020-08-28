<!--
 * @Description: 门禁主机面板
 * @Author: anli
 * @Date: 2020-05-25 11:09:39
 * @LastEditTime: 2020-05-25 12:01:24
 * @LastEditors: anli
-->

<template>
  <div id="AccessControlHost">
    <div class="access-control-content">
      <table class="table">
        <tr class="table-item">
          <td class="table-item-label">设备名称</td>
          <td>{{organizationInfo.name}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">地址</td>
          <td>
            <span class="table-item-ip">{{organizationInfo.ip}}</span>
            <el-button type="primary" size="mini" @click="handlerPing(organizationInfo.ip)">ping</el-button>
          </td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">主机类型</td>
          <td>{{organizationInfo.type}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">品牌</td>
          <td>{{organizationInfo.brand}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">型号</td>
          <td>{{organizationInfo.model}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">所属平台</td>
          <td>{{organizationInfo.platform}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">所属子系统</td>
          <td>{{organizationInfo.subsystem}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">所属机构</td>
          <td>{{organizationInfo.org}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">所属重点部位</td>
          <td>{{organizationInfo.keyParts}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">状态</td>
          <td>{{organizationInfo.status}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">可见层级</td>
          <td>{{organizationInfo.level}}</td>
        </tr>
      </table>
    </div>
    <div class="bottom_btn" v-if="isEdit">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="ok">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import PanelInfoFun from './PanelInfoFun'
export default {
  name: 'AccessControlHost',
  mixins: [PanelInfoFun],
  data() {
    return {
      organizationInfo: {
        name: '名称',
        ip: '192.168.22.56',
        type: '类型',
        brand: '品牌',
        model: '型号',
        platform: '平台',
        subsystem: '子系统',
        keyParts: '重点部位',
        org: '机构',
        status: '状态',
        level: '1'
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
    computed: {
    ...mapState({
      isMapEdit:({ map2d }) => map2d.mapIndex.isMapEdit,
    })
  },
  methods: {
    /**
     * @description: 保存门禁主机点位信息
     * @param {String}
     */
    ok() {
      console.log('保存门禁主机修改')
    },
    /**
     * @description: 取消门禁主机点位修改信息
     * @param {String}
     */
    cancel() {
      this.closePanelInfo()
      console.log('取消门禁主机修改')
    }
  }
}
</script>

<style lang="less" scoped>
  #AccessControlHost {
    height: calc(~"100% - 34px");
    min-height: calc(~"100% - 34px");
    position: relative;
    .access-control-content {
      min-height: calc(~"100% - 30px");
      padding: 0 0 20px 0;
      .table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #e6e6e6;
        border-bottom: none;

        .table-item {
          height: 30px;
          line-height: 30px;
          width: 100%;
          border-bottom: 1px solid #e6e6e6;
          text-align: center;

          .table-item-label {
            width: 80px;
            border-right: 1px solid #e6e6e6;
          }

          .table-item-ip {
            display: inline-block;
            width: 138px;
            height: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
          }
        }
      }
    }

    .bottom_btn {
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
  }
</style>
