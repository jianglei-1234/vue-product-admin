<script setup>
// ============================================================
// ProductView：商品管理页
// 组装：StatsCards + Toolbar + ProductTable + 弹窗
// ============================================================
import StatsCards from '../components/StatsCards.vue'
import Toolbar from '../components/Toolbar.vue'
import ProductTable from '../components/ProductTable.vue'
import ProductModal from '../components/ProductModal.vue'
import DeleteConfirm from '../components/DeleteConfirm.vue'
</script>

<template>
  <div class="product-view">
    <StatsCards />
    <Toolbar />
    <ProductTable />

    <!-- 弹窗挂在这里（全局浮层，不属于任何具体业务区） -->
    <ProductModal />
    <DeleteConfirm />
  </div>
</template>

<style scoped>
.product-view {
  display: flex;
  flex-direction: column;
}
</style>