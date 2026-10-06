<script setup>
// ============================================================
// ProductTable 组件：商品表格 + 分页条
// v-for 渲染（替代原生版 innerHTML 拼字符串）
// 全选三态由 store.checkAllState 派生
// ============================================================
import { useProductStore } from '../stores/product'
import { storeToRefs } from 'pinia'

const store = useProductStore()
const {
    pagedProducts, totalPages, currentPage,
    selectedIds, checkAllState, pageIds,
} = storeToRefs(store)

// 库存状态色（新增）：三档分级，返回对应的 css 类名
//   < 10  → 红色（快要卖完了，紧急）
//   < 50  → 橙色（偏低，提醒补货）
//   >= 50 → 正常颜色（不加类名）
function stockClass(stock) {
    if (stock < 10) return 'stock-danger'
    if (stock < 50) return 'stock-warning'
    return ''
}
</script>

<template>
  <div class="table-wrap">
    <table class="product-table">
      <thead>
        <tr>
          <!-- 全选框三态：none=空，all=实心√，partial=横杠 -->
          <th>
            <input
              type="checkbox"
              :checked="checkAllState === 'all'"
              :indeterminate="checkAllState === 'partial'"
              @change="store.toggleCheckAll()"
            >
          </th>
          <th>商品名称</th>
          <th>分类</th>
          <th>价格</th>
          <th>库存（件）</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <!-- 空数据状态（新增）：图标 + 引导文案，代替干巴巴的"暂无数据" -->
        <tr v-if="pagedProducts.length === 0">
          <td colspan="7" class="empty">
            <div class="empty-icon">📭</div>
            <div class="empty-text">没有找到商品，试试调整筛选</div>
          </td>
        </tr>

        <!-- v-for 渲染每一行（Vue 自动转义插值，天然防 XSS） -->
        <tr
          v-for="product in pagedProducts"
          :key="product.id"
        >
          <td>
            <input
              type="checkbox"
              :checked="selectedIds.includes(product.id)"
              @change="store.toggleSelect(product.id)"
            >
          </td>
          <td>{{ product.name }}</td>
          <td>{{ product.category }}</td>
          <!-- 价格格式化（新增）：store.formatPrice 输出 ¥1,299.00 样式 -->
          <td class="num">{{ store.formatPrice(product.price) }}</td>
          <!-- 库存三档色（新增）：红 / 橙 / 正常 -->
          <td class="num">
            <span :class="stockClass(product.stock)">{{ product.stock }}</span>
          </td>
          <td>
            <span :class="product.status === '上架中' ? 'tag-online' : 'tag-offline'">
              {{ product.status }}
            </span>
          </td>
          <td>
            <a class="link" @click="store.openEditModal(product.id)">编辑</a>
            <a class="link link-del" @click="store.openDeleteSingle(product.id)">删除</a>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 分页条 -->
    <div class="page-bar">
      <button
        class="btn-default"
        :disabled="currentPage === 1"
        @click="store.goToPage(currentPage - 1)"
      >上一页</button>
      <span class="page-info">{{ currentPage }}/{{ totalPages }}页</span>
      <button
        class="btn-default"
        :disabled="currentPage === totalPages"
        @click="store.goToPage(currentPage + 1)"
      >下一页</button>
    </div>
  </div>
</template>

<style scoped>
/* ===== 卡片包裹（新增）：表格整体包进白底圆角卡片，不再直接贴在灰背景上 ===== */
.table-wrap {
  background: var(--bg-card);
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .06);
  overflow: hidden;       /* 关键：裁掉表格的直角，圆角才能生效 */
  padding-bottom: 16px;   /* 给底部分页条留出呼吸空间 */
}

.product-table {
  width: 100%;
  background: var(--bg-card);   /* 原来写死 #fff，改用变量以适配暗黑主题 */
  border-collapse: collapse;
}
.product-table th,
.product-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);   /* 原来写死 #e5e7eb */
}
.product-table th {
  background: var(--gray-50);    /* 原来写死 #f8fafc */
  color: var(--text-sub);        /* 原来写死 #475569 */
  font-size: 13px;
}
.tag-online,
.tag-offline {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
}
.tag-online {
  color: #16a34a;
  background: #dcfce7;
}
.tag-offline {
  color: #dc2626;
  background: #fee2e2;
}

/* ===== 库存三档色（新增）：替代原来单一的红色列 ===== */
.stock-danger {
  color: var(--danger);
  font-weight: bold;
}
.stock-warning {
  color: var(--warning);
  font-weight: bold;
}

/* ===== 表格行：悬停 + 斑马纹 ===== */
.product-table tbody tr {
  transition: background .15s;
}
.product-table tbody tr:hover {
  background: var(--gray-50);
}
.product-table tbody tr:nth-child(even) {
  background: var(--row-even);   /* 原来写死 #fafbfc，斑马纹改成变量 */
}
.product-table tbody tr:nth-child(even):hover {
  background: var(--gray-50);
}

/* ===== 操作列链接 ===== */
.product-table td a {
  color: var(--primary);          /* 原来写死 #3b82f6 */
  text-decoration: none;
  font-size: 13px;
  margin-right: 10px;
  cursor: pointer;
}
.product-table td a:hover {
  text-decoration: underline;
}
.product-table td a:last-child {
  color: var(--danger);           /* 原来写死 #dc2626 */
  margin-right: 0;
}

/* ===== 分页条 ===== */
.page-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 0 12px;
}

.page-bar button {
  height: 32px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 14px;
  cursor: pointer;
  transition: background .2s;
}

.page-bar button:hover:not(:disabled) {
  background: var(--gray-50);
}

.page-bar button:disabled {
  color: #9ca3af;
  background: var(--gray-50);     /* 原来写死 #f3f4f6，改用变量以适配暗黑主题 */
  cursor: not-allowed;
}

.page-bar span {
  font-size: 14px;
  color: var(--text-main);
}

/* ===== 空数据提示（新增）===== */
.empty {
  text-align: center;
  color: var(--text-sub);
  padding: 48px 20px !important;
}
.empty-icon {
  font-size: 40px;       /* 大图标 */
  margin-bottom: 10px;
}
.empty-text {
  font-size: 14px;
}
</style>
