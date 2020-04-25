const userList = [
    {
        path: '/index/user/share',
        type: 'share',
        icon: 'iconfont icon-fenxiang',
        label: 'share',
        active: false
    },
    {
        path: '/index/user/info',
        type: 'info',
        icon: 'iconfont icon-yonghu',
        label: 'userInfo',
        active: false
    },
    {
        path: '/index/user/password',
        type: 'password',
        icon: 'iconfont icon-password',
        label: 'changePassword',
        active: false
    },
    {
        path: '/login',
        type: 'exit',
        icon: 'iconfont icon-exit',
        label: 'out',
        active: false
    }
]
const project = {
    path: '/index/list',
    type: 'list',
    icon: 'iconfont icon-xiangmu1',
    label: 'projectList',
    active: false
}
const search = {
    path: '/index/search',
    type: 'search',
    icon: 'iconfont icon-search',
    label: 'search',
    active: false
}

export {
    userList,
    project,
    search
}