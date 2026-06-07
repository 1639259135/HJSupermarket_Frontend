# HJ 超市管理系统 — Web 前端开发任务清单 — 后端对齐版

> **匹配后端**: Kotlin 2.0 + Spring Boot 3.3 + JDK 21 Virtual Threads
> **技术栈**: Vue 3 + Element Plus / React 18 + Ant Design
> **总计**: 52 任务 · 5 阶段
> **更新日期**: 2026-06-06

---

## ⚠️ 与后端的重大差异（必读）

### 1. JSON 字段名：所有响应返回蛇形

后端 `application.yml` 配置了 `SNAKE_CASE`：

| 前端代码（驼峰） | 实际后端 JSON（蛇形） |
|------|------|
| `realName` | `real_name` |
| `parentId` | `parent_id` |
| `categoryId` | `category_id` |
| `storeId` | `store_id` |
| `productId` | `product_id` |
| `orderNo` | `order_no` |
| `totalAmount` | `total_amount` |
| `salePrice` | `sale_price` |
| `purchasePrice` | `purchase_price` |
| `roleId` | `role_id` |
| `createTime` | `create_time` |
| `confirmTime` | `confirm_time` |
| `warningQuantity` | `warning_quantity` |
| `fromStoreId` | `from_store_id` |
| `toStoreId` | `to_store_id` |
| `transferNo` | `transfer_no` |
| `checkNo` | `check_no` |
| `systemQuantity` | `system_quantity` |
| `actualQuantity` | `actual_quantity` |
| `changeType` | `change_type` |
| `configKey` | `config_key` |
| `configValue` | `config_value` |

> **例外——分页字段保持驼峰**（PageResult 有 @JsonProperty）：
> `pageNum` · `pageSize` · `totalPages`

> **方案**：Axios 响应拦截器用 lodash 递归转 key。

### 2. 接口差异对照

| 功能 | 方法 | 实际路由 | 原文档写法 | 影响 |
|------|:--:|------|------|:--:|
| 用户更新 | PUT | `/api/user/{id}` | `PUT /api/user` | ⚠️ F-008 |
| 分类更新 | PUT | `/api/category/{id}` | `PUT /api/category` | ⚠️ F-009 |
| 商品更新 | PUT | `/api/product/{id}` | `PUT /api/product` | ⚠️ F-011 |
| 门店更新 | PUT | `/api/store/{id}` | `PUT /api/store` | ⚠️ F-013 |
| 供应商更新 | PUT | `/api/supplier/{id}` | `PUT /api/supplier` | ⚠️ F-014 |
| 手动调库存 | PUT | ❌ 不存在 | `PUT /api/inventory` | ⚠️ F-015 移除 |
| 报表接口 | GET | ❌ 4 个均不存在 | 4 个 `/api/report/*` | ⚠️ F-035 前端聚合 |
| 操作日志 | GET | ❌ 不存在 | `GET /api/log/list` | ⚠️ F-039 占位 |
| 当前用户 | GET | ❌ 不存在 | `/api/user/current` | ⚠️ F-007 JWT 解码 |
| 进货单 productId | GET | ❌ 不支持 | `?productId=` | ⚠️ F-012 移除 |
| 库存 productName | GET | ❌ 不支持 | `?productName=` | ⚠️ F-015 本地过滤 |
| 角色权限拦截 | — | ❌ 未实现 | 后端验证 | ⚠️ F-042 前端兜底 |

### 3. 缺失功能的处理方案

| 缺失项 | 处理方式 |
|------|------|
| `PUT /api/inventory` | 移除手动调库存按钮，库存通过单据确认变更 |
| `/api/report/*` | SheetJS 从 list 接口取数据前端自行聚合 |
| `/api/log/list` | 做占位页面标注开发中 |
| `/api/user/current` | `jwt-decode` 从 Token 中解 roleId |
| productName 搜索 | 取全量后 JS filter |
| productId 筛选进货单 | 前端本地过滤或移除该模块 |
| 后端角色鉴权 | 前端 v-permission 自行控制 |


## 阶段 1：项目基础设施 — 预估 3 天

### F-001 — 初始化项目脚手架

