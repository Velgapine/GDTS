const routes = [
  {
    path: '/',
    redirect: {
      name: 'Login',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/Login.vue'),
  },
  {
    path: '/home',
    component: () => import('@/Layout/Layout.vue'),
    children: [
      // 首页
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home/Home.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 医院信息
      {
        path: 'hospital',
        name: 'Hospital',
        component: () => import('@/views/Hospital/Hospital.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 科室管理
      {
        // path: 'hospital/dept',
        path: 'dept',
        name: 'Dept',
        component: () => import('@/views/Hospital/Dept.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 用户管理
      {
        path: 'administrator',
        name: 'Administrator',
        component: () => import('@/views/Administrator/Administrator.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 护士管理
      {
        path: 'nurse',
        name: 'Nurse',
        component: () => import('@/views/Nurse/Nurse.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 洗消室管理
      {
        path: 'wash',
        name: 'Wash',
        component: () => import('@/views/Wash/Wash.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 内镜管理
      {
        path: 'mirror',
        name: 'Mirror',
        component: () => import('@/views/Mirror/Mirror.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 查看内镜
      {
        path: 'mirror/single',
        name: 'MirrorSingle',
        component: () => import('@/views/Mirror/Single.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 查询内镜洗消记录
      {
        path: 'mirror/record',
        name: 'MirrorRecord',
        component: () => import('@/views/Mirror/Record.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 监控内镜
      {
        path: 'monitor',
        name: 'Monitor',
        component: () => import('@/views/Mirror/Monitor.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 设备类型管理
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/Category/Category.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 洗消设备管理
      {
        path: 'washDevice',
        name: 'WashDevice',
        component: () => import('@/views/WashDevice/WashDevice.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 洗消流程管理
      {
        path: 'washProcess',
        name: 'WashProcess',
        component: () => import('@/views/WashProcess/WashProcess.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 维修管理
      {
        path: 'maintain',
        name: 'Maintain',
        component: () => import('@/views/Maintain/Maintain.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 诊疗记录（原病人绑卡）
      {
        path: 'conRecord',
        name: 'ConRecord',
        component: () => import('@/views/ConRecord/ConRecord.vue'),
        meta: {
          requireAuth: true,
        },
      },
      // 诊疗室
      {
        path: 'consult',
        name: 'consult',
        component: () => import('@/views/Consult/Consult.vue'),
        meta: {
          requireAuth: true,
        },
      },
    ],
  },
];

export default routes;
