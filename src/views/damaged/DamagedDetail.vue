<template>
  <div class="page">
    <el-card v-loading="loading">
      <template #header>
        <div style="display:flex;align-items:center;gap:12px">
          <el-button @click="$router.push('/damaged')" text><el-icon><ArrowLeft /></el-icon></el-button>
          <span>报损单详情 — {{ detail.damagedNo }}</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="单号">{{ detail.damagedNo }}</el-descriptions-item>
        <el-descriptions-item label="门店">{{ detail.storeName }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ detail.totalQuantity }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detail.status === 0 ? 'warning' : 'success'" size="small">
            {{ detail.status === 0 ? '待确认' : '已确认' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail.createTime }}</el-descriptions-item>
      </el-descriptions>
      <h3 style="margin-top:20px">报损明细</h3>
      <el-table :data="detail.items || []" border stripe>
        <el-table-column prop="productName" label="商品" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="reason" label="原因" minWidth="150" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDamagedDetail } from '@/api'

const route = useRoute()
const loading = ref(true)
const detail = ref<Record<string, any>>({})

onMounted(async () => {
  try { detail.value = await getDamagedDetail(Number(route.params.id)) } catch {} finally { loading.value = false }
})
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
