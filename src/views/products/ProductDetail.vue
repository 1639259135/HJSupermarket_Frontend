<template>
  <div class="page">
    <el-card v-loading="loading">
      <template #header>
        <div style="display:flex;align-items:center;gap:12px">
          <el-button @click="$router.push('/products')" text>
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <span>商品详情 — {{ detail.name }}</span>
        </div>
      </template>
      <el-descriptions :column="2" border v-if="!loading">
        <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ detail.name }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ detail.categoryName }}</el-descriptions-item>
        <el-descriptions-item label="条码">{{ detail.barcode }}</el-descriptions-item>
        <el-descriptions-item label="规格">{{ detail.spec || '—' }}</el-descriptions-item>
        <el-descriptions-item label="单位">{{ detail.unit || '—' }}</el-descriptions-item>
        <el-descriptions-item label="进价">¥{{ detail.purchasePrice }}</el-descriptions-item>
        <el-descriptions-item label="售价">¥{{ detail.salePrice }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detail.status === 1 ? 'success' : 'danger'" size="small">
            {{ detail.status === 1 ? '上架' : '下架' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail.createTime }}</el-descriptions-item>
      </el-descriptions>

      <!-- 库存概览 -->
      <h3 style="margin-top:24px">库存概览</h3>
      <DataTable
        ref="invRef"
        :columns="invColumns"
        :api="loadInventory"
        show-pagination
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DataTable, { type ColumnConfig } from '@/components/common/DataTable.vue'
import { getProductDetail, getInventoryList } from '@/api'

const route = useRoute()
const loading = ref(true)
const detail = ref<Record<string, any>>({})

const invColumns: ColumnConfig[] = [
  { prop: 'storeName', label: '门店', minWidth: 100 },
  { prop: 'productName', label: '商品', minWidth: 100 },
  { prop: 'quantity', label: '当前库存', width: 100 },
  { prop: 'warningQuantity', label: '预警阈值', width: 100 },
]

async function loadInventory(params: Record<string, any>) {
  params.productId = Number(route.params.id)
  return await getInventoryList(params as any)
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    detail.value = await getProductDetail(id)
  } catch {} finally { loading.value = false }
})
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
