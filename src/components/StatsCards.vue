<script setup>
// ============================================================
// StatsCards 组件：4 张统计卡片（总商品/上架/下架/总库存）
// 数据来源：Pinia store 的 stats getter（自动响应式）
// ============================================================
import { useProductStore } from '../stores/product'
import { storeToRefs } from 'pinia'

const store = useProductStore()
const { stats } = storeToRefs(store)

// 4 张卡片配置（颜色 + 图标 + label + 数据键名）
const cards = [
    { key: 'total',  cls: 'blue',   icon: '📦', label: '总商品数' },
    { key: 'online', cls: 'green',  icon: '✅', label: '上架中' },
    { key: 'offline',cls: 'orange', icon: '⛔', label: '已下架' },
    { key: 'stock',  cls: 'purple', icon: '📊', label: '总库存（件）' },
]
</script>

<template>
  <div class="stats-row">
    <div
      v-for="card in cards"
      :key="card.key"
      class="stat-card"
      :class="card.cls"
    >
      <div class="stat-info">
        <div class="stat-num">{{ stats[card.key] }}</div>
        <div class="stat-label">{{ card.label }}</div>
      </div>
      <div class="stat-icon">{{ card.icon }}</div>
    </div>
  </div>
</template>

<style scoped>
/* 一行四个等宽卡片（Grid 4 列均分） */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  background: var(--bg-card);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .06);
  border-top: 3px solid transparent;
  transition: transform .2s, box-shadow .2s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, .1);
}

.stat-num {
  font-size: 28px;
  font-weight: bold;
  color: var(--text-main);
  font-variant-numeric: tabular-nums;  /* 等宽数字 */
}
.stat-label {
  font-size: 13px;
  color: var(--text-sub);
  margin-top: 4px;
}

.stat-icon {
  font-size: 28px;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 4 种配色变体（顶部彩条 + 图标底色） */
.stat-card.blue   { border-top-color: var(--primary); }
.stat-card.blue   .stat-icon { background: var(--tint-blue); }
.stat-card.green  { border-top-color: var(--success); }
.stat-card.green  .stat-icon { background: var(--success-bg); }
.stat-card.orange { border-top-color: var(--warning); }
.stat-card.orange .stat-icon { background: var(--tint-orange); }
.stat-card.purple { border-top-color: var(--purple); }
.stat-card.purple .stat-icon { background: var(--tint-purple); }
</style>