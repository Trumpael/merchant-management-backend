// 路由鉴权
import router from '@/router';
import nprogress from 'nprogress';
import setting from './setting';
// 引入进度条样式
import "nprogress/nprogress.css"
nprogress.configure({ showSpinner: false })
// 获取用户相关的小仓库内部token
import pinia from './store'
import useUserStore from './store/modules/user';
let userStore = useUserStore(pinia)
// 全局守卫:项目当中任意路由切换都会触发的沟子

// 全局前置守卫
router.beforeEach(async (to, _from, next) => {
    nprogress.start()
    let token = userStore.token
    //获取用户名字
    let username = userStore.username
    //用户登录判断
    if (token) {
        //登录成功,访问login,不能访问,指向首页
        if (to.path == '/login') {
            next({ path: '/' })
        } else {
            //登录成功访问其余六个路由(登录排除)
            //有用户信息
            if (username) {
                //放行
                next()
            } else {
                //如果没有用户信息,在守卫这里发请求获取到了用户信息再放行
                try {
                    //获取用户信息
                    await userStore.userInfo()
                    //放行
                    //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
                    next({ ...to })
                } catch (error) {
                    //token过期:获取不到用户信息了
                    //用户手动修改本地存储token
                    //退出登录->用户相关的数据清空
                    await userStore.userLogout()
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }
        }
    } else {
        //用户未登录判断
        if (to.path == '/login') {
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
})

// 全局后置守卫
router.afterEach((to, _from,) => {
    document.title = `${setting.title} - ${to.meta.title}`
    nprogress.done()
})

//用户未登录：可以访问login，其余六个路由不能访问（指向login）
//用户登录成功：不可以访问login，其余可以访问