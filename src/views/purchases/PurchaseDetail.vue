<template>
  <div class="page">
    <el-card v-loading="loading">
      <template #header>
        <div style="display:flex;align-items:center;gap:12px">
          <el-button @click="$router.push('/purchases')" text>
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <span>进货单详情 — {{ detail.purchaseNo }}</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="单号">{{ detail.purchaseNo }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{ detail.supplierName }}</el-descriptions-item>
        <el-descriptions-item label="门店">{{ detail.storeName }}</el-descriptions-item>
        <el-descriptions-item label="金额">¥{{ detail.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detail.status === 0 ? 'warning' : detail.status === 1 ? 'success' : 'info'" size="small">
            {{ detail.status === 0 ? '待确认' : detail.status === 1 ? '已确认' : '已取消' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail.createTime }}</el-descriptions-item>
        <el-descriptions-item v-if="detail.confirmTime" label="确认时间">{{ detail.confirmTime }}</el-descriptions-item>
      </el-descriptions>

      <h3 style="margin-top:20px">明细</h3>
      <el-table :data="detail.items || []" border stripe>
        <el-table-column prop="productName" label="商品" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column label="单价" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column label="小计" width="100">
          <template #default="{ row }">¥{{ (row.quantity * row.price).toFixed(2) }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPurchaseDetail } from '@/api'

const route = useRoute()
const loading = ref(true)
const detail = ref<Record<string, any>>({})

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    detail.value = await getPurchaseDetail(id)
  } catch {} finally { loading.value = false }
})
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
