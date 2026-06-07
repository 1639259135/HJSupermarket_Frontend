<template>
  <div class="page">
    <DataTable
      ref="tableRef"
      :columns="columns"
      :api="getStoreList"
      :search-form="searchForm"
      show-pagination
    >
      <template #toolbar>
        <el-button type="primary" @click="dialogRef?.openCreate()">新建门店</el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
          {{ row.status === 1 ? '营业' : '停业' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="dialogRef?.openEdit(row)">编辑</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </DataTable>
    <FormDialog ref="dialogRef" title="门店" :fields="formFields" :submit-api="handleSubmit" @success="tableRef?.refresh()" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable, { type ColumnConfig } from '@/components/common/DataTable.vue'
import FormDialog, { type FieldConfig } from '@/components/common/FormDialog.vue'
import { getStoreList, createStore, updateStore, deleteStore } from '@/api'

const tableRef = ref<InstanceType<typeof DataTable>>()
const dialogRef = ref<InstanceType<typeof FormDialog>>()

const columns: ColumnConfig[] = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'name', label: '门店名称', minWidth: 120 },
  { prop: 'address', label: '地址', minWidth: 160 },
  { prop: 'phone', label: '电话', width: 120 },
  { prop: 'managerName', label: '负责人', width: 100 },
  { prop: 'status', label: '状态', width: 70, slot: 'status' },
  { prop: 'createTime', label: '创建时间', width: 160 },
]

const searchForm = { items: [{ prop: 'name', label: '名称', type: 'input' as const, placeholder: '输入门店名称' }] }

const formFields: FieldConfig[] = [
  { prop: 'name', label: '名称', type: 'input', required: true },
  { prop: 'address', label: '地址', type: 'textarea' },
  { prop: 'phone', label: '电话', type: 'input' },
  { prop: 'managerName', label: '负责人', type: 'input' },
  { prop: 'status', label: '状态', type: 'switch', activeValue: 1, inactiveValue: 0 },
]

async function handleSubmit(data: Record<string, any>) {
  data.id ? await updateStore(data.id, data) : await createStore(data)
}

async function handleDelete(row: Record<string, any>) {
  await ElMessageBox.confirm(`确定删除门店「${row.name}」？`, '警告', { type: 'error' })
  await deleteStore(row.id)
  ElMessage.success('已删除')
  tableRef.value?.refresh()
}
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
