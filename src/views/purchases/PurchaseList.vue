<template>
  <div class="page">
    <DataTable
      ref="tableRef"
      :columns="columns"
      :api="getPurchaseList"
      :search-form="searchForm"
      show-pagination
    >
      <template #toolbar>
        <el-button type="primary" @click="$router.push('/purchases/new')">新建进货单</el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 0 ? 'warning' : row.status === 1 ? 'success' : 'info'" size="small">
          {{ row.status === 0 ? '待确认' : row.status === 1 ? '已确认' : '已取消' }}
        </el-tag>
      </template>
      <template #totalAmount="{ row }">¥{{ row.totalAmount }}</template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="$router.push(`/purchases/${row.id}`)">详情</el-button>
        <el-button
          v-if="row.status === 0"
          link type="success" size="small"
          @click="handleConfirm(row)"
        >确认</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable, { type ColumnConfig } from '@/components/common/DataTable.vue'
import { getPurchaseList, confirmPurchase, deletePurchase } from '@/api'

const tableRef = ref<InstanceType<typeof DataTable>>()

const columns: ColumnConfig[] = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'purchaseNo', label: '进货单号', minWidth: 140 },
  { prop: 'supplierName', label: '供应商', width: 100 },
  { prop: 'storeName', label: '门店', width: 100 },
  { prop: 'totalAmount', label: '金额', width: 100, slot: 'totalAmount' },
  { prop: 'status', label: '状态', width: 80, slot: 'status' },
  { prop: 'createTime', label: '创建时间', width: 160 },
]

const searchForm = { items: [{ prop: 'purchaseNo', label: '单号', type: 'input' as const }] }

async function handleConfirm(row: any) {
  await ElMessageBox.confirm('确认进货单？库存将自动增加。', '提示', { type: 'warning' })
  await confirmPurchase(row.id)
  ElMessage.success('已确认')
  tableRef.value?.refresh()
}

async function handleDelete(row: any) {
  await ElMessageBox.confirm(`确定删除进货单「${row.purchaseNo}」？`, '警告', { type: 'error' })
  await deletePurchase(row.id)
  ElMessage.success('已删除')
  tableRef.value?.refresh()
}
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
