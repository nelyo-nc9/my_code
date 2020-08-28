<template>
  <div class="sync-log">
    <div class="content">
      <div class="log-from">
        <ul>
          <li style="position: sticky;top: 0;border-bottom:2px solid white;">
            <span>序号</span>
            <section>同步状态</section>
            <section>同步日期</section>
          </li>
          <li v-for="(item,index) in tableData" :key="index" class="bl">
            <span>{{index+1}}</span>
            <section>{{item.status}}</section>
            <section>{{item.updatedAt}}</section>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'SyncLog',
  data() {
    return {
      tableData: [
        { status: 1, createdAt: '2020-06-12', updatedAt: '2020-04-13', id: '10' },
        { status: 1, createdAt: '2020-06-12', updatedAt: '2020-06-23', id: '10' },
        { status: 1, createdAt: '2020-06-12', updatedAt: '2020-06-13', id: '10' },
        { status: 1, createdAt: '2020-06-12', updatedAt: '2020-05-13', id: '10' }
      ]
    }
  },
  created() {
    this.tableData = this.handleData(this.tableData)
    this.getSyncLogList()
  },
  methods: {
    ...mapActions('syncSetting', ['setState', 'getList']),
    getSyncLogList() {
      // 日志请求
      this.getList().then(res => {
        let { code, data } = res.data
        if (code === 0) {
          this.tableData = this.handleData(data.list)
        }
      })
    },
    handleData(data) {
      data.forEach(item => {
        if (item.status === 1) {
          item.status = '已同步'
        } else if (item.status === 2) {
          item.status = '错误'
        }
      })
      return data
    }
  }
}
</script>

<style lang="less" scoped>
.sync-log {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding-left: 10px;
    .log-from {
      border: 1px solid #f5f5f5;
      padding: 10px;
      width: 80%;
      height: 710px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      ul {
        width: 68%;
        height: 96%;
        overflow: auto;
        li {
          width: 100%;
          height: 30px;
          display: flex;
          span {
            width: 150px;
            height: 96%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-right: 3px solid white;
          }
          section {
            flex: 1;
            height: 96%;
            border-right: 3px solid white;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        li:nth-child(even) {
          span {
            background: #f5f5f5;
          }
          section {
            background: #f5f5f5;
          }
        }
        li:nth-child(odd) {
          span {
            background: #ddd;
          }
          section {
            background: #ddd;
          }
        }
        .bl {
          span:hover {
            border: none;
            cursor: pointer;
            background: rgba(163, 229, 255, 0.4);
          }
          section:hover {
            background: rgba(163, 229, 255, 0.4);
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
