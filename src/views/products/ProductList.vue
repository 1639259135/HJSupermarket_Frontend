<template>
  <div class="page">
    <DataTable
      ref="tableRef"
      :columns="columns"
      :api="getProductList"
      :search-form="searchForm"
      show-pagination
    >
      <template #toolbar>
        <el-button type="primary" @click="router.push('/products/new')">新建商品</el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
          {{ row.status === 1 ? '上架' : '下架' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="router.push(`/products/${row.id}`)">详情</el-button>
        <el-button link type="primary" size="small" @click="router.push(`/products/edit/${row.id}`)">编辑</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable, { type ColumnConfig, type SearchItem } from '@/components/common/DataTable.vue'
import { getProductList, deleteProduct, getCategoryTree, type CategoryTreeNode } from '@/api'

const router = useRouter()
const tableRef = ref<InstanceType<typeof DataTable>>()
const categoryOptions = ref<Array<{ label: string; value: number }>>([])

const columns: ColumnConfig[] = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'name', label: '名称', minWidth: 120 },
  { prop: 'categoryName', label: '分类', width: 100 },
  { prop: 'barcode', label: '条码', width: 120 },
  { prop: 'spec', label: '规格', width: 80 },
  { prop: 'unit', label: '单位', width: 60 },
  { prop: 'purchasePrice', label: '进价(¥)', width: 90 },
  { prop: 'salePrice', label: '售价(¥)', width: 90 },
  { prop: 'status', label: '状态', width: 70, slot: 'status' },
  { prop: 'createTime', label: '创建时间', width: 160 },
]

const searchForm: { items: SearchItem[] } = {
  items: [
    { prop: 'name', label: '名称', type: 'input', placeholder: '输入商品名称' },
    { prop: 'barcode', label: '条码', type: 'input', placeholder: '输入条码' },
    {
      prop: 'categoryId', label: '分类', type: 'select',
      options: categoryOptions.value,
    },
  ],
}

async function handleDelete(row: Record<string, any>) {
  await ElMessageBox.confirm(`确定删除商品「${row.name}」？`, '警告', { type: 'error' })
  await deleteProduct(row.id)
  ElMessage.success('已删除')
  tableRef.value?.refresh()
}

onMounted(async () => {
  try {
    const tree = await getCategoryTree()
    function flat(nodes: CategoryTreeNode[], prefix: string = ''): void {
      for (const n of nodes) {
        categoryOptions.value.push({ label: prefix + n.name, value: n.id })
        if (n.children?.length) flat(n.children, prefix + '— ')
      }
    }
    flat(tree)
  } catch {}
})
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
