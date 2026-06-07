<template>
  <div class="page">
    <DataTable
      ref="tableRef"
      :columns="columns"
      :api="fetchData"
      :search-form="searchForm"
      show-pagination
      @loaded="allData = $event"
    >
      <template #quantity="{ row }">
        <span :style="{ color: row.quantity <= row.warningQuantity ? '#f56c6c' : '', fontWeight: row.quantity <= row.warningQuantity ? 'bold' : '' }">
          {{ row.quantity }}
        </span>
      </template>
      <template #warningQuantity="{ row }">
        <span v-if="row.quantity <= row.warningQuantity && row.warningQuantity > 0">
          <el-tag type="danger" size="small">⚠ 低于预警</el-tag>
          {{ row.warningQuantity }}
        </span>
        <span v-else>{{ row.warningQuantity }}</span>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataTable, { type ColumnConfig } from '@/components/common/DataTable.vue'
import { getInventoryList } from '@/api'

const allData = ref<any[]>([])

const columns: ColumnConfig[] = [
  { prop: 'productName', label: '商品名称', minWidth: 120 },
  { prop: 'storeName', label: '门店', width: 120 },
  { prop: 'quantity', label: '库存数量', width: 100, slot: 'quantity' },
  { prop: 'warningQuantity', label: '预警阈值', width: 120, slot: 'warningQuantity' },
]

const searchForm = {
  items: [
    // Note: 后端不支持 productName 搜索，前端本地过滤
    { prop: 'productName', label: '商品名称', type: 'input' as const, placeholder: '输入商品名称（本地过滤）' },
    { prop: 'storeId', label: '门店ID', type: 'input' as const, placeholder: '输入门店ID' },
  ],
}

async function fetchData(params: Record<string, any>) {
  // 提取 productName 做本地过滤
  const productName = params.productName
  delete params.productName

  if (!productName || productName === '') {
    return await getInventoryList(params as any)
  }

  // 本地过滤：取全量后 filter
  const bigParams = { ...params, pageNum: 1, pageSize: 9999 }
  const res = await getInventoryList(bigParams as any)
  const filtered = (res.list || []).filter((item: any) =>
    item.productName?.toLowerCase().includes(productName.toLowerCase())
  )
  const pageNum = params.pageNum || 1
  const pageSize = params.pageSize || 20
  const start = (pageNum - 1) * pageSize
  return { list: filtered.slice(start, start + pageSize), total: filtered.length }
}
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
