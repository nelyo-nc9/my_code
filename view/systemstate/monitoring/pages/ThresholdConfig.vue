
<template>
  <!-- 服务器监控  异常阈值设置 -->

    <div class="">
      <div class="btn-container">
        <el-button size="small"  @click="editFlag = true">编辑</el-button>
        <el-button size="small"  @click="back">返回</el-button>
      </div>

      <!-- 阈值设置信息 -->
      <div class="thresholdConfig-container">
          <div class="thresholdConfig-form">
              <div class="thresholdConfig-formGroup">
                  <div class="thresholdConfig-label">CPU异常阈值*</div>
                  <div class="thresholdConfig-val">
                      <el-input v-model="thresholdConfigData.cpu" size="small" placeholder="请输入CPU异常阈值" class="inp1" :disabled="!editFlag"></el-input>
                      <span>%</span>
                  </div>
              </div>
              <div class="thresholdConfig-formGroup">
                  <div class="thresholdConfig-label">内存异常阈值*</div>
                  <div class="thresholdConfig-val">
                      <el-input v-model="thresholdConfigData.mem" size="small" placeholder="请输入内存异常阈值" class="inp1" :disabled="!editFlag"></el-input>
                      <span>%</span>
                  </div>
              </div>
              <div class="thresholdConfig-formGroup">
                  <div class="thresholdConfig-label">磁盘/root异常阈值*</div>
                  <div class="thresholdConfig-val">
                      <el-input v-model="thresholdConfigData.diskRoot" size="small" placeholder="请输入磁盘/root异常阈值" class="inp1" :disabled="!editFlag"></el-input>
                      <span>%</span>
                  </div>
              </div>
              <div class="thresholdConfig-formGroup">
                  <div class="thresholdConfig-label">磁盘/Opt异常阈值*</div>
                  <div class="thresholdConfig-val">
                      <el-input v-model="thresholdConfigData.diskOpt" size="small" placeholder="请输入磁盘/cpt异常阈值" class="inp1" :disabled="!editFlag"></el-input>
                      <span>%</span>
                  </div>
              </div>
              <div class="thresholdConfig-formGroup">
                  <div class="thresholdConfig-label">磁盘/swap异常阈值*</div>
                  <div class="thresholdConfig-val">
                      <el-input v-model="thresholdConfigData.diskSwap" size="small" placeholder="请输入磁盘/swap异常阈值" class="inp1" :disabled="!editFlag"></el-input>
                      <span>%</span>
                  </div>
              </div>
              <div class="thresholdConfig-formGroup">
                  <div class="thresholdConfig-label">磁盘/var异常阈值*</div>
                  <div class="thresholdConfig-val">
                      <el-input v-model="thresholdConfigData.diskVar" size="small" placeholder="请输入磁盘/var异常阈值" class="inp1" :disabled="!editFlag"></el-input>
                      <span>%</span>
                  </div>
              </div>
              <div class="thresholdConfig-formGroup">
                  <div class="thresholdConfig-label">磁盘/home异常阈值*</div>
                  <div class="thresholdConfig-val">
                      <el-input v-model="thresholdConfigData.diskHome" size="small" placeholder="请输入磁盘/home异常阈值" class="inp1" :disabled="!editFlag"></el-input>
                      <span>%</span>
                  </div>
              </div>
             
              <div class="thresholdConfig-formGroup">
                  <div class="thresholdConfig-label">数据刷新频率*</div>
                  <div class="thresholdConfig-val">
                      <el-select v-model="thresholdConfigData.frequency" placeholder="请选择数据刷新频率" size="small" class="inp2" :disabled="!editFlag">
                        <el-option v-for="item in frequency_list"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                  </div>
              </div>
              <div class="thresholdConfig-formGroup">
                  <div class="thresholdConfig-label">网络异常阈值*</div>
                  <div class="thresholdConfig-val">
                      <el-input v-model="thresholdConfigData.network" size="small" placeholder="请输入网络异常阈值" class="inp1" :disabled="!editFlag"></el-input>
                      <span>%</span>
                  </div>
              </div>
              <div class="thresholdConfig-formGroup">
                  <div class="thresholdConfig-label">异常持续间隔*</div>
                  <div class="thresholdConfig-val">
                      <el-select v-model="thresholdConfigData.intervals" placeholder="" size="small" class="inp2" :disabled="true">
                        <el-option label="10分钟" value="10"></el-option>
                    </el-select>
                  </div>
              </div>
              <div class="thresholdConfig-formGroup">
                  <div class="thresholdConfig-label">异常声音配置*</div>
                  <div class="file-container">
                        <audio controls style="width:180px;height:30px;margin-right:15px;">
                            <source :src="thresholdConfigData.path"  type="audio/ogg">
                            <source :src="thresholdConfigData.path"  type="audio/mpeg">
                            您的浏览器不支持 audio 元素。
                        </audio>
                        <el-upload
                            class="avatar-uploader"
                            action="/api/sysStatusMonitor/v1/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                             <!-- :file-list="fileList" -->
                            <el-button size="small" type="primary" :disabled="!editFlag">上传文件</el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                        </el-upload>
                  </div>
              </div>

              <div class="thresholdConfig-formGroup2" v-show="editFlag">
                  <el-button size="small"  @click="setSysServerinfo" type="primary"  :loading="submit_loading">保存</el-button>
                <el-button size="small"  @click="editFlag=false">取消</el-button>
              </div>

          </div>
      </div>

    </div>

