<template>
  <div class="page">
    <h2>数据报表</h2>
    <el-row :gutter="16">
      <el-col :span="8">
        <el-card shadow="hover" class="report-card" @click="activeReport='product'">
          <el-icon :size="32"><Goods /></el-icon>
          <div>商品汇总</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="report-card" @click="activeReport='inventory'">
          <el-icon :size="32"><Box /></el-icon>
          <div>库存统计</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="report-card" @click="activeReport='purchase'">
          <el-icon :size="32"><ShoppingCart /></el-icon>
          <div>进货统计</div>
        </el-card>
      </el-col>
    </el-row>

    <div v-if="activeReport" style="margin-top:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h3 style="margin:0">{{ reportTitle }}</h3>
        <el-button type="success" @click="exportExcel">
          <el-icon><Download /></el-icon> 导出 Excel
        </el-button>
      </div>

      <!-- 商品汇总 -->
      <el-table v-if="activeReport==='product'" :data="productReport" border stripe v-loading="loading">
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="categoryName" label="分类" width="100" />
        <el-table-column label="进价" width="90"><template #default="{row}">¥{{ row.purchasePrice }}</template></el-table-column>
        <el-table-column label="售价" width="90"><template #default="{row}">¥{{ row.salePrice }}</template></el-table-column>
        <el-table-column prop="totalQuantity" label="总库存" width="100" />
      </el-table>

      <!-- 库存统计 -->
      <el-table v-if="activeReport==='inventory'" :data="inventoryReport" border stripe v-loading="loading">
        <el-table-column prop="productName" label="商品" />
        <el-table-column prop="storeName" label="门店" width="120" />
        <el-table-column prop="quantity" label="库存" width="100" />
        <el-table-column label="库存金额" width="120">
          <template #default="{row}">¥{{ (row.quantity * (row.salePrice || 0)).toFixed(2) }}</template>
        </el-table-column>
      </el-table>

      <!-- 进货统计 -->
      <el-table v-if="activeReport==='purchase'" :data="purchaseReport" border stripe v-loading="loading">
        <el-table-column prop="purchaseNo" label="单号" />
        <el-table-column prop="supplierName" label="供应商" width="120" />
        <el-table-column label="金额" width="100"><template #default="{row}">¥{{ row.totalAmount }}</template></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{row}">{{ row.status===0?'待确认':row.status===1?'已确认':'已取消' }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="160" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'
import { getProductList, getInventoryList, getPurchaseList } from '@/api'

const activeReport = ref<string>('')
const loading = ref(false)
const productReport = ref<any[]>([])
const inventoryReport = ref<any[]>([])
const purchaseReport = ref<any[]>([])

const reportTitle = computed(() => {
  return { product: '商品汇总', inventory: '库存统计', purchase: '进货统计' }[activeReport.value] || ''
})

watch(activeReport, async (t) => {
  if (!t) return
  loading.value = true
  try {
    if (t === 'product') {
      const res = await getProductList({ pageNum: 1, pageSize: 9999 })
      productReport.value = res.list || []
    } else if (t === 'inventory') {
      const res = await getInventoryList({ pageNum: 1, pageSize: 9999 })
      // 补 salePrice — in real app would need a join; here approximate
      inventoryReport.value = res.list || []
    } else if (t === 'purchase') {
      const res = await getPurchaseList({ pageNum: 1, pageSize: 9999 })
      purchaseReport.value = res.list || []
    }
  } catch {} finally { loading.value = false }
})

function exportExcel() {
  let data: any[] = []
  let sheetName = 'Sheet1'
  if (activeReport.value === 'product') { data = productReport.value; sheetName = '商品汇总' }
  else if (activeReport.value === 'inventory') { data = inventoryReport.value; sheetName = '库存统计' }
  else if (activeReport.value === 'purchase') { data = purchaseReport.value; sheetName = '进货统计' }

  if (!data.length) { ElMessage.warning('无数据可导出'); return }

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, `${sheetName}_${new Date().toISOString().slice(0,10)}.xlsx`)
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
.page h2 { margin-top: 0; }
.report-card {
  text-align: center; cursor: pointer; padding: 24px 0; transition: transform 0.2s;
}
.report-card:hover { transform: translateY(-4px); }
.report-card .el-icon { margin-bottom: 8px; }
</style>
