<!--
 * @Author: yanglei
 * @Date: 2020-06-08 16:39:15
 * @LastEditTime: 2020-08-21 17:21:13
 * @LastEditors: your name
 * @Description: 显示金库门禁设备详细信息对话框
 * @FilePath: \ccb-client\client\src\view\coffersManage\doorStatus\DeviceInfoModal.vue
-->

<template>
  <div class="device-info-container">
    <el-dialog
      title="设备详情"
      :visible.sync="showDeviceInfo"
      :close-on-click-modal="false"
      width="560px"
      :before-close="closeModal">
      <div class="content">
        <p><span class="dev-label">所属机构</span> <span class="dev-value">{{ relationInfo.mechanismName }}</span></p>
        <p><span class="dev-label">所属重点部位</span> <span class="dev-value">{{ relationInfo.keyPartName }}</span></p>
        <p><span class="dev-label">所属设备</span> <span class="dev-value">{{ relationInfo.equipmentName }}</span></p>
        <p><span class="dev-label">门禁平台</span> <span class="dev-value">{{ relationInfo.accessPlatform }}</span></p>
        <p><span class="dev-label">设备品牌</span> <span class="dev-value">{{ relationInfo.equipmentBrand }}</span></p>
        <p><span class="dev-label">设备型号</span> <span class="dev-value">{{ relationInfo.equipmentModel }}</span></p>
        <p><span class="dev-label">设备类型</span> <span class="dev-value">{{ relationInfo.equipmentType }}</span></p>
        <p><span class="dev-label">资产编码</span> <span class="dev-value">{{ relationInfo.assetCode }}</span></p>
        <p><span class="dev-label">IP地址</span> <span class="dev-value">{{ relationInfo.iPAddr }}</span>
          <span v-if="relationInfo.iPAddr" class="ping-text" @click="pingIPAddr">ping</span>
        </p>
        <p><span class="dev-label">备注</span> <span class="dev-value">{{ relationInfo.remark }}</span></p>

        <div class="vertical-line"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDoorRelationApi, pingIPAddrApi } from '../../../http/coffersManage/doorStatus.api.js'

export default {
  name: 'DeviceInfo',
  props: {
    showDeviceInfo: {
      type: Boolean,
      default: false
    },
    deviceInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      relationInfo: {}
    }
  },
  mounted() {
    getDoorRelationApi(this.deviceInfo.id)
      .then(res => {
        let resData = res.data.data
        this.relationInfo = {
          mechanismName: resData.orgName, // 所属机构
          keyPartName: resData.keyPartName, // 所属重点部位
          equipmentName: resData.subSystemName, // 所属设备
          accessPlatform: resData.platformName, // 门禁平台
          equipmentBrand: resData.hostBrand, // 设备品牌
          equipmentModel: resData.hostModel, // 设备型号
          equipmentType: ['', '金库门禁', '普通门禁', '互锁门门禁'][resData.hostType], // 设备类型
          assetCode: resData.hostAssetCode, // 资产编码
          iPAddr: resData.platformIp, // IP地址
          remark: resData.remark || '' // 备注
        }
      })
      .catch(() => {})
  },
  methods: {
    /**
     * @description: 通知父组件关闭对话框
     * @param {type} 无
     * @return: 无
     */
    closeModal() {
      this.$emit('close')
    },
    /**
     * @description: ping IP地址
     * @param {type} 无
     * @return: 无
     */
    pingIPAddr() {
      pingIPAddrApi({ip: this.relationInfo.iPAddr})
        .then(() => {
          this.$messageSuccess('成功', '成功')
        })
        .catch(() => {
          this.$messageError('网络异常，请稍后再试！', '错误')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.device-info-container {
  .content {
    font-size: 14px;
    line-height: 40px;
    padding-left: 40px;
    .dev-label {
      color: #999999;
      width: 150px;
      display: inline-block;
    }
    .ping-text {
      width: 60px;
      color: #2D72D3;
      text-align: center;
      text-decoration: underline;
      cursor: pointer;
      display: inline-block;
    }

    .vertical-line {
      width: 0px;
      height: calc(~"100% - 110px");
      border: 1px solid #E4E4E4;
      position: absolute;
      top: 80px;
      left: 175px;
    }
  }
}
</style>
