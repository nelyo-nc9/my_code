<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setPanelInfoStatus' // 设备右侧面板显隐状态
    ]),
    ...mapActions('map2d/mapPoint', [
      'getCommonResourceById', // 获取地图设备点位详情
      'addMapCommonResourcePoint', // 新增地图设备点位
      'updateMapCommonResourcePoint' // 修改地图设备点位
    ]),
    /**
     * @description: ping操作
     * @param {String} val ping操作的ip
     */
    handlerPing(val) {
      console.log('ping', val)
    },
    /**
     * @description: 取消右侧面板显示
     * @param {String}
     */
    closePanelInfo() {
      this.setPanelInfoStatus(false)
    },
    /**
     * @description: 新增点位
     * @param {String} params 点位信息
     */
    addCommonResourcePoint(params) {
      return new Promise((resolve, reject) => {
        this.addMapCommonResourcePoint(params).then(res => {
          if (res.code !== 0) {
            this.$message({
              type: 'error',
              message: res.message
            })
            reject(res)
          } else {
            this.$message({
              type: 'success',
              message: '新增点位成功'
            })
            resolve(res)
          }
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    },
    /**
     * @description: 修改点位
     * @param {String} params 点位信息
     */
    updateCommonResourcePoint(params) {
      return new Promise((resolve, reject) => {
        this.updateMapCommonResourcePoint(params).then(res => {
          if (res.code !== 0) {
            this.$message({
              type: 'error',
              message: res.message
            })
            reject(res)
          } else {
            this.$message({
              type: 'success',
              message: '修改点位成功'
            })
            resolve(res)
          }
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    }
  }
}
</script>
