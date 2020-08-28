<template>
  <div class="favorite-box">
    <el-dialog
      title="选择收藏夹"
      :visible.sync="openselectFav"
      width="380px"
      :before-close="closeModal">

      <div class="favorite-content">
        <div class="favorite-item">
          <div class="favorite-label">收藏夹</div>
          <el-select v-model="favSelected" placeholder="请选择">
            <el-option
              v-for="item in favSelectData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="favorite-item" v-if="favSelected === '选项3'">
          <div class="favorite-label">新建收藏夹</div>
          <el-input v-model="favInpValue" placeholder="请输入内容"></el-input>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveFavFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFavoriteListApi } from '../../../http/video/videoPlayback.api'

export default {
  props: {
    openselectFav: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      favSelected: '',
      favSelectData: [
        {
          value: '选项1',
          label: '自定义收藏夹'
        },
        {
          value: '选项2',
          label: 'aaaaaaa'
        },
        {
          value: '选项3',
          label: '新建收藏夹'
        }
      ],
      favInpValue: ''
    }
  },
  methods: {
    // 获取收藏夹列表数据
    getFavoriteDataFun() {
      getFavoriteListApi({ownerId: 'zhangsan'})
        .then(res => {
          console.log('获取到的收藏夹列表数据 ============== ', res)
        })
        .catch(() => { console.log('获取收藏夹列表数据失败') })
    },
    // 保存收藏夹参数
    saveFavFun() {
      // TODO  调用接口 保存数据
      this.closeModal()
    },
    closeModal() {
      this.$emit('closeselectFav')
    }
  },
  watch: {
    openselectFav(val) {
      if (val) {
        this.getFavoriteDataFun()
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
      }
      .el-input,.el-select {
        width: 240px;
      }
    }
  }
}
</style>
