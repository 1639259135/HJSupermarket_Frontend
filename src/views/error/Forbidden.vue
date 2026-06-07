<template>
  <el-result icon="error" title="403" sub-title="权限不足，请联系管理员">
    <template #extra>
      <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
    </template>
  </el-result>
</template>
