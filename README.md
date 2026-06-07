# HJ 超市管理系统 — Web 前端

> 技术栈: Vue 3 + Element Plus + TypeScript + Vite

## 快速启动

```bash
npm install
npm run dev
```

## 项目结构

```
src/
├── api/          # Axios 封装 + 接口模块
├── components/   # 通用组件 (DataTable, FormDialog)
├── directives/   # 自定义指令 (v-permission)
├── layouts/      # 布局组件
├── router/       # 路由配置
├── stores/       # Pinia 状态管理
├── utils/        # 工具函数 (snakeToCamel)
├── views/        # 页面组件
├── App.vue
└── main.ts
```

## 环境变量

- `.env.development` — 开发环境，API 代理到 `http://localhost:8080`
- `.env.production` — 生产环境

## 后端接口文档

参考 `HJSupermarket_Frontend_Tasks_adjusted.md`
