<!--
 * @Author: shikai
 * @Date: 2020-07-14 19:38:00
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-14 19:38:44
-->
<template>
  <div class="content">
    <div class="flex-row">
        <div class="img"></div>
        <div class="info">
            <p>评估报告</p>
            <p>文件大小: 2M</p>
        </div>
    </div>
    <div class="flex-row">
        <div class="label">下载到</div>
        <el-input
        type="file"
        hidden
        directory=""
        nwdirectory=""
        ref="srcFolder"
        onChange="changeFolder"
        />
        <el-button size="mini">浏览</el-button>
    </div>
  </div>
</template>

<script>
</script>

<style>

</style>