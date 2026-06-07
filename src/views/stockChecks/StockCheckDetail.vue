<template>
  <div class="page">
    <el-card v-loading="loading">
      <template #header>
        <div style="display:flex;align-items:center;gap:12px">
          <el-button @click="$router.push('/stock-checks')" text><el-icon><ArrowLeft /></el-icon></el-button>
          <span>盘点单详情 — {{ detail.checkNo }}</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="单号">{{ detail.checkNo }}</el-descriptions-item>
        <el-descriptions-item label="门店">{{ detail.storeName }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detail.status === 0 ? 'warning' : 'success'" size="small">
            {{ detail.status === 0 ? '待确认' : '已确认' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail.createTime }}</el-descriptions-item>
      </el-descriptions>
      <h3 style="margin-top:20px">盘点明细</h3>
      <el-table :data="detail.items || []" border stripe>
        <el-table-column prop="productName" label="商品" />
        <el-table-column prop="systemQuantity" label="系统数量" width="100" />
        <el-table-column prop="actualQuantity" label="实际数量" width="100" />
        <el-table-column label="差异" width="100">
          <template #default="{ row }">{{ row.actualQuantity - row.systemQuantity }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getStockCheckDetail } from '@/api'

const route = useRoute()
const loading = ref(true)
const detail = ref<Record<string, any>>({})

onMounted(async () => {
  try {
    detail.value = await getStockCheckDetail(Number(route.params.id))
  } catch {} finally { loading.value = false }
})
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