</template>

<script>

import {
  getThresholdcfgApi,setSysServerinfoApi,uploadFileApi
} from '@src/http/systemstate/anomaly.api.js'

export default {
  data(){
    return {
        editFlag:false, //是否编辑状态 false否
        thresholdConfigData:{
            cpu:'',  // CPU阈值
            mem:'',  // 内存阈值
            diskRoot:'',  // 磁盘/root异常阈值
            diskOpt:'',  // 磁盘/opt异常阈值
            diskSwap:'',  // 磁盘/swap异常阈值
            diskVar:'',  // 磁盘/var异常阈值
            diskHome:'',  // 磁盘/home异常阈值
            network:'',  // 网络异常阈值
            frequency:'',  // 数据刷新频率
            intervals:'10',  // 异常持续间隔时间
            path:'',
        },  //  阈值配置信息
        
        // 数据刷新频率
        frequency_list: [
            {
                value: '30',
                label: '30S'
            },
            {
                value: '60',
                label: '60S'
            },
            {
                value: '90',
                label: '90S'
            },
            {
                value: '120',
                label: '120S'
            }
        ],

        fileList: [
            {name: '系统状态报警.wav', url: '系统状态报警.wav'},
        ],
        submit_loading:false,
    }
  },
  props:{
    componentTitle: {
      type: String,
      default: ''
    },
  },
  computed:{},
  methods:{
    // 获取阈值配置信息
    getThresholdcfg(){
        var params = {

        };
        getThresholdcfgApi(params).then( res => {
            if( res.data.code == 0){
                // this.thresholdConfigData.cpu = res.data.data.cpu+'';
                // this.thresholdConfigData.mem = res.data.data.mem+'';
                // this.thresholdConfigData.diskRoot = res.data.data.diskRoot+'';
                // this.thresholdConfigData.diskOpt = res.data.data.diskOpt+'';
                // this.thresholdConfigData.diskSwap = res.data.data.diskSwap+'';
                // this.thresholdConfigData.diskVar = res.data.data.diskVar+'';
                // this.thresholdConfigData.diskHome = res.data.data.diskHome+'';
                // // this.thresholdConfigData.frequency = res.data.data.frequency+'';
                // this.thresholdConfigData.network = res.data.data.network+'';
                this.thresholdConfigData = res.data.data;

            }
        }).catch( error => {

        });
    },

    // 创建/修改异常阈值信息 (保存)
    setSysServerinfo(){
        this.submit_loading = true;
        // 非空判断
        var thresholdConfigData = this.thresholdConfigData;
        if( thresholdConfigData.cpu == ''){
            this.$message({
                message: 'CPU异常阈值 不能为空',
                type: 'warning'
            });
            return false;
        }
        if( thresholdConfigData.mem == ''){
            this.$message({
                message: '内存异常阈值 不能为空',
                type: 'warning'
            });
            return false;
        }
        if( thresholdConfigData.diskRoot == ''){
            this.$message({
                message: '磁盘/root异常阈值 不能为空',
                type: 'warning'
            });
            return false;
        }
        if( thresholdConfigData.diskOpt == ''){
            this.$message({
                message: '磁盘/Opt异常阈值 不能为空',
                type: 'warning'
            });
            return false;
        }
        if( thresholdConfigData.diskSwap == ''){
            this.$message({
                message: '磁盘/swap异常阈值 不能为空',
                type: 'warning'
            });
            return false;
        }
        if( thresholdConfigData.diskVar == ''){
            this.$message({
                message: '磁盘/var异常阈值 不能为空',
                type: 'warning'
            });
            return false;
        }
        if( thresholdConfigData.diskHome == ''){
            this.$message({
                message: '磁盘/home异常阈值 不能为空',
                type: 'warning'
            });
            return false;
        }
        if( thresholdConfigData.frequency == ''){
            this.$message({
                message: '数据刷新频率 不能为空',
                type: 'warning'
            });
            return false;
        }
        if( thresholdConfigData.network == ''){
            this.$message({
                message: '网络异常阈值 不能为空',
                type: 'warning'
            });
            return false;
        }
        if( thresholdConfigData.path == ''){
            this.$message({
                message: '异常声音配置 不能为空',
                type: 'warning'
            });
            return false;
        }

        
        var params = thresholdConfigData;
        setSysServerinfoApi(params).then( res => {
            if(res.data.code == 0){
                this.$notify({
                    title: '成功',
                    message: '配置保存成功',
                    type: 'success',
                    position: 'bottom-right'
                });
                this.editFlag = false;
            }
            this.submit_loading = false;
            
        }).catch( error => {
            this.submit_loading = false;
        });
    },

    // 返回
    back(){
        this.$emit('changeComponent', 'Index', '服务器监控');
    },

    // 上传音频
    beforeAvatarUpload(file) {
        console.log(file)
        var file_type = file.type;
        // if(file_type != 'CDA' && file_type != 'WAV' &&  file_type != 'MP3' &&  file_type != 'WMA'){
        //     this.$message.error('请上传音频文件');
        //     return false;
        // }
        if(file_type != 'audio/wav'){
            this.$message.error('请上传音频文件');
            return false;
        }
    },

    handleAvatarSuccess(res, file){
        // console.log(file)
        console.log(res.data);
        this.thresholdConfigData.path = res.data;
    },


  },
  created(){
      this.getThresholdcfg();
  },
  mounted(){},
  destroyed(){},
}
</script>

<style lang="less" scoped>
  
  
  .btn-container{
    padding:15px 0;
  }
  .thresholdConfig-container{
      border-top:1px solid #efefef;
      padding: 30px 0;
  }

  .thresholdConfig-form{
      width:800px;
      margin:0 auto;
      display: flex;
      display: -webkit-flex;
      flex-wrap:wrap;
      
  }
 
  .thresholdConfig-formGroup{
      width: 50%;
      display: flex;
      display: -webkit-flex;
      align-items:center;
      margin-bottom:15px;
  }
  .thresholdConfig-label{
      width: 120px;
      text-align: center;
  }
  .thresholdConfig-val{
      width: 280px;
      border: 1px solid #DCDFE6;
  }
  .thresholdConfig-formGroup2{
       width: 100%;
       text-align: center;
  }
  .inp1{
      width: 230px;
  }
  .inp2{
      width: 100%;
  }
  .file-container{
      display: flex;
      display: -webkit-flex;
      align-items: center;
  }

</style>
<style>
   .thresholdConfig-form .el-input__inner{
        border: none !important;
    }
</style>
