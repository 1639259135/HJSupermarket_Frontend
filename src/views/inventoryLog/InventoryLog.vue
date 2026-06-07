<template>
  <div class="page">
    <DataTable
      :columns="columns"
      :api="getInventoryLogList"
      :search-form="searchForm"
      show-pagination
    >
      <template #changeType="{ row }">
        <el-tag size="small">{{ CHANGE_TYPES[row.changeType] || row.changeType }}</el-tag>
      </template>
      <template #changeQuantity="{ row }">
        <span :style="{ color: row.changeQuantity > 0 ? '#67c23a' : '#f56c6c' }">
          {{ row.changeQuantity > 0 ? '+' : '' }}{{ row.changeQuantity }}
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable, { type ColumnConfig, type SearchItem } from '@/components/common/DataTable.vue'
import { getInventoryLogList } from '@/api'

const CHANGE_TYPES: Record<number, string> = {
  1: '进货入库', 2: '销售出库', 3: '调拨出库', 4: '调拨入库',
  5: '报损出库', 6: '盘点调整',
}

const columns: ColumnConfig[] = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'productName', label: '商品', minWidth: 110 },
  { prop: 'storeName', label: '门店', width: 100 },
  { prop: 'changeType', label: '类型', width: 90, slot: 'changeType' },
  { prop: 'changeQuantity', label: '数量变更', width: 100, slot: 'changeQuantity' },
  { prop: 'beforeQuantity', label: '变更前', width: 80 },
  { prop: 'afterQuantity', label: '变更后', width: 80 },
  { prop: 'relatedNo', label: '关联单号', minWidth: 140 },
  { prop: 'createTime', label: '时间', width: 160 },
]

const searchForm: { items: SearchItem[] } = {
  items: [
    { prop: 'productName', label: '商品', type: 'input', placeholder: '输入商品名称' },
    {
      prop: 'changeType', label: '类型', type: 'select',
      options: Object.entries(CHANGE_TYPES).map(([v, l]) => ({ label: l, value: Number(v) })),
    },
  ],
}
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
