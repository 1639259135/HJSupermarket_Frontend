<template>
  <div class="page">
    <el-card>
      <template #header>新建报损单</template>
      <el-form ref="formRef" :model="form" label-width="80px" style="max-width:700px">
        <el-form-item label="门店" prop="storeId" :rules="[{required:true}]">
          <el-select v-model="form.storeId" placeholder="选择门店" style="width:100%">
            <el-option v-for="s in stores" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </el-form-item>

        <h3>报损明细</h3>
        <div v-for="(item, idx) in form.items" :key="idx" class="item-row">
          <el-select v-model="item.productId" placeholder="选择商品" style="width:160px" filterable>
            <el-option v-for="p in products" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
          <el-input-number v-model="item.quantity" :min="1" placeholder="数量" style="width:100px" />
          <el-input v-model="item.reason" placeholder="报损原因" style="width:140px" />
          <el-button type="danger" @click="form.items.splice(idx,1)" :disabled="form.items.length<=1" circle>
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        <el-button style="margin-top:8px" @click="form.items.push({productId:0,quantity:1,reason:''})">+ 添加</el-button>

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
import { createDamaged } from '@/api'
import { getAllStores } from '@/api/modules/store'
import { getProductList } from '@/api/modules/product'

const router = useRouter()
const formRef = ref<FormInstance>()
const s = ref(false)
const stores = ref<any[]>([])
const products = ref<any[]>([])

const form = reactive({
  storeId: null as number | null,
  items: [{ productId: 0, quantity: 1, reason: '' }],
})

onMounted(async () => {
  stores.value = (await getAllStores().catch(() => [])) || []
  const res = await getProductList({ pageNum: 1, pageSize: 9999 }).catch(() => ({ list: [] }))
  products.value = res.list || []
})

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  s.value = true
  try {
    await createDamaged({ storeId: form.storeId!, items: form.items })
    ElMessage.success('报损单创建成功')
    router.push('/damaged')
  } catch {} finally { s.value = false }
}
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
.item-row { display: flex; gap: 6px; align-items: center; margin-bottom: 8px; }
</style>
