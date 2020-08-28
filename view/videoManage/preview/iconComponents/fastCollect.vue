<template>
  <div class="favorite-box">
    <el-dialog
      title="选择收藏夹"
      :visible.sync="openselectFavCopy"
      width="380px"
      :destroy-on-close="true"
      :before-close="handleClose"
      :modal="isNeedModal"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      center>
      <div class="favorite-content">
        <div class="favorite-item">
          <div class="favorite-label">收藏夹</div>
          <el-select v-model="favoritesName" placeholder="请选择">
            <el-option style="width:240px;"
              v-for="item in favoritesList"
              :key="item.label"
              :label="item.value"
              :value="item.label">
            </el-option>
          </el-select>
        </div>
        <div class="favorite-item" v-if="favoritesName === '选项3'">
          <div class="favorite-label">新建收藏夹</div>
          <el-input v-model="nowName" placeholder="请输入内容" @blur="validateStr64"></el-input>
        </div>
        <div class="error-box" v-if="favoritesName === '选项3' && groupError">{{groupError}}</div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCollectList, updataCollect, postCollect } from '@src/http/video/videoPreview.api.js'

export default {
  name: 'Collect',
  inheritAttrs: false,
  data() {
    return {
      openselectFavCopy: false,
      nowName: '',
      favoritesName: '',
      favoritesList: [],
      groupError: ''
    }
  },
  props: {
    videoStatusArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    openselectFav: {
      type: Boolean
    },
    sourceType: {
      type: String,
      default: 'plugin'
    },
    pushFavData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isNeedModal: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.getFavoritesNameList()
  },
  mounted() {
    this.openselectFavCopy = this.openselectFav
  },
  watch: {
    favoritesName() {
      this.groupError = ''
      this.nowName = ''
    }
  },
  methods: {
    getFavoritesNameList() {
      getCollectList({keword: ''}).then(res => {
        if (res.data.code === 0) {
          this.favoritesList = res.data.data.results.map(item => {
            return {
              value: item.name,
              label: item.id,
              pollingTime: item.pollingTime,
              isPolling: item.isPolling || false,
              rIds: item.channelWithHostList && item.channelWithHostList.map(i => i.channelId) || []
            }
          })
          this.favoritesList.push({
            label: '选项3',
            value: '新建收藏夹'
          })
        }
      })
    },
    save() {
      if (!this.favoritesName) {
        this.$messageWarn('请选择收藏夹')
        return
      }
      if (this.groupError) {
        this.$messageWarn('请检查输入，校验不合法')
        return
      }
      if (this.sourceType === 'tree') {
        if (this.nowName) {
          this.createFav([this.pushFavData.id])
        } else {
          this.updateFav([this.pushFavData.id])
        }
      } else {
        let isPlayIds = []
        this.videoStatusArr.map(item => {
          if (item.isPlay) {
            if (isPlayIds.findIndex((xx) => xx === item.source.id) === -1) { // 防止开多个镜头都添加到收藏夹中
              isPlayIds.push(item.source.id)
            }
          }
        })
        if (this.nowName) {
          this.createFav(isPlayIds)
        } else {
          this.updateFav(isPlayIds)
        }
      }
    },
    createFav(isPlayIds) {
      let params = {
        name: this.nowName,
        rIds: isPlayIds
      }
      postCollect(params).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('收藏成功')
          this.openselectFavCopy = false
          this.$emit('cancel')
        } else {
          this.$messageError(res.data.message)
        }
      })
    },
    updateFav(isPlayIds) {
      let selectFav = this.favoritesList.find(i => i.label === this.favoritesName)
      // 去重
      let rIds = []
      isPlayIds.forEach(k => {
        let index = selectFav.rIds.findIndex(i => i === k)
        index === -1 && rIds.push(k)
      })
      let params = {
        id: selectFav.label,
        name: selectFav.value,
        isPolling: selectFav.isPolling,
        pollingTime: selectFav.pollingTime,
        rIds: rIds.concat(selectFav.rIds)
      }
      updataCollect(params).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('收藏成功')
          this.openselectFavCopy = false
          this.$emit('cancel')
        } else {
          this.$messageError(res.data.message)
        }
      })
    },
    handleClose() {
      this.openselectFavCopy = false
      this.$emit('cancel')
    },
    validateStr64(value) {
      value = value.target.value
      if (value.trim().length) {
        // Unicode编码
        let strlen = 0
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) {
            // 如果是汉字，则字符串长度加2
            strlen += 2
          } else {
            strlen++
          }
        }
        this.groupError = strlen > 128 ? '名称为0-128个字符或0-64中文' : ''
      } else {
        this.groupError = '不能为空'
      }
    }
  }
}

</script>
<style lang='less' scoped>
.favorite-box {
  .favorite-content {
    .favorite-item {
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      .favorite-label {
        width: 80px;
        line-height: 40px;
        display: inline-block;
      }
      .el-input,.el-select {
        width: 240px;
      }
    }
    .error-box {
      text-indent: 80px;
      font-size: 12px;
      color: #f56c6c;
    }
  }
}
/deep/ .el-select-dropdown {
  width: 240px;
}
</style>
