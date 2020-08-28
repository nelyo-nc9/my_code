<template>
  <div style="display:table;">
    <!-- <el-input class="fileInput" @click="fileInputClick()" size="mini" maxlength="9" v-model="fileName"  readonly="readonly"></el-input> -->
    <el-input class="fileInput" size="mini" maxlength="9" v-model="idfooleidName" @blur="handchBlur()"></el-input>
    <el-upload
      v-if="fileList"
      class="upload-btn"
      ref="fileUpload"
      action="/api/map/v1/upload"
      multiple
      :limit="1"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="mapFormatError"
      :file-list="fileList">
       <i class="el-icon-upload el-icon--right"></i>
    </el-upload>
    <i class="el-icon-delete "  v-else size="mini" type="primary" @click="deleteFloor"></i>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    fileList: {
      type: Array
    },
    Index: {
      type: Number
    },
    idName: {
      default: String
    },
    addFloorObj:{
      type: Object
    }
  },
  data() {
    return {
      fileName: '',
      idfooleidName: this.idName
    }
  },
  methods: {
    ...mapActions('map2d/mapPoint', ['updateFloorAKey']), // 添加楼层 名称 图片
    uploadSuccess(response, file, fileList) {
      const point = {
        id: '123',
        name: 'this.idfooleidName',
        keyPartId: this.keyPartId,
        orgId:this.orgId,
        level: this.Index,
        image: response.data.path
      }
      this.Modifyfloor(point)
    },
    mapFormatError() {
      // 上传失败
    },
    // 删除楼层平面图
    deleteFloor() {
      this.idfooleidName = ''
      this.$emit('deleteFloor', this.Index)
    },
    // 修改楼层
    handchBlur() {
      const point = {
        id: '123',
        name: this.idfooleidName,
        keyPartId: this.keyPartId,
        level: this.Index
      }
      this.Modifyfloor(point)
    },
    // 修改楼层
    Modifyfloor(point) {
      this.updateFloorAKey(point).then((suc) => {
        // alert('添加成功')
        // 时代的
      }).catch(err => console.log(err))
    }
  },
  watch: {
    // 楼层名称自定义输入正则判断
    idfooleidName: function() {
      this.idfooleidName = this.idfooleidName.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g,'')
      // 监听楼层名称变化
      this.$emit('inputIdfooleidName', this.idfooleidName, this.Index)
    }
  },
  created() {
    console.log()
  }

}
</script>

<style scoped>
.upload-btn,.fileInput{
      display: table-cell;
    }
.upload-btn>>>button{
  border-radius: 0 2px 2px 0;
}
.fileInput>>>input{
  border-radius: 2px 0 0 2px;
}
</style>
