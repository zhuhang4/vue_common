import App from '../App.vue'

var home = r => require.ensure([], () => r(require('../pages/Home.vue')), 'home');

export default [{
    path: '/',
    component: App, //顶层路由，对应index.html
    children: [ //二级路由。对应App.vue
        //地址为空时跳转home页面
        {
            path: '',
            redirect: '/home'
        },
        {
            path: '/home',
            component: home,
            meta: {
                keepAlive: true // 需要被缓存
            }
            // ,
            // children:[
            //     {
            //         path: '/kc',
            //         component: kc
            //     }
            // ]
        },
    ]
}]
