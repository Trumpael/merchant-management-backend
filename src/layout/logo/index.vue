<template>
    <div class="logo">
        <img :src="setting.logo" alt="">
        <p v-show="!layOutSettingStore.fold">{{setting.title}}</p>
    </div>
</template>

<script setup lang='ts'>
// 引入标题与logo的配置文件
import setting from '@/setting.ts';
import useLayOutSettingStore from '@/store/modules/setting'
let layOutSettingStore = useLayOutSettingStore()
</script>
<script lang="ts">
export default {
    name:"Logo"
}
</script>

<style scoped lang="scss">
.logo{
    width: 100%;
    height: 50px;
    color:white;
    display: flex;
    align-items: center;
    padding: 5px;
    img{
        width: 40px;
        height: 40px;
        margin-right: 5px;
    }
    p{
        font-size: 20px;
    }
}
</style>