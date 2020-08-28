export default {
  computed: {
    pluginSize() {
      let panes = []
      switch (this.defaultPane) {
        case 1:
          panes = [
            { left: 0, top: 0, width: '100%', height: '100%', position: 'absolute' }
          ]
          break
        case 4:
          panes = [
            { left: 0, top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: 0, top: '50%', width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: '50%', width: '50%', height: '50%', position: 'absolute' }
          ]
          break
        case 6:
          panes = [
            { left: 0, top: 0, width: '66.7%', height: '66.7%', position: 'absolute' },
            { left: '66.7%', top: 0, width: '33.3%', height: '33.3%', position: 'absolute' },
            { left: '66.7%', top: '33.3%', width: '33.3%', height: '33.3%', position: 'absolute' },
            { left: 0, top: '66.7%', width: '33.3%', height: '33.3%', position: 'absolute' },
            { left: '33.3%', top: '66.7%', width: '33.3%', height: '33.3%', position: 'absolute' },
            { left: '66.7%', top: '66.7%', width: '33.3%', height: '33.3%', position: 'absolute' }
          ]
          break
        case 8:
          panes = [
            { left: 0, top: 0, width: '75%', height: '75%', position: 'absolute' },
            { left: '75%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 9:
          panes = [
            { left: 0, top: 0, width: '33.3%', height: '33.3%', position: 'absolute' },
            { left: '33.3%', top: 0, width: '33.3%', height: '33.3%', position: 'absolute' },
            { left: '66.7%', top: 0, width: '33.3%', height: '33.3%', position: 'absolute' },
            { left: 0, top: '33.3%', width: '33.3%', height: '33.3%', position: 'absolute' },
            { left: '33.3%', top: '33.3%', width: '33.3%', height: '33.3%', position: 'absolute' },
            { left: '66.7%', top: '33.3%', width: '33.3%', height: '33.3%', position: 'absolute' },
            { left: 0, top: '66.7%', width: '33.3%', height: '33.3%', position: 'absolute' },
            { left: '33.3%', top: '66.7%', width: '33.3%', height: '33.3%', position: 'absolute' },
            { left: '66.7%', top: '66.7%', width: '33.3%', height: '33.3%', position: 'absolute' }
          ]
          break
        case 10:
          panes = [
            { left: 0, top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: 0, top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 13:
          panes = [
            { left: 0, top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '25%', width: '50%', height: '50%', position: 'absolute' },
            { left: '75%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 14:
          panes = [
            { left: 0, top: 0, width: '25%', height: '75%', position: 'absolute' },
            { left: '25%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 16:
          panes = [
            { left: 0, top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 17:
          panes = [
            { left: 0, top: 0, width: '60%', height: '40%', position: 'absolute' },
            { left: '60%', top: 0, width: '40%', height: '40%', position: 'absolute' },
            { left: 0, top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '80%', width: '20%', height: '20%', position: 'absolute' }
          ]
          break
        case 22:
          panes = [
            { left: 0, top: 0, width: '40%', height: '40%', position: 'absolute' },
            { left: '40%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '80%', width: '20%', height: '20%', position: 'absolute' }
          ]
          break
        case 25:
          panes = [
            { left: 0, top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '80%', width: '20%', height: '20%', position: 'absolute' }
          ]
          break
        default:
          panes = [
            { left: 0, top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: 0, top: '50%', width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: '50%', width: '50%', height: '50%', position: 'absolute' }
          ]
          break
      }
      return panes
    }
  },
  methods: {
    initBtn() {
      let leftArr = []
      let rightArr = []
      let offsetL = 0
      let offsetR = 0
      this.iconShow.forEach((v) => {
        v.normalPx = 0
        v.type === 'left' ? leftArr[v.index] = v : rightArr[v.index] = v
      })
      leftArr.forEach((v, i) => {
        if (i === 0) {
          v.normalPx = 0
        } else {
          v.normalPx = offsetL + (Number(v.width) || 36)
          offsetL = v.normalPx
        }
      })
      rightArr.forEach((v, i) => {
        if (i === 0) {
          v.normalPx = 0
        } else {
          v.normalPx = offsetR + (Number(v.width) || 36)
          offsetR = v.normalPx
        }
      })
    }
  }
}
