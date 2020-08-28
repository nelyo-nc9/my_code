<template>
  <div id="importFile">
    <div class="alarm-log-inquire" v-if="collapseStatus.inquireInfo">
      <div class="alarm-log-select">
        <ul>
          <li>
            <i>所属机构</i>
            <el-select v-model="formInline.orgName" size="mini">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </li>
          <li>
            <i>所属重点部位</i>
            <el-select v-model="formInline.keyPart" size="mini">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </li>
          <li>
            <i>所属门禁平台</i>
            <el-input v-model="formInline.devName" size="mini"></el-input>
          </li>
          <li>
            <i>资源名称</i>
            <el-input v-model="formInline.resourceName" size="mini"></el-input>
          </li>
          <li>
            <i>日志类型</i>
            <el-input v-model="formInline.alarmSort" size="mini"></el-input>
          </li>
          <li>
            <i>日志子类型</i>
            <el-input v-model="formInline.eventType" size="mini"></el-input>
          </li>
          <li>
            <i>门禁主机名称</i>
            <el-select v-model="formInline.subsystemName" size="mini">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </li>
          <li>
            <i>门禁通道名称</i>
            <el-select v-model="formInline.level" size="mini">
              <el-option
                v-for="(item, index) in levelList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <i>卡号</i>
            <el-input v-model="formInline.nums" size="mini"></el-input>
          </li>
          <li>
            <i>姓名</i>
            <el-input v-model="formInline.name" size="mini"></el-input>
          </li>
          <li>
            <i>性别</i>
            <el-select v-model="formInline.subsystemName" size="mini">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </li>
          <li>
            <i>身份证</i>
            <el-input type="number" v-model="formInline.card" size="mini"></el-input>
          </li>
          <li>
            <i>部门</i>
            <el-select v-model="formInline.dealType" size="mini">
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </li>
          <li>
            <i>职务</i>
            <el-input v-model="formInline.opinion" size="mini"></el-input>
          </li>
          <li>
            <i>开始时间</i>
            <el-date-picker
              v-model="formInline.occurTime"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              range-separator="至"
            ></el-date-picker>
          </li>
          <li>
            <i>结束时间</i>
            <el-date-picker
              v-model="formInline.endTime"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              range-separator="至"
            ></el-date-picker>
          </li>
        </ul>
      </div>
      <div class="alarm-log-btn">
        <el-button type="primary" @click="inquireClick" size="mini">查询</el-button>
        <el-button type="primary" @click="resetClick" size="mini">重置</el-button>
        <el-button @click="exportClick" size="mini">导出</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {}
</script>

<style lang="less" scope>
</style>

