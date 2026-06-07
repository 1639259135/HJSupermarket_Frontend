<template>
  <div class="dashboard">
    <h2>仪表盘</h2>
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6" v-for="card in statCards" :key="card.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">{{ card.label }}</div>
          <div class="stat-value">{{ card.value }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12">
        <el-card>
          <template #header>待处理提醒</template>
          <el-empty v-if="pendingItems.length === 0" description="暂无待处理事项" />
          <el-timeline v-else>
            <el-timeline-item
              v-for="item in pendingItems"
              :key="item.text"
              :timestamp="item.time"
              :color="item.color"
            >
              {{ item.text }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>进货趋势（开发中）</template>
          <div class="chart-placeholder">图表区域 · 后端占位数据</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDashboardSummary, type DashboardSummary } from '@/api'

const summary = ref<DashboardSummary>({
  productCount: 0,
  storeCount: 0,
  warningCount: 0,
  pendingPurchase: 0,
  pendingTransfer: 0,
  pendingStockCheck: 0,
  pendingSale: 0,
})

const statCards = ref([
  { label: '商品总数', value: 0 },
  { label: '门店总数', value: 0 },
  { label: '预警商品', value: 0 },
  { label: '库存不足', value: 0 },
])

const pendingItems = ref<Array<{ text: string; time: string; color: string }>>([])

onMounted(async () => {
  try {
    summary.value = await getDashboardSummary()
    statCards.value = [
      { label: '商品总数', value: summary.value.productCount },
      { label: '门店总数', value: summary.value.storeCount },
      { label: '预警商品', value: summary.value.warningCount },
      { label: '库存不足', value: summary.value.warningCount },
    ]
    pendingItems.value = [
      { text: `待确认进货单: ${summary.value.pendingPurchase} 条`, time: '', color: '#409EFF' },
      { text: `待确认调拨单: ${summary.value.pendingTransfer} 条`, time: '', color: '#E6A23C' },
      { text: `待确认盘点单: ${summary.value.pendingStockCheck} 条`, time: '', color: '#67C23A' },
      { text: `待确认销售单: ${summary.value.pendingSale} 条`, time: '', color: '#F56C6C' },
    ].filter((i) => !i.text.includes(': 0'))
  } catch {
    // 接口暂不可用，显示空状态
  }
})
</script>

<style scoped>
.dashboard h2 {
  margin-bottom: 16px;
}
.stat-card {
  text-align: center;
}
.stat-label {
  color: #999;
  font-size: 14px;
}
.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-top: 8px;
}
.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 4px;
  color: #909399;
}
</style>
