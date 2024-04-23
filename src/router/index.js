import {createRouter, createWebHashHistory} from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',//首页
            component: () => import('@/views/home/Home.vue'),
            meta: {
                title: 'MAGIC META'
            }
        },
        {
            path: '/game',//游戏
            name: 'game',
            component: () => import('@/views/home/game.vue'),
            meta: {
                title: '游戏'
            }
        },
        {
            path: '/magicHouse',//魔法屋
            name: 'magicHouse',
            component: () => import('@/views/magicHouse/magicHouse.vue'),
            meta: {
                title: '魔法屋'
            }
        },
        {
            path: '/myRecord',//魔法屋-我的卡牌记录
            name: 'myRecord',
            component: () => import('@/views/magicHouse/myRecord.vue'),
            meta: {
                title: '我的魔法牌'
            }
        },
        {
            path: '/giveRecord',//魔法屋-我的转赠记录
            name: 'giveRecord',
            component: () => import('@/views/magicHouse/giveRecord.vue'),
            meta: {
                title: '转赠记录'
            }
        },
        {
            path: '/mySheep',//魔法屋-我的羊
            name: 'mySheep',
            component: () => import('@/views/magicHouse/mySheep.vue'),
            meta: {
                title: '我的羊'
            }
        },
        {
            path: '/myWolf',//魔法屋-我的狼
            name: 'myWolf',
            component: () => import('@/views/magicHouse/myWolf.vue'),
            meta: {
                title: '我的狼'
            }
        },
        {
            path: '/sheepFarm',//牧羊场
            name: 'sheepFarm',
            component: () => import('@/views/sheepFarm/sheepFarm.vue'),
            meta: {
                title: '牧羊场'
            }

        },
        {   //牧羊场-排行榜
            path: '/rankingList',
            name: 'rankingList',
            component: () => import('@/views/sheepFarm/rankingList.vue'),
            meta: {
                title: '排行榜'
            }
        },
        {   //牧羊场-搜索
            path: '/sheepFarmSearch',
            name: 'sheepFarmSearch',
            component: () => import('@/views/sheepFarm/sheepFarmSearch.vue'),
            meta: {
                title: '搜索'
            }
        },
        {   //牧羊场-详细
            path: '/sheepFarmDetail',
            name: 'sheepFarmDetail',
            component: () => import('@/views/sheepFarm/sheepFarmDetail.vue'),
            meta: {
                title: '牧羊场详情'
            }
        },
        {//农场
            path: '/farm',
            name: 'farm',
            component: () => import('@/views/farm/farm.vue'),
            meta: {
                title: '农场'
            }
        },
          {//农场投入记录
            path: '/farmList',
            name: 'farmList',
            component: () => import('@/views/farm/farmList.vue'),
            meta: {
                title: '投入记录'
            }
        },

        {//钱包
            path: '/purse',
            name: 'purse',
            component: () => import('@/views/purse/purse.vue'),
            meta: {
                title: '我的'
            }
        },
        {
            path: '/ranking',//游戏-排行榜
            name: 'ranking',
            component: () => import('@/views/home/ranking.vue'),
            meta: {
                title: '排行榜'
            }
        },
        {
            path: '/record',//游戏-记录
            name: 'record',
            component: () => import('@/views/home/record.vue'),

            meta: {
                title: '记录'
            }
        },
        {
            path: '/recorda',//钱包-记录
            name: 'recorda',
            component: () => import('@/views/purse/recorda.vue'),
            meta: {
                title: '资金记录'
            }
        },
    ],
});

export default router;
