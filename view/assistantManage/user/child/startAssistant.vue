<template>
    <div class="startAssistant">
      <div class="left">
        <ul class="tabToggle">
          <li :class="{active:isActive}" @click="toggleTab(0)"><span>实时预览</span></li>
          <li :class="{active:!isActive}" @click="toggleTab(1)"><span>录像回放</span></li>
        </ul>
        <div class="tree">
          <el-tree
            :props="treeProps"
            :load="loadNode"
            lazy>
          </el-tree>
        </div>
        <div class="imgSign" v-if="isActive">
          <div class="imgSign-title">
            <span>
              截图标记
            </span>
          </div>
          <ul class="imgSignList">
            <li v-for="(item,index) in imgSignList" :key="index" >
              <span>{{index+1}}</span>
              <span>{{item.date}}</span>
              <span style="font-size: 14px;cursor: pointer"><i class="el-icon-delete"></i></span>
            </li>
          </ul>
          <div class="imgSignBtn">
            <el-button>重置</el-button>
            <el-button @click="close">关闭</el-button>
          </div>
        </div>
        <div class="videoSign" v-else>
          <div class="videoSign-title">
            <span>
              录像标记
            </span>
          </div>
          <ul class="videoSignList">
            <li v-for="(item,index) in videoSignList" :key="index" >
              <div>
                <span>{{item.description}}</span>
                <span style="font-size: 14px;"><i class="el-icon-video-play" style="cursor: pointer"></i>&nbsp;&nbsp;&nbsp;<i class="el-icon-delete" style="cursor: pointer"></i></span>
              </div>
              <div>
                <span>{{item.startDate}}至{{item.endDate}}</span>
              </div>
            </li>
          </ul>
          <div class="videoSignBtn">
            <el-button>重置</el-button>
            <el-button @click="close">关闭</el-button>
          </div>
        </div>
      </div>
      <div class="center"></div>
      <div class="right"></div>
    </div>
</template>

<script>
export default {
  name: 'startAssistant',
  data() {
    return {
      isActive: true,
      count: 0,
      treeProps: {
        label: 'name'
      },
      imgSignList: [{
        id: 1,
        date: '2020-02-10 09:01:00'
      }, {
        id: 2,
        date: '2020-02-10 09:01:00'
      }, {
        id: 3,
        date: '2020-02-10 09:01:00'
      }, {
        id: 4,
        date: '2020-02-10 09:01:00'
      }, {
        id: 5,
        date: '2020-02-10 09:01:00'
      }, {
        id: 6,
        date: '2020-02-10 09:01:00'
      }],
      videoSignList: [
        {
          description: '异常情况1',
          startDate: '2020-02-10 09:00:00',
          endDate: '2020-02-10 09:10:59'
        },
        {
          description: '异常情况2',
          startDate: '2020-02-10 09:00:00',
          endDate: '2020-02-10 09:10:59'
        },
        {
          description: '异常情况3',
          startDate: '2020-02-10 09:00:00',
          endDate: '2020-02-10 09:10:59'
        },
        {
          description: '异常情况4',
          startDate: '2020-02-10 09:00:00',
          endDate: '2020-02-10 09:10:59'
        },
        {
          description: '异常情况5',
          startDate: '2020-02-10 09:00:00',
          endDate: '2020-02-10 09:10:59'
        },
        {
          description: '异常情况6',
          startDate: '2020-02-10 09:00:00',
          endDate: '2020-02-10 09:10:59'
        }
      ]
    }
  },
  methods: {
    toggleTab(flag) {
      if (flag === 0) {
        this.isActive = true
      } else {
        this.isActive = false
      }
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region1' }, { name: 'region2' }, { name: 'region3' }, { name: 'region4' }, { name: 'region5' }])
      }
      if (node.level > 3) { return resolve([]) }

      let hasChild = null
      if (node.data.name === 'region1') {
        hasChild = true
      } else if (node.data.name === 'region2') {
        hasChild = false
      } else {
        hasChild = Math.random() > 0.5
      }
      setTimeout(() => {
        let data = null
        if (hasChild) {
          data = [{
            name: 'zone' + this.count++
          }, {
            name: 'zone' + this.count++
          }]
        } else {
          data = []
        }

        resolve(data)
      }, 500)
    },
    close() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.startAssistant{
  display: flex;
  flex: auto;
  padding: 15px 0;
  .left{
    flex-basis: 290px;
    display: flex;
    flex-direction: column;
    .tabToggle{
      width: 100%;
      float: left;
      li{
        float: left;
        width: 50%;
        height: 36px;
        text-align: center;
        cursor: pointer;
        background: #F2F2F2;
        span{
          line-height: 36px;
          font-size: 14px;
        }
      };
      .active{
        border-bottom: 2px solid #2D72D3;
        background: #ffffff;
        span{
          color: #2D72D3;
        }
      }
    };
    .tree{
      clear: left;
      padding: 15px 0;
      flex-basis: 480px;
    }
    .imgSign{
      flex: auto;
      padding: 0 5px;
      .imgSign-title{
        height: 40px;
        line-height: 40px;
        background: #2D72D3;
        padding: 0 10px;
        span{
          color: #ffffff;
          font-size: 14px;
        }
      }
      .imgSignList{
        padding: 0 10px;
        height: 200px;
        overflow: auto;
        li{
          line-height: 30px;
        }
      }
      .imgSignBtn{
        padding: 15px 0;
        text-align: center;
        display: flex;
        justify-content: center;
        /deep/ .el-button{
            width: 70px;
            height: 30px;
            font-size: 12px;
            color: #000000;
            text-align: center;
            background-color: rgba(255, 255, 255, 1);
            border-color: rgba(22, 155, 213, 1);
            display: flex;
            align-items: center;
            justify-content: center;
          }
      }
    }
    .videoSign{
      flex: auto;
      padding: 0 5px;
      .videoSign-title{
        height: 40px;
        line-height: 40px;
        background: #2D72D3;
        padding: 0 10px;
        span{
          color: #ffffff;
          font-size: 14px;
        }
      }
      .videoSignList{
        padding: 0 10px;
        height: 200px;
        overflow: auto;
        li{
          line-height: 20px;
          &>div:first-child>span:last-child{
            float: right;
          }
        }
        &>li:not(:first-child){
          margin-top: 15px;
        }
      }
      .videoSignBtn{
        padding: 15px 0;
        text-align: center;
        display: flex;
        justify-content: center;
        /deep/ .el-button{
            width: 70px;
            height: 30px;
            font-size: 12px;
            color: #000000;
            text-align: center;
            background-color: rgba(255, 255, 255, 1);
            border-color: rgba(22, 155, 213, 1);
            display: flex;
            align-items: center;
            justify-content: center;
          }
      }
    }
  }
  .center{
    flex: auto;
  }
  .right{
    flex-basis: 290px;
  }
}
</style>
