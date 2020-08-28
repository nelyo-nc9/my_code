<!--
 * @Author: your name
 * @Date: 2020-06-16 15:11:04
 * @LastEditTime: 2020-06-16 19:04:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\systemParameters\versionInformation.vue
-->
<template>
<div class="content">
  <div class="main">
    <!-- 版本信息 -->
    <div class="version">
      <p style="width:100%;font-size:16px;text-align:center;margin-bottom:10px;">版本信息</p>
      <div class="info">
        <div class="info-item">
          <ul>
            <li>
              <i>服务器版本</i>
              <span>{{formInline.systemVersion}}</span>
            </li>
            <li>
              <i>web版本</i>
              <span>{{formInline.webVersion}}</span>
            </li>
            <li>
              <i>插件版本</i>
              <span>{{formInline.webVersion}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 授权信息 -->
    <div class="authorizations">
      <p style="width:100%;font-size:16px;text-align:center;margin-bottom:10px;">授权信息</p>
      <div style="margin-bottom:3px;">
        <el-button size="small">导出机器码</el-button>
        <el-button size="small">导入key</el-button>
      </div>
      <div class="info">
        <div class="info-item">
          <ul>
            <li>
              <i>序列号</i>
              <span>{{formInline.serialNumber}}</span>
            </li>
            <li>
              <i>有效期</i>
              <span>{{formInline.validity}}</span>
            </li>
            <li>
              <i>类型</i>
              <span>{{formInline.versionType}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 个性化设置 -->
    <div class="individuation">
      <p style="width:100%;font-size:16px;text-align:center;margin-bottom:10px;">个性化设置</p>
      <div class="info">
        <div class="info-item">
          <ul>
            <li>
              <i>平台描述文字</i>
              <span>{{formInline.descriptiveText}}</span>
            </li>
            <li>
              <i>log</i>
              <div style="display:flex;">
                <el-upload class="upload-demo" action="" multiple :limit="3">
                <el-input></el-input>
                <el-button size="small" plain>点击上传</el-button>
                </el-upload>
              </div>
            </li>
            <li>
              <i>皮肤</i>
              <el-select v-model="formInline.skin"  placeholder="" size="mini">
                  <el-option v-for="(item,index) in skinArray" :key="index" :label="item.label" :value="item.value">{{item.label}}</el-option>
              </el-select>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 日志配置 -->
    <div class="log-configuration">
      <p style="width:100%;font-size:16px;text-align:center;margin-bottom:10px;">日志配置</p>
      <div style="margin-bottom:3px;overflow:hidden;">
        <el-button size="small" style="float:right;">保存</el-button>
      </div>
      <div class="info">
        <div class="info-item">
          <ul>
            <li>
                <i>系统日志</i>
                <el-input></el-input>&nbsp;&nbsp;&nbsp;天
            </li>
            <li>
                <i>报警日志</i>
                <el-input></el-input>&nbsp;&nbsp;&nbsp;天
            </li>
            <li>
                <i>操作日志</i>
                <el-input></el-input>&nbsp;&nbsp;&nbsp;天
            </li>
          </ul>
        </div>
      </div>
    </div>
     <!-- 音频文件配置 -->
    <div class="video-file-configuration">
      <p style="width:100%;font-size:16px;text-align:center;margin-bottom:10px;">音频文件配置</p>
      <div class="info">
        <div class="info-item">
          <ul>
            <li>
              <i>本地客户端提醒</i>
              <div style="display:flex;">
                <el-upload class="upload-demo" action="" multiple :limit="3">
                <el-input></el-input>
                <el-button size="small" plain>点击上传</el-button>
                </el-upload>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'VersionInformation',
  components: {
  },
  data() {
    return {
      formInline: {
        systemVersion: 'BC9100_V1.0.0', // 服务器版本
        webVersion: 'WEBV_V1.0.0', // web版本
        pluginVersion: 'Plug_V1.0.0', // 插件版本
        serialNumber: 'BSR-xy-10976845', // 序列号
        validity: '永久', // 有效期
        versionType: '主控服务', // 类型
        descriptiveText: '中国建设银行安防物联管理平台', // 平台描述文字
        skin: 1
      },
      skinArray: [
        {value: 1, label: '建行蓝'},
        {value: 2, label: '黑色'},
        {value: 3, label: '浅色'}
      ]
    }
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped lang='less'>
@import '../../../../assets/elementModify.less';
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  .main {
    width: 876px;
    margin-left:30px;
    .version,
    .authorizations,
    .individuation,
    .log-configuration,
    .video-file-configuration {
      margin-bottom:30px;
      width: 100%;
      .info {
        border: 1px solid rgba(228, 228, 228, 1);
        .info-item {
          width: 100%;
          overflow: hidden;
          ul {
            overflow: hidden;
            padding: 5px;
            li {
              float: left;
              width: 430px;
              height: 40px;
              margin: 0 2px 2px 0;
              i {
                float: left;
                width: 136px;
                line-height: 40px;
                text-align: center;
                background: #f2f2f2;
                margin-right: 4px;
              }
              span {
                display: inline-block;
                height: 30px;
                width: 255px;
                line-height: 30px;
                text-align: center;
              }
              .el-input {
                width: 200px!important;
              }
            }
          }
        }
      }
    }
  }
}
/deep/.el-input--mini .el-input__inner {
  width: 290px;
  height: 40px;
}
</style>
