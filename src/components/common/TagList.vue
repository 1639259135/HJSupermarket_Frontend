<template>
  <div class="tag-list">
    <el-tag
      v-for="(tag, idx) in modelValue"
      :key="idx"
      closable
      :disable-transitions="false"
      @close="handleRemove(tag)"
      style="margin-right:4px;margin-bottom:4px"
    >
      {{ tag }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="inputRef"
      v-model="inputValue"
      size="small"
      style="width:80px"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else size="small" @click="showInput">+ 添加</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const inputVisible = ref(false)
const inputValue = ref('')
const inputRef = ref()

function showInput() {
  inputVisible.value = true
  setTimeout(() => inputRef.value?.focus(), 100)
}

function handleInputConfirm() {
  const val = inputValue.value.trim()
  if (val && !props.modelValue.includes(val)) {
    emit('update:modelValue', [...props.modelValue, val])
  }
  inputVisible.value = false
  inputValue.value = ''
}

function handleRemove(tag: string) {
  emit('update:modelValue', props.modelValue.filter((t) => t !== tag))
}
</script>
