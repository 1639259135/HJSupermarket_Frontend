<template>
  <div class="page">
    <el-card v-loading="loading">
      <template #header>系统配置</template>
      <el-form ref="formRef" :model="form" label-width="120px" style="max-width:600px">
        <el-form-item v-for="(_val, key) in form" :key="key" :label="CONFIG_LABELS[key] || key">
          <el-input v-model="form[key]" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSave">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSettings, updateSettings } from '@/api'

const loading = ref(true)
const saving = ref(false)
const form = reactive<Record<string, string>>({})

const CONFIG_LABELS: Record<string, string> = {
  storeName: '默认门店名称',
  warningDays: '库存预警天数',
  lowStockThreshold: '低库存阈值',
}

onMounted(async () => {
  try {
    const data = await getSettings()
    if (data) Object.assign(form, data)
  } catch {} finally { loading.value = false }
})

async function handleSave() {
  saving.value = true
  try {
    await updateSettings({ ...form })
    ElMessage.success('配置已保存')
  } catch {} finally { saving.value = false }
}
</script>

<style scoped>
.page { padding: 16px; background: #fff; border-radius: 4px; }
</style>