- **优先级**: P0 | **依赖**: —
- **详情**:
  - Vue 3 + Vite（或 React 18 + Vite）
  - Element Plus / Ant Design · Axios · Vue Router / React Router · Pinia / Zustand
  - ⚠️ **新增依赖**：`lodash`（蛇形转驼峰） + `jwt-decode`（Token 解 roleId）
  - 配置 `.env.development`（`VITE_API_BASE_URL=http://localhost:8080`）
  - ESLint + Prettier
- **验收**: `npm run dev` 启动成功

### F-002 — Axios 封装与统一错误处理 ⚠️

- **优先级**: P0 | **依赖**: F-001
- **详情**:
  - `src/api/request.ts`：baseURL + timeout(30s)
  - 请求拦截器：注入 `Authorization: Bearer $token`
  - **响应拦截器新增**：递归将蛇形 key 转为驼峰
  - 业务码处理：`code === 200` 返回 `data`；`code === 401/1002` 清 Token → 跳 `/login`；其他 `message.error()`
  - 错误码映射：`1001:"用户名或密码错误"` · `2002:"库存不足"` · `5002:"已确认不可删除"`
  - 封装 `get/post/put/delete<T>` 泛型方法
- **验收**: 401 跳登录；400 Toast 中文；蛇形自动变驼峰

### F-003 — 布局框架与路由 ⚠️

- **优先级**: P0 | **依赖**: F-001
- **详情**:
  - 左侧菜单（可折叠）+ 顶部栏（用户名 + 退出登录）+ `<router-view>`
  - 菜单基于 `roleId` 动态显隐（Token 解码，配合 F-007）
  - 路由：`/login` · `/dashboard` · `/users` · `/categories` · `/products` · `/products/:id` · `/stores` · `/suppliers` · `/inventory` · `/inventory/warning` · `/purchases` · `/purchases/new` · `/purchases/:id` · `/transfers` · `/transfers/new` · `/transfers/:id` · `/stock-checks` · `/stock-checks/:id` · `/sales` · `/sales/new` · `/sales/:id` · `/damaged` · `/damaged/new` · `/damaged/:id` · `/inventory-log` · `/reports` · `/settings` · `/logs`（28 个）
  - ⚠️ 原文档写"共 27 条路由"→ 更新为 28
  - ⚠️ `/reports` 和 `/logs` 后端暂缺接口，前端先占位
  - 路由守卫：未登录 → `/login`
- **验收**: 登录后菜单正确

### F-004 — 登录页 `/login`

- **优先级**: P0 | **依赖**: F-002, F-003
- `POST /api/user/login`（白名单，不需 Token）
- 成功：存 `token`/`userId`/`realName` → 跳转 `/dashboard`
- 失败：展示后端返回的 `message`

### F-005 — 通用表格组件

- `<DataTable>`：columns + api + searchForm
- 分页参数：`pageNum` · `pageSize`（驼峰）

### F-006 — 通用表单弹窗组件

- `<FormDialog>`：fields + submitApi

### F-007 — 权限指令/组件封装 ⚠️

- **优先级**: P0 | **依赖**: F-003
- 封装 `v-permission`（Vue）或 `<Permission>`（React）
- ⚠️ **后端无 `/api/user/current`**：改为 `jwt-decode` 解析 Token 中的 `roleId`
- Token 载荷：`{sub: userId, roleId: N}`
- ⚠️ **后端未做角色拦截**，前端 v-permission 是唯一权限控制层
- 权限矩阵参考[附录E-权限矩阵.md](../HJSupermarket_Backend/附录E-权限矩阵.md)

---

## 阶段 2：基础 CRUD 页面 — 预估 1.5 周

### F-008 — 用户管理 `/users` ⚠️

- 接口修正：`PUT /api/user/{id}`（原文档缺 `/{id}`）
- 其他无变更

### F-009 — 商品分类管理 `/categories` ⚠️

- 接口修正：`PUT /api/category/{id}`
- 树节点已由 F-002 转驼峰：`{id, name, parentId, children}`

### F-010 — 商品管理 `/products` — 列表页

- 接口：`GET /api/product/list`
- 表格字段名已由 F-002 从蛇形转驼峰

### F-011 — 商品管理 `/products` — 创建/编辑 ⚠️

- 接口修正：`PUT /api/product/{id}`

### F-012 — 商品详情页 `/products/:id` ⚠️

