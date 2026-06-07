<template>
  <div class="data-table-wrapper">
    <!-- 搜索栏 -->
    <el-form v-if="searchForm && searchForm.items?.length" :inline="true" :model="searchData" class="search-form">
      <el-form-item
        v-for="item in searchForm.items"
        :key="item.prop"
        :label="item.label"
      >
        <el-input
          v-if="item.type === 'input'"
          v-model="searchData[item.prop]"
          :placeholder="item.placeholder"
          clearable
          style="width: 180px"
        />
        <el-select
          v-else-if="item.type === 'select'"
          v-model="searchData[item.prop]"
          :placeholder="item.placeholder"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="opt in item.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作栏 -->
    <div class="toolbar" v-if="$slots.toolbar">
      <slot name="toolbar" />
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      v-loading="loading"
      v-bind="$attrs"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :sortable="col.sortable"
        :fixed="col.fixed"
      >
        <template v-if="col.slot" #default="scope">
          <slot :name="col.slot" :row="scope.row" :index="scope.$index" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="$slots.actions"
        label="操作"
        :width="actionWidth"
        fixed="right"
      >
        <template #default="scope">
          <slot name="actions" :row="scope.row" :index="scope.$index" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination" v-if="showPagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="refresh"
        @current-change="refresh"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

export interface ColumnConfig {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  sortable?: boolean
  fixed?: 'left' | 'right'
  slot?: string
}

export interface SearchItem {
  prop: string
  label: string
  type: 'input' | 'select'
  placeholder?: string
  options?: Array<{ label: string; value: any }>
}

const props = defineProps<{
  columns: ColumnConfig[]
  api: (...args: any[]) => Promise<any>
  searchForm?: { items: SearchItem[] }
  actionWidth?: string | number
  showPagination?: boolean
}>()

const emit = defineEmits<{
  loaded: [data: any[]]
}>()

const loading = ref(false)
const tableData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const initialSearchData = () => {
  const d: Record<string, any> = {}
  if (props.searchForm) {
    for (const item of props.searchForm.items) {
      d[item.prop] = ''
    }
  }
  return d
}
const searchData = reactive<Record<string, any>>(initialSearchData())

async function refresh() {
  loading.value = true
  try {
    const params: Record<string, any> = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    }
    for (const key of Object.keys(searchData)) {
      if (searchData[key] !== '' && searchData[key] != null) {
        params[key] = searchData[key]
      }
    }
    const res = await props.api(params)
    // 后端分页格式: { list, total }
    if (res && res.list) {
      tableData.value = res.list
      total.value = res.total ?? 0
    } else if (Array.isArray(res)) {
      tableData.value = res
      total.value = res.length
    } else {
      tableData.value = []
      total.value = 0
    }
    emit('loaded', tableData.value)
  } catch {
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  currentPage.value = 1
  refresh()
}

function handleReset() {
  Object.assign(searchData, initialSearchData())
  currentPage.value = 1
  refresh()
}

onMounted(refresh)
defineExpose({ refresh })
</script>

<style scoped>
.search-form {
  background: #fff;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 4px;
}
.toolbar {
  margin-bottom: 16px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
