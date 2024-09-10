<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_form" ref="loginForms" :model="loginForm" :rules="rules">
                    <h1>Hello</h1>
                    <h2>欢迎来到海纳百川甄选</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input :prefix-icon="Lock" type="password" v-model="loginForm.password"
                            show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" class="login_btn" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang='ts'>
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
//引入获取当前时间的函数
import { getTime } from '@/utils/time';
// 引入用户相关的小仓库
import userUserStore from '@/store/modules/user';
let useStore = userUserStore();
// 获取el-form组件
let loginForms = ref()
// 获取路由器
let $router = useRouter()
// 定义变量控制按钮加载效果
let loading = ref(false)

// 收集账号密码
let loginForm = reactive({ username: 'admin', password: '111111' })
// 登录按钮回调
const login = async () => {
    // 保证全部表单校验通过再发请求
    await loginForms.value.validate()
    // 加载效果：开始加载
    loading.value = true
    // 点击登录按钮以后干什么？
    // 通知仓库发登录请求 成功->首页 失败->提示
    try {
        // 保证登录成功
        await useStore.userLogin(loginForm);
        // 编程式导航跳转到展示数据首页
        $router.push('/')
        // 登录成功提示信息
        ElNotification({
            type: 'success',
            message: '欢迎回来',
            title: `Hi，${getTime()}好`
        })
        // 登录成功加载效果也消失
        loading.value = false
    } catch (error) {
        // 登录失败加载效果消失
        loading.value = false
        // 登录失败提示信息
        ElNotification({
            type: 'error',
            message: (error as Error).message
        })
    }
}
// 自定义校验规则函数
const validatorUserName = (_rule: any, value: any, callback: any) => {
    //rule：即为校验规则对象
    //value：即为表单元素文本内容
    //函数：如果符合条件cal1Back放行通过即为
    //如果不符合条件cal1Back方法，注入错误提示信息
    if(value.length >= 5){
        callback()
    }else{
        callback(new Error('账号至少有5位'))
    }
}
const validatorPassword = (_rule: any, value: any, callback: any) => {
    if(/^[A-Za-z0-9]{6,20}$/.test(value)){
        callback()
    }else{
        callback(new Error('账号为6-20位字母数字组合'))
    }
}
// 定义表单校验需要配置对象
const rules = {
    //规则对象属性：
    //required：必填
    //min：文本长度至少多少位
    //max：文本长度最多多少位
    //message：错误的提示信息
    //trigger：触发校验表单的时机 change->文本发生变化触发校验，blur：失去焦点的时候触发校验规则
    username: [
        // { required: true, min: 6, max: 10, message: '长度6-10位', trigger: 'change' }
        { trigger: 'change', validator: validatorUserName }
    ],
    password: [
        // {required: true, min: 6, max: 15, message: '长度6-15位', trigger: 'change'}
        { trigger: 'change', validator: validatorPassword }
    ]
}

</script>

<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;

    .login_form {
        position: relative;
        width: 80%;
        top: 30vh;
        background: url('@/assets/images/login_form.png');
        background-size: cover;
        padding: 40px;

        h1 {
            color: white;
            font-size: 40px;
        }

        h2 {
            color: white;
            font-size: 20px;
        }

        .login_btn {
            width: 100%;
        }
    }
}
</style>