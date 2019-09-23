const mineRouter = [
    {
        path: '/discounts',
        name: 'discounts',
        component: resolve => require(['./discounts'], resolve),
        meta: {
            title: '优惠券'
        }
    },
    {
        path: '/orderFormDetails',
        name: 'orderFormDetails',
        component: resolve => require(['./orderform'], resolve),
        meta: {
            title: '订单列表'
        }
    },
    {
        path: '/orderFormMsg',
        name: 'orderFormMsg',
        component: resolve => require(['./orderFormMsg'], resolve),
        meta: {
            title: '订单信息'
        }
    },
    {
        path: '/integralStore',
        name: 'integralStore',
        component: resolve => require(['./integralStore'], resolve),
        meta: {
            title: '积分兑换'
        }
    },
    {
        path: '/imessage',
        name: 'imessage',
        component: resolve => require(['./imessage'], resolve),
        meta: {
            title: '个人信息'
        }
    },
    {
        path: '/ismgregister',
        name: 'ismgregister',
        component: resolve => require(['./ismgregister'], resolve),
        meta: {
            title: '个人信息'
        }
    },
    {
        path: '/inviteFriends',
        name: 'inviteFriends',
        component: resolve => require(['./inviteFriends'], resolve),
        meta: {
            title: '邀请好友'
        }
    },
    {
        path: '/dietHobby',
        name: 'dietHobby',
        component: resolve => require(['./dietHobby'], resolve),
        meta: {
            title: '饮食偏好'
        }
    },
    {
        path: '/myAdvice',
        name: 'myAdvice',
        component: resolve => require(['../myAdvice'], resolve),
        meta: {
            title: '我的咨询'
        }
    },
    {
        path: '/shareThePage',
        name: 'shareThePage',
        component: resolve => require(['./shareThePage'], resolve),
        meta: {
            title: '邀请好友'
        }
    },
    {
        path: '/myqrcode',
        name: 'myqrcode',
        component: resolve => require(['./myqrcode'], resolve),
        meta: {
            title: '我的二维码'
        }
    },
    {
        path: '/everydayKa',
        name: 'everydayKa',
        component: resolve => require(['./everydayKa'], resolve),
        meta: {
            title: '每日打卡'
        }
    },
    {
        path: '/performance',
        name: 'performance',
        component: resolve => require(['./performance'], resolve),
        meta: {
            title: '我的业绩'
        }
    },
    {
        path: '/kehuList',
        name: 'kehuList',
        component: resolve => require(['./kehuList'], resolve),
        meta: {
            title: '客户列表'
        }
    },
    
]
export default mineRouter