<!--
 * @Author: shikai
 * @Date: 2020-07-14 20:25:47
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-14 23:32:58
--> 
<template>
    <div class="container">
        <div class="nav no-print">
            <div class="left">
                <!--<div>
                    <img src="../../static/logo.png" alt />
                </div>-->
                <div>融汇支行营业网点评估报告</div>
            </div>
        </div>
        <div class="body">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    
</script>

<style lang="less" scoped>
    .container {
        width: 100%;
        height: 100%;
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        .nav {
            width: 100%;
            height: 40px;
            display: flex;
            font-size: 16px;
            line-height: 40px;
            justify-content: space-between;
            color: #fff;
            background: #3047A4;
            /*background: url("../../static/nav.png") 100% 100% no-repeat;*/
            background-size: 100% 100%;
            .left {
                display: flex;
                width: 350px;
                div:first-child {
                    height: 40px;
                    padding-left: 21px;
                    img {
                        height: 32px;
                        width: 139px;
                        vertical-align: middle;
                    }
                }
                div:nth-child(2) {}
                div:last-child {
                    margin: 0 0 0 25px;
                }
            }
        }
    }
</style>