// 创建用户相关的小仓库
import { defineStore } from 'pinia';
// 引入接口
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user';
// 引入数据类型
import type { UserState } from './types/type';
// 引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token';
// 引入路由（常量路由）
import { constantRoute, asnycRoute, anyRoute } from '@/router/routes';
import type { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type';

//引入深拷贝方法
//@ts-expect-error
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'
//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asnycRoute: any, routes: any) {
    return asnycRoute.filter((item: any) => {
        if (routes.includes(item.name)) {
            if (item.children && item.children.length > 0) {
                //硅谷333账号:product\trademark\attr\sku
                item.children = filterAsyncRoute(item.children, routes)
            }
            return true
        }
    })
}

// 创建用户小仓库
let useUserStore = defineStore('User', {
    // 小仓库存储数据的地方
    state: (): UserState => {
        return {
            token: GET_TOKEN(),  // 用户唯一标识token
            menuRoutes: constantRoute,
            username: '',
            avatar: '',
            //存储当前用户按钮权限
            buttons: [],
        }
    },
    // 异步｜逻辑的地方
    actions: {
        // 用户登录的方法
        async userLogin(data: loginFormData) {
            const result: loginResponseData = await reqLogin(data)
            console.log(result);
            // 成功200->token
            // 失败201->错误信息
            if (result.code == 200) {
                // pinia仓库存储一下token
                this.token = (result.data as string);
                // 本地持久化存储一份
                SET_TOKEN(result.data as string)
                // 能保证当前async函数返回一个成功的promise
                return 'ok'
            } else {
                return Promise.reject(new Error(result.data))
            }
        },
        // 获取用户信息的方法
        async userInfo() {
            // 获取用户信息进行存储仓库当中
            const result: userInfoResponseData = await reqUserInfo()
            // 获取成功，存储
            if (result.code == 200) {
                this.username = result.data.name
                this.avatar = result.data.avatar
                this.buttons = result.data.buttons
                //计算当前用户需要展示的异步路由
                const userAsyncRoute = filterAsyncRoute(
                    cloneDeep(asnycRoute),
                    result.data.routes,
                )
                //菜单需要的数据整理完毕
                this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute];
                //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
                [...userAsyncRoute, anyRoute].forEach((route: any) => {
                    router.addRoute(route)
                })
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
        // 退出登录
        async userLogout() {
            const result = await reqLogout()
            if (result.code == 200) {
                // 目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
                this.token = ''
                this.username = ''
                this.avatar = ''
                REMOVE_TOKEN()
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }

        }
    },
    getters: {

    }
})

export default useUserStore;