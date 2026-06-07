import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const Login = () => import('@/views/login/Login.vue')
const Dashboard = () => import('@/views/dashboard/Dashboard.vue')
const NotFound = () => import('@/views/error/NotFound.vue')
const Forbidden = () => import('@/views/error/Forbidden.vue')
const Placeholder = () => import('@/views/Placeholder.vue')

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'Login', component: Login, meta: { public: true } },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'users', name: 'Users', component: Placeholder },
      { path: 'categories', name: 'Categories', component: Placeholder },
      { path: 'products', name: 'Products', component: Placeholder },
      { path: 'products/:id', name: 'ProductDetail', component: Placeholder },
      { path: 'stores', name: 'Stores', component: Placeholder },
      { path: 'suppliers', name: 'Suppliers', component: Placeholder },
      { path: 'inventory', name: 'Inventory', component: Placeholder },
      { path: 'inventory/warning', name: 'InventoryWarning', component: Placeholder },
      { path: 'purchases', name: 'Purchases', component: Placeholder },
      { path: 'purchases/new', name: 'PurchaseNew', component: Placeholder },
      { path: 'purchases/:id', name: 'PurchaseDetail', component: Placeholder },
      { path: 'transfers', name: 'Transfers', component: Placeholder },
      { path: 'transfers/new', name: 'TransferNew', component: Placeholder },
      { path: 'transfers/:id', name: 'TransferDetail', component: Placeholder },
      { path: 'stock-checks', name: 'StockChecks', component: Placeholder },
      { path: 'stock-checks/:id', name: 'StockCheckDetail', component: Placeholder },
      { path: 'sales', name: 'Sales', component: Placeholder },
      { path: 'sales/new', name: 'SaleNew', component: Placeholder },
      { path: 'sales/:id', name: 'SaleDetail', component: Placeholder },
      { path: 'damaged', name: 'Damaged', component: Placeholder },
      { path: 'damaged/new', name: 'DamagedNew', component: Placeholder },
      { path: 'damaged/:id', name: 'DamagedDetail', component: Placeholder },
      { path: 'inventory-log', name: 'InventoryLog', component: Placeholder },
      { path: 'reports', name: 'Reports', component: Placeholder },
      { path: 'settings', name: 'Settings', component: Placeholder },
      { path: 'logs', name: 'Logs', component: Placeholder },
    ],
  },
  { path: '/403', name: 'Forbidden', component: Forbidden },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.public) {
    return next()
  }
  if (!auth.isLoggedIn) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }
  next()
})

export default router
