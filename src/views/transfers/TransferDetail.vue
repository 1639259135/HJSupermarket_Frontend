<template>
  <div class="page">
    <el-card v-loading="loading">
      <template #header>
        <div style="display:flex;align-items:center;gap:12px">
          <el-button @click="$router.push('/transfers')" text><el-icon><ArrowLeft /></el-icon></el-button>
          <span>调拨单详情 — {{ detail.transferNo }}</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="单号">{{ detail.transferNo }}</el-descriptions-item>
        <el-descriptions-item label="调出">{{ detail.fromStoreName }}</el-descriptions-item>
        <el-descriptions-item label="调入">{{ detail.toStoreName }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ detail.totalQuantity }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detail.status === 0 ? 'warning' : detail.status === 1 ? 'success' : 'info'" size="small">
            {{ detail.status === 0 ? '待确认' : detail.status === 1 ? '已确认' : '已取消' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail.createTime }}</el-descriptions-item>
      </el-descriptions>
      <h3 style="margin-top:20px">明细</h3>
      <el-table :data="detail.items || []" border stripe>
        <el-table-column prop="productName" label="商品" />
        <el-table-column prop="quantity" label="数量" width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTransferDetail } from '@/api'

const route = useRoute()
const loading = ref(true)
const detail = ref<Record<string, any>>({})

onMounted(async () => {
  try {
    detail.value = await getTransferDetail(Number(route.params.id))
  } catch {} finally { loading.value = false }
})
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
