const router = [{
        path: "/",
        redirect: "/index"
    },
    {
        path: '*',
        name: 'error404',
        component: () => import('@/views/error/error404.vue')
    },
    {
        path: "/error/:code",
        name: "error",
        component: () => import('@/views/error/error.vue')
    },
    {
        path: "/login",
        name: "login",
        component: () => import('@/views/login.vue')
    },
    {
        path: "/forget-login",
        name: "forget-login",
        component: () => import('@/views/forget-login.vue')
    },
    {
        path: "/register",
        name: "register",
        component: () => import('@/views/register.vue')
    },
    {
        path: "/index",
        name: "home",
        component: () => import('@/views/home.vue'),
        children: [
            {
                path: "list",
                name: 'project-list',
                component: () => import('@/components/project/project-list.vue'),
            },
            {
                path: "user",
                name: 'user',
                component: () => import('@/components/header/user-panel.vue'),
                children:[
                    {
                        path: "password",
                        name: 'user-password',
                        component: () => import('@/components/header/user-password.vue')
                    },
                    {
                        path: "info",
                        name: 'user-info',
                        component: () => import('@/components/header/user-info.vue')
                    },
                    {
                        path: "share",
                        name: 'user-share',
                        component: () => import('@/components/header/user-share.vue')
                    }
                ]
            },
            {
                path: "project",
                name: 'project-info',
                component: () => import('@/components/projectUpload/project-view.vue'),
                children:[
                    {
                        path: "overview",
                        name: 'overview',
                        component: () => import('@/components/schemePanel/scheme-overview.vue')
                    },
                    {
                        path: "terrainData",
                        name: 'terrainData',
                        component: () => import('@/components/schemePanel/scheme-terrainData.vue')
                    }
                ]
            },
        ]
    }
]
export default router
