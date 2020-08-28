<!--  -->
<template>
  <div class="config-box">
    <el-dialog title="音频配置"
               :visible.sync="dialogVisible"
               width="30%"
               :close-on-click-modal="false"
               :before-close="close">
      <div class="center">
          <div class="center-on">
              <p>进门音频:</p>
              <el-upload
                  class="btn"
                  name="configfile"
                  :data="{'channelId':talklist.serise,'ioNo':'001'}"
                  :headers="headers"
                  :limit="2"
                  :file-list="fileList"
                  :on-success="onSuccessData"
                  action="/api/audio/v1/service/upload"
                  ref="upload"
                  accept="audio/mpeg"
                  :before-upload="beforeUpload">
                  <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
              </el-upload> 
          </div>
            <div class="center-off">
              <p>出门音频:</p>
              <el-upload
                  class="btn"
                  name="configfile"
                  :data="{'channelId':talklist.serise,'ioNo':'002'}"
                  :headers="headers"
                  :limit="2"
                  accept="audio/mpeg"
                  :file-list="fileList"
                  :on-success="onSuccessData2"
                    action="/api/audio/v1/service/upload"
                    ref="uploads"
                  :before-upload="beforeUpload">
                  <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
              </el-upload> 
          </div>
          <div class="center-bottom">
              <p>设备</p>
              <div slot="tip" class="el-upload-list__item-name">
                <!-- {{fileName}} -->
                {{ talklist.name }}
              </div>
          </div>
      </div>
      <div class="bottom">
          <el-button size="mini" style="float:right;margin-right:50px" @click="close" >关闭</el-button>
          <el-button size="mini" style="float:right;margin-right:50px" @click="upload">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getUploadApi} from "../../../http/audioManage/talkback.api"
import {saveAudioApi} from "../../../http/audioManage/talkback.api"
export default {
  name: '',
  components: {
    
  },
  props:["talklist"],
  data() {
    return {
      dialogVisible: true, // 长久开启父组件控制
      fileList:[],
      fileName:"",
      fileName1:"",

      // 上传 请求参数
      upload_params : {
        'channelId' : this.talklist.serise,  // 通道id   configfile【传此条件 此参数为必须】
        'ioNo' : '001'  // 触发事件的参数【数值类型】configfile【传此条件 此参数为必须】
      },
      upload_params2 : {
        'channelId' : this.talklist.serise,  // 通道id   configfile【传此条件 此参数为必须】
        'ioNo' : '002'  // 触发事件的参数【数值类型】configfile【传此条件 此参数为必须】
      },

      // 上传请求头
      headers:{
        'Authorization' : JSON.parse(sessionStorage.getItem('user')).token
      }
    }
  },
  methods: {
    close(){
      this.$emit("closebtn")
      this.fileName="";
      this.$refs.upload.clearFiles();
      this.$refs.uploads.clearFiles();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 文件上传成功时触发的钩子函数
    onSuccessData(response, file, fileList) {
      this.response1=response.data
      this.name1=file.name
    },
    onSuccessData2(response2, file2, fileList) {
      // console.log(this.fileName)
      console.log(response2)
      console.log(file2)
      console.log(fileList)
      this.response2=response2.data
      this.name2=file2.name
    },
    upload(){
      if (!this.response1 || !this.response2) {
        this.$message.error('请配置进门，出门音频')
        return
      }
      let list=[{calledId:this.talklist.hostUniq,calledPanel:parseInt(this.talklist.uniqueId)}]
      
      let list2=JSON.stringify(list)
      let obj={
        entryFile:this.response1,//进门文件ftp
        exitFile:this.response2,//出门文件ftp
        entryName:this.name1,
        exitName:this.name2,    
        serverIp:this.talklist.platformIp,
        serverPort:this.talklist.platformPort,
        channelId:parseInt(this.talklist.id),
        deviceId:this.talklist.hostUniq,
        keyPartId:this.talklist.keyPartId,
        orgId:this.talklist.orgId,
        entryIoNo:"001",
        exitIoNo:"002",
        deviceInfo:list2
        //  serverIp:this.talklist.deviceName
      }
      saveAudioApi(obj).then(res=>{
        console.log(res)
        if(res.data.code===0){
          this.$notify({
            title: '提示',
            message: '配置成功',
            type: 'success',
            position: 'top-right'
          });
          this.dialogVisible = false;
          this.close();
        } else {
          this.$message.error('保存失败')
        }
        this.$emit('closebtn', true)
      })
    },
    beforeUpload(file){
      this.files = file;
      const extension = file.name.split('.')[1] === 'mp3'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!extension) {
        this.$message.warning('上传模板只能是mp3格式!')
        return false;
      }
      if (!isLt2M) {
        this.$message.warning('上传模板大小不能超过 5MB!')
        return false;
      }
      this.fileName = file.name;
      console.log(this.fileList)
      // return false // 返回false不会自动上传
      console.log(this.fileName)
      // this.upload();
    }
  },
  created() {
    console.log(this.talklist)
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style lang="less" scoped>
  .config-box{
    .top{
        width: 100%;
        height: 30px;
        background: #eeeeee;
        display: flex;
        justify-content: space-between;
        p{
            padding:6px;
          
        }
        button{
        line-height: 10px;
          height: 15px;
          width: 15px;
          margin-right: 10px;
          margin-top:6px;
          border: none;
          background: none;
        }
    }
    .center{
        width: 100%;
        height: 320px;
        .center-on{
            width: 100%;
            height: 104px;
        
            p{
              margin-left:80px;
              margin-top:40px;
              float: left;
            }
            .btn{
                float: left;
                margin-left:20px;
                margin-top:30px;
            }
        }
        .center-off{
            width: 100%;
            height: 100px;
            
            p{
              margin-left:80px;
              margin-top:40px;
              float: left;
            }
            .btn{
                float: left;
                margin-left:20px;
                margin-top:30px;
            }
        }
        .center-bottom{
            width: 100%;
            margin-top:1px;
            p{
                margin-left:80px;
            }
            div{
                width: 83%;
                height: 80px;
                margin-left:50px;
                margin-top:5px;
                border: 1px solid #ccc;
            }
        }
    }
    .bottom{
        width: 100%;
        height: 50px;
        line-height: 50px;
    }
  }
</style>    