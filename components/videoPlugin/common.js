const version = '1.0.0.61'
export default {
  version: version,
  data() {
    return {
      pluginDownloadUrl: `${window.location.protocol}//${window.location.host}/static/plugin/BlueSkyWebPlayerSetup.exe`, // 插件地址
      showDownload: false, // 是否下载
      showTips: '' // 提示信息
    }
  },
  created() {
    console.log('this.videoPluginVerify', this.videoPluginVerify)
    if (this.videoPluginVerify) {
      try {
        this.videoVersion()
      } catch (e) {
        console.log(e)
      }
    }
  },
  methods: {
    showHelp() {
      this.$messageWarn('由于Chrome和Firefox的高级版本去掉了对PPAPI的支持, 插件仅支持IE(非Edge)及支持PPAPI的浏览器, 如Firefox的延长支持版、360极速版等。')
    },
    // delay(time) {
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       resolve()
    //     }, time)
    //   })
    // },
    // 插件版本校验
    videoVersion() {
      let plugin = this.$store.getters.plugin
      if (!plugin.valid) {
        this.showDownload = true
        this.showTips = '未安装插件，点击下载'
      } else if (version !== plugin.version) {
        const newVersion = version.split('.') || []
        const lovalVersion = plugin.version.split('.') || []
        for (let i = 0; i < Math.max(newVersion.length, lovalVersion.length); i++) {
          if (Number(lovalVersion[i] || 0) < Number(newVersion[i] || 0)) {
            this.showDownload = true
            this.showTips = '插件有更新，点击下载'
            break
          }
        }
      }
      console.log(this.showTips, version)
      plugin = null
    }
  }
}
