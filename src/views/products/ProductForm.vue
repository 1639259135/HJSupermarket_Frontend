<template>
  <div class="page">
    <el-card>
      <template #header>
        <span>{{ isEdit ? '编辑商品' : '新建商品' }}</span>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 600px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" maxlength="50" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-tree-select
            v-model="form.categoryId"
            :data="categoryTree"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="选择分类"
            check-strictly
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="条码" prop="barcode">
          <el-input v-model="form.barcode" maxlength="20" />
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input v-model="form.spec" maxlength="20" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" maxlength="10" placeholder="如：个、箱、kg" />
        </el-form-item>
        <el-form-item label="进价(¥)" prop="purchasePrice">
          <el-input-number v-model="form.purchasePrice" :min="0" :precision="2" style="width:100%" />
        </el-form-item>
        <el-form-item label="售价(¥)" prop="salePrice">
          <el-input-number v-model="form.salePrice" :min="0" :precision="2" style="width:100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { createProduct, updateProduct, getProductDetail, getCategoryTree } from '@/api'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)
const categoryTree = ref<any[]>([])

const isEdit = route.path.includes('/edit/') || route.params.id !== undefined
const productId = Number(route.params.id) || 0

const form = reactive({
  name: '',
  categoryId: null as number | null,
  barcode: '',
  spec: '',
  unit: '',
  purchasePrice: null as number | null,
  salePrice: null as number | null,
  status: 1,
})

const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  barcode: [{ required: true, message: '请输入条码', trigger: 'blur' }],
}

async function loadData() {
  categoryTree.value = (await getCategoryTree().catch(() => [])) || []
  if (isEdit && productId) {
    const detail = await getProductDetail(productId)
    Object.assign(form, detail)
  }
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    if (isEdit && productId) {
      await updateProduct(productId, form)
    } else {
      await createProduct(form)
    }
    ElMessage.success(isEdit ? '更新成功' : '创建成功')
    router.push('/products')
  } catch {} finally { submitting.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
