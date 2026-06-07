<template>
  <div class="page">
    <DataTable
      ref="tableRef"
      :columns="columns"
      :api="getStockCheckList"
      :search-form="searchForm"
      show-pagination
    >
      <template #toolbar>
        <el-button type="primary" @click="$router.push('/stock-checks/new')">新建盘点单</el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 0 ? 'warning' : 'success'" size="small">
          {{ row.status === 0 ? '待确认' : '已确认' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="$router.push(`/stock-checks/${row.id}`)">详情</el-button>
        <el-button v-if="row.status === 0" link type="success" size="small" @click="handleConfirm(row)">确认</el-button>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable, { type ColumnConfig } from '@/components/common/DataTable.vue'
import { getStockCheckList, confirmStockCheck } from '@/api'

const tableRef = ref<InstanceType<typeof DataTable>>()

const columns: ColumnConfig[] = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'checkNo', label: '盘点单号', minWidth: 140 },
  { prop: 'storeName', label: '门店', width: 120 },
  { prop: 'totalQuantity', label: '盘点数量', width: 100 },
  { prop: 'status', label: '状态', width: 80, slot: 'status' },
  { prop: 'createTime', label: '创建时间', width: 160 },
]

const searchForm = { items: [{ prop: 'checkNo', label: '单号', type: 'input' as const }] }

async function handleConfirm(row: any) {
  await ElMessageBox.confirm('确认盘点单？库存将以盘点数据为准！', '提示', { type: 'warning' })
  await confirmStockCheck(row.id)
  ElMessage.success('已确认')
  tableRef.value?.refresh()
}
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
