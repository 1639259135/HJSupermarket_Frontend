<template>
  <div class="placeholder-page">
    <el-empty :description="'页面开发中：' + $route.path" />
  </div>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
</style>
