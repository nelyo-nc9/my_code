<!--
 * @Description: 门禁通道面板
 * @Author: anli
 * @Date: 2020-05-25 11:57:43
 * @LastEditTime: 2020-05-25 12:02:05
 * @LastEditors: anli
-->

<template>
  <div id="access">
    <div class="access-control-content">
      <table class="table">
        <tr class="table-item">
          <td class="table-item-label">门禁通道名称</td>
          <td>{{valData.resource.class}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">门禁通道号</td>
          <td>{{valData.resource.serise}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">门禁通道类型</td>
          <td>{{valData.resource.channelType}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">所属设备</td>
          <td>{{valData.resource.equipment}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">所属平台</td>
          <td>{{valData.resource.platformName}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">品牌</td>
          <td>{{valData.resource.brand}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">型号</td>
          <td>{{valData.resource.model}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">所属子系统</td>
          <td>{{valData.resource.subsystem}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">所属机构</td>
          <td>{{valData.resource.orgName}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">所属重点部位</td>
          <td>{{valData.resource.keyPartName}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">状态</td>
          <td v-if="valData.resource.status === 1">在线</td>
          <td v-else>离线</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">可见层级</td>
          <td>{{this.visibleLevel}}</td>
        </tr>
      </table>
    </div>
    <div class="bottom_btn">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="ok">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import PanelInfoFun from './PanelInfoFun'
export default {
  name: 'access',
  mixins: [PanelInfoFun],
  data() {
    return {
      organizationInfo: {
        name: '名称',
        ip: '192.168.22.56',
        type: '类型',
        equipment: '设备',
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
    },
    valData: {
      type: Object
    }
  },
  computed: {
    ...mapState({
      isMapEdit: ({ map2d }) => map2d.mapIndex.isMapEdit
    }),
    // 可见层级
    visibleLevel() {
      return window.$context2D.map.getView().getZoom()
    }
  },
  methods: {
    /**
     * @description: 保存门禁通道点位信息
     * @param {String}
     */
    ok() {
      console.log('保存门禁通道修改')
    },
    /**
     * @description: 取消门禁通道点位修改信息
     * @param {String}
     */
    cancel() {
      this.closePanelInfo()
      console.log('取消门禁通道修改')
    }
  }
}
</script>

<style lang="less">
  #access {
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
