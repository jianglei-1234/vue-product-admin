# 电商商品管理系统（Vue3 版）

基于 Vue 3 全家桶实现的商品后台管理系统，包含**商品管理**与**数据看板**两大模块。

该项目同时有原生 JavaScript 实现版本（project_5），本仓库是用 Vue3 + Pinia 重构后的版本，用于对比组件化开发与手动 DOM 操作的差异。

## 功能清单

### 商品管理
- 新增 / 编辑 / 删除商品（弹窗表单，含基础校验）
- 关键字搜索（输入停顿 500ms 防抖，避免每次输入都重算）
- 分类筛选（电子产品 / 服装 / 家居 / 食品）
- 价格升降序排序（浅拷贝后排序，不污染原数组）
- 分页浏览（每页 10 条，页码越界自动纠正）
- 批量删除（全选框三态：全选 / 半选 / 未选）
- 数据本地持久化（localStorage，刷新不丢失）

### 数据看板
- 统计卡片：商品总数 / 上架数 / 下架数 / 总库存
- ECharts 柱状图：各分类库存统计
- ECharts 饼图：各分类库存占比

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Vue 3（组合式 API，`<script setup>`） |
| 状态管理 | Pinia（组合式 store 写法） |
| 路由 | Vue Router（2 个路由页面） |
| 图表 | ECharts 6 |
| 构建工具 | Vite 8 |

## 目录结构

```
src/
├── components/                 可复用组件
│   ├── Charts.vue              ECharts 图表（柱状图 + 饼图）
│   ├── DeleteConfirm.vue       删除确认弹窗
│   ├── ProductModal.vue        新增 / 编辑商品弹窗
│   ├── ProductTable.vue        商品表格（含全选三态）
│   ├── StatsCards.vue          统计卡片
│   └── Toolbar.vue             搜索 / 筛选 / 排序工具栏
├── views/                      页面级组件
│   ├── DashboardView.vue       数据看板页
│   └── ProductView.vue         商品管理页
├── stores/
│   └── product.js              Pinia store（state / getters / actions）
├── router/
│   └── index.js                路由配置
├── assets/
│   └── main.css                全局样式
├── App.vue                     根组件（含顶部导航）
└── main.js                     应用入口
```

## 快速开始

```sh
# 安装依赖
npm install

# 开发模式（默认 http://localhost:5173）
npm run dev

# 生产构建，产物输出到 dist/
npm run build

# 本地预览构建产物
npm run preview
```

## 实现要点

**状态管理**
Pinia 组合式写法统一收口所有 state / getters / actions，组件内不再手动同步 DOM。筛选、排序、分页、统计等 9 项派生数据全部用 `computed` 缓存，依赖不变不重算。

**搜索防抖**
用 `watch` + `setTimeout` 手动实现 500ms 防抖（未引入 lodash），用户停止输入后才触发筛选。

**全选三态**
把「当前页 id 列表」与「已选中 id 列表」比较：0 个选中 → 未选，等于当前页数量 → 全选，其余 → 半选（`indeterminate`）。

**数据持久化**
`watch` 深度监听 `products`，任何字段变更自动序列化写入 localStorage；初始化时读取并做 `try/catch` 容错，数据损坏则回退默认值。

**ECharts 生命周期**
`onMounted` 初始化实例 → `watch` 监听数据变化自动重绘 → `onUnmounted` 调用 `dispose()` 释放实例，避免内存泄漏与重复初始化。

## 已知优化点

- 生产包体积约 1.2MB（gzip 416KB），主要来自 ECharts 全量引入，可改为按需引入进一步优化
- 数据目前存于前端 localStorage，可替换为真实后端接口

## License

MIT
