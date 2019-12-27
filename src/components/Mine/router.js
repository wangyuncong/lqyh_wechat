/*
 * @Descripttion: 
 * @version: 
 * @Author: Zhang Zi Fang
 * @Date: 2019-10-12 16:44:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-08 17:51:20
 */
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
        path: '/ihuanzhesecond',
        name: 'ihuanzhesecond',
        component: resolve => require(['./ihuanzhe/ihuanzhesecond'], resolve),
        meta: {
            title: '患者列表'
        }
    },
    {
        path: '/seniority',
        name: 'seniority',
        component: resolve => require(['./seniority'], resolve),
        meta: {
            title: '我的资历'
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
        path: '/ihuanzhe',
        name: 'ihuanzhe',
        component: resolve => require(['./ihuanzhe'], resolve),
        meta: {
            title: '我的患者'
        }
    },
    {
        path: '/all',
        name: 'all',
        component: resolve => require(['./everydayKa/all'], resolve),
        meta: {
            title: '所有记录'
        }
    },
    {
        path: '/svg',
        name: 'svg',
        component: resolve => require(['./everydayKa/svg'], resolve),
        meta: {
            title: '体重详情'
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
        path: '/callCenter',
        name: 'callCenter',
        component: resolve => require(['./callCenter'], resolve),
        meta: {
            title: '客服中心'
        }
    },
    {
        path: '/callCenterChat',
        name: 'callCenterChat',
        component: resolve => require(['./callCenter/chat'], resolve),
        meta: {
            title: '客服中心'
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