- ⚠️ 移除了「最近进货列表」——后端不支持 `productId` 参数
- 仅保留基本信息 + 库存概览（`/api/inventory/list?productId=`）

### F-013 — 门店管理 `/stores` ⚠️

- 接口修正：`PUT /api/store/{id}`
- `/api/store/all` 用于下拉

### F-014 — 供应商管理 `/suppliers` ⚠️

- 接口修正：`PUT /api/supplier/{id}`
- `/api/supplier/all` 用于下拉

---

## 阶段 3：业务模块页面 — 预估 2 周

### F-015 — 库存管理 `/inventory` ⚠️

- ⚠️ **无** `PUT /api/inventory`（手动调库存），移除按钮
- ⚠️ 后端不支持 `productName` 搜索参数，前端本地过滤
- 预警高亮在前端计算

### F-016 — 库存预警页 `/inventory/warning`

- 无变更

### F-017~F-019 — 进货管理

- 接口：`POST /api/purchase` · `POST /api/purchase/confirm/{id}` · `DELETE /api/purchase/{id}`
- 提交 body：`{"supplierId":1, "storeId":1, "items":[{"productId":1, "quantity":10, "price":5.50}]}`
- 无变更

### F-020~F-022 — 调拨管理

- 提交 body：`{"fromStoreId":1, "toStoreId":2, "items":[{"productId":1, "quantity":5}]}`
- 无变更

### F-023~F-024 — 盘点管理

- 无变更

---

## 阶段 4：销售·报损·仪表盘·报表·配置·日志 — 预估 2 周

### F-025 — 仪表盘统计卡片 ⚠️

- `GET /api/dashboard/summary` 返回 Map（key 蛇形）
- F-002 转驼峰后使用：`productCount`/`storeCount`/`warningCount`/`pendingPurchase`/`pendingTransfer`/`pendingStockCheck`/`pendingSale`
- ⚠️ 后端未返回今日金额字段，缺失卡片显示 0

### F-026 — 待处理提醒

- 各模块 list(status=0) + `/api/inventory/warning`

### F-027 — 进货趋势图 ⚠️

- 后端返回**占位数据**（数值全 0），前端先渲染 UI 骨架

### F-028~F-033 — 销售/报损

- 无变更

### F-034 — 库存流水

- `GET /api/inventory-log/list`

### F-035 — 数据报表 `/reports` ⚠️

- ⚠️ 后端 4 个报表 API 均不存在
- **改为前端聚合**：从 list 接口拉数据后用 JS 计算汇总

### F-036 — Excel 导出 ⚠️

- ⚠️ 改为前端 SheetJS 生成，不依赖后端

### F-037 — 系统配置 `/settings`

- `GET /api/settings` · `PUT /api/settings`（key-value map）
- 无变更

### F-038 — TagList 组件

- 无变更

### F-039 — 操作日志 `/logs` ⚠️

- ⚠️ 后端无 `/api/log/list`，先做占位页

### F-040 — 响应式适配

- 无变更

---

## 阶段 5：联调与测试 — 预估 1 周

### F-041 — 后端接口联调 ⚠️

- ⚠️ 重点验证 F-002 蛇形转换覆盖率
- 枚举值对齐（status/roleId/changeType 见附录D）
- 错误码覆盖（附录C）
- ⚠️ 验证 F-015 无手动调库存、F-035 前端聚合、F-039 占位

### F-042 — 权限联调验证 ⚠️

- ⚠️ 后端未做 Controller 层拦截，前端自行控制
- 直接输 URL 后端不会拒绝

### F-043 — 端到端流程测试

- 4 条流程

---

## 变更摘要

| 类别 | 项 | 说明 |
|------|:--:|------|
| 字段名 | 1 | 所有响应蛇形，F-002 自动转驼峰 |
| 路由修正 | 6 | PUT 接口加 `/{id}` |
| 缺失替代 | 4 | 报表前端聚合；日志占位；调库存移除；当前用户 JWT 解码 |
| 参数不支持 | 2 | 库存搜索/进货单 productId → 前端过滤或移除 |
| 删除功能 | 1 | 手动调库存按钮 |
| 数据不完整 | 2 | 仪表盘缺金额；趋势图占位 |
| 新增依赖 | 2 | lodash + jwt-decode |
