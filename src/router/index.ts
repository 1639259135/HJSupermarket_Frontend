import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 懒加载页面
const Login = () => import('@/views/login/Login.vue')
const Dashboard = () => import('@/views/dashboard/Dashboard.vue')
const MainLayout = () => import('@/layouts/MainLayout.vue')

// Stage 2: CRUD
const Users = () => import('@/views/users/Users.vue')
const Categories = () => import('@/views/categories/Categories.vue')
const ProductList = () => import('@/views/products/ProductList.vue')
const ProductForm = () => import('@/views/products/ProductForm.vue')
const ProductDetail = () => import('@/views/products/ProductDetail.vue')
const Stores = () => import('@/views/stores/Stores.vue')
const Suppliers = () => import('@/views/suppliers/Suppliers.vue')

// Stage 3: Business
const Inventory = () => import('@/views/inventory/Inventory.vue')
const InventoryWarning = () => import('@/views/inventory/InventoryWarning.vue')
const PurchaseList = () => import('@/views/purchases/PurchaseList.vue')
const PurchaseNew = () => import('@/views/purchases/PurchaseNew.vue')
const PurchaseDetail = () => import('@/views/purchases/PurchaseDetail.vue')
const TransferList = () => import('@/views/transfers/TransferList.vue')
const TransferNew = () => import('@/views/transfers/TransferNew.vue')
const TransferDetail = () => import('@/views/transfers/TransferDetail.vue')
const StockCheckList = () => import('@/views/stockChecks/StockCheckList.vue')
const StockCheckNew = () => import('@/views/stockChecks/StockCheckNew.vue')
const StockCheckDetail = () => import('@/views/stockChecks/StockCheckDetail.vue')

// Stage 4: Sales / Damaged / Logs / Reports / Settings
const SaleList = () => import('@/views/sales/SaleList.vue')
const SaleNew = () => import('@/views/sales/SaleNew.vue')
const SaleDetail = () => import('@/views/sales/SaleDetail.vue')
const DamagedList = () => import('@/views/damaged/DamagedList.vue')
const DamagedNew = () => import('@/views/damaged/DamagedNew.vue')
const DamagedDetail = () => import('@/views/damaged/DamagedDetail.vue')
const InventoryLog = () => import('@/views/inventoryLog/InventoryLog.vue')
const Reports = () => import('@/views/reports/Reports.vue')
const Settings = () => import('@/views/settings/Settings.vue')
const Logs = () => import('@/views/logs/Logs.vue')

// Error
const NotFound = () => import('@/views/error/NotFound.vue')
const Forbidden = () => import('@/views/error/Forbidden.vue')

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'Login', component: Login, meta: { public: true } },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },

      // Stage 2
      { path: 'users', name: 'Users', component: Users },
      { path: 'categories', name: 'Categories', component: Categories },
      { path: 'products', name: 'Products', component: ProductList },
      { path: 'products/new', name: 'ProductNew', component: ProductForm },
      { path: 'products/edit/:id', name: 'ProductEdit', component: ProductForm },
      { path: 'products/:id', name: 'ProductDetail', component: ProductDetail },
      { path: 'stores', name: 'Stores', component: Stores },
      { path: 'suppliers', name: 'Suppliers', component: Suppliers },

      // Stage 3
      { path: 'inventory', name: 'Inventory', component: Inventory },
      { path: 'inventory/warning', name: 'InventoryWarning', component: InventoryWarning },
      { path: 'purchases', name: 'Purchases', component: PurchaseList },
      { path: 'purchases/new', name: 'PurchaseNew', component: PurchaseNew },
      { path: 'purchases/:id', name: 'PurchaseDetail', component: PurchaseDetail },
      { path: 'transfers', name: 'Transfers', component: TransferList },
      { path: 'transfers/new', name: 'TransferNew', component: TransferNew },
      { path: 'transfers/:id', name: 'TransferDetail', component: TransferDetail },
      { path: 'stock-checks', name: 'StockChecks', component: StockCheckList },
      { path: 'stock-checks/new', name: 'StockCheckNew', component: StockCheckNew },
      { path: 'stock-checks/:id', name: 'StockCheckDetail', component: StockCheckDetail },

      // Stage 4
      { path: 'sales', name: 'Sales', component: SaleList },
      { path: 'sales/new', name: 'SaleNew', component: SaleNew },
      { path: 'sales/:id', name: 'SaleDetail', component: SaleDetail },
      { path: 'damaged', name: 'Damaged', component: DamagedList },
      { path: 'damaged/new', name: 'DamagedNew', component: DamagedNew },
      { path: 'damaged/:id', name: 'DamagedDetail', component: DamagedDetail },
      { path: 'inventory-log', name: 'InventoryLog', component: InventoryLog },
      { path: 'reports', name: 'Reports', component: Reports },
      { path: 'settings', name: 'Settings', component: Settings },
      { path: 'logs', name: 'Logs', component: Logs },
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
  if (to.meta.public) return next()
  if (!auth.isLoggedIn) return next({ name: 'Login', query: { redirect: to.fullPath } })
  next()
})

export default router
