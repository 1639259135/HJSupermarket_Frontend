<template>
  <div class="page">
    <DataTable
      ref="tableRef"
      :columns="columns"
      :api="getUserList"
      :search-form="searchForm"
      show-pagination
    >
      <template #toolbar>
        <el-button type="primary" @click="dialogRef?.openCreate()">新建用户</el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>
      <template #roleId="{ row }">
        <el-tag :type="row.roleId === 1 ? 'danger' : 'primary'" size="small">
          {{ ROLES[row.roleId] || row.roleId }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="dialogRef?.openEdit(row)">编辑</el-button>
        <el-button
          v-if="row.status === 1"
          link
          type="warning"
          size="small"
          @click="handleDisable(row)"
        >
          禁用
        </el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </DataTable>

    <FormDialog
      ref="dialogRef"
      title="用户"
      :fields="formFields"
      :submit-api="handleSubmit"
      @success="tableRef?.refresh()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable, { type ColumnConfig, type SearchItem } from '@/components/common/DataTable.vue'
import FormDialog, { type FieldConfig } from '@/components/common/FormDialog.vue'
import { getUserList, createUser, updateUser, deleteUser } from '@/api'

const ROLES: Record<number, string> = { 1: '超级管理员', 2: '仓管', 3: '店员' }

const tableRef = ref<InstanceType<typeof DataTable>>()
const dialogRef = ref<InstanceType<typeof FormDialog>>()

const columns: ColumnConfig[] = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'username', label: '用户名', minWidth: 100 },
  { prop: 'realName', label: '姓名', minWidth: 80 },
  { prop: 'phone', label: '手机号', minWidth: 110 },
  { prop: 'email', label: '邮箱', minWidth: 120 },
  { prop: 'roleId', label: '角色', width: 100, slot: 'roleId' },
  { prop: 'status', label: '状态', width: 70, slot: 'status' },
  { prop: 'createTime', label: '创建时间', width: 160 },
]

const searchForm: { items: SearchItem[] } = {
  items: [
    { prop: 'username', label: '用户名', type: 'input', placeholder: '输入用户名' },
    {
      prop: 'roleId', label: '角色', type: 'select',
      options: [
        { label: '超级管理员', value: 1 },
        { label: '仓管', value: 2 },
        { label: '店员', value: 3 },
      ],
    },
    {
      prop: 'status', label: '状态', type: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  ],
}

const formFields: FieldConfig[] = [
  { prop: 'username', label: '用户名', type: 'input', required: true, placeholder: '4-32位字符' },
  { prop: 'password', label: '密码', type: 'input', placeholder: '创建时必填，编辑留空不改' },
  { prop: 'realName', label: '姓名', type: 'input', required: true },
  { prop: 'phone', label: '手机号', type: 'input' },
  { prop: 'email', label: '邮箱', type: 'input' },
  {
    prop: 'roleId', label: '角色', type: 'select', required: true,
    options: [
      { label: '超级管理员', value: 1 },
      { label: '仓管', value: 2 },
      { label: '店员', value: 3 },
    ],
  },
  { prop: 'status', label: '状态', type: 'switch', activeValue: 1, inactiveValue: 0 },
]

async function handleSubmit(data: Record<string, any>) {
  if (data.id) {
    const payload = { ...data }
    if (!payload.password) delete payload.password
    await updateUser(data.id, payload)
  } else {
    await createUser(data)
  }
}

async function handleDisable(row: Record<string, any>) {
  await ElMessageBox.confirm(`确定禁用用户「${row.username}」？`, '提示', { type: 'warning' })
  await updateUser(row.id, { ...row, status: 0 })
  ElMessage.success('已禁用')
  tableRef.value?.refresh()
}

async function handleDelete(row: Record<string, any>) {
  await ElMessageBox.confirm(`确定删除用户「${row.username}」？`, '警告', { type: 'error' })
  await deleteUser(row.id)
  ElMessage.success('已删除')
  tableRef.value?.refresh()
}
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
