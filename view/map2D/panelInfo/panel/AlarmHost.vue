<template>
  <div>
    <div class="organization-info">
      <div class="organize-info-readonly">
        <table style="border-collapse:collapse;">
          <tr><td>设备名称</td><td>{{equipmentForm.name}}</td></tr>
          <tr><td>IP地址</td><td><span>{{equipmentForm.ipAddress}}</span><el-button type="primary" size="mini" style="float: right;">ping</el-button></td></tr>
          <tr><td>设备类型</td><td>{{equipmentForm.type}}</td></tr>
          <tr><td>品牌</td><td>{{equipmentForm.brand}}</td></tr>
          <tr><td>型号</td><td>{{equipmentForm.model}}</td></tr>
          <tr><td>所属子系统</td><td>{{equipmentForm.subsystem}}</td></tr>
          <tr><td>所属重点部位</td><td>{{equipmentForm.importPart}}</td></tr>
          <tr><td>所属机构</td><td>{{equipmentForm.organization}}</td></tr>
          <tr><td>状态</td><td>{{equipmentForm.status}}</td></tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      equipmentForm: {
        name: '',
        ipAddress: '',
        type: '',
        brand: '',
        model: '',
        subsystem: '',
        organization: '',
        importPart: '',
        status: ''
      }
    }
  },
    computed: {
    ...mapState({
      isMapEdit:({ map2d }) => map2d.mapIndex.isMapEdit,
    })
  },
}
</script>

<style lang="less" scoped>
.organize-info-readonly,.organize-info-form,.organize-info-add{
      margin-top: 6px;
      box-sizing: border-box;
      table{
        width: 100%;
        td{
          &:first-child{
            background-color: #f8f8f8;
          }
          border: 1px solid #f2f2f2;
          background-color: #fff;
        }
      }
      td{
        &:first-child{
          width: 90px;
          text-align: center;
        }
        height: 33px;
        padding: 0 6px;
        line-height: 32px;
        box-sizing: border-box;
      }
    }
</style>