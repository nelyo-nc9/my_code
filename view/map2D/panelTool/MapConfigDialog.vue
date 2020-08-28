<template>
  <div class="mapConfig">
    <el-dialog title="地图配置" :visible.sync="mapToolbarStatus.mapConfigControl" width="30%" :show-close="false">
      <el-form :model="configFormData" :rules="configFormRules" ref="configFormData">
        <el-form-item label="地图源" label-width="100px">
          <el-radio-group v-model="configFormData.mapSource">
            <el-radio disabled label="gis">GIS服务器</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="瓦片类型" label-width="100px">
          <el-radio-group v-model="configFormData.tileType">
            <el-radio label="geoserver">geoserver</el-radio>
            <el-radio label="arcgis">arcgis</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="服务器地址" label-width="100px" prop="serverUrl">
          <el-input v-model="configFormData.serverUrl"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="reInit">初始化</el-button>
        <el-button size="small" type="primary" @click="confirmSubmit">确 定</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('map2d/mapIndex', ['mapToolbarStatus'])
  },
  data() {
    return {
      configFormData: {
        mapSource: 'gis',
        tileType: 'geoserver',
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
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          } else if (res.data && res.data.id && res.data.mapSource) {
            this.configFormData = JSON.parse(JSON.stringify(res.data))
            this.existMapConfig = JSON.parse(JSON.stringify(res.data))
            this.setMapConfigDlgFormData(res.data)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    reInit() {
      // 初始化地图配置
      this.$confirm('初始化将会清空当前地图的所有内容', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const formData = {
            mapSource: 'serverGIS',
            tileType: 'geoserver',
            serverUrl: ''
          }
          this.setMapConfigDlgFormData(formData)
          this.$notify({
            title: '成功',
            type: 'success',
            message: '初始化成功!'
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 保存
    confirmSubmit() {
      this.$refs.configFormData.validate(valid => {
        if (valid) {
          if (this.configFormData.id) {
            if (
              this.existMapConfig.mapSource === this.configFormData.mapSource &&
              this.existMapConfig.tileType === this.configFormData.tileType &&
              this.existMapConfig.serverUrl === this.configFormData.serverUrl
            ) {
              this.setMapToolbarStatus('mapConfigControl')
            } else {
              this.editMapConfigDlgFormData(this.configFormData)
                .then(res => {
                  if (res.code !== 0) {
                    this.$notify({
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
            this.addMapConfigDlgFormData(this.configFormData)
              .then(res => {
                if (res.code !== 0) {
                  this.$notify({
                    title: '失败',
                    type: 'error',
                    message: res.message
                  })
                } else {
                  // this.setMapToolbarStatus('mapConfigControl')
                  this.$notify({
                    title: '成功',
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
  background-color: rgba(51, 51, 51, 0.5);
}
.mapConfig >>> .el-dialog {
  background-color: rgba(51, 51, 51, 0.5);
}
.mapConfig >>> .el-dialog__title,
.mapConfig >>> .el-form-item__label,
.mapConfig >>> .el-radio {
  color: #fff;
}
</style>
