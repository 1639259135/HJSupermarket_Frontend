<template>
  <div class="page">
      <h3>⚠️ 库存预警</h3>
    <DataTable
      :columns="columns"
      :api="getWarningInventory"
      show-pagination
    >
      <template #quantity="{ row }">
        <span style="color: #f56c6c; font-weight: bold">{{ row.quantity }}</span>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable, { type ColumnConfig } from '@/components/common/DataTable.vue'
import { getWarningInventory } from '@/api'

const columns: ColumnConfig[] = [
  { prop: 'productName', label: '商品名称', minWidth: 120 },
  { prop: 'storeName', label: '门店', width: 120 },
  { prop: 'quantity', label: '当前库存', width: 100, slot: 'quantity' },
  { prop: 'warningQuantity', label: '预警阈值', width: 100 },
]
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
.page h3 { margin-top: 0; }
</style>
