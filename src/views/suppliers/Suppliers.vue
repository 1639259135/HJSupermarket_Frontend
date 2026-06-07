<template>
  <div class="page">
    <DataTable
      ref="tableRef"
      :columns="columns"
      :api="getSupplierList"
      :search-form="searchForm"
      show-pagination
    >
      <template #toolbar>
        <el-button type="primary" @click="dialogRef?.openCreate()">新建供应商</el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
          {{ row.status === 1 ? '合作中' : '已停用' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="dialogRef?.openEdit(row)">编辑</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </DataTable>
    <FormDialog ref="dialogRef" title="供应商" :fields="formFields" :submit-api="handleSubmit" @success="tableRef?.refresh()" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable, { type ColumnConfig } from '@/components/common/DataTable.vue'
import FormDialog, { type FieldConfig } from '@/components/common/FormDialog.vue'
import { getSupplierList, createSupplier, updateSupplier, deleteSupplier } from '@/api'

const tableRef = ref<InstanceType<typeof DataTable>>()
const dialogRef = ref<InstanceType<typeof FormDialog>>()

const columns: ColumnConfig[] = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'name', label: '名称', minWidth: 120 },
  { prop: 'contactPerson', label: '联系人', width: 100 },
  { prop: 'phone', label: '电话', width: 120 },
  { prop: 'address', label: '地址', minWidth: 160 },
  { prop: 'status', label: '状态', width: 80, slot: 'status' },
  { prop: 'createTime', label: '创建时间', width: 160 },
]

const searchForm = { items: [{ prop: 'name', label: '名称', type: 'input' as const, placeholder: '输入供应商名称' }] }

const formFields: FieldConfig[] = [
  { prop: 'name', label: '名称', type: 'input', required: true },
  { prop: 'contactPerson', label: '联系人', type: 'input' },
  { prop: 'phone', label: '电话', type: 'input' },
  { prop: 'address', label: '地址', type: 'textarea' },
  { prop: 'status', label: '状态', type: 'switch', activeValue: 1, inactiveValue: 0 },
]

async function handleSubmit(data: Record<string, any>) {
  data.id ? await updateSupplier(data.id, data) : await createSupplier(data)
}

async function handleDelete(row: Record<string, any>) {
  await ElMessageBox.confirm(`确定删除供应商「${row.name}」？`, '警告', { type: 'error' })
  await deleteSupplier(row.id)
  ElMessage.success('已删除')
  tableRef.value?.refresh()
}
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
