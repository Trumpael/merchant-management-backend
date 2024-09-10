<template>
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <!-- 渲染layout一级路由组件 -->
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<script setup lang='ts'>
import { watch, ref, nextTick } from 'vue';
import useLayOutSettingStore from '@/store/modules/setting';
let layOutSettingStore = useLayOutSettingStore()
// 控制当前组件是否销毁重建
let flag = ref(true)
// 监听仓库数据变化，如有则用户点击了刷新按钮
watch(() => layOutSettingStore.refsh, () => {
    // 点击刷新按钮：路由组件销毁
    flag.value = false
    nextTick(() => {
        flag.value = true
    })
})
</script>
<script lang="ts">
export default {
    name: "Main"
}
</script>

<style scoped>
.fade-enter-from {
    opacity: 0;
    transform: scale(0);
}

.fade-enter-active {
    transition: all .3s;
}

.fade-enter-to {
    opacity: 1;
    transform: scale(1);
}
</style>