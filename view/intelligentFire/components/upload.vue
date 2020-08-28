<template>
<div>
<!--    <form action="/api/upload" method="post" enctype="multipart/form-data">-->
<!--       -->
<!--        <input type="submit" value="tijao">-->
<!--    </form>-->
    <input type="file" name="filenamePic"  id="upload" />
</div>
</template>

<script>
export default {
  name: 'upload',
  data() {
    return {
      uploadDom: ''
    }
  },
  props: {
    action: {
      default: '/api/upload'
    }
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.uploadDom = document.getElementById('upload')
    let that = this
    this.uploadDom.addEventListener('change', function(event) {
      that.fun().fileSelected()
    })
  },
  methods: {
    fun() {
      let that = this
      let files = null
      return {
        // 选择文件后，获取文件大小，获取文件格式
        fileSelected: function() {
          let file = that.uploadDom.files
          files = file
          this.uploadFile()
        },
        // 异步文件上传
        uploadFile: function() {
          let filesData = new FormData()
          console.log(files)
          filesData.append('filenamePic', files[0])
          // filesData.append('name', 'liming')
          var xhr = new XMLHttpRequest()
          xhr.upload.addEventListener('progress', this.uploadProgress, false) // 监听上传进度
          xhr.addEventListener('load', this.uploadComplete, false)
          xhr.addEventListener('error', this.uploadFailed, false)
          console.log(that.action)
          xhr.open('POST', that.action)
          console.log(filesData)
          xhr.send(filesData)
        },
        // 图片预览
        previewImage: function() {

        },
        //
        uploadProgress: function() {

        },
        //
        uploadComplete: function() {

        },
        //
        uploadFailed: function() {

        }
      }
    }
  }
}
</script>

<style scoped>

</style>
