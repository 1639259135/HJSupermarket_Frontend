<template>
  <el-container class="main-layout">
    <el-aside :width="collapsed ? '64px' : '220px'" class="aside">
      <div class="logo">
        <span v-if="!collapsed">🏪 HJ 超市管理</span>
        <span v-else>🏪</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/users" v-permission="[1]">
          <el-icon><UserFilled /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/categories" v-permission="[1]">
          <el-icon><Menu /></el-icon>
          <span>商品分类</span>
        </el-menu-item>
        <el-menu-item index="/products">
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/stores" v-permission="[1]">
          <el-icon><Shop /></el-icon>
          <span>门店管理</span>
        </el-menu-item>
        <el-menu-item index="/suppliers" v-permission="[1]">
          <el-icon><Van /></el-icon>
          <span>供应商管理</span>
        </el-menu-item>
        <el-menu-item index="/inventory">
          <el-icon><Box /></el-icon>
          <span>库存管理</span>
        </el-menu-item>
        <el-menu-item index="/purchases">
          <el-icon><ShoppingCart /></el-icon>
          <span>进货管理</span>
        </el-menu-item>
        <el-menu-item index="/transfers">
          <el-icon><Connection /></el-icon>
          <span>调拨管理</span>
        </el-menu-item>
        <el-menu-item index="/stock-checks">
          <el-icon><Checked /></el-icon>
          <span>盘点管理</span>
        </el-menu-item>
        <el-menu-item index="/sales">
          <el-icon><Sell /></el-icon>
          <span>销售管理</span>
        </el-menu-item>
        <el-menu-item index="/damaged">
          <el-icon><WarningFilled /></el-icon>
          <span>报损管理</span>
        </el-menu-item>
        <el-menu-item index="/inventory-log">
          <el-icon><Document /></el-icon>
          <span>库存流水</span>
        </el-menu-item>
        <el-menu-item index="/reports">
          <el-icon><TrendCharts /></el-icon>
          <span>数据报表</span>
        </el-menu-item>
        <el-menu-item index="/settings" v-permission="[1]">
          <el-icon><Tools /></el-icon>
          <span>系统配置</span>
        </el-menu-item>
        <el-menu-item index="/logs" v-permission="[1]">
          <el-icon><Notebook /></el-icon>
          <span>操作日志</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-button text @click="collapsed = !collapsed">
            <el-icon :size="20"><Fold v-if="!collapsed" /><Expand v-else /></el-icon>
          </el-button>
        </div>
        <div class="header-right">
          <span class="username">{{ auth.realName }}</span>
          <el-button type="danger" text @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  DataAnalysis, UserFilled, Menu, Goods, Shop, Van,
  Box, ShoppingCart, Connection, Checked, Sell, WarningFilled,
  Document, TrendCharts, Tools, Notebook, Fold, Expand
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const collapsed = ref(false)

const activeMenu = computed(() => {
  const path = route.path
  const parts = path.split('/').filter(Boolean)
  if (parts.length >= 2) return '/' + parts[0]
  return path
})

function handleLogout() {
  auth.clearAuth()
  router.push('/login')
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
}
.aside {
  background: #304156;
  transition: width 0.3s;
  overflow: hidden;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 16px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.username {
  color: #333;
}
.main-content {
  background: #f0f2f5;
  min-height: 0;
}
</style>
