<template>
  <div class="categories-page">
    <div class="left-tree">
      <div class="tree-header">
        <h3>商品分类</h3>
        <el-button type="primary" size="small" @click="openCreate(null)">新增根分类</el-button>
      </div>
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="treeProps"
        node-key="id"
        highlight-current
        @node-click="handleNodeClick"
      >
        <template #default="{ data }">
          <span class="tree-node" :class="{ disabled: data.status === 0 }">
            {{ data.name }}
            <el-tag v-if="data.status === 0" size="small" type="danger">禁用</el-tag>
          </span>
        </template>
      </el-tree>
    </div>
    <div class="right-detail" v-if="currentNode">
      <h3>{{ currentNode.name }}</h3>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ currentNode.id }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ currentNode.name }}</el-descriptions-item>
        <el-descriptions-item label="父级ID">{{ currentNode.parentId || '—（根分类）' }}</el-descriptions-item>
        <el-descriptions-item label="排序">{{ currentNode.sortOrder }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentNode.status === 1 ? 'success' : 'danger'" size="small">
            {{ currentNode.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <div class="detail-actions">
        <el-button type="primary" size="small" @click="openCreate(currentNode)">新增子分类</el-button>
        <el-button size="small" @click="openEdit(currentNode)">编辑</el-button>
        <el-button type="danger" size="small" @click="handleDelete(currentNode)">删除</el-button>
      </div>
    </div>

    <!-- 表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="460px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" maxlength="20" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { getCategoryTree, createCategory, updateCategory, deleteCategory } from '@/api'

const treeData = ref<any[]>([])
const treeProps = { label: 'name', children: 'children' }
const currentNode = ref<any>(null)

const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const submitting = ref(false)
const editingId = ref<number | null>(null)
const parentNode = ref<any>(null)

const form = reactive({ name: '', sortOrder: 0, status: 1 })
const rules = { name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }] }

const dialogTitle = computed(() => {
  if (editingId.value) return '编辑分类'
  if (parentNode.value) return `新增子分类（父：${parentNode.value.name}）`
  return '新增根分类'
})

async function loadTree() {
  try {
    treeData.value = await getCategoryTree()
  } catch { treeData.value = [] }
}

function handleNodeClick(data: any) {
  currentNode.value = data
}

function openCreate(parent: any) {
  parentNode.value = parent
  editingId.value = null
  form.name = ''
  form.sortOrder = 0
  form.status = 1
  dialogVisible.value = true
}

function openEdit(row: any) {
  parentNode.value = null
  editingId.value = row.id
  form.name = row.name
  form.sortOrder = row.sortOrder
  form.status = row.status
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    const data: any = { name: form.name, sortOrder: form.sortOrder, status: form.status }
    if (parentNode.value) data.parentId = parentNode.value.id
    if (editingId.value) {
      await updateCategory(editingId.value, data)
    } else {
      await createCategory(data)
    }
    ElMessage.success(editingId.value ? '更新成功' : '创建成功')
    dialogVisible.value = false
    await loadTree()
    currentNode.value = null
  } catch {} finally { submitting.value = false }
}

async function handleDelete(row: any) {
  await ElMessageBox.confirm(`确定删除分类「${row.name}」？`, '警告', { type: 'error' })
  await deleteCategory(row.id)
  ElMessage.success('已删除')
  await loadTree()
  currentNode.value = null
}

onMounted(loadTree)
</script>

<style scoped>
.categories-page {
  display: flex; gap: 16px; height: 100%; padding: 16px; background: #fff; border-radius: 4px;
}
.left-tree {
  width: 280px; border-right: 1px solid #ebeef5; padding-right: 16px; overflow: auto;
}
.left-tree .tree-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
}
.left-tree .tree-header h3 { margin: 0; font-size: 16px; }
.right-detail {
  flex: 1; padding-left: 16px;
}
.right-detail h3 { margin-top: 0; }
.detail-actions { margin-top: 16px; display: flex; gap: 8px; }
.tree-node { display: flex; align-items: center; gap: 8px; }
.tree-node.disabled { color: #c0c4cc; }
</style>
