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
          <th>价格（元）</th>
          <th>库存（件）</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <!-- 空数据状态 -->
        <tr v-if="pagedProducts.length === 0">
          <td colspan="7" class="empty">暂无数据</td>
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
          <td class="num">{{ product.price }}</td>
          <td class="num">{{ product.stock }}</td>
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
.product-table {
  width: 100%;
  background: #fff;
  border-collapse: collapse;
}
.product-table th,
.product-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}
.product-table th {
  background: #f8fafc;
  color: #475569;
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
.stock-low {
  color: red;
}

/* ===== 表格行：悬停 + 斑马纹 ===== */
.product-table tbody tr {
  transition: background .15s;
}
.product-table tbody tr:hover {
  background: #f8fafc;
}
.product-table tbody tr:nth-child(even) {
  background: #fafbfc;
}
.product-table tbody tr:nth-child(even):hover {
  background: #f8fafc;
}

/* ===== 操作列链接 ===== */
.product-table td a {
  color: #3b82f6;
  text-decoration: none;
  font-size: 13px;
  margin-right: 10px;
  cursor: pointer;
}
.product-table td a:hover {
  text-decoration: underline;
}
.product-table td a:last-child {
  color: #dc2626;
  margin-right: 0;
}

/* ===== 分页条 ===== */
.page-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.page-bar button {
  height: 32px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  color: #1e293b;
  font-size: 14px;
  cursor: pointer;
  transition: background .2s;
}

.page-bar button:hover:not(:disabled) {
  background: #f8fafc;
}

.page-bar button:disabled {
  color: #9ca3af;
  background: #f3f4f6;
  cursor: not-allowed;
}

.page-bar span {
  font-size: 14px;
  color: #1e293b;
}

/* ===== 空数据提示（备用）===== */
.empty {
  text-align: center;
  color: #94a3b8;
  padding: 40px !important;
}
</style>