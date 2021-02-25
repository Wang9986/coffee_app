//Main组件的二级路由
const MainRouets = [
  {
    path: '/home',
    alias: '/',
    name: 'Home',
    component: () => import('../views/Home')
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/Menu')
  },
  {
    path: '/shopbag',
    name: 'Shopbag',
    component: () => import('../views/Shopbag')
  },
  {
    path: '/my',
    name: 'My',
    component: () => import('../views/My')
  }
];


//导出路由
export const routes = [
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main'),

    //二级路由
    children: MainRouets
  },
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/detail/:pid',
    name: 'Detail',
    component: () => import('../views/Detail')
  },
  {
    path: '/addressList',
    name: 'AddressList',
    component: () => import('../views/AddressList')
  },
  {
    // :aid? 其中 ? 号表示aid可以传递可以不传递
    path: '/address/:aid?',
    name: 'Address',
    component: () => import('../views/Address')
  },
  {
    path: '/pay',
    name: 'Pay',
    component: () => import('../views/Pay')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order'),
  },
  {
    path:'/search',
    name:'Search',
    component:()=>import('../views/Search')
  },
  {
    path:'/account',
    name:'Account',
    component:()=>import('../views/Account')
  },
  {
    path:'/liek',
    name:'Like',
    component:()=>import('../views/Like')
  },
  {
    path:'secure',
    name:'Secure',
    component:()=>import('../views/Secure')
  },
]