<script setup>
// ============================================================
// DashboardView：数据看板页
// 组装：StatsCards + Charts（只看不操作）
// ============================================================
import StatsCards from '../components/StatsCards.vue'
import Charts from '../components/Charts.vue'
</script>

<template>
  <div class="dashboard-view">
    <StatsCards />
    <Charts />
  </div>
</template>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
}
</style>