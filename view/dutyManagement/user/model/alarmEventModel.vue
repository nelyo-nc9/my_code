<!--
 * @Author: your name
 * @Date: 2020-06-01 21:18:14
 * @LastEditTime: 2020-06-15 15:51:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\dutyManagement\user\model\alarmEventModel.vue
-->
<template>
  <div class="eventRecordModel">
    <el-dialog title="报警事件" :visible.sync="alarmModelVisible" :before-close="handleClose" width="85%">
      <el-table :data="alarmEventTableData" height="250" stripe style="width: 100%"></el-table-column>
        <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
        <el-table-column prop="numberMergers" label="合并数量" width="80" align="center"></el-table-column>
        <el-table-column prop="parentAgency" label="所属机构" width="120" align="center"></el-table-column>
        <el-table-column prop="parts" label="所属部位" width="120" align="center"></el-table-column>
        <el-table-column prop="device" label="所属设备" width="120" align="center"></el-table-column>
        <el-table-column prop="alarmType" label="报警分类" width="120" align="center"></el-table-column>
        <el-table-column prop="alarmName" label="报警名称" width="120" align="center"></el-table-column>
        <el-table-column prop="eventTime" label="发生时间" width="160" align="center"></el-table-column>
        <el-table-column prop="alarmRank" label="报警等级" width="120" align="center"></el-table-column>
        <el-table-column prop="processingState" label="处理状态" width="100" align="center"></el-table-column>
        <el-table-column prop="intercomRequest" label="对讲请求" width="120" align="center"></el-table-column>
        <el-table-column prop="alarmSource" label="报警来源" width="120" align="center"></el-table-column>
        <el-table-column prop="processingType" label="处理类型" width="100" align="center"></el-table-column>
        <el-table-column prop="handlingComments" label="处理意见" width="100" align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelAlarmEventDialog">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmedAlarmEventDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'alarmEventModel',
  props: {
    alarmModelVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 报警事件弹窗表格信息
      alarmEventTableData: [
        {
          numberMergers: 20,
          parentAgency: 'XXX',
          parts: 'XXX',
          device: 'XXX',
          alarmType: 'XXX',
          alarmName: 'XXX',
          eventTime: 'XXX',
          alarmRank: 'XXX',
          processingState: 'XXX',
          intercomRequest: 'XXX',
          alarmSource: 'XXX',
          processingType: 'XXX',
          handlingComments: 'XXX'
        },
        {
          numberMergers: 20,
          parentAgency: 'XXX',
          parts: 'XXX',
          device: 'XXX',
          alarmType: 'XXX',
          alarmName: 'XXX',
          eventTime: 'XXX',
          alarmRank: 'XXX',
          processingState: 'XXX',
          intercomRequest: 'XXX',
          alarmSource: 'XXX',
          processingType: 'XXX',
          handlingComments: 'XXX'
        },
        {
          numberMergers: 20,
          parentAgency: 'XXX',
          parts: 'XXX',
          device: 'XXX',
          alarmType: 'XXX',
          alarmName: 'XXX',
          eventTime: 'XXX',
          alarmRank: 'XXX',
          processingState: 'XXX',
          intercomRequest: 'XXX',
          alarmSource: 'XXX',
          processingType: 'XXX',
          handlingComments: 'XXX'
        },
        {
          numberMergers: 20,
          parentAgency: 'XXX',
          parts: 'XXX',
          device: 'XXX',
          alarmType: 'XXX',
          alarmName: 'XXX',
          eventTime: 'XXX',
          alarmRank: 'XXX',
          processingState: 'XXX',
          intercomRequest: 'XXX',
          alarmSource: 'XXX',
          processingType: 'XXX',
          handlingComments: 'XXX'
        },
        {
          numberMergers: 20,
          parentAgency: 'XXX',
          parts: 'XXX',
          device: 'XXX',
          alarmType: 'XXX',
          alarmName: 'XXX',
          eventTime: 'XXX',
          alarmRank: 'XXX',
          processingState: 'XXX',
          intercomRequest: 'XXX',
          alarmSource: 'XXX',
          processingType: 'XXX',
          handlingComments: 'XXX'
        },
        {
          numberMergers: 20,
          parentAgency: 'XXX',
          parts: 'XXX',
          device: 'XXX',
          alarmType: 'XXX',
          alarmName: 'XXX',
          eventTime: 'XXX',
          alarmRank: 'XXX',
          processingState: 'XXX',
          intercomRequest: 'XXX',
          alarmSource: 'XXX',
          processingType: 'XXX',
          handlingComments: 'XXX'
        },
        {
          numberMergers: 20,
          parentAgency: 'XXX',
          parts: 'XXX',
          device: 'XXX',
          alarmType: 'XXX',
          alarmName: 'XXX',
          eventTime: 'XXX',
          alarmRank: 'XXX',
          processingState: 'XXX',
          intercomRequest: 'XXX',
          alarmSource: 'XXX',
          processingType: 'XXX',
          handlingComments: 'XXX'
        },
        {
          numberMergers: 20,
          parentAgency: 'XXX',
          parts: 'XXX',
          device: 'XXX',
          alarmType: 'XXX',
          alarmName: 'XXX',
          eventTime: 'XXX',
          alarmRank: 'XXX',
          processingState: 'XXX',
          intercomRequest: 'XXX',
          alarmSource: 'XXX',
          processingType: 'XXX',
          handlingComments: 'XXX'
        }
      ]
    }
  },
  computed: {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    cancelAlarmEventDialog() {
      this.$emit('alarmModelVisible', false)
    },
    confirmedAlarmEventDialog() {
      this.$emit('alarmModelVisible', false)
    },
    handleClose() {
      this.$emit('alarmModelVisible', false)
    }
  }
}
</script>

<style scoped  lang="less">
@import '../../../../assets/elementModify.less';
.eventRecordModel {
  height: 100%;
  width: 100%;
}
/deep/.el-dialog__headerbtn {
  font-size: 25px;
}
/deep/.el-table--scrollable-y .el-table__body-wrapper {
    overflow-y: scroll!important;
  }
</style>
