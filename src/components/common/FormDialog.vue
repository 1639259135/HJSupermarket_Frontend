<template>
  <el-dialog
    v-model="visible"
    :title="mode === 'create' ? `新建${title}` : `编辑${title}`"
    :width="width"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
      <template v-for="field in fields" :key="field.prop">
        <!-- Input -->
        <el-form-item
          v-if="field.type === 'input' || field.type === 'textarea'"
          :label="field.label"
          :prop="field.prop"
        >
          <el-input
            v-model="form[field.prop]"
            :type="field.type"
            :placeholder="field.placeholder"
            :maxlength="field.maxlength"
            :disabled="field.disabled && mode === 'edit'"
          />
        </el-form-item>

        <!-- InputNumber -->
        <el-form-item
          v-else-if="field.type === 'number'"
          :label="field.label"
          :prop="field.prop"
        >
          <el-input-number
            v-model="form[field.prop]"
            :min="field.min ?? 0"
            :precision="field.precision ?? 2"
            style="width: 100%"
          />
        </el-form-item>

        <!-- Select -->
        <el-form-item
          v-else-if="field.type === 'select'"
          :label="field.label"
          :prop="field.prop"
        >
          <el-select
            v-model="form[field.prop]"
            :placeholder="field.placeholder"
            style="width: 100%"
          >
            <el-option
              v-for="opt in field.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>

        <!-- TreeSelect (级联) -->
        <el-form-item
          v-else-if="field.type === 'treeSelect'"
          :label="field.label"
          :prop="field.prop"
        >
          <el-tree-select
            v-model="form[field.prop]"
            :data="field.treeData ?? []"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            :placeholder="field.placeholder"
            check-strictly
            style="width: 100%"
          />
        </el-form-item>

        <!-- Switch -->
        <el-form-item
          v-else-if="field.type === 'switch'"
          :label="field.label"
          :prop="field.prop"
        >
          <el-switch
            v-model="form[field.prop]"
            :active-value="field.activeValue ?? 1"
            :inactive-value="field.inactiveValue ?? 0"
          />
        </el-form-item>

        <!-- DatePicker -->
        <el-form-item
          v-else-if="field.type === 'date'"
          :label="field.label"
          :prop="field.prop"
        >
          <el-date-picker
            v-model="form[field.prop]"
            type="datetime"
            :placeholder="field.placeholder"
            style="width: 100%"
          />
        </el-form-item>
      </template>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'

export interface FieldConfig {
  prop: string
  label: string
  type: 'input' | 'textarea' | 'number' | 'select' | 'treeSelect' | 'switch' | 'date'
  placeholder?: string
  required?: boolean
  min?: number
  max?: number
  precision?: number
  maxlength?: number
  disabled?: boolean
  activeValue?: any
  inactiveValue?: any
  options?: Array<{ label: string; value: any }>
  treeData?: any[]
  rules?: any[]
}

const props = defineProps<{
  fields: FieldConfig[]
  submitApi: (data: any) => Promise<any>
  title?: string
  width?: string
  mode?: 'create' | 'edit'
}>()

const emit = defineEmits<{
  success: []
}>()

const visible = ref(false)
const formRef = ref<FormInstance>()
const submitting = ref(false)
const editId = ref<number | string>()

const initialForm = () => {
  const d: Record<string, any> = {}
  for (const field of props.fields) {
    d[field.prop] = field.type === 'number' ? null : field.type === 'switch' ? 1 : ''
  }
  return d
}
const form = reactive<Record<string, any>>(initialForm())

const formRules = computed(() => {
  const rules: Record<string, any[]> = {}
  for (const field of props.fields) {
    const fieldRules: any[] = []
    if (field.required) {
      fieldRules.push({ required: true, message: `请输入${field.label}`, trigger: 'blur' })
    }
    if (field.rules) {
      fieldRules.push(...field.rules)
    }
    if (fieldRules.length) rules[field.prop] = fieldRules
  }
  return rules
})

// 打开新建
function openCreate() {
  Object.assign(form, initialForm())
  editId.value = undefined
  visible.value = true
}
// 打开编辑（回填）
function openEdit(row: Record<string, any>) {
  for (const key of Object.keys(form)) {
    if (row[key] !== undefined) {
      form[key] = row[key]
    }
  }
  editId.value = row.id
  visible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await props.submitApi(form)
    ElMessage.success(props.mode === 'edit' || editId.value ? '更新成功' : '创建成功')
    visible.value = false
    emit('success')
  } catch {
    // 拦截器已处理
  } finally {
    submitting.value = false
  }
}

function handleClose() {
  formRef.value?.resetFields()
}

defineExpose({ openCreate, openEdit, visible })
</script>
