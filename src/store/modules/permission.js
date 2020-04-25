import routesList from '@/router/routes.js'

const permission = {
    state: {
        routers: routesList, // 所有路由列表
        disableRouters: [], // 置灰的路由列表
        noneAuthRouters: [] // 没权限的路由列表
    }
}

export default permission