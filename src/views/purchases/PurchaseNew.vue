<template>
  <div class="page">
    <el-card>
      <template #header>新建进货单</template>
      <el-form ref="formRef" :model="form" label-width="80px" style="max-width: 700px">
        <el-form-item label="供应商" prop="supplierId" :rules="[{required:true,message:'请选择供应商'}]">
          <el-select v-model="form.supplierId" placeholder="选择供应商" style="width:100%">
            <el-option v-for="s in suppliers" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="门店" prop="storeId" :rules="[{required:true,message:'请选择门店'}]">
          <el-select v-model="form.storeId" placeholder="选择门店" style="width:100%">
            <el-option v-for="s in stores" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </el-form-item>

        <h3>进货明细</h3>
        <div v-for="(item, idx) in form.items" :key="idx" class="item-row">
          <el-select v-model="item.productId" placeholder="选择商品" style="width:180px" filterable>
            <el-option v-for="p in products" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
          <el-input-number v-model="item.quantity" :min="1" placeholder="数量" style="width:100px" />
          <el-input-number v-model="item.price" :min="0" :precision="2" placeholder="单价" style="width:120px" />
          <el-button type="danger" @click="form.items.splice(idx, 1)" :disabled="form.items.length <= 1" circle>
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        <el-button style="margin-top:8px" @click="form.items.push({ productId: 0, quantity: 1, price: 0 })">
          + 添加商品
        </el-button>

        <div style="margin-top:20px">
          <el-button type="primary" :loading="s" @click="handleSubmit">提交</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { createPurchase } from '@/api'
import { getAllSuppliers } from '@/api/modules/supplier'
import { getAllStores } from '@/api/modules/store'
import { getProductList } from '@/api/modules/product'

const router = useRouter()
const formRef = ref<FormInstance>()
const s = ref(false)
const suppliers = ref<any[]>([])
const stores = ref<any[]>([])
const products = ref<any[]>([])

const form = reactive({
  supplierId: null as number | null,
  storeId: null as number | null,
  items: [{ productId: 0, quantity: 1, price: 0 }] as { productId: number; quantity: number; price: number }[],
})

onMounted(async () => {
  suppliers.value = (await getAllSuppliers().catch(() => [])) || []
  stores.value = (await getAllStores().catch(() => [])) || []
  const res = await getProductList({ pageNum: 1, pageSize: 9999 }).catch(() => ({ list: [] }))
  products.value = res.list || []
})

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  s.value = true
  try {
    await createPurchase({
      supplierId: form.supplierId!,
      storeId: form.storeId!,
      items: form.items,
    })
    ElMessage.success('进货单创建成功')
    router.push('/purchases')
  } catch {} finally { s.value = false }
}
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
.item-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
</style>
