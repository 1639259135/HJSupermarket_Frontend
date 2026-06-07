<template>
  <div class="page">
    <DataTable
      :columns="columns"
      :api="getDamagedList"
      :search-form="searchForm"
      show-pagination
    >
      <template #toolbar>
        <el-button type="primary" @click="$router.push('/damaged/new')">新建报损单</el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 0 ? 'warning' : 'success'" size="small">
          {{ row.status === 0 ? '待确认' : '已确认' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="$router.push(`/damaged/${row.id}`)">详情</el-button>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable, { type ColumnConfig } from '@/components/common/DataTable.vue'
import { getDamagedList } from '@/api'

const columns: ColumnConfig[] = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'damagedNo', label: '报损单号', minWidth: 140 },
  { prop: 'storeName', label: '门店', width: 120 },
  { prop: 'totalQuantity', label: '数量', width: 80 },
  { prop: 'status', label: '状态', width: 80, slot: 'status' },
  { prop: 'createTime', label: '创建时间', width: 160 },
]

const searchForm = { items: [{ prop: 'damagedNo', label: '单号', type: 'input' as const }] }
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
