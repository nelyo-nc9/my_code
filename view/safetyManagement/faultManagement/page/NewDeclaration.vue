<template>
  <div class="content-page">
    <div class="left-tree">
      <OrgTree></OrgTree>
    </div>
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
            <el-breadcrumb-item>故障管理</el-breadcrumb-item>
            <el-breadcrumb-item>故障申报</el-breadcrumb-item>
            <el-breadcrumb-item>新建</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="form-box">
          <div class="form-content">
            <div class="form-content-left">
              <el-form ref="form"
                       :model="form"
                       size="mini"
                       label-width="160px">
                <el-form-item label="故障设备">
                  <el-input v-model="form.guardName"></el-input>
                </el-form-item>
                <el-form-item label="所属机构">
                  <el-input v-model="form.guardName"></el-input>
                </el-form-item>
                <el-form-item label="所属平台">
                  <el-input v-model="form.guardName"></el-input>
                </el-form-item>
                <el-form-item label="发现人">
                  <el-input v-model="form.guardName"></el-input>
                </el-form-item>
                <el-form-item label="申报类型">
                  <el-select v-model="form.logType">
                    <el-option label="网络故障"
                               value="1">
                    </el-option>
                    <el-option label="设备故障"
                               value="2">
                    </el-option>
                    <el-option label="软件故障"
                               value="3">
                    </el-option>
                    <el-option label="其他"
                               value="4">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div class="form-content-right">
              <el-form ref="form"
                       :model="form"
                       size="mini"
                       label-width="160px">
                <el-form-item label="故障单号">
                  <el-input v-model="form.guardName"></el-input>
                </el-form-item>
                <el-form-item label="所属重点部位">
                  <el-input v-model="form.guardName"></el-input>
                </el-form-item>
                <el-form-item label="所属设备">
                  <el-input v-model="form.guardName"></el-input>
                </el-form-item>
                <el-form-item label="发现时间">
                  <el-input v-model="form.guardName"></el-input>
                </el-form-item>
                <el-form-item label="申报原因">
                  <el-input v-model="form.guardName"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="time-form">
            <el-form ref="form"
                     :model="form"
                     size="mini"
                     label-width="100px">
              <el-form-item label="录入时间">
                <el-input v-model="form.guardName"></el-input>
              </el-form-item>
              <el-form-item label="录入机构">
                <el-input v-model="form.guardName"></el-input>
              </el-form-item>
              <el-form-item label="录入人">
                <el-input v-model="form.guardName"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="form-footer">
            <el-button size="mini">保存</el-button>
            <el-button size="mini">重置</el-button>
            <el-button size="mini">打印</el-button>
            <el-button size="mini">关闭</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrgTree from '../../components/OrgTree'
export default {
  components: {
    OrgTree
  },
  data() {
    return {
      form: {
        // 表单数据数据
        orgId: '',
        platformId: '',
        logType: '',
        guardName: '',
        keyPartId: '',
        subLogType: '',
        guardChannelName: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.content-page {
  width: 100%;
  height: 100%;
  position: relative;
  .top-box {
    height: 100%;
    width: 100%;
    .form-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 89px;
      .form-content {
        margin-bottom: 100px;
      }
      .time-form {
        padding-left: 5px;
      }
    }
  }
  .form-content {
    width: 828px;
    display: flex;
    justify-content: space-between;
    border: 1px solid #e1e1e1;
    padding: 10px 50px 0px;
    margin-left: 60px;
  }
  .time-form {
    .el-form {
      display: flex;
    }
  }
  .el-breadcrumb {
    i {
      margin-right: 5px;
    }
    display: flex;
    align-items: c;
    align-items: center;
    padding: 10px 0px 10px 3px;
  }
  .left-tree {
    width: 240px;
    height: 100%;
    position: absolute;
    border-right: 1px solid #e1e1e1;
  }
  .right-content {
    height: 100%;
    width: calc(~'100% - 240px');
    position: absolute;
    left: 240px;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
  }
}
</style>
