<template>
  <div class="page">
    <DataTable
      ref="tableRef"
      :columns="columns"
      :api="getTransferList"
      :search-form="searchForm"
      show-pagination
    >
      <template #toolbar>
        <el-button type="primary" @click="$router.push('/transfers/new')">新建调拨单</el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 0 ? 'warning' : row.status === 1 ? 'success' : 'info'" size="small">
          {{ row.status === 0 ? '待确认' : row.status === 1 ? '已确认' : '已取消' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="$router.push(`/transfers/${row.id}`)">详情</el-button>
        <el-button v-if="row.status === 0" link type="success" size="small" @click="handleConfirm(row)">确认</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable, { type ColumnConfig } from '@/components/common/DataTable.vue'
import { getTransferList, confirmTransfer, deleteTransfer } from '@/api'

const tableRef = ref<InstanceType<typeof DataTable>>()

const columns: ColumnConfig[] = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'transferNo', label: '调拨单号', minWidth: 140 },
  { prop: 'fromStoreName', label: '调出门店', width: 110 },
  { prop: 'toStoreName', label: '调入门店', width: 110 },
  { prop: 'totalQuantity', label: '数量', width: 80 },
  { prop: 'status', label: '状态', width: 80, slot: 'status' },
  { prop: 'createTime', label: '创建时间', width: 160 },
]

const searchForm = { items: [{ prop: 'transferNo', label: '单号', type: 'input' as const }] }

async function handleConfirm(row: any) {
  await ElMessageBox.confirm('确认调拨单？库存将自动变更。', '提示', { type: 'warning' })
  await confirmTransfer(row.id)
  ElMessage.success('已确认')
  tableRef.value?.refresh()
}

async function handleDelete(row: any) {
  await ElMessageBox.confirm(`确定删除调拨单「${row.transferNo}」？`, '警告', { type: 'error' })
  await deleteTransfer(row.id)
  ElMessage.success('已删除')
  tableRef.value?.refresh()
}
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
