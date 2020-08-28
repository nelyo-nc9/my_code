<template>
  <div class="mapConfig">
    <el-dialog title="地图配置" :visible.sync="mapToolbarStatus.mapConfigControl" width="30%" :show-close="false">
      <el-form :model="configFormData" :rules="configFormRules" ref="configFormData">
        <el-form-item label="地图源" label-width="100px">
          <el-radio-group v-model="configFormData.mapSource">
            <el-radio label="1">GIS服务器</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="瓦片类型" label-width="100px">
          <el-radio-group v-model="configFormData.tileType">
            <el-radio label="1">geoserver</el-radio>
            <el-radio label="2">arcgis</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="服务器地址" label-width="100px" prop="serverUrl">
          <el-input v-model="configFormData.serverUrl"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="reInit">初始化</el-button>
        <div>
          <el-button size="small" type="primary" @click="confirmSubmit">确 定</el-button>
          <el-button size="small" @click="cancel">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { deleteAllResourceInfo } from './../../../http/map2D/point'
export default {
  computed: {
    ...mapState('map2d/mapIndex', ['mapToolbarStatus'])
  },
  data() {
    return {
      configFormData: {
        mapSource: '1',
        tileType: '1',
        serverUrl: ''
      },
      existMapConfig: {},
      configFormRules: {
        serverUrl: [{ required: true, message: '请输入服务器地址', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'updateMapUrl',
      'setMapToolbarStatus',
      'setMapConfigDlgFormData',
      'addMapConfigDlgFormData',
      'editMapConfigDlgFormData',
      'getMapConfigDlgFormData'
    ]),
    initData() {
      this.getMapConfigDlgFormData()
        .then(res => {
          if (res.code !== 0) {
            this.$message({
              type: 'error',
              message: res.message
            })
          } else if (res.data && res.data.id) {
            if (res.data.id && res.data.id !== '0') {
              this.configFormData.id = res.data.id
            }
            if (res.data && res.data.mapSource && res.data.tileType && res.data.serverUrl) {
              this.configFormData = JSON.parse(JSON.stringify(res.data))
              this.configFormData.mapSource = this.configFormData.mapSource
                ? this.configFormData.mapSource.toString()
                : '1'
              this.configFormData.tileType = this.configFormData.tileType
                ? this.configFormData.tileType.toString()
                : '1'
              this.existMapConfig = JSON.parse(JSON.stringify(res.data))
              this.setMapConfigDlgFormData(res.data)
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    reInit() {
      // 初始化地图配置
      this.$confirm('初始化将会清空当前地图的所有点位', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.runDeleteAllResourceInfo()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    runDeleteAllResourceInfo() {
      deleteAllResourceInfo()
        .then(res => {
          document.location.reload()
          this.$notify({
            type: 'success',
            message: '初始化成功!'
          })
        })
        .catch(err => {
          console.log('初始化失败', err)
          this.$notify({
            type: 'info',
            message: '初始化失败'
          })
        })
    },
    // 保存
    confirmSubmit() {
      console.log(this.configFormData)
      this.$refs.configFormData.validate(valid => {
        if (valid) {
          if (this.configFormData.id) {
            if (
              this.existMapConfig.mapSource === Number(this.configFormData.mapSource) &&
              this.existMapConfig.tileType === Number(this.configFormData.tileType) &&
              this.existMapConfig.serverUrl === this.configFormData.serverUrl
            ) {
              this.setMapToolbarStatus('mapConfigControl')
            } else {
              console.log('修改', this.configFormData)
              this.editMapConfigDlgFormData({
                id: this.configFormData.id,
                mapSource: Number(this.configFormData.mapSource),
                tileType: Number(this.configFormData.tileType),
                serverUrl: this.configFormData.serverUrl
              })
                .then(res => {
                  console.log(res)
                  if (res.code !== 0) {
                    this.$message({
                      type: 'error',
                      message: res.message
                    })
                  } else {
                    // this.setMapToolbarStatus('mapConfigControl')
                    document.location.reload()
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            }
          } else {
            console.log('id不存在')
            this.addMapConfigDlgFormData({
              mapSource: Number(this.configFormData.mapSource),
              tileType: Number(this.configFormData.tileType),
              serverUrl: this.configFormData.serverUrl
            })
              .then(res => {
                if (res.code !== 0) {
                  this.$message({
                    type: 'error',
                    message: res.message
                  })
                } else {
                  // this.setMapToolbarStatus('mapConfigControl')
                  this.$notify({
                    type: 'success',
                    message: '新增地图配置成功'
                  })
                  document.location.reload()
                }
                console.log(res)
              })
              .catch(err => {
                console.log(err)
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.setMapToolbarStatus('mapConfigControl')
    }
  }
}
</script>

<style scoped>
.mapConfig >>> .el-dialog__header {
  background-color: #FFF;
}
.mapConfig >>> .el-dialog {
  background-color: #FFF;
}
.mapConfig >>> .el-dialog__title,
.mapConfig >>> .el-form-item__label,
.mapConfig >>> .el-radio {
  color: #333333;
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
