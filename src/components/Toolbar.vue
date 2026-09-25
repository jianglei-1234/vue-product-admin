<script setup>
// ============================================================
// Toolbar 组件：搜索 + 分类筛选 + 批量删除 + 新增 + 排序
// 所有操作直接调 store 的 action（不再需要手动同步 DOM）
// ============================================================

//导入ref 和 watch, 创建响应式数据和监听数据变化
import { ref, watch } from 'vue'
import { useProductStore } from '../stores/product'
import { storeToRefs } from 'pinia'

//创建store 实例, 后面所有数据和方法都通过这个store调用
const store = useProductStore()

// 获取 store 的响应式数据(已选id, 当前分类, 排序方向)
const {
    selectedIds, selectedCategory, sortDir,
} = storeToRefs(store)

// 防抖：用户输入停顿 500ms 才真的搜索（避免每打一个字母就重算）

//定义本地搜索框的值
const localSearch = ref('')
let searchTimer = null

watch(localSearch, (val) => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
        store.setSearchKeyword(val)
    }, 500)
})
</script>

<template>
  <!-- 外层容器 , 用于包裹顶部工具栏 -->
  <div class="toolbar">
    <!-- 左半边：搜索框 + 分类下拉 -->
    <div class="toolbar-left">
      <!-- v-model 绑定 localSearch, 输入内容同步到localSearch变量 -->
      <input
        v-model="localSearch"
        type="text"
        class="input"
        placeholder="搜索商品名称…"
      >
      <!--【2026-09-17 修改】去掉 as 类型断言：JS 项目模板不支持 TS 语法 -->
      <select
        v-model="selectedCategory"
        class="input"
        @change="store.setCategory($event.target.value)"
      >
        <option value="">全部分类</option>
        <option value="电子产品">电子产品</option>
        <option value="服装">服装</option>
        <option value="家居">家居</option>
        <option value="食品">食品</option>
      </select>
    </div>

    <!-- 右半边：批量删除 + 新增 + 排序 -->
    <div class="toolbar-right">
      <button
        class="btn-danger"
        :disabled="selectedIds.length === 0"
        @click="store.openDeleteBatch()"
      >
        批量删除{{ selectedIds.length > 0 ? `(${selectedIds.length})` : '' }}
      </button>
      <button class="btn-primary" @click="store.openAddModal()">
        + 新增商品
      </button>
      <select
        :value="sortDir"
        class="input"
        @change="store.setSortDir($event.target.value)"
      >
        <option value="asc">升序</option>
        <option value="desc">降序</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}
.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 10px;
}
</style